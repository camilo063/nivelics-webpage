/* eslint-disable @typescript-eslint/no-explicit-any */
import { drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";
import { eq } from "drizzle-orm";
import { servicios } from "../lib/db/schema/admin";

const SUBSERVICE_ICONS: Record<string, string> = {
  "agentes-ia": "dia-pulse",
  "agentes-comerciales": "arc-person",
  "automatizacion-procesos": "dia-flow",
  "gestion-contenido": "arc-doc",
  "marketing-crm": "dia-target",
  finops: "hex-chart",
  "migracion-aws": "hex-migrate",
  infraestructura: "hex-nodes",
  "seguridad-cloud": "oct-shield",
  serverless: "hex-cycle",
  "desarrollo-software": "tri-growth",
  "datos-ia": "dia-trend",
  "devops-cloud": "tri-deploy",
  "diseno-ux-ui": "dia-search",
  "qa-seguridad": "tri-check",
  "sitios-web-agentic": "hex-nodes",
  "apps-moviles": "tri-rocket",
  ecommerce: "hex-plus",
  "plataformas-web": "oct-cube",
};

const BENEFIT_ICON_MAP: Record<string, string> = {
  bot: "dia-pulse",
  zap: "tri-rocket",
  shield: "oct-shield",
  "shield-check": "tri-check",
  "shield-alert": "oct-scan",
  "test-tube": "tri-check",
  "git-merge": "tri-deploy",
  cloud: "hex-cloud",
  "file-code": "oct-code",
  layers: "hex-nodes",
  server: "hex-migrate",
  "clipboard-check": "hex-check",
  gauge: "hex-chart",
  users: "tri-person",
  "user-check": "tri-person",
  "trending-up": "tri-growth",
  database: "dia-trend",
  search: "dia-search",
  brain: "dia-pulse",
  code: "oct-code",
  lock: "oct-lock",
  activity: "oct-monitor",
  smartphone: "tri-rocket",
  "shopping-cart": "hex-plus",
  target: "dia-target",
  "file-text": "arc-doc",
  settings: "dia-flow",
  "pen-tool": "dia-search",
  "dollar-sign": "hex-chart",
};

function mapBenefitIcon(icon?: string | null): string {
  if (!icon) return "hex-plus";
  if (BENEFIT_ICON_MAP[icon]) return BENEFIT_ICON_MAP[icon];
  return icon;
}

async function main() {
  const sqlClient = neon(process.env.DATABASE_URL!);
  const db = drizzle(sqlClient, { schema: { servicios } });

  const all = await db.select().from(servicios);

  for (const svc of all) {
    const slug = (svc as any).slugEs as string;
    const currentIcon = (svc as any).icon as string | null;
    const currentBenefits = (svc as any).benefits as Array<{
      icon?: string | null;
      [k: string]: unknown;
    }> | null;

    const updates: Record<string, unknown> = {};

    const newIcon = SUBSERVICE_ICONS[slug];
    if (newIcon && currentIcon !== newIcon) {
      updates.icon = newIcon;
    }

    if (currentBenefits?.length) {
      const updatedBenefits = currentBenefits.map((b) => ({
        ...b,
        icon: mapBenefitIcon(b.icon ?? null),
      }));
      if (JSON.stringify(updatedBenefits) !== JSON.stringify(currentBenefits)) {
        updates.benefits = updatedBenefits;
      }
    }

    if (Object.keys(updates).length > 0) {
      await db
        .update(servicios)
        .set(updates as any)
        .where(eq(servicios.id, (svc as any).id));
      console.log(`✅ ${slug}: ${Object.keys(updates).join(", ")}`);
      updated++;
    } else {
      console.log(`⏭  ${slug}`);
    }
  }

  console.log(`\n✅ Total actualizados: ${updated}/${all.length}`);
  process.exit(0);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
