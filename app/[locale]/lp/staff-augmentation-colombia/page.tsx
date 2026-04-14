import type { Metadata } from "next";
import { Shield, Clock, RotateCcw } from "lucide-react";
import { LpHero } from "@/components/lp/LpHero";
import { LpMetrics } from "@/components/lp/LpMetrics";
import { LpValueProps } from "@/components/lp/LpValueProps";
import { LpSteps } from "@/components/lp/LpSteps";
import { LpCaseStudy } from "@/components/lp/LpCaseStudy";
import { LpForm } from "@/components/lp/LpForm";
import { LpFooterMin } from "@/components/lp/LpFooterMin";
import { LpWhatsApp } from "@/components/lp/LpWhatsApp";

const ACCENT = "#00E5A0";

export const metadata: Metadata = {
  title: "Staff Augmentation Colombia | Talento Tech en 5 Días | Nivelics",
  description:
    "Escala tu equipo de desarrollo con ingenieros colombianos senior. Candidatos en 5 días hábiles. -40% vs. costos USA. Great Place to Work 2022.",
  robots: { index: false, follow: false },
  openGraph: {
    title: "Staff Augmentation Colombia | Nivelics",
    description: "Talento tech senior en 5 días. -40% vs. contratar en USA.",
    images: ["/og/lp-staff-augmentation.png"],
  },
};

const orgSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Nivelics",
  url: "https://nivelics.com",
  logo: "https://nivelics.com/logo.png",
  foundingDate: "2012",
  description: "Empresa colombiana de transformación digital B2B. IA · Cloud · Staffing.",
};

const pageSchema = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  name: "Staff Augmentation Colombia | Nivelics",
  description: "Talento tech senior en 5 días. -40% vs. contratar en USA.",
  url: "https://nivelics.com/lp/staff-augmentation-colombia",
  about: {
    "@type": "Service",
    name: "Staff Augmentation Colombia",
    provider: {
      "@type": "Organization",
      name: "Nivelics",
      url: "https://nivelics.com",
      foundingDate: "2012",
      areaServed: ["Colombia", "USA", "México", "Argentina", "Perú"],
    },
  },
  mainEntity: {
    "@type": "ContactPage",
    url: "https://nivelics.com/lp/staff-augmentation-colombia#formulario",
  },
};

export default function StaffAugCoLanding() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(orgSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(pageSchema) }}
      />

      <LpHero
        badge="Staff Augmentation · Colombia → USA"
        h1="Talento tech senior en 5 días. Sin los costos de contratar en USA."
        subtitle="Escalamos tu equipo de desarrollo con ingenieros colombianos verificados — inglés profesional, zona horaria compatible, sin overhead de RRHH."
        ctaPrimary={{ text: "Solicitar perfiles ahora", href: "#formulario" }}
        ctaSecondary={{ text: "Ver cómo funciona", href: "#proceso" }}
        trustBadge="🏆 Great Place to Work · 13+ años · 7 países"
        accentColor={ACCENT}
      />

      <LpMetrics
        accentColor={ACCENT}
        metrics={[
          { value: "5 días", label: "Primeros perfiles presentados" },
          { value: "40%", label: "Ahorro vs. contratar en USA o Europa" },
          { value: "13+", label: "Años entregando equipos tech" },
          { value: "7", label: "Países con clientes activos" },
        ]}
      />

      <LpValueProps
        accentColor={ACCENT}
        title="¿Por qué Nivelics y no una bolsa de trabajo?"
        items={[
          {
            icon: Shield,
            title: "Candidatos pre-validados",
            copy: "Evaluamos habilidades técnicas, inglés y cultura antes de presentarte a alguien. No recibes CVs — recibes candidatos listos para entrevistar.",
          },
          {
            icon: Clock,
            title: "Velocidad real, no promesas",
            copy: "En 5 días hábiles tienes los primeros perfiles. En 15 días, el ingeniero puede estar en tu standup. Sin procesos burocráticos.",
          },
          {
            icon: RotateCcw,
            title: "Garantía de reemplazo",
            copy: "Si en los primeros 30 días el perfil no encaja, lo reemplazamos sin costo adicional. El riesgo es nuestro.",
          },
        ]}
      />

      <div id="proceso">
        <LpSteps
          accentColor={ACCENT}
          title="Cómo funciona — sin burocracia"
          steps={[
            {
              title: "Briefing técnico (día 1)",
              copy: "Nos cuentas el stack, el rol y el contexto del equipo. 30 minutos en videollamada.",
            },
            {
              title: "Sourcing y validación (días 1–3)",
              copy: "Buscamos en nuestra red de 500+ ingenieros activos. Validamos técnico, inglés y disponibilidad.",
            },
            {
              title: "Presentación de perfiles (día 5)",
              copy: "Recibes entre 2 y 4 candidatos con video de presentación, evaluación técnica y disponibilidad confirmada.",
            },
            {
              title: "Entrevista y arranque (días 6–15)",
              copy: "Tú entrevistas, decides. Una vez confirmado, el ingeniero está activo en tu equipo.",
            },
          ]}
        />
      </div>

      <LpCaseStudy
        accentColor={ACCENT}
        clientName="Two Maids"
        country="🇺🇸 USA"
        sector="Servicios a domicilio / SaaS"
        resultado="-40% en costos de desarrollo. Equipo escalado en 10 días."
        extracto="Necesitaban crecer el equipo tech rápido para su plataforma SaaS sin duplicar su nómina en USA. Nivelics entregó 3 ingenieros senior en 10 días."
      />

      <div className="bg-[#0A0A0F] pt-8 pb-20 md:pb-24">
        <div className="mx-auto max-w-xl px-4 sm:px-6 lg:px-8">
          <LpForm
            fuente="staff-augmentation-colombia"
            title="Solicita tus primeros perfiles"
            subtitle="Sin compromiso. En menos de 24h te respondemos."
            ctaText="Solicitar perfiles →"
            accentColor={ACCENT}
            defaultServicio="Staff Augmentation"
            trustSignals={[
              "🔒 Tus datos no se comparten con terceros",
              "✅ Great Place to Work Colombia 2022",
              "⚡ Respuesta en menos de 24 horas",
            ]}
          />
        </div>
      </div>

      <LpFooterMin />
      <LpWhatsApp message="Hola, quiero información sobre Staff Augmentation con Nivelics" />
    </>
  );
}
