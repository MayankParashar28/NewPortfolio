import dotenv from "dotenv";
dotenv.config();

import { Pool, neonConfig, neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import ws from "ws";
import * as schema from "../shared/schema";

neonConfig.webSocketConstructor = ws;

if (!process.env.DATABASE_URL) {
    throw new Error(
        "DATABASE_URL must be set. Did you forget to provision a database?",
    );
}

// Keep pool exported for production PgStore session storage
export const pool = new Pool({ connectionString: process.env.DATABASE_URL });

// Use Neon HTTP connection for fast, non-blocking queries
const sql = neon(process.env.DATABASE_URL);
export const db = drizzle(sql, { schema });


