"use client";

// `next/link` que traduce solo el href al idioma activo (ver lib/i18n/localize-path.ts).
// Pensado para componentes que reciben rutas ES desde la BD o constantes (header, footer).
// Para el selector de idioma se usa `next/link` directo con switchLocalePath: ahí el href
// ya viene resuelto al idioma de destino y no se debe volver a traducir.
import Link from "next/link";
import { useLocale } from "next-intl";
import type { ComponentProps } from "react";
import { localizePath } from "@/lib/i18n/localize-path";

type Props = Omit<ComponentProps<typeof Link>, "href"> & { href: string };

export function LocaleLink({ href, ...props }: Props) {
  const locale = useLocale() === "en" ? "en" : "es";
  return <Link href={localizePath(href, locale)} {...props} />;
}
