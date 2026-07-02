import { NextRequest, NextResponse, after } from "next/server";
import { z } from "zod";
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";
import { db } from "@/lib/db";
import { leads } from "@/lib/db/schema/admin";
import { sendLeadEmail } from "@/lib/email/send";
import { sendLeadConfirmation, detectLocaleFromReferrer } from "@/lib/email/send-confirmation";
import { checkRateLimit, getRequestIp } from "@/lib/security/rate-limit";
import { isHoneypotTriggered, isTimingSuspicious } from "@/lib/security/anti-bot";
import { isLikelySpam } from "@/lib/security/spam-detection";

const applySchema = z.object({
  name: z.string().trim().min(2, "Nombre requerido").max(200),
  email: z.string().trim().email("Email inválido").max(320),
  role: z.string().trim().min(1, "Selecciona un rol").max(100),
  linkedin: z.string().trim().url("LinkedIn inválido").max(500).optional().or(z.literal("")),
  message: z.string().trim().max(2000).optional(),
  referrerUrl: z.string().url().optional(),
});

const ratelimit =
  process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN
    ? new Ratelimit({
        redis: Redis.fromEnv(),
        limiter: Ratelimit.slidingWindow(3, "1 h"),
        analytics: true,
        prefix: "nivelics:apply",
      })
    : null;

export async function POST(request: NextRequest) {
  try {
    const ip = getRequestIp(request);

    // Capa 3 (burst): 3 submits per minute per IP via in-memory bucket.
    // Stacks on top of the 3/hour Upstash limit below.
    const burst = checkRateLimit(`apply:${ip}`, { max: 3, windowMs: 60_000 });
    if (!burst.ok) {
      return NextResponse.json(
        { error: "Demasiados intentos. Intenta en un minuto." },
        { status: 429, headers: { "Retry-After": String(burst.retryAfter ?? 60) } },
      );
    }

    if (ratelimit) {
      const { success, limit, remaining } = await ratelimit.limit(ip);
      if (!success) {
        return NextResponse.json(
          { error: "Demasiados intentos. Por favor intenta en 1 hora." },
          {
            status: 429,
            headers: {
              "X-RateLimit-Limit": String(limit),
              "X-RateLimit-Remaining": String(remaining),
            },
          },
        );
      }
    }

    const body = (await request.json()) as Record<string, unknown>;

    // Capa 1 — honeypot. Bots fill every field; humans never see it.
    // Return 200 so the bot considers the submission successful and stops retrying.
    if (isHoneypotTriggered(body.website)) {
      console.warn("[spam] honeypot triggered", { ip, route: "apply" });
      return NextResponse.json({ success: true, message: "Solicitud recibida" });
    }

    // Capa 2 — time-based check. Sub-3s submits are bots; >1h means stale token.
    const timing = isTimingSuspicious(body._ts);
    if (timing === "too_fast") {
      console.warn("[spam] timing too_fast", { ip, route: "apply" });
      return NextResponse.json({ success: true, message: "Solicitud recibida" });
    }
    if (timing === "too_old") {
      return NextResponse.json(
        { error: "Sesión expirada. Recarga la página e intenta de nuevo." },
        { status: 400 },
      );
    }

    const parsed = applySchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Datos inválidos", details: parsed.error.flatten().fieldErrors },
        { status: 400 },
      );
    }

    const { name, email, role, linkedin, message, referrerUrl } = parsed.data;

    // Capa 4 — content heuristics.
    const spamCheck = isLikelySpam({ name, email, company: null, message: message || null });
    if (spamCheck.spam) {
      console.warn("[spam] heuristic triggered", { reason: spamCheck.reason, ip, route: "apply" });
    }

    if (!db) {
      console.error("[api/apply] DB not available");
      return NextResponse.json({ error: "Servicio temporalmente no disponible" }, { status: 503 });
    }

    const [lead] = await db
      .insert(leads)
      .values({
        nombre: name,
        empresa: null,
        email: email.toLowerCase(),
        servicio: role,
        fuente: "careers",
        mensaje: message || null,
        referrerUrl: referrerUrl ?? null,
        isSpam: spamCheck.spam,
        spamReason: spamCheck.reason ?? null,
      })
      .returning({ id: leads.id });

    // Skip notification + confirmation emails for spam leads — they still get
    // logged in the DB so we can review false positives.
    if (spamCheck.spam) {
      return NextResponse.json({
        success: true,
        id: lead.id,
        message: "Solicitud recibida",
      });
    }

    const mail = await sendLeadEmail({
      fuente: "careers",
      nombre: name,
      email,
      empresa: null,
      servicio: role,
      mensaje: message || null,
      referrerUrl: referrerUrl ?? null,
      extra: { LinkedIn: linkedin || null, Rol: role },
    });

    if (!mail.ok && !mail.skipped) {
      console.error("[api/apply] Email delivery failed but lead saved:", mail.error);
    }

    after(async () => {
      const res = await sendLeadConfirmation({
        to: email,
        nombre: name,
        locale: detectLocaleFromReferrer(referrerUrl),
        servicio: role,
      });
      if (!res.sent && !res.skipped) {
        console.error("[api/apply] Confirmation failed:", res.error);
      }
    });

    return NextResponse.json({
      success: true,
      id: lead.id,
      message: "Solicitud recibida",
    });
  } catch (e) {
    console.error("[api/apply] Unhandled error:", e);
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
  }
}
