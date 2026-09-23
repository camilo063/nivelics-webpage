import { SITE } from "@/lib/constants";
import { waDisplay, waE164, waUrl } from "@/lib/utils/whatsapp";

/**
 * Parte CLIENTE-SEGURA de los datos de contacto: el tipo, el resolutor puro y el
 * respaldo de código. No importa nada de la base de datos.
 *
 * El módulo que sí consulta `site_config` es `lib/cms/contacto.ts`
 * (`getContactoSitio()`), y solo puede usarse desde el servidor. Es la misma
 * separación que ya existe entre `lib/cms/ui-labels.ts` (servidor) y
 * `lib/cms/ui-labels-helper.ts` (cliente): si un Client Component importara el
 * módulo servidor, Next arrastraría `server-only` al bundle del navegador y la
 * página caería con un 500.
 *
 * La documentación de la fuente única y su precedencia está en
 * `lib/cms/contacto.ts`.
 */
export interface ContactoSitio {
  /** Correo público, tal como se muestra y como va en `mailto:`. */
  email: string;
  /** `mailto:` listo para un href. */
  emailHref: string;
  /** Teléfono tal como se muestra (conserva el "+" y el formato guardado). */
  whatsappDisplay: string;
  /** Link `wa.me` sin mensaje pre-cargado. */
  whatsappUrl: string;
  /** Forma E.164 (`+573112146459`) para `telephone` de schema.org. */
  whatsappE164: string;
  /** Perfil de LinkedIn ya resuelto (incluye respaldo de código). */
  linkedin: string | null;
  /** Perfil de Instagram ya resuelto (incluye respaldo de código). */
  instagram: string | null;
  /** Perfiles externos no vacíos, listos para el `sameAs` de schema.org. */
  sameAs: string[];
  /** Sede de Bogotá tal como se muestra. */
  addressBogota: string;
  /** Sede de Miami tal como se muestra. */
  addressMiami: string;
  /**
   * Lo que trae `site_config` sin respaldos: `null` cuando el admin dejó el campo
   * vacío. Sirve para intercalar una fuente intermedia antes de los respaldos de
   * código (el pie lo usa para seguir aceptando los campos legacy de
   * `nav_config.footer`).
   */
  configured: {
    email: string | null;
    whatsappUrl: string | null;
    linkedin: string | null;
    instagram: string | null;
  };
}

/** Solo los campos de `site_config` que este módulo necesita. */
export type ConfigContacto = {
  emailContact?: string | null;
  phoneWhatsapp?: string | null;
  addressBogota?: string | null;
  addressMiami?: string | null;
  linkedinUrl?: string | null;
  instagramUrl?: string | null;
};

function clean(value?: string | null): string | null {
  const trimmed = value?.trim();
  return trimmed ? trimmed : null;
}

/** Construye el objeto a partir de una fila de `site_config` (o de nada). */
export function resolveContacto(config: ConfigContacto | null | undefined): ContactoSitio {
  const email = clean(config?.emailContact) ?? SITE.email;
  const phone = clean(config?.phoneWhatsapp);
  const linkedin = clean(config?.linkedinUrl) ?? SITE.linkedin;
  const instagram = clean(config?.instagramUrl) ?? SITE.instagram;

  return {
    email,
    emailHref: `mailto:${email}`,
    whatsappDisplay: waDisplay(phone),
    whatsappUrl: waUrl(phone),
    whatsappE164: waE164(phone),
    linkedin,
    instagram,
    sameAs: [linkedin, instagram].filter((v): v is string => Boolean(v)),
    addressBogota: clean(config?.addressBogota) ?? SITE.locations[0],
    addressMiami: clean(config?.addressMiami) ?? SITE.locations[1],
    configured: {
      email: clean(config?.emailContact),
      whatsappUrl: phone ? waUrl(phone) : null,
      linkedin: clean(config?.linkedinUrl),
      instagram: clean(config?.instagramUrl),
    },
  };
}

/**
 * Los mismos datos pero sin tocar la BD. Es el respaldo que usan los esquemas
 * cuando quien los renderiza no puede hacer `await` (parámetro por defecto).
 */
export const CONTACTO_FALLBACK: ContactoSitio = resolveContacto(null);
