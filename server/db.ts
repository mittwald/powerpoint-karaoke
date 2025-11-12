import postgres from 'postgres';
import { drizzle } from 'drizzle-orm/postgres-js';
import * as schema from "@shared/schema";

if (!process.env.DATABASE_URL) {
  throw new Error(
    "DATABASE_URL must be set. Did you forget to provision a database?",
  );
}

// Standard PostgreSQL client - works with any PostgreSQL database on port 5432
export const client = postgres(process.env.DATABASE_URL);
export const db = drizzle(client, { schema });
