ALTER TABLE "leads" ALTER COLUMN "empresa" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "leads" ADD COLUMN "referrer_url" varchar(500);