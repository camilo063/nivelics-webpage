"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

interface ChecklistItem {
  id: string;
  label: string;
  weight: number;
}

interface HeroChecklistProps {
  title: string;
  subtitle?: string;
  items: ChecklistItem[];
  accentColor: string;
  resultLabels: { low: string; mid: string; high: string };
  ctaByLevel: {
    low: { text: string; url: string };
    mid: { text: string; url: string };
    high: { text: string; url: string };
  };
}

export function HeroChecklist({
  title,
  subtitle,
  items,
  accentColor,
  resultLabels,
  ctaByLevel,
}: HeroChecklistProps) {
  const [checked, setChecked] = useState<Record<string, boolean>>({});

  const maxScore = items.reduce((s, i) => s + i.weight, 0);
  const score = items.reduce((s, i) => s + (checked[i.id] ? i.weight : 0), 0);
  const pct = maxScore > 0 ? Math.round((score / maxScore) * 100) : 0;

  const level: "low" | "mid" | "high" = pct <= 40 ? "low" : pct <= 70 ? "mid" : "high";
  const label = resultLabels[level];
  const cta = ctaByLevel[level];

  return (
    <div role="region" aria-label={title}>
      <p className="text-sm font-semibold text-text-100 mb-1">{title}</p>
      {subtitle && <p className="text-xs text-text-40 mb-4">{subtitle}</p>}

      <div className="space-y-2.5">
        {items.map((item) => (
          <label key={item.id} className="flex items-start gap-2.5 cursor-pointer group">
            <input
              type="checkbox"
              checked={!!checked[item.id]}
              onChange={(e) => setChecked((p) => ({ ...p, [item.id]: e.target.checked }))}
              className="mt-0.5 h-4 w-4 rounded border-border accent-[var(--accent)]"
              style={{ "--accent": accentColor } as React.CSSProperties}
            />
            <span className="text-sm text-text-70 group-hover:text-text-100 transition-colors">
              {item.label}
            </span>
          </label>
        ))}
      </div>

      {/* Progress bar */}
      <div className="mt-5">
        <div className="flex items-center justify-between text-xs text-text-40 mb-1.5">
          <span>Madurez</span>
          <span className="font-mono font-bold" style={{ color: accentColor }}>
            {pct}%
          </span>
        </div>
        <div className="h-2 rounded-full bg-bg-elevated overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-300"
            style={{ width: `${pct}%`, background: accentColor }}
          />
        </div>
      </div>

      <div className="mt-4 rounded-lg p-3" style={{ background: `${accentColor}08` }}>
        <p className="text-xs font-medium" style={{ color: accentColor }}>
          {label}
        </p>
        <Button asChild variant="cta" size="sm" className="mt-3 w-full">
          <Link href={cta.url}>{cta.text}</Link>
        </Button>
      </div>
    </div>
  );
}
