import Link from "next/link";
import { cn } from "@/lib/utils";
import { PortalEffect } from "@/components/ui/portal-effect";
import { Reveal } from "@/components/effects/reveal";

interface CTABannerProps {
  title?: string;
  description?: string;
  buttonText?: string;
  buttonHref?: string;
  className?: string;
  locale?: string;
  eyebrow?: string;
  trustLine?: string;
}

export function CTABanner({
  title = "¿Listo para transformar más rápido?",
  description = "Conversemos sobre cómo la tecnología puede impulsar tus resultados.",
  buttonText = "Agenda una reunión",
  buttonHref = "/contacto",
  className,
  locale: _locale = "es",
  eyebrow,
  trustLine,
}: CTABannerProps) {
  // `eyebrow` and `trustLine` are rendered only when the caller provides them.
  // Callers that want bilingual defaults should pass the resolved values from
  // ui_labels (keys: cta_banner.default_eyebrow / .default_trust).
  void _locale;
  const resolvedEyebrow = eyebrow;
  const resolvedTrust = trustLine;

  return (
    <section
      aria-labelledby="cta-portal-title"
      className={cn("relative flex items-center overflow-hidden", className)}
      style={{ background: "#080d1a", minHeight: "360px" }}
    >
      <PortalEffect />

      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-0 right-0 top-0 h-px"
        style={{
          background: "linear-gradient(to right, transparent, rgba(0,212,255,0.35), transparent)",
          zIndex: 1,
        }}
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-0 right-0 bottom-0 h-px"
        style={{
          background: "linear-gradient(to right, transparent, rgba(255,255,255,0.06), transparent)",
          zIndex: 1,
        }}
      />

      <div
        className="relative"
        style={{
          zIndex: 10,
          maxWidth: "1280px",
          margin: "0 auto",
          padding: "80px 24px",
          width: "100%",
        }}
      >
        <Reveal>
          {resolvedEyebrow ? (
            <div
              className="mb-6 inline-flex items-center gap-2 rounded-full border px-4 py-[5px]"
              style={{
                borderColor: "rgba(0,212,255,0.25)",
                background: "rgba(0,212,255,0.06)",
              }}
            >
              <span className="cta-portal-dot" aria-hidden="true" />
              <span
                className="text-[11px] font-semibold uppercase tracking-[0.09em]"
                style={{ color: "#00D4FF" }}
              >
                {resolvedEyebrow}
              </span>
            </div>
          ) : null}

          <h2
            id="cta-portal-title"
            className="font-bold text-white"
            style={{
              fontSize: "clamp(28px, 4vw, 48px)",
              lineHeight: 1.1,
              letterSpacing: "-0.025em",
              margin: "0 0 16px",
              maxWidth: "640px",
            }}
          >
            {title}
          </h2>

          <p
            className="text-[15px] leading-[1.65]"
            style={{
              color: "rgba(255,255,255,0.5)",
              margin: "0 0 40px",
              maxWidth: "480px",
            }}
          >
            {description}
          </p>

          <div className="flex flex-wrap items-center gap-5">
            <Link
              href={buttonHref}
              className="inline-flex items-center gap-2 rounded-full font-semibold transition-all duration-150 hover:scale-[1.02]"
              style={{
                background: "#00D4FF",
                color: "#000000",
                letterSpacing: "-0.01em",
                height: "48px",
                padding: "0 28px",
                fontSize: "15px",
                whiteSpace: "nowrap",
              }}
            >
              {buttonText}
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                <path
                  d="M3 7h8M8 4l3 3-3 3"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </Link>

            {resolvedTrust ? (
              <span
                className="text-xs"
                style={{ color: "rgba(255,255,255,0.28)", letterSpacing: "0.01em" }}
              >
                {resolvedTrust}
              </span>
            ) : null}
          </div>
        </Reveal>
      </div>
    </section>
  );
}

export { CTABanner as CtaFinal };
