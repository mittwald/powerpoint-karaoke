import OpenAI from "openai";

const DEFAULT_MODEL = "gpt-oss-120b";

function getOpenAIClient(): OpenAI {
  if (!process.env.OPENAI_API_KEY) {
    throw new Error("OPENAI_API_KEY environment variable is not set");
  }
  
  const config: {
    apiKey: string;
    baseURL?: string;
  } = {
    apiKey: process.env.OPENAI_API_KEY,
    baseURL: "https://llm.aihosting.mittwald.de/v1",
  };
  
  if (process.env.OPENAI_API_BASE_URL) {
    config.baseURL = process.env.OPENAI_API_BASE_URL;
  }
  
  return new OpenAI(config);
}

function getModel(): string {
  return process.env.OPENAI_MODEL || DEFAULT_MODEL;
}

export async function generatePresentationTitle(keywords: string[], difficulty: string, language: string): Promise<string> {
  try {
    const openai = getOpenAIClient();
    
    const languageInstructions = {
      english: "Generate the title in English.",
      german: "Generate the title in German (Deutsch).",
    };
    
    const difficultyInstructions = {
      easy: "Create a professional-sounding presentation title.",
      medium: "Create a humorous, slightly absurd but still professional-sounding and believable presentation title.",
      hard: "Create a completely ridiculous, over-the-top presentation title that sounds hilariously absurd.",
    };

    const response = await openai.chat.completions.create({
      model: getModel(),
      messages: [
        {
          role: "system",
          content: `You are a creative presentation title generator. ${languageInstructions[language as keyof typeof languageInstructions]} ${difficultyInstructions[difficulty as keyof typeof difficultyInstructions]} The titles should combine the given keywords in unexpected ways. You will answer in plain text, without any formatting.`,
        },
        {
          role: "user",
          content: `Create a presentation title using these keywords: ${keywords.join(", ")}.`,
        },
      ],
    });

    return response.choices[0].message.content?.trim() || "Untitled Presentation";
  } catch (error) {
    console.error("Error generating title:", error);
    throw new Error("Failed to generate presentation title");
  }
}

export async function generatePresenterBio(presenterName: string, keywords: string[], difficulty: string, language: string): Promise<{ bio: string; facts: string[] }> {
  try {
    const openai = getOpenAIClient();
    
    const languageInstructions = {
      english: "Generate all content in English.",
      german: "Generate all content in German (Deutsch).",
    };
    
    const difficultyInstructions = {
      easy: "Create a professional sounding fictional bio with one or two unusual credentials. Add 2 fun facts that are slightly quirky.",
      medium: "Create a moderately absurd, but still professional sounding fictional bio with several ridiculous but creative credentials. Add 3 fun facts that are slightly absurd and humorous.",
      hard: "Create a completely over-the-top, hilariously absurd fictional bio with outrageous credentials and achievements. Add 4 fun facts that are wildly absurd and ridiculous.",
    };

    const factCount = {
      easy: 2,
      medium: 3,
      hard: 3,
    };

    const response = await openai.chat.completions.create({
      model: getModel(),
      messages: [
        {
          role: "system",
          content: `You are creating a fictional presenter biography for a PowerPoint karaoke presentation. ${languageInstructions[language as keyof typeof languageInstructions]} ${difficultyInstructions[difficulty as keyof typeof difficultyInstructions]} Include their expertise related to the keywords. Return a JSON object with "bio" (1-2 sentences) and "facts" (array of ${factCount[difficulty as keyof typeof factCount]} strings).`,
        },
        {
          role: "user",
          content: `Create a bio and fun facts for ${presenterName}, an expert in: ${keywords.join(", ")}.`,
        },
      ],
      response_format: { type: "json_object" },
    });

    const content = response.choices[0].message.content?.trim();
    if (content) {
      const parsed = JSON.parse(content);
      return {
        bio: parsed.bio || `${presenterName}, Expert`,
        facts: parsed.facts || [],
      };
    }
    
    return {
      bio: `${presenterName}, Expert`,
      facts: [],
    };
  } catch (error) {
    console.error("Error generating bio:", error);
    return {
      bio: `${presenterName}, Expert`,
      facts: [],
    };
  }
}

interface SlideSpec {
  type: "photo" | "text" | "quote" | "graph";
  photoSearchTerm?: string;
  text?: string;
  quote?: string;
  quoteAuthor?: string;
  quoteTitle?: string;
  graphTitle?: string;
  graphData?: Array<{ label: string; value: number }>;
}

export async function generatePresentationStructure(
  keywords: string[], 
  difficulty: string,
  language: string
): Promise<SlideSpec[]> {
  try {
    const openai = getOpenAIClient();
    
    const languageInstructions = {
      english: "Generate all text content in English.",
      german: "Generate all text content in German (Deutsch). Use proper German grammar and vocabulary.",
    };
    
    const difficultyInstructions = {
      easy: `Create a coherent, professional presentation structure that follows a logical narrative. 
             - Photo search terms should be relevant to the topic
             - Text slides should have clear, professional statements
             - Quotes should be slightly amusing but believable
             - Graphs should show plausible data
             The presentation should tell a somewhat believable story.`,
      medium: `Create a moderately absurd but creative presentation structure with an entertaining narrative.
               - Mix relevant and slightly off-topic photo search terms
               - Text slides should be humorous and creative
               - Quotes should be moderately absurd with implausible authors
               - Graphs should show creative but unrealistic data
               The presentation should have a quirky, entertaining storyline.`,
      hard: `Create a completely ridiculous, over-the-top absurd presentation structure with a wildly chaotic narrative.
             - Photo search terms should range from relevant to completely random and bizarre
             - Text slides should be hilariously absurd and nonsensical
             - Quotes should be outrageous with ridiculous fake experts
             - Graphs should show wildly implausible, absurd data
             The presentation should be chaotically entertaining and completely absurd.`,
    };

    const response = await openai.chat.completions.create({
      model: getModel(),
      messages: [
        {
          role: "system",
          content: `You are creating a complete PowerPoint karaoke presentation structure. Generate exactly 13 content slides that form a coherent (or absurd, depending on difficulty) narrative story.

${languageInstructions[language as keyof typeof languageInstructions]}

${difficultyInstructions[difficulty as keyof typeof difficultyInstructions]}

Return a JSON object with a "slides" array containing exactly 13 slide objects. Each slide must have:
- "type": one of "photo", "text", "quote", or "graph"

For "photo" slides:
- "photoSearchTerm": a 1-3 word search term for Unsplash (e.g., "mountain sunset", "office meeting", "cat sleeping")

For "text" slides:
- "text": a short, punchy statement (max 15 words)

For "quote" slides:
- "quote": the fake expert quote (1-2 sentences)
- "quoteAuthor": fake expert name
- "quoteTitle": their fake credentials/title

For "graph" slides:
- "graphTitle": the graph title (max 50 chars)
- "graphData": array of 5-7 objects with "label" (string) and "value" (number between 10-100)

Important: Create a narrative arc across all 13 slides that tells a story, even if absurd.`,
        },
        {
          role: "user",
          content: `Create a 13-slide presentation structure about: ${keywords.join(", ")}`,
        },
      ],
      response_format: { type: "json_object" },
    });

    const content = response.choices[0].message.content?.trim();
    if (content) {
      const parsed = JSON.parse(content);
      if (parsed.slides && Array.isArray(parsed.slides)) {
        return parsed.slides;
      }
    }
    
    // Fallback structure
    return [];
  } catch (error) {
    console.error("Error generating presentation structure:", error);
    return [];
  }
}
