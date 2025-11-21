import { z } from "zod";
import { pgTable, text, jsonb, timestamp, varchar } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";

export const keywordInputSchema = z.object({
  keyword1: z.string().min(1, "At least one keyword is required"),
  keyword2: z.string().optional(),
  keyword3: z.string().optional(),
  presenterName: z.string().min(1, "Presenter name is required"),
  difficulty: z.enum(["easy", "medium", "hard"]),
  language: z.enum(["english", "german"]).default("english"),
  slideCount: z.number().default(15),
});

export type KeywordInput = z.infer<typeof keywordInputSchema>;

export const graphDataPointSchema = z.object({
  label: z.string(),
  value: z.number(),
});

export type GraphDataPoint = z.infer<typeof graphDataPointSchema>;

export const slideSchema = z.object({
  type: z.enum(["photo", "text", "title", "bio", "graph", "quote"]),
  content: z.string(),
  imageUrl: z.string().optional(),
  photoAuthorName: z.string().optional(),
  photoAuthorUsername: z.string().optional(),
  photoAuthorUrl: z.string().optional(),
  photoUrl: z.string().optional(),
  bio: z.string().optional(),
  facts: z.array(z.string()).optional(),
  graphData: z.array(graphDataPointSchema).optional(),
  graphTitle: z.string().optional(),
  quote: z.string().optional(),
  author: z.string().optional(),
  authorTitle: z.string().optional(),
});

export type Slide = z.infer<typeof slideSchema>;

export const presentationResponseSchema = z.object({
  title: z.string(),
  keywords: z.array(z.string()),
  slides: z.array(slideSchema),
});

export type PresentationResponse = z.infer<typeof presentationResponseSchema>;

// Database schema
export const presentations = pgTable("presentations", {
  id: varchar("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  title: text("title").notNull(),
  keywords: text("keywords").array().notNull(),
  presenterName: text("presenter_name").notNull(),
  difficulty: varchar("difficulty", { length: 10 }).notNull(),
  language: varchar("language", { length: 10 }).notNull(),
  slides: jsonb("slides").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export type Presentation = typeof presentations.$inferSelect;
export type InsertPresentation = typeof presentations.$inferInsert;

export const insertPresentationSchema = createInsertSchema(presentations).omit({
  id: true,
  createdAt: true,
});
