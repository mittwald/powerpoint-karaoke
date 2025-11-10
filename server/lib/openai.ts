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

export async function generatePresentationTitle(keywords: string[]): Promise<string> {
  try {
    const openai = getOpenAIClient();
    const response = await openai.chat.completions.create({
      model: "gpt-5",
      messages: [
        {
          role: "system",
          content: "You are a creative presentation title generator. Create subtly humorous, professional-sounding presentation titles that combine the given keywords in unexpected ways. The titles should sound like they could be from a corporate presentation or TED talk, but with a comedic twist.",
        },
        {
          role: "user",
          content: `Create a presentation title using these three keywords: ${keywords.join(", ")}. Make it sound professional but subtly funny.`,
        },
      ],
    });

    return response.choices[0].message.content?.trim() || "Untitled Presentation";
  } catch (error) {
    console.error("Error generating title:", error);
    throw new Error("Failed to generate presentation title");
  }
}

export async function generateSlideText(topic: string, slideNumber: number): Promise<string> {
  try {
    const openai = getOpenAIClient();
    const response = await openai.chat.completions.create({
      model: "gpt-5",
      messages: [
        {
          role: "system",
          content: "You are creating text slides for a PowerPoint karaoke presentation. Generate short, punchy statements that could appear on a presentation slide. They should be vaguely related to the topic and sound professional but slightly absurd.",
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
