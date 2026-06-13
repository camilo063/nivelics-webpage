"use client";

import { useEffect, useRef, type ReactNode } from "react";

interface ParallaxLayerProps {
  children?: ReactNode;
  /** Factor de desplazamiento respecto al scroll (0.1–0.4 recomendado). */
  speed?: number;
  className?: string;
}

/**
 * Capa decorativa con parallax sutil ligado al scroll del hero.
 * Solo transform (compositor), rAF-throttled, listener pasivo, y se
 * detiene cuando el hero sale del viewport. aria-hidden: invisible
 * para crawlers y lectores de pantalla.
 */
export function ParallaxLayer({ children, speed = 0.25, className }: ParallaxLayerProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let rafId = 0;
    const update = () => {
      rafId = 0;
      const el = ref.current;
      if (!el) return;
      const y = window.scrollY;
      if (y > window.innerHeight * 1.2) return; // hero fuera de vista: no trabajar
      el.style.transform = `translate3d(0, ${(y * speed).toFixed(1)}px, 0)`;
    };
    const onScroll = () => {
      if (!rafId) rafId = requestAnimationFrame(update);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(rafId);
    };
  }, [speed]);

  return (
    <div ref={ref} className={className} aria-hidden="true">
      {children}
    </div>
  );
}
