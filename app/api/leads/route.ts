import { NextRequest, NextResponse, after } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { leads } from "@/lib/db/schema/admin";
import { sendLeadEmail } from "@/lib/email/send";
import { sendLeadConfirmation, detectLocaleFromReferrer } from "@/lib/email/send-confirmation";
import { checkRateLimit, getRequestIp } from "@/lib/security/rate-limit";
import { isHoneypotTriggered, isTimingSuspicious } from "@/lib/security/anti-bot";
import { isLikelySpam } from "@/lib/security/spam-detection";

const leadSchema = z.object({
  nombre: z.string().trim().min(2, "Nombre requerido"),
  empresa: z.string().trim().min(2, "Empresa requerida"),
  email: z.string().trim().email("Email inválido"),
  servicio: z.string().optional().nullable(),
  fuente: z.string().min(1, "Fuente requerida"),
  mensaje: z.string().optional().nullable(),
  referrerUrl: z.string().url().optional(),
  // UTM de la campaña (los captura el form de la LP desde la query string).
  utmSource: z.string().trim().max(255).optional().nullable(),
  utmMedium: z.string().trim().max(255).optional().nullable(),
  utmCampaign: z.string().trim().max(255).optional().nullable(),
  utmContent: z.string().trim().max(255).optional().nullable(),
});

export async function POST(request: NextRequest) {
  try {
    const ip = getRequestIp(request);

    // Capa 3 — burst rate limit (3 submits per minute per IP).
    const burst = checkRateLimit(`leads:${ip}`, { max: 3, windowMs: 60_000 });
    if (!burst.ok) {
      return NextResponse.json(
        { ok: false, error: "Demasiados intentos. Intenta en un minuto." },
        { status: 429, headers: { "Retry-After": String(burst.retryAfter ?? 60) } },
      );
    }

    const body = (await request.json()) as Record<string, unknown>;

    // Capa 1 — honeypot. Fake-success for bots so they don't retry.
    if (isHoneypotTriggered(body.website)) {
      console.warn("[spam] honeypot triggered", { ip, route: "leads" });
      return NextResponse.json({ ok: true, message: "Lead registrado" });
    }

    // Capa 2 — timing.
    const timing = isTimingSuspicious(body._ts);
    if (timing === "too_fast") {
      console.warn("[spam] timing too_fast", { ip, route: "leads" });
      return NextResponse.json({ ok: true, message: "Lead registrado" });
    }
    if (timing === "too_old") {
      return NextResponse.json(
        { ok: false, error: "Sesión expirada. Recarga la página e intenta de nuevo." },
        { status: 400 },
      );
    }

    const parsed = leadSchema.safeParse(body);
    if (!parsed.success) {
      const firstError = parsed.error.issues[0]?.message ?? "Datos inválidos";
      return NextResponse.json({ ok: false, error: firstError }, { status: 400 });
    }

    const {
      nombre,
      empresa,
      email,
      servicio,
      fuente,
      mensaje,
      referrerUrl,
      utmSource,
      utmMedium,
      utmCampaign,
      utmContent,
    } = parsed.data;

    // Capa 4 — content heuristics.
    const spamCheck = isLikelySpam({
      name: nombre,
      email,
      company: empresa,
      message: mensaje ?? "",
    });
    if (spamCheck.spam) {
      console.warn("[spam] heuristic triggered", { reason: spamCheck.reason, ip, route: "leads" });
    }

    if (!db) {
      console.error("[api/leads] DB not available");
      return NextResponse.json({ ok: false, error: "DB no configurada" }, { status: 503 });
    }

    const [lead] = await db
      .insert(leads)
      .values({
        nombre,
        empresa,
        email: email.toLowerCase(),
        servicio: servicio ?? null,
        fuente,
        mensaje: mensaje ?? null,
        referrerUrl: referrerUrl ?? null,
        utmSource: utmSource ?? null,
        utmMedium: utmMedium ?? null,
        utmCampaign: utmCampaign ?? null,
        utmContent: utmContent ?? null,
        isSpam: spamCheck.spam,
        spamReason: spamCheck.reason ?? null,
      })
      .returning({ id: leads.id });

    if (spamCheck.spam) {
      return NextResponse.json({ ok: true, id: lead.id, message: "Lead registrado" });
    }

    const mail = await sendLeadEmail({
      fuente,
      nombre,
      email,
      empresa,
      servicio: servicio ?? null,
      mensaje: mensaje ?? null,
      referrerUrl: referrerUrl ?? null,
    });

    if (!mail.ok && !mail.skipped) {
      console.error("[api/leads] Email delivery failed but lead saved:", mail.error);
    }

    after(async () => {
      const res = await sendLeadConfirmation({
        to: email,
        nombre,
        locale: detectLocaleFromReferrer(referrerUrl),
        servicio: servicio ?? null,
      });
      if (!res.sent && !res.skipped) {
        console.error("[api/leads] Confirmation failed:", res.error);
      }
    });

    return NextResponse.json({ ok: true, id: lead.id, message: "Lead registrado" });
  } catch (e) {
    console.error("[api/leads] Unhandled error:", e);
    return NextResponse.json(
      { ok: false, error: e instanceof Error ? e.message : "Error" },
      { status: 500 },
    );
  }
}
