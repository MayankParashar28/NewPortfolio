import type { Express } from "express";
import { createServer, type Server } from "http";
import { setupAuth } from "./auth";
import { storage } from "./storage";
import { insertProjectSchema, insertSkillSchema, insertCertificateSchema, insertProfileSchema } from "../shared/schema";
import { GoogleGenerativeAI } from "@google/generative-ai";


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

      // Extract base64 content
      const base64Data = resumeBase64.split(",")[1];

      const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

      const prompt = `
      You are an expert technical recruiter and AI resume analyzer. 
      Analyze the attached resume PDF.
      
      Provide a concise 3-part review in Markdown format:
      1. **Strengths**: 3-4 bullet points on what stands out (skills, impact, etc).
      2. **Improvements**: 2-3 specific, actionable tips to make it better.
      3. **ATS Score**: An estimated score out of 100 based on keyword density and formatting.
      
      Keep the tone professional yet encouraging.
      `;

      const result = await model.generateContent([
        prompt,
        {
          inlineData: {
            data: base64Data,
            mimeType: "application/pdf",
          },
        },
      ]);

      const text = result.response.text();
      res.json({ analysis: text });

    } catch (error: any) {
      console.error("Resume analysis error:", error);
      res.status(500).json({ message: error.message || "Failed to analyze resume" });
    }
  });


  const httpServer = createServer(app);
  return httpServer;
}
