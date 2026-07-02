import Link from "next/link";

interface LpCTABannerProps {
  title: string;
  subtitle?: string;
  ctaText: string;
  ctaHref: string;
  accentColor?: string;
}

export function LpCTABanner({
  title,
  subtitle,
  ctaText,
  ctaHref,
  accentColor = "#00D4FF",
}: LpCTABannerProps) {
  return (
    <section className="bg-[#0A0A0F] py-12 md:py-16">
      <div className="mx-auto max-w-5xl px-6">
        <div
          className="rounded-3xl border p-8 md:p-12"
          style={{
            borderColor: `${accentColor}30`,
            background: `linear-gradient(135deg, ${accentColor}15 0%, transparent 100%)`,
          }}
        >
          <div className="flex flex-col items-center gap-6 text-center md:flex-row md:justify-between md:text-left">
            <div className="flex-1">
              <h3 className="text-2xl font-black tracking-tight text-white md:text-3xl">{title}</h3>
              {subtitle && <p className="mt-2 text-text-70">{subtitle}</p>}
            </div>
            <Link
              href={ctaHref}
              className="flex min-h-[52px] shrink-0 items-center justify-center rounded-lg px-6 py-3 text-sm font-bold text-black transition-opacity hover:opacity-90"
              style={{ backgroundColor: accentColor }}
            >
              {ctaText}
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

export default LpCTABanner;
