import type { LucideIcon } from "lucide-react";

interface ValueProp {
  icon: LucideIcon;
  title: string;
  copy: string;
}

interface LpValuePropsProps {
  title: string;
  subtitle?: string;
  items: ValueProp[];
  accentColor?: string;
}

export function LpValueProps({
  title,
  subtitle,
  items,
  accentColor = "#00D4FF",
}: LpValuePropsProps) {
  // Use 3 columns in desktop for 3 items; 4 columns for 4 items; fallback 1 column mobile
  const mdCols = items.length === 4 ? "md:grid-cols-2 lg:grid-cols-4" : "md:grid-cols-3";

  return (
    <section className="bg-[#0A0A0F] py-20 md:py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-3xl font-black tracking-tight text-white md:text-4xl">{title}</h2>
          {subtitle && <p className="mt-4 text-lg text-white/70">{subtitle}</p>}
        </div>

        <ul
          role="list"
          aria-label="Propuestas de valor"
          className={`mt-14 grid grid-cols-1 gap-6 md:gap-8 ${mdCols}`}
          style={{ gridTemplateColumns: undefined }}
        >
          {items.map((item, i) => {
            const Icon = item.icon;
            return (
              <li
                key={i}
                role="listitem"
                className="overflow-hidden rounded-2xl border border-white/8 bg-[#12121A] p-6 backdrop-blur-sm transition-colors hover:border-white/15"
              >
                <div
                  className="mb-5 flex h-12 w-12 items-center justify-center rounded-lg"
                  style={{ backgroundColor: `${accentColor}15`, color: accentColor }}
                >
                  <Icon className="h-6 w-6" />
                </div>
                <h3 className="break-words text-lg font-bold text-white">{item.title}</h3>
                <p className="mt-3 break-words text-sm text-white/70 leading-relaxed">
                  {item.copy}
                </p>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}

export default LpValueProps;
