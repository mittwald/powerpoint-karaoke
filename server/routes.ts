import type { Express } from "express";
import { createServer, type Server } from "http";
import { generatePresentationTitle, generateSlideText, generatePresenterBio } from "./lib/openai";
import { getRandomPhotos } from "./lib/unsplash";
import { keywordInputSchema } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  app.post("/api/generate-presentation", async (req, res) => {
    try {
      const validation = keywordInputSchema.safeParse(req.body);
      
      if (!validation.success) {
        return res.status(400).json({ error: "Invalid keywords" });
      }

      const { keyword1, keyword2, keyword3, presenterName, difficulty } = validation.data;
      const keywords = [keyword1, keyword2, keyword3];

      // Generate presentation title using OpenAI
      const title = await generatePresentationTitle(keywords, difficulty);

      // Generate presenter bio
      const bioData = await generatePresenterBio(presenterName, keywords, difficulty);

      // Generate slides (mix of photos and text)
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

      const photoCount = 9;
      const textSlideCount = 3;
      
      // Get random photos based on keywords
      const photos = await getRandomPhotos(keywords, photoCount);

      // Create slide sequence: mostly photos with occasional text slides
      for (let i = 0; i < photoCount + textSlideCount; i++) {
        if (i % 4 === 3) {
          // Text slide
          const topic = keywords[Math.floor(Math.random() * keywords.length)];
          const text = await generateSlideText(topic, i + 1, difficulty);
          slides.push({
            type: "text",
            content: text,
          });
        } else {
          // Photo slide
          const photoIndex = Math.floor(i - Math.floor(i / 4));
          slides.push({
            type: "photo",
            content: keywords[photoIndex % keywords.length],
            imageUrl: photos[photoIndex],
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
