"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { track } from "@/lib/analytics/track";

interface StickyMobileCtaProps {
  text: string;
  url: string;
  accentColor?: string;
}

export function StickyMobileCta({ text, url, accentColor = "#00D4FF" }: StickyMobileCtaProps) {
  const [visible, setVisible] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    function handleScroll() {
      setVisible(window.scrollY > 300);
    }
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  if (!visible) return null;

  return (
    <div
      data-sticky-cta
      className="fixed bottom-0 left-0 right-0 z-40 p-3 md:hidden"
      style={{ background: "rgba(10,10,15,0.95)", backdropFilter: "blur(12px)" }}
    >
      <Link
        href={url}
        aria-label={text}
        onClick={() => track("cta_click", { cta: "sticky_mobile", path: pathname ?? "" })}
        className="flex h-12 w-full items-center justify-center rounded-xl text-sm font-semibold text-bg-base transition-opacity"
        style={{ background: accentColor }}
      >
        {text}
      </Link>
    </div>
  );
}
