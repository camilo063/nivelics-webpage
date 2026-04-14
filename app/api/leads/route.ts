import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { leads } from "@/lib/db/schema/admin";

interface LeadInput {
  nombre?: string;
  empresa?: string;
  email?: string;
  servicio?: string;
  fuente?: string;
  mensaje?: string;
}

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as LeadInput;
    const { nombre, empresa, email, servicio, fuente, mensaje } = body;

    if (!nombre || typeof nombre !== "string" || nombre.trim().length < 2) {
      return NextResponse.json({ ok: false, error: "Nombre requerido" }, { status: 400 });
    }
    if (!empresa || typeof empresa !== "string" || empresa.trim().length < 2) {
      return NextResponse.json({ ok: false, error: "Empresa requerida" }, { status: 400 });
    }
    if (!email || !isValidEmail(email)) {
      return NextResponse.json({ ok: false, error: "Email inválido" }, { status: 400 });
    }
    if (!fuente || typeof fuente !== "string") {
      return NextResponse.json({ ok: false, error: "Fuente requerida" }, { status: 400 });
    }

    if (!db) {
      return NextResponse.json({ ok: false, error: "DB no configurada" }, { status: 500 });
    }

    const [lead] = await db
      .insert(leads)
      .values({
        nombre: nombre.trim(),
        empresa: empresa.trim(),
        email: email.trim().toLowerCase(),
        servicio: servicio || null,
        fuente,
        mensaje: mensaje || null,
      })
      .returning({ id: leads.id });

    // Optional: send email via Resend
    if (process.env.RESEND_API_KEY) {
      try {
        await fetch("https://api.resend.com/emails", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            from: "leads@nivelics.com",
            to: process.env.LEADS_NOTIFICATION_EMAIL || "contacto@nivelics.com",
            subject: `Nuevo lead: ${fuente} — ${nombre} (${empresa})`,
            html: `
              <h2>Nuevo lead desde landing page</h2>
              <p><b>Fuente:</b> ${fuente}</p>
              <p><b>Nombre:</b> ${nombre}</p>
              <p><b>Empresa:</b> ${empresa}</p>
              <p><b>Email:</b> ${email}</p>
              <p><b>Servicio:</b> ${servicio || "-"}</p>
              ${mensaje ? `<p><b>Mensaje:</b> ${mensaje}</p>` : ""}
            `,
          }),
        });
      } catch {
        // Swallow — lead already saved
      }
    }

    return NextResponse.json({ ok: true, id: lead.id, message: "Lead registrado" });
  } catch (e) {
    return NextResponse.json(
      { ok: false, error: e instanceof Error ? e.message : "Error" },
      { status: 500 },
    );
  }
}
