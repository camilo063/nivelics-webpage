"use client";

import { usePathname as useNextPathname } from "next/navigation";
import { useLocale } from "next-intl";
import { canonicalEsPath } from "@/lib/i18n/localize-path";
import { getWebPageSchema } from "@/lib/schema/webpage";

/**
 * WebPage canónica de la página actual: el nodo que cose el grafo
 * (`isPartOf` → WebSite, `publisher` → Organization) con la URL y el idioma
 * realmente servidos. Lo monta `PageWrapper`, así que hay exactamente una por página.
 *
 * Quien ya emite su propio subtipo de WebPage con el mismo `@id` (las páginas de
 * industria, el hub de productos) lo desactiva con `<PageWrapper webPage={false}>`;
 * el blog emite su CollectionPage/BlogPosting y se salta aquí.
 */
export function PageSchema() {
  const rawPathname = useNextPathname();
  const locale = useLocale() === "en" ? "en" : "es";
  // Igual que el breadcrumb: en SSR /en llega con la ruta ES y en cliente con la EN.
  // Se normaliza a la ruta ES y `getWebPageSchema` la traduce al idioma servido,
  // así el JSON-LD es idéntico en servidor y en cliente.
  const esPath = canonicalEsPath(rawPathname);

  if (esPath === "/blog" || esPath.startsWith("/blog/")) return null;

  const schema = getWebPageSchema({ url: esPath, locale });

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
