"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

const CASES = [
  {
    client: "Televisa / N+",
    sector: "Medios y Entretenimiento",
    country: "México",
    flag: "🇲🇽",
    result: "Plataforma de streaming N+ desde cero",
    metric: "Millones de usuarios activos",
    service: "Desarrollo Digital",
    href: "/casos-de-exito/televisa",
  },
  {
    client: "Grupo Bolívar",
    sector: "Fintech / Seguros",
    country: "Colombia",
    flag: "🇨🇴",
    result: "Transformación digital de canales",
    metric: "Reducción de fricción en onboarding",
    service: "Staff Augmentation + Cloud",
    href: "/casos-de-exito/grupo-bolivar",
  },
  {
    client: "Two Maids",
    sector: "Servicios / USA",
    country: "USA",
    flag: "🇺🇸",
    result: "Escalamiento técnico del equipo",
    metric: "40% ahorro vs. contratar localmente",
    service: "Staff Augmentation",
    href: "/casos-de-exito/two-maids",
  },
  {
    client: "AB InBev-Bavaria",
    sector: "CPG / Retail",
    country: "El Salvador",
    flag: "🇸🇻",
    result: "Plataforma digital para distribuidores",
    metric: "Operación en múltiples países",
    service: "Desarrollo Digital",
    href: "/casos-de-exito/ab-inbev",
  },
  {
    client: "Crónica",
    sector: "Medios digitales",
    country: "Colombia",
    flag: "🇨🇴",
    result: "Plataforma de noticias de alto tráfico",
    metric: "Infraestructura cloud escalable",
    service: "Cloud + Desarrollo Digital",
    href: "/casos-de-exito/cronica",
  },
  {
    client: "Pulzo",
    sector: "Medios digitales",
    country: "Colombia",
    flag: "🇨🇴",
    result: "Portal de noticias líder en Colombia",
    metric: "Millones de visitas mensuales",
    service: "Desarrollo Digital + Cloud",
    href: "/casos-de-exito/pulzo",
  },
  {
    client: "Univision",
    sector: "Medios / Broadcasting",
    country: "USA",
    flag: "🇺🇸",
    result: "Plataformas digitales de contenido",
    metric: "Audiencia hispana en USA",
    service: "Desarrollo Digital",
    href: "/casos-de-exito/univision",
  },
];

export function ClientLogosSection() {
  return (
    <section
      className="py-16 md:py-24"
      data-section="casos-de-exito-home"
      aria-label="Casos de éxito de Nivelics: Televisa, Grupo Bolívar, Two Maids, AB InBev, Crónica, Pulzo y Univision"
    >
      <div className="mx-auto max-w-[1280px] px-6 md:px-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <h2 className="text-3xl font-bold text-text-100 md:text-4xl">
            Proyectos que hablan por sí solos
          </h2>
          <p
            className="mx-auto mt-3 max-w-xl text-[15px]"
            style={{ color: "rgba(255,255,255,0.5)" }}
          >
            Clientes en 7 países que confiaron en Nivelics para su transformación digital.
          </p>
        </motion.div>

        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {CASES.map((c, i) => (
            <motion.article
              key={c.client}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              itemScope
              itemType="https://schema.org/Article"
              data-client={c.client}
              data-sector={c.sector}
              data-service={c.service}
              data-country={c.country}
            >
              <Link
                href={c.href}
                itemProp="url"
                aria-label={`Caso de éxito: ${c.client} — ${c.result}`}
                className="group flex flex-col rounded-xl p-5 min-h-[180px] cursor-pointer transition-all duration-200 bg-[rgba(255,255,255,0.03)] border-[0.5px] border-[rgba(255,255,255,0.08)] hover:bg-[rgba(255,255,255,0.06)] hover:border-[rgba(255,255,255,0.2)] hover:-translate-y-0.5"
              >
                {/* Top row: badge + country */}
                <div className="flex items-center justify-between">
                  <span className="rounded-full bg-[rgba(255,255,255,0.06)] px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.08em] text-white/50">
                    {c.sector}
                  </span>
                  <span className="text-[11px] text-white/40">
                    {c.flag} {c.country}
                  </span>
                </div>

                {/* Client name */}
                <h3 className="mt-3 text-xl font-bold text-white" itemProp="name">
                  {c.client}
                </h3>

                {/* Result */}
                <p className="mt-2 text-[13px] text-white/60" itemProp="description">
                  {c.result}
                </p>

                {/* Metric */}
                <p className="mt-1 text-[13px] font-semibold text-primary">{c.metric}</p>

                {/* Bottom: service pill + link */}
                <div className="mt-auto flex items-end justify-between pt-3.5">
                  <span className="rounded-full border-[0.5px] border-[rgba(0,212,255,0.2)] bg-[rgba(0,212,255,0.08)] px-2.5 py-0.5 text-[10px] text-[rgba(0,212,255,0.7)]">
                    {c.service}
                  </span>
                  <span className="text-xs text-white/30 transition-colors group-hover:text-primary">
                    Ver <ArrowRight size={12} className="inline" />
                  </span>
                </div>
              </Link>
            </motion.article>
          ))}
        </div>

        {/* CTA */}
        <div className="mt-12 text-center">
          <p className="text-sm text-white/40 mb-4">7 empresas. Resultados reales.</p>
          <Link
            href="/casos-de-exito"
            className="inline-block rounded-lg border border-[rgba(255,255,255,0.2)] px-6 py-2.5 text-sm font-medium text-white transition-colors hover:bg-[rgba(255,255,255,0.06)]"
          >
            Ver todos los casos →
          </Link>
        </div>
      </div>
    </section>
  );
}
