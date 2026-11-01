import { app, registerErrorHandler } from "../server/app";
import { registerRoutes } from "../server/routes";

// Cache the setup to prevent re-registration on every request
let setupPromise: Promise<any> | null = null;

async function setup() {
    // We pass the app to register routes, but we don't need the returned http
    // server, so we can ignore the return value.
    await registerRoutes(app);

    // Must come after the routes: Express uses the last-registered error
    // handler. Without this, the Vercel path falls back to Express's default
    // handler, which is not the one we control.
    registerErrorHandler(app);
}

export default async function handler(req: any, res: any) {
    if (!setupPromise) {
        setupPromise = setup();
    }

    await setupPromise;

    // Forward the request to the Express app
    app(req, res);
}
