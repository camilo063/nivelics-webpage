"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useEffect, useMemo, useRef, useState } from "react";
import { useLocale } from "next-intl";
import { contactLabels, type ContactLabels } from "./labels";
import { useSearchParams } from "next/navigation";
import { deriveFromPath } from "@/lib/utils/from-service";

function makeSchema(t: ContactLabels) {
  return z.object({
    name: z.string().min(2, t.nameMin),
    email: z.string().email(t.emailInvalid),
    company: z.string().min(1, t.companyRequired),
    service: z.string().min(1, t.serviceRequired),
    message: z.string().min(10, t.messageMin),
  });
}

type ContactFormData = z.infer<ReturnType<typeof makeSchema>>;

export function ContactForm() {
  const t = contactLabels(useLocale());
  const contactSchema = useMemo(() => makeSchema(t), [t]);
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
        throw new Error(body.error ?? t.submitError);
      }
      setSubmitted(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : t.unexpectedError);
    }
  }

  return (
    <div className="glass rounded-xl p-8">
      {submitted ? (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
            <Send size={32} className="text-primary" aria-hidden="true" />
          </div>
          <h2 className="mt-6 text-2xl font-bold text-text-100">{t.sent}</h2>
          <p className="mt-2 text-text-70">{t.sentBody}</p>
        </div>
      ) : (
        <form
          id="contact-form"
          data-purpose="lead-capture"
          aria-label={t.formAria}
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
              {t.name}
            </label>
            <input
              id="name"
              autoComplete="name"
              data-field="contact-name"
              {...register("name")}
              className="mt-1 w-full rounded-lg border border-border bg-bg-base px-4 py-3 text-sm text-text-100 placeholder:text-text-40 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/40"
              placeholder={t.namePh}
            />
            {errors.name && (
              <p className="mt-1 text-xs text-red-400" role="alert">
                {errors.name.message}
              </p>
            )}
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-text-100">
              {t.email}
            </label>
            <input
              id="email"
              type="email"
              autoComplete="email"
              data-field="contact-email"
              {...register("email")}
              className="mt-1 w-full rounded-lg border border-border bg-bg-base px-4 py-3 text-sm text-text-100 placeholder:text-text-40 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/40"
              placeholder={t.emailPh}
            />
            {errors.email && (
              <p className="mt-1 text-xs text-red-400" role="alert">
                {errors.email.message}
              </p>
            )}
          </div>

          <div>
            <label htmlFor="company" className="block text-sm font-medium text-text-100">
              {t.company}
            </label>
            <input
              id="company"
              autoComplete="organization"
              data-field="contact-company"
              {...register("company")}
              className="mt-1 w-full rounded-lg border border-border bg-bg-base px-4 py-3 text-sm text-text-100 placeholder:text-text-40 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/40"
              placeholder={t.companyPh}
            />
            {errors.company && (
              <p className="mt-1 text-xs text-red-400" role="alert">
                {errors.company.message}
              </p>
            )}
          </div>

          <div>
            <label htmlFor="service" className="block text-sm font-medium text-text-100">
              {t.service}
            </label>
            <select
              id="service"
              data-field="service-interest"
              {...register("service")}
              className="mt-1 w-full rounded-lg border border-border bg-bg-base px-4 py-3 text-sm text-text-100 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/40"
            >
              <option value="">{t.selectService}</option>
              <option value="ia">{t.ia}</option>
              <option value="cloud">Cloud / FinOps</option>
              <option value="staffing">Staff Augmentation</option>
              <option value="desarrollo">{t.development}</option>
              <option value="ciberseguridad">{t.security}</option>
              <option value="otro">{t.other}</option>
            </select>
            {errors.service && (
              <p className="mt-1 text-xs text-red-400" role="alert">
                {errors.service.message}
              </p>
            )}
          </div>

          <div>
            <label htmlFor="message" className="block text-sm font-medium text-text-100">
              {t.message}
            </label>
            <textarea
              id="message"
              rows={4}
              data-field="contact-message"
              {...register("message")}
              className="mt-1 w-full rounded-lg border border-border bg-bg-base px-4 py-3 text-sm text-text-100 placeholder:text-text-40 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/40 resize-none"
              placeholder={t.messagePh}
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
            aria-label={t.submitAria}
          >
            {isSubmitting ? t.sending : t.submit}
          </Button>
        </form>
      )}
    </div>
  );
}
