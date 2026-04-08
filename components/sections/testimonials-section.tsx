"use client";

import { motion } from "framer-motion";
import { TestimonialCard } from "@/components/shared";

const TESTIMONIALS = [
  {
    quote:
      "Nivelics transformó nuestra infraestructura cloud reduciendo costos un 35% mientras mejoramos el uptime al 99.9%.",
    author: "Carlos Mendoza",
    role: "CTO",
    company: "FinTech Latam",
  },
  {
    quote:
      "El equipo de staffing que Nivelics integró a nuestro proyecto se adaptó en días y entregó resultados desde la primera semana.",
    author: "María Fernanda López",
    role: "VP Engineering",
    company: "RetailCorp",
  },
  {
    quote:
      "La implementación de IA generativa en nuestro servicio al cliente redujo los tiempos de respuesta en un 60%.",
    author: "Andrés Gutiérrez",
    role: "Director de Innovación",
    company: "Grupo Asegurador",
  },
];

export function TestimonialsSection() {
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
            Lo que dicen nuestros clientes
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-text-70">
            Empresas que confiaron en Nivelics para su transformación digital.
          </p>
        </motion.div>

        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {TESTIMONIALS.map((t) => (
            <TestimonialCard key={t.author} {...t} />
          ))}
        </div>
      </div>
    </section>
  );
}
