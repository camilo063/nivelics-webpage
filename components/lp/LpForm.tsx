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
}

const SERVICIO_OPTIONS = [
  "Staff Augmentation",
  "IA Aplicada",
  "Cloud / FinOps",
  "Desarrollo Digital",
  "Otro",
];

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
  title = "Solicita más información",
  subtitle = "En menos de 24h te respondemos.",
  ctaText = "Enviar →",
  accentColor = "#00D4FF",
  compact = false,
  trustSignals,
  defaultServicio,
  withAnchor = true,
}: LpFormProps) {
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
          website: honeypotRef.current?.value ?? "",
          _ts: formTs,
        }),
      });
      const data = await res.json();
      if (!res.ok || !data.ok) throw new Error(data.error || "Error al enviar");

      if (typeof window !== "undefined") {
        if (window.gtag)
          window.gtag("event", "lead_form_submit", { landing: fuente, servicio: form.servicio });
        if (window.fbq) window.fbq("track", "Lead", { content_name: fuente });
      }
      setStatus("success");
    } catch (err) {
      setStatus("error");
      setErrorMsg(err instanceof Error ? err.message : "Error al enviar");
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
        <h3 className="text-xl font-bold text-white">¡Mensaje enviado!</h3>
        <p className="mt-2 text-text-70">Te contactamos en menos de 24 horas.</p>
      </div>
    );
  }

  return (
    <div
      {...wrapperProps}
      className={`rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm ${compact ? "p-6" : "p-8"}`}
    >
      {title && (
        <h3 className={`${compact ? "text-lg" : "text-2xl"} font-bold text-white`}>{title}</h3>
      )}
      {subtitle && <p className="mt-2 text-sm text-text-70">{subtitle}</p>}

      <form onSubmit={handleSubmit} className="mt-5 space-y-3" aria-label="Formulario de contacto">
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
          placeholder="Nombre completo *"
          required
          className={inputClass}
          aria-label="Nombre completo"
        />
        <input
          type="text"
          value={form.empresa}
          onChange={(e) => setForm((f) => ({ ...f, empresa: e.target.value }))}
          placeholder="Empresa *"
          required
          className={inputClass}
          aria-label="Empresa"
        />
        <input
          type="email"
          value={form.email}
          onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
          placeholder="Email corporativo *"
          required
          className={inputClass}
          aria-label="Email corporativo"
        />
        <select
          value={form.servicio}
          onChange={(e) => setForm((f) => ({ ...f, servicio: e.target.value }))}
          required
          aria-label="Servicio de interés"
          className={selectClass}
          style={selectStyle}
        >
          <option value="" disabled style={{ color: "#66667A", background: "#12121A" }}>
            Selecciona un servicio *
          </option>
          {SERVICIO_OPTIONS.map((s) => (
            <option key={s} value={s} style={{ background: "#12121A" }}>
              {s}
            </option>
          ))}
        </select>

        <p className="pt-2 text-xs text-[#66667A] text-center">
          🔒 Sin spam · Respondemos en menos de 24h · Great Place to Work 2022
        </p>

        <button
          type="submit"
          disabled={status === "loading"}
          className="flex h-12 w-full items-center justify-center gap-2 rounded-xl px-6 text-sm font-bold text-black transition-opacity hover:opacity-90 disabled:opacity-50"
          style={{ backgroundColor: accentColor }}
        >
          {status === "loading" ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
          {status === "loading" ? "Enviando..." : ctaText}
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
