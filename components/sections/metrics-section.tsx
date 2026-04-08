"use client";

import { METRICS } from "@/lib/constants";
import { MetricCard } from "@/components/shared";

export function MetricsSection() {
  return (
    <section className="bg-bg-surface py-16 md:py-24">
      <div className="mx-auto max-w-[1280px] px-6 md:px-20">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {METRICS.map((metric) => (
            <MetricCard
              key={metric.label}
              value={metric.value}
              suffix={metric.suffix}
              label={metric.label}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
