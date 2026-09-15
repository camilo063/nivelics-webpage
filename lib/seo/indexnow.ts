/**
 * IndexNow — avisa a Bing y Yandex en cuanto se publica o se edita algo.
 *
 * Para qué sirve, y para qué NO: esto alimenta a Copilot y a parte de ChatGPT
 * Search, que se apoyan en el índice de Bing. **A Google no**: Google no
 * participa en IndexNow, así que sus AI Overviews y Gemini siguen dependiendo
 * del rastreo normal y de Search Console. Y a ChatGPT, Claude o Perplexity no
 * se les puede "pedir" que indexen: rastrean por su cuenta, y lo único bajo
 * nuestro control es que robots.txt se lo permita — cosa que ya hace.
 *
 * La clave NO es un secreto: el protocolo exige servirla públicamente en
 * `/<clave>.txt` para probar que el dominio es nuestro. Por eso vive en el
 * repo y no en una variable de entorno. Si se cambia aquí, hay que renombrar
 * también el archivo de `public/`, o Bing rechaza los envíos.
 */
const KEY = "7a85b7ee9196459d398ca47a11c9b30f";

const HOST = "www.nivelics.com";
const BASE = `https://${HOST}`;
const ENDPOINT = "https://api.indexnow.org/indexnow";

/** Tope del protocolo: 10 000 URLs por envío. */
const MAX_URLS = 10_000;

export function indexNowKeyLocation(): string {
  return `${BASE}/${KEY}.txt`;
}

export type PingResult =
  | { ok: true; enviadas: number }
  | { ok: false; motivo: string; status?: number };

/**
 * Envía un lote de URLs absolutas. No lanza nunca: avisar a un buscador no
 * puede tumbar un guardado del admin ni un script.
 */
export async function pingIndexNow(urls: string[]): Promise<PingResult> {
  const urlList = [...new Set(urls)].filter((u) => u.startsWith(BASE)).slice(0, MAX_URLS);
  if (urlList.length === 0) return { ok: false, motivo: "sin URLs del propio host" };

  try {
    const res = await fetch(ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json; charset=utf-8" },
      body: JSON.stringify({ host: HOST, key: KEY, keyLocation: indexNowKeyLocation(), urlList }),
      signal: AbortSignal.timeout(10_000),
    });

    // 200 y 202 son los dos éxitos del protocolo: 202 significa "recibido,
    // pendiente de validar la clave". Tratar 202 como fallo llenaría el log de
    // errores en el caso normal.
    if (res.status === 200 || res.status === 202) return { ok: true, enviadas: urlList.length };
    return { ok: false, motivo: `respuesta ${res.status}`, status: res.status };
  } catch (e) {
    return { ok: false, motivo: e instanceof Error ? e.message : "error desconocido" };
  }
}
