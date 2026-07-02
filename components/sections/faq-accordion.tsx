"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface FAQItem {
  question: string;
  answer: string;
}

interface FAQAccordionProps {
  title: string;
  faqs: FAQItem[];
  schemaEnabled?: boolean;
}

export function FAQAccordion({ title, faqs, schemaEnabled = false }: FAQAccordionProps) {
  // If schemaEnabled, render JSON-LD for FAQPage
  const schemaData = schemaEnabled
    ? {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: faqs.map((faq) => ({
          "@type": "Question",
          name: faq.question,
          acceptedAnswer: { "@type": "Answer", text: faq.answer },
        })),
      }
    : null;

  return (
    <section className="py-10 md:py-14">
      <div className="mx-auto max-w-[1280px] px-6 md:px-20">
        {schemaData && (
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaData) }}
          />
        )}
        <h2 className="text-3xl font-bold text-text-100">{title}</h2>
        <div className="mt-8 space-y-3">
          {faqs.map((faq) => (
            <FAQItem key={faq.question} question={faq.question} answer={faq.answer} />
          ))}
        </div>
      </div>
    </section>
  );
}

function FAQItem({ question, answer }: FAQItem) {
  const [open, setOpen] = useState(false);
  return (
    <div className="rounded-xl border border-border overflow-hidden">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        aria-expanded={open}
        className="flex w-full items-center justify-between px-6 py-4 text-left"
      >
        <span className="text-base font-medium text-text-100 pr-4">{question}</span>
        <ChevronDown
          size={18}
          className={cn(
            "shrink-0 text-text-40 transition-transform duration-200",
            open && "rotate-180",
          )}
        />
      </button>
      <div
        className={cn(
          "grid transition-all duration-200",
          open ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0",
        )}
      >
        <div className="overflow-hidden">
          <p className="px-6 pb-5 text-sm leading-relaxed text-text-70">{answer}</p>
        </div>
      </div>
    </div>
  );
}
