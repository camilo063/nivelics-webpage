"use client";

import { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";

const AmericaMap = dynamic(
  () => import("@/components/sections/america-map").then((m) => m.AmericaMap),
  { ssr: false, loading: () => <MapPlaceholder /> },
);

function MapPlaceholder() {
  return <div aria-hidden="true" style={{ minHeight: 400, width: "100%" }} />;
}

export function AmericaMapWrapper() {
  // Mount the heavy map (react-simple-maps + GeoJSON fetch) only when the
  // user is within 400px of scrolling it into view. This keeps ~150KB of JS
  // out of the initial bundle and defers the CDN fetch until it's actually
  // useful.
  const ref = useRef<HTMLDivElement>(null);
  // Lazy init: on browsers without IntersectionObserver (rare — <0.1%
  // usage globally) we short-circuit to true so the map loads immediately.
  const [inView, setInView] = useState<boolean>(() => {
    if (typeof window === "undefined") return false;
    return typeof IntersectionObserver === "undefined";
  });

  useEffect(() => {
    if (inView) return;
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setInView(true);
            io.disconnect();
            return;
          }
        }
      },
      { rootMargin: "400px 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [inView]);

  return (
    <div ref={ref} style={{ minHeight: 400 }}>
      {inView ? <AmericaMap /> : <MapPlaceholder />}
    </div>
  );
}
