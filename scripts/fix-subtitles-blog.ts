import { drizzle } from "drizzle-orm/node-postgres";
import { eq, sql } from "drizzle-orm";
import * as schema from "../lib/db/schema/admin";

const db = drizzle(process.env.DATABASE_URL!, { schema });
const API_KEY = process.env.ANTHROPIC_API_KEY!;

async function tr(text: string): Promise<string> {
  if (!text) return "";
  for (let i = 0; i < 3; i++) {
    try {
      const r = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": API_KEY,
          "anthropic-version": "2023-06-01",
        },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1024,
          system: "Translate ES→EN for Nivelics (B2B tech). Return ONLY translation.",
          messages: [{ role: "user", content: text }],
        }),
      });
      if (r.status === 429) {
        console.log("  Rate limited, waiting 60s...");
        await new Promise((r) => setTimeout(r, 60000));
        continue;
      }
      if (!r.ok) throw new Error(`API ${r.status}`);
      const d = await r.json();
      await new Promise((r) => setTimeout(r, 13000));
      return d.content?.[0]?.text || "";
    } catch (e) {
      if (i === 2) {
        console.log(`  ERROR: ${(e as Error).message}`);
        return "";
      }
      await new Promise((r) => setTimeout(r, 15000));
    }
  }
  return "";
}

const SUBTITLES: Record<string, string> = {
  "apps-moviles":
    "iOS, Android, Flutter y React Native. Construimos apps nativas y cross-platform con entregas quincenales, QA integrado y código 100% tuyo desde el primer sprint.",
  "automatizacion-procesos":
    "Combinamos RPA con IA generativa para automatizar flujos complejos que requieren juicio y contexto. Finanzas, RRHH, logística y operaciones — sin reemplazar tus sistemas actuales.",
  "datos-ia":
    "Data Scientists, Data Engineers, ML Engineers y AI Engineers senior listos para potenciar tus proyectos de analítica avanzada y machine learning.",
  "desarrollo-software":
    "Backend, frontend, mobile y full-stack. Ingenieros senior colombianos bilingües listos para integrarse a tu equipo con onboarding incluido.",
  "devops-cloud":
    "Cloud Architects y DevOps Engineers certificados en AWS, GCP y Azure. CI/CD, Terraform, Kubernetes y observabilidad para tu equipo.",
  "diseno-ux-ui":
    "Product designers senior con experiencia en design systems, research y prototipado. UX y UI que impulsan métricas de negocio.",
  ecommerce:
    "E-commerce a medida con cero comisiones por transacción. Catálogo inteligente, pricing dinámico, pasarelas de pago y conexión real con tu ERP.",
  "gestion-contenido":
    "Pipelines de contenido impulsados por IA generativa: desde la ideación hasta la publicación. SEO optimizado, tono de marca consistente y publicación directa a tu CMS.",
  infraestructura:
    "Diseño e implementación de infraestructura cloud escalable, segura y optimizada para tu operación.",
  "marketing-crm":
    "Segmentación dinámica, campañas personalizadas 1:1 y análisis predictivo integrado con tu CRM. Cada lead recibe el mensaje correcto en el momento correcto.",
  "migracion-aws":
    "Migramos tus workloads a AWS con estrategia de zero downtime, rollback planificado y optimización de costos desde el día uno.",
  "plataformas-web":
    "Plataformas web empresariales con React, Next.js y Node.js. Arquitectura moderna, APIs robustas y despliegue serverless que escala con tu negocio.",
  "qa-seguridad":
    "QA Engineers, SDET y especialistas en ciberseguridad para asegurar calidad y protección en cada sprint de tu equipo.",
  seguridad:
    "Hardening, compliance (SOC2, ISO27001), gestión de identidades y cifrado end-to-end para tu infraestructura cloud.",
  serverless:
    "Arquitecturas event-driven con Lambda, Cloud Functions y Azure Functions. Escala de cero a millones sin gestionar servidores.",
  "sitios-web-agentic":
    "Sitios web diseñados para ser navegados por personas Y por agentes de IA. Multi-idioma, Schema.org completo, Core Web Vitals ≥95 y llms.txt.",
};

async function main() {
  console.log("=== Fix Subtitles ===\n");

  for (const [slug, subtitleEs] of Object.entries(SUBTITLES)) {
    const [svc] = await db.select().from(schema.servicios).where(eq(schema.servicios.slugEs, slug));
    if (!svc) {
      console.log(`SKIP: ${slug}`);
      continue;
    }
    if (svc.subtitleEs && svc.subtitleEs.trim() !== "") {
      console.log(`OK: ${slug} already has subtitle`);
      continue;
    }

    console.log(`Fixing: ${slug}`);
    const subtitleEn = await tr(subtitleEs);
    await db
      .update(schema.servicios)
      .set({
        subtitleEs,
        subtitleEn,
        updatedAt: new Date(),
      })
      .where(eq(schema.servicios.slugEs, slug));
    console.log(`  ✅ subtitle set`);
  }

  // Fix blog content_es — set to excerpt if empty
  console.log("\n=== Fix Blog Content ===\n");
  const posts = await db
    .select()
    .from(schema.blogPosts)
    .where(eq(schema.blogPosts.deletedAt, null as unknown as Date));
  // raw query for null check
  const { rows } = await db.execute(
    sql`SELECT id, slug, excerpt_es FROM blog_posts WHERE deleted_at IS NULL AND (content_es IS NULL OR content_es = '')`,
  );

  for (const post of rows) {
    console.log(`Fixing blog: ${post.slug}`);
    // Use excerpt as content placeholder
    const contentEs = (post.excerpt_es as string) || "Contenido del artículo en desarrollo.";
    const contentEn = await tr(contentEs);
    await db
      .update(schema.blogPosts)
      .set({
        contentEs,
        contentEn,
        updatedAt: new Date(),
      })
      .where(eq(schema.blogPosts.id, post.id as string));
    console.log(`  ✅ content set`);
  }

  console.log("\nDone!");
  process.exit(0);
}

main().catch(console.error);
