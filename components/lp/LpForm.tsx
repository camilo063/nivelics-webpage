"use client";

import { useRef, useState } from "react";
import { Loader2, Check } from "lucide-react";

interface LpFormProps {
  fuente: string;
  title?: string;
  subtitle?: string;
  ctaText?: string;
  accentColor?: string;
  compact?: boolean;
  trustSignals?: string[];
  defaultServicio?: string;
  /** Add id="formulario" on wrapper (default true). */
  withAnchor?: boolean;
  /** Idioma del chrome del form (labels, mensajes). Default "es". */
  locale?: "es" | "en";
}

const SERVICIO_OPTIONS = [
  "Staff Augmentation",
  "IA Aplicada",
  "Cloud / FinOps",
  "Desarrollo Digital",
  "Otro",
];

const FORM_COPY = {
  es: {
    title: "Solicita más información",
    subtitle: "En menos de 24h te respondemos.",
    cta: "Enviar →",
    namePlaceholder: "Nombre completo *",
    companyPlaceholder: "Empresa *",
    emailPlaceholder: "Email corporativo *",
    servicePlaceholder: "Selecciona un servicio *",
    serviceOptions: SERVICIO_OPTIONS,
    trustLine: "🔒 Sin spam · Respondemos en menos de 24h · Great Place to Work 2022",
    sending: "Enviando...",
    successTitle: "¡Mensaje enviado!",
    successBody: "Te contactamos en menos de 24 horas.",
    errorFallback: "Error al enviar",
    formAria: "Formulario de contacto",
  },
  en: {
    title: "Request more information",
    subtitle: "We reply within 24h.",
    cta: "Send →",
    namePlaceholder: "Full name *",
    companyPlaceholder: "Company *",
    emailPlaceholder: "Work email *",
    servicePlaceholder: "Select a service *",
    serviceOptions: [
      "Staff Augmentation",
      "Applied AI",
      "Cloud / FinOps",
      "Digital Development",
      "Other",
    ],
    trustLine: "🔒 No spam · We reply within 24h · Great Place to Work 2022",
    sending: "Sending...",
    successTitle: "Message sent!",
    successBody: "We'll contact you within 24 hours.",
    errorFallback: "Something went wrong",
    formAria: "Contact form",
  },
} as const;

/** UTM de la query string, para atar el lead a la campaña que lo trajo. */
function readUtmParams(): Record<string, string> {
  if (typeof window === "undefined") return {};
  const params = new URLSearchParams(window.location.search);
  const out: Record<string, string> = {};
  const map: Record<string, string> = {
    utm_source: "utmSource",
    utm_medium: "utmMedium",
    utm_campaign: "utmCampaign",
    utm_content: "utmContent",
  };
  for (const [param, key] of Object.entries(map)) {
    const value = params.get(param);
    if (value) out[key] = value.slice(0, 255);
  }
  return out;
}

declare global {
  interface Window {
    gtag?: (event: string, action: string, params: Record<string, unknown>) => void;
    fbq?: (event: string, action: string, params: Record<string, unknown>) => void;
  }
}

const SELECT_CHEVRON =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%23B3B3CC' d='M6 8L1 3h10z'/%3E%3C/svg%3E\")";

export function LpForm({
  fuente,
  title,
  subtitle,
  ctaText,
  accentColor = "#00D4FF",
  compact = false,
  trustSignals,
  defaultServicio,
  withAnchor = true,
  locale = "es",
}: LpFormProps) {
  const copy = FORM_COPY[locale] ?? FORM_COPY.es;
  const resolvedTitle = title ?? copy.title;
  const resolvedSubtitle = subtitle ?? copy.subtitle;
  const resolvedCta = ctaText ?? copy.cta;
  const [form, setForm] = useState({
    nombre: "",
    empresa: "",
    email: "",
    servicio: defaultServicio ?? "",
  });
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const honeypotRef = useRef<HTMLInputElement>(null);
  const [formTs] = useState<number>(() => Date.now());

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");
    setErrorMsg("");

    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          fuente,
          referrerUrl: typeof window !== "undefined" ? window.location.href : undefined,
          ...readUtmParams(),
          website: honeypotRef.current?.value ?? "",
          _ts: formTs,
        }),
      });
      const data = await res.json();
      if (!res.ok || !data.ok) throw new Error(data.error || copy.errorFallback);

      if (typeof window !== "undefined") {
        if (window.gtag)
          window.gtag("event", "lead_form_submit", { landing: fuente, servicio: form.servicio });
        if (window.fbq) window.fbq("track", "Lead", { content_name: fuente });
      }
      setStatus("success");
    } catch (err) {
      setStatus("error");
      setErrorMsg(err instanceof Error ? err.message : copy.errorFallback);
    }
  }

  const inputClass =
    "w-full h-12 px-4 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-[#66667A] focus:border-cyan-400/50 focus:outline-none focus:ring-1 focus:ring-cyan-400/20 transition-colors duration-150";

  const selectClass =
    "w-full h-12 px-4 bg-white/5 border border-white/10 rounded-xl text-white focus:border-cyan-400/50 focus:outline-none focus:ring-1 focus:ring-cyan-400/20 cursor-pointer";

  const selectStyle: React.CSSProperties = {
    appearance: "none",
    WebkitAppearance: "none",
    backgroundImage: SELECT_CHEVRON,
    backgroundRepeat: "no-repeat",
    backgroundPosition: "right 16px center",
    paddingRight: "44px",
  };

  const wrapperProps = withAnchor ? { id: "formulario" } : {};

  if (status === "success") {
    return (
      <div
        {...wrapperProps}
        className={`rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm ${compact ? "p-6" : "p-8"} text-center`}
      >
        <div
          className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full"
          style={{ backgroundColor: `${accentColor}20` }}
        >
          <Check className="h-6 w-6" style={{ color: accentColor }} />
        </div>
        <h3 className="text-xl font-bold text-white">{copy.successTitle}</h3>
        <p className="mt-2 text-text-70">{copy.successBody}</p>
      </div>
    );
  }

  return (
    <div
      {...wrapperProps}
      className={`rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm ${compact ? "p-6" : "p-8"}`}
    >
      {resolvedTitle && (
        <h3 className={`${compact ? "text-lg" : "text-2xl"} font-bold text-white`}>
          {resolvedTitle}
        </h3>
      )}
      {resolvedSubtitle && <p className="mt-2 text-sm text-text-70">{resolvedSubtitle}</p>}

      <form onSubmit={handleSubmit} className="mt-5 space-y-3" aria-label={copy.formAria}>
        <div
          aria-hidden="true"
          style={{
            position: "absolute",
            left: "-9999px",
            top: "auto",
            width: 1,
            height: 1,
            overflow: "hidden",
            opacity: 0,
          }}
        >
          <label>
            Website
            <input
              ref={honeypotRef}
              type="text"
              name="website"
              tabIndex={-1}
              autoComplete="off"
              defaultValue=""
            />
          </label>
        </div>
        <input
          type="text"
          value={form.nombre}
          onChange={(e) => setForm((f) => ({ ...f, nombre: e.target.value }))}
          placeholder={copy.namePlaceholder}
          required
          className={inputClass}
          aria-label={copy.namePlaceholder.replace(" *", "")}
        />
        <input
          type="text"
          value={form.empresa}
          onChange={(e) => setForm((f) => ({ ...f, empresa: e.target.value }))}
          placeholder={copy.companyPlaceholder}
          required
          className={inputClass}
          aria-label={copy.companyPlaceholder.replace(" *", "")}
        />
        <input
          type="email"
          value={form.email}
          onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
          placeholder={copy.emailPlaceholder}
          required
          className={inputClass}
          aria-label={copy.emailPlaceholder.replace(" *", "")}
        />
        <select
          value={form.servicio}
          onChange={(e) => setForm((f) => ({ ...f, servicio: e.target.value }))}
          required
          aria-label={copy.servicePlaceholder.replace(" *", "")}
          className={selectClass}
          style={selectStyle}
        >
          <option value="" disabled style={{ color: "#66667A", background: "#12121A" }}>
            {copy.servicePlaceholder}
          </option>
          {copy.serviceOptions.map((s) => (
            <option key={s} value={s} style={{ background: "#12121A" }}>
              {s}
            </option>
          ))}
        </select>

        <p className="pt-2 text-xs text-[#66667A] text-center">{copy.trustLine}</p>

        <button
          type="submit"
          disabled={status === "loading"}
          className="flex h-12 w-full items-center justify-center gap-2 rounded-xl px-6 text-sm font-bold text-black transition-opacity hover:opacity-90 disabled:opacity-50"
          style={{ backgroundColor: accentColor }}
        >
          {status === "loading" ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
          {status === "loading" ? copy.sending : resolvedCta}
        </button>

        {status === "error" && <p className="text-sm text-red-400">{errorMsg}</p>}
      </form>

      {trustSignals && trustSignals.length > 0 && (
        <div className="mt-5 space-y-1.5 border-t border-white/10 pt-4">
          {trustSignals.map((s, i) => (
            <p key={i} className="text-xs text-text-70">
              {s}
            </p>
          ))}
        </div>
      )}
    </div>
  );
}

export default LpForm;
