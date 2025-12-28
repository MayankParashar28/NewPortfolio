import type { Express } from "express";
import { createServer, type Server } from "http";
import { setupAuth } from "./auth";
import { storage } from "./storage";
import { insertProjectSchema, insertSkillSchema, insertCertificateSchema, insertProfileSchema } from "../shared/schema";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { GoogleAIFileManager } from "@google/generative-ai/server";
import fs from "fs";
import path from "path";
import os from "os";


export async function registerRoutes(app: Express): Promise<Server> {
  // setup authentication routes and middleware
  setupAuth(app);

  // Helper to check if user is authenticated
  const isAuthenticated = (req: any, res: any, next: any) => {
    if (req.isAuthenticated()) {
      return next();
    }
    res.status(401).send("Unauthorized");
  };

  // Projects
  app.get("/api/projects", async (req, res) => {
    const projects = await storage.getProjects();
    res.json(projects);
  });

  app.post("/api/projects", isAuthenticated, async (req, res) => {
    const parsed = insertProjectSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json(parsed.error);
    }
    const project = await storage.createProject(parsed.data);
    res.status(201).json(project);
  });

  app.patch("/api/projects/:id", isAuthenticated, async (req, res) => {
    const parsed = insertProjectSchema.partial().safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json(parsed.error);
    }
    try {
      const project = await storage.updateProject(Number(req.params.id), parsed.data);
      res.json(project);
    } catch (e) {
      res.status(404).send("Project not found");
    }
  });

  app.delete("/api/projects/:id", isAuthenticated, async (req, res) => {
    await storage.deleteProject(Number(req.params.id));
    res.sendStatus(204);
  });

  // Skills
  app.get("/api/skills", async (req, res) => {
    const skills = await storage.getSkills();
    res.json(skills);
  });

  app.post("/api/skills", isAuthenticated, async (req, res) => {
    const parsed = insertSkillSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json(parsed.error);
    }
    const skill = await storage.createSkill(parsed.data);
    res.status(201).json(skill);
  });

  app.patch("/api/skills/:id", isAuthenticated, async (req, res) => {
    const parsed = insertSkillSchema.partial().safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json(parsed.error);
    }
    try {
      const skill = await storage.updateSkill(Number(req.params.id), parsed.data);
      res.json(skill);
    } catch (e) {
      res.status(404).send("Skill not found");
    }
  });

  app.delete("/api/skills/:id", isAuthenticated, async (req, res) => {
    await storage.deleteSkill(Number(req.params.id));
    res.sendStatus(204);
  });

  // Certificates
  app.get("/api/certificates", async (req, res) => {
    const certs = await storage.getCertificates();
    res.json(certs);
  });

  app.post("/api/certificates", isAuthenticated, async (req, res) => {
    const parsed = insertCertificateSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json(parsed.error);
    }
    const cert = await storage.createCertificate(parsed.data);
    res.status(201).json(cert);
  });

  app.patch("/api/certificates/:id", isAuthenticated, async (req, res) => {
    const parsed = insertCertificateSchema.partial().safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json(parsed.error);
    }
    try {
      const cert = await storage.updateCertificate(Number(req.params.id), parsed.data);
      res.json(cert);
    } catch (e) {
      res.status(404).send("Certificate not found");
    }
  });

  app.delete("/api/certificates/:id", isAuthenticated, async (req, res) => {
    await storage.deleteCertificate(Number(req.params.id));
    res.sendStatus(204);
  });

  // Profile
  app.get("/api/profile", async (req, res) => {
    const profile = await storage.getProfile();
    res.json(profile);
  });

  app.post("/api/profile", isAuthenticated, async (req, res) => {
    const parsed = insertProfileSchema.partial().safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json(parsed.error);
    }
    const profile = await storage.updateProfile(parsed.data);
    res.json(profile);
  });
  // AI Resume Analysis
  app.post("/api/analyze-resume", isAuthenticated, async (req, res) => {
    try {
      if (!process.env.GEMINI_API_KEY) {
        throw new Error("GEMINI_API_KEY is not configured");
      }

      const { resumeBase64 } = req.body;
      if (!resumeBase64 || !resumeBase64.startsWith("data:application/pdf;base64,")) {
        return res.status(400).json({ message: "Invalid PDF data provided" });
      }



      // 1. Write PDF to temporary file (Gemini File Manager needs a file path)
      const base64Data = resumeBase64.split(",")[1];
      const tempFilePath = path.join(os.tmpdir(), `temp_${Date.now()}.pdf`);
      await fs.promises.writeFile(tempFilePath, Buffer.from(base64Data, "base64"));


      try {
        // 2. Upload to Gemini
        const fileManager = new GoogleAIFileManager(process.env.GEMINI_API_KEY);
        const uploadResult = await fileManager.uploadFile(tempFilePath, {
          mimeType: "application/pdf",
          displayName: "Resume Analysis",
        });

        // 3. Generate Content using the File URI
        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

        const prompt = `
        You are an expert technical recruiter and ATS (Applicant Tracking System) optimization specialist. 
        Analyze the attached resume PDF with high strictness.
        
        Provide the output in the following JSON format ONLY (no markdown code blocks, just raw JSON):
        {
          "score": number, // 0-100, be strict. Average resumes should be 50-60. Great ones 80+.
          "scoreColor": string, // Hex color code based on score (Red < 50, Orange < 70, Green > 70)
          "summary": string, // 1-2 sentence professional summary of the resume's quality.
          "strengths": string[], // List of 3-5 key strengths found.
          "weaknesses": string[], // List of 3-5 critical missing keywords or formatting issues.
          "suggestions": string[] // Concrete, actionable steps to improve the ATS score.
        }
        `;

        const result = await model.generateContent([
          prompt,
          {
            fileData: {
              fileUri: uploadResult.file.uri,
              mimeType: uploadResult.file.mimeType,
            },
          },
        ]);

        // 4. Cleanup (Delete temp file)
        await fs.promises.unlink(tempFilePath);

        const text = result.response.text();

        // Clean up potential markdown formatting from the response
        const jsonStr = text.replace(/```json/g, "").replace(/```/g, "").trim();
        const analysis = JSON.parse(jsonStr);

        res.json(analysis);

      } catch (innerError: any) {
        // Cleanup on error
        if (fs.existsSync(tempFilePath)) {
          await fs.promises.unlink(tempFilePath).catch(() => { });
        }
        throw innerError;
      }

    } catch (error: any) {
      console.error("Resume analysis error:", error);
      res.status(500).json({ message: error.message || "Failed to analyze resume" });
    }
  });


  const httpServer = createServer(app);
  return httpServer;
}
