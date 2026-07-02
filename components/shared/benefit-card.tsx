"use client";

import type { LucideIcon } from "lucide-react";
import { GeoIconBox, type IconColor, LUCIDE_TO_GEO } from "@/lib/icons/geometric";
import { TiltCard } from "@/components/effects/tilt-card";

const ACCENT_ICON_COLOR: Record<string, IconColor> = {
  "#00D4FF": "cyan",
  "#a78bfa": "violet",
  "#4ade80": "green",
  "#fbbf24": "amber",
  "#f87171": "red",
};

function hexToIconColor(hex: string): IconColor {
  const direct = ACCENT_ICON_COLOR[hex];
  if (direct) return direct;
  const h = hex.toLowerCase();
  if (h.includes("d4ff") || h.includes("22d3ee") || h.includes("06b6d4")) return "cyan";
  if (h.includes("a78bfa") || h.includes("8b5cf6") || h.includes("7c3aed")) return "violet";
  if (h.includes("4ade80") || h.includes("22c55e") || h.includes("16a34a")) return "green";
  if (h.includes("fbbf24") || h.includes("f59e0b") || h.includes("d97706")) return "amber";
  if (h.includes("f87171") || h.includes("ef4444") || h.includes("dc2626")) return "red";
  return "cyan";
}

function lucideToIconName(icon: LucideIcon): string | undefined {
  const displayName =
    (icon as unknown as { displayName?: string; name?: string }).displayName ??
    (icon as unknown as { name?: string }).name;
  if (!displayName) return undefined;
  const kebab = displayName
    .replace(/Icon$/, "")
    .replace(/([a-z])([A-Z])/g, "$1-$2")
    .replace(/([A-Z]+)([A-Z][a-z])/g, "$1-$2")
    .toLowerCase();
  return LUCIDE_TO_GEO[kebab] ?? kebab;
}

interface BenefitCardProps {
  title: string;
  description: string;
  icon?: string | LucideIcon | null;
  accentColor: string;
}

export function BenefitCard({ title, description, icon, accentColor }: BenefitCardProps) {
  const iconColor = hexToIconColor(accentColor);
  const iconName = typeof icon === "string" ? icon : icon ? lucideToIconName(icon) : undefined;

  return (
    <TiltCard>
      {/* Hover en CSS (.benefit-card en globals.css) — el acento viaja por CSS var */}
      <div className="benefit-card" style={{ "--nv-accent": accentColor } as React.CSSProperties}>
        <div className="mb-2.5 flex items-start gap-3">
          <GeoIconBox name={iconName} size={18} color={iconColor} />
          <div className="text-sm font-semibold leading-snug text-text-100">{title}</div>
        </div>
        <p className="m-0 text-sm leading-relaxed text-text-55">{description}</p>
      </div>
    </TiltCard>
  );
}
