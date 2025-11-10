import type { Express } from "express";
import { createServer, type Server } from "http";
import { generatePresentationTitle, generateSlideText, generatePresenterBio, generateGraphData, generateQuote } from "./lib/openai";
import { getRandomPhotos, getRandomPhotosByQuery } from "./lib/unsplash";
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

      // Calculate slide counts based on difficulty
      // Special slides (graphs + quotes) percentage of total non-photo content
      const specialSlidePercentages = {
        easy: 0.2,    // 20% of non-photo slides
        medium: 0.35, // 35% of non-photo slides
        hard: 0.5,    // 50% of non-photo slides
      };
      
      const totalContentSlides = 12; // Total slides after title and bio
      const specialPercentage = specialSlidePercentages[difficulty];
      
      // Calculate counts
      const photoCount = Math.floor(totalContentSlides * 0.65); // ~65% photos
      const nonPhotoCount = totalContentSlides - photoCount;
      const specialSlideCount = Math.round(nonPhotoCount * specialPercentage);
      const textSlideCount = nonPhotoCount - specialSlideCount;
      const graphCount = Math.round(specialSlideCount / 2);
      const quoteCount = specialSlideCount - graphCount;
      
      // Get photos: first one related to keywords, rest are completely random
      const firstPhoto = await getRandomPhotosByQuery(keywords.join(" "));
      const randomPhotos = photoCount > 1 ? await getRandomPhotos(photoCount - 1) : [];
      const allPhotos = [firstPhoto, ...randomPhotos];

      // Generate all content slides
      const contentSlides: any[] = [];
      
      // Add photo slides
      for (let i = 0; i < photoCount; i++) {
        const photo = allPhotos[i];
        contentSlides.push({
          type: "photo",
          content: i === 0 ? keywords.join(", ") : "Random Photo",
          imageUrl: photo.url,
          photoAuthorName: photo.authorName,
          photoAuthorUsername: photo.authorUsername,
          photoAuthorUrl: photo.authorUrl,
          photoUrl: photo.photoUrl,
        });
      }
      
      // Add text slides
      for (let i = 0; i < textSlideCount; i++) {
        const topic = keywords[Math.floor(Math.random() * keywords.length)];
        const text = await generateSlideText(topic, i + 1, difficulty);
        contentSlides.push({
          type: "text",
          content: text,
        });
      }
      
      // Add graph slides
      for (let i = 0; i < graphCount; i++) {
        const topic = keywords.join(" and ");
        const graphData = await generateGraphData(topic, difficulty);
        contentSlides.push({
          type: "graph",
          content: graphData.title,
          graphTitle: graphData.title,
          graphData: graphData.data,
        });
      }
      
      // Add quote slides
      for (let i = 0; i < quoteCount; i++) {
        const topic = keywords[Math.floor(Math.random() * keywords.length)];
        const quoteData = await generateQuote(topic, difficulty);
        contentSlides.push({
          type: "quote",
          content: quoteData.quote,
          quote: quoteData.quote,
          author: quoteData.author,
          authorTitle: quoteData.title,
        });
      }
      
      // Shuffle content slides for variety
      for (let i = contentSlides.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [contentSlides[i], contentSlides[j]] = [contentSlides[j], contentSlides[i]];
      }
      
      slides.push(...contentSlides);

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
