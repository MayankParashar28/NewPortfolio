
import { GoogleGenerativeAI } from "@google/generative-ai";
import * as dotenv from "dotenv";
import fs from "fs";
import path from "path";

// Load env safely
const envPath = path.resolve(process.cwd(), '.env');
const envConfig = dotenv.parse(fs.readFileSync(envPath));
const apiKey = envConfig.GEMINI_API_KEY;

if (!apiKey) {
    console.error("No API Key found");
    process.exit(1);
}

const genAI = new GoogleGenerativeAI(apiKey);

const candidates = [
    "gemini-1.5-flash",
    "gemini-1.5-flash-001",
    "gemini-1.5-flash-002",
    "gemini-1.5-flash-8b",
    "gemini-1.5-pro",
    "gemini-1.5-pro-001",
    "gemini-1.5-pro-002",
    "gemini-2.0-flash-exp",
    "gemini-2.5-flash",
    "gemini-1.5-flash-8b",
    "gemini-pro",
    "gemini-1.0-pro"
];

async function check() {
    console.log("Checking models...");
    for (const modelName of candidates) {
        process.stdout.write(`Testing ${modelName.padEnd(25)} ... `);
        try {
            const model = genAI.getGenerativeModel({ model: modelName });
            const result = await model.generateContent("Hello, are you there?");
            const response = await result.response;
            const text = response.text();
            if (text) {
                console.log("✅ WORKING");
            } else {
                console.log("❌ EMPTY RESPONSE");
            }
        } catch (error: any) {
            let msg = error.message;
            if (msg.includes("404")) msg = "404 Not Found";
            else if (msg.includes("429")) msg = "429 Rate Limit";
            else if (msg.includes("403")) msg = "403 Forbidden";
            else msg = msg.split('\n')[0].substring(0, 50); // truncated
            console.log(`❌ FAILED: ${msg}`);
        }
    }
}

check();
