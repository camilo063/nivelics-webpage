"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

interface FAQItem {
  question: string;
  answer: string;
}

interface LpFAQProps {
  title?: string;
  items: FAQItem[];
  accentColor?: string;
}

export function LpFAQ({
  title = "Preguntas frecuentes",
  items,
  accentColor = "#00D4FF",
}: LpFAQProps) {
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: { "@type": "Answer", text: item.answer },
    })),
  };

  return (
    <section className="bg-[#0A0A0F] py-20 md:py-24">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <h2 className="text-center text-3xl font-black tracking-tight text-white md:text-4xl">
          {title}
        </h2>
        <div className="mt-12 space-y-3">
          {items.map((item, i) => {
            const isOpen = openIdx === i;
            return (
              <div
                key={i}
                className="overflow-hidden rounded-xl border border-white/8 bg-[#12121A] transition-colors duration-150 hover:bg-white/[0.02]"
                style={isOpen ? { borderLeft: `2px solid ${accentColor}66` } : {}}
              >
                <button
                  onClick={() => setOpenIdx(isOpen ? null : i)}
                  aria-expanded={isOpen}
                  className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left"
                >
                  <span className="font-semibold text-white">{item.question}</span>
                  {isOpen ? (
                    <ChevronUp
                      className="h-4 w-4 shrink-0 transition-transform"
                      style={{ color: accentColor }}
                    />
                  ) : (
                    <ChevronDown className="h-4 w-4 shrink-0 text-[#B3B3CC] transition-transform" />
                  )}
                </button>
                {isOpen && (
                  <div className="border-t border-white/5 px-6 py-5">
                    <p className="text-white/70 leading-relaxed">{item.answer}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export default LpFAQ;
