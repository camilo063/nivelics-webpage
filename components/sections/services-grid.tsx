"use client";

import { motion } from "framer-motion";
import { SERVICES } from "@/lib/constants";
import { ServiceCard } from "@/components/shared";

export function ServicesGrid() {
  return (
    <section className="bg-bg-base py-16 md:py-24">
      <div className="mx-auto max-w-[1280px] px-6 md:px-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <h2 className="text-3xl font-bold text-text-100 md:text-4xl">
            Soluciones que impulsan resultados
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-text-70">
            Nuestro marco I+C+S integra inteligencia artificial, infraestructura cloud y talento
            especializado para maximizar tu retorno.
          </p>
        </motion.div>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {SERVICES.filter((s) => s.slug !== "finops").map((service, i) => (
            <ServiceCard key={service.slug} service={service} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
