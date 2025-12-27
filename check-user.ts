
import dotenv from "dotenv";
dotenv.config();

import { storage } from "./server/storage";

async function checkUser() {
    try {
        const user = await storage.getUserByUsername("demo");
        if (user) {
            console.log("User 'demo' FOUND");
        } else {
            console.log("User 'demo' NOT found");
        }
        process.exit(0);
    } catch (err) {
        console.error("Error:", err);
        process.exit(1);
    }
}

checkUser();
