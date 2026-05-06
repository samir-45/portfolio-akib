import { sql } from "drizzle-orm";
import { pgTable, text, varchar, boolean, integer, jsonb, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const projects = pgTable("projects", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  slug: text("slug").notNull().unique(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  category: text("category").notNull(),
  problemStatement: text("problem_statement"),
  impact: text("impact"),
  imageUrl: text("image_url"),
  iconColor: text("icon_color").default("#2b7fff"),
  iconUrl: text("icon_url"),
  isFeatured: boolean("is_featured").default(false),
  sortOrder: integer("sort_order").default(0),
  role: text("role"),
  duration: text("duration"),
  team: text("team"),
  theProblem: text("the_problem"),
  theSolution: text("the_solution"),
  wireframesImageUrl: text("wireframes_image_url"),
  results: jsonb("results").$type<{ label: string; value: string }[]>(),
  keyLearnings: jsonb("key_learnings").$type<string[]>(),
  tags: text("tags").array(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const playgroundItems = pgTable("playground_items", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  title: text("title").notNull(),
  category: text("category").notNull(),
  imageUrl: text("image_url"),
  description: text("description"),
  sortOrder: integer("sort_order").default(0),
  createdAt: timestamp("created_at").defaultNow(),
});

export const processSteps = pgTable("process_steps", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  stepNumber: integer("step_number").notNull(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  keyActivities: jsonb("key_activities").$type<string[]>(),
  color: text("color").default("#2b7fff"),
  sortOrder: integer("sort_order").default(0),
});

export const testimonials = pgTable("testimonials", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  company: text("company"),
  role: text("role"),
  content: text("content").notNull(),
  avatarUrl: text("avatar_url"),
  sortOrder: integer("sort_order").default(0),
});

export const contactMessages = pgTable("contact_messages", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  email: text("email").notNull(),
  message: text("message").notNull(),
  isRead: boolean("is_read").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

export const siteSettings = pgTable("site_settings", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  key: text("key").notNull().unique(),
  value: jsonb("value"),
});

export const insertUserSchema = createInsertSchema(users).pick({ username: true, password: true });
export const insertProjectSchema = createInsertSchema(projects).omit({ id: true, createdAt: true });
export const insertPlaygroundItemSchema = createInsertSchema(playgroundItems).omit({ id: true, createdAt: true });
export const insertProcessStepSchema = createInsertSchema(processSteps).omit({ id: true });
export const insertTestimonialSchema = createInsertSchema(testimonials).omit({ id: true });
export const insertContactMessageSchema = createInsertSchema(contactMessages).omit({ id: true, isRead: true, createdAt: true });
export const insertSiteSettingSchema = createInsertSchema(siteSettings).omit({ id: true });

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type Project = typeof projects.$inferSelect;
export type InsertProject = z.infer<typeof insertProjectSchema>;
export type PlaygroundItem = typeof playgroundItems.$inferSelect;
export type InsertPlaygroundItem = z.infer<typeof insertPlaygroundItemSchema>;
export type ProcessStep = typeof processSteps.$inferSelect;
export type InsertProcessStep = z.infer<typeof insertProcessStepSchema>;
export type Testimonial = typeof testimonials.$inferSelect;
export type InsertTestimonial = z.infer<typeof insertTestimonialSchema>;
export type ContactMessage = typeof contactMessages.$inferSelect;
export type InsertContactMessage = z.infer<typeof insertContactMessageSchema>;
export type SiteSetting = typeof siteSettings.$inferSelect;
export type InsertSiteSetting = z.infer<typeof insertSiteSettingSchema>;
