import { presentations, type Presentation, type InsertPresentation } from "@shared/schema";
import { db } from "./db";
import { eq } from "drizzle-orm";

export interface IStorage {
  createPresentation(presentation: InsertPresentation): Promise<Presentation>;
  getPresentation(id: string): Promise<Presentation | undefined>;
}

export class DatabaseStorage implements IStorage {
  async createPresentation(insertPresentation: InsertPresentation): Promise<Presentation> {
    const [presentation] = await db
      .insert(presentations)
      .values(insertPresentation)
      .returning();
    return presentation;
  }

  async getPresentation(id: string): Promise<Presentation | undefined> {
    const [presentation] = await db
      .select()
      .from(presentations)
      .where(eq(presentations.id, id));
    return presentation || undefined;
  }
}

export const storage = new DatabaseStorage();
