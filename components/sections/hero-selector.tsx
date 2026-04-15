"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { GeoIconBox, type IconColor } from "@/lib/icons/geometric";

function hexToIconColor(hex: string): IconColor {
  const h = hex.toLowerCase();
  if (h.includes("d4ff") || h.includes("22d3ee") || h.includes("06b6d4")) return "cyan";
  if (h.includes("a78bfa") || h.includes("8b5cf6") || h.includes("7c3aed")) return "violet";
  if (h.includes("4ade80") || h.includes("22c55e") || h.includes("16a34a")) return "green";
  if (h.includes("fbbf24") || h.includes("f59e0b") || h.includes("d97706")) return "amber";
  if (h.includes("f87171") || h.includes("ef4444") || h.includes("dc2626")) return "red";
  return "cyan";
}

const ROLE_KEYWORDS = [
  "engineer",
  "architect",
  "developer",
  "designer",
  "manager",
  "analyst",
  "lead",
  "senior",
  "specialist",
  "consultant",
  "ingeniero",
  "arquitecto",
  "diseñador",
  "analista",
  "especialista",
  "sre",
];

function isRoleItem(title: string): boolean {
  const t = title.toLowerCase();
  return ROLE_KEYWORDS.some((k) => t.includes(k));
}

function getMonogram(title: string): string {
  const words = title
    .trim()
    .split(/\s+/)
    .filter((w) => w.length > 2);
  if (words.length >= 2) {
    return (words[0][0] + words[1][0]).toUpperCase();
  }
  return title.replace(/\s+/g, "").slice(0, 2).toUpperCase();
}

const MONOGRAM_COLORS = [
  { bg: "rgba(0,212,255,.12)", border: "rgba(0,212,255,.3)", text: "#00D4FF" },
  { bg: "rgba(34,197,94,.10)", border: "rgba(34,197,94,.28)", text: "#4ade80" },
  { bg: "rgba(251,191,36,.10)", border: "rgba(251,191,36,.28)", text: "#fbbf24" },
  { bg: "rgba(139,92,246,.10)", border: "rgba(139,92,246,.28)", text: "#a78bfa" },
];

interface SelectorOption {
  icon: string;
  label: string;
  url: string;
  description?: string;
}

interface HeroSelectorProps {
  title: string;
  options: SelectorOption[];
  accentColor: string;
}

export function HeroSelector({ title, options, accentColor }: HeroSelectorProps) {
  const pathname = usePathname();
  const iconColor = hexToIconColor(accentColor);

  return (
    <nav aria-label="Selecciona tu tipo de proyecto">
      <p className="text-xs font-medium uppercase tracking-wider text-text-40 mb-3">{title}</p>
      <div className="space-y-2">
        {options.map((opt, index) => {
          const isActive = pathname === opt.url;
          const isRole = isRoleItem(opt.label);
          const mono = MONOGRAM_COLORS[index % MONOGRAM_COLORS.length];
          return (
            <Link
              key={opt.label}
              href={opt.url}
              aria-label={`${opt.label} — ${opt.description}`}
              className={cn(
                "flex items-start gap-3 rounded-lg p-3 transition-all duration-150",
                isActive ? "border" : "border border-transparent hover:border",
              )}
              style={{
                background: isActive ? `${accentColor}15` : undefined,
                borderColor: isActive ? `${accentColor}40` : `${accentColor}20`,
              }}
              onMouseEnter={(e) => {
                if (!isActive) {
                  e.currentTarget.style.background = `${accentColor}10`;
                }
              }}
              onMouseLeave={(e) => {
                if (!isActive) {
                  e.currentTarget.style.background = "";
                }
              }}
            >
              <span className="shrink-0" aria-hidden="true">
                {isRole ? (
                  <div
                    style={{
                      width: 32,
                      height: 32,
                      borderRadius: 8,
                      background: mono.bg,
                      border: `1px solid ${mono.border}`,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontFamily: "var(--font-mono, monospace)",
                      fontSize: "11px",
                      fontWeight: 700,
                      color: mono.text,
                      letterSpacing: "-0.02em",
                    }}
                  >
                    {getMonogram(opt.label)}
                  </div>
                ) : (
                  <GeoIconBox name={opt.icon} size={16} color={iconColor} />
                )}
              </span>
              <div>
                <span className="block text-sm font-semibold text-text-100">{opt.label}</span>
                {opt.description && (
                  <span className="block text-[12px] text-text-40 mt-0.5">{opt.description}</span>
                )}
              </div>
            </Link>
          );
        })}
      </div>
      <Link
        href="/contacto"
        className="mt-3 block text-center text-xs font-medium transition-colors hover:brightness-125"
        style={{ color: accentColor }}
      >
        O cuéntanos tu caso personalizado →
      </Link>
    </nav>
  );
}
