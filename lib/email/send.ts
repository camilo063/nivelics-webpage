import "server-only";
import { Resend } from "resend";
import { getSiteConfigPublic } from "@/lib/cms/queries";

const FROM = "Nivelics Leads <leads@nivelics.com>";
const FALLBACK_TO = "contacto@nivelics.com";

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function row(label: string, value: string | null | undefined): string {
  if (!value) return "";
  return `<tr><td style="padding:6px 12px;color:#555;font-weight:600;white-space:nowrap;">${escapeHtml(label)}</td><td style="padding:6px 12px;color:#111;">${escapeHtml(value)}</td></tr>`;
}

export interface LeadEmailInput {
  /** Origin tag: 'contact', 'careers', or LP slug. */
  fuente: string;
  nombre: string;
  email: string;
  empresa?: string | null;
  servicio?: string | null;
  mensaje?: string | null;
  /** Absolute URL where the form was submitted. */
  referrerUrl?: string | null;
  /**
   * Page slug the user was on when they clicked the contact CTA
   * (e.g. 'cloud/finops'). Only set for /api/contact leads.
   */
  fromService?: string | null;
  /** Extra fields specific to careers or other forms (linkedin, role, etc.). */
  extra?: Record<string, string | null | undefined>;
}

export interface SendResult {
  ok: boolean;
  to?: string;
  error?: string;
  skipped?: boolean;
}

/**
 * Resolve the destination email from `siteConfig.emailContact`, falling back
 * to `contacto@nivelics.com` when the admin hasn't configured one.
 */
async function resolveTo(): Promise<string> {
  try {
    const config = await getSiteConfigPublic();
    const configured = config?.emailContact?.trim();
    if (configured) return configured;
  } catch {
    // fall through to default
  }
  return FALLBACK_TO;
}

function buildSubject(input: LeadEmailInput): string {
  const who = input.empresa ? `${input.nombre} (${input.empresa})` : input.nombre;
  const kind =
    input.fuente === "contact"
      ? "Nuevo contacto"
      : input.fuente === "careers"
        ? "Nueva aplicación laboral"
        : `Nuevo lead (${input.fuente})`;
  return `${kind}: ${who}`;
}

function buildHtml(input: LeadEmailInput): string {
  const extraRows = input.extra
    ? Object.entries(input.extra)
        .map(([k, v]) => row(k, v ?? null))
        .join("")
    : "";

  const messageBlock = input.mensaje
    ? `<div style="margin-top:16px;padding:12px 16px;background:#f6f8fa;border-left:3px solid #00D4FF;border-radius:4px;">
         <div style="color:#555;font-size:12px;font-weight:600;text-transform:uppercase;letter-spacing:0.5px;">Mensaje</div>
         <div style="margin-top:6px;color:#111;white-space:pre-wrap;">${escapeHtml(input.mensaje)}</div>
       </div>`
    : "";

  return `<!doctype html>
<html><body style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif;background:#fff;margin:0;padding:24px;">
  <div style="max-width:600px;margin:0 auto;">
    <h2 style="margin:0 0 16px;color:#111;font-size:20px;">${escapeHtml(buildSubject(input))}</h2>
    <table style="border-collapse:collapse;width:100%;border:1px solid #eaeaea;border-radius:6px;overflow:hidden;">
      ${row("Fuente", input.fuente)}
      ${row("Nombre", input.nombre)}
      ${row("Email", input.email)}
      ${row("Empresa", input.empresa ?? null)}
      ${row("Servicio", input.servicio ?? null)}
      ${input.fuente === "contact" ? row("Origen", input.fromService ?? "Directo (sin referencia)") : ""}
      ${extraRows}
      ${row("URL origen", input.referrerUrl ?? null)}
    </table>
    ${messageBlock}
    <p style="margin-top:20px;color:#999;font-size:12px;">Enviado automáticamente desde nivelics.com</p>
  </div>
</body></html>`;
}

/**
 * Send a lead notification email to the admin-configured address.
 * Returns success/failure — callers should log but not fail the request when
 * email delivery breaks (the lead is already persisted in the DB).
 */
export async function sendLeadEmail(input: LeadEmailInput): Promise<SendResult> {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.warn("[email] RESEND_API_KEY not set — skipping email delivery");
    return { ok: false, skipped: true, error: "RESEND_API_KEY not configured" };
  }

  const to = await resolveTo();
  const resend = new Resend(apiKey);

  try {
    const result = await resend.emails.send({
      from: FROM,
      to,
      replyTo: input.email,
      subject: buildSubject(input),
      html: buildHtml(input),
    });
    if (result.error) {
      console.error("[email] Resend API error:", result.error);
      return { ok: false, to, error: result.error.message };
    }
    return { ok: true, to };
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error("[email] Send failed:", message);
    return { ok: false, to, error: message };
  }
}
