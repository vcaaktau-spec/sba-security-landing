CREATE TYPE "public"."category" AS ENUM('cctv', 'network', 'access', 'fire');--> statement-breakpoint
CREATE TYPE "public"."environment" AS ENUM('indoor', 'outdoor', 'universal');--> statement-breakpoint
CREATE TYPE "public"."status" AS ENUM('active', 'warning', 'offline');--> statement-breakpoint
CREATE TABLE "documents" (
	"id" text PRIMARY KEY NOT NULL,
	"project_id" text,
	"name" text NOT NULL,
	"url" text NOT NULL,
	"size" text NOT NULL,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "equipment_prices" (
	"key" text PRIMARY KEY NOT NULL,
	"label" text NOT NULL,
	"price" integer NOT NULL,
	"source_url" text,
	"ok" boolean DEFAULT true NOT NULL,
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "products" (
	"id" text PRIMARY KEY NOT NULL,
	"category" "category" NOT NULL,
	"environment" "environment" DEFAULT 'universal' NOT NULL,
	"name" text NOT NULL,
	"brand" text,
	"image_url" text,
	"specs" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"base_price" integer NOT NULL,
	"price_tier_key" text,
	"active" boolean DEFAULT true NOT NULL,
	"sort_order" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "projects" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"category" "category" NOT NULL,
	"name" text NOT NULL,
	"address" text NOT NULL,
	"status" "status" DEFAULT 'active' NOT NULL,
	"price" text DEFAULT 'По запросу',
	"image_url" text,
	"show_on_main" boolean DEFAULT false NOT NULL,
	"equipment" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"credentials" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"maintenance_days" integer,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "sba_plans" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"name" text NOT NULL,
	"data" jsonb NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
ALTER TABLE "documents" ADD CONSTRAINT "documents_project_id_projects_id_fk" FOREIGN KEY ("project_id") REFERENCES "public"."projects"("id") ON DELETE cascade ON UPDATE no action;