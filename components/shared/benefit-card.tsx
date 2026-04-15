"use client";

import type { LucideIcon } from "lucide-react";
import { GeoIconBox, type IconColor, LUCIDE_TO_GEO } from "@/lib/icons/geometric";

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
    <div
      style={{
        background: "rgba(255,255,255,0.02)",
        border: "0.5px solid rgba(255,255,255,0.07)",
        borderTop: `2px solid ${accentColor}`,
        borderRadius: "10px",
        padding: "16px",
        transition: "transform 180ms ease, border-color 180ms ease, box-shadow 180ms ease",
        cursor: "default",
      }}
      onMouseEnter={(e) => {
        const el = e.currentTarget as HTMLDivElement;
        el.style.transform = "translateY(-3px)";
        el.style.borderColor = "rgba(255,255,255,0.14)";
        el.style.borderTopColor = accentColor;
        el.style.boxShadow = "0 8px 24px rgba(0,0,0,0.25), 0 0 0 1px rgba(255,255,255,0.06)";
      }}
      onMouseLeave={(e) => {
        const el = e.currentTarget as HTMLDivElement;
        el.style.transform = "translateY(0)";
        el.style.borderColor = "rgba(255,255,255,0.07)";
        el.style.borderTopColor = accentColor;
        el.style.boxShadow = "none";
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "flex-start",
          gap: "12px",
          marginBottom: "10px",
        }}
      >
        <GeoIconBox name={iconName} size={18} color={iconColor} />
        <div
          style={{
            fontSize: "14px",
            fontWeight: 600,
            color: "#fff",
            lineHeight: 1.35,
          }}
        >
          {title}
        </div>
      </div>
      <p
        style={{
          fontSize: "13px",
          color: "rgba(255,255,255,0.55)",
          lineHeight: 1.6,
          margin: 0,
        }}
      >
        {description}
      </p>
    </div>
  );
}
