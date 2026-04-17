import "server-only";
import { cache } from "react";
import { db } from "@/lib/db";
import { uiLabels } from "@/lib/db/schema/admin";
import type { UiLabelMap } from "./ui-labels-helper";

/**
 * Server-only fetcher for the full map of ui_labels.
 * The pure `uiLabel(map, key, locale)` resolver lives in `ui-labels-helper.ts`
 * so it can be imported by client components without pulling `db` / `pg` into
 * the client bundle.
 */
export const getAllUiLabels = cache(async (): Promise<UiLabelMap> => {
  if (!db) return {};
  const rows = await db.select().from(uiLabels);
  const map: UiLabelMap = {};
  for (const r of rows) {
    map[r.key] = { es: r.labelEs, en: r.labelEn };
  }
  return map;
});
