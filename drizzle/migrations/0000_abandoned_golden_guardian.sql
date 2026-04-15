CREATE TYPE "public"."accent_color" AS ENUM('ia', 'cloud', 'staffing', 'finops', 'dev');--> statement-breakpoint
CREATE TYPE "public"."content_status" AS ENUM('draft', 'published', 'scheduled', 'archived');--> statement-breakpoint
CREATE TYPE "public"."landing_status" AS ENUM('draft', 'published', 'archived');--> statement-breakpoint
CREATE TYPE "public"."milestone_type" AS ENUM('founding', 'growth', 'award', 'expansion', 'product');--> statement-breakpoint
CREATE TYPE "public"."page_type" AS ENUM('contact', 'privacy', 'support', 'careers');--> statement-breakpoint
CREATE TYPE "public"."service_type_enum" AS ENUM('hub', 'sub');--> statement-breakpoint
CREATE TYPE "public"."translation_status" AS ENUM('complete', 'partial', 'pending', 'auto');--> statement-breakpoint
CREATE TYPE "public"."user_role" AS ENUM('admin', 'editor');--> statement-breakpoint
CREATE TABLE "contacts" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(255) NOT NULL,
	"email" varchar(255) NOT NULL,
	"company" varchar(255) NOT NULL,
	"service" varchar(50) NOT NULL,
	"message" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "posts" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"slug" varchar(255) NOT NULL,
	"title" varchar(500) NOT NULL,
	"excerpt" text NOT NULL,
	"content" text NOT NULL,
	"category" varchar(50) NOT NULL,
	"read_time" varchar(20) NOT NULL,
	"published_at" timestamp DEFAULT now() NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "posts_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "admin_activity_log" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid,
	"action" varchar(100) NOT NULL,
	"entity_type" varchar(100) NOT NULL,
	"entity_id" varchar(255),
	"details" jsonb,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "admin_users" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"email" varchar(255) NOT NULL,
	"password_hash" text NOT NULL,
	"name" varchar(255) NOT NULL,
	"role" "user_role" DEFAULT 'editor' NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"must_change_password" boolean DEFAULT true NOT NULL,
	"last_login" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "admin_users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "blog_categories" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"slug" varchar(255) NOT NULL,
	"name_es" varchar(255) NOT NULL,
	"name_en" varchar(255),
	"color" varchar(50),
	"icon" varchar(100),
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "blog_categories_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "blog_posts" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"slug" varchar(255) NOT NULL,
	"title_es" varchar(500) NOT NULL,
	"title_en" varchar(500),
	"excerpt_es" text,
	"excerpt_en" text,
	"content_es" text,
	"content_en" text,
	"cover_image" text,
	"cover_image_alt_es" varchar(500),
	"cover_image_alt_en" varchar(500),
	"author_id" uuid,
	"category_id" uuid,
	"tags" jsonb DEFAULT '[]'::jsonb,
	"seo_title_es" varchar(255),
	"seo_title_en" varchar(255),
	"seo_description_es" text,
	"seo_description_en" text,
	"og_image" text,
	"reading_time_minutes" integer,
	"status" "content_status" DEFAULT 'draft' NOT NULL,
	"translation_status_en" "translation_status" DEFAULT 'pending' NOT NULL,
	"published_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"deleted_at" timestamp,
	CONSTRAINT "blog_posts_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "casos_exito" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"slug" varchar(255) NOT NULL,
	"client_name" varchar(255) NOT NULL,
	"client_logo" text,
	"client_country" varchar(100),
	"client_sector" varchar(100),
	"title_es" varchar(500) NOT NULL,
	"title_en" varchar(500),
	"challenge_es" text,
	"challenge_en" text,
	"solution_es" text,
	"solution_en" text,
	"results_es" text,
	"results_en" text,
	"metric_1_value" varchar(100),
	"metric_1_label_es" varchar(255),
	"metric_1_label_en" varchar(255),
	"metric_2_value" varchar(100),
	"metric_2_label_es" varchar(255),
	"metric_2_label_en" varchar(255),
	"metric_3_value" varchar(100),
	"metric_3_label_es" varchar(255),
	"metric_3_label_en" varchar(255),
	"testimonial_quote_es" text,
	"testimonial_quote_en" text,
	"testimonial_author" varchar(255),
	"testimonial_role" varchar(255),
	"cover_image" text,
	"gallery" jsonb DEFAULT '[]'::jsonb,
	"services_used" jsonb DEFAULT '[]'::jsonb,
	"featured" boolean DEFAULT false NOT NULL,
	"seo_title_es" varchar(255),
	"seo_title_en" varchar(255),
	"seo_description_es" text,
	"seo_description_en" text,
	"status" "content_status" DEFAULT 'draft' NOT NULL,
	"translation_status_en" "translation_status" DEFAULT 'pending' NOT NULL,
	"published_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"deleted_at" timestamp,
	CONSTRAINT "casos_exito_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "certificaciones" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name_es" varchar(255) NOT NULL,
	"name_en" varchar(255),
	"issuer" varchar(255),
	"year" integer,
	"logo" text,
	"certificate_url" text,
	"description_es" text,
	"description_en" text,
	"sort_order" integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
CREATE TABLE "historia_items" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"year" integer NOT NULL,
	"month" integer,
	"title_es" varchar(500) NOT NULL,
	"title_en" varchar(500),
	"description_es" text,
	"description_en" text,
	"icon" varchar(100),
	"image" text,
	"milestone_type" "milestone_type" DEFAULT 'growth' NOT NULL,
	"sort_order" integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
CREATE TABLE "home_content" (
	"id" varchar(50) PRIMARY KEY DEFAULT 'main' NOT NULL,
	"hero_badge_es" varchar(255),
	"hero_badge_en" varchar(255),
	"hero_title_es" text,
	"hero_title_en" text,
	"hero_subtitle_es" text,
	"hero_subtitle_en" text,
	"hero_cta_primary_es" varchar(255),
	"hero_cta_primary_en" varchar(255),
	"hero_cta_secondary_es" varchar(255),
	"hero_cta_secondary_en" varchar(255),
	"hero_image" text,
	"metrics" jsonb,
	"trust_bar_logos" jsonb,
	"services_section_title_es" varchar(500),
	"services_section_title_en" varchar(500),
	"cases_section_title_es" varchar(500),
	"cases_section_title_en" varchar(500),
	"faqs" jsonb,
	"final_cta_title_es" text,
	"final_cta_title_en" text,
	"final_cta_copy_es" text,
	"final_cta_copy_en" text,
	"industrias_hub_title_es" text,
	"industrias_hub_title_en" text,
	"industrias_hub_subtitle_es" text,
	"industrias_hub_subtitle_en" text,
	"industrias_hub_stat_es" text,
	"industrias_hub_stat_en" text,
	"process_section_title_es" text,
	"process_section_title_en" text,
	"process_section_subtitle_es" text,
	"process_section_subtitle_en" text,
	"process_steps" jsonb,
	"translation_status_en" "translation_status" DEFAULT 'pending' NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "industrias" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"slug_es" varchar(255) NOT NULL,
	"slug_en" varchar(255),
	"icon" varchar(100),
	"accent_color" "accent_color" DEFAULT 'dev' NOT NULL,
	"name_es" varchar(255) NOT NULL,
	"name_en" varchar(255),
	"hero_title_es" varchar(500),
	"hero_title_en" varchar(500),
	"hero_subtitle_es" text,
	"hero_subtitle_en" text,
	"pain_points" jsonb,
	"solutions" jsonb,
	"caso_destacado_id" uuid,
	"differentiators" jsonb,
	"metrics" jsonb,
	"stat_highlights" jsonb,
	"regulations" jsonb,
	"use_cases" jsonb,
	"playbook" jsonb,
	"industry_faqs" jsonb,
	"tech_stack" jsonb,
	"services_highlight" jsonb,
	"related_case_slugs" jsonb,
	"cta_title_es" text,
	"cta_title_en" text,
	"cta_primary_text_es" varchar(255),
	"cta_primary_text_en" varchar(255),
	"cta_primary_url" varchar(500),
	"hub_intro_title_es" text,
	"hub_intro_title_en" text,
	"hub_intro_subtitle_es" text,
	"hub_intro_subtitle_en" text,
	"cta_text_es" varchar(255),
	"cta_text_en" varchar(255),
	"seo_title_es" varchar(255),
	"seo_title_en" varchar(255),
	"seo_description_es" text,
	"seo_description_en" text,
	"status" "content_status" DEFAULT 'draft' NOT NULL,
	"translation_status_en" "translation_status" DEFAULT 'pending' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"deleted_at" timestamp,
	CONSTRAINT "industrias_slug_es_unique" UNIQUE("slug_es"),
	CONSTRAINT "industrias_slug_en_unique" UNIQUE("slug_en")
);
--> statement-breakpoint
CREATE TABLE "landing_pages" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"slug" varchar(255) NOT NULL,
	"campaign_name" varchar(255) NOT NULL,
	"service_type" "accent_color",
	"accent_color_lp" "accent_color" DEFAULT 'dev' NOT NULL,
	"noindex" boolean DEFAULT true NOT NULL,
	"meta_title" varchar(255),
	"meta_description" text,
	"og_image" text,
	"blocks" jsonb,
	"form_destination" varchar(50),
	"form_webhook_url" text,
	"whatsapp_message" text,
	"utm_campaign" varchar(255),
	"utm_source" varchar(255),
	"utm_medium" varchar(255),
	"pixel_facebook" boolean DEFAULT false NOT NULL,
	"google_ads_tag" varchar(255),
	"status" "landing_status" DEFAULT 'draft' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "landing_pages_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "leads" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"nombre" varchar(255) NOT NULL,
	"empresa" varchar(255) NOT NULL,
	"email" varchar(255) NOT NULL,
	"servicio" varchar(100),
	"fuente" varchar(100) NOT NULL,
	"status" varchar(50) DEFAULT 'nuevo' NOT NULL,
	"mensaje" text,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "media" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"filename" varchar(500) NOT NULL,
	"original_name" varchar(500) NOT NULL,
	"url" text NOT NULL,
	"alt_es" varchar(500),
	"alt_en" varchar(500),
	"size_bytes" integer,
	"mime_type" varchar(100),
	"width" integer,
	"height" integer,
	"uploaded_by" uuid,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "nav_config" (
	"id" varchar(50) PRIMARY KEY DEFAULT 'main' NOT NULL,
	"mega_menu" jsonb,
	"footer" jsonb,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "pages_general" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"slug_es" varchar(255) NOT NULL,
	"slug_en" varchar(255),
	"page_type" "page_type" NOT NULL,
	"title_es" varchar(500) NOT NULL,
	"title_en" varchar(500),
	"content_es" jsonb,
	"content_en" jsonb,
	"seo_title_es" varchar(255),
	"seo_title_en" varchar(255),
	"seo_description_es" text,
	"seo_description_en" text,
	"translation_status_en" "translation_status" DEFAULT 'pending' NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "pages_general_slug_es_unique" UNIQUE("slug_es"),
	CONSTRAINT "pages_general_slug_en_unique" UNIQUE("slug_en")
);
--> statement-breakpoint
CREATE TABLE "servicios" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"slug_es" varchar(255) NOT NULL,
	"slug_en" varchar(255),
	"parent_id" uuid,
	"service_type" "service_type_enum" DEFAULT 'sub' NOT NULL,
	"accent_color" "accent_color" DEFAULT 'dev' NOT NULL,
	"icon" varchar(100),
	"title_es" varchar(500) NOT NULL,
	"title_en" varchar(500),
	"subtitle_es" text,
	"subtitle_en" text,
	"description_es" text,
	"description_en" text,
	"benefits" jsonb,
	"process_steps" jsonb,
	"metrics" jsonb,
	"faqs" jsonb,
	"cta_primary_text_es" varchar(255),
	"cta_primary_text_en" varchar(255),
	"cta_primary_url" varchar(500),
	"cta_secondary_text_es" varchar(255),
	"cta_secondary_text_en" varchar(255),
	"cta_secondary_url" varchar(500),
	"cover_image" text,
	"seo_title_es" varchar(255),
	"seo_title_en" varchar(255),
	"seo_description_es" text,
	"seo_description_en" text,
	"schema_service_json" jsonb,
	"hub_metrics" jsonb,
	"framework_title_es" text,
	"framework_title_en" text,
	"framework_subtitle_es" text,
	"framework_subtitle_en" text,
	"framework_pillars" jsonb,
	"sectors_title_es" text,
	"sectors_title_en" text,
	"sectors" jsonb,
	"sort_order" integer DEFAULT 0 NOT NULL,
	"status" "content_status" DEFAULT 'draft' NOT NULL,
	"translation_status_en" "translation_status" DEFAULT 'pending' NOT NULL,
	"published_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"deleted_at" timestamp,
	CONSTRAINT "servicios_slug_es_unique" UNIQUE("slug_es"),
	CONSTRAINT "servicios_slug_en_unique" UNIQUE("slug_en")
);
--> statement-breakpoint
CREATE TABLE "site_config" (
	"id" varchar(50) PRIMARY KEY DEFAULT 'main' NOT NULL,
	"site_name_es" varchar(255),
	"site_name_en" varchar(255),
	"tagline_es" text,
	"tagline_en" text,
	"default_og_image" text,
	"phone_whatsapp" varchar(50),
	"email_contact" varchar(255),
	"address_bogota" text,
	"address_miami" text,
	"linkedin_url" text,
	"google_analytics_id" varchar(100),
	"google_tag_manager_id" varchar(100),
	"llms_txt_content" text,
	"llms_full_txt_content" text,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "team_members" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"slug" varchar(255) NOT NULL,
	"name" varchar(255) NOT NULL,
	"role_es" varchar(255),
	"role_en" varchar(255),
	"bio_es" text,
	"bio_en" text,
	"photo" text,
	"linkedin_url" text,
	"is_founder" boolean DEFAULT false NOT NULL,
	"is_featured" boolean DEFAULT false NOT NULL,
	"sort_order" integer DEFAULT 0 NOT NULL,
	"status" "content_status" DEFAULT 'draft' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "team_members_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
ALTER TABLE "admin_activity_log" ADD CONSTRAINT "admin_activity_log_user_id_admin_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."admin_users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "blog_posts" ADD CONSTRAINT "blog_posts_author_id_admin_users_id_fk" FOREIGN KEY ("author_id") REFERENCES "public"."admin_users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "blog_posts" ADD CONSTRAINT "blog_posts_category_id_blog_categories_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."blog_categories"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "media" ADD CONSTRAINT "media_uploaded_by_admin_users_id_fk" FOREIGN KEY ("uploaded_by") REFERENCES "public"."admin_users"("id") ON DELETE no action ON UPDATE no action;