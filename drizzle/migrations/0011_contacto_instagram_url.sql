-- site_config.instagram_url: perfil de Instagram administrable desde /admin/configuracion.
-- Junto con linkedin_url alimenta el `sameAs` de Organization/LocalBusiness y los iconos del pie.
ALTER TABLE "site_config" ADD COLUMN IF NOT EXISTS "instagram_url" text;--> statement-breakpoint
-- Las 6 columnas de `leads` que siguen ya existen en producción: se crearon con
-- scripts/add-utm-columns-leads.ts y scripts/add-leads-spam-columns.ts sin pasar por una
-- migración, así que el snapshot de Drizzle venía desfasado y drizzle-kit las volvió a
-- proponer aquí. Van con IF NOT EXISTS para cerrar el desfase sin romper la BD actual.
ALTER TABLE "leads" ADD COLUMN IF NOT EXISTS "utm_source" varchar(255);--> statement-breakpoint
ALTER TABLE "leads" ADD COLUMN IF NOT EXISTS "utm_medium" varchar(255);--> statement-breakpoint
ALTER TABLE "leads" ADD COLUMN IF NOT EXISTS "utm_campaign" varchar(255);--> statement-breakpoint
ALTER TABLE "leads" ADD COLUMN IF NOT EXISTS "utm_content" varchar(255);--> statement-breakpoint
ALTER TABLE "leads" ADD COLUMN IF NOT EXISTS "is_spam" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "leads" ADD COLUMN IF NOT EXISTS "spam_reason" varchar(50);
