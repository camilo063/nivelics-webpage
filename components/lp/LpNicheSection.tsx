import type { LucideIcon } from "lucide-react";

interface NicheItem {
  icon: LucideIcon;
  title: string;
  copy: string;
}

interface LpNicheSectionProps {
  title: string;
  subtitle?: string;
  items: NicheItem[];
  accentColor?: string;
}

export function LpNicheSection({
  title,
  subtitle,
  items,
  accentColor = "#00D4FF",
}: LpNicheSectionProps) {
  return (
    <section className="border-y border-white/5 bg-[#0A0A0F]/50 py-20 md:py-24">
      <div className="mx-auto max-w-6xl px-6">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-3xl font-black tracking-tight text-white md:text-4xl">{title}</h2>
          {subtitle && <p className="mt-4 text-lg text-white/70">{subtitle}</p>}
        </div>

        <div className="mt-14 grid gap-6 md:grid-cols-3 md:gap-8">
          {items.map((item, i) => {
            const Icon = item.icon;
            return (
              <div key={i} className="rounded-2xl border border-white/8 bg-[#12121A] p-7">
                <div
                  className="mb-5 flex h-14 w-14 items-center justify-center rounded-xl"
                  style={{ backgroundColor: `${accentColor}15`, color: accentColor }}
                >
                  <Icon className="h-7 w-7" />
                </div>
                <h3 className="text-xl font-bold text-white">{item.title}</h3>
                <p className="mt-3 text-sm text-white/70 leading-relaxed">{item.copy}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export default LpNicheSection;
