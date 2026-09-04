/**
 * Puente con Niveleads: el formulario de este sitio también entra a la
 * plataforma comercial.
 *
 * EL PROBLEMA QUE RESUELVE
 * Este sitio captura los UTM correctamente y guarda el lead en SU base. Pero
 * ahí se quedaba: nunca llegaba a Niveleads, así que la atribución de
 * marketing de la plataforma solo veía las landings que ella misma sirve. La
 * pregunta «¿de qué campaña salió este cierre?» no se podía contestar para
 * nadie que hubiera entrado por nivelics.com — que es la mayor parte.
 *
 * TRES REGLAS
 *
 *  1. NUNCA ROMPE EL FORMULARIO. Si Niveleads está caído, si la clave está
 *     mal o si tarda, el visitante no se entera y su lead ya está guardado
 *     aquí. Esta función no lanza nunca y tiene su propio tiempo de espera.
 *  2. NO SE REENVÍA EL SPAM. Este sitio ya lo clasifica; mandarlo ensuciaría
 *     la base comercial con lo que aquí ya se descartó.
 *  3. SI NO ESTÁ CONFIGURADO, NO PASA NADA. Sin las dos variables de entorno
 *     el puente no existe y el sitio funciona como siempre.
 */

const TIMEOUT_MS = 4000;

export interface LeadParaNiveleads {
  nombre: string;
  empresa: string;
  email: string;
  servicio?: string | null;
  fuente: string;
  mensaje?: string | null;
  referrerUrl?: string | null;
  utmSource?: string | null;
  utmMedium?: string | null;
  utmCampaign?: string | null;
  utmContent?: string | null;
}

export type ResultadoPuente =
  | { estado: "enviado" }
  | { estado: "sin_configurar" }
  | { estado: "error"; motivo: string };

/**
 * Manda el lead a Niveleads. Devuelve qué pasó (para el log), nunca lanza.
 *
 * El `source_type` dice de dónde vino: en Niveleads eso es lo que separa los
 * formularios de este sitio de los de sus propias landings, y sin esa
 * distinción las dos cosas se contarían como una sola.
 */
export async function enviarLeadANiveleads(lead: LeadParaNiveleads): Promise<ResultadoPuente> {
  const url = process.env.NIVELEADS_CAPTURE_URL;
  const key = process.env.NIVELEADS_CAPTURE_KEY;
  if (!url || !key) return { estado: "sin_configurar" };

  // La clave se añade como parámetro, no pegando `?key=` al final: si alguien
  // configura la URL con query (`…/capture?x=1`) la cadena resultante tendría
  // dos «?» y Niveleads no vería ninguna clave — es decir, el puente quedaría
  // mudo con las dos variables puestas, que es el fallo más difícil de ver.
  let destino: URL;
  try {
    destino = new URL(url);
  } catch {
    return { estado: "error", motivo: "NIVELEADS_CAPTURE_URL no es una URL válida" };
  }
  destino.searchParams.set("key", key);

  const controlador = new AbortController();
  const temporizador = setTimeout(() => controlador.abort(), TIMEOUT_MS);

  try {
    const respuesta = await fetch(destino, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      signal: controlador.signal,
      body: JSON.stringify({
        full_name: lead.nombre,
        email: lead.email,
        company: lead.empresa,
        message: lead.mensaje ?? undefined,
        // Niveleads exige estos tres para poder atribuir. `source_page` es de
        // dónde venía la persona; si no lo sabemos, se dice el sitio, no una
        // página inventada.
        source_page: lead.referrerUrl ?? "https://www.nivelics.com",
        source_type: "nivelics-web",
        source_form: lead.fuente,
        source_function: lead.servicio ?? undefined,
        utm_source: lead.utmSource ?? undefined,
        utm_medium: lead.utmMedium ?? undefined,
        utm_campaign: lead.utmCampaign ?? undefined,
        utm_content: lead.utmContent ?? undefined,
      }),
    });

    if (!respuesta.ok) {
      // El cuerpo se lee para el log: un 401 aquí significa clave mal puesta,
      // y sin verlo escrito nadie lo descubriría hasta echar de menos leads.
      const detalle = await respuesta.text().catch(() => "");
      return { estado: "error", motivo: `HTTP ${respuesta.status} ${detalle.slice(0, 200)}` };
    }
    return { estado: "enviado" };
  } catch (error) {
    const motivo =
      (error as Error).name === "AbortError"
        ? `sin respuesta en ${TIMEOUT_MS} ms`
        : (error as Error).message;
    return { estado: "error", motivo };
  } finally {
    clearTimeout(temporizador);
  }
}
