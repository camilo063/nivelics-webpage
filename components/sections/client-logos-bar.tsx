"use client";

import { motion } from "framer-motion";

interface ClientLogo {
  name: string;
  sector: string;
  url?: string;
}

interface ClientLogosBarProps {
  title: string;
  logos: ClientLogo[];
}

export function ClientLogosBar({ title, logos }: ClientLogosBarProps) {
  return (
    <section className="py-8 md:py-10">
      <div className="mx-auto max-w-[1280px] px-6 md:px-20">
        <p className="text-center text-[13px] font-medium uppercase tracking-[0.08em] text-text-40 mb-8">
          {title}
        </p>
        <div className="flex flex-wrap items-center justify-center gap-6 md:gap-10">
          {logos.map((logo, i) => (
            <motion.div
              key={logo.name}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className="flex flex-col items-center gap-1 rounded-lg border border-border px-5 py-3 transition-all duration-200 hover:border-border-hover hover:bg-bg-elevated"
            >
              <span className="text-sm font-semibold text-text-40 transition-colors group-hover:text-text-100">
                {logo.name}
              </span>
              <span className="text-[10px] text-text-40/60">{logo.sector}</span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
