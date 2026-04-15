import type { MappedIndustria } from "@/lib/cms/types";
import { FAQAccordion } from "@/components/sections/faq-accordion";
import { GeoIconBox, type IconColor } from "@/lib/icons/geometric";
import { CtaFinal } from "@/components/shared/cta-banner";

const ACCENT_TO_ICON_COLOR: Record<string, IconColor> = {
  ia: "violet",
  cloud: "cyan",
  staffing: "green",
  finops: "amber",
  dev: "amber",
};

interface Props {
  industria: MappedIndustria;
  locale: string;
}

const CATEGORY_COLOR: Record<string, string> = {
  cloud: "text-cloud",
  data: "text-primary",
  ai: "text-ia",
  frontend: "text-dev",
  backend: "text-staffing",
  security: "text-finops",
  other: "text-white/55",
};

export function IndustriaRichSections({ industria, locale }: Props) {
  const {
    metrics,
    painPoints,
    statHighlights,
    regulations,
    useCases,
    playbook,
    industryFaqs,
    techStack,
    ctaTitle,
    ctaPrimaryText,
    ctaPrimaryUrl,
    accentColor,
  } = industria;

  const isEn = locale === "en";
  const iconColor: IconColor = ACCENT_TO_ICON_COLOR[accentColor] ?? "cyan";

  return (
    <>
      {metrics.length > 0 && (
        <section className="border-y border-white/[0.06] py-10" data-section="industria-metrics">
          <div className="mx-auto max-w-[1280px] px-6 md:px-20">
            <div className="grid grid-cols-2 gap-6 text-center md:grid-cols-4">
              {metrics.map((m) => (
                <div key={m.value + m.label} className="flex flex-col gap-1">
                  <span className="text-3xl font-bold tabular-nums text-primary md:text-4xl">
                    {m.value}
                  </span>
                  <span className="text-xs leading-tight text-white/50 md:text-sm">{m.label}</span>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {painPoints.length > 0 && (
        <section className="py-14" data-section="industria-pain-points">
          <div className="mx-auto max-w-[1280px] px-6 md:px-20">
            <h2 className="mb-8 text-2xl font-bold text-text-100 md:text-3xl">
              {isEn ? "Industry challenges" : "Los retos del sector"}
            </h2>
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
              {painPoints.map((pp, i) => (
                <div
                  key={i}
                  className="flex flex-col rounded-xl border border-white/[0.07] bg-white/[0.02] p-6 transition-transform duration-200 ease-out hover:-translate-y-1"
                >
                  <div className="mb-3">
                    <GeoIconBox name={pp.icon} size={20} color={iconColor} />
                  </div>
                  <h3 className="mb-2 text-base font-semibold text-text-100">{pp.title}</h3>
                  <p className="mb-3 text-sm leading-relaxed text-white/55">{pp.desc}</p>
                  {pp.stat && (
                    <p className="mt-auto border-t border-white/[0.06] pt-3 text-xs text-primary/80">
                      {pp.stat}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {regulations.length > 0 && (
        <section
          className="border-t border-white/[0.06] py-12"
          data-section="industria-regulations"
        >
          <div className="mx-auto max-w-[1280px] px-6 md:px-20">
            <h2 className="mb-8 text-2xl font-bold text-text-100 md:text-3xl">
              {isEn ? "Regulatory frameworks we operate under" : "Marco regulatorio que conocemos"}
            </h2>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {regulations.map((r) => (
                <div
                  key={r.code}
                  className="rounded-xl border border-white/[0.07] bg-white/[0.02] p-5"
                >
                  <div className="flex items-baseline gap-3">
                    <span className="rounded-md border border-primary/30 bg-primary/[0.08] px-2 py-0.5 font-mono text-[11px] font-semibold text-primary">
                      {r.code}
                    </span>
                    <h3 className="text-sm font-semibold text-text-100">{r.name}</h3>
                  </div>
                  {r.desc && (
                    <p className="mt-2 text-[13px] leading-relaxed text-white/55">{r.desc}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {useCases.length > 0 && (
        <section
          className="border-t border-white/[0.06] bg-bg-surface py-14"
          data-section="industria-use-cases"
        >
          <div className="mx-auto max-w-[1280px] px-6 md:px-20">
            <h2 className="mb-2 text-2xl font-bold text-text-100 md:text-3xl">
              {isEn
                ? "How we implement in this industry"
                : "Casos de uso que resolvemos en este sector"}
            </h2>
            <p className="mb-8 max-w-2xl text-white/55">
              {isEn
                ? "Real patterns we have delivered, not theoretical slides."
                : "Patrones reales que hemos entregado, no slides teóricos."}
            </p>
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
              {useCases.map((u, i) => (
                <div key={i} className="rounded-xl border border-white/[0.07] bg-white/[0.02] p-6">
                  <div className="mb-3">
                    <GeoIconBox name={u.icon} size={20} color={iconColor} />
                  </div>
                  <h3 className="mb-2 text-base font-semibold text-text-100">{u.title}</h3>
                  <p className="text-sm leading-relaxed text-white/55">{u.desc}</p>
                  {u.outcome && (
                    <p className="mt-3 rounded-md border-l-2 border-primary/60 bg-primary/[0.05] px-3 py-2 text-[13px] text-primary/90">
                      {isEn ? "Outcome:" : "Resultado:"} {u.outcome}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {playbook.length > 0 && (
        <section className="py-14" data-section="industria-playbook">
          <div className="mx-auto max-w-[1280px] px-6 md:px-20">
            <h2 className="mb-2 text-2xl font-bold text-text-100 md:text-3xl">
              {isEn ? "Our playbook for this industry" : "Cómo abordamos proyectos en este sector"}
            </h2>
            <p className="mb-8 max-w-2xl text-white/55">
              {isEn
                ? "A repeatable method refined across 13 years and 7 countries."
                : "Un método repetible afinado con 13 años en 7 países."}
            </p>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
              {playbook.map((p) => (
                <div
                  key={p.number}
                  className="rounded-xl border border-white/[0.07] bg-white/[0.02] p-5"
                >
                  <span className="mb-3 inline-flex h-9 w-9 items-center justify-center rounded-full border border-primary/40 text-sm font-bold text-primary">
                    {p.number}
                  </span>
                  <h3 className="mb-1.5 text-sm font-semibold text-text-100">{p.title}</h3>
                  <p className="text-[13px] leading-relaxed text-white/55">{p.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {statHighlights.length > 0 && (
        <section
          className="border-y border-white/[0.06] bg-bg-surface py-12"
          data-section="industria-stats"
        >
          <div className="mx-auto max-w-[1280px] px-6 md:px-20">
            <h2 className="mb-8 text-center text-xs font-semibold uppercase tracking-widest text-white/50">
              {isEn ? "Industry signals you should know" : "Señales del sector que debes conocer"}
            </h2>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
              {statHighlights.map((s, i) => (
                <div
                  key={i}
                  className="rounded-xl border border-white/[0.07] bg-white/[0.02] p-6 text-center"
                >
                  <div className="text-3xl font-bold tabular-nums text-primary md:text-4xl">
                    {s.value}
                  </div>
                  <div className="mt-2 text-sm text-white/70">{s.label}</div>
                  {s.source && <div className="mt-2 text-[11px] text-white/35">{s.source}</div>}
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {techStack.length > 0 && (
        <section className="py-10" data-section="industria-tech-stack">
          <div className="mx-auto max-w-[1280px] px-6 md:px-20">
            <h3 className="mb-4 text-center text-xs font-semibold uppercase tracking-widest text-white/40">
              {isEn ? "Common tech stack" : "Stack tecnológico frecuente"}
            </h3>
            <div className="flex flex-wrap justify-center gap-2">
              {techStack.map((t) => (
                <span
                  key={t.label}
                  className={`rounded-md border border-white/10 bg-white/[0.03] px-3 py-1.5 font-mono text-xs ${CATEGORY_COLOR[t.category] || "text-white/60"}`}
                >
                  {t.label}
                </span>
              ))}
            </div>
          </div>
        </section>
      )}

      {industryFaqs.length > 0 && (
        <FAQAccordion
          title={
            isEn ? "Questions from companies in this sector" : "Preguntas frecuentes del sector"
          }
          faqs={industryFaqs}
          schemaEnabled
        />
      )}

      {ctaTitle && (
        <CtaFinal
          title={ctaTitle}
          buttonText={
            ctaPrimaryText || (isEn ? "Talk to a specialist" : "Hablar con un especialista")
          }
          buttonHref={ctaPrimaryUrl || "/contacto"}
          locale={locale}
        />
      )}
    </>
  );
}
