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

export async function generatePresentationTitle(keywords: string[], difficulty: string): Promise<string> {
  try {
    const openai = getOpenAIClient();
    
    const difficultyInstructions = {
      easy: "Create a subtly humorous, professional-sounding presentation title.",
      medium: "Create a moderately absurd but still believable presentation title.",
      hard: "Create a completely ridiculous, over-the-top presentation title that sounds hilariously absurd.",
    };

    const response = await openai.chat.completions.create({
      model: getModel(),
      messages: [
        {
          role: "system",
          content: `You are a creative presentation title generator. ${difficultyInstructions[difficulty as keyof typeof difficultyInstructions]} The titles should combine the given keywords in unexpected ways.`,
        },
        {
          role: "user",
          content: `Create a presentation title using these three keywords: ${keywords.join(", ")}.`,
        },
      ],
    });

    return response.choices[0].message.content?.trim() || "Untitled Presentation";
  } catch (error) {
    console.error("Error generating title:", error);
    throw new Error("Failed to generate presentation title");
  }
}

export async function generatePresenterBio(presenterName: string, keywords: string[], difficulty: string): Promise<{ bio: string; facts: string[] }> {
  try {
    const openai = getOpenAIClient();
    
    const difficultyInstructions = {
      easy: "Create a mildly amusing fictional bio with one or two unusual credentials. Add 2-3 fun facts that are slightly quirky.",
      medium: "Create a moderately absurd fictional bio with several ridiculous but creative credentials. Add 3-4 fun facts that are absurd and humorous.",
      hard: "Create a completely over-the-top, hilariously absurd fictional bio with outrageous credentials and achievements. Add 4-5 fun facts that are wildly absurd and ridiculous.",
    };

    const factCount = {
      easy: 3,
      medium: 4,
      hard: 5,
    };

    const response = await openai.chat.completions.create({
      model: getModel(),
      messages: [
        {
          role: "system",
          content: `You are creating a fictional presenter biography for a PowerPoint karaoke presentation. ${difficultyInstructions[difficulty as keyof typeof difficultyInstructions]} Include their expertise related to the keywords. Return a JSON object with "bio" (2-3 sentences) and "facts" (array of ${factCount[difficulty as keyof typeof factCount]} strings).`,
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

export async function generateSlideText(topic: string, slideNumber: number, difficulty: string): Promise<string> {
  try {
    const openai = getOpenAIClient();
    
    const difficultyInstructions = {
      easy: "Generate slightly amusing but believable statements.",
      medium: "Generate moderately absurd but creative statements.",
      hard: "Generate completely ridiculous, over-the-top absurd statements.",
    };

    const response = await openai.chat.completions.create({
      model: getModel(),
      messages: [
        {
          role: "system",
          content: `You are creating text slides for a PowerPoint karaoke presentation. Generate short, punchy statements that could appear on a presentation slide. They should be vaguely related to the topic. ${difficultyInstructions[difficulty as keyof typeof difficultyInstructions]}`,
        },
        {
          role: "user",
          content: `Generate a short slide text (max 10 words) for slide #${slideNumber} about: ${topic}`,
        },
      ],
    });

    return response.choices[0].message.content?.trim() || "Key Insight";
  } catch (error) {
    console.error("Error generating slide text:", error);
    return "Key Takeaway";
  }
}

export async function generateGraphData(topic: string, difficulty: string): Promise<{ title: string; data: Array<{ label: string; value: number }> }> {
  try {
    const openai = getOpenAIClient();
    
    const difficultyInstructions = {
      easy: "Generate a mildly amusing graph with plausible-sounding data.",
      medium: "Generate a moderately absurd graph with creative but implausible data.",
      hard: "Generate a completely ridiculous graph with wildly absurd and hilarious data.",
    };

    const response = await openai.chat.completions.create({
      model: getModel(),
      messages: [
        {
          role: "system",
          content: `You are creating graph data for a PowerPoint karaoke presentation. ${difficultyInstructions[difficulty as keyof typeof difficultyInstructions]} Return a JSON object with "title" (graph title, max 50 chars) and "data" (array of 5-7 objects with "label" and "value" fields). Values should be between 10 and 100.`,
        },
        {
          role: "user",
          content: `Generate graph data related to: ${topic}`,
        },
      ],
      response_format: { type: "json_object" },
    });

    const content = response.choices[0].message.content?.trim();
    if (content) {
      const parsed = JSON.parse(content);
      return {
        title: parsed.title || "Data Analysis",
        data: parsed.data || [],
      };
    }
    
    return {
      title: "Data Analysis",
      data: [],
    };
  } catch (error) {
    console.error("Error generating graph data:", error);
    return {
      title: "Data Analysis",
      data: [],
    };
  }
}

export async function generateQuote(topic: string, difficulty: string): Promise<{ quote: string; author: string; title: string }> {
  try {
    const openai = getOpenAIClient();
    
    const difficultyInstructions = {
      easy: "Generate a slightly humorous fake expert quote with a believable author name and title.",
      medium: "Generate a moderately absurd fake expert quote with a creative but implausible author and title.",
      hard: "Generate a completely ridiculous and hilarious fake expert quote with an absurd author name and outrageous title.",
    };

    const response = await openai.chat.completions.create({
      model: getModel(),
      messages: [
        {
          role: "system",
          content: `You are creating fake expert quotes for a PowerPoint karaoke presentation. ${difficultyInstructions[difficulty as keyof typeof difficultyInstructions]} Return a JSON object with "quote" (the fake quote, 1-2 sentences), "author" (fake expert name), and "title" (their fake credentials/title).`,
        },
        {
          role: "user",
          content: `Generate a fake expert quote related to: ${topic}`,
        },
      ],
      response_format: { type: "json_object" },
    });

    const content = response.choices[0].message.content?.trim();
    if (content) {
      const parsed = JSON.parse(content);
      return {
        quote: parsed.quote || "This is groundbreaking.",
        author: parsed.author || "Dr. Expert",
        title: parsed.title || "Leading Authority",
      };
    }
    
    return {
      quote: "This is groundbreaking.",
      author: "Dr. Expert",
      title: "Leading Authority",
    };
  } catch (error) {
    console.error("Error generating quote:", error);
    return {
      quote: "This is groundbreaking.",
      author: "Dr. Expert",
      title: "Leading Authority",
    };
  }
}
