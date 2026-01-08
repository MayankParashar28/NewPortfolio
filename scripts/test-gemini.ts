
import { GoogleGenerativeAI } from "@google/generative-ai";
import * as dotenv from "dotenv";

dotenv.config();

async function testGeneration() {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");
    const modelName = "gemini-2.0-flash";

    console.log(`Testing generation with model: ${modelName}`);

    try {
        const model = genAI.getGenerativeModel({ model: modelName });
        const result = await model.generateContent("Hello, are you working?");
        const response = await result.response;
        const text = response.text();
        console.log("Success! Response:", text);
    } catch (error: any) {
        console.error("Error generating content:", error.message);
    }
}

testGeneration();
