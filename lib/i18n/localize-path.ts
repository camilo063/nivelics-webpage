// Traduce rutas internas entre ES y EN con el mapa de `routing.pathnames`.
//
// El header, el footer y varios componentes arman enlaces con la ruta ES (vienen así de
// nav_config y de las constantes) y los pintan con `next/link` plano: en /en quedaban
// apuntando a /servicios/... y el visitante saltaba al español. Esta función es pura
// (sin hooks) para poder usarla en componentes de servidor y de cliente.
import { routing } from "./routing";

type Locale = "es" | "en";

interface Route {
  es: string;
  en: string;
  /** Solo para rutas con [slug]: regex por idioma con un grupo por segmento dinámico. */
  esRe?: RegExp;
  enRe?: RegExp;
}

const toRegex = (pattern: string) =>
  new RegExp("^" + pattern.replace(/\[[^\]]+\]/g, "([^/]+)") + "$");

const ROUTES: Route[] = Object.values(routing.pathnames).map((value) => {
  const { es, en } = typeof value === "string" ? { es: value, en: value } : value;
  return es.includes("[") ? { es, en, esRe: toRegex(es), enRe: toRegex(en) } : { es, en };
});

const EXACT_ES = new Map(ROUTES.filter((r) => !r.esRe).map((r) => [r.es, r.en]));
const EXACT_EN = new Map(ROUTES.filter((r) => !r.enRe).map((r) => [r.en, r.es]));

// Prefijos estáticos ordenados de más largo a más corto, para rutas que no están en el mapa
// (p. ej. /blog/<slug> o /blog/categoria/<x>): se traduce el tramo conocido más largo.
const PREFIX_ES = [...EXACT_ES.entries()]
  .filter(([es]) => es !== "/")
  .sort((a, b) => b[0].length - a[0].length);
const PREFIX_EN = [...EXACT_EN.entries()]
  .filter(([en]) => en !== "/")
  .sort((a, b) => b[0].length - a[0].length);

function fill(pattern: string, values: string[]): string {
  let i = 0;
  return pattern.replace(/\[[^\]]+\]/g, () => values[i++] ?? "");
}

function esToEn(path: string): string {
  const exact = EXACT_ES.get(path);
  if (exact !== undefined) return exact;
  for (const r of ROUTES) {
    const m = r.esRe?.exec(path);
    if (m) return fill(r.en, m.slice(1));
  }
  for (const [es, en] of PREFIX_ES) {
    if (path.startsWith(es + "/")) return en + path.slice(es.length);
  }
  return path;
}

function enToEs(path: string): string {
  const exact = EXACT_EN.get(path);
  if (exact !== undefined) return exact;
  for (const r of ROUTES) {
    const m = r.enRe?.exec(path);
    if (m) return fill(r.es, m.slice(1));
  }
  for (const [en, es] of PREFIX_EN) {
    if (path.startsWith(en + "/")) return es + path.slice(en.length);
  }
  return path;
}

/** Rutas que no son páginas localizadas: se devuelven tal cual. */
const PASSTHROUGH = /^\/(api|_next|llms|sitemap|feed|robots|uploads|og|blog\/agentes)(\/|\.|$)/;

function split(href: string): { path: string; rest: string } {
  const i = href.search(/[?#]/);
  return i === -1 ? { path: href, rest: "" } : { path: href.slice(0, i), rest: href.slice(i) };
}

/**
 * Convierte un enlace interno escrito con la ruta ES al idioma pedido.
 * Externos, anclas, mailto/tel, assets y rutas ya prefijadas con /en no se tocan.
 */
export function localizePath(href: string, locale: Locale): string {
  if (locale !== "en") return href;
  if (!href.startsWith("/") || href.startsWith("//")) return href;
  if (
    href === "/en" ||
    href.startsWith("/en/") ||
    href.startsWith("/en?") ||
    href.startsWith("/en#")
  )
    return href;
  const { path, rest } = split(href);
  if (PASSTHROUGH.test(path) || /\.[a-z0-9]+$/i.test(path)) return href;
  const en = esToEn(path);
  return (en === "/" ? "/en" : "/en" + en) + rest;
}

function isKnownEs(path: string): boolean {
  if (EXACT_ES.has(path)) return true;
  if (ROUTES.some((r) => r.esRe?.test(path))) return true;
  return PREFIX_ES.some(([es]) => path.startsWith(es + "/"));
}

/**
 * Ruta ES canónica de un pathname de página, venga como venga:
 *  - /servicios/cloud            (ES)
 *  - /en/services/cloud          (EN externo, lo que ve el navegador)
 *  - /en/servicios/cloud         (EN interno: así llega en SSR tras el rewrite de next-intl)
 *  - /es/servicios/cloud         (ES interno: ídem para las páginas en español)
 * Sin esto el selector de idioma y el estado «activo» del menú daban cosas distintas en
 * el servidor y en el cliente.
 */
export function canonicalEsPath(pathname: string): string {
  // En SSR next-intl también reescribe las rutas ES con prefijo interno: /es/servicios.
  if (pathname === "/es" || pathname.startsWith("/es/")) return pathname.slice(3) || "/";
  const isEn = pathname === "/en" || pathname.startsWith("/en/");
  if (!isEn) return pathname;
  const bare = pathname.slice(3) || "/";
  return isKnownEs(bare) ? bare : enToEs(bare);
}

/** Ruta equivalente de la página actual en el otro idioma (selector ES/EN). */
export function switchLocalePath(pathname: string, target: Locale): string {
  const es = canonicalEsPath(pathname);
  return target === "en" ? localizePath(es, "en") : es;
}
