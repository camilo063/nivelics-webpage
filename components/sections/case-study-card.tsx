import { LocaleLink as Link } from "@/components/i18n/locale-link";
import { ArrowRight } from "lucide-react";
import { useLocale } from "next-intl";
import { Reveal } from "@/components/effects/reveal";
import { TiltCard } from "@/components/effects/tilt-card";

interface CaseStudyCardProps {
  client: string;
  sector: string;
  country: string;
  countryFlag: string;
  result: string;
  metric: string;
  service: string;
  url: string;
  /** Texto del enlace. Por defecto, «Ver caso completo» / «See full case study» según el idioma. */
  ctaLabel?: string;
  /** Prefijo del aria-label del enlace. Si no se pasa, sale del idioma activo
   *  ("Caso de éxito" en ES, "Case study" en EN). */
  ariaPrefix?: string;
}

export function CaseStudyCard({
  client,
  sector,
  country,
  countryFlag,
  result,
  metric,
  service,
  url,
  ctaLabel,
  ariaPrefix,
}: CaseStudyCardProps) {
  // Componente de servidor síncrono: next-intl permite useLocale aquí.
  const locale = useLocale();
  const prefix = ariaPrefix ?? (locale === "en" ? "Case study" : "Caso de éxito");
  const cta = ctaLabel ?? (locale === "en" ? "See full case study" : "Ver caso completo");
  return (
    <section className="py-10 md:py-14">
      <div className="mx-auto max-w-[1280px] px-6 md:px-20">
        <Reveal>
          <TiltCard>
            <Link
              href={url}
              className="group glass-elevated card-lift block rounded-xl p-8"
              aria-label={`${prefix}: ${client} — ${result}`}
            >
              <div className="flex flex-wrap items-center gap-3 mb-4">
                <span className="rounded-full bg-[rgba(255,255,255,0.06)] px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-text-40">
                  {sector}
                </span>
                <span className="font-mono text-[11px] uppercase tracking-[0.08em] text-text-40">
                  {country}
                </span>
              </div>
              <h3 className="text-2xl font-bold text-text-100 group-hover:text-primary transition-colors md:text-3xl">
                {client}
              </h3>
              <p className="mt-3 text-base text-text-70">{result}</p>
              <p className="mt-2 font-mono text-lg font-bold text-primary">{metric}</p>
              <div className="mt-6 flex items-center justify-between">
                <span className="rounded-full border border-[rgba(0,212,255,0.2)] bg-[rgba(0,212,255,0.08)] px-3 py-1 text-[11px] text-[rgba(0,212,255,0.7)]">
                  {service}
                </span>
                <span className="text-sm text-text-40 group-hover:text-primary transition-colors">
                  {cta} <ArrowRight size={14} className="inline" />
                </span>
              </div>
            </Link>
          </TiltCard>
        </Reveal>
      </div>
    </section>
  );
}
