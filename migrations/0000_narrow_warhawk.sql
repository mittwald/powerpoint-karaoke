CREATE TABLE "presentations" (
	"id" varchar PRIMARY KEY NOT NULL,
	"title" text NOT NULL,
	"keywords" text[] NOT NULL,
	"presenter_name" text NOT NULL,
	"difficulty" varchar(10) NOT NULL,
	"language" varchar(10) NOT NULL,
	"slides" jsonb NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
