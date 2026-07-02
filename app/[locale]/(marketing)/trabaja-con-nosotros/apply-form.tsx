"use client";

import { useMemo, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useLocale } from "next-intl";
import { Send } from "lucide-react";
import { Button } from "@/components/ui/button";

const MESSAGES = {
  es: {
    nameMin: "El nombre debe tener al menos 2 caracteres",
    emailInvalid: "Email inválido",
    roleRequired: "Selecciona un rol",
    linkedinInvalid: "La URL de LinkedIn no es válida",
    messageMax: "El mensaje no puede superar los 2000 caracteres",
    submitError: "Error al enviar la solicitud",
    unexpectedError: "Error inesperado",
    optional: "(Opcional)",
  },
  en: {
    nameMin: "Name must be at least 2 characters",
    emailInvalid: "Invalid email",
    roleRequired: "Select a role",
    linkedinInvalid: "LinkedIn URL is not valid",
    messageMax: "Message cannot exceed 2000 characters",
    submitError: "Error submitting the application",
    unexpectedError: "Unexpected error",
    optional: "(Optional)",
  },
} as const;

function buildApplySchema(t: (typeof MESSAGES)[keyof typeof MESSAGES]) {
  return z.object({
    name: z.string().trim().min(2, t.nameMin),
    email: z.string().trim().email(t.emailInvalid),
    role: z.string().min(1, t.roleRequired),
    linkedin: z.string().trim().url(t.linkedinInvalid).optional().or(z.literal("")),
    message: z.string().trim().max(2000, t.messageMax).optional(),
  });
}

type ApplyFormData = z.infer<ReturnType<typeof buildApplySchema>>;

const INPUT_CLASSES =
  "mt-1 w-full rounded-lg border border-border bg-bg-base px-4 py-3 text-sm text-text-100 placeholder:text-text-40 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary";

export function ApplyForm() {
  const rawLocale = useLocale();
  const locale: "es" | "en" = rawLocale === "en" ? "en" : "es";
  const t = MESSAGES[locale];

  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const honeypotRef = useRef<HTMLInputElement>(null);
  // Mount timestamp for the server-side timing check (sub-3s submits = bots).
  const [formTs] = useState<number>(() => Date.now());

  const schema = useMemo(() => buildApplySchema(t), [t]);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ApplyFormData>({
    resolver: zodResolver(schema),
  });

  async function onSubmit(data: ApplyFormData) {
    setError(null);
    try {
      const res = await fetch("/api/apply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...data,
          referrerUrl: typeof window !== "undefined" ? window.location.href : undefined,
          website: honeypotRef.current?.value ?? "",
          _ts: formTs,
        }),
      });
      if (!res.ok) {
        const body = await res.json();
        throw new Error(body.error ?? t.submitError);
      }
      setSubmitted(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : t.unexpectedError);
    }
  }

  if (submitted) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
          <Send size={32} className="text-primary" aria-hidden="true" />
        </div>
        <h3 className="mt-6 text-2xl font-bold text-text-100">Solicitud enviada</h3>
        <p className="mt-2 text-text-70">
          Revisaremos tu perfil y te contactaremos pronto. Gracias por tu interés en Nivelics.
        </p>
      </div>
    );
  }

  return (
    <form
      id="apply-form"
      data-purpose="job-application"
      aria-label="Formulario de aplicación laboral Nivelics"
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-6"
    >
      {/* Honeypot — hidden from humans and assistive tech; bots fill it. */}
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

      <div>
        <label htmlFor="apply-name" className="block text-sm font-medium text-text-100">
          Nombre completo
        </label>
        <input
          id="apply-name"
          autoComplete="name"
          data-field="apply-name"
          aria-invalid={errors.name ? true : undefined}
          aria-describedby={errors.name ? "apply-name-error" : undefined}
          {...register("name")}
          className={INPUT_CLASSES}
          placeholder="Tu nombre completo"
        />
        {errors.name && (
          <p id="apply-name-error" className="mt-1 text-xs text-red-400" role="alert">
            {errors.name.message}
          </p>
        )}
      </div>

      <div>
        <label htmlFor="apply-email" className="block text-sm font-medium text-text-100">
          Email
        </label>
        <input
          id="apply-email"
          type="email"
          autoComplete="email"
          data-field="apply-email"
          aria-invalid={errors.email ? true : undefined}
          aria-describedby={errors.email ? "apply-email-error" : undefined}
          {...register("email")}
          className={INPUT_CLASSES}
          placeholder="tu@email.com"
        />
        {errors.email && (
          <p id="apply-email-error" className="mt-1 text-xs text-red-400" role="alert">
            {errors.email.message}
          </p>
        )}
      </div>

      <div>
        <label htmlFor="apply-role" className="block text-sm font-medium text-text-100">
          Rol de interés
        </label>
        <select
          id="apply-role"
          data-field="apply-role"
          aria-invalid={errors.role ? true : undefined}
          aria-describedby={errors.role ? "apply-role-error" : undefined}
          {...register("role")}
          className="mt-1 w-full rounded-lg border border-border bg-bg-base px-4 py-3 text-sm text-text-100 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary"
        >
          <option value="">Seleccionar rol</option>
          <option value="frontend">Frontend Developer</option>
          <option value="backend">Backend Developer</option>
          <option value="fullstack">Fullstack Developer</option>
          <option value="devops">DevOps / Cloud Engineer</option>
          <option value="data">Data Engineer / Scientist</option>
          <option value="ia">IA / Machine Learning Engineer</option>
          <option value="qa">QA Engineer</option>
          <option value="pm">Project Manager / Delivery Manager</option>
          <option value="design">UX/UI Designer</option>
          <option value="otro">Otro</option>
        </select>
        {errors.role && (
          <p id="apply-role-error" className="mt-1 text-xs text-red-400" role="alert">
            {errors.role.message}
          </p>
        )}
      </div>

      <div>
        <label htmlFor="apply-linkedin" className="block text-sm font-medium text-text-100">
          LinkedIn URL <span className="font-normal text-text-40">{t.optional}</span>
        </label>
        <input
          id="apply-linkedin"
          type="url"
          autoComplete="url"
          data-field="apply-linkedin"
          aria-invalid={errors.linkedin ? true : undefined}
          aria-describedby={errors.linkedin ? "apply-linkedin-error" : undefined}
          {...register("linkedin")}
          className={INPUT_CLASSES}
          placeholder="https://linkedin.com/in/tu-perfil"
        />
        {errors.linkedin && (
          <p id="apply-linkedin-error" className="mt-1 text-xs text-red-400" role="alert">
            {errors.linkedin.message}
          </p>
        )}
      </div>

      <div>
        <label htmlFor="apply-message" className="block text-sm font-medium text-text-100">
          Mensaje <span className="font-normal text-text-40">{t.optional}</span>
        </label>
        <textarea
          id="apply-message"
          rows={4}
          maxLength={2000}
          data-field="apply-message"
          aria-invalid={errors.message ? true : undefined}
          aria-describedby={errors.message ? "apply-message-error" : undefined}
          {...register("message")}
          className={`${INPUT_CLASSES} resize-none`}
          placeholder="Cuéntanos sobre tu experiencia y por qué te interesa Nivelics..."
        />
        {errors.message && (
          <p id="apply-message-error" className="mt-1 text-xs text-red-400" role="alert">
            {errors.message.message}
          </p>
        )}
      </div>

      {error && (
        <p
          className="rounded-lg border border-red-400/20 bg-red-400/5 px-4 py-3 text-sm text-red-400"
          role="alert"
        >
          {error}
        </p>
      )}

      <Button
        type="submit"
        variant="cta"
        size="lg"
        className="w-full"
        disabled={isSubmitting}
        aria-label="Enviar solicitud de empleo"
      >
        {isSubmitting ? "Enviando..." : "Enviar solicitud"}
      </Button>
    </form>
  );
}
