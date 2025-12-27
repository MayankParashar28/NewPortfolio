import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { Express } from "express";
import session from "express-session";
import { scrypt, randomBytes, timingSafeEqual } from "crypto";
import { promisify } from "util";
import { storage } from "./storage";
import { verifyIdToken } from "./firebase";
import { User } from "@shared/schema";

const scryptAsync = promisify(scrypt);

async function hashPassword(password: string) {
    const salt = randomBytes(16).toString("hex");
    const buf = (await scryptAsync(password, salt, 64)) as Buffer;
    return `${buf.toString("hex")}.${salt}`;
}

async function comparePasswords(supplied: string, stored: string) {
    const [hashed, salt] = stored.split(".");
    const hashedBuf = Buffer.from(hashed, "hex");
    const suppliedBuf = (await scryptAsync(supplied, salt, 64)) as Buffer;
    return timingSafeEqual(hashedBuf, suppliedBuf);
}

export function setupAuth(app: Express) {
    const sessionSettings: session.SessionOptions = {
        secret: process.env.SESSION_SECRET || "r8q/+&1LM3)Cd*zAGpx1XM{NeQhc;#",
        resave: false,
        saveUninitialized: false,
        store: undefined, // MemoryStore by default, perfect for this scale
        cookie: {
            secure: app.get("env") === "production",
        }
    };

    if (app.get("env") === "production") {
        app.set("trust proxy", 1);
    }

    app.use(session(sessionSettings));
    app.use(passport.initialize());
    app.use(passport.session());

    passport.use(
        // we use "username" specifically, so we don't need to specify options
        new LocalStrategy(async (username, password, done) => {
            const user = await storage.getUserByUsername(username);
            // If user has no password (e.g. phone auth only), deny local login
            if (!user || !user.password || !(await comparePasswords(password, user.password))) {
                return done(null, false);
            } else {
                return done(null, user);
            }
        }),
    );

    passport.serializeUser((user, done) => done(null, (user as User).id));
    passport.deserializeUser(async (id, done) => {
        const user = await storage.getUser(id as number);
        done(null, user);
    });

    app.post("/api/register", async (req, res, next) => {
        try {
            const existingUser = await storage.getUserByUsername(req.body.username);
            if (existingUser) {
                return res.status(400).send("Username already exists");
            }

            const hashedPassword = await hashPassword(req.body.password);
            const user = await storage.createUser({
                ...req.body,
                password: hashedPassword,
            });

            req.login(user, (err) => {
                if (err) return next(err);
                res.status(201).json(user);
            });
        } catch (err) {
            next(err);
        }
    });

    app.post("/api/login", passport.authenticate("local"), (req, res) => {
        res.status(200).json(req.user);
    });

    app.post("/api/login/firebase", async (req, res, next) => {
        try {
            const { idToken } = req.body;
            const decodedToken = await verifyIdToken(idToken);

            if (!decodedToken) {
                return res.status(401).send("Invalid Firebase Token");
            }

            const firebaseUid = decodedToken.uid;
            const phoneNumber = decodedToken.phone_number;

            let user = await storage.getUserByFirebaseUid(firebaseUid);

            if (!user) {
                // Determine a username. Phone numbers can be usernames if we strip special chars
                // or we use a placeholder.
                const generatedUsername = phoneNumber || `user_${firebaseUid.substring(0, 8)}`;

                // Check if a user with this username already exists (e.g. from previous partial flow or manual seed)
                // This prevents "duplicate key value violates unique constraint"
                const existingUserByUsername = await storage.getUserByUsername(generatedUsername);

                if (existingUserByUsername) {
                    // If user exists by username but didn't have firebaseUid set (or we missed it), update it or just log them in
                    // For safety/simplicity, we return this user. 
                    // Ideally we should link the firebaseUid to this user if missing.
                    user = existingUserByUsername;

                    // Optional: Backfill firebaseUid if it's missing (requires storage update method, skipping for now to be safe)
                } else {
                    user = await storage.createUser({
                        username: generatedUsername,
                        password: "", // No password for phone users
                        firebaseUid,
                        phoneNumber,
                    } as any);
                }
            }

            req.login(user, (err) => {
                if (err) return next(err);
                res.status(200).json(user);
            });
        } catch (err) {
            next(err);
        }
    });

    app.post("/api/logout", (req, res, next) => {
        req.logout((err) => {
            if (err) return next(err);
            res.sendStatus(200);
        });
    });

    app.get("/api/user", (req, res) => {
        if (!req.isAuthenticated()) return res.sendStatus(401);
        res.json(req.user);
    });
}
