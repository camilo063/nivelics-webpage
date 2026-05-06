import { NextResponse } from "next/server";

export const revalidate = 86400;

const POSTS = [
  {
    slug: "como-implementar-ia-generativa-en-tu-empresa",
    title: "Cómo implementar IA generativa en tu empresa: guía práctica 2026",
    excerpt:
      "Una guía paso a paso para adoptar LLMs y agentes de IA en procesos empresariales reales.",
    category: "ia",
    date: "2026-03-15",
    readTime: "8 min",
  },
  {
    slug: "finops-guia-completa",
    title: "FinOps: la guía completa para optimizar tu inversión cloud",
    excerpt:
      "Todo lo que necesitas saber sobre FinOps, desde los fundamentos hasta la implementación.",
    category: "finops",
    date: "2026-02-28",
    readTime: "12 min",
  },
  {
    slug: "staff-augmentation-vs-outsourcing",
    title: "Staff Augmentation vs Outsourcing: ¿cuál es mejor para tu proyecto?",
    excerpt: "Análisis comparativo de modelos de contratación de talento tech con pros y contras.",
    category: "staffing",
    date: "2026-02-10",
    readTime: "6 min",
  },
  {
    slug: "migracion-cloud-errores-comunes",
    title: "5 errores comunes en migraciones cloud (y cómo evitarlos)",
    excerpt: "Lecciones aprendidas de +50 migraciones cloud exitosas en empresas B2B.",
    category: "cloud",
    date: "2026-01-20",
    readTime: "7 min",
  },
];

export async function GET() {
  return NextResponse.json(
    { posts: POSTS },
    {
      headers: {
        "Cache-Control": "public, s-maxage=86400, stale-while-revalidate=604800",
      },
    },
  );
}
