"use client";

import { useEffect, useState } from "react";
import type { Heading } from "@/lib/utils/blog";

interface Props {
  headings: Heading[];
  label: string;
}

export function TableOfContents({ headings, label }: Props) {
  const [activeId, setActiveId] = useState<string | null>(headings[0]?.id ?? null);

  useEffect(() => {
    if (headings.length === 0) return;

    const targets = headings
      .map((h) => document.getElementById(h.id))
      .filter((el): el is HTMLElement => el !== null);

    if (targets.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) setActiveId(visible[0].target.id);
      },
      {
        rootMargin: "-80px 0px -60% 0px",
        threshold: 0,
      },
    );

    targets.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [headings]);

  if (headings.length === 0) return null;

  return (
    <nav aria-label={label} className="border-l border-white/10 pl-4">
      <p className="mb-3 text-xs font-medium uppercase tracking-wider text-white/30">{label}</p>
      <ul className="space-y-0">
        {headings.map((h) => {
          const isActive = h.id === activeId;
          const baseLink = "block py-1 transition-colors text-sm";
          const indent = h.level === 3 ? "pl-3" : "";
          const inactive =
            h.level === 3 ? "text-white/30 hover:text-white/70" : "text-white/50 hover:text-white";
          const active =
            "text-[var(--primary)] border-l-2 border-[var(--primary)] -ml-[calc(1rem+1px)] pl-[calc(1rem-1px)]";
          const levelActive = h.level === 3 ? `${active} pl-[calc(1rem+0.75rem-1px)]` : active;
          return (
            <li key={h.id}>
              <a
                href={`#${h.id}`}
                className={`${baseLink} ${isActive ? levelActive : `${indent} ${inactive}`}`}
                aria-current={isActive ? "location" : undefined}
              >
                {h.text}
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

export function TableOfContentsCollapsible({ headings, label }: Props) {
  if (headings.length === 0) return null;
  return (
    <details className="mb-8 rounded-lg border border-white/10 bg-white/[0.03] p-4 lg:hidden">
      <summary className="cursor-pointer text-sm font-medium text-white/70">{label}</summary>
      <ul className="mt-3 space-y-1">
        {headings.map((h) => (
          <li key={h.id}>
            <a
              href={`#${h.id}`}
              className={`block py-1 text-sm transition-colors ${
                h.level === 3
                  ? "pl-3 text-white/40 hover:text-white/70"
                  : "text-white/60 hover:text-white"
              }`}
            >
              {h.text}
            </a>
          </li>
        ))}
      </ul>
    </details>
  );
}
