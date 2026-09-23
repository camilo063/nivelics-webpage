import { cache } from "react";
import { getSiteConfigPublic } from "@/lib/cms/queries";
import { resolveContacto, type ContactoSitio } from "@/lib/cms/contacto-shared";

/**
 * FUENTE ÚNICA de los datos de contacto del sitio.
 *
 * Se cambian en Admin → Configuración (fila `main` de `site_config`) y aplican
 * a todo: páginas, pie, llms.txt y los datos estructurados (Organization,
 * LocalBusiness). Ninguna superficie pública debe volver a escribir un correo,
 * un teléfono o un perfil social a mano.
 *
 * Precedencia, de mayor a menor:
 *   1. `site_config` (BD, editable desde el admin)
 *   2. `data/fallbacks/site_config.json` (lo sirve `getSiteConfigPublic()` cuando
 *      `USE_DB_FALLBACKS=true` o no hay `DATABASE_URL`)
 *   3. `SITE` en lib/constants — último respaldo si la BD cae y el fallback
 *      tampoco trae el campo.
 *
 * El pie intercala una cuarta fuente, legacy, entre la 2 y la 3: los campos
 * `contactEmail` / `contactWhatsappUrl` / `socialLinkedin` / `socialInstagram`
 * de `nav_config.footer`. Ver el comentario de precedencia en
 * `components/layout/footer-client.tsx`.
 *
 * ESTE MÓDULO ES SOLO DE SERVIDOR: `getSiteConfigPublic()` toca la BD. Un Client
 * Component debe recibir el resultado por props (ver `components/layout/footer.tsx`)
 * e importar el tipo y el respaldo desde `@/lib/cms/contacto-shared`.
 */
export {
  resolveContacto,
  CONTACTO_FALLBACK,
  type ContactoSitio,
  type ConfigContacto,
} from "@/lib/cms/contacto-shared";

/**
 * Datos de contacto del sitio. Memoizado por request: `getSiteConfigPublic()`
 * ya lo está, así que varias llamadas en el mismo árbol cuestan una consulta.
 * Nunca lanza: si la BD falla, devuelve los respaldos.
 */
export const getContactoSitio = cache(async (): Promise<ContactoSitio> => {
  const config = await getSiteConfigPublic().catch(() => null);
  return resolveContacto(config);
});
