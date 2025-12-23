CREATE TABLE "berita" (
	"id" serial PRIMARY KEY NOT NULL,
	"judul" varchar,
	"deskripsi" text,
	"tag" varchar,
	"img" varchar,
	"created_at" timestamp with time zone DEFAULT now(),
	"updated_at" timestamp with time zone DEFAULT now()
);
--> statement-breakpoint