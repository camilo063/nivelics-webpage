"use client";

import { useEffect, useRef, useState } from "react";
import { Link, usePathname, useRouter } from "@/lib/i18n/navigation";
import { ArrowRight, MessageCircle } from "lucide-react";
import { cn } from "@/lib/utils";

const MILESTONES = [0.02, 0.34, 0.66, 0.98];
const CTA_THRESHOLD = 0.55;
// Ruta interna next-intl: se localiza sola (/contacto ↔ /en/contact).
const CONTACT_ROUTE = "/contacto" as const;

interface ScrollBeamProps {
  ctaLabel: string;
  chatLabel: string;
}

/**
 * Línea de navegación 3D: beam vertical fijo (solo desktop ≥lg) que se
 * llena con el progreso de scroll; un nodo luminoso viaja por la línea y,
 * pasada la mitad de la página, aparece una invitación a contactar
 * (link a /contacto + botón que abre el chat del agente si está cargado).
 *
 * Performance/SEO-safe: decorativo (aria-hidden en lo no interactivo),
 * oculto en móvil y con reduced-motion, scroll listener pasivo con rAF,
 * solo anima transform/opacity vía una única CSS var (--nv-p).
 */
export function ScrollBeam({ ctaLabel, chatLabel }: ScrollBeamProps) {
  const pathname = usePathname();
  const router = useRouter();
  const rootRef = useRef<HTMLDivElement>(null);
  const engagedRef = useRef(false);
  const [engaged, setEngaged] = useState(false);

  // En la página de contacto la invitación es redundante.
  const onContactPage = /\/(contacto|contact)(\/|$)/.test(pathname ?? "");

  useEffect(() => {
    if (onContactPage) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const root = rootRef.current;
    if (!root) return;
    let rafId = 0;
    const update = () => {
      rafId = 0;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const p = max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0;
      root.style.setProperty("--nv-p", p.toFixed(4));
      const isEngaged = p > CTA_THRESHOLD;
      if (isEngaged !== engagedRef.current) {
        engagedRef.current = isEngaged;
        setEngaged(isEngaged);
      }
    };
    const onScroll = () => {
      if (!rafId) rafId = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      cancelAnimationFrame(rafId);
    };
  }, [onContactPage]);

  // Best-effort: abre el launcher del widget Dapta si ya está montado;
  // si no, lleva a la página de contacto (el CTA nunca queda muerto).
  const openChat = () => {
    const launcher = document.querySelector<HTMLElement>(
      'button[id*="dapta" i], button[class*="dapta" i], [id*="dapta" i] button',
    );
    if (launcher) {
      launcher.click();
      return;
    }
    router.push(CONTACT_ROUTE);
  };

  if (onContactPage) return null;

  return (
    <div ref={rootRef} className="scroll-beam">
      <div className="scroll-beam__stage" aria-hidden="true">
        <span className="scroll-beam__track scroll-beam__track--back" />
        <span className="scroll-beam__track" />
        <span className="scroll-beam__fill" />
        {MILESTONES.map((m) => (
          <span
            key={m}
            className="scroll-beam__dot"
            style={{
              top: `${m * 100}%`,
              opacity: `clamp(0.2, calc((var(--nv-p, 0) - ${m}) * 12 + 0.2), 1)`,
            }}
          />
        ))}
        <span className="scroll-beam__node" />
      </div>
      <div className={cn("scroll-beam__cta", engaged && "is-on")}>
        <Link href={CONTACT_ROUTE} className="scroll-beam__cta-link">
          <span className="cta-portal-dot" aria-hidden="true" />
          {ctaLabel}
          <ArrowRight size={12} aria-hidden="true" />
        </Link>
        <button
          type="button"
          onClick={openChat}
          aria-label={chatLabel}
          title={chatLabel}
          className="scroll-beam__chat"
        >
          <MessageCircle size={14} aria-hidden="true" />
        </button>
      </div>
    </div>
  );
}
