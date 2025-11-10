import OpenAI from "openai";

// the newest OpenAI model is "gpt-5" which was released August 7, 2025. do not change this unless explicitly requested by the user
function getOpenAIClient(): OpenAI {
  if (!process.env.OPENAI_API_KEY) {
    throw new Error("OPENAI_API_KEY environment variable is not set");
  }
  return new OpenAI({ 
    apiKey: process.env.OPENAI_API_KEY 
  });
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
      model: "gpt-5",
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
      model: "gpt-5",
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
      model: "gpt-5",
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
