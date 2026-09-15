-- Migration 0001 (varchar(20)) was committed with a journal timestamp older than
-- 0000, so drizzle's migrator silently skipped it on databases that already had
-- 0000 applied. This migration re-applies the widening with a correct timestamp.
-- Production was hotfixed to varchar(50) by hand, so the ALTER below is a no-op there.
ALTER TABLE "presentations" ALTER COLUMN "language" SET DATA TYPE varchar(50);--> statement-breakpoint
ALTER TABLE "presentations" ADD CONSTRAINT "presentations_difficulty_check" CHECK ("presentations"."difficulty" IN ('easy', 'medium', 'hard'));
