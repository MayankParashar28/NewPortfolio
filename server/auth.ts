import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { Express } from "express";
import session from "express-session";
import { randomBytes, createHash, timingSafeEqual } from "crypto";

import connectPgSimple from "connect-pg-simple";
import memoryStore from "memorystore";
import { pool } from "./db";
import { throttle } from "./security";

// This is a single-owner portfolio, so the admin credentials live in the
// environment rather than in the database. To change them, edit the Vercel
// environment variables and redeploy — no migration, no script, no DB access.
export type AdminUser = { id: number; username: string };

const ADMIN_ID = 1;

// Compares via fixed-length digests so the comparison is constant time and
// does not leak the length of the expected value.
function constantTimeEquals(a: string, b: string) {
    const ah = createHash("sha256").update(a).digest();
    const bh = createHash("sha256").update(b).digest();
    return timingSafeEqual(ah, bh);
}

export function setupAuth(app: Express) {
    const isProduction = app.get("env") === "production";

    const adminUsername = process.env.ADMIN_USERNAME;
    const adminPassword = process.env.ADMIN_PASSWORD;
    const credentialsConfigured = Boolean(adminUsername && adminPassword);

    if (!credentialsConfigured) {
        if (isProduction) {
            throw new Error(
                "ADMIN_USERNAME and ADMIN_PASSWORD must both be set in production.",
            );
        }
        console.warn(
            "[auth] ADMIN_USERNAME/ADMIN_PASSWORD are not set; admin login is disabled.",
        );
    }

    let sessionStore;
    if (isProduction) {
        const PgStore = connectPgSimple(session);
        sessionStore = new PgStore({
            pool,
            createTableIfMissing: true,
        });
    } else {
        const MemoryStore = memoryStore(session);
        sessionStore = new MemoryStore({
            checkPeriod: 86400000 // prune expired entries every 24h
        });
    }

    // No hardcoded fallback: a secret committed to the repo lets anyone forge
    // a session cookie. Production must supply one; dev gets an ephemeral one.
    if (!process.env.SESSION_SECRET) {
        if (isProduction) {
            throw new Error(
                "SESSION_SECRET must be set in production. Generate one with: openssl rand -hex 32",
            );
        }
        console.warn(
            "[auth] SESSION_SECRET is not set; using an ephemeral dev secret. Sessions reset on restart.",
        );
    }
    const secret = process.env.SESSION_SECRET || randomBytes(32).toString("hex");

    const sessionSettings: session.SessionOptions = {
        secret,
        resave: false,
        saveUninitialized: false,
        store: sessionStore,
        cookie: {
            httpOnly: true,
            sameSite: "lax",
            secure: isProduction,
            maxAge: 1000 * 60 * 60 * 12, // 12 hours
        }
    };

    if (isProduction) {
        app.set("trust proxy", 1);
    }

    app.use(session(sessionSettings));
    app.use(passport.initialize());
    app.use(passport.session());

    passport.use(
        new LocalStrategy((username, password, done) => {
            if (!adminUsername || !adminPassword) return done(null, false);

            // Both comparisons always run. With && the password check was
            // skipped whenever the username was wrong, so the two failures
            // took measurably different time and that difference told an
            // attacker when they had found the right username.
            const userOk = constantTimeEquals(username, adminUsername);
            const passOk = constantTimeEquals(password, adminPassword);

            const ok = userOk && passOk;
            return done(null, ok ? { id: ADMIN_ID, username: adminUsername } : false);
        }),
    );

    passport.serializeUser((user, done) => done(null, (user as AdminUser).username));

    // Re-checked against the environment on every request, so changing
    // ADMIN_USERNAME invalidates any session issued for the old one.
    passport.deserializeUser<string>((username, done) => {
        if (adminUsername && username === adminUsername) {
            return done(null, { id: ADMIN_ID, username: adminUsername });
        }
        return done(null, false);
    });

    // There is deliberately no registration route: the only account is the one
    // defined by ADMIN_USERNAME / ADMIN_PASSWORD.

    // Only a rejected sign-in counts against the limit, so a successful
    // login clears the tally rather than adding to it.
    const loginThrottle = throttle({
        maxFailures: 8,
        minResponseMs: 400,
        countOnly: (status) => status === 401,
    });

    app.post("/api/login", loginThrottle, passport.authenticate("local"), (req, res) => {
        res.status(200).json(req.user);
    });

    app.post("/api/logout", (req, res, next) => {
        req.logout((err) => {
            if (err) return next(err);
            req.session.destroy(() => {
                res.clearCookie("connect.sid");
                res.sendStatus(200);
            });
        });
    });

    app.get("/api/user", (req, res) => {
        if (!req.isAuthenticated()) return res.sendStatus(401);
        res.json(req.user);
    });
}
