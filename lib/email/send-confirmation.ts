import "server-only";
import { Resend } from "resend";
import { getSiteConfigPublic } from "@/lib/cms/queries";
import { buildLeadConfirmationHtml, type ConfirmationLocale } from "./templates/lead-confirmation";

const FROM = "Nivelics <leads@nivelics.com>";

export interface SendConfirmationInput {
  to: string;
  nombre: string;
  locale: ConfirmationLocale;
  servicio?: string | null;
}

export interface SendConfirmationResult {
  sent: boolean;
  error?: string;
  skipped?: boolean;
}

/**
 * Fire-and-forget confirmation email to the lead.
 * Callers should not await the result to finish the HTTP response.
 * Errors are logged but never thrown.
 */
export async function sendLeadConfirmation(
  input: SendConfirmationInput,
): Promise<SendConfirmationResult> {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.warn("[email] RESEND_API_KEY not set — skipping confirmation");
    return { sent: false, skipped: true, error: "RESEND_API_KEY not configured" };
  }

  // Resolve the logo from siteConfig so the email reflects any admin update.
  // Email clients cannot resolve relative paths like `/uploads/...` — they
  // need an absolute URL, so we prepend the canonical origin when necessary.
  let logoUrl: string | null = null;
  try {
    const config = await getSiteConfigPublic();
    const raw = config?.logoUrl?.trim();
    if (raw) {
      logoUrl = raw.startsWith("http")
        ? raw
        : `https://www.nivelics.com${raw.startsWith("/") ? "" : "/"}${raw}`;
    }
  } catch {
    // fall through — template has a text fallback when no logo
  }

  const subject =
    input.locale === "es"
      ? "Recibimos tu mensaje — Nivelics"
      : "We received your message — Nivelics";

  const resend = new Resend(apiKey);

  try {
    const result = await resend.emails.send({
      from: FROM,
      to: input.to,
      subject,
      html: buildLeadConfirmationHtml({
        nombre: input.nombre,
        locale: input.locale,
        servicio: input.servicio ?? null,
        logoUrl,
      }),
    });
    if (result.error) {
      console.error("[email] Confirmation Resend error:", result.error);
      return { sent: false, error: result.error.message };
    }
    return { sent: true };
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error("[email] Confirmation send failed:", message);
    return { sent: false, error: message };
  }
}

/**
 * Helper to detect locale from the URL where the form was submitted.
 * Used by the API routes to pick ES vs EN confirmation content.
 */
export function detectLocaleFromReferrer(referrerUrl?: string | null): ConfirmationLocale {
  if (!referrerUrl) return "es";
  try {
    const url = new URL(referrerUrl);
    return url.pathname.startsWith("/en/") || url.pathname === "/en" ? "en" : "es";
  } catch {
    return referrerUrl.includes("/en/") ? "en" : "es";
  }
}
