/**
 * Migrate legacy monolingual fields to their new _es/_en bilingual counterparts.
 *
 * Current scope (Fase 1 of cierre definitivo):
 *   casos_exito.client_country  → client_country_es / _en
 *   casos_exito.client_sector   → client_sector_es  / _en
 *   casos_exito.testimonial_role→ testimonial_role_es / _en
 *
 * Rules (see prompt reglas duras):
 * - Never overwrite *_en if it already has content.
 * - Copy legacy → _es only if _es is empty.
 * - Translate _es → _en via Anthropic if _en is empty.
 * - Rate limit 2.5s between calls, 2 retries.
 */
import { db } from "../lib/db";
import { casosExito } from "../lib/db/schema/admin";
import { eq } from "drizzle-orm";

const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY;
if (!ANTHROPIC_API_KEY) {
  console.error("ANTHROPIC_API_KEY is required");
  process.exit(1);
}

const BRAND_CONTEXT = `You are translating short labels for Nivelics (B2B tech, LATAM → USA) from Spanish to English.

Terminology — these NEVER translate: Staff Augmentation, FinOps, Cloud, Applied AI, I+C+S, Nivelics, PAYWL, Niveleads, Hirely, AWS, GCP, Azure, SOC2, ISO27001.

Canonical translations for sectors / industries:
- "Servicios / Franquicias" → "Services / Franchising"
- "Medios / Streaming" → "Media / Streaming"
- "Medios Digitales" → "Digital Media"
- "Medios y Entretenimiento" → "Media & Entertainment"
- "Banca digital" → "Digital Banking"
- "Seguros / Salud / E-commerce" → "Insurance / Healthcare / E-commerce"
- "Seguros" → "Insurance"
- "Salud" → "Healthcare"
- "Retail y E-commerce" → "Retail & E-commerce"
- "Logística" → "Logistics"
- "Manufactura" → "Manufacturing"
- "Fintech" stays "Fintech"
- "CPG" stays "CPG"

Canonical country names (USA conventions):
- "Estados Unidos" → "USA"
- "Colombia" → "Colombia"
- "México" → "Mexico"
- "Perú" → "Peru"
- "Panamá" → "Panama"
- "El Salvador" → "El Salvador"
- "Ecuador" → "Ecuador"
- "Argentina" → "Argentina"

Canonical role / job-title translations (common patterns):
- "Gerente" → "Manager"
- "Director" → "Director"
- "Vicepresidente" → "Vice President"
- "Jefe de" → "Head of"
- "Líder de" → "Lead of"
- "Responsable de" → "Head of"
- "Desarrollador" → "Developer"
- "Ingeniero" → "Engineer"
- "Diseñador" → "Designer"
- "Arquitecto de Software" → "Software Architect"

Rules:
- Numbers, metrics, URLs, company names: NEVER translate.
- Keep it short — these are labels (max 10 words).
- Output ONLY the translation. No quotes, no preface, no explanation.`;

type FieldKind = "country" | "sector" | "role";

const KIND_HINTS: Record<FieldKind, string> = {
  country: "Context: this is a country name.",
  sector: "Context: this is an industry / sector label.",
  role: "Context: this is a professional role or job title.",
};

async function sleep(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}

async function translate(text: string, kind: FieldKind): Promise<string> {
  if (!text || text.trim() === "") return "";

  for (let attempt = 1; attempt <= 3; attempt++) {
    try {
      const response = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": ANTHROPIC_API_KEY!,
          "anthropic-version": "2023-06-01",
        },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 300,
          system: BRAND_CONTEXT,
          messages: [
            {
              role: "user",
              content: `${KIND_HINTS[kind]}\n\nTranslate to English:\n\n${text}`,
            },
          ],
        }),
      });
      if (!response.ok) {
        const err = await response.json().catch(() => ({}));
        throw new Error(`API ${response.status}: ${JSON.stringify(err)}`);
      }
      const data = (await response.json()) as {
        content?: Array<{ type: string; text: string }>;
      };
      const out = data.content?.[0]?.type === "text" ? data.content[0].text.trim() : "";
      if (!out) throw new Error("empty translation");
      return out;
    } catch (e) {
      if (attempt === 3) throw e;
      await sleep(3000 * attempt);
    }
  }
  return "";
}

function nonEmpty(v: string | null | undefined): v is string {
  return typeof v === "string" && v.trim().length > 0;
}

async function main() {
  const rows = await db.select().from(casosExito);
  console.log(`Processing ${rows.length} casos_exito rows...`);

  let translated = 0;
  let copied = 0;
  const errors: Array<{ id: string; field: string; error: string }> = [];

  for (const row of rows) {
    const updates: Partial<typeof casosExito.$inferInsert> = {};

    // client_country
    if (nonEmpty(row.clientCountry) && !nonEmpty(row.clientCountryEs)) {
      updates.clientCountryEs = row.clientCountry;
      copied++;
    }
    const countryEsSource = updates.clientCountryEs ?? row.clientCountryEs;
    if (nonEmpty(countryEsSource) && !nonEmpty(row.clientCountryEn)) {
      try {
        updates.clientCountryEn = await translate(countryEsSource, "country");
        translated++;
        await sleep(2500);
      } catch (e) {
        errors.push({
          id: row.id,
          field: "clientCountryEn",
          error: e instanceof Error ? e.message : String(e),
        });
      }
    }

    // client_sector
    if (nonEmpty(row.clientSector) && !nonEmpty(row.clientSectorEs)) {
      updates.clientSectorEs = row.clientSector;
      copied++;
    }
    const sectorEsSource = updates.clientSectorEs ?? row.clientSectorEs;
    if (nonEmpty(sectorEsSource) && !nonEmpty(row.clientSectorEn)) {
      try {
        updates.clientSectorEn = await translate(sectorEsSource, "sector");
        translated++;
        await sleep(2500);
      } catch (e) {
        errors.push({
          id: row.id,
          field: "clientSectorEn",
          error: e instanceof Error ? e.message : String(e),
        });
      }
    }

    // testimonial_role
    if (nonEmpty(row.testimonialRole) && !nonEmpty(row.testimonialRoleEs)) {
      updates.testimonialRoleEs = row.testimonialRole;
      copied++;
    }
    const roleEsSource = updates.testimonialRoleEs ?? row.testimonialRoleEs;
    if (nonEmpty(roleEsSource) && !nonEmpty(row.testimonialRoleEn)) {
      try {
        updates.testimonialRoleEn = await translate(roleEsSource, "role");
        translated++;
        await sleep(2500);
      } catch (e) {
        errors.push({
          id: row.id,
          field: "testimonialRoleEn",
          error: e instanceof Error ? e.message : String(e),
        });
      }
    }

    if (Object.keys(updates).length > 0) {
      await db.update(casosExito).set(updates).where(eq(casosExito.id, row.id));
      console.log(`  [${row.slug}] updated:`, Object.keys(updates).join(", "));
    }
  }

  console.log(`\nDone.`);
  console.log(`Copied legacy → _es: ${copied}`);
  console.log(`Translated _es → _en: ${translated}`);
  console.log(`Errors: ${errors.length}`);
  if (errors.length > 0) {
    for (const e of errors) console.log(`  - ${e.id} / ${e.field}: ${e.error}`);
  }
  process.exit(0);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
