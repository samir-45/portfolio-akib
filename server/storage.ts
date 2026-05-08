import { drizzle } from "drizzle-orm/node-postgres";
import { eq, desc, asc } from "drizzle-orm";
import pg from "pg";
import {
  users, projects, playgroundItems, processSteps, testimonials, contactMessages, siteSettings,
  type User, type InsertUser,
  type Project, type InsertProject,
  type PlaygroundItem, type InsertPlaygroundItem,
  type ProcessStep, type InsertProcessStep,
  type Testimonial, type InsertTestimonial,
  type ContactMessage, type InsertContactMessage,
  type SiteSetting, type InsertSiteSetting,
} from "@shared/schema";
import { randomUUID } from "crypto";
import { scrypt, randomBytes, timingSafeEqual } from "crypto";
import { promisify } from "util";

const scryptAsync = promisify(scrypt);

export async function hashPassword(password: string): Promise<string> {
  const salt = randomBytes(16).toString("hex");
  const buf = (await scryptAsync(password, salt, 64)) as Buffer;
  return `${buf.toString("hex")}.${salt}`;
}

export async function comparePasswords(supplied: string, stored: string): Promise<boolean> {
  const [hashed, salt] = stored.split(".");
  const hashedBuf = Buffer.from(hashed, "hex");
  const suppliedBuf = (await scryptAsync(supplied, salt, 64)) as Buffer;
  return timingSafeEqual(hashedBuf, suppliedBuf);
}

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  getProjects(): Promise<Project[]>;
  getFeaturedProjects(): Promise<Project[]>;
  getProjectBySlug(slug: string): Promise<Project | undefined>;
  getProject(id: string): Promise<Project | undefined>;
  createProject(project: InsertProject): Promise<Project>;
  updateProject(id: string, project: Partial<InsertProject>): Promise<Project | undefined>;
  deleteProject(id: string): Promise<void>;
  getPlaygroundItems(): Promise<PlaygroundItem[]>;
  getPlaygroundItem(id: string): Promise<PlaygroundItem | undefined>;
  createPlaygroundItem(item: InsertPlaygroundItem): Promise<PlaygroundItem>;
  updatePlaygroundItem(id: string, item: Partial<InsertPlaygroundItem>): Promise<PlaygroundItem | undefined>;
  deletePlaygroundItem(id: string): Promise<void>;
  getProcessSteps(): Promise<ProcessStep[]>;
  getProcessStep(id: string): Promise<ProcessStep | undefined>;
  createProcessStep(step: InsertProcessStep): Promise<ProcessStep>;
  updateProcessStep(id: string, step: Partial<InsertProcessStep>): Promise<ProcessStep | undefined>;
  deleteProcessStep(id: string): Promise<void>;
  getTestimonials(): Promise<Testimonial[]>;
  getTestimonial(id: string): Promise<Testimonial | undefined>;
  createTestimonial(t: InsertTestimonial): Promise<Testimonial>;
  updateTestimonial(id: string, t: Partial<InsertTestimonial>): Promise<Testimonial | undefined>;
  deleteTestimonial(id: string): Promise<void>;
  getContactMessages(): Promise<ContactMessage[]>;
  getContactMessage(id: string): Promise<ContactMessage | undefined>;
  createContactMessage(msg: InsertContactMessage): Promise<ContactMessage>;
  markMessageRead(id: string): Promise<void>;
  deleteContactMessage(id: string): Promise<void>;
  getSiteSettings(): Promise<SiteSetting[]>;
  getSiteSetting(key: string): Promise<SiteSetting | undefined>;
  upsertSiteSetting(key: string, value: unknown): Promise<SiteSetting>;
}

export class DatabaseStorage implements IStorage {
  private db: ReturnType<typeof drizzle>;

  constructor() {
    const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });
    this.db = drizzle(pool);
  }

  async getUser(id: string) {
    const [u] = await this.db.select().from(users).where(eq(users.id, id));
    return u;
  }
  async getUserByUsername(username: string) {
    const [u] = await this.db.select().from(users).where(eq(users.username, username));
    return u;
  }
  async createUser(user: InsertUser) {
    const [u] = await this.db.insert(users).values(user).returning();
    return u;
  }

  async getProjects() {
    return this.db.select().from(projects).orderBy(asc(projects.sortOrder), desc(projects.createdAt));
  }
  async getFeaturedProjects() {
    return this.db.select().from(projects).where(eq(projects.isFeatured, true)).orderBy(asc(projects.sortOrder));
  }
  async getProjectBySlug(slug: string) {
    const [p] = await this.db.select().from(projects).where(eq(projects.slug, slug));
    return p;
  }
  async getProject(id: string) {
    const [p] = await this.db.select().from(projects).where(eq(projects.id, id));
    return p;
  }
  async createProject(project: InsertProject) {
    const [p] = await this.db.insert(projects).values({ ...project } as any).returning();
    return p;
  }
  async updateProject(id: string, project: Partial<InsertProject>) {
    const [p] = await this.db.update(projects).set({ ...project } as any).where(eq(projects.id, id)).returning();
    return p;
  }
  async deleteProject(id: string) {
    await this.db.delete(projects).where(eq(projects.id, id));
  }

  async getPlaygroundItems() {
    return this.db.select().from(playgroundItems).orderBy(asc(playgroundItems.sortOrder), desc(playgroundItems.createdAt));
  }
  async getPlaygroundItem(id: string) {
    const [item] = await this.db.select().from(playgroundItems).where(eq(playgroundItems.id, id));
    return item;
  }
  async createPlaygroundItem(item: InsertPlaygroundItem) {
    const [i] = await this.db.insert(playgroundItems).values(item).returning();
    return i;
  }
  async updatePlaygroundItem(id: string, item: Partial<InsertPlaygroundItem>) {
    const [i] = await this.db.update(playgroundItems).set(item).where(eq(playgroundItems.id, id)).returning();
    return i;
  }
  async deletePlaygroundItem(id: string) {
    await this.db.delete(playgroundItems).where(eq(playgroundItems.id, id));
  }

  async getProcessSteps() {
    return this.db.select().from(processSteps).orderBy(asc(processSteps.sortOrder), asc(processSteps.stepNumber));
  }
  async getProcessStep(id: string) {
    const [s] = await this.db.select().from(processSteps).where(eq(processSteps.id, id));
    return s;
  }
  async createProcessStep(step: InsertProcessStep) {
    const [s] = await this.db.insert(processSteps).values({ ...step } as any).returning();
    return s;
  }
  async updateProcessStep(id: string, step: Partial<InsertProcessStep>) {
    const [s] = await this.db.update(processSteps).set({ ...step } as any).where(eq(processSteps.id, id)).returning();
    return s;
  }
  async deleteProcessStep(id: string) {
    await this.db.delete(processSteps).where(eq(processSteps.id, id));
  }

  async getTestimonials() {
    return this.db.select().from(testimonials).orderBy(asc(testimonials.sortOrder));
  }
  async getTestimonial(id: string) {
    const [t] = await this.db.select().from(testimonials).where(eq(testimonials.id, id));
    return t;
  }
  async createTestimonial(t: InsertTestimonial) {
    const [item] = await this.db.insert(testimonials).values(t).returning();
    return item;
  }
  async updateTestimonial(id: string, t: Partial<InsertTestimonial>) {
    const [item] = await this.db.update(testimonials).set(t).where(eq(testimonials.id, id)).returning();
    return item;
  }
  async deleteTestimonial(id: string) {
    await this.db.delete(testimonials).where(eq(testimonials.id, id));
  }

  async getContactMessages() {
    return this.db.select().from(contactMessages).orderBy(desc(contactMessages.createdAt));
  }
  async getContactMessage(id: string) {
    const [m] = await this.db.select().from(contactMessages).where(eq(contactMessages.id, id));
    return m;
  }
  async createContactMessage(msg: InsertContactMessage) {
    const [m] = await this.db.insert(contactMessages).values(msg).returning();
    return m;
  }
  async markMessageRead(id: string) {
    await this.db.update(contactMessages).set({ isRead: true }).where(eq(contactMessages.id, id));
  }
  async deleteContactMessage(id: string) {
    await this.db.delete(contactMessages).where(eq(contactMessages.id, id));
  }

  async getSiteSettings() {
    return this.db.select().from(siteSettings);
  }
  async getSiteSetting(key: string) {
    const [s] = await this.db.select().from(siteSettings).where(eq(siteSettings.key, key));
    return s;
  }
  async upsertSiteSetting(key: string, value: unknown) {
    const existing = await this.getSiteSetting(key);
    if (existing) {
      const [s] = await this.db.update(siteSettings).set({ value }).where(eq(siteSettings.key, key)).returning();
      return s;
    }
    const [s] = await this.db.insert(siteSettings).values({ id: randomUUID(), key, value }).returning();
    return s;
  }
}

export const storage = new DatabaseStorage();