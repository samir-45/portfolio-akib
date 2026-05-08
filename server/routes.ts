import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage, comparePasswords } from "./storage";
import { seedDatabase } from "./seed";
import { insertContactMessageSchema, insertProjectSchema, insertPlaygroundItemSchema, insertProcessStepSchema, insertTestimonialSchema } from "@shared/schema";
import multer from "multer";
import path from "path";
import fs from "fs";
import session from "express-session";
import { randomUUID } from "crypto";

const upload = multer({
  storage: multer.diskStorage({
    destination: (_req, _file, cb) => {
      const uploadDir = path.join(process.cwd(), "public", "uploads");
      if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });
      cb(null, uploadDir);
    },
    filename: (_req, file, cb) => {
      const ext = path.extname(file.originalname);
      cb(null, `${randomUUID()}${ext}`);
    },
  }),
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    const allowed = /jpeg|jpg|png|gif|webp|svg/;
    cb(null, allowed.test(path.extname(file.originalname).toLowerCase()) && allowed.test(file.mimetype));
  },
});

function isAdmin(req: Request, res: Response, next: Function) {
  if ((req.session as any).adminId) return next();
  res.status(401).json({ message: "Unauthorized" });
}

export async function registerRoutes(httpServer: Server, app: Express): Promise<Server> {
  await seedDatabase();

  // Session setup
  app.use(session({
    secret: process.env.SESSION_SECRET || "portfolio-secret-key-2026",
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false, httpOnly: true, maxAge: 24 * 60 * 60 * 1000 },
  }));

  // --- Public API ---

  // Projects
  app.get("/api/projects", async (_req, res) => {
    res.json(await storage.getProjects());
  });
  app.get("/api/projects/featured", async (_req, res) => {
    res.json(await storage.getFeaturedProjects());
  });
  app.get("/api/projects/:slug", async (req, res) => {
    const p = await storage.getProjectBySlug(req.params.slug);
    if (!p) return res.status(404).json({ message: "Not found" });
    res.json(p);
  });

  // Playground
  app.get("/api/playground", async (_req, res) => {
    res.json(await storage.getPlaygroundItems());
  });
  app.get("/api/playground/settings", async (_req, res) => {
    const settings = await storage.getPlaygroundSettings();
    const obj: Record<string, unknown> = {};
    for (const s of settings) obj[s.key] = s.value;
    res.json(obj);
  });

  // Process Steps
  app.get("/api/process", async (_req, res) => {
    res.json(await storage.getProcessSteps());
  });

  // Testimonials
  app.get("/api/testimonials", async (_req, res) => {
    res.json(await storage.getTestimonials());
  });

  // Site Settings (public)
  app.get("/api/settings", async (_req, res) => {
    const settings = await storage.getSiteSettings();
    const obj: Record<string, unknown> = {};
    for (const s of settings) obj[s.key] = s.value;
    res.json(obj);
  });

  // Contact form
  app.post("/api/contact", async (req, res) => {
    const parsed = insertContactMessageSchema.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ message: "Invalid data", errors: parsed.error.errors });
    const msg = await storage.createContactMessage(parsed.data);
    res.json(msg);
  });

  // --- Auth ---
  app.post("/api/admin/login", async (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) return res.status(400).json({ message: "Username and password required" });
    const user = await storage.getUserByUsername(username);
    if (!user) return res.status(401).json({ message: "Invalid credentials" });
    const valid = await comparePasswords(password, user.password);
    if (!valid) return res.status(401).json({ message: "Invalid credentials" });
    (req.session as any).adminId = user.id;
    res.json({ message: "Logged in", user: { id: user.id, username: user.username } });
  });

  app.post("/api/admin/logout", (req, res) => {
    req.session.destroy(() => res.json({ message: "Logged out" }));
  });

  app.get("/api/admin/me", isAdmin, async (req, res) => {
    const user = await storage.getUser((req.session as any).adminId);
    if (!user) return res.status(401).json({ message: "Unauthorized" });
    res.json({ id: user.id, username: user.username });
  });

  // --- Admin API ---

  // File upload
  app.post("/api/admin/upload", isAdmin, upload.single("file"), (req, res) => {
    if (!req.file) return res.status(400).json({ message: "No file" });
    res.json({ url: `/uploads/${req.file.filename}` });
  });

  // Admin Projects
  app.get("/api/admin/projects", isAdmin, async (_req, res) => {
    res.json(await storage.getProjects());
  });
  app.post("/api/admin/projects", isAdmin, async (req, res) => {
    const parsed = insertProjectSchema.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ message: "Invalid data", errors: parsed.error.errors });
    res.json(await storage.createProject(parsed.data));
  });
  app.patch("/api/admin/projects/:id", isAdmin, async (req, res) => {
    const p = await storage.updateProject(String(req.params.id), req.body);
    if (!p) return res.status(404).json({ message: "Not found" });
    res.json(p);
  });
  app.delete("/api/admin/projects/:id", isAdmin, async (req, res) => {
    await storage.deleteProject(String(req.params.id));
    res.json({ message: "Deleted" });
  });

  // Admin Playground
  app.get("/api/admin/playground", isAdmin, async (_req, res) => {
    res.json(await storage.getPlaygroundItems());
  });
  app.get("/api/admin/playground/settings", isAdmin, async (_req, res) => {
    const settings = await storage.getPlaygroundSettings();
    const obj: Record<string, unknown> = {};
    for (const s of settings) obj[s.key] = s.value;
    res.json(obj);
  });
  app.post("/api/admin/playground", isAdmin, async (req, res) => {
    const parsed = insertPlaygroundItemSchema.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ message: "Invalid data", errors: parsed.error.errors });
    res.json(await storage.createPlaygroundItem(parsed.data));
  });
  app.patch("/api/admin/playground/:id", isAdmin, async (req, res) => {
    const p = await storage.updatePlaygroundItem(String(req.params.id), req.body);
    if (!p) return res.status(404).json({ message: "Not found" });
    res.json(p);
  });
  app.delete("/api/admin/playground/:id", isAdmin, async (req, res) => {
    await storage.deletePlaygroundItem(String(req.params.id));
    res.json({ message: "Deleted" });
  });
  app.post("/api/admin/playground/settings", isAdmin, async (req, res) => {
    const { key, value } = req.body;
    if (!key) return res.status(400).json({ message: "Key required" });
    res.json(await storage.upsertPlaygroundSetting(key, value));
  });

  // Admin Process Steps
  app.get("/api/admin/process", isAdmin, async (_req, res) => {
    res.json(await storage.getProcessSteps());
  });
  app.post("/api/admin/process", isAdmin, async (req, res) => {
    const parsed = insertProcessStepSchema.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ message: "Invalid data", errors: parsed.error.errors });
    res.json(await storage.createProcessStep(parsed.data));
  });
  app.patch("/api/admin/process/:id", isAdmin, async (req, res) => {
    const s = await storage.updateProcessStep(String(req.params.id), req.body);
    if (!s) return res.status(404).json({ message: "Not found" });
    res.json(s);
  });
  app.delete("/api/admin/process/:id", isAdmin, async (req, res) => {
    await storage.deleteProcessStep(String(req.params.id));
    res.json({ message: "Deleted" });
  });

  // Admin Testimonials
  app.get("/api/admin/testimonials", isAdmin, async (_req, res) => {
    res.json(await storage.getTestimonials());
  });
  app.post("/api/admin/testimonials", isAdmin, async (req, res) => {
    const parsed = insertTestimonialSchema.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ message: "Invalid data", errors: parsed.error.errors });
    res.json(await storage.createTestimonial(parsed.data));
  });
  app.patch("/api/admin/testimonials/:id", isAdmin, async (req, res) => {
    const t = await storage.updateTestimonial(String(req.params.id), req.body);
    if (!t) return res.status(404).json({ message: "Not found" });
    res.json(t);
  });
  app.delete("/api/admin/testimonials/:id", isAdmin, async (req, res) => {
    await storage.deleteTestimonial(String(req.params.id));
    res.json({ message: "Deleted" });
  });

  // Admin Contact Messages
  app.get("/api/admin/messages", isAdmin, async (_req, res) => {
    res.json(await storage.getContactMessages());
  });
  app.patch("/api/admin/messages/:id/read", isAdmin, async (req, res) => {
    await storage.markMessageRead(String(req.params.id));
    res.json({ message: "Marked as read" });
  });
  app.delete("/api/admin/messages/:id", isAdmin, async (req, res) => {
    await storage.deleteContactMessage(String(req.params.id));
    res.json({ message: "Deleted" });
  });

  // Admin Settings
  app.get("/api/admin/settings", isAdmin, async (_req, res) => {
    res.json(await storage.getSiteSettings());
  });
  app.post("/api/admin/settings", isAdmin, async (req, res) => {
    const { key, value } = req.body;
    if (!key) return res.status(400).json({ message: "Key required" });
    res.json(await storage.upsertSiteSetting(key, value));
  });

  // Serve uploads
  app.use("/uploads", (req, res, next) => {
    const filePath = path.join(process.cwd(), "public", "uploads", path.basename(req.path));
    res.sendFile(filePath, (err) => { if (err) next(); });
  });

  return httpServer;
}
