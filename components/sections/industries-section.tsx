"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Landmark, Tv, HeartPulse, ShoppingBag, Truck, Factory } from "lucide-react";

const INDUSTRIES = [
  { label: "Fintech", href: "/industrias/fintech", icon: Landmark },
  { label: "Medios y Entretenimiento", href: "/industrias/medios-entretenimiento", icon: Tv },
  { label: "Salud", href: "/industrias/salud", icon: HeartPulse },
  { label: "Retail y E-commerce", href: "/industrias/retail-ecommerce", icon: ShoppingBag },
  { label: "Logística", href: "/industrias/logistica", icon: Truck },
  { label: "Manufactura", href: "/industrias/manufactura", icon: Factory },
];

export function IndustriesSection() {
  return (
    <section className="bg-bg-surface py-16 md:py-24">
      <div className="mx-auto max-w-[1280px] px-6 md:px-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <h2 className="text-3xl font-bold text-text-100 md:text-4xl">
            Industrias que transformamos
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-text-70">
            Experiencia comprobada en los sectores más exigentes de LATAM y USA.
          </p>
        </motion.div>

        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {INDUSTRIES.map((ind, i) => {
            const Icon = ind.icon;
            return (
              <motion.div
                key={ind.href}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
              >
                <Link
                  href={ind.href}
                  className="glass glow-hover rounded-xl p-5 flex items-center gap-4 group block"
                >
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                    <Icon size={20} className="text-primary" aria-hidden="true" />
                  </div>
                  <div className="flex-1">
                    <span className="font-semibold text-text-100 group-hover:text-primary transition-colors">
                      {ind.label}
                    </span>
                  </div>
                  <ArrowRight
                    size={16}
                    className="text-text-40 group-hover:text-primary transition-colors"
                  />
                </Link>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
