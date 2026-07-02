"use client";

import { usePathname } from "next/navigation";
import { StickyMobileCta } from "@/components/ui/sticky-mobile-cta";

/**
 * CTA sticky global en mobile (CRO §1.1): garantiza que TODA página de
 * marketing tenga un CTA de contacto persistente al hacer scroll.
 *
 * Se omite donde ya existe uno mejor:
 * - /contacto (y /en/contact): redundante.
 * - Sub-servicios (/servicios/x/y): esas páginas montan su propio
 *   StickyMobileCta contextual (texto + accent por servicio).
 */
const SKIP_PATTERNS = [
  /\/(contacto|contact)(\/|$)/,
  /\/(servicios|services)\/[^/]+\/[^/]+/, // sub-servicios con sticky propio
];

export function GlobalMobileCta({ text }: { text: string }) {
  const pathname = usePathname() ?? "";
  if (SKIP_PATTERNS.some((re) => re.test(pathname))) return null;
  return <StickyMobileCta text={text} url="/contacto" />;
}
