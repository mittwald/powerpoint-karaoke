import { z } from "zod";

export const keywordInputSchema = z.object({
  keyword1: z.string().min(1, "At least one keyword is required"),
  keyword2: z.string().optional(),
  keyword3: z.string().optional(),
  presenterName: z.string().min(1, "Presenter name is required"),
  difficulty: z.enum(["easy", "medium", "hard"]),
  language: z.enum(["english", "german"]).default("english"),
});

export type KeywordInput = z.infer<typeof keywordInputSchema>;

export const presentationSchema = z.object({
  title: z.string(),
  keywords: z.array(z.string()),
});

export type Presentation = z.infer<typeof presentationSchema>;

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
