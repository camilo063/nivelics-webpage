/**
 * Anuncia a IndexNow todas las URLs del sitemap (o las que se pasen por
 * argumento). Sirve para el arranque —cuando nunca se ha avisado de nada— y
 * para reanunciar después de un cambio grande.
 *
 * El día a día NO necesita esto: `revalidatePublicPages` ya avisa solo en cada
 * guardado del admin. Este script es para el empujón inicial.
 *
 * Correr:
 *   node --import tsx scripts/indexnow-submit.ts
 *   node --import tsx scripts/indexnow-submit.ts /servicios/cloud /otra/ruta
 */
import { pingIndexNow, indexNowKeyLocation } from "../lib/seo/indexnow";

const BASE = "https://www.nivelics.com";

async function urlsDelSitemap(): Promise<string[]> {
  const urls: string[] = [];
  for (const loc of ["es", "en"]) {
    const res = await fetch(`${BASE}/sitemap/${loc}.xml`, { signal: AbortSignal.timeout(20_000) });
    if (!res.ok) throw new Error(`sitemap ${loc} respondió ${res.status}`);
    const xml = await res.text();
    urls.push(...[...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]));
  }
  return urls;
}

async function main() {
  const args = process.argv.slice(2);
  const urls = args.length
    ? args.map((a) => (a.startsWith("http") ? a : `${BASE}${a.startsWith("/") ? a : `/${a}`}`))
    : await urlsDelSitemap();

  console.log(`clave publicada en: ${indexNowKeyLocation()}`);
  console.log(`URLs a anunciar:    ${urls.length}`);

  // La clave tiene que ser alcanzable ANTES de enviar: si no, Bing acepta el
  // lote con un 202 y lo descarta al validar, sin que nada lo diga.
  const k = await fetch(indexNowKeyLocation(), { signal: AbortSignal.timeout(15_000) });
  if (!k.ok) {
    console.error(`✗ la clave no se sirve todavía (${k.status}). ¿Está desplegado el cambio?`);
    process.exit(1);
  }
  console.log("✓ clave alcanzable\n");

  const res = await pingIndexNow(urls);
  if (res.ok) {
    console.log(`✓ IndexNow aceptó ${res.enviadas} URLs`);
    process.exit(0);
  }
  console.error(`✗ IndexNow rechazó el envío: ${res.motivo}`);
  process.exit(1);
}

main().catch((e) => {
  console.error("✗ el script no llegó al final:", e);
  process.exit(1);
});
