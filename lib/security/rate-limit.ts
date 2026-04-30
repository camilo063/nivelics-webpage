// In-memory IP rate limiter. On Vercel each serverless instance gets its own
// Map, which spreads load and is fine for the volumes these forms see.
// Upstash Ratelimit (already used in /api/contact + /api/apply) is the
// distributed counterpart; this is a lightweight extra burst guard.

type Bucket = { count: number; reset: number };

const buckets = new Map<string, Bucket>();

export interface RateLimitOptions {
  max: number;
  windowMs: number;
}

export interface RateLimitResult {
  ok: boolean;
  retryAfter?: number;
}

export function checkRateLimit(ip: string, opts: RateLimitOptions): RateLimitResult {
  const now = Date.now();
  const bucket = buckets.get(ip);

  if (!bucket || bucket.reset < now) {
    buckets.set(ip, { count: 1, reset: now + opts.windowMs });
    return { ok: true };
  }

  if (bucket.count >= opts.max) {
    return { ok: false, retryAfter: Math.ceil((bucket.reset - now) / 1000) };
  }

  bucket.count++;
  return { ok: true };
}

export function getRequestIp(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) {
    const first = forwarded.split(",")[0]?.trim();
    if (first) return first;
  }
  return request.headers.get("x-real-ip") ?? "unknown";
}

// Periodic cleanup so the Map does not grow unbounded across warm invocations.
declare global {
  var __nivelicsRateLimitCleanup: NodeJS.Timeout | undefined;
}

if (typeof setInterval !== "undefined" && !globalThis.__nivelicsRateLimitCleanup) {
  globalThis.__nivelicsRateLimitCleanup = setInterval(
    () => {
      const now = Date.now();
      for (const [ip, bucket] of buckets) {
        if (bucket.reset < now) buckets.delete(ip);
      }
    },
    10 * 60 * 1000,
  );
}
