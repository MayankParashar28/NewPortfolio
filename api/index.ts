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
        // A rejected promise must not be cached: if the first request on a cold
        // instance failed during setup, every later request on that instance
        // would replay the same failure until it recycled.
        setupPromise = setup().catch((error) => {
            setupPromise = null;
            throw error;
        });
    }

    await setupPromise;

    // Forward the request to the Express app
    app(req, res);
}
