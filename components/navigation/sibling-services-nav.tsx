"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useLocale } from "next-intl";
import { cn } from "@/lib/utils";

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

  return (
    <nav
      aria-label={`Otros servicios de ${parentName}`}
      data-nav-type="sibling-services"
      className="border-b border-white/[0.08] bg-[rgba(255,255,255,0.03)]"
    >
      <div className="mx-auto max-w-[1280px] px-6 md:px-20 py-2.5">
        <div className="flex items-center gap-3 overflow-x-auto scrollbar-none">
          <span className="shrink-0 text-[11px] text-white/35 mr-1">En {parentName}:</span>
          {siblings.map((s) => {
            const url = isEn && s.urlEn ? s.urlEn : s.url;
            const name = isEn && s.nameEn ? s.nameEn : s.name;
            const isActive = pathname === url || pathname === s.url;

            if (isActive) {
              return (
                <span
                  key={s.url}
                  className="shrink-0 rounded-full px-3.5 py-1.5 text-[13px] font-medium cursor-default"
                  style={{
                    background: `${parentService.accentColor}20`,
                    color: parentService.accentColor,
                    border: `0.5px solid ${parentService.accentColor}40`,
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
                className="shrink-0 rounded-full px-3.5 py-1.5 text-[13px] text-white/55 transition-all duration-150 hover:text-white hover:bg-white/[0.08]"
              >
                {name}
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
