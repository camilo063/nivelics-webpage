/**
 * Helper to fetch servicio data from DB with locale resolution.
 * Used by all service page.tsx files in the public site.
 * Falls back gracefully if DB is unavailable.
 */
import { getServicio, getServiciosByParent, getHubServicios } from "./queries";
import { mapServicio } from "./mappers";
import type { Locale, MappedServicio } from "./types";

export async function getServicioData(
  slugEs: string,
  locale: Locale,
): Promise<MappedServicio | null> {
  try {
    const raw = await getServicio(slugEs);
    if (!raw) return null;
    return mapServicio(raw as Record<string, unknown>, locale);
  } catch (e) {
    console.error(`CMS error for servicio ${slugEs}:`, e);
    return null;
  }
}

export async function getSubserviciosData(
  parentId: string,
  locale: Locale,
): Promise<MappedServicio[]> {
  try {
    const raw = await getServiciosByParent(parentId);
    return raw.map((r) => mapServicio(r as Record<string, unknown>, locale));
  } catch (e) {
    console.error("CMS error for subservicios:", e);
    return [];
  }
}

export async function getHubServiciosData(locale: Locale): Promise<MappedServicio[]> {
  try {
    const raw = await getHubServicios();
    return raw.map((r) => mapServicio(r as Record<string, unknown>, locale));
  } catch (e) {
    console.error("CMS error for hub servicios:", e);
    return [];
  }
}
