import { SITE } from "@/lib/constants";

/**
 * El número de WhatsApp del sitio vive en Admin → Configuración
 * (`site_config.phone_whatsapp`). Estos helpers son el único punto donde se
 * resuelve el formato, para que cambiarlo desde el admin no exija tocar código
 * ni redeployar.
 *
 * Prioridad: lo guardado en el admin → la constante de `lib/constants`. Esa
 * constante es el último respaldo por si la base está caída y los fallbacks del
 * CMS devuelven `null` en ese campo; no hay override por variable de entorno
 * (existía `NEXT_PUBLIC_WHATSAPP_NUMBER` y era una tercera fuente de verdad que
 * podía quedarse con un número viejo sin que nadie se enterara).
 *
 * Quien necesite el dato completo (correo + teléfono + redes) debe usar
 * `getContactoSitio()` de `lib/cms/contacto.ts`, que ya resuelve todo junto.
 */
function digits(value?: string | null): string {
  return (value ?? "").replace(/\D/g, "");
}

/** Número apto para `wa.me`: solo dígitos, sin "+", espacios ni guiones. */
export function waNumber(configured?: string | null): string {
  return digits(configured) || digits(SITE.whatsapp);
}

/** Link `wa.me` completo, con mensaje pre-cargado opcional. */
export function waUrl(configured?: string | null, message?: string): string {
  const url = `https://wa.me/${waNumber(configured)}`;
  return message ? `${url}?text=${encodeURIComponent(message)}` : url;
}

/** Número tal como se muestra al usuario (conserva el "+" y el formato). */
export function waDisplay(configured?: string | null): string {
  return configured?.trim() || SITE.whatsapp;
}

/** Forma E.164 (`+573112146459`), que es la que pide schema.org en `telephone`. */
export function waE164(configured?: string | null): string {
  return `+${waNumber(configured)}`;
}
