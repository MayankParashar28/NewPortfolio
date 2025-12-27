
import { GoogleGenerativeAI } from "@google/generative-ai";
import * as dotenv from "dotenv";
dotenv.config();

async function listModels() {
    try {
        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" }); // arbitrary, just need client
        // Actually the SDK doesn't have a direct listModels method on the client instance easily exposed in all versions?
        // Wait, typical usage:
        // const genAI = new GoogleGenerativeAI(API_KEY);
        // But listing models usually requires fetching via REST if the SDK doesn't expose it handy.
        // However, let's try to assume the user might have 'gemini-2.0-flash-exp'.

        // Let's use a raw fetch to list models to be sure.
        const key = process.env.GEMINI_API_KEY;
        if (!key) {
            console.error("No API Key found");
            return;
        }
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${key}`);
        const data = await response.json();
        console.log("Available Models:");
        if (data.models) {
            data.models.forEach((m: any) => console.log(`- ${m.name} (${m.supportedGenerationMethods.join(', ')})`));
        } else {
            console.log(JSON.stringify(data, null, 2));
        }

    } catch (error) {
        console.error("Error listing models:", error);
    }
}

listModels();
