"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useLocale } from "next-intl";

interface SiblingItem {
  name: string;
  nameEn?: string;
  url: string;
  urlEn?: string;
}

interface ParentService {
  name: string;
  nameEn?: string;
  accentColor: string;
}

interface SiblingServicesNavProps {
  parentService: ParentService;
  siblings: SiblingItem[];
}

export function SiblingServicesNav({ parentService, siblings }: SiblingServicesNavProps) {
  const pathname = usePathname();
  const locale = useLocale();
  const isEn = locale === "en";

  const parentName = isEn && parentService.nameEn ? parentService.nameEn : parentService.name;
  const accent = parentService.accentColor;
  const hubHref = isEn
    ? `/en/services/${pathname.split("/")[3] ? pathname.split("/")[3] : ""}`
    : `/servicios/${pathname.split("/")[2] ?? ""}`;

  return (
    <nav
      aria-label={isEn ? `Navigation within ${parentName}` : `Navegación en ${parentName}`}
      data-nav-type="sibling-services"
      className="sticky top-16 z-40 border-b border-white/[0.06]"
      style={{
        background: "rgba(10,10,15,0.95)",
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
      }}
    >
      <div className="mx-auto flex h-11 max-w-[1280px] items-center gap-2 overflow-x-auto px-6 md:px-20 scrollbar-none">
        <Link
          href={hubHref}
          className="shrink-0 whitespace-nowrap border-r border-white/10 pr-3 text-[11px] font-semibold uppercase tracking-[0.08em] transition-opacity hover:opacity-80"
          style={{ color: accent }}
        >
          {parentName}
        </Link>

        {siblings.map((s) => {
          const url = isEn && s.urlEn ? s.urlEn : s.url;
          const name = isEn && s.nameEn ? s.nameEn : s.name;
          const isActive = pathname === url || pathname === s.url;

          if (isActive) {
            return (
              <span
                key={s.url}
                aria-current="page"
                className="shrink-0 whitespace-nowrap rounded-full px-3.5 py-1 text-[13px] font-medium"
                style={{
                  background: `${accent}18`,
                  color: accent,
                  border: `1px solid ${accent}40`,
                }}
              >
                {name}
              </span>
            );
          }

          return (
            <Link
              key={s.url}
              href={url}
              className="shrink-0 whitespace-nowrap rounded-full border border-transparent px-3.5 py-1 text-[13px] text-white/50 transition-all duration-150 hover:bg-white/[0.04] hover:text-white"
            >
              {name}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
