"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Mail, Phone, MapPin, Send } from "lucide-react";
import { PageWrapper } from "@/components/layout";
import { Button } from "@/components/ui/button";
import { SITE } from "@/lib/constants";
import { useEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import { deriveFromPath } from "@/lib/utils/from-service";

const contactSchema = z.object({
  name: z.string().min(2, "El nombre debe tener al menos 2 caracteres"),
  email: z.string().email("Email inválido"),
  company: z.string().min(1, "La empresa es requerida"),
  service: z.string().min(1, "Selecciona un servicio"),
  message: z.string().min(10, "El mensaje debe tener al menos 10 caracteres"),
});

type ContactFormData = z.infer<typeof contactSchema>;

interface ContactPageClientProps {
  seoTitle?: string;
  seoDescription?: string;
  pageTitle?: string;
  pageSubtitle?: string;
}

export function ContactPageClient({ pageTitle, pageSubtitle }: ContactPageClientProps) {
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const searchParams = useSearchParams();
  const [fromService, setFromService] = useState<string>("");
  const honeypotRef = useRef<HTMLInputElement>(null);
  const [formTs] = useState<number>(() => Date.now());

  // Resolve origin on mount: explicit ?from=... wins; fallback to
  // document.referrer pathname (same-origin only) so CTAs that haven't been
  // updated with an explicit param still contribute attribution.
  useEffect(() => {
    const fromParam = searchParams.get("from");
    if (fromParam) {
      setFromService(fromParam);
      return;
    }
    if (typeof document === "undefined" || !document.referrer) return;
    try {
      const ref = new URL(document.referrer);
      if (ref.origin === window.location.origin) {
        const derived = deriveFromPath(ref.pathname);
        if (derived) setFromService(derived);
      }
    } catch {
      // Invalid referrer URL — ignore, fromService stays empty.
    }
  }, [searchParams]);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
  });

  async function onSubmit(data: ContactFormData) {
    setError(null);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...data,
          referrerUrl: typeof window !== "undefined" ? window.location.href : undefined,
          fromService: fromService || undefined,
          website: honeypotRef.current?.value ?? "",
          _ts: formTs,
        }),
      });
      if (!res.ok) {
        const body = await res.json();
        throw new Error(body.error ?? "Error al enviar el formulario");
      }
      setSubmitted(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error inesperado");
    }
  }

  return (
    <PageWrapper>
      <section className="py-16 md:py-24">
        <div className="mx-auto max-w-[1280px] px-6 md:px-20">
          <div className="grid gap-12 lg:grid-cols-2">
            {/* Info */}
            <div>
              <h1 className="text-4xl font-bold text-text-100 md:text-5xl">
                {pageTitle || "Hablemos"}
              </h1>
              <p className="mt-4 text-lg text-text-70">
                {pageSubtitle ||
                  "Cuéntanos sobre tu proyecto o desafío tecnológico y te contactamos en menos de 24 horas."}
              </p>

              <h2 className="mt-12 text-2xl font-bold text-text-100">Canales de contacto</h2>
              <div className="mt-6 space-y-6">
                <div className="flex items-start gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                    <Mail size={20} className="text-primary" aria-hidden="true" />
                  </div>
                  <div>
                    <h3 className="font-medium text-text-100">Email</h3>
                    <a
                      href={`mailto:${SITE.email}`}
                      className="text-sm text-text-70 hover:text-primary"
                    >
                      {SITE.email}
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                    <Phone size={20} className="text-primary" aria-hidden="true" />
                  </div>
                  <div>
                    <h3 className="font-medium text-text-100">WhatsApp</h3>
                    <a
                      href={`https://wa.me/${SITE.whatsapp.replace("+", "")}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-text-70 hover:text-primary"
                    >
                      {SITE.whatsapp}
                    </a>
                  </div>
                </div>

                {SITE.locations.map((loc) => (
                  <div key={loc} className="flex items-start gap-4">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                      <MapPin size={20} className="text-primary" aria-hidden="true" />
                    </div>
                    <div>
                      <h3 className="font-medium text-text-100">Oficina</h3>
                      <p className="text-sm text-text-70">{loc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Form */}
            <div className="glass rounded-xl p-8">
              {submitted ? (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                    <Send size={32} className="text-primary" aria-hidden="true" />
                  </div>
                  <h2 className="mt-6 text-2xl font-bold text-text-100">Mensaje enviado</h2>
                  <p className="mt-2 text-text-70">Te contactaremos en menos de 24 horas.</p>
                </div>
              ) : (
                <form
                  id="contact-form"
                  data-purpose="lead-capture"
                  aria-label="Formulario de contacto Nivelics"
                  onSubmit={handleSubmit(onSubmit)}
                  className="space-y-6"
                >
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
                    <label htmlFor="name" className="block text-sm font-medium text-text-100">
                      Nombre completo
                    </label>
                    <input
                      id="name"
                      autoComplete="name"
                      data-field="contact-name"
                      {...register("name")}
                      className="mt-1 w-full rounded-lg border border-border bg-bg-base px-4 py-3 text-sm text-text-100 placeholder:text-text-40 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/40"
                      placeholder="Tu nombre"
                    />
                    {errors.name && (
                      <p className="mt-1 text-xs text-red-400" role="alert">
                        {errors.name.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-text-100">
                      Email corporativo
                    </label>
                    <input
                      id="email"
                      type="email"
                      autoComplete="email"
                      data-field="contact-email"
                      {...register("email")}
                      className="mt-1 w-full rounded-lg border border-border bg-bg-base px-4 py-3 text-sm text-text-100 placeholder:text-text-40 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/40"
                      placeholder="tu@empresa.com"
                    />
                    {errors.email && (
                      <p className="mt-1 text-xs text-red-400" role="alert">
                        {errors.email.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="company" className="block text-sm font-medium text-text-100">
                      Empresa
                    </label>
                    <input
                      id="company"
                      autoComplete="organization"
                      data-field="contact-company"
                      {...register("company")}
                      className="mt-1 w-full rounded-lg border border-border bg-bg-base px-4 py-3 text-sm text-text-100 placeholder:text-text-40 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/40"
                      placeholder="Nombre de tu empresa"
                    />
                    {errors.company && (
                      <p className="mt-1 text-xs text-red-400" role="alert">
                        {errors.company.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="service" className="block text-sm font-medium text-text-100">
                      Servicio de interés
                    </label>
                    <select
                      id="service"
                      data-field="service-interest"
                      {...register("service")}
                      className="mt-1 w-full rounded-lg border border-border bg-bg-base px-4 py-3 text-sm text-text-100 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/40"
                    >
                      <option value="">Seleccionar servicio</option>
                      <option value="ia">Inteligencia Artificial</option>
                      <option value="cloud">Cloud / FinOps</option>
                      <option value="staffing">Staff Augmentation</option>
                      <option value="desarrollo">Desarrollo Digital</option>
                      <option value="otro">Otro</option>
                    </select>
                    {errors.service && (
                      <p className="mt-1 text-xs text-red-400" role="alert">
                        {errors.service.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="message" className="block text-sm font-medium text-text-100">
                      Mensaje
                    </label>
                    <textarea
                      id="message"
                      rows={4}
                      data-field="contact-message"
                      {...register("message")}
                      className="mt-1 w-full rounded-lg border border-border bg-bg-base px-4 py-3 text-sm text-text-100 placeholder:text-text-40 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/40 resize-none"
                      placeholder="Cuéntanos sobre tu proyecto o desafío..."
                    />
                    {errors.message && (
                      <p className="mt-1 text-xs text-red-400" role="alert">
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
                    aria-label="Enviar solicitud de contacto"
                  >
                    {isSubmitting ? "Enviando..." : "Solicitar diagnóstico gratuito"}
                  </Button>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>
    </PageWrapper>
  );
}
