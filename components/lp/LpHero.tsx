import Link from "next/link";

interface LpHeroProps {
  badge?: string;
  h1: string;
  subtitle: string;
  ctaPrimary: { text: string; href: string };
  ctaSecondary?: { text: string; href: string };
  trustBadge?: string;
  accentColor?: string;
}

export function LpHero({
  badge,
  h1,
  subtitle,
  ctaPrimary,
  ctaSecondary,
  trustBadge,
  accentColor = "#00D4FF",
}: LpHeroProps) {
  return (
    <section className="relative overflow-hidden bg-[#0A0A0F] pt-20 pb-24 md:pt-28 md:pb-32">
      <div
        className="absolute inset-0 opacity-20"
        style={{
          background: `radial-gradient(circle at 50% 0%, ${accentColor}40 0%, transparent 50%)`,
        }}
        aria-hidden="true"
      />
      <div className="relative mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
        {badge && (
          <span
            className="inline-flex max-w-[280px] items-center gap-2 whitespace-normal rounded-full border px-4 py-1.5 text-center text-xs font-medium uppercase tracking-wide md:max-w-none"
            style={{
              borderColor: `${accentColor}50`,
              color: accentColor,
              backgroundColor: `${accentColor}10`,
            }}
          >
            {badge}
          </span>
        )}
        <h1 className="mt-6 text-4xl font-black tracking-tight text-white md:text-5xl lg:text-6xl">
          {h1}
        </h1>
        <p className="mx-auto mt-6 max-w-2xl text-lg text-text-70 md:text-xl">{subtitle}</p>

        <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link
            href={ctaPrimary.href}
            className="flex min-h-[52px] items-center justify-center rounded-full px-7 py-3 text-sm font-bold text-black transition-opacity hover:opacity-90"
            style={{ backgroundColor: accentColor }}
          >
            {ctaPrimary.text}
          </Link>
          {ctaSecondary && (
            <Link
              href={ctaSecondary.href}
              className="flex min-h-[52px] cursor-pointer items-center justify-center rounded-full border border-white/30 px-6 py-3 text-base font-medium text-text-100 transition-all duration-150 hover:border-white/60 hover:bg-white/5 hover:text-white"
            >
              {ctaSecondary.text}
            </Link>
          )}
        </div>

        {trustBadge && <p className="mt-8 text-sm text-text-55">{trustBadge}</p>}
      </div>
    </section>
  );
}

export default LpHero;
