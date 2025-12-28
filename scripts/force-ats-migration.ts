
import { db } from "../server/db";
import { sql } from "drizzle-orm";

async function main() {
    console.log("Forcing migration for ATS columns...");
    try {
        await db.execute(sql`ALTER TABLE profile ADD COLUMN IF NOT EXISTS ats_score INTEGER`);
        console.log("Added ats_score");
        await db.execute(sql`ALTER TABLE profile ADD COLUMN IF NOT EXISTS ats_feedback JSONB`);
        console.log("Added ats_feedback");
        console.log("Migration successful!");
    } catch (error) {
        console.error("Migration failed:", error);
    }
    process.exit(0);
}

main();
