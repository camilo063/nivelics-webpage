/**
 * Seed navConfig (megaMenu + footer) with complete bilingual structure.
 * Mirrors the hardcoded arrays currently in components/layout/nav.tsx and footer.tsx.
 * Idempotent: overwrites the 'main' row.
 */
import { db } from "../lib/db";
import { navConfig } from "../lib/db/schema/admin";
import { eq } from "drizzle-orm";
import type { MegaMenuSection, FooterData } from "../lib/admin/actions/navegacion.actions";

const megaMenu: MegaMenuSection[] = [
  {
    titleEs: "Servicios",
    titleEn: "Services",
    triggerUrl: "/servicios",
    kind: "columns",
    items: [],
    columns: [
      {
        titleEs: "Inteligencia Artificial",
        titleEn: "Artificial Intelligence",
        url: "/servicios/inteligencia-artificial",
        icon: "brain",
        color: "#8B5CF6",
        descriptionEs: "Agentes, automatización y RAG aplicado al negocio",
        descriptionEn: "Agents, automation and RAG applied to your business",
        metricValue: "50%",
        metricLabelEs: "reducción de costos operativos",
        metricLabelEn: "operating cost reduction",
        footerLinkEs: "Ver todo Inteligencia Artificial →",
        footerLinkEn: "See all Artificial Intelligence →",
        items: [
          {
            labelEs: "Agentes IA",
            labelEn: "AI Agents",
            url: "/servicios/inteligencia-artificial/agentes-ia",
            descriptionEs: "LLMs que ejecutan tareas reales",
            descriptionEn: "LLMs that execute real tasks",
            ariaLabelEs:
              "Agentes IA — agentes autónomos con LLMs para automatización de ventas, soporte y operaciones",
            ariaLabelEn:
              "AI Agents — autonomous agents with LLMs for sales, support and operations automation",
          },
          {
            labelEs: "Agentes Comerciales",
            labelEn: "Sales Agents",
            url: "/servicios/inteligencia-artificial/agentes-comerciales",
            descriptionEs: "Automatiza tu proceso de ventas",
            descriptionEn: "Automate your sales pipeline",
            ariaLabelEs:
              "Agentes Comerciales — IA que califica leads y escala oportunidades de venta",
            ariaLabelEn: "Sales Agents — AI that qualifies leads and scales sales opportunities",
          },
          {
            labelEs: "Automatización de Procesos",
            labelEn: "Process Automation",
            url: "/servicios/inteligencia-artificial/automatizacion-procesos",
            descriptionEs: "Elimina trabajo manual repetitivo",
            descriptionEn: "Eliminate repetitive manual work",
            ariaLabelEs:
              "Automatización de Procesos — RPA e IA para eliminar trabajo manual en finanzas, RRHH y logística",
            ariaLabelEn:
              "Process Automation — RPA and AI to eliminate manual work in finance, HR and logistics",
          },
          {
            labelEs: "Gestión de Contenido",
            labelEn: "Content Management",
            url: "/servicios/inteligencia-artificial/gestion-contenido",
            descriptionEs: "SEO y contenido a escala con IA",
            descriptionEn: "SEO and content at scale with AI",
            ariaLabelEs:
              "Gestión de Contenido — generación y optimización de contenido SEO a escala con IA",
            ariaLabelEn:
              "Content Management — SEO content generation and optimization at scale with AI",
          },
          {
            labelEs: "Marketing y CRM",
            labelEn: "Marketing & CRM",
            url: "/servicios/inteligencia-artificial/marketing-crm",
            descriptionEs: "Prospectos calificados automáticamente",
            descriptionEn: "Qualified leads on autopilot",
            ariaLabelEs:
              "Marketing y CRM — segmentación inteligente y personalización de campañas integrada con tu CRM",
            ariaLabelEn:
              "Marketing & CRM — smart segmentation and campaign personalization integrated with your CRM",
          },
        ],
      },
      {
        titleEs: "Cloud",
        titleEn: "Cloud",
        url: "/servicios/cloud",
        icon: "cloud",
        color: "#3B82F6",
        descriptionEs: "AWS, GCP, Azure con gobierno y FinOps real",
        descriptionEn: "AWS, GCP, Azure with real governance and FinOps",
        metricValue: "40%",
        metricLabelEs: "reducción gasto cloud promedio",
        metricLabelEn: "average cloud spend reduction",
        footerLinkEs: "Ver todo Cloud →",
        footerLinkEn: "See all Cloud →",
        items: [
          {
            labelEs: "FinOps",
            labelEn: "FinOps",
            url: "/servicios/cloud/finops",
            descriptionEs: "Gobierno y optimización financiera cloud",
            descriptionEn: "Cloud financial governance and optimization",
            ariaLabelEs: "FinOps — optimización y gobernanza financiera cloud en AWS, GCP y Azure",
            ariaLabelEn:
              "FinOps — cloud financial optimization and governance on AWS, GCP and Azure",
          },
          {
            labelEs: "Migración a AWS",
            labelEn: "AWS Migration",
            url: "/servicios/cloud/migracion-aws",
            descriptionEs: "Zero downtime, rollback garantizado",
            descriptionEn: "Zero downtime, guaranteed rollback",
            ariaLabelEs:
              "Migración a AWS — migración cloud con zero downtime y rollback garantizado",
            ariaLabelEn:
              "AWS Migration — cloud migration with zero downtime and guaranteed rollback",
          },
          {
            labelEs: "Infraestructura",
            labelEn: "Infrastructure",
            url: "/servicios/cloud/infraestructura",
            descriptionEs: "Multi-cloud con IaC y observabilidad",
            descriptionEn: "Multi-cloud with IaC and observability",
            ariaLabelEs:
              "Infraestructura Cloud — arquitectura multi-cloud con Terraform, CDK y observabilidad",
            ariaLabelEn:
              "Cloud Infrastructure — multi-cloud architecture with Terraform, CDK and observability",
          },
          {
            labelEs: "Seguridad Cloud",
            labelEn: "Cloud Security",
            url: "/servicios/cloud/seguridad",
            descriptionEs: "SOC2, ISO27001 y hardening real",
            descriptionEn: "SOC2, ISO27001 and real hardening",
            ariaLabelEs: "Seguridad Cloud — compliance SOC2, ISO27001, IAM y cifrado end-to-end",
            ariaLabelEn:
              "Cloud Security — SOC2 and ISO27001 compliance, IAM and end-to-end encryption",
          },
          {
            labelEs: "Serverless",
            labelEn: "Serverless",
            url: "/servicios/cloud/serverless",
            descriptionEs: "Pay-per-use, escala automática",
            descriptionEn: "Pay-per-use, automatic scaling",
            ariaLabelEs: "Serverless — arquitecturas event-driven con Lambda y Cloud Functions",
            ariaLabelEn: "Serverless — event-driven architectures with Lambda and Cloud Functions",
          },
        ],
      },
      {
        titleEs: "Staff Augmentation",
        titleEn: "Staff Augmentation",
        url: "/servicios/staff-augmentation",
        icon: "users",
        color: "#10B981",
        descriptionEs: "Talento tech colombiano validado para tu equipo",
        descriptionEn: "Validated Colombian tech talent for your team",
        metricValue: "40%",
        metricLabelEs: "ahorro vs. contratar en USA o Europa",
        metricLabelEn: "savings vs. hiring in USA or Europe",
        footerLinkEs: "Ver todo Staff Augmentation →",
        footerLinkEn: "See all Staff Augmentation →",
        items: [
          {
            labelEs: "Desarrollo de Software",
            labelEn: "Software Development",
            url: "/servicios/staff-augmentation/desarrollo-software",
            descriptionEs: "Backend, frontend, mobile, full-stack",
            descriptionEn: "Backend, frontend, mobile, full-stack",
            ariaLabelEs:
              "Desarrollo de Software — ingenieros senior React, Node.js, Python, Java, Go",
            ariaLabelEn:
              "Software Development — senior engineers in React, Node.js, Python, Java, Go",
          },
          {
            labelEs: "Datos e IA",
            labelEn: "Data & AI",
            url: "/servicios/staff-augmentation/datos-ia",
            descriptionEs: "Data engineers, scientists y ML experts",
            descriptionEn: "Data engineers, scientists and ML experts",
            ariaLabelEs: "Datos e IA — Data Scientists, Data Engineers y ML Engineers",
            ariaLabelEn: "Data & AI — Data Scientists, Data Engineers and ML Engineers",
          },
          {
            labelEs: "DevOps & Cloud",
            labelEn: "DevOps & Cloud",
            url: "/servicios/staff-augmentation/devops-cloud",
            descriptionEs: "SRE, cloud architects, infraestructura",
            descriptionEn: "SRE, cloud architects, infrastructure",
            ariaLabelEs:
              "DevOps y Cloud — Cloud Architects y DevOps Engineers certificados AWS, GCP, Azure",
            ariaLabelEn:
              "DevOps & Cloud — Cloud Architects and DevOps Engineers certified on AWS, GCP, Azure",
          },
          {
            labelEs: "Diseño UX/UI",
            labelEn: "UX/UI Design",
            url: "/servicios/staff-augmentation/diseno-ux-ui",
            descriptionEs: "Product designers y UX researchers",
            descriptionEn: "Product designers and UX researchers",
            ariaLabelEs:
              "Diseño UX/UI — Product Designers senior con experiencia en design systems",
            ariaLabelEn: "UX/UI Design — senior Product Designers with design systems experience",
          },
          {
            labelEs: "QA & Seguridad",
            labelEn: "QA & Security",
            url: "/servicios/staff-augmentation/qa-seguridad",
            descriptionEs: "Testers, pentesters y analistas",
            descriptionEn: "Testers, pentesters and analysts",
            ariaLabelEs: "QA y Seguridad — QA Engineers, SDET y especialistas en ciberseguridad",
            ariaLabelEn: "QA & Security — QA Engineers, SDET and cybersecurity specialists",
          },
        ],
      },
      {
        titleEs: "Desarrollo Digital",
        titleEn: "Digital Development",
        url: "/servicios/desarrollo-digital",
        icon: "code2",
        color: "#06B6D4",
        descriptionEs: "Del concepto a producción. Sprints medibles",
        descriptionEn: "From concept to production. Measurable sprints",
        metricValue: "13",
        metricLabelEs: "años de proyectos en LATAM y USA",
        metricLabelEn: "years of projects across LATAM and USA",
        footerLinkEs: "Ver todo Desarrollo Digital →",
        footerLinkEn: "See all Digital Development →",
        items: [
          {
            labelEs: "Sitios Web Agentic-First",
            labelEn: "Agentic-First Websites",
            url: "/servicios/desarrollo-digital/sitios-web-agentic",
            descriptionEs: "Sitios navegables por IA, agentes y LLMs",
            descriptionEn: "Sites navigable by AI, agents and LLMs",
            ariaLabelEs:
              "Sitios Web Agentic-First — sitios optimizados para indexación por LLMs, agentes IA y Google SGE",
            ariaLabelEn:
              "Agentic-First Websites — sites optimized for indexing by LLMs, AI agents and Google SGE",
          },
          {
            labelEs: "Apps Móviles",
            labelEn: "Mobile Apps",
            url: "/servicios/desarrollo-digital/apps-moviles",
            descriptionEs: "iOS, Android, Flutter, React Native",
            descriptionEn: "iOS, Android, Flutter, React Native",
            ariaLabelEs:
              "Apps Móviles — desarrollo nativo y cross-platform con React Native y Flutter",
            ariaLabelEn:
              "Mobile Apps — native and cross-platform development with React Native and Flutter",
          },
          {
            labelEs: "E-commerce",
            labelEn: "E-commerce",
            url: "/servicios/desarrollo-digital/ecommerce",
            descriptionEs: "Plataformas propias sin comisiones",
            descriptionEn: "Owned platforms without commissions",
            ariaLabelEs:
              "E-commerce — plataformas B2B y B2C a medida sin comisiones por transacción",
            ariaLabelEn: "E-commerce — custom B2B and B2C platforms without per-transaction fees",
          },
          {
            labelEs: "Plataformas Web",
            labelEn: "Web Platforms",
            url: "/servicios/desarrollo-digital/plataformas-web",
            descriptionEs: "Arquitectura escalable desde el día 1",
            descriptionEn: "Scalable architecture from day one",
            ariaLabelEs: "Plataformas Web — arquitectura escalable con Next.js, React, Node.js",
            ariaLabelEn: "Web Platforms — scalable architecture with Next.js, React, Node.js",
          },
        ],
      },
    ],
  },

  {
    titleEs: "Productos",
    titleEn: "Products",
    triggerUrl: "/productos",
    kind: "products",
    headerCaptionEs: "Software propio de Nivelics",
    headerCaptionEn: "Nivelics proprietary software",
    footerLinkEs: "Ver todos los productos →",
    footerLinkEn: "See all products →",
    footerLinkUrl: "/productos",
    footerLinkColor: "#00D4FF",
    items: [
      {
        labelEs: "PAYWL",
        labelEn: "PAYWL",
        url: "/productos/paywl",
        descriptionEs: "Motor de paywall para medios digitales",
        descriptionEn: "Paywall engine for digital media",
        icon: "paywl",
        badgeEs: "Medios · LATAM",
        badgeEn: "Media · LATAM",
        ariaLabelEs: "PAYWL — motor de paywall para medios digitales. Desde $450/mes",
        ariaLabelEn: "PAYWL — paywall engine for digital media. From $450/month",
      },
      {
        labelEs: "Niveleads",
        labelEn: "Niveleads",
        url: "/productos/niveleads",
        descriptionEs: "Lead scoring con IA. Setup en 24h.",
        descriptionEn: "AI lead scoring. 24h setup.",
        icon: "niveleads",
        badgeEs: "Ventas B2B · IA",
        badgeEn: "B2B Sales · AI",
        ariaLabelEs: "Niveleads — lead scoring con IA, setup en 24h. Desde $99/mes",
        ariaLabelEn: "Niveleads — AI lead scoring, 24h setup. From $99/month",
      },
      {
        labelEs: "Hirely",
        labelEn: "Hirely",
        url: "/productos/hirely",
        descriptionEs: "ATS con Claude AI, voz, firma digital",
        descriptionEn: "ATS with Claude AI, voice, digital signature",
        icon: "hirely",
        badgeEs: "RRHH · IA",
        badgeEn: "HR · AI",
        ariaLabelEs: "Hirely — ATS con Claude AI, voz y firma digital. Demo gratis",
        ariaLabelEn: "Hirely — ATS with Claude AI, voice and digital signature. Free demo",
      },
    ],
  },

  {
    titleEs: "Industrias",
    titleEn: "Industries",
    triggerUrl: "/industrias/fintech",
    kind: "grid",
    accentColor: "#F59E0B",
    headerCaptionEs: "Industrias que atendemos",
    headerCaptionEn: "Industries we serve",
    footerLinkEs: "Ver todas las industrias →",
    footerLinkEn: "See all industries →",
    footerLinkUrl: "/industrias/fintech",
    footerLinkColor: "#F59E0B",
    items: [
      {
        labelEs: "Fintech",
        labelEn: "Fintech",
        url: "/industrias/fintech",
        descriptionEs: "Banca digital, pagos y regulación tech",
        descriptionEn: "Digital banking, payments and regtech",
        icon: "trending-up",
        ariaLabelEs: "Fintech — soluciones de IA, Cloud y talento tech para banca digital y pagos",
        ariaLabelEn: "Fintech — AI, Cloud and tech talent for digital banking and payments",
      },
      {
        labelEs: "Medios y Entretenimiento",
        labelEn: "Media & Entertainment",
        url: "/industrias/medios-entretenimiento",
        descriptionEs: "Plataformas de contenido y streaming digital",
        descriptionEn: "Content and digital streaming platforms",
        icon: "play-circle",
        ariaLabelEs:
          "Medios y Entretenimiento — tecnología para plataformas digitales, streaming y contenido",
        ariaLabelEn:
          "Media & Entertainment — technology for digital platforms, streaming and content",
      },
      {
        labelEs: "Salud",
        labelEn: "Healthcare",
        url: "/industrias/salud",
        descriptionEs: "HealthTech con cumplimiento regulatorio",
        descriptionEn: "HealthTech with regulatory compliance",
        icon: "heart-pulse",
        ariaLabelEs:
          "Salud — soluciones tech para healthtech con cumplimiento regulatorio HIPAA y locales",
        ariaLabelEn:
          "Healthcare — tech solutions for healthtech with HIPAA and local regulatory compliance",
      },
      {
        labelEs: "Retail y E-commerce",
        labelEn: "Retail & E-commerce",
        url: "/industrias/retail-ecommerce",
        descriptionEs: "Omnicanalidad y última milla digital",
        descriptionEn: "Omnichannel and digital last mile",
        icon: "shopping-bag",
        ariaLabelEs:
          "Retail y E-commerce — tecnología para omnicanalidad, experiencia de compra y logística",
        ariaLabelEn:
          "Retail & E-commerce — technology for omnichannel, shopping experience and logistics",
      },
      {
        labelEs: "Logística",
        labelEn: "Logistics",
        url: "/industrias/logistica",
        descriptionEs: "Supply chain y trazabilidad en tiempo real",
        descriptionEn: "Supply chain and real-time traceability",
        icon: "truck",
        ariaLabelEs:
          "Logística — tecnología para supply chain, trazabilidad y automatización de operaciones",
        ariaLabelEn:
          "Logistics — technology for supply chain, traceability and operations automation",
      },
      {
        labelEs: "Manufactura",
        labelEn: "Manufacturing",
        url: "/industrias/manufactura",
        descriptionEs: "Industria 4.0 y automatización de planta",
        descriptionEn: "Industry 4.0 and plant automation",
        icon: "factory",
        ariaLabelEs:
          "Manufactura — soluciones de Industria 4.0, automatización de procesos y digitalización de planta",
        ariaLabelEn:
          "Manufacturing — Industry 4.0 solutions, process automation and plant digitalization",
      },
    ],
  },

  {
    titleEs: "Nosotros",
    titleEn: "About",
    triggerUrl: "/nosotros",
    kind: "nosotros",
    accentColor: "#6366F1",
    headerCaptionEs: "La empresa detrás de los proyectos",
    headerCaptionEn: "The company behind the projects",
    credentials: {
      metricValue1: "13",
      metricLabelEs1: "años de experiencia",
      metricLabelEn1: "years of experience",
      metricValue2: "7+",
      metricLabelEs2: "países con proyectos activos",
      metricLabelEn2: "countries with active projects",
      awardName: "Great Place to Work",
      awardCaptionEs: "Colombia · 2022",
      awardCaptionEn: "Colombia · 2022",
      footerCaptionEs: "Empresa colombiana · Sede en Miami",
      footerCaptionEn: "Colombian company · Miami office",
      ctaTextEs: "Conoce nuestra historia →",
      ctaTextEn: "Our story →",
      ctaUrl: "/nosotros",
    },
    items: [
      {
        labelEs: "Historia",
        labelEn: "Our story",
        url: "/nosotros/historia",
        descriptionEs: "13 años construyendo tecnología en LATAM",
        descriptionEn: "13 years building technology across LATAM",
        icon: "clock",
        ariaLabelEs: "Historia de Nivelics — fundada en 2012, proyectos en 7 países",
        ariaLabelEn: "About Nivelics — founded in 2012, projects in 7 countries",
      },
      {
        labelEs: "Equipo",
        labelEn: "Team",
        url: "/nosotros/equipo",
        descriptionEs: "CEO, CTO y el equipo detrás de los proyectos",
        descriptionEn: "CEO, CTO and the team behind the projects",
        icon: "users",
        ariaLabelEs: "Equipo directivo de Nivelics — Camilo Villanueva, Jonathan Olarte y líderes",
        ariaLabelEn: "Nivelics leadership team — Camilo Villanueva, Jonathan Olarte and leaders",
      },
      {
        labelEs: "Metodología",
        labelEn: "Methodology",
        url: "/nosotros/metodologia",
        descriptionEs: "Cómo trabajamos: sprints, entregas y gobierno",
        descriptionEn: "How we work: sprints, deliveries and governance",
        icon: "git-branch",
        ariaLabelEs: "Metodología de trabajo de Nivelics — agile, sprints, delivery manager",
        ariaLabelEn: "Nivelics work methodology — agile, sprints, delivery manager",
      },
      {
        labelEs: "Certificaciones",
        labelEn: "Certifications",
        url: "/nosotros/certificaciones",
        descriptionEs: "Great Place to Work 2022 · ANDI · AWS Partner",
        descriptionEn: "Great Place to Work 2022 · ANDI · AWS Partner",
        icon: "award",
        ariaLabelEs: "Certificaciones de Nivelics — Great Place to Work Colombia 2022, ANDI, AWS",
        ariaLabelEn: "Nivelics certifications — Great Place to Work Colombia 2022, ANDI, AWS",
      },
    ],
  },

  {
    titleEs: "Casos de Éxito",
    titleEn: "Case Studies",
    triggerUrl: "/casos-de-exito",
    kind: "simple",
    items: [],
  },

  {
    titleEs: "Blog",
    titleEn: "Blog",
    triggerUrl: "/blog",
    kind: "simple",
    items: [],
  },
];

const footer: FooterData = {
  brandTaglineEs:
    "Transformación digital B2B. IA aplicada, Cloud con gobierno y Staff Augmentation premium.",
  brandTaglineEn:
    "B2B digital transformation. Applied AI, Cloud with real governance, and Premium Staff Augmentation.",
  contactColumnTitleEs: "Contacto",
  contactColumnTitleEn: "Contact",
  contactEmail: "contacto@nivelics.com",
  contactWhatsappLabelEs: "WhatsApp",
  contactWhatsappLabelEn: "WhatsApp",
  contactWhatsappUrl: "https://wa.me/573103926621",
  contactSupportLabelEs: "Soporte",
  contactSupportLabelEn: "Support",
  contactSupportUrl: "/soporte",
  socialLinkedin: "https://www.linkedin.com/company/nivelics",
  socialInstagram: "https://www.instagram.com/nivelics",
  copyrightEs: "Todos los derechos reservados.",
  copyrightEn: "All rights reserved.",
  legalLinks: [
    {
      labelEs: "Política de Privacidad",
      labelEn: "Privacy Policy",
      url: "/privacidad",
    },
    {
      labelEs: "Soporte",
      labelEn: "Support",
      url: "/soporte",
    },
  ],
  columns: [
    {
      titleEs: "Servicios",
      titleEn: "Services",
      links: [
        {
          labelEs: "Inteligencia Artificial",
          labelEn: "Artificial Intelligence",
          url: "/servicios/inteligencia-artificial",
        },
        { labelEs: "Cloud", labelEn: "Cloud", url: "/servicios/cloud" },
        {
          labelEs: "Staff Augmentation",
          labelEn: "Staff Augmentation",
          url: "/servicios/staff-augmentation",
        },
        {
          labelEs: "Desarrollo Digital",
          labelEn: "Digital Development",
          url: "/servicios/desarrollo-digital",
        },
      ],
    },
    {
      titleEs: "Productos",
      titleEn: "Products",
      links: [
        { labelEs: "Todos los productos", labelEn: "All products", url: "/productos" },
        { labelEs: "PAYWL", labelEn: "PAYWL", url: "/productos/paywl" },
        { labelEs: "Niveleads", labelEn: "Niveleads", url: "/productos/niveleads" },
        { labelEs: "Hirely", labelEn: "Hirely", url: "/productos/hirely" },
      ],
    },
    {
      titleEs: "Industrias",
      titleEn: "Industries",
      links: [
        { labelEs: "Fintech", labelEn: "Fintech", url: "/industrias/fintech" },
        {
          labelEs: "Medios y Entretenimiento",
          labelEn: "Media & Entertainment",
          url: "/industrias/medios-entretenimiento",
        },
        { labelEs: "Salud", labelEn: "Healthcare", url: "/industrias/salud" },
        {
          labelEs: "Retail y E-commerce",
          labelEn: "Retail & E-commerce",
          url: "/industrias/retail-ecommerce",
        },
        { labelEs: "Logística", labelEn: "Logistics", url: "/industrias/logistica" },
        { labelEs: "Manufactura", labelEn: "Manufacturing", url: "/industrias/manufactura" },
      ],
    },
    {
      titleEs: "Empresa",
      titleEn: "Company",
      links: [
        { labelEs: "Nosotros", labelEn: "About", url: "/nosotros" },
        { labelEs: "Casos de Éxito", labelEn: "Case Studies", url: "/casos-de-exito" },
        { labelEs: "Blog", labelEn: "Blog", url: "/blog" },
        {
          labelEs: "Trabaja con nosotros",
          labelEn: "Careers",
          url: "/trabaja-con-nosotros",
        },
      ],
    },
  ],
};

async function main() {
  const existing = await db.select().from(navConfig).where(eq(navConfig.id, "main")).limit(1);
  if (existing.length === 0) {
    await db.insert(navConfig).values({
      id: "main",
      megaMenu,
      footer,
      updatedAt: new Date(),
    });
    console.log(
      "Inserted navConfig 'main' with",
      megaMenu.length,
      "mega-menu sections and",
      footer.columns.length,
      "footer columns.",
    );
  } else {
    await db
      .update(navConfig)
      .set({ megaMenu, footer, updatedAt: new Date() })
      .where(eq(navConfig.id, "main"));
    console.log(
      "Updated navConfig 'main' with",
      megaMenu.length,
      "mega-menu sections and",
      footer.columns.length,
      "footer columns.",
    );
  }
  process.exit(0);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
