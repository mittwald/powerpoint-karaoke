import { z } from "zod";
import { sql } from "drizzle-orm";
import { pgTable, text, jsonb, timestamp, varchar, check } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";

export const DIFFICULTIES = ["easy", "medium", "hard"] as const;
export const LANGUAGES = ["english", "german", "plattdeutsch", "bairisch", "ruhrpott", "scottish"] as const;

export const difficultySchema = z.enum(DIFFICULTIES);
export const languageSchema = z.enum(LANGUAGES);

export const keywordInputSchema = z.object({
  keyword1: z.string().min(1, "At least one keyword is required"),
  keyword2: z.string().optional(),
  keyword3: z.string().optional(),
  presenterName: z.string().min(1, "Presenter name is required"),
  difficulty: difficultySchema,
  language: languageSchema.default("english"),
  slideCount: z.string().default("15"),
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
  // Stable, closed set of values; enforced by a CHECK constraint below.
  difficulty: varchar("difficulty", { length: 10 }).notNull(),
  // Stores the internal LANGUAGES keys (not language names). The set grows
  // whenever a dialect is added, so the column only bounds the length with
  // plenty of headroom and the app validates the actual value.
  language: varchar("language", { length: 50 }).notNull(),
  slides: jsonb("slides").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
}, (table) => [
  check(
    "presentations_difficulty_check",
    sql`${table.difficulty} IN (${sql.raw(DIFFICULTIES.map((d) => `'${d}'`).join(", "))})`,
  ),
]);

export type Presentation = typeof presentations.$inferSelect;
export type InsertPresentation = typeof presentations.$inferInsert;

export const insertPresentationSchema = createInsertSchema(presentations, {
  difficulty: difficultySchema,
  language: languageSchema,
}).omit({
  id: true,
  createdAt: true,
});
