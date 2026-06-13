"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { cn } from "@/lib/utils";

interface RevealProps {
  children: ReactNode;
  /** Stagger en ms (se aplica como transition-delay). */
  delay?: number;
  className?: string;
}

/**
 * Reveal on scroll sin coste SEO/CLS: el HTML servido es 100% visible
 * (sin opacity:0 en SSR). Solo después de hidratar, y solo si el elemento
 * está bajo el viewport, se oculta y se revela al entrar en pantalla.
 * Usa transform/opacity (compositor) — no afecta layout ni CLS.
 */
export function Reveal({ children, delay = 0, className }: RevealProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    // Si ya está (parcialmente) en viewport al cargar, no animar:
    // protege LCP y evita parpadeos above-the-fold.
    if (el.getBoundingClientRect().top < window.innerHeight * 0.9) return;

    el.classList.add("nv-reveal-hidden");
    const io = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          el.style.transitionDelay = `${delay}ms`;
          el.classList.add("nv-reveal-visible");
          io.disconnect();
        }
      },
      { rootMargin: "0px 0px -8% 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [delay]);

  return (
    <div ref={ref} className={cn(className)}>
      {children}
    </div>
  );
}
