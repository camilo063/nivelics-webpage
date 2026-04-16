import Link from "next/link";
import type { CSSProperties } from "react";
import type { SitemapSection } from "@/lib/seo/sitemap-sections";

interface SitemapMapProps {
  sections: SitemapSection[];
  locale: "es" | "en";
}

export function SitemapMap({ sections, locale }: SitemapMapProps) {
  const en = locale === "en";

  return (
    <nav aria-label={en ? "Site map" : "Mapa del sitio"} className="flex flex-col gap-6">
      {sections.map((section) => (
        <div key={section.id}>
          <div className="mb-3 flex items-center gap-2">
            <span
              className="inline-block h-2.5 w-2.5 flex-shrink-0 rounded-sm"
              style={{
                background: `${section.color}33`,
                border: `1px solid ${section.color}55`,
              }}
              aria-hidden="true"
            />
            <span
              className="text-[10px] font-medium uppercase tracking-wider"
              style={{ color: section.color }}
            >
              {en ? section.labelEn : section.label}
            </span>
          </div>

          <ul className="flex flex-wrap gap-1.5">
            {section.links.map((link) => {
              const href = en ? link.hrefEn : link.href;
              const label = en ? link.labelEn : link.label;
              const accent = link.accent;
              const style = accent ? ({ "--pill-accent": accent } as CSSProperties) : undefined;
              return (
                <li key={href}>
                  <Link
                    href={href}
                    className="sitemap-pill inline-flex min-h-[32px] items-center rounded-full border border-white/[0.07] bg-white/[0.02] px-3 py-1 text-[11px] text-text-70 transition-colors duration-150 hover:border-white/[0.14] hover:bg-white/[0.06] hover:text-text-100"
                    style={style}
                    data-accent={accent ? "true" : undefined}
                  >
                    {label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      ))}
    </nav>
  );
}
