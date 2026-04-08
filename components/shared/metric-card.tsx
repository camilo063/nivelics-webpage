"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { cn } from "@/lib/utils";

interface MetricCardProps {
  value: number;
  suffix?: string;
  label: string;
  className?: string;
}

export function MetricCard({ value, suffix = "", label, className }: MetricCardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!isInView) return;
    const duration = 2000;
    const steps = 60;
    const increment = value / steps;
    let current = 0;
    const timer = setInterval(() => {
      current += increment;
      if (current >= value) {
        setCount(value);
        clearInterval(timer);
      } else {
        setCount(Math.floor(current));
      }
    }, duration / steps);
    return () => clearInterval(timer);
  }, [isInView, value]);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className={cn("glass glow-hover rounded-xl p-6 text-center", className)}
    >
      <div className="font-mono text-4xl font-bold text-primary md:text-5xl">
        {count}
        {suffix}
      </div>
      <p className="mt-2 text-sm text-text-70">{label}</p>
    </motion.div>
  );
}
