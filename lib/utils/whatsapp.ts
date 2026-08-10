import { SITE } from "@/lib/constants";

/**
 * El número de WhatsApp del sitio vive en Admin → Configuración
 * (`site_config.phone_whatsapp`). Estos helpers son el único punto donde se
 * resuelve, para que cambiarlo desde el admin no exija tocar código ni
 * redeployar.
 *
 * Prioridad: lo guardado en el admin → variable de entorno → el número
 * histórico del código. Las dos últimas quedan como red de seguridad si la
 * base está caída (los fallbacks del CMS devuelven `null` en ese campo).
 */
function digits(value?: string | null): string {
  return (value ?? "").replace(/\D/g, "");
}

/** Número apto para `wa.me`: solo dígitos, sin "+", espacios ni guiones. */
export function waNumber(configured?: string | null): string {
  return (
    digits(configured) || digits(process.env.NEXT_PUBLIC_WHATSAPP_NUMBER) || digits(SITE.whatsapp)
  );
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
