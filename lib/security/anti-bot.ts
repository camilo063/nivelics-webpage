import { z } from "zod";

// Honeypot: hidden field that real users never fill but bots do. Must be
// empty / absent to pass.
export const honeypotSchema = z
  .union([z.string().max(0), z.literal(""), z.undefined(), z.null()])
  .optional();

// Time-based check: hidden _ts field set when the form mounts. Submissions
// faster than MIN_FILL_MS look like bots; older than MAX_AGE_MS are stale
// (bot sat on a cached page or the user left the tab open for hours).
export const MIN_FILL_MS = 3_000;
export const MAX_AGE_MS = 60 * 60 * 1000;

export const tsSchema = z.coerce
  .number()
  .int()
  .refine(
    (ts) => {
      const elapsed = Date.now() - ts;
      return elapsed >= MIN_FILL_MS && elapsed <= MAX_AGE_MS;
    },
    { message: "Invalid timing" },
  )
  .optional();

export function isHoneypotTriggered(value: unknown): boolean {
  return typeof value === "string" && value.length > 0;
}

export function isTimingSuspicious(ts: unknown): "too_fast" | "too_old" | null {
  if (ts === undefined || ts === null || ts === "") return null;
  const num = typeof ts === "string" ? Number(ts) : (ts as number);
  if (!Number.isFinite(num)) return null;
  const elapsed = Date.now() - num;
  if (elapsed < MIN_FILL_MS) return "too_fast";
  if (elapsed > MAX_AGE_MS) return "too_old";
  return null;
}
