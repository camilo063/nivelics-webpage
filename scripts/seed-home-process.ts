/**
 * Seed home_content with process_steps (ES).
 * Safe to re-run: UPDATE only sets the process fields, never touches hero/FAQ.
 * EN fields left null — translation agent will fill them.
 */
import { drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";
import { eq } from "drizzle-orm";
import * as schema from "../lib/db/schema/admin";

async function main() {
  const sqlClient = neon(process.env.DATABASE_URL!);
  const db = drizzle(sqlClient, { schema });

  const processSteps = [
    {
      number: "01",
      icon: "calendar",
      titleEs: "Diagnóstico gratuito",
      titleEn: "",
      descEs: "En 30 minutos entendemos tu reto. Sin compromiso y sin RFP.",
      descEn: "",
      durationEs: "30 min",
      durationEn: "",
    },
    {
      number: "02",
      icon: "code",
      titleEs: "Propuesta en 48h",
      titleEn: "",
      descEs: "Alcance, equipo, cronograma y precio fijo. Sin sorpresas y sin letra pequeña.",
      descEn: "",
      durationEs: "48 horas",
      durationEn: "",
    },
    {
      number: "03",
      icon: "rocket",
      titleEs: "Primer entregable en 2 semanas",
      titleEn: "",
      descEs: "Demos quincenales en producción. El código es 100% tuyo desde el sprint 1.",
      descEn: "",
      durationEs: "2 semanas",
      durationEn: "",
    },
  ];

  const result = await db
    .update(schema.homeContent)
    .set({
      processSectionTitleEs: "Cómo trabajamos",
      processSectionTitleEn: null,
      processSectionSubtitleEs: "Sin RFPs, sin presentaciones de 60 slides. Solo resultados.",
      processSectionSubtitleEn: null,
      processSteps,
      translationStatusEn: "pending",
      updatedAt: new Date(),
    })
    .where(eq(schema.homeContent.id, "main"))
    .returning({ id: schema.homeContent.id });

  if (result.length === 0) {
    console.log("[INFO] no home_content row 'main' — inserting fresh");
    await db.insert(schema.homeContent).values({
      id: "main",
      processSectionTitleEs: "Cómo trabajamos",
      processSectionSubtitleEs: "Sin RFPs, sin presentaciones de 60 slides. Solo resultados.",
      processSteps,
      translationStatusEn: "pending",
    });
  }

  console.log("[OK] home_content process_steps seeded (ES).");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
