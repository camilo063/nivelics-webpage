"use client";

import { useEffect, useRef, useState } from "react";
import { useInView } from "framer-motion";
import { cn } from "@/lib/utils";

interface MetricItem {
  value: string;
  label: string;
  sublabel: string;
}

interface MetricsBarProps {
  metrics: MetricItem[];
}

function AnimatedValue({ value }: { value: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });
  const numericPart = parseInt(value.replace(/[^0-9]/g, ""), 10);
  const suffix = value.replace(/[0-9]/g, "");
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!isInView || isNaN(numericPart)) return;
    const duration = 1500;
    const steps = 40;
    const increment = numericPart / steps;
    let current = 0;
    const timer = setInterval(() => {
      current += increment;
      if (current >= numericPart) {
        setCount(numericPart);
        clearInterval(timer);
      } else {
        setCount(Math.floor(current));
      }
    }, duration / steps);
    return () => clearInterval(timer);
  }, [isInView, numericPart]);

  if (isNaN(numericPart)) {
    return (
      <span ref={ref} className="font-mono text-4xl font-bold text-primary md:text-5xl">
        {value}
      </span>
    );
  }

  return (
    <span ref={ref} className="font-mono text-4xl font-bold text-primary md:text-5xl">
      {count}
      {suffix}
    </span>
  );
}

export function MetricsBar({ metrics }: MetricsBarProps) {
  return (
    <section className="bg-bg-surface py-10 md:py-14">
      <div className="mx-auto max-w-[1280px] px-6 md:px-20">
        <div
          className={cn(
            "grid gap-6",
            metrics.length === 4 ? "sm:grid-cols-2 lg:grid-cols-4" : "sm:grid-cols-3",
          )}
        >
          {metrics.map((m, i) => (
            <div
              key={`${m.label}-${i}`}
              className="rounded-xl border border-[rgba(0,212,255,0.15)] bg-[rgba(255,255,255,0.03)] p-6 text-center transition-all duration-200 hover:border-[rgba(0,212,255,0.4)] hover:bg-[rgba(0,212,255,0.05)]"
            >
              <AnimatedValue value={m.value} />
              <p className="mt-2 text-[13px] font-medium uppercase tracking-[0.08em] text-white/60">
                {m.label}
              </p>
              <p className="mt-1 text-[11px] text-white/35">{m.sublabel}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
