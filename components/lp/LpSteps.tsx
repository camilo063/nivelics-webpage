import type { CSSProperties } from "react";

interface Step {
  title: string;
  copy: string;
}

interface LpStepsProps {
  title: string;
  subtitle?: string;
  steps: Step[];
  accentColor?: string;
}

export function LpSteps({ title, subtitle, steps, accentColor = "#00D4FF" }: LpStepsProps) {
  const cssVars = { "--accent": accentColor } as CSSProperties;

  return (
    <section className="border-y border-white/5 bg-[#0A0A0F]/50 py-20 md:py-24">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-black tracking-tight text-white md:text-4xl">{title}</h2>
          {subtitle && <p className="mt-4 text-lg text-text-70">{subtitle}</p>}
        </div>

        <div className="mt-14" style={cssVars}>
          {steps.map((step, i) => {
            const isLast = i === steps.length - 1;
            return (
              <div key={i}>
                <div className="relative flex gap-6 rounded-2xl border border-white/8 bg-[#12121A] p-6 transition-all duration-150 hover:border-[var(--accent)]/40 hover:bg-white/[0.02]">
                  <div
                    className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full font-mono text-lg font-black text-black"
                    style={{ backgroundColor: accentColor }}
                  >
                    {String(i + 1).padStart(2, "0")}
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white">{step.title}</h3>
                    <p className="mt-2 text-sm text-text-70 leading-relaxed">{step.copy}</p>
                  </div>
                </div>

                {/* Visual connector between steps */}
                {!isLast && (
                  <div className="flex justify-start pl-7 py-0" aria-hidden="true">
                    <div className="h-6 w-px bg-white/10" />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export default LpSteps;
