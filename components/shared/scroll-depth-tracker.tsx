"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { track } from "@/lib/analytics/track";

const DEPTHS = [25, 50, 75, 100] as const;

/**
 * Instrumentación de profundidad de scroll (CRO — KPIs de engagement).
 * Dispara scroll_depth {depth, path} una sola vez por profundidad y por
 * página. Listener pasivo + rAF; se desconecta al llegar a 100.
 */
export function ScrollDepthTracker() {
  const pathname = usePathname() ?? "";
  const firedRef = useRef<Set<number>>(new Set());

  useEffect(() => {
    firedRef.current = new Set();
    let rafId = 0;
    const check = () => {
      rafId = 0;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      if (max <= 0) return;
      const pct = (window.scrollY / max) * 100;
      for (const d of DEPTHS) {
        if (pct >= d && !firedRef.current.has(d)) {
          firedRef.current.add(d);
          track("scroll_depth", { depth: d, path: pathname });
        }
      }
      if (firedRef.current.size === DEPTHS.length) {
        window.removeEventListener("scroll", onScroll);
      }
    };
    const onScroll = () => {
      if (!rafId) rafId = requestAnimationFrame(check);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(rafId);
    };
  }, [pathname]);

  return null;
}
