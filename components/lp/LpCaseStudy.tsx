interface LpCaseStudyProps {
  title?: string;
  clientName: string;
  country: string;
  sector: string;
  resultado: string;
  extracto: string;
  accentColor?: string;
  logoUrl?: string;
  /** Reduce bottom padding when a form follows immediately. Default true. */
  compactBottom?: boolean;
}

function initialsFrom(name: string): string {
  return name
    .split(" ")
    .map((w) => w[0])
    .filter(Boolean)
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

export function LpCaseStudy({
  title = "Caso real",
  clientName,
  country,
  sector,
  resultado,
  extracto,
  accentColor = "#00D4FF",
  logoUrl,
  compactBottom = true,
}: LpCaseStudyProps) {
  return (
    <section className={`bg-[#0A0A0F] pt-20 md:pt-24 ${compactBottom ? "pb-8" : "pb-20 md:pb-24"}`}>
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <span
            className="inline-block rounded-full border px-4 py-1.5 text-xs font-semibold uppercase tracking-wider"
            style={{
              borderColor: `${accentColor}50`,
              color: accentColor,
              backgroundColor: `${accentColor}10`,
            }}
          >
            {title}
          </span>
        </div>

        <div className="mt-8 rounded-2xl border border-white/10 bg-[#12121A] p-8 md:p-10">
          <div className="flex flex-wrap items-center gap-4">
            {logoUrl ? (
              <>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={logoUrl} alt={clientName} className="h-8 object-contain opacity-80" />
                <span className="text-sm text-white/60">{country}</span>
                <span className="text-sm text-white/40">·</span>
                <span className="text-sm text-white/60">{sector}</span>
              </>
            ) : (
              <>
                <div
                  className="flex h-10 w-10 items-center justify-center rounded-lg border border-white/12 bg-white/8 font-mono text-sm font-bold"
                  style={{ color: accentColor }}
                >
                  {initialsFrom(clientName)}
                </div>
                <span className="text-lg font-semibold text-white">{clientName}</span>
                <span className="rounded-full border border-white/10 px-2 py-0.5 text-[10px] text-[#66667A]">
                  Cliente real
                </span>
                <span className="ml-2 text-sm text-white/60">{country}</span>
                <span className="text-sm text-white/40">·</span>
                <span className="text-sm text-white/60">{sector}</span>
              </>
            )}
          </div>

          <div
            className="mt-6 rounded-xl border p-5"
            style={{ borderColor: `${accentColor}30`, backgroundColor: `${accentColor}08` }}
          >
            <div
              className="text-sm font-semibold uppercase tracking-wider"
              style={{ color: accentColor }}
            >
              Resultado
            </div>
            <div className="mt-2 text-xl font-bold text-white md:text-2xl">{resultado}</div>
          </div>

          <p className="mt-6 text-white/70 leading-relaxed">{extracto}</p>
        </div>
      </div>
    </section>
  );
}

export default LpCaseStudy;
