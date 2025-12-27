import { users, projects, skills, certificates, profile, type User, type InsertUser, type Project, type InsertProject, type Skill, type InsertSkill, type Certificate, type InsertCertificate, type Profile, type InsertProfile } from "@shared/schema";
import { db } from "./db";
import { eq } from "drizzle-orm";

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  getProjects(): Promise<Project[]>;
  createProject(project: InsertProject): Promise<Project>;
  updateProject(id: number, project: Partial<InsertProject>): Promise<Project>;
  deleteProject(id: number): Promise<void>;

  getSkills(): Promise<Skill[]>;
  createSkill(skill: InsertSkill): Promise<Skill>;
  updateSkill(id: number, skill: Partial<InsertSkill>): Promise<Skill>;
  deleteSkill(id: number): Promise<void>;

  getCertificates(): Promise<Certificate[]>;
  createCertificate(cert: InsertCertificate): Promise<Certificate>;
  updateCertificate(id: number, cert: Partial<InsertCertificate>): Promise<Certificate>;
  deleteCertificate(id: number): Promise<void>;

  getProfile(): Promise<Profile>;
  updateProfile(data: Partial<InsertProfile>): Promise<Profile>;
}

export class DatabaseStorage implements IStorage {
  private cache: Map<string, any> = new Map();

  private getCached<T>(key: string): T | undefined {
    return this.cache.get(key);
  }

  private setCache(key: string, value: any) {
    this.cache.set(key, value);
  }

  private invalidate(prefix: string) {
    Array.from(this.cache.keys()).forEach((key) => {
      if (key.startsWith(prefix)) {
        this.cache.delete(key);
      }
    });
  }

  async getUser(id: number): Promise<User | undefined> {
    const key = `user:${id}`;
    const cached = this.getCached<User>(key);
    if (cached) return cached;

    const [user] = await db.select().from(users).where(eq(users.id, id));
    if (user) this.setCache(key, user);
    return user;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const key = `user:username:${username}`;
    const cached = this.getCached<User>(key);
    if (cached) return cached;

    const [user] = await db.select().from(users).where(eq(users.username, username));
    if (user) this.setCache(key, user);
    return user;
  }

  async getUserByFirebaseUid(firebaseUid: string): Promise<User | undefined> {
    const key = `user:firebase:${firebaseUid}`;
    const cached = this.getCached<User>(key);
    if (cached) return cached;

    const [user] = await db.select().from(users).where(eq(users.firebaseUid, firebaseUid));
    if (user) this.setCache(key, user);
    return user;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db.insert(users).values(insertUser).returning();
    return user;
  }

  async getProjects(): Promise<Project[]> {
    const key = "projects:all";
    const cached = this.getCached<Project[]>(key);
    if (cached) return cached;

    const projectsList = await db.select().from(projects);
    this.setCache(key, projectsList);
    return projectsList;
  }

  async createProject(insertProject: InsertProject): Promise<Project> {
    this.invalidate("projects");
    const [project] = await db.insert(projects).values(insertProject).returning();
    return project;
  }

  async updateProject(id: number, insertProject: Partial<InsertProject>): Promise<Project> {
    this.invalidate("projects");
    const [project] = await db
      .update(projects)
      .set(insertProject)
      .where(eq(projects.id, id))
      .returning();
    if (!project) throw new Error("Project not found");
    return project;
  }

  async deleteProject(id: number): Promise<void> {
    this.invalidate("projects");
    await db.delete(projects).where(eq(projects.id, id));
  }

  async getSkills(): Promise<Skill[]> {
    const key = "skills:all";
    const cached = this.getCached<Skill[]>(key);
    if (cached) return cached;

    const skillsList = await db.select().from(skills);
    this.setCache(key, skillsList);
    return skillsList;
  }

  async createSkill(insertSkill: InsertSkill): Promise<Skill> {
    this.invalidate("skills");
    const [skill] = await db.insert(skills).values(insertSkill).returning();
    return skill;
  }

  async updateSkill(id: number, insertSkill: Partial<InsertSkill>): Promise<Skill> {
    this.invalidate("skills");
    const [skill] = await db
      .update(skills)
      .set(insertSkill)
      .where(eq(skills.id, id))
      .returning();
    if (!skill) throw new Error("Skill not found");
    return skill;
  }

  async deleteSkill(id: number): Promise<void> {
    this.invalidate("skills");
    await db.delete(skills).where(eq(skills.id, id));
  }

  async getCertificates(): Promise<Certificate[]> {
    const key = "certificates:all";
    const cached = this.getCached<Certificate[]>(key);
    if (cached) return cached;

    const list = await db.select().from(certificates);
    this.setCache(key, list);
    return list;
  }

  async createCertificate(insertCert: InsertCertificate): Promise<Certificate> {
    this.invalidate("certificates");
    const [cert] = await db.insert(certificates).values(insertCert).returning();
    return cert;
  }

  async updateCertificate(id: number, insertCert: Partial<InsertCertificate>): Promise<Certificate> {
    this.invalidate("certificates");
    const [cert] = await db
      .update(certificates)
      .set(insertCert)
      .where(eq(certificates.id, id))
      .returning();
    if (!cert) throw new Error("Certificate not found");
    return cert;
  }

  async deleteCertificate(id: number): Promise<void> {
    this.invalidate("certificates");
    await db.delete(certificates).where(eq(certificates.id, id));
  }

  async getProfile(): Promise<Profile> {
    const key = "profile";
    const cached = this.getCached<Profile>(key);
    if (cached) return cached;

    const [existing] = await db.select().from(profile).limit(1);
    if (existing) {
      this.setCache(key, existing);
      return existing;
    }
    // Create default if missing
    const [created] = await db.insert(profile).values({
      bio: "AI & ML Enthusiast",
      resumeUrl: "https://example.com/resume.pdf",
      githubUrl: "https://github.com",
      linkedinUrl: "https://linkedin.com",
      email: "email@example.com"
    }).returning();
    this.setCache(key, created);
    return created;
  }

  async updateProfile(data: Partial<InsertProfile>): Promise<Profile> {
    this.invalidate("profile");
    const existing = await this.getProfile();
    const [updated] = await db
      .update(profile)
      .set(data)
      .where(eq(profile.id, existing.id))
      .returning();
    return updated;
  }
}

export const storage = new DatabaseStorage();
