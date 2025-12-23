CREATE TABLE "master_inovasi" (
	"id" serial PRIMARY KEY NOT NULL,
	"judul" varchar,
	"gambar" varchar,
	"file" varchar,
	"keterangan" text,
	"created_at" timestamp with time zone DEFAULT now(),
	"updated_at" timestamp with time zone DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "master_provinsi" (
	"id" serial PRIMARY KEY NOT NULL,
	"created_at" timestamp with time zone DEFAULT now(),
	"id_provinsi" integer,
	"nama_provinsi" varchar
);
--> statement-breakpoint
CREATE TABLE "provinsi" (
	"id" serial PRIMARY KEY NOT NULL,
	"nama" varchar,
	"svg_path" text,
	"id_provinsi" integer,
	"created_at" timestamp with time zone DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" serial PRIMARY KEY NOT NULL,
	"username" varchar(255),
	"email" varchar(255),
	"password" text,
	"role" varchar(50),
	"is_verified" boolean DEFAULT false,
	"created_at" timestamp with time zone DEFAULT now(),
	"updated_at" timestamp with time zone DEFAULT now()
);
