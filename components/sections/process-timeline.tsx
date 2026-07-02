"use client";

import { motion } from "framer-motion";

interface TimelineStep {
  number: string;
  title: string;
  description: string;
  duration?: string;
  deliverable?: string;
}

interface ProcessTimelineProps {
  title: string;
  steps: TimelineStep[];
  accentColor?: string;
}

export function ProcessTimeline({ title, steps, accentColor = "#00D4FF" }: ProcessTimelineProps) {
  return (
    <section className="py-10 md:py-14">
      <div className="mx-auto max-w-[1280px] px-6 md:px-20">
        <h2 className="text-3xl font-bold text-text-100 md:text-4xl">{title}</h2>
        <div className="mt-12 grid gap-6 md:grid-cols-5">
          {steps.map((step, i) => (
            <motion.div
              key={step.number}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="relative glass glow-hover rounded-xl p-5"
              style={{ borderTop: `2px solid ${accentColor}` }}
            >
              <span className="font-mono text-2xl font-bold" style={{ color: accentColor }}>
                {step.number}
              </span>
              {step.duration && (
                <span className="ml-2 text-[11px] text-text-40">{step.duration}</span>
              )}
              <h3 className="mt-2 text-base font-semibold text-text-100">{step.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-text-70">{step.description}</p>
              {step.deliverable && (
                <p className="mt-3 border-t border-border pt-2 text-[11px] text-text-40">
                  Entregable: {step.deliverable}
                </p>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
