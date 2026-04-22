import "server-only";
import { cache } from "react";
import { db } from "@/lib/db";
import { uiLabels } from "@/lib/db/schema/admin";
import type { UiLabelMap } from "./ui-labels-helper";
import { UI_LABELS_FB } from "./fallbacks-data";

function toMap(rows: Array<{ key: string; labelEs: string; labelEn: string }>): UiLabelMap {
  const map: UiLabelMap = {};
  for (const r of rows) {
    map[r.key] = { es: r.labelEs, en: r.labelEn };
  }
  return map;
}

/**
 * Server-only fetcher for the full map of ui_labels.
 * The pure `uiLabel(map, key, locale)` resolver lives in `ui-labels-helper.ts`
 * so it can be imported by client components without pulling `db` / `pg` into
 * the client bundle.
 */
export const getAllUiLabels = cache(async (): Promise<UiLabelMap> => {
  if (!db) return toMap(UI_LABELS_FB);
  const rows = await db.select().from(uiLabels);
  return toMap(rows);
});
