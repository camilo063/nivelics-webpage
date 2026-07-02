"use client";

import { useEffect, useRef, useState } from "react";
import { useInView } from "framer-motion";
import { cn } from "@/lib/utils";

interface MetricItem {
  value: string;
  label: string;
  sublabel: string;
  unit?: string;
}

interface MetricsBarProps {
  metrics: MetricItem[];
}

function AnimatedValue({ value, unit }: { value: string; unit?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  // Parse the leading numeric portion of `value` so we can animate it.
  // Anything else in `value` (e.g. "x" in "5x", "-8" in "6-8") is rendered
  // verbatim after the count. The optional `unit` (e.g. "%") is appended last.
  const match = value.match(/^(-?\d+(?:[.,]\d+)?)(.*)$/);
  const numericText = match ? match[1].replace(",", ".") : "";
  const numericPart = match ? parseFloat(numericText) : NaN;
  const decimalPlaces = numericText.includes(".") ? numericText.split(".")[1].length : 0;
  const valueSuffix = match ? match[2] : "";
  const trailingUnit = unit ?? "";
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!isInView || isNaN(numericPart)) return;
    const duration = 1500;
    const steps = 40;
    const increment = numericPart / steps;
    let current = 0;
    const timer = setInterval(() => {
      current += increment;
      if (Math.abs(current) >= Math.abs(numericPart)) {
        setCount(numericPart);
        clearInterval(timer);
      } else {
        setCount(current);
      }
    }, duration / steps);
    return () => clearInterval(timer);
  }, [isInView, numericPart]);

  if (isNaN(numericPart)) {
    return (
      <span
        ref={ref}
        className="font-mono text-5xl font-bold tracking-tight text-text-100 md:text-6xl"
      >
        {value}
        <span className="text-primary">{trailingUnit}</span>
      </span>
    );
  }

  return (
    <span
      ref={ref}
      className="font-mono text-5xl font-bold tracking-tight text-text-100 md:text-6xl"
    >
      {count.toFixed(decimalPlaces)}
      <span className="text-primary">
        {valueSuffix}
        {trailingUnit}
      </span>
    </span>
  );
}

/**
 * Banda tipográfica de métricas (Fase 1.5): sin cajas — numerales grandes
 * blancos con sufijo cyan, separados por hairlines. Editorial, no template.
 */
export function MetricsBar({ metrics }: MetricsBarProps) {
  return (
    <section className="border-y border-border-subtle bg-bg-surface py-12 md:py-16">
      <div className="mx-auto max-w-[1280px] px-6 md:px-20">
        <div
          className={cn(
            "grid gap-x-6 gap-y-10 grid-cols-2",
            metrics.length === 4 ? "lg:grid-cols-4" : "sm:grid-cols-3",
          )}
        >
          {metrics.map((m, i) => (
            <div
              key={`${m.label}-${i}`}
              className={cn("lg:px-8", i > 0 && "lg:border-l lg:border-border-subtle")}
            >
              <AnimatedValue value={m.value} unit={m.unit} />
              <p className="mt-2 text-sm font-medium uppercase tracking-[0.08em] text-text-70">
                {m.label}
              </p>
              <p className="mt-0.5 text-[11px] text-text-40">{m.sublabel}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
