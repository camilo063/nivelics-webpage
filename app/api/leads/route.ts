import { NextRequest, NextResponse, after } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { leads } from "@/lib/db/schema/admin";
import { sendLeadEmail } from "@/lib/email/send";
import { sendLeadConfirmation, detectLocaleFromReferrer } from "@/lib/email/send-confirmation";

const leadSchema = z.object({
  nombre: z.string().trim().min(2, "Nombre requerido"),
  empresa: z.string().trim().min(2, "Empresa requerida"),
  email: z.string().trim().email("Email inválido"),
  servicio: z.string().optional().nullable(),
  fuente: z.string().min(1, "Fuente requerida"),
  mensaje: z.string().optional().nullable(),
  referrerUrl: z.string().url().optional(),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = leadSchema.safeParse(body);
    if (!parsed.success) {
      const firstError = parsed.error.issues[0]?.message ?? "Datos inválidos";
      return NextResponse.json({ ok: false, error: firstError }, { status: 400 });
    }

    const { nombre, empresa, email, servicio, fuente, mensaje, referrerUrl } = parsed.data;

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
      })
      .returning({ id: leads.id });

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
