import { z } from "zod";

export const keywordInputSchema = z.object({
  keyword1: z.string().min(1, "Keyword 1 is required"),
  keyword2: z.string().min(1, "Keyword 2 is required"),
  keyword3: z.string().min(1, "Keyword 3 is required"),
  presenterName: z.string().min(1, "Presenter name is required"),
  difficulty: z.enum(["easy", "medium", "hard"]),
});

export type KeywordInput = z.infer<typeof keywordInputSchema>;

export const presentationSchema = z.object({
  title: z.string(),
  keywords: z.array(z.string()),
});

export type Presentation = z.infer<typeof presentationSchema>;

export const slideSchema = z.object({
  type: z.enum(["photo", "text"]),
  content: z.string(),
  imageUrl: z.string().optional(),
});

export type Slide = z.infer<typeof slideSchema>;
