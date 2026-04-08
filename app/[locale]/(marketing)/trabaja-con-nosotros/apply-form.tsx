"use client";

import { useState } from "react";
import { Send } from "lucide-react";
import { Button } from "@/components/ui/button";

export function ApplyForm() {
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    const formData = new FormData(e.currentTarget);
    const data = {
      name: formData.get("name") as string,
      email: formData.get("email") as string,
      role: formData.get("role") as string,
      linkedin: formData.get("linkedin") as string,
      message: formData.get("message") as string,
    };

    try {
      const res = await fetch("/api/apply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        const body = await res.json();
        throw new Error(body.error ?? "Error al enviar la solicitud");
      }
      setSubmitted(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error inesperado");
    } finally {
      setIsSubmitting(false);
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
      onSubmit={handleSubmit}
      className="space-y-6"
    >
      <div>
        <label htmlFor="apply-name" className="block text-sm font-medium text-text-100">
          Nombre completo
        </label>
        <input
          id="apply-name"
          name="name"
          required
          autoComplete="name"
          className="mt-1 w-full rounded-lg border border-border bg-bg-base px-4 py-3 text-sm text-text-100 placeholder:text-text-40 focus:border-primary focus:outline-none"
          placeholder="Tu nombre completo"
        />
      </div>

      <div>
        <label htmlFor="apply-email" className="block text-sm font-medium text-text-100">
          Email
        </label>
        <input
          id="apply-email"
          name="email"
          type="email"
          required
          autoComplete="email"
          className="mt-1 w-full rounded-lg border border-border bg-bg-base px-4 py-3 text-sm text-text-100 placeholder:text-text-40 focus:border-primary focus:outline-none"
          placeholder="tu@email.com"
        />
      </div>

      <div>
        <label htmlFor="apply-role" className="block text-sm font-medium text-text-100">
          Rol de interés
        </label>
        <select
          id="apply-role"
          name="role"
          required
          className="mt-1 w-full rounded-lg border border-border bg-bg-base px-4 py-3 text-sm text-text-100 focus:border-primary focus:outline-none"
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
      </div>

      <div>
        <label htmlFor="apply-linkedin" className="block text-sm font-medium text-text-100">
          LinkedIn URL
        </label>
        <input
          id="apply-linkedin"
          name="linkedin"
          type="url"
          autoComplete="url"
          className="mt-1 w-full rounded-lg border border-border bg-bg-base px-4 py-3 text-sm text-text-100 placeholder:text-text-40 focus:border-primary focus:outline-none"
          placeholder="https://linkedin.com/in/tu-perfil"
        />
      </div>

      <div>
        <label htmlFor="apply-message" className="block text-sm font-medium text-text-100">
          Mensaje
        </label>
        <textarea
          id="apply-message"
          name="message"
          rows={4}
          className="mt-1 w-full rounded-lg border border-border bg-bg-base px-4 py-3 text-sm text-text-100 placeholder:text-text-40 focus:border-primary focus:outline-none resize-none"
          placeholder="Cuéntanos sobre tu experiencia y por qué te interesa Nivelics..."
        />
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
