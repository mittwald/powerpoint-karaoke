import type { Express } from "express";
import { createServer, type Server } from "http";
import { generatePresentationTitle, generatePresenterBio, generatePresentationStructure } from "./lib/openai";
import { getRandomPhotosByQuery } from "./lib/unsplash";
import { keywordInputSchema } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  app.post("/api/generate-presentation", async (req, res) => {
    try {
      const validation = keywordInputSchema.safeParse(req.body);
      
      if (!validation.success) {
        return res.status(400).json({ error: "Invalid keywords" });
      }

      const { keyword1, keyword2, keyword3, presenterName, difficulty } = validation.data;
      const keywords = [keyword1, keyword2, keyword3].filter((k): k is string => !!k && k.trim() !== "");

      // Generate presentation title using OpenAI
      const title = await generatePresentationTitle(keywords, difficulty);

      // Generate presenter bio
      const bioData = await generatePresenterBio(presenterName, keywords, difficulty);

      // Generate the complete presentation structure using LLM
      const slideSpecs = await generatePresentationStructure(keywords, difficulty);

      // Initialize slides array
      const slides = [];
      
      // First slide: Title
      slides.push({
        type: "title",
        content: title,
      });
      
      // Second slide: Presenter bio
      slides.push({
        type: "bio",
        content: presenterName,
        bio: bioData.bio,
        facts: bioData.facts,
      });

      // Process each slide spec and create actual slides
      const usedPhotoIds: string[] = [];
      
      for (const spec of slideSpecs) {
        if (spec.type === "photo" && spec.photoSearchTerm) {
          // Fetch photo using the search term from the LLM
          const photo = await getRandomPhotosByQuery(spec.photoSearchTerm, usedPhotoIds);
          usedPhotoIds.push(photo.id);
          
          slides.push({
            type: "photo",
            content: spec.photoSearchTerm,
            imageUrl: photo.url,
            photoAuthorName: photo.authorName,
            photoAuthorUsername: photo.authorUsername,
            photoAuthorUrl: photo.authorUrl,
            photoUrl: photo.photoUrl,
          });
        } else if (spec.type === "text" && spec.text) {
          slides.push({
            type: "text",
            content: spec.text,
          });
        } else if (spec.type === "quote" && spec.quote && spec.quoteAuthor && spec.quoteTitle) {
          slides.push({
            type: "quote",
            content: spec.quote,
            quote: spec.quote,
            author: spec.quoteAuthor,
            authorTitle: spec.quoteTitle,
          });
        } else if (spec.type === "graph" && spec.graphTitle && spec.graphData) {
          slides.push({
            type: "graph",
            content: spec.graphTitle,
            graphTitle: spec.graphTitle,
            graphData: spec.graphData,
          });
        }
      }

      // Add thank you slide at the end
      slides.push({
        type: "text",
        content: "Thank You!",
      });

      res.json({
        title,
        keywords,
        slides,
      });
    } catch (error) {
      console.error("Error generating presentation:", error);
      res.status(500).json({ error: "Failed to generate presentation" });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
