import Link from "next/link";
import type { MappedServicio } from "@/lib/cms/types";
import { GeoIcon } from "@/lib/icons/geometric";

interface Props {
  hubMetrics: MappedServicio["hubMetrics"];
  frameworkTitle: string;
  frameworkSubtitle: string;
  frameworkPillars: MappedServicio["frameworkPillars"];
  sectorsTitle: string;
  sectors: MappedServicio["sectors"];
}

// Normaliza slugs históricos guardados en DB al slug real de la ruta pública (ES).
// next-intl se encarga del rewrite a EN (/industries/...).
const SECTOR_ROUTE_SLUG: Record<string, string> = {
  medios: "medios-entretenimiento",
  retail: "retail-ecommerce",
};

export function ServiciosHubExtras({
  hubMetrics,
  frameworkTitle,
  frameworkSubtitle,
  frameworkPillars,
  sectorsTitle,
  sectors,
}: Props) {
  return (
    <>
      {hubMetrics.length > 0 && (
        <section className="border-t border-white/[0.06]" data-section="servicios-hub-metrics">
          <div className="mx-auto max-w-5xl">
            <div className="grid grid-cols-2 lg:grid-cols-4">
              {hubMetrics.map((m, i) => {
                const isLastRowMobile = i >= hubMetrics.length - 2;
                const isRightColMobile = i % 2 === 1;
                const isLastDesktop = i === hubMetrics.length - 1;
                return (
                  <div
                    key={m.value + m.label}
                    className={[
                      "flex flex-col items-center py-8 px-6 text-center",
                      !isLastRowMobile ? "border-b border-white/[0.06]" : "",
                      !isRightColMobile ? "border-r border-white/[0.06]" : "",
                      "lg:border-b-0",
                      !isLastDesktop ? "lg:border-r lg:border-white/[0.06]" : "lg:border-r-0",
                    ]
                      .filter(Boolean)
                      .join(" ")}
                  >
                    <span className="text-4xl font-bold tabular-nums text-primary">{m.value}</span>
                    <span className="mt-2 max-w-[140px] text-sm leading-tight text-text-55">
                      {m.label}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {frameworkPillars.length > 0 && (
        <section className="px-4 py-14" data-section="framework-ics">
          <div className="mx-auto max-w-5xl">
            <div className="mb-10 text-center">
              <h2 className="mb-3 text-2xl font-bold text-text-100 md:text-3xl">
                {frameworkTitle}
              </h2>
              {frameworkSubtitle && (
                <p className="mx-auto max-w-2xl text-base text-text-55">{frameworkSubtitle}</p>
              )}
            </div>
            <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
              {frameworkPillars.map((p) => (
                <div
                  key={p.letter}
                  className={`flex flex-col gap-3 rounded-xl border ${p.borderClass} bg-white/[0.02] p-6 transition-colors duration-200 hover:bg-white/[0.04]`}
                >
                  <span className={`text-4xl font-black ${p.colorClass}`}>{p.letter}</span>
                  <h3 className="text-base font-semibold text-text-100">{p.title}</h3>
                  <p className="text-sm leading-relaxed text-text-55">{p.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {sectors.length > 0 && (
        <section className="border-t border-white/[0.06] px-4 py-10" data-section="sectors-list">
          <div className="mx-auto max-w-5xl">
            <h2 className="mb-6 text-center text-xs font-semibold uppercase tracking-widest text-text-70">
              {sectorsTitle}
            </h2>
            <div className="flex flex-wrap justify-center gap-3">
              {sectors.map((s) => {
                const routeSlug = SECTOR_ROUTE_SLUG[s.slug] ?? s.slug;
                return (
                  <Link
                    key={s.slug}
                    href={`/industrias/${routeSlug}`}
                    className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-4 py-2 text-sm text-text-70 no-underline transition-all duration-150 hover:border-primary/30 hover:bg-white/[0.05] hover:text-text-100"
                  >
                    <GeoIcon name={s.icon} size={16} color="cyan" />
                    {s.label}
                  </Link>
                );
              })}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
