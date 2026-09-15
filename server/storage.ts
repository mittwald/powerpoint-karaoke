import {
  presentations,
  insertPresentationSchema,
  type Presentation,
  type InsertPresentation,
} from "@shared/schema";
import { db } from "./db";
import { eq, getTableColumns } from "drizzle-orm";
import { PgVarchar } from "drizzle-orm/pg-core";
import postgres from "postgres";

export interface IStorage {
  createPresentation(presentation: InsertPresentation): Promise<Presentation>;
  getPresentation(id: string): Promise<Presentation | undefined>;
}

export interface FieldIssue {
  field: string;
  message: string;
}

/** The presentation did not pass validation and was not sent to the database. */
export class InvalidPresentationError extends Error {
  constructor(public readonly issues: FieldIssue[]) {
    super(`Invalid presentation: ${issues.map((i) => `${i.field}: ${i.message}`).join("; ")}`);
    this.name = "InvalidPresentationError";
  }
}

/** The database rejected the insert. */
export class PresentationSaveError extends Error {
  constructor(public readonly cause: unknown) {
    super("Failed to save presentation");
    this.name = "PresentationSaveError";
  }
}

/**
 * Describes every length-bounded column of the insert. Postgres does not name
 * the column in "value too long" errors (22001), so this is what makes such a
 * failure diagnosable from the log alone.
 */
function describeBoundedColumns(values: InsertPresentation) {
  return Object.entries(getTableColumns(presentations))
    .filter(([, column]) => column instanceof PgVarchar && column.length !== undefined)
    .map(([key, column]) => {
      const value = values[key as keyof InsertPresentation];
      const length = typeof value === "string" ? value.length : undefined;
      return {
        column: column.name,
        value,
        length,
        schemaMaxLength: (column as PgVarchar<any>).length,
      };
    });
}

export class DatabaseStorage implements IStorage {
  async createPresentation(insertPresentation: InsertPresentation): Promise<Presentation> {
    const validation = insertPresentationSchema.safeParse(insertPresentation);
    if (!validation.success) {
      const issues = validation.error.issues.map((issue) => ({
        field: issue.path.join(".") || "(root)",
        message: issue.message,
      }));
      console.error("Refusing to insert invalid presentation:", {
        issues,
        boundedColumns: describeBoundedColumns(insertPresentation),
      });
      throw new InvalidPresentationError(issues);
    }

    try {
      const [presentation] = await db
        .insert(presentations)
        .values(insertPresentation)
        .returning();
      return presentation;
    } catch (error) {
      if (error instanceof postgres.PostgresError) {
        console.error("Database rejected presentation insert:", {
          code: error.code,
          message: error.message,
          column: error.column_name,
          constraint: error.constraint_name,
          detail: error.detail,
          boundedColumns: describeBoundedColumns(insertPresentation),
        });
      }
      throw new PresentationSaveError(error);
    }
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
