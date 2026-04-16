const BASE = "https://www.nivelics.com";

interface IndustriaSchemaParams {
  nombre: string;
  descripcion: string;
  slugEs: string;
  slugEn: string;
  keywords: string[];
}

export function getIndustriaWebPageSchema(params: IndustriaSchemaParams) {
  return {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: params.nombre,
    description: params.descripcion,
    url: `${BASE}/industrias/${params.slugEs}`,
    inLanguage: "es",
    about: {
      "@type": "Thing",
      name: params.nombre,
    },
    author: {
      "@id": `${BASE}/#organization`,
    },
    keywords: params.keywords.join(", "),
    sameAs: `${BASE}/en/industries/${params.slugEn}`,
  };
}

export const INDUSTRIAS_SCHEMA_DATA: Record<string, IndustriaSchemaParams> = {
  fintech: {
    nombre: "Fintech",
    descripcion:
      "Transformación digital para empresas fintech: banca digital, pagos, regulación tech, cumplimiento normativo y arquitectura cloud segura.",
    slugEs: "fintech",
    slugEn: "fintech",
    keywords: [
      "fintech Colombia",
      "banca digital",
      "pagos digitales LATAM",
      "transformación digital financiero",
      "regulación tech",
    ],
  },
  "medios-entretenimiento": {
    nombre: "Medios y Entretenimiento",
    descripcion:
      "Plataformas digitales para medios: streaming, paywall, monetización de audiencias, gestión de contenido y analítica de audiencias.",
    slugEs: "medios-entretenimiento",
    slugEn: "media-entertainment",
    keywords: [
      "medios digitales LATAM",
      "plataformas streaming",
      "paywall medios",
      "monetización contenido",
      "transformación digital medios",
    ],
  },
  salud: {
    nombre: "Salud",
    descripcion:
      "Tecnología para el sector salud: HealthTech, telemedicina, gestión clínica, cumplimiento regulatorio y sistemas de información hospitalaria.",
    slugEs: "salud",
    slugEn: "healthcare",
    keywords: [
      "healthtech Colombia",
      "telemedicina",
      "transformación digital salud",
      "sistemas hospitalarios",
      "regulación salud digital",
    ],
  },
  "retail-ecommerce": {
    nombre: "Retail y E-commerce",
    descripcion:
      "Plataformas e-commerce omnicanal, última milla, gestión de inventario inteligente y personalización con IA para retail.",
    slugEs: "retail-ecommerce",
    slugEn: "retail-ecommerce",
    keywords: [
      "ecommerce Colombia",
      "retail digital LATAM",
      "omnicanal",
      "última milla",
      "plataformas ecommerce",
    ],
  },
  logistica: {
    nombre: "Logística",
    descripcion:
      "Supply chain digital, trazabilidad en tiempo real, optimización de rutas con IA y gestión de flotas para empresas de logística.",
    slugEs: "logistica",
    slugEn: "logistics",
    keywords: [
      "logística digital Colombia",
      "supply chain tecnología",
      "trazabilidad tiempo real",
      "optimización rutas IA",
      "transformación digital logística",
    ],
  },
  manufactura: {
    nombre: "Manufactura",
    descripcion:
      "Industria 4.0: IoT industrial, mantenimiento predictivo, visión por computadora y automatización de planta para manufactura.",
    slugEs: "manufactura",
    slugEn: "manufacturing",
    keywords: [
      "industria 4.0 Colombia",
      "manufactura digital",
      "IoT industrial",
      "mantenimiento predictivo",
      "automatización planta",
    ],
  },
};
