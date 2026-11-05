import { type Server } from "node:http";

import express, {
  type Express,
  type Request,
  Response,
  NextFunction,
} from "express";

import { registerRoutes } from "./routes";
import { securityHeaders } from "./security";

export function log(message: string, source = "express") {
  const formattedTime = new Date().toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  });

  console.log(`${formattedTime} [${source}] ${message}`);
}

export const app = express();

securityHeaders(app);

// The largest legitimate body is an image upload: blob.ts caps the decoded
// file at 5 MB, which is about 6.7 MB once base64-encoded, so 8 MB covers it
// with room for the surrounding JSON. The old 50 MB limit applied to every
// route including unauthenticated ones, which meant anyone could make the
// server buffer 50 MB per request. The verify hook that kept a second copy of
// every body in req.rawBody is gone too -- nothing ever read it.
app.use(express.json({ limit: '8mb' }));
app.use(express.urlencoded({ extended: false, limit: '8mb' }));

app.use((req, res, next) => {
  log(`Received request: ${req.method} ${req.path}`);
  const start = Date.now();
  const path = req.path;

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path.startsWith("/api")) {
      // Status and timing only. This used to append the serialised response
      // body, so an authenticated /api/profile wrote a stored API key into the
      // platform logs, where it would sit for as long as logs are retained.
      log(`${req.method} ${path} ${res.statusCode} in ${duration}ms`);
    }
  });

  next();
});

export function registerErrorHandler(app: Express) {
  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    const status = err.status || err.statusCode || 500;

    // The full error goes to the server log. Stacks and raw error strings can
    // carry connection strings, keys and internal paths, so they never go to
    // the client; 4xx messages are meant for the caller, 5xx are not.
    log(`error ${status}: ${err?.stack || err}`, "error");

    if (res.headersSent) return;
    res
      .status(status)
      .json({ message: status < 500 ? err.message || "Request failed" : "Internal Server Error" });
  });
}

export default async function runApp(
  setup: (app: Express, server: Server) => Promise<void>,
) {
  const server = await registerRoutes(app);

  registerErrorHandler(app);

  // importantly run the final setup after setting up all the other routes so
  // the catch-all route doesn't interfere with the other routes
  await setup(app, server);

  // ALWAYS serve the app on the port specified in the environment variable PORT
  // Other ports are firewalled. Default to 5000 if not specified.
  // this serves both the API and the client.
  // It is the only port that is not firewalled.
  const port = parseInt(process.env.PORT || '3000', 10);
  server.listen({
    port,
    host: "127.0.0.1",
  }, () => {
    log(`serving on port ${port}`);
  });
}
