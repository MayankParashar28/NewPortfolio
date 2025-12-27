
import * as dotenv from "dotenv";
import fs from 'fs';
import path from 'path';
import https from 'https';

// Load env directly to avoid path issues
const envPath = path.resolve(process.cwd(), '.env');
const envConfig = dotenv.parse(fs.readFileSync(envPath));
const apiKey = envConfig.GEMINI_API_KEY;

if (!apiKey) {
    console.error("CRITICAL: GEMINI_API_KEY not found in .env");
    process.exit(1);
}

console.log(`Using API Key: ${apiKey.substring(0, 5)}...`);

const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`;

https.get(url, (res) => {
    let data = '';
    res.on('data', (chunk) => data += chunk);
    res.on('end', () => {
        try {
            const json = JSON.parse(data);
            if (json.error) {
                console.error("API Error:", json.error);
            } else if (json.models) {
                console.log("--- Available Models ---");
                json.models.forEach((m: any) => {
                    console.log(`Name: ${m.name}`);
                    console.log(`Methods: ${m.supportedGenerationMethods}`);
                    console.log('---');
                });
            } else {
                console.log("Unexpected response:", json);
            }
        } catch (e) {
            console.error("Parse error:", e);
            console.log("Raw body:", data);
        }
    });
}).on('error', (err) => {
    console.error("Network error:", err);
});
