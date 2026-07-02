"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface CaseItem {
  client: string;
  sector: string;
  country: string;
  flag: string;
  result: string;
  metric: string;
  service: string;
  href: string;
}

interface CasesCarouselProps {
  title: string;
  subtitle: string;
  cases: CaseItem[];
  ctaText: string;
  ctaUrl: string;
}

export function CasesCarousel({ title, subtitle, cases, ctaText, ctaUrl }: CasesCarouselProps) {
  const [index, setIndex] = useState(0);

  // Desktop shows 3, mobile shows 1
  const maxDesktop = Math.max(0, cases.length - 3);
  const maxMobile = cases.length - 1;

  function prev() {
    setIndex((i) => Math.max(0, i - 1));
  }
  function next() {
    setIndex((i) => Math.min(maxMobile, i + 1));
  }

  return (
    <section
      className="bg-bg-surface py-10 md:py-14"
      data-section="casos-de-exito"
      aria-label="Casos de éxito de Nivelics"
    >
      <div className="mx-auto max-w-[1280px] px-6 md:px-20">
        <h2 className="text-3xl font-bold text-text-100 md:text-4xl">{title}</h2>
        <p className="mt-3 max-w-2xl text-text-70">{subtitle}</p>

        {/* Carousel */}
        <div
          className="relative mt-10"
          role="region"
          aria-label="Casos de éxito"
          aria-live="polite"
        >
          <div className="overflow-hidden">
            {/* Desktop: show 3 */}
            <div
              className="hidden md:flex gap-4 transition-transform duration-350 ease-out"
              style={{
                transform: `translateX(-${Math.min(index, maxDesktop) * (100 / 3 + 1.33)}%)`,
              }}
            >
              {cases.map((c) => (
                <CaseCard key={c.client} c={c} className="w-[calc(33.333%-11px)] shrink-0" />
              ))}
            </div>

            {/* Mobile: show 1 */}
            <div
              className="flex md:hidden gap-4 transition-transform duration-350 ease-out"
              style={{ transform: `translateX(-${index * 104}%)` }}
            >
              {cases.map((c) => (
                <CaseCard key={c.client} c={c} className="w-full shrink-0" />
              ))}
            </div>
          </div>

          {/* Controls */}
          <div className="mt-6 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={prev}
                disabled={index === 0}
                aria-label="Caso anterior"
                className={cn(
                  "flex h-10 w-10 items-center justify-center rounded-full border border-white/12 bg-white/[0.06] text-text-70 transition-colors",
                  index === 0
                    ? "opacity-30 cursor-not-allowed"
                    : "hover:bg-white/[0.12] hover:text-white",
                )}
              >
                <ChevronLeft size={16} />
              </button>
              <button
                type="button"
                onClick={next}
                disabled={index >= maxMobile}
                aria-label="Caso siguiente"
                className={cn(
                  "flex h-10 w-10 items-center justify-center rounded-full border border-white/12 bg-white/[0.06] text-text-70 transition-colors",
                  index >= maxMobile
                    ? "opacity-30 cursor-not-allowed"
                    : "hover:bg-white/[0.12] hover:text-white",
                )}
              >
                <ChevronRight size={16} />
              </button>

              {/* Dots — mobile */}
              <div className="flex items-center gap-1.5 ml-3 md:hidden">
                {cases.map((_, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setIndex(i)}
                    aria-label={`Ir al caso ${i + 1}`}
                    className={cn(
                      "rounded-full transition-all",
                      i === index ? "h-2 w-2 bg-primary" : "h-1.5 w-1.5 bg-white/20",
                    )}
                  />
                ))}
              </div>
            </div>

            <Link
              href={ctaUrl}
              className="inline-flex items-center gap-1 rounded-lg border border-white/20 px-5 py-2 text-sm font-medium text-white transition-colors hover:bg-white/[0.06]"
            >
              {ctaText} <ArrowRight size={14} />
            </Link>
          </div>

          <p className="mt-3 text-sm text-text-40">7 empresas. Resultados reales.</p>
        </div>
      </div>
    </section>
  );
}

function CaseCard({ c, className }: { c: CaseItem; className?: string }) {
  return (
    <Link
      href={c.href}
      className={cn("group glass-elevated card-lift block rounded-xl p-5", className)}
    >
      <div className="flex items-center justify-between text-[11px] text-text-40">
        <span>
          {c.flag} {c.country}
        </span>
        <span>{c.sector}</span>
      </div>
      <h3 className="mt-3 text-lg font-bold text-white group-hover:text-primary transition-colors">
        {c.client}
      </h3>
      <p className="mt-2 text-sm text-text-70">{c.result}</p>
      <p className="mt-1 font-mono text-sm font-semibold text-primary">{c.metric}</p>
      <div className="mt-3 flex items-center justify-between">
        <span className="rounded-full border border-primary/20 bg-primary/[0.08] px-2.5 py-0.5 text-[11px] text-primary-200">
          {c.service}
        </span>
        <span className="text-xs text-text-40 group-hover:text-primary transition-colors">
          Ver <ArrowRight size={12} className="inline" />
        </span>
      </div>
    </Link>
  );
}
