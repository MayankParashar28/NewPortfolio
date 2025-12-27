import "dotenv/config";
import { db } from "../server/db";
import { users } from "../shared/schema";
import { scrypt, randomBytes } from "crypto";
import { promisify } from "util";

const scryptAsync = promisify(scrypt);

async function hashPassword(password: string) {
    const salt = randomBytes(16).toString("hex");
    const buf = (await scryptAsync(password, salt, 64)) as Buffer;
    return `${buf.toString("hex")}.${salt}`;
}

async function main() {
    console.log("Creating admin user...");

    const username = "admin";
    const password = "admin123";

    try {
        const hashedPassword = await hashPassword(password);

        // Check if user exists
        const existing = await db.query.users.findFirst({
            where: (users, { eq }) => eq(users.username, username)
        });

        if (existing) {
            console.log(`User '${username}' already exists.`);
            process.exit(0);
        }

        await db.insert(users).values({
            username,
            password: hashedPassword,
        });

        console.log("Admin user created successfully!");
        console.log(`Username: ${username}`);
        console.log(`Password: ${password}`);
        process.exit(0);
    } catch (error) {
        console.error("Error creating admin user:", error);
        process.exit(1);
    }
}

main();
