import { NextRequest, NextResponse, after } from "next/server";
import { z } from "zod";
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";
import { db } from "@/lib/db";
import { leads } from "@/lib/db/schema/admin";
import { sendLeadEmail } from "@/lib/email/send";
import { sendLeadConfirmation, detectLocaleFromReferrer } from "@/lib/email/send-confirmation";

const applySchema = z.object({
  name: z.string().trim().min(2, "Nombre requerido"),
  email: z.string().trim().email("Email inválido"),
  role: z.string().trim().min(1, "Selecciona un rol"),
  linkedin: z.string().trim().url("LinkedIn inválido").optional().or(z.literal("")),
  message: z.string().trim().optional(),
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
    if (ratelimit) {
      const ip =
        request.headers.get("x-forwarded-for") ?? request.headers.get("x-real-ip") ?? "127.0.0.1";
      const { success } = await ratelimit.limit(ip);
      if (!success) {
        return NextResponse.json(
          { error: "Demasiados intentos. Por favor intenta en 1 hora." },
          { status: 429 },
        );
      }
    }

    const body = await request.json();
    const parsed = applySchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Datos inválidos", details: parsed.error.flatten().fieldErrors },
        { status: 400 },
      );
    }

    const { name, email, role, linkedin, message, referrerUrl } = parsed.data;

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
      })
      .returning({ id: leads.id });

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
