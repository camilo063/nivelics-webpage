"use server";

import { revalidatePath } from "next/cache";
import { after } from "next/server";
import { routing } from "@/lib/i18n/routing";
import { pingIndexNow } from "@/lib/seo/indexnow";

type PathnameEntry = string | Record<string, string>;

/**
 * `/nosotros/equipo` + `en` → `/en/about/team`.
 *
 * The public URLs are unprefixed in ES (`localePrefix: "as-needed"`), but the
 * middleware rewrites them to `/es/...` before they reach the router, and the
 * Full Route Cache is keyed by that rewritten path. Revalidating `/` alone
 * never matched the entry that actually serves the home page.
 */
function toLocalePath(path: string, locale: string): string {
  const entry = (routing.pathnames as Record<string, PathnameEntry>)[path];
  const localized = typeof entry === "string" ? entry : entry?.[locale];
  const resolved = localized ?? path;
  return resolved === "/" ? `/${locale}` : `/${locale}${resolved}`;
}

/**
 * Revalidate public site pages after CMS changes, in every locale.
 */
export async function revalidatePublicPages(paths: string[]) {
  for (const path of paths) {
    const targets = [path, ...routing.locales.map((locale) => toLocalePath(path, locale))];
    for (const target of targets) {
      try {
        revalidatePath(target);
      } catch (e) {
        console.error(`Revalidation error for ${target}:`, e);
      }
    }
  }

  // Avisar a IndexNow (Bing/Yandex, y con ello Copilot) va DESPUÉS de responder:
  // va en after() para que una caída suya no alargue ni rompa un guardado del
  // admin. Se manda la lista explícita, no el sitio entero: el protocolo
  // penaliza avisar de URLs que no cambiaron.
  const urls = paths.flatMap((path) =>
    routing.locales.map((locale) => {
      const localized = toLocalePath(path, locale);
      // toLocalePath devuelve /es/... y /en/...; la URL pública en español no
      // lleva prefijo (localePrefix "as-needed"), así que se le quita.
      const publica =
        locale === routing.defaultLocale ? localized.replace(/^\/es/, "") || "/" : localized;
      return `https://www.nivelics.com${publica}`;
    }),
  );

  after(async () => {
    const res = await pingIndexNow(urls);
    if (!res.ok) console.error("[indexnow] no se pudo avisar:", res.motivo);
  });

  // Nav, footer, home strips and cross-links mean an explicit path list is
  // never complete: editing a service also changes the mega-menu on every
  // page. The root layout tag invalidates every public route — on a site that
  // publishes a handful of times a day that costs less than a stale page.
  try {
    revalidatePath("/", "layout");
  } catch (e) {
    console.error("Root layout revalidation error:", e);
  }
}
