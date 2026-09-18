// Integración de sistemas y MCP.
// Copy en lib/content/agentes.ts; plantilla en components/sections/agentes/agent-service-page.tsx.
import type { Metadata } from "next";
import { getLocale, setRequestLocale } from "next-intl/server";
import {
  AgentServicePage,
  agentServiceMetadata,
} from "@/components/sections/agentes/agent-service-page";
import type { Locale } from "@/lib/cms/types";

export const revalidate = 86400;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale: __locale } = await params;
  setRequestLocale(__locale);
  const locale = (await getLocale()) as Locale;
  return agentServiceMetadata("mcp", locale);
}

export default async function IntegracionSistemasMcpPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: __locale } = await params;
  setRequestLocale(__locale);
  const locale = (await getLocale()) as Locale;
  return <AgentServicePage serviceKey="mcp" locale={locale} />;
}
