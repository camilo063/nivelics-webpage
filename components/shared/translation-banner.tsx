"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useLocale } from "next-intl";
import { shouldShowTranslationBanner } from "@/lib/i18n/translation-status";

export function TranslationBanner() {
  const pathname = usePathname();
  const locale = useLocale();

  if (!shouldShowTranslationBanner(pathname, locale)) return null;

  // Build the ES equivalent URL by stripping /en prefix
  const esPath = pathname.replace(/^\/en(\/|$)/, "/") || "/";

  return (
    <div className="bg-[rgba(245,158,11,0.08)] border-b border-[rgba(245,158,11,0.2)]">
      <div className="mx-auto max-w-[1280px] px-6 py-2.5 md:px-20 flex items-center justify-between gap-4">
        <p className="text-sm text-[rgba(245,158,11,0.9)]">
          This page is being translated. Some content may appear in Spanish.
        </p>
        <Link
          href={esPath}
          className="shrink-0 text-xs font-medium text-[rgba(245,158,11,0.9)] hover:text-[#F59E0B] transition-colors"
        >
          Ver en español →
        </Link>
      </div>
    </div>
  );
}
