import type { Metadata } from "next";
import { LpHero } from "@/components/lp/LpHero";
import { LpComparativeTable } from "@/components/lp/LpComparativeTable";
import { LpMetrics } from "@/components/lp/LpMetrics";
import { LpCaseStudy } from "@/components/lp/LpCaseStudy";
import { LpTestimonial } from "@/components/lp/LpTestimonial";
import { LpCTABanner } from "@/components/lp/LpCTABanner";
import { LpForm } from "@/components/lp/LpForm";
import { LpFooterMin } from "@/components/lp/LpFooterMin";
import { LpWhatsApp } from "@/components/lp/LpWhatsApp";

const ACCENT = "#00E5A0";

export const metadata: Metadata = {
  title: "Staff Augmentation vs. Contratar In-House | Comparativa Real | Nivelics",
  description:
    "Compara costos reales: contratar en USA vs. staff augmentation nearshore. 40% de ahorro, 5 días para candidatos, garantía de reemplazo.",
  alternates: {
    canonical: "https://nivelics.com/lp/staffing-vs-contratar",
  },
  openGraph: {
    title: "Staff Augmentation vs. Contratar In-House | Nivelics",
    description: "La comparativa real: 40% de ahorro y 5 días para candidatos.",
    images: ["/og/lp-staffing-vs-contratar.png"],
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
  name: "Staff Augmentation vs. Contratar In-House",
  description: "Comparativa real: contratar in-house USA vs. staff augmentation nearshore.",
  url: "https://nivelics.com/lp/staffing-vs-contratar",
  about: {
    "@type": "Service",
    name: "Staff Augmentation Nearshore",
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
    url: "https://nivelics.com/lp/staffing-vs-contratar#formulario",
  },
};

export default function StaffingVsLanding() {
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
        badge="Staff Augmentation vs. Contratación Directa"
        h1="¿Contratar en USA o escalar con talento nearshore? Los números hablan."
        subtitle="Antes de pagar un recruiter y esperar 3 meses, compara los costos reales. Spoiler: la diferencia es del 40%."
        ctaPrimary={{ text: "Ver la comparativa →", href: "#tabla" }}
        ctaSecondary={{ text: "Hablar con un especialista →", href: "#formulario" }}
        accentColor={ACCENT}
      />

      <div id="tabla">
        <LpComparativeTable
          accentColor={ACCENT}
          title="La comparativa real — 2026"
          subtitle="Cifras basadas en promedios de mercado. Ahorros reales. Sin letra pequeña."
          columns={["Contratar in-house USA", "Nivelics Staff Aug", "Freelance marketplace"]}
          highlightColIdx={1}
          rows={[
            {
              criterio: "Tiempo para primer candidato",
              values: ["60–90 días", "✅ 5 días hábiles", "3–7 días"],
            },
            {
              criterio: "Costo mensual (senior dev)",
              values: ["$12,000–$18,000 USD", "✅ $4,500–$7,000 USD", "$5,000–$9,000 USD"],
            },
            { criterio: "Inglés profesional garantizado", values: ["✅ Sí", "✅ Sí", "Variable"] },
            {
              criterio: "Zona horaria compatible",
              values: ["✅ Sí", "✅ Sí (Colombia = EST-1)", "Variable"],
            },
            {
              criterio: "Validación técnica previa",
              values: ["No (lo haces tú)", "✅ Sí — prevalidado", "No"],
            },
            {
              criterio: "Garantía de reemplazo",
              values: ["No aplica", "✅ 30 días sin costo", "No"],
            },
            {
              criterio: "Overhead RRHH / benefits",
              values: ["Alto (+30% sobre salario)", "✅ Cero — lo manejamos nosotros", "Bajo"],
            },
            {
              criterio: "Estabilidad del equipo",
              values: ["Alta", "✅ Alta (contratos LP)", "Baja"],
            },
            {
              criterio: "Integración al equipo",
              values: ["Nativa", "✅ Total (Slack, Jira, standups)", "Parcial"],
            },
          ]}
          footnote="*Cifras basadas en promedios de mercado 2025–2026. Los costos de Nivelics varían según perfil y senioridad."
        />
      </div>

      <LpMetrics
        accentColor={ACCENT}
        metrics={[
          { value: "40%", label: "Ahorro promedio vs. contratar en USA" },
          { value: "5 días", label: "Primeros candidatos presentados" },
          { value: "500+", label: "Ingenieros en nuestra red activa" },
          { value: "30 días", label: "Garantía de reemplazo sin costo" },
        ]}
      />

      <LpCaseStudy
        accentColor={ACCENT}
        clientName="Two Maids"
        country="🇺🇸 USA"
        sector="SaaS"
        resultado="3 ingenieros senior en 10 días. -40% vs. su costo local anterior."
        extracto="Habían intentado contratar in-house durante 4 meses sin éxito. Con Nivelics tuvieron el equipo en funcionamiento en menos de 2 semanas."
      />

      {/* TODO: reemplazar con testimonial real cuando esté disponible */}
      <LpTestimonial
        accentColor={ACCENT}
        quote="Llevábamos meses buscando un desarrollador senior. Con Nivelics lo tuvimos en 6 días. El nivel técnico superó nuestras expectativas y el inglés no fue ningún problema."
        author="Director de Tecnología"
        role="Empresa SaaS, USA"
      />

      <LpCTABanner
        accentColor={ACCENT}
        title="¿Quieres los perfiles específicos que necesitas?"
        subtitle="Dinos el stack y el rol — en 24h te presentamos opciones."
        ctaText="Solicitar perfiles ahora →"
        ctaHref="#formulario"
      />

      <div className="bg-[#0A0A0F] py-20 md:py-24">
        <div className="mx-auto max-w-xl px-4 sm:px-6 lg:px-8">
          <LpForm
            fuente="staffing-vs-contratar"
            title="Solicita candidatos para tu equipo"
            subtitle="Sin compromiso. Sin recruiters intermedios. Directo al grano."
            ctaText="Solicitar candidatos →"
            accentColor={ACCENT}
            defaultServicio="Staff Augmentation"
          />
        </div>
      </div>

      <LpFooterMin />
      <LpWhatsApp message="Hola, quiero comparar opciones de Staff Augmentation con Nivelics" />
    </>
  );
}
