"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

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

  return (
    <nav aria-label="Selecciona tu tipo de proyecto">
      <p className="text-xs font-medium uppercase tracking-wider text-text-40 mb-3">{title}</p>
      <div className="space-y-2">
        {options.map((opt) => {
          const isActive = pathname === opt.url;
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
              <span className="text-xl shrink-0" aria-hidden="true">
                {opt.icon}
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
