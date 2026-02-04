import OpenAI from "openai";
import { observeOpenAI } from "@langfuse/openai";
import { LangfuseClient } from "@langfuse/client";
import { updateActiveObservation } from "@langfuse/tracing";
import {Difficulty, promptNames} from "./prompts.ts";

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

  return observeOpenAI(new OpenAI(config));
}

function getModel(): string {
  return process.env.OPENAI_MODEL || DEFAULT_MODEL;
}

export async function generatePresentationTitle(
  keywords: string[],
  difficulty: Difficulty,
  language: string,
  langfuse: LangfuseClient,
): Promise<string> {
  try {
    const openai = getOpenAIClient();
    const prompt = await langfuse.prompt.get(promptNames.generateTitle(difficulty), {
      type: "chat",
    });

    updateActiveObservation({ prompt }, { asType: "generation" });

    const messages = prompt.compile({
      language,
      keywords: keywords.join(", "),
    });

    const response = await openai.chat.completions.create({
      model: getModel(),
      messages,
    });

    return (
      response.choices[0].message.content?.trim() || "Untitled Presentation"
    );
  } catch (error) {
    console.error("Error generating title:", error);
    throw new Error("Failed to generate presentation title");
  }
}

export async function generatePresenterBio(
  presenterName: string,
  keywords: string[],
  difficulty: Difficulty,
  language: string,
  langfuse: LangfuseClient,
): Promise<{ bio: string; facts: string[] }> {
  try {
    const openai = getOpenAIClient();
    const prompt = await langfuse.prompt.get(promptNames.generatePresenterBio(difficulty), {
      type: "chat",
    });

    updateActiveObservation({ prompt }, { asType: "generation" });

    const messages = prompt.compile({
      language,
      presenterName,
      keywords: keywords.join(", "),
    });

    const response = await openai.chat.completions.create({
      model: getModel(),
      messages,
      response_format: { type: "json_object" },
    });

    const content = response.choices[0].message.content?.trim();
    if (content) {
      const parsed = JSON.parse(content);

      // Enforce length limits with truncation and type safety
      const rawBio = parsed.bio;
      const bio = String(rawBio || `${presenterName}, Expert`).substring(
        0,
        200,
      );

      const rawFacts = parsed.facts;
      const facts = Array.isArray(rawFacts)
        ? rawFacts
            .slice(0, 3)
            .map((fact: unknown) => String(fact).substring(0, 120))
        : [];

      return { bio, facts };
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
  difficulty: Difficulty,
  language: string,
  slideCount: number = 15,
  langfuse: LangfuseClient,
): Promise<SlideSpec[]> {
  try {
    const openai = getOpenAIClient();
    const dynamicSlideCount = slideCount - 3; // Reserve 3 slides for title, bio and thank you
    const prompt = await langfuse.prompt.get(promptNames.generatePresentationStructure(difficulty), {
      type: "chat",
    });

    updateActiveObservation({ prompt }, { asType: "generation" });

    const messages = prompt.compile({
      language,
      difficulty,
      dynamicSlideCount: String(dynamicSlideCount),
      keywords: keywords.join(", "),
    });

    const response = await openai.chat.completions.create({
      model: getModel(),
      messages,
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

export async function moderateUserInput(
  keywords: string[],
  presenterName: string,
  langfuse: LangfuseClient,
): Promise<{ allowed: boolean; reason?: string }> {
  try {
    const openai = getOpenAIClient();

    const prompt = await langfuse.prompt.get("input-moderation", {
      type: "chat",
    });

    updateActiveObservation({ prompt }, { asType: "generation" });

    const messages = prompt.compile({
      keywords: keywords.join(", "),
      presenterName,
    });

    const response = await openai.chat.completions.create({
      model: getModel(),
      messages,
      response_format: { type: "json_object" },
      temperature: 0.1, // Low temperature for consistent moderation
    });

    const content = response.choices[0].message.content?.trim();
    if (content) {
      const parsed = JSON.parse(content);
      return {
        allowed: parsed.allowed === true,
        reason: parsed.reason || undefined,
      };
    }

    // If parsing fails, fail-closed (block)
    return {
      allowed: false,
      reason: "Moderation check failed",
    };
  } catch (error) {
    console.error("Error in content moderation:", error);
    // FAIL-CLOSED: If moderation fails, block the request
    return {
      allowed: false,
      reason: "Moderation service unavailable",
    };
  }
}
