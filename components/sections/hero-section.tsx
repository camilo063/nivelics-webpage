"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

export function HeroSection() {
  return (
    <section
      className="relative min-h-screen overflow-hidden"
      style={{ background: "var(--grad-hero)" }}
    >
      {/* Grid pattern */}
      <div className="grid-pattern absolute inset-0" />

      {/* Glow orbs */}
      <div className="absolute left-1/4 top-1/3 h-96 w-96 rounded-full bg-primary/5 blur-[120px]" />
      <div className="absolute right-1/4 bottom-1/3 h-72 w-72 rounded-full bg-ia/5 blur-[100px]" />

      <div className="relative mx-auto flex max-w-[1280px] flex-col items-center justify-center px-6 pt-32 pb-24 text-center md:px-20 md:pt-40 md:pb-32">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <span className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-sm text-primary">
            <Sparkles size={14} />
            IA · Cloud · Staffing Premium
          </span>
        </motion.div>

        {/* Heading */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="mt-8 max-w-4xl text-4xl font-bold leading-tight tracking-tight text-text-100 md:text-6xl lg:text-7xl"
        >
          Transforma más rápido.
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mt-6 max-w-2xl text-lg leading-relaxed text-text-70 md:text-xl"
        >
          Desde 2012 aceleramos la transformación digital de empresas B2B en Latinoamérica y USA con
          IA, Cloud y talento premium.
        </motion.p>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-10 flex flex-col gap-4 sm:flex-row"
        >
          <Button asChild variant="cta" size="lg">
            <Link href="/contacto">
              Agenda una reunión
              <ArrowRight size={18} />
            </Link>
          </Button>
          <Button asChild variant="outline" size="lg">
            <Link href="/servicios">Explorar servicios</Link>
          </Button>
        </motion.div>
      </div>
    </section>
  );
}
