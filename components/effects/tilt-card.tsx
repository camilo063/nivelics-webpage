"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { cn } from "@/lib/utils";

const MAX_TILT_DEG = 6;

interface TiltCardProps {
  children: ReactNode;
  className?: string;
}

/**
 * Tilt 3D que sigue el mouse + glow radial en la posición del cursor.
 * Solo se activa en dispositivos con hover real y sin reduced-motion.
 * Escribe CSS vars directo en el DOM vía rAF (cero re-renders de React)
 * y solo anima transform/opacity — sin impacto en layout ni CLS.
 */
export function TiltCard({ children, className }: TiltCardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const rafId = useRef(0);
  const last = useRef({ x: 0, y: 0 });
  const enabled = useRef(false);

  useEffect(() => {
    enabled.current = window.matchMedia(
      "(hover: hover) and (prefers-reduced-motion: no-preference)",
    ).matches;
    return () => cancelAnimationFrame(rafId.current);
  }, []);

  const onMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!enabled.current) return;
    last.current = { x: e.clientX, y: e.clientY };
    if (rafId.current) return;
    rafId.current = requestAnimationFrame(() => {
      rafId.current = 0;
      const el = ref.current;
      if (!el) return;
      const r = el.getBoundingClientRect();
      const px = (last.current.x - r.left) / r.width;
      const py = (last.current.y - r.top) / r.height;
      el.style.setProperty("--nv-rx", `${((0.5 - py) * MAX_TILT_DEG).toFixed(2)}deg`);
      el.style.setProperty("--nv-ry", `${((px - 0.5) * MAX_TILT_DEG).toFixed(2)}deg`);
      el.style.setProperty("--nv-mx", `${(px * 100).toFixed(1)}%`);
      el.style.setProperty("--nv-my", `${(py * 100).toFixed(1)}%`);
    });
  };

  const onMouseLeave = () => {
    const el = ref.current;
    if (!el) return;
    el.style.setProperty("--nv-rx", "0deg");
    el.style.setProperty("--nv-ry", "0deg");
  };

  return (
    <div
      ref={ref}
      className={cn("tilt-card", className)}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
    >
      <div className="tilt-card__inner">
        {children}
        <span className="tilt-card__glow" aria-hidden="true" />
      </div>
    </div>
  );
}
