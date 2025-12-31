import { pgTable, text, serial, integer, boolean, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  // Username might be optional for phone-only users initially, but let's keep it unique if present.
  username: text("username").unique(),
  password: text("password"),

});

export const projects = pgTable("projects", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  image: text("image").notNull(),
  tags: text("tags").array().notNull(),
  category: text("category").notNull(),
  githubLink: text("github_link").notNull(),
  demoLink: text("demo_link"),
  featured: boolean("featured").default(false),
  createdAt: text("created_at").default(new Date().toISOString()),
  updatedAt: text("updated_at").default(new Date().toISOString()),
  order: integer("order").notNull().default(0),
});

export const skills = pgTable("skills", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  category: text("category").notNull(), // Core ML/AI, Software Engineering, etc.
  icon: text("icon"), // Store icon name or SVG path
  color: text("color"),
  order: integer("order").notNull().default(0),
});

export const certificates = pgTable("certificates", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  issuer: text("issuer").notNull(),
  date: text("date").notNull(),
  description: text("description").notNull(),
  image: text("image").notNull(),
  credentialUrl: text("credential_url"),
  order: integer("order").notNull().default(0),
});
export const profile = pgTable("profile", {
  id: serial("id").primaryKey(),
  name: text("name").notNull().default("Mayank Parashar"),
  title: text("title").notNull().default("AI & Machine Learning Student"),
  tagline: text("tagline").notNull().default("Building the Future with Artificial Intelligence"),
  bio: text("bio").notNull(),
  resumeUrl: text("resume_url").notNull(),
  githubUrl: text("github_url").notNull(),
  linkedinUrl: text("linkedin_url").notNull(),
  email: text("email").notNull(),
  openaiApiKey: text("openai_api_key").notNull().default(""),
  atsScore: integer("ats_score"),
  atsFeedback: jsonb("ats_feedback"),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const insertProjectSchema = createInsertSchema(projects);
export const insertSkillSchema = createInsertSchema(skills);
export const insertCertificateSchema = createInsertSchema(certificates);
export const insertProfileSchema = createInsertSchema(profile);

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type Project = typeof projects.$inferSelect;
export type InsertProject = z.infer<typeof insertProjectSchema>;
export type Skill = typeof skills.$inferSelect;
export type InsertSkill = z.infer<typeof insertSkillSchema>;
export type Certificate = typeof certificates.$inferSelect;
export type InsertCertificate = z.infer<typeof insertCertificateSchema>;
export type Profile = typeof profile.$inferSelect;
export type InsertProfile = z.infer<typeof insertProfileSchema>;

