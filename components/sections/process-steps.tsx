import type { MappedHomeContent } from "@/lib/cms/types";

interface Props {
  title: string;
  subtitle: string;
  steps: MappedHomeContent["processSteps"];
}

export function ProcessSteps({ title, subtitle, steps }: Props) {
  if (!steps.length) return null;

  return (
    <section
      aria-labelledby="process-title"
      className="py-10 md:py-14"
      data-section="process-steps"
    >
      <div className="mx-auto max-w-[1280px] px-6 md:px-20">
        <div className="mb-10 text-center">
          <h2 id="process-title" className="text-3xl font-bold text-text-100 md:text-4xl">
            {title}
          </h2>
          {subtitle && <p className="mx-auto mt-3 max-w-xl text-white/55">{subtitle}</p>}
        </div>
        <div className="relative grid grid-cols-1 gap-6 md:grid-cols-3">
          <div
            aria-hidden="true"
            className="absolute left-[calc(16.666%+18px)] right-[calc(16.666%+18px)] top-[18px] hidden h-px bg-gradient-to-r from-transparent via-white/10 to-transparent md:block"
          />
          {steps.map((step) => (
            <div
              key={step.number}
              className="relative flex flex-col gap-4 rounded-xl border border-white/[0.07] bg-white/[0.02] p-6 transition-colors duration-200 hover:border-primary/20"
            >
              <div className="flex items-center gap-3">
                <span className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full border border-primary/40 bg-bg-base text-sm font-bold text-primary">
                  {step.number}
                </span>
                {step.duration && (
                  <span className="text-xs font-medium text-white/35">{step.duration}</span>
                )}
              </div>
              <h3 className="text-base font-semibold text-text-100">{step.title}</h3>
              <p className="text-sm leading-relaxed text-white/55">{step.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
