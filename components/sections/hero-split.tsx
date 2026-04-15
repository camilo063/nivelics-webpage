import Link from "next/link";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { HeroEffect, type HeroEffectKind } from "@/components/ui/hero-effect";

interface HeroSplitProps {
  badge?: string;
  h1: string;
  h1Accent?: string;
  subtitle: string;
  bullets?: string[];
  ctaPrimary: { text: string; url: string };
  ctaSecondary?: { text: string; url: string };
  accentColor: string;
  rightPanel: React.ReactNode;
  dataSection?: string;
  ariaLabel?: string;
  heroEffect?: HeroEffectKind;
  heroEffectOpacity?: number;
}

export function HeroSplit({
  badge,
  h1,
  h1Accent,
  subtitle,
  bullets,
  ctaPrimary,
  ctaSecondary,
  accentColor,
  rightPanel,
  dataSection,
  ariaLabel,
  heroEffect = "none",
  heroEffectOpacity,
}: HeroSplitProps) {
  const defaultOpacity =
    heroEffect === "diagonal"
      ? 0.9
      : heroEffect === "particles"
        ? 0.85
        : heroEffect === "hex"
          ? 0.9
          : heroEffect === "grid"
            ? 0.85
            : heroEffect === "radar"
              ? 0.9
              : 1;
  return (
    <section
      className="relative overflow-hidden pt-10 pb-14 md:pt-10 md:pb-14"
      data-section={dataSection ?? "hero"}
      aria-label={ariaLabel}
      itemScope
      itemType="https://schema.org/Service"
    >
      <HeroEffect kind={heroEffect} opacity={heroEffectOpacity ?? defaultOpacity} />
      <div
        aria-hidden="true"
        className="absolute inset-0"
        style={{
          background: `linear-gradient(135deg, ${accentColor}08 0%, transparent 60%)`,
          zIndex: 1,
          pointerEvents: "none",
          userSelect: "none",
        }}
      />
      <div className="relative z-10 mx-auto max-w-[1280px] px-6 md:px-20">
        <div className="grid gap-10 lg:grid-cols-[55%_45%] items-center">
          {/* Left column */}
          <div>
            {badge && (
              <span
                className="inline-block rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wider mb-4"
                style={{
                  background: `${accentColor}15`,
                  color: accentColor,
                  border: `1px solid ${accentColor}30`,
                }}
              >
                {badge}
              </span>
            )}
            <h1
              className="text-4xl font-bold text-text-100 md:text-5xl lg:text-[52px] leading-tight"
              itemProp="name"
            >
              {h1}{" "}
              {h1Accent && (
                <span
                  className="bg-clip-text text-transparent"
                  style={{ backgroundImage: `linear-gradient(90deg, ${accentColor}, #00D4FF)` }}
                >
                  {h1Accent}
                </span>
              )}
            </h1>
            <p
              className="mt-4 max-w-xl text-lg leading-relaxed text-text-70"
              itemProp="description"
            >
              {subtitle}
            </p>
            {bullets && bullets.length > 0 && (
              <ul className="mt-6 space-y-2.5">
                {bullets.map((b) => (
                  <li key={b} className="flex items-start gap-2.5 text-[15px] text-text-70">
                    <Check
                      size={18}
                      className="shrink-0 mt-0.5"
                      style={{ color: accentColor }}
                      aria-hidden="true"
                    />
                    {b}
                  </li>
                ))}
              </ul>
            )}
            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <Button asChild variant="cta" size="lg">
                <Link href={ctaPrimary.url}>{ctaPrimary.text}</Link>
              </Button>
              {ctaSecondary && (
                <Button asChild variant="outline" size="lg">
                  <Link href={ctaSecondary.url}>{ctaSecondary.text}</Link>
                </Button>
              )}
            </div>
          </div>

          {/* Right column */}
          <div
            className="rounded-xl p-5 lg:p-6"
            style={{
              background: `${accentColor}08`,
              border: `0.5px solid ${accentColor}25`,
            }}
          >
            {rightPanel}
          </div>
        </div>
      </div>
    </section>
  );
}
