/**
 * Tracking de eventos de conversión (CRO — docs/mejoras/conversion-cro-engagement.md).
 *
 * Provider-agnóstico: usa gtag (GA4) si está cargado; si no, empuja al
 * dataLayer (GTM). Si no hay analytics configurado en siteConfig, es un no-op
 * silencioso — nunca rompe la UI.
 *
 * Eventos estándar del sitio:
 *   cta_click        { cta, path }        — clic en cualquier CTA de conversión
 *   whatsapp_click   { path }             — clic en el FAB de WhatsApp
 *   chat_invite      { action, path }     — shown | open | dismiss
 *   scroll_depth     { depth, path }      — 25 | 50 | 75 | 100
 */
type EventProps = Record<string, string | number | boolean | undefined>;

export function track(event: string, props: EventProps = {}) {
  if (typeof window === "undefined") return;
  const w = window as unknown as {
    gtag?: (...args: unknown[]) => void;
    dataLayer?: Array<Record<string, unknown>>;
  };
  try {
    if (typeof w.gtag === "function") {
      w.gtag("event", event, props);
    } else {
      w.dataLayer = w.dataLayer || [];
      w.dataLayer.push({ event, ...props });
    }
  } catch {
    // analytics nunca debe romper la UI
  }
}
