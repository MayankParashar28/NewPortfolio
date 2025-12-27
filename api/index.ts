import { app } from "../server/app";
import { registerRoutes } from "../server/routes";

// Cache the setup to prevent re-registration on every request
let setupPromise: Promise<any> | null = null;

export default async function handler(req: any, res: any) {
    if (!setupPromise) {
        // We pass the app to register routes, but we don't need the returned http server
        // so we can ignore the return value.
        setupPromise = registerRoutes(app);
    }

    await setupPromise;

    // Forward the request to the Express app
    app(req, res);
}
