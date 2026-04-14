import type { Metadata } from "next";
import { Check } from "lucide-react";
import { LpHeroWithForm } from "@/components/lp/LpHeroWithForm";
import { LpLogosBar } from "@/components/lp/LpLogosBar";
import { LpMetrics } from "@/components/lp/LpMetrics";
import { LpFAQ } from "@/components/lp/LpFAQ";
import { LpForm } from "@/components/lp/LpForm";
import { LpFooterMin } from "@/components/lp/LpFooterMin";
import { LpWhatsApp } from "@/components/lp/LpWhatsApp";

const ACCENT = "#F59E0B";

export const metadata: Metadata = {
  title: "FinOps AWS | Reduce tu Factura Cloud hasta 40% | Nivelics",
  description:
    "Diagnóstico gratuito de tu gasto en AWS. Identificamos ahorros en 6 semanas. Sin cambiar arquitectura, sin riesgo, con resultados medibles.",
  robots: { index: false, follow: false },
  openGraph: {
    title: "FinOps AWS | Nivelics",
    description: "Reduce tu factura de AWS hasta 40% en 6 semanas.",
    images: ["/og/lp-finops-aws.png"],
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

const pageSchema = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  name: "FinOps AWS | Nivelics",
  description: "Reduce tu factura de AWS hasta 40% en 6 semanas.",
  url: "https://nivelics.com/lp/finops-aws",
  about: {
    "@type": "Service",
    name: "FinOps AWS — Optimización Cloud",
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
    url: "https://nivelics.com/lp/finops-aws#formulario",
  },
};

const INCLUDED = [
  "Auditoría completa de tu cuenta AWS (costos, arquitectura, tagging)",
  "Identificación de recursos ociosos y sobredimensionados",
  "Mapa de ahorro con cifras concretas (sin rodeos)",
  "Recomendaciones priorizadas por ROI",
  "Reunión de resultados con tu equipo técnico",
];

export default function FinOpsAwsLanding() {
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

      <LpHeroWithForm
        fuente="finops-aws"
        badge="FinOps · Optimización AWS"
        h1="Reduce tu factura de AWS hasta un 40% en 6 semanas."
        subtitle="Sin cambiar tu arquitectura. Sin riesgo. Con resultados medibles desde la semana 2."
        formTitle="Diagnóstico gratuito de tu gasto cloud"
        formCtaText="Quiero mi diagnóstico →"
        accentColor={ACCENT}
        defaultServicio="Cloud / FinOps"
      />

      <LpLogosBar
        title="Empresas que ya optimizaron su cloud con nosotros"
        logos={["Televisa", "Pulzo", "Grupo Bolívar", "Two Maids", "Univision"]}
      />

      <LpMetrics
        accentColor={ACCENT}
        metrics={[
          { value: "40%", label: "Reducción promedio en gasto cloud" },
          { value: "6", label: "Semanas para ver resultados reales" },
          { value: "0", label: "Downtime durante la optimización" },
          { value: "13+", label: "Años auditando arquitecturas cloud" },
        ]}
      />

      {/* Card de servicio inline */}
      <section className="bg-[#0A0A0F] py-20 md:py-24">
        <div className="mx-auto max-w-3xl px-6">
          <div className="rounded-3xl border border-white/10 bg-[#12121A] p-8 backdrop-blur-sm md:p-10">
            <h2 className="text-2xl font-black tracking-tight text-white md:text-3xl">
              ¿Qué incluye el diagnóstico gratuito?
            </h2>
            <ul className="mt-8 space-y-4">
              {INCLUDED.map((item, i) => (
                <li key={i} className="flex items-start gap-3">
                  <div
                    className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full mt-0.5"
                    style={{ backgroundColor: `${ACCENT}20`, color: ACCENT }}
                  >
                    <Check className="h-4 w-4" />
                  </div>
                  <span className="text-white/85 leading-relaxed">{item}</span>
                </li>
              ))}
            </ul>
            <p className="mt-8 rounded-xl border border-white/10 bg-white/5 p-4 text-sm text-white/70">
              Sin contratar nada. Sin compromiso. El diagnóstico es 100% gratuito.
            </p>
          </div>
        </div>
      </section>

      <LpFAQ
        accentColor={ACCENT}
        items={[
          {
            question: "¿Tienen que tener acceso a nuestra cuenta de AWS?",
            answer:
              "Solo necesitamos acceso de lectura (read-only) a AWS Cost Explorer y Trusted Advisor. En ningún momento modificamos nada sin tu aprobación explícita.",
          },
          {
            question: "¿En qué tiempo vemos el primer ahorro?",
            answer:
              "Los quick wins (recursos ociosos, snapshots viejos, instancias sobredimensionadas) se pueden ejecutar en la semana 1. Los ahorros estructurales toman entre 4 y 6 semanas.",
          },
          {
            question: "¿Trabajan solo con AWS o también GCP y Azure?",
            answer:
              "Principalmente AWS, donde tenemos mayor profundidad. También trabajamos con GCP. Para Azure, podemos hacer un assessment inicial.",
          },
          {
            question: "¿Cuánto cuesta el servicio después del diagnóstico?",
            answer:
              "Depende del alcance. Algunos clientes prefieren fee fijo mensual; otros, un modelo de success fee sobre el ahorro real. Lo definimos después del diagnóstico cuando ya tenemos los números reales.",
          },
          {
            question: "¿Tienen experiencia con arquitecturas de empresas de medios/retail/fintech?",
            answer:
              "Sí. Hemos optimizado cloud para Televisa, plataformas de e-commerce con picos de Black Friday, y fintechs con cargas variables. Cada caso tiene sus particularidades y las conocemos.",
          },
        ]}
      />

      <div className="bg-[#0A0A0F] py-20 md:py-24">
        <div className="mx-auto max-w-xl px-4 sm:px-6 lg:px-8">
          <LpForm
            fuente="finops-aws"
            title="¿Listo para ver cuánto estás desperdiciando?"
            subtitle="El diagnóstico no cuesta nada. El desperdicio sí."
            ctaText="Quiero mi diagnóstico gratuito →"
            accentColor={ACCENT}
            defaultServicio="Cloud / FinOps"
          />
        </div>
      </div>

      <LpFooterMin />
      <LpWhatsApp message="Hola, quiero el diagnóstico gratuito de FinOps AWS con Nivelics" />
    </>
  );
}
