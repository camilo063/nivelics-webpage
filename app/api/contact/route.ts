import { NextResponse, after } from "next/server";
import { z } from "zod";
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";
import { contactSchema } from "@/lib/validations/contact";
import { db } from "@/lib/db";
import { leads } from "@/lib/db/schema/admin";
import { sendLeadEmail } from "@/lib/email/send";
import { sendLeadConfirmation, detectLocaleFromReferrer } from "@/lib/email/send-confirmation";
import { checkRateLimit, getRequestIp } from "@/lib/security/rate-limit";
import { isHoneypotTriggered, isTimingSuspicious } from "@/lib/security/anti-bot";
import { isLikelySpam } from "@/lib/security/spam-detection";

const requestSchema = contactSchema.extend({
  referrerUrl: z.string().url().optional(),
  fromService: z.string().trim().max(200).optional(),
});

const ratelimit =
  process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN
    ? new Ratelimit({
        redis: Redis.fromEnv(),
        limiter: Ratelimit.slidingWindow(3, "1 h"),
        analytics: true,
        prefix: "nivelics:contact",
      })
    : null;

export async function POST(request: Request) {
  try {
    const ip = getRequestIp(request);

    // Capa 3 (burst): 3 submits per minute per IP via in-memory bucket.
    // Stacks on top of the 3/hour Upstash limit below.
    const burst = checkRateLimit(`contact:${ip}`, { max: 3, windowMs: 60_000 });
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
      console.warn("[spam] honeypot triggered", { ip });
      return NextResponse.json({ success: true, message: "Mensaje recibido correctamente" });
    }

    // Capa 2 — time-based check. Sub-3s submits are bots; >1h means stale token.
    const timing = isTimingSuspicious(body._ts);
    if (timing === "too_fast") {
      console.warn("[spam] timing too_fast", { ip });
      return NextResponse.json({ success: true, message: "Mensaje recibido correctamente" });
    }
    if (timing === "too_old") {
      return NextResponse.json(
        { error: "Sesión expirada. Recarga la página e intenta de nuevo." },
        { status: 400 },
      );
    }

    const result = requestSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json(
        { error: "Datos inválidos", details: result.error.flatten().fieldErrors },
        { status: 400 },
      );
    }

    const { name, email, company, service, message, referrerUrl, fromService } = result.data;
    const origin = fromService?.trim() || null;

    // Capa 4 — content heuristics.
    const spamCheck = isLikelySpam({ name, email, company, message });
    if (spamCheck.spam) {
      console.warn("[spam] heuristic triggered", { reason: spamCheck.reason, ip });
    }

    if (!db) {
      console.error("[api/contact] DB not available");
      return NextResponse.json({ error: "Servicio temporalmente no disponible" }, { status: 503 });
    }

    const [lead] = await db
      .insert(leads)
      .values({
        nombre: name,
        empresa: company,
        email: email.toLowerCase(),
        servicio: service,
        fuente: "contact",
        mensaje: message,
        referrerUrl: referrerUrl ?? null,
        fromService: origin,
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
        message: "Mensaje recibido correctamente",
      });
    }

    const mail = await sendLeadEmail({
      fuente: "contact",
      nombre: name,
      email,
      empresa: company,
      servicio: service,
      mensaje: message,
      referrerUrl: referrerUrl ?? null,
      fromService: origin,
    });

    if (!mail.ok && !mail.skipped) {
      console.error("[api/contact] Email delivery failed but lead saved:", mail.error);
    }

    after(async () => {
      const res = await sendLeadConfirmation({
        to: email,
        nombre: name,
        locale: detectLocaleFromReferrer(referrerUrl),
        servicio: service,
      });
      if (!res.sent && !res.skipped) {
        console.error("[api/contact] Confirmation failed:", res.error);
      }
    });

    return NextResponse.json({
      success: true,
      id: lead.id,
      message: "Mensaje recibido correctamente",
    });
  } catch (e) {
    console.error("[api/contact] Unhandled error:", e);
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
  }
}
