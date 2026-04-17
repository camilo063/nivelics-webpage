CREATE TABLE "ui_labels" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"key" varchar(120) NOT NULL,
	"label_es" text NOT NULL,
	"label_en" text NOT NULL,
	"category" varchar(50),
	"description" text,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "ui_labels_key_unique" UNIQUE("key")
);
