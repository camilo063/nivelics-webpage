interface Metric {
  value: string | number;
  label: string;
  /** Texto alternativo cuando value === 0 o "0" */
  isZeroSpecial?: string;
}

interface LpMetricsProps {
  metrics: Metric[];
  title?: string;
  accentColor?: string;
}

function isZero(value: string | number): boolean {
  if (typeof value === "number") return value === 0;
  return value === "0";
}

export function LpMetrics({ metrics, title, accentColor = "#00D4FF" }: LpMetricsProps) {
  return (
    <section className="border-y border-white/5 bg-[#0A0A0F] py-16 md:py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        {title && (
          <h2 className="mb-10 text-center text-2xl font-bold text-white md:text-3xl">{title}</h2>
        )}
        <div className="grid grid-cols-2 gap-6 md:gap-y-8 lg:grid-cols-4 lg:gap-0">
          {metrics.map((m, i) => {
            const showSpecial = isZero(m.value) && m.isZeroSpecial;
            const displayValue = showSpecial ? m.isZeroSpecial : String(m.value);
            const labelLong = m.label.length > 40;
            const isLastInDesktopRow = i === metrics.length - 1;

            return (
              <div
                key={i}
                role="group"
                aria-label={`Métrica: ${displayValue} — ${m.label}`}
                className="relative px-4 text-center lg:px-6"
              >
                <div
                  className="font-mono font-black tracking-tight"
                  style={{
                    color: accentColor,
                    fontSize: showSpecial
                      ? "clamp(1.5rem, 3vw, 2rem)"
                      : "clamp(1.875rem, 5vw, 3rem)",
                    lineHeight: 1.1,
                  }}
                >
                  {displayValue}
                </div>
                <div
                  className={`mx-auto mt-2 max-w-[160px] text-text-70 ${
                    labelLong ? "text-xs" : "text-sm"
                  }`}
                  style={{ lineHeight: 1.4 }}
                >
                  {m.label}
                </div>

                {/* Desktop vertical separator */}
                {!isLastInDesktopRow && (
                  <div
                    className="absolute right-0 top-4 bottom-4 hidden w-px bg-white/10 lg:block"
                    aria-hidden="true"
                  />
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export default LpMetrics;
