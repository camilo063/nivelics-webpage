import { LpForm } from "./LpForm";

interface LpHeroWithFormProps {
  badge?: string;
  h1: string;
  subtitle: string;
  accentColor?: string;
  formTitle?: string;
  formCtaText?: string;
  fuente: string;
  defaultServicio?: string;
}

export function LpHeroWithForm({
  badge,
  h1,
  subtitle,
  accentColor = "#00D4FF",
  formTitle = "Agenda tu diagnóstico",
  formCtaText = "Quiero mi diagnóstico →",
  fuente,
  defaultServicio,
}: LpHeroWithFormProps) {
  return (
    <section className="relative overflow-hidden bg-[#0A0A0F] pt-16 pb-20 md:pt-24 md:pb-28">
      <div
        className="absolute inset-0 opacity-20"
        style={{
          background: `radial-gradient(circle at 20% 0%, ${accentColor}40 0%, transparent 50%)`,
        }}
      />
      <div className="relative mx-auto grid max-w-6xl gap-12 px-6 md:grid-cols-2 md:items-center">
        <div>
          {badge && (
            <span
              className="inline-block rounded-full border px-4 py-1.5 text-xs font-semibold uppercase tracking-wider"
              style={{
                borderColor: `${accentColor}50`,
                color: accentColor,
                backgroundColor: `${accentColor}10`,
              }}
            >
              {badge}
            </span>
          )}
          <h1 className="mt-6 text-3xl font-black tracking-tight text-white md:text-4xl lg:text-5xl">
            {h1}
          </h1>
          <p className="mt-6 text-lg text-text-70">{subtitle}</p>
        </div>

        <div>
          <LpForm
            fuente={fuente}
            title={formTitle}
            subtitle=""
            ctaText={formCtaText}
            accentColor={accentColor}
            compact
            withAnchor={false}
            defaultServicio={defaultServicio}
          />
        </div>
      </div>
    </section>
  );
}

export default LpHeroWithForm;
