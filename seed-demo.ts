
import dotenv from "dotenv";
dotenv.config();
import { storage } from "./server/storage";
import { scrypt, randomBytes } from "crypto";
import { promisify } from "util";

const scryptAsync = promisify(scrypt);

async function hashPassword(password: string) {
    const salt = randomBytes(16).toString("hex");
    const buf = (await scryptAsync(password, salt, 64)) as Buffer;
    return `${buf.toString("hex")}.${salt}`;
}

async function seedDemoUser() {
    try {
        console.log("Seeding demo user...");
        const hashedPassword = await hashPassword("demo123");
        await storage.createUser({
            username: "demo",
            password: hashedPassword,
            firebaseUid: "demo-uid",
            phoneNumber: "+919999999999"
        } as any);
        console.log("User 'demo' created successfully");
        process.exit(0);
    } catch (err) {
        console.error("Error creating demo user:", err);
        process.exit(1);
    }
}

seedDemoUser();
