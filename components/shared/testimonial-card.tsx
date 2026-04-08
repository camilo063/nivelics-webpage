"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface TestimonialCardProps {
  quote: string;
  author: string;
  role: string;
  company: string;
  className?: string;
}

export function TestimonialCard({ quote, author, role, company, className }: TestimonialCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className={cn("glass glow-hover rounded-xl p-6", className)}
    >
      <blockquote className="text-sm leading-relaxed text-text-70 italic">
        &ldquo;{quote}&rdquo;
      </blockquote>
      <div className="mt-4 border-t border-border pt-4">
        <p className="font-medium text-text-100">{author}</p>
        <p className="text-xs text-text-40">
          {role} · {company}
        </p>
      </div>
    </motion.div>
  );
}
