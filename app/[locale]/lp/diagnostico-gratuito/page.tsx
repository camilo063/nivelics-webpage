import type { Metadata } from "next";
import { Search, Target, FileText } from "lucide-react";
import { LpHeroWithForm } from "@/components/lp/LpHeroWithForm";
import { LpMetrics } from "@/components/lp/LpMetrics";
import { LpValueProps } from "@/components/lp/LpValueProps";
import { LpTestimonial } from "@/components/lp/LpTestimonial";
import { LpForm } from "@/components/lp/LpForm";
import { LpFooterMin } from "@/components/lp/LpFooterMin";
import { LpWhatsApp } from "@/components/lp/LpWhatsApp";

const ACCENT = "#00D4FF";

export const metadata: Metadata = {
  title: "Diagnóstico Digital Gratuito | IA · Cloud · Talento | Nivelics",
  description:
    "45 minutos. 3 áreas evaluadas. Reporte ejecutivo en 48h. Descubre dónde tu empresa puede transformarse más rápido — sin costo ni compromiso.",
  alternates: {
    canonical: "https://nivelics.com/lp/diagnostico-gratuito",
  },
  openGraph: {
    title: "Diagnóstico Digital Gratuito | Nivelics",
    description: "45 minutos. 3 áreas evaluadas. Sin costo ni compromiso.",
    images: ["/og/lp-diagnostico.png"],
  },
};

const orgSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Nivelics",
  url: "https://nivelics.com",
  logo: "https://nivelics.com/logo.png",
  foundingDate: "2012",
};

const serviceSchema = {
  "@context": "https://schema.org",
  "@type": "Service",
  name: "Diagnóstico Digital Gratuito",
  provider: {
    "@type": "Organization",
    name: "Nivelics",
  },
  description:
    "Evaluación gratuita de 45 minutos sobre madurez digital en IA, Cloud y Talento tech, con reporte ejecutivo entregable en 48 horas.",
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "USD",
  },
};

const VERTICALES = [
  {
    title: "Inteligencia Artificial",
    color: "#8B5CF6",
    items: [
      "Automatización de procesos",
      "Agentes y chatbots",
      "Análisis predictivo",
      "RAG y gestión del conocimiento",
    ],
  },
  {
    title: "Cloud & FinOps",
    color: "#1E40AF",
    items: [
      "Arquitectura y gobierno",
      "Optimización de costos",
      "Seguridad y compliance",
      "Observabilidad",
    ],
  },
  {
    title: "Talento Tech",
    color: "#00E5A0",
    items: [
      "Gaps en el equipo actual",
      "Stack vs. mercado",
      "Velocidad de contratación",
      "Estructura óptima",
    ],
  },
];

export default function DiagnosticoLanding() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(orgSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }}
      />

      <LpHeroWithForm
        fuente="diagnostico-gratuito"
        badge="Oferta limitada · Diagnóstico 100% gratuito"
        h1="¿Cuánto te está costando no transformarte digitalmente?"
        subtitle="En 45 minutos te decimos exactamente dónde estás, qué frenar, qué acelerar y qué automatizar. Sin costo. Sin venta disfrazada."
        formTitle="Agenda tu diagnóstico gratuito"
        formCtaText="Quiero mi diagnóstico →"
        accentColor={ACCENT}
      />

      <LpMetrics
        accentColor={ACCENT}
        metrics={[
          { value: "45 min", label: "Duración del diagnóstico" },
          { value: "100%", label: "Gratuito y sin compromiso" },
          { value: "3", label: "Áreas evaluadas: IA, Cloud, Talento" },
          { value: "48h", label: "Entrega del reporte de hallazgos" },
        ]}
      />

      <LpValueProps
        accentColor={ACCENT}
        title="¿Qué obtienes en el diagnóstico?"
        items={[
          {
            icon: Search,
            title: "Mapa de madurez digital",
            copy: "Evaluamos en qué punto está tu empresa en IA, Cloud y Talento tech. Sin tecnicismos — lenguaje de negocio, con impacto en números.",
          },
          {
            icon: Target,
            title: "Top 3 oportunidades de impacto",
            copy: "Identificamos las 3 palancas donde puedes obtener el mayor retorno en los próximos 90 días. Priorizado por ROI, no por moda.",
          },
          {
            icon: FileText,
            title: "Reporte ejecutivo entregable",
            copy: "A las 48h recibes un documento con hallazgos, recomendaciones y un roadmap inicial. Algo que puedes llevar a tu directivo o junta.",
          },
        ]}
      />

      {/* Bloque visual de las 3 verticales */}
      <section className="border-y border-white/5 bg-[#0A0A0F]/50 py-20 md:py-24">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-center text-3xl font-black tracking-tight text-white md:text-4xl">
            Lo que evaluamos
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-center text-lg text-white/70">
            Tres áreas. 45 minutos. Un reporte que transforma decisiones.
          </p>

          <div className="mt-14 grid grid-cols-1 gap-6 md:grid-cols-3">
            {VERTICALES.map((v, i) => (
              <div
                key={i}
                className="overflow-hidden rounded-2xl border bg-[#12121A] p-7"
                style={{ borderColor: `${v.color}30` }}
              >
                <h3 className="text-base font-semibold" style={{ color: v.color }}>
                  {v.title}
                </h3>
                <ul className="mt-5 space-y-2.5">
                  {v.items.map((item, j) => (
                    <li
                      key={j}
                      className="flex items-start gap-2 text-sm text-[#B3B3CC] font-normal"
                    >
                      <span
                        className="mt-1.5 h-1 w-1 shrink-0 rounded-full opacity-60"
                        style={{ backgroundColor: v.color }}
                        aria-hidden="true"
                      />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* CTA intermedio */}
          <div className="mt-12 flex flex-col items-center gap-3 text-center">
            <p className="text-sm text-[#B3B3CC]">
              ¿Ya sabes lo que necesitas? No pierdas más tiempo.
            </p>
            <a
              href="#formulario"
              className="inline-flex items-center gap-2 rounded-full border border-[#00D4FF]/30 bg-[#00D4FF]/10 px-6 py-3 text-sm font-medium text-[#00D4FF] transition-colors hover:bg-[#00D4FF]/15"
            >
              Solicitar diagnóstico ahora →
            </a>
          </div>
        </div>
      </section>

      {/* TODO: reemplazar con testimonial real */}
      <LpTestimonial
        accentColor={ACCENT}
        quote="El diagnóstico nos abrió los ojos. Estábamos gastando $8,000 USD al mes en cloud sin saberlo. En 6 semanas Nivelics lo redujo a $4,200."
        author="CFO"
        role="Empresa de logística, Colombia"
      />

      <div className="bg-[#0A0A0F] py-20 md:py-24">
        <div className="mx-auto max-w-xl px-4 sm:px-6 lg:px-8">
          <LpForm
            fuente="diagnostico-gratuito"
            title="Una sesión de 45 minutos puede cambiar tu roadmap del año"
            subtitle="Elige el slot que mejor te convenga. Sin preparación previa necesaria."
            ctaText="Agendar mi diagnóstico →"
            accentColor={ACCENT}
            trustSignals={[
              "✅ Sin costo ni compromiso",
              "🔒 Información 100% confidencial",
              "⏱ 45 minutos — respetamos tu tiempo",
              "🏆 Great Place to Work Colombia 2022",
            ]}
          />
        </div>
      </div>

      <LpFooterMin />
      <LpWhatsApp message="Hola, quiero agendar mi diagnóstico gratuito con Nivelics" />
    </>
  );
}
