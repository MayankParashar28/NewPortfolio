import type { Express } from "express";
import { createServer, type Server } from "http";
import { setupAuth } from "./auth";
import { storage } from "./storage";
import { insertProjectSchema, insertSkillSchema, insertCertificateSchema, insertProfileSchema } from "@shared/schema";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { PDFParse } from 'pdf-parse';

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

  app.post("/api/analyze-resume", isAuthenticated, async (req, res) => {
    try {
      const { resumeBase64 } = req.body;

      if (!process.env.GEMINI_API_KEY) {
        return res.status(500).json({ message: "Gemini API Key is not configured on the server." });
      }

      // 1. Extract raw text from PDF
      const base64Data = resumeBase64.replace(/^data:application\/pdf;base64,/, "");
      const dataBuffer = Buffer.from(base64Data, "base64");
      console.log("[DEBUG] Parsing PDF...");

      const parser = new PDFParse({ data: dataBuffer });
      const pdfData = await parser.getText();

      const resumeText = pdfData.text.slice(0, 10000); // Gemini has a larger context window
      console.log("[DEBUG] PDF Parsed. Text Length:", resumeText.length);

      // 2. Send to Gemini
      console.log("[DEBUG] Initializing Gemini...");
      const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
      const model = genAI.getGenerativeModel({ model: "gemini-flash-latest" });

      const prompt = `
        You are an expert Resume Reviewer. Analyze the following resume text.
        Provide constructive feedback in 3-4 bullet points. 
        Focus on: Impact, Clarity, and Keywords.
        Be concise and helpful. 
        
        Resume Text:
        ${resumeText}
      `;

      console.log("[DEBUG] Sending prompt to Gemini...");
      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      console.log("[DEBUG] Gemini Response received:", text.slice(0, 50) + "...");

      res.json({ analysis: text });
    } catch (error: any) {
      console.error("Resume Analysis Error:", error);
      res.status(500).json({ message: error.message || "Failed to analyze resume" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
