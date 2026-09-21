// Secciones propias de la línea «Ingeniería de agentes». Sin estado de cliente: todo
// server-rendered, para que el contenido llegue completo a crawlers y a agentes.
import { LocaleLink as Link } from "@/components/i18n/locale-link";
import { GeoIconBox } from "@/lib/icons/geometric";
import { Reveal } from "@/components/effects/reveal";
import { AGENT_PROOF, HARNESS_FRAMEWORK, type AgentLocale } from "@/lib/content/agentes";

/**
 * Reemplaza a MetricsBar en estas páginas. MetricsBar anima cada valor desde cero y un
 * «100%» o un «0» contando se lee como resultado de clientes; aquí son reglas de diseño.
 */
export function DesignPrinciples({
  locale,
  principles,
}: {
  locale: AgentLocale;
  principles: string[];
}) {
  const isEn = locale === "en";
  return (
    <section
      aria-labelledby="design-principles-title"
      className="border-y border-white/[0.06] py-10 md:py-12"
    >
      <div className="mx-auto max-w-[1280px] px-6 md:px-20">
        <h2
          id="design-principles-title"
          className="text-xs font-semibold uppercase tracking-[0.12em] text-text-40"
        >
          {isEn ? "Design principles" : "Principios de diseño"}
        </h2>
        <ul className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {principles.map((p) => (
            <li key={p} className="flex items-start gap-3">
              <GeoIconBox name="dia-check" size={16} color="violet" />
              <span className="text-sm font-medium leading-snug text-text-100">{p}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

/** Las 7 capas del harness. Se usa en el hub y en la página insignia. */
export function HarnessFramework({ locale }: { locale: AgentLocale }) {
  const f = HARNESS_FRAMEWORK[locale];
  return (
    <section id="harness" className="py-16 md:py-24">
      <div className="mx-auto max-w-[1280px] px-6 md:px-20">
        <Reveal>
          <h2 className="max-w-3xl text-3xl font-bold text-text-100 md:text-4xl">{f.title}</h2>
          <p className="mt-4 max-w-2xl leading-relaxed text-text-70">{f.subtitle}</p>
        </Reveal>
        <ol className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {f.layers.map((layer, i) => (
            <li key={layer.title}>
              <Reveal delay={(i % 4) * 60} className="h-full">
                <div className="glass h-full rounded-xl p-5">
                  <div className="flex items-center gap-3">
                    <span
                      aria-hidden="true"
                      className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-[#8B5CF6]/40 bg-[#8B5CF6]/10 font-mono text-sm font-bold text-[#A78BFA]"
                    >
                      {layer.letter}
                    </span>
                    <h3 className="text-sm font-semibold leading-snug text-text-100">
                      <span className="sr-only">{i + 1}. </span>
                      {layer.title}
                    </h3>
                  </div>
                  <p className="mt-3 text-sm leading-relaxed text-text-55">{layer.description}</p>
                </div>
              </Reveal>
            </li>
          ))}
        </ol>
        <Link
          href={f.link.href}
          className="mt-8 inline-block text-sm font-medium text-primary underline-offset-4 hover:underline"
        >
          {f.link.label}
        </Link>
      </div>
    </section>
  );
}

/** Evidencia propia (Niveleads, QA independiente, sitio agentic) + arquitecturas de referencia. */
export function AgentProofSection({ locale }: { locale: AgentLocale }) {
  const p = AGENT_PROOF[locale];
  return (
    <section id="evidencia" className="bg-bg-surface py-16 md:py-24">
      <div className="mx-auto max-w-[1280px] px-6 md:px-20">
        <Reveal>
          <h2 className="max-w-3xl text-3xl font-bold text-text-100 md:text-4xl">{p.title}</h2>
          <p className="mt-4 max-w-2xl leading-relaxed text-text-70">{p.subtitle}</p>
        </Reveal>

        <div className="mt-12 grid gap-6 lg:grid-cols-3">
          {p.items.map((item, i) => (
            <Reveal key={item.title} delay={i * 70} className="h-full">
              <article className="glass h-full rounded-xl p-6">
                <GeoIconBox name={item.icon} size={20} color="violet" />
                <h3 className="mt-1 text-lg font-semibold text-text-100">{item.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-text-70">{item.description}</p>
              </article>
            </Reveal>
          ))}
        </div>

        <h3 className="mt-16 text-2xl font-bold text-text-100">{p.scenariosTitle}</h3>
        <p className="mt-2 text-sm text-text-55">{p.scenariosNote}</p>

        <div className="mt-8 grid gap-6 lg:grid-cols-2">
          {p.scenarios.map((s) => (
            <article key={s.title} className="rounded-xl border border-white/[0.08] p-6">
              <h4 className="text-lg font-semibold text-text-100">{s.title}</h4>
              <p className="mt-1 text-sm italic text-text-55">{s.context}</p>
              <ol
                aria-label={locale === "en" ? "Flow" : "Flujo"}
                className="mt-5 flex flex-wrap items-center gap-2"
              >
                {s.flow.map((step, i) => (
                  <li key={step} className="flex items-center gap-2">
                    <span className="rounded-full border border-[#8B5CF6]/30 bg-[#8B5CF6]/10 px-3 py-1 text-xs font-medium text-text-100">
                      {step}
                    </span>
                    {i < s.flow.length - 1 && (
                      <span aria-hidden="true" className="text-text-40">
                        →
                      </span>
                    )}
                  </li>
                ))}
              </ol>
              <p className="mt-5 text-sm leading-relaxed text-text-70">{s.description}</p>
              <p className="mt-4 text-xs leading-relaxed text-text-55">
                <strong className="font-semibold text-text-70">Harness: </strong>
                {s.harness}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
