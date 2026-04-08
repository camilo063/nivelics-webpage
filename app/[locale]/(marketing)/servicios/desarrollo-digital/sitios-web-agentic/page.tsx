import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { AgenticContentEs } from "./content.es";
import { AgenticContentEn } from "./content.en";

interface PageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;
  const isEn = locale === "en";

  return {
    title: isEn
      ? "Agentic-First Websites | AI-Ready SEO + LLM Indexing"
      : "Sitios Web Agentic-First | SEO Técnico + IA-Ready",
    description: isEn
      ? "We build websites navigable by AI agents and LLMs. Multilingual, complete Schema.org, llms.txt, Core Web Vitals ≥95. Indexed by Google SGE, ChatGPT, Claude and Perplexity."
      : "Construimos sitios web navegables por IA, agentes y LLMs. Multi-idioma, Schema.org completo, llms.txt, Core Web Vitals ≥95. Indexados por Google SGE, ChatGPT, Claude y Perplexity.",
    alternates: {
      canonical: "https://www.nivelics.com/servicios/desarrollo-digital/sitios-web-agentic",
      languages: {
        es: "https://www.nivelics.com/servicios/desarrollo-digital/sitios-web-agentic",
        en: "https://www.nivelics.com/en/services/digital-development/agentic-web",
        "x-default": "https://www.nivelics.com/servicios/desarrollo-digital/sitios-web-agentic",
      },
    },
  };
}

export default async function AgenticWebPage({ params }: PageProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  if (locale === "en") {
    return <AgenticContentEn />;
  }

  return <AgenticContentEs />;
}
