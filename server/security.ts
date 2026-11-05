import type { Express, Request, Response, NextFunction } from "express";

// Written by hand rather than pulled in from helmet / express-rate-limit so
// that hardening does not depend on adding dependencies to this project.

/**
 * Headers that cost nothing and break nothing.
 *
 * A full Content-Security-Policy is deliberately not set here: this app loads
 * an inline analytics snippet and injects styles at runtime from framer-motion
 * and the 3D canvas, so a strict policy needs to be worked out against the
 * real page rather than guessed at. frame-ancestors is the exception -- it
 * only governs who may frame the site, so it is safe on its own, and it is
 * what actually protects the admin panel from being clickjacked.
 */
export function securityHeaders(app: Express) {
    app.use((_req: Request, res: Response, next: NextFunction) => {
        res.setHeader("X-Content-Type-Options", "nosniff");
        res.setHeader("Referrer-Policy", "strict-origin-when-cross-origin");
        res.setHeader("X-Frame-Options", "DENY");
        res.setHeader("Content-Security-Policy", "frame-ancestors 'none'");
        res.setHeader(
            "Permissions-Policy",
            "camera=(), microphone=(), geolocation=(), payment=(), usb=()",
        );
        next();
    });
}

type Bucket = { count: number; windowStart: number; blockedUntil: number };

const WINDOW_MS = 15 * 60 * 1000;
const BLOCK_MS = 15 * 60 * 1000;
const MAX_ENTRIES = 5000;

/** Best-effort client address. Express sets this from X-Forwarded-For when
 *  trust proxy is on, which it is in production. */
function clientKey(req: Request) {
    return req.ip || req.socket.remoteAddress || "unknown";
}

function prune(buckets: Map<string, Bucket>, now: number) {
    for (const [key, b] of buckets) {
        if (b.blockedUntil < now && now - b.windowStart > WINDOW_MS) {
            buckets.delete(key);
        }
    }
    // A flood of distinct source addresses must not grow this without bound.
    if (buckets.size > MAX_ENTRIES) {
        const excess = buckets.size - MAX_ENTRIES;
        let i = 0;
        for (const key of buckets.keys()) {
            buckets.delete(key);
            if (++i >= excess) break;
        }
    }
}

/**
 * Throttles repeated failures on an endpoint.
 *
 * Honest about its limits: the counters live in the process, and this app runs
 * as a serverless function, so each warm instance keeps its own tally and a
 * determined attacker spreading requests across instances sees a higher
 * effective ceiling than `maxFailures`. It is a real cost increase and it stops
 * the ordinary case -- a script hammering one endpoint from one address -- but
 * it is defence in depth behind a strong password, not a substitute for one.
 * A hard, shared limit would need the counters in Postgres.
 *
 * `countOnly` decides which responses count as a failure, so a successful
 * login clears the bucket instead of filling it.
 */
export function throttle(opts: {
    maxFailures: number;
    minResponseMs?: number;
    countOnly?: (status: number) => boolean;
}) {
    const buckets = new Map<string, Bucket>();
    const isFailure = opts.countOnly ?? ((status: number) => status >= 400);

    return (req: Request, res: Response, next: NextFunction) => {
        const now = Date.now();
        const key = clientKey(req);
        prune(buckets, now);

        let bucket = buckets.get(key);
        if (bucket && bucket.blockedUntil > now) {
            const retryAfter = Math.ceil((bucket.blockedUntil - now) / 1000);
            res.setHeader("Retry-After", String(retryAfter));
            return res.status(429).json({
                message: `Too many attempts. Try again in ${Math.ceil(retryAfter / 60)} minute(s).`,
            });
        }

        if (!bucket || now - bucket.windowStart > WINDOW_MS) {
            bucket = { count: 0, windowStart: now, blockedUntil: 0 };
            buckets.set(key, bucket);
        }

        const started = now;
        res.on("finish", () => {
            const b = buckets.get(key);
            if (!b) return;
            if (isFailure(res.statusCode)) {
                b.count += 1;
                if (b.count >= opts.maxFailures) {
                    b.blockedUntil = Date.now() + BLOCK_MS;
                }
            } else {
                buckets.delete(key);
            }
        });

        // Floor the response time so guessing is slow and so the duration of a
        // rejection does not hint at how far it got.
        const floor = opts.minResponseMs ?? 0;
        if (floor <= 0) return next();

        const send = res.end.bind(res);
        (res as any).end = function patched(this: Response, ...args: any[]) {
            const remaining = floor - (Date.now() - started);
            if (remaining > 0) {
                setTimeout(() => send(...(args as [])), remaining);
            } else {
                send(...(args as []));
            }
            return this;
        };
        next();
    };
}
