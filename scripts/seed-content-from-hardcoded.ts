/**
 * Seed script: migrates ALL hardcoded content from page.tsx files → CMS database
 *
 * Usage:
 *   npx tsx scripts/seed-content-from-hardcoded.ts
 *   npx tsx scripts/seed-content-from-hardcoded.ts --dry-run
 *
 * This script:
 * 1. Reads all hardcoded content defined inline in page.tsx files
 * 2. Maps each string to its corresponding DB table and field
 * 3. Inserts into the DB with translation_status_en = 'pending' (or 'complete' where EN exists)
 * 4. Does NOT overwrite existing records (safe to re-run)
 *
 * Tables seeded:
 *   - home_content
 *   - servicios (hub + sub)
 *   - industrias
 *   - casos_exito
 *   - team_members
 *   - historia_items
 *   - certificaciones
 *   - pages_general (contact, privacy, support, careers)
 *   - site_config
 *   - nav_config
 *   - blog_posts + blog_categories
 */

import { drizzle } from "drizzle-orm/node-postgres";
import { eq } from "drizzle-orm";
import * as schema from "../lib/db/schema/admin";

// ─── DB Connection ──────────────────────────────────────
const DATABASE_URL = process.env.DATABASE_URL;
if (!DATABASE_URL) {
  console.error("DATABASE_URL is required. Set it in your environment.");
  process.exit(1);
}

const db = drizzle(DATABASE_URL, { schema });
const DRY_RUN = process.argv.includes("--dry-run");

const report = {
  inserted: [] as string[],
  skipped: [] as string[],
  errors: [] as string[],
};

function log(msg: string) {
  console.log(`${DRY_RUN ? "[DRY RUN] " : ""}${msg}`);
}

// ─── HELPERS ────────────────────────────────────────────

async function upsertHomeContent() {
  log("Seeding home_content...");
  const existing = await db
    .select()
    .from(schema.homeContent)
    .where(eq(schema.homeContent.id, "main"))
    .limit(1);
  if (existing.length > 0) {
    report.skipped.push("home_content (already exists)");
    return;
  }

  const data = {
    id: "main" as const,
    heroBadgeEs: "IA \u00b7 Cloud \u00b7 Staffing Premium",
    heroBadgeEn: "AI \u00b7 Cloud \u00b7 Premium Staffing",
    heroTitleEs: "Transforma m\u00e1s r\u00e1pido.",
    heroTitleEn: "Transform faster.",
    heroSubtitleEs:
      "Empresa colombiana de transformaci\u00f3n digital B2B. IA aplicada, Cloud (AWS, GCP, Azure) y Staff Augmentation premium para empresas en LATAM y USA. Desde 2012.",
    heroSubtitleEn:
      "Colombian B2B digital transformation company. Applied AI, Cloud (AWS, GCP, Azure) and premium Staff Augmentation for companies in LATAM and USA. Since 2012.",
    heroCtaPrimaryEs: "Agenda tu diagn\u00f3stico",
    heroCtaPrimaryEn: "Book your assessment",
    heroCtaSecondaryEs: "Hablar por WhatsApp",
    heroCtaSecondaryEn: "Chat on WhatsApp",
    metrics: [
      {
        value: "13+",
        unit: "",
        labelEs: "A\u00f1os \u2014 Fundados en 2012",
        labelEn: "Years \u2014 Founded in 2012",
      },
      {
        value: "7+",
        unit: "",
        labelEs: "Pa\u00edses \u2014 Colombia, USA, M\u00e9xico y m\u00e1s",
        labelEn: "Countries \u2014 Colombia, USA, Mexico and more",
      },
      {
        value: "40%",
        unit: "",
        labelEs: "Ahorro vs. contratar en USA o Europa",
        labelEn: "Savings vs. hiring in USA or Europe",
      },
      {
        value: "50+",
        unit: "",
        labelEs: "Proyectos entregados en LATAM y USA",
        labelEn: "Projects delivered in LATAM and USA",
      },
    ],
    servicesSectionTitleEs: "IA + Cloud + Staffing \u2014 los tres pilares integrados",
    servicesSectionTitleEn: "AI + Cloud + Staffing \u2014 the three integrated pillars",
    casesSectionTitleEs: "Resultados reales en 7 pa\u00edses",
    casesSectionTitleEn: "Real results across 7 countries",
    faqs: [
      {
        questionEs: "\u00bfQu\u00e9 es Nivelics y qu\u00e9 servicios ofrece?",
        questionEn: "What is Nivelics and what services do you offer?",
        answerEs:
          "Nivelics es una empresa colombiana de transformaci\u00f3n digital fundada en 2012 con sede en Bogot\u00e1 y Miami. Ofrecemos tres l\u00edneas de servicio integradas: IA aplicada (agentes, automatizaci\u00f3n, RAG), Cloud con gobierno real (AWS, GCP, Azure, FinOps) y Staff Augmentation premium (talento tech biling\u00fce integrado en 5 d\u00edas h\u00e1biles). Operamos en 7+ pa\u00edses de LATAM y USA.",
        answerEn:
          "Nivelics is a Colombian digital transformation company founded in 2012, headquartered in Bogot\u00e1 and Miami. We offer three integrated service lines: Applied AI (agents, automation, RAG), Cloud with real governance (AWS, GCP, Azure, FinOps) and premium Staff Augmentation (bilingual tech talent integrated in 5 business days). We operate in 7+ countries across LATAM and USA.",
      },
      {
        questionEs: "\u00bfEn cu\u00e1nto tiempo puede Nivelics integrar un perfil tech?",
        questionEn: "How quickly can Nivelics integrate a tech profile?",
        answerEs:
          "Presentamos los primeros candidatos en m\u00e1ximo 5 d\u00edas h\u00e1biles. La integraci\u00f3n completa al equipo del cliente tarda entre 6 y 10 d\u00edas h\u00e1biles. Ofrecemos garant\u00eda de reemplazo sin costo en menos de 10 d\u00edas si el perfil no cumple las expectativas.",
        answerEn:
          "We present the first candidates within 5 business days. Full integration into the client\u2019s team takes 6 to 10 business days. We offer a free replacement guarantee in under 10 days if the profile doesn\u2019t meet expectations.",
      },
      {
        questionEs: "\u00bfCu\u00e1nto cuesta trabajar con Nivelics?",
        questionEn: "How much does it cost to work with Nivelics?",
        answerEs:
          "Los precios var\u00edan seg\u00fan el servicio. Staff Augmentation tiene un modelo mensual por recurso, con un ahorro promedio del 40% vs. contratar en USA o Europa. Cloud y FinOps tienen modelos de fee fijo m\u00e1s success fee sobre el ahorro logrado. IA aplicada var\u00eda seg\u00fan la complejidad del agente. El diagn\u00f3stico inicial siempre es gratuito y sin compromiso.",
        answerEn:
          "Pricing varies by service. Staff Augmentation uses a monthly per-resource model, with average savings of 40% vs. hiring in USA or Europe. Cloud and FinOps use a fixed fee plus success fee on actual savings. Applied AI varies based on agent complexity. The initial assessment is always free with no commitment.",
      },
      {
        questionEs: "\u00bfEn qu\u00e9 pa\u00edses opera Nivelics?",
        questionEn: "In which countries does Nivelics operate?",
        answerEs:
          "Nivelics tiene sede principal en Bogot\u00e1, Colombia y oficina en Miami, Florida (Nivelics LLC). Hemos entregado proyectos en Colombia, USA, M\u00e9xico, El Salvador, Panam\u00e1, Ecuador, Per\u00fa y Argentina.",
        answerEn:
          "Nivelics is headquartered in Bogot\u00e1, Colombia with an office in Miami, Florida (Nivelics LLC). We have delivered projects in Colombia, USA, Mexico, El Salvador, Panama, Ecuador, Peru and Argentina.",
      },
      {
        questionEs: "\u00bfQu\u00e9 diferencia a Nivelics de otras consultoras tech?",
        questionEn: "What makes Nivelics different from other tech consultancies?",
        answerEs:
          "Tres cosas: primero, integramos los tres pilares (IA, Cloud y Staffing) en un solo aliado. Segundo, velocidad real: 5 d\u00edas para candidatos, 8 semanas para un agente IA en producci\u00f3n. Tercero, resultados en contrato: nuestros SLAs y m\u00e9tricas de entrega est\u00e1n escritos, no prometidos en presentaciones.",
        answerEn:
          "Three things: first, we integrate all three pillars (AI, Cloud and Staffing) in one partner. Second, real speed: 5 days for candidates, 8 weeks for an AI agent in production. Third, results in the contract: our SLAs and delivery metrics are written down, not just promised in presentations.",
      },
    ],
    finalCtaTitleEs: "\u00bfListo para transformar m\u00e1s r\u00e1pido?",
    finalCtaTitleEn: "Ready to transform faster?",
    finalCtaCopyEs:
      "Diagn\u00f3stico gratuito en 30 minutos. Sin RFP, sin presentaciones largas. Solo cu\u00e9ntanos tu reto.",
    finalCtaCopyEn:
      "Free 30-minute assessment. No RFP, no lengthy presentations. Just tell us your challenge.",
  };

  if (!DRY_RUN) {
    await db.insert(schema.homeContent).values(data);
  }
  report.inserted.push("home_content");
}

// ─── SITE CONFIG ────────────────────────────────────────

async function upsertSiteConfig() {
  log("Seeding site_config...");
  const existing = await db
    .select()
    .from(schema.siteConfig)
    .where(eq(schema.siteConfig.id, "main"))
    .limit(1);
  if (existing.length > 0) {
    report.skipped.push("site_config (already exists)");
    return;
  }

  const data = {
    id: "main" as const,
    siteNameEs: "Nivelics",
    siteNameEn: "Nivelics",
    taglineEs: "Transformaci\u00f3n digital B2B. IA, Cloud & Staffing Premium.",
    taglineEn: "B2B digital transformation. AI, Cloud & Premium Staffing.",
    phoneWhatsapp: "+573103926621",
    emailContact: "contacto@nivelics.com",
    addressBogota: "Bogot\u00e1, Colombia",
    addressMiami: "Miami, FL",
  };

  if (!DRY_RUN) {
    await db.insert(schema.siteConfig).values(data);
  }
  report.inserted.push("site_config");
}

// ─── SERVICIOS ──────────────────────────────────────────

async function seedServicios() {
  log("Seeding servicios...");

  const services = [
    // ── Hub: Inteligencia Artificial ──
    {
      slugEs: "inteligencia-artificial",
      slugEn: "artificial-intelligence",
      serviceType: "hub" as const,
      accentColor: "ia" as const,
      icon: "brain",
      titleEs: "Agentes e IA aplicada",
      titleEn: "AI Agents & Applied AI",
      subtitleEs:
        "No chatbots. Agentes aut\u00f3nomos integrados con tus sistemas que trabajan 24/7 y se miden con resultados reales.",
      subtitleEn:
        "Not chatbots. Autonomous agents integrated with your systems that work 24/7, measured by real results.",
      descriptionEs:
        "Implementamos soluciones de IA generativa, MLOps y anal\u00edtica avanzada para automatizar procesos y generar insights accionables.",
      descriptionEn:
        "We implement generative AI, MLOps and advanced analytics solutions to automate processes and generate actionable insights.",
      benefits: [
        {
          icon: "brain",
          titleEs: "50% reducci\u00f3n costos operativos",
          titleEn: "50% reduction in operating costs",
          copyEs: "Automatizaci\u00f3n inteligente de procesos repetitivos",
          copyEn: "Intelligent automation of repetitive processes",
        },
        {
          icon: "zap",
          titleEs: "Primer agente en 6-8 semanas",
          titleEn: "First agent in 6-8 weeks",
          copyEs: "De concepto a producci\u00f3n r\u00e1pidamente",
          copyEn: "From concept to production quickly",
        },
        {
          icon: "link",
          titleEs: "Integrado con tus sistemas",
          titleEn: "Integrated with your systems",
          copyEs: "CRM, ERP y flujos existentes",
          copyEn: "CRM, ERP and existing workflows",
        },
      ],
      metrics: [
        {
          value: "50%",
          unit: "",
          labelEs: "Reducci\u00f3n costos operativos",
          labelEn: "Operating cost reduction",
        },
        {
          value: "6-8",
          unit: "sem",
          labelEs: "Semanas al primer agente",
          labelEn: "Weeks to first agent",
        },
      ],
      ctaPrimaryTextEs: "Ver servicios de IA",
      ctaPrimaryTextEn: "View AI services",
      ctaPrimaryUrl: "/servicios/inteligencia-artificial",
      seoTitleEs: "IA Aplicada a Negocios | Agentes, Automatizaci\u00f3n y RAG",
      seoTitleEn: "Applied AI for Business | Agents, Automation & RAG | Nivelics",
      seoDescriptionEs:
        "Soluciones de IA generativa, MLOps y anal\u00edtica avanzada para automatizar procesos y generar insights accionables.",
      seoDescriptionEn:
        "Generative AI, MLOps and advanced analytics solutions to automate processes and generate actionable insights.",
      sortOrder: 1,
      status: "published" as const,
      translationStatusEn: "pending" as const,
    },
    // ── Hub: Cloud ──
    {
      slugEs: "cloud",
      slugEn: "cloud",
      serviceType: "hub" as const,
      accentColor: "cloud" as const,
      icon: "cloud",
      titleEs: "Cloud con gobierno y FinOps",
      titleEn: "Cloud with Governance & FinOps",
      subtitleEs: "Migramos y operamos en AWS, GCP y Azure. FinOps desde el d\u00eda uno.",
      subtitleEn: "We migrate and operate on AWS, GCP and Azure. FinOps from day one.",
      descriptionEs:
        "Arquitectura multi-cloud, migraci\u00f3n, DevOps y optimizaci\u00f3n de costos con enfoque FinOps.",
      descriptionEn:
        "Multi-cloud architecture, migration, DevOps and cost optimization with a FinOps approach.",
      metrics: [
        {
          value: "40%",
          unit: "",
          labelEs: "Ahorro promedio en gasto cloud",
          labelEn: "Average cloud spend savings",
        },
      ],
      ctaPrimaryTextEs: "Ver servicios Cloud",
      ctaPrimaryTextEn: "View Cloud services",
      ctaPrimaryUrl: "/servicios/cloud",
      seoTitleEs: "Cloud con Gobierno Real | AWS, GCP, Azure y FinOps",
      seoTitleEn: "Cloud with Real Governance | AWS, GCP, Azure & FinOps | Nivelics",
      seoDescriptionEs:
        "AWS, GCP, Azure con gobierno y FinOps real. Reducci\u00f3n de costos hasta 40%.",
      seoDescriptionEn:
        "AWS, GCP, Azure with real governance and FinOps. Cloud cost reduction up to 40%.",
      sortOrder: 2,
      status: "published" as const,
      translationStatusEn: "pending" as const,
    },
    // ── Hub: Staff Augmentation ──
    {
      slugEs: "staff-augmentation",
      slugEn: "staff-augmentation",
      serviceType: "hub" as const,
      accentColor: "staffing" as const,
      icon: "users",
      titleEs: "Talento tech en 5 d\u00edas",
      titleEn: "Tech talent in 5 days",
      subtitleEs:
        "Perfiles biling\u00fces validados, integrados en tu equipo sin riesgos laborales.",
      subtitleEn:
        "Validated bilingual profiles, integrated into your team with zero employment risk.",
      descriptionEs:
        "Equipos de ingenier\u00eda on-demand con talento senior verificado. Escal\u00e1 tu capacidad sin comprometer calidad.",
      descriptionEn:
        "On-demand engineering teams with verified senior talent. Scale your capacity without compromising quality.",
      benefits: [
        {
          icon: "clock",
          titleEs: "Candidatos en 5 d\u00edas h\u00e1biles",
          titleEn: "Candidates in 5 business days",
          copyEs: "Presentamos perfiles validados r\u00e1pidamente",
          copyEn: "We present validated profiles quickly",
        },
        {
          icon: "dollar-sign",
          titleEs: "40% ahorro vs. USA",
          titleEn: "40% savings vs. USA",
          copyEs: "Talento competitivo desde Colombia (GMT-5)",
          copyEn: "Competitive talent from Colombia (GMT-5)",
        },
        {
          icon: "shield",
          titleEs: "Reemplazo en 10 d\u00edas sin costo",
          titleEn: "Replacement in 10 days at no cost",
          copyEs: "Garant\u00eda de reemplazo en contrato",
          copyEn: "Replacement guarantee in contract",
        },
        {
          icon: "lock",
          titleEs: "100% propiedad intelectual del cliente",
          titleEn: "100% client IP ownership",
          copyEs: "Todo el c\u00f3digo y entregables son tuyos",
          copyEn: "All code and deliverables are yours",
        },
      ],
      processSteps: [
        {
          number: 1,
          titleEs: "Brief de perfil",
          titleEn: "Profile brief",
          descEs: "Nos cuentas qu\u00e9 necesitas: stack, nivel, dedicaci\u00f3n, zona horaria.",
          descEn: "Tell us what you need: stack, level, dedication, timezone.",
          duration: "30 min",
        },
        {
          number: 2,
          titleEs: "Selecci\u00f3n y validaci\u00f3n",
          titleEn: "Selection & validation",
          descEs: "Filtramos, entrevistamos t\u00e9cnicamente y validamos el match cultural.",
          descEn: "We filter, technically interview and validate cultural fit.",
          duration: "3-4 d\u00edas",
        },
        {
          number: 3,
          titleEs: "Entrevista con el cliente",
          titleEn: "Client interview",
          descEs: "Presentamos los perfiles y coordinas tu propio proceso de entrevista.",
          descEn: "We present the profiles and you run your own interview process.",
          duration: "D\u00eda 5",
        },
        {
          number: 4,
          titleEs: "Onboarding e integraci\u00f3n",
          titleEn: "Onboarding & integration",
          descEs: "Coordinamos el acceso, herramientas y primeros d\u00edas con tu equipo.",
          descEn: "We coordinate access, tools and first days with your team.",
          duration: "D\u00eda 6-10",
        },
        {
          number: 5,
          titleEs: "Seguimiento continuo",
          titleEn: "Ongoing follow-up",
          descEs: "Delivery Manager asignado para asegurar que todo funcione bien.",
          descEn: "Assigned Delivery Manager to ensure everything works well.",
          duration: "Mensual",
        },
      ],
      faqs: [
        {
          questionEs: "\u00bfCu\u00e1l es el modelo de contrataci\u00f3n?",
          questionEn: "What is the engagement model?",
          answerEs:
            "Mensual por recurso asignado. El m\u00ednimo recomendado es 3 meses para que el perfil genere valor real, pero ofrecemos flexibilidad mensual con preaviso de 5 d\u00edas h\u00e1biles. Sin costos ocultos, sin prestaciones, sin riesgos laborales.",
          answerEn:
            "Monthly per assigned resource. The recommended minimum is 3 months for the profile to generate real value, but we offer monthly flexibility with 5 business days notice. No hidden costs, no benefits, no employment risks.",
        },
        {
          questionEs: "\u00bfLos perfiles trabajan en nuestra zona horaria?",
          questionEn: "Do profiles work in our timezone?",
          answerEs:
            "S\u00ed. Nuestros ingenieros en Colombia tienen overlap total con EST (New York) y PST (California), y trabajan en los horarios que tu equipo necesite.",
          answerEn:
            "Yes. Our engineers in Colombia have full overlap with EST (New York) and PST (California), and work in whatever hours your team needs.",
        },
        {
          questionEs: "\u00bfC\u00f3mo garantizan la calidad t\u00e9cnica?",
          questionEn: "How do you guarantee technical quality?",
          answerEs:
            "Todo candidato pasa por: prueba t\u00e9cnica en el stack espec\u00edfico, entrevista con nuestro CTO o lead t\u00e9cnico, validaci\u00f3n de ingl\u00e9s (si aplica) y verificaci\u00f3n de referencias.",
          answerEn:
            "Every candidate goes through: technical test on the specific stack, interview with our CTO or tech lead, English validation (if applicable) and reference checks.",
        },
        {
          questionEs: "\u00bfQu\u00e9 pasa si el perfil no funciona?",
          questionEn: "What happens if the profile doesn\u2019t work out?",
          answerEs:
            "Lo reemplazamos en menos de 10 d\u00edas h\u00e1biles sin costo adicional. Sin preguntas, sin burocracia. Esta garant\u00eda est\u00e1 en el contrato.",
          answerEn:
            "We replace them in under 10 business days at no extra cost. No questions, no bureaucracy. This guarantee is in the contract.",
        },
        {
          questionEs: "\u00bfPueden escalar varios perfiles a la vez?",
          questionEn: "Can you scale multiple profiles at once?",
          answerEs:
            "S\u00ed. Hemos escalado equipos de hasta 15 personas simult\u00e1neamente para clientes con necesidades urgentes.",
          answerEn:
            "Yes. We\u2019ve scaled teams of up to 15 people simultaneously for clients with urgent needs.",
        },
      ],
      metrics: [
        {
          value: "5",
          unit: "d\u00edas",
          labelEs: "D\u00edas h\u00e1biles para presentar candidato",
          labelEn: "Business days to present candidate",
        },
        {
          value: "40%",
          unit: "",
          labelEs: "Ahorro promedio vs. USA",
          labelEn: "Average savings vs. USA",
        },
        {
          value: "10",
          unit: "d\u00edas",
          labelEs: "D\u00edas de garant\u00eda de reemplazo",
          labelEn: "Days replacement guarantee",
        },
        {
          value: "100%",
          unit: "",
          labelEs: "Propiedad intelectual del cliente",
          labelEn: "Client IP ownership",
        },
      ],
      ctaPrimaryTextEs: "Ver perfiles disponibles",
      ctaPrimaryTextEn: "View available profiles",
      ctaPrimaryUrl: "/servicios/staff-augmentation",
      seoTitleEs: "Staff Augmentation Premium Colombia | Talento Tech LATAM",
      seoTitleEn: "Premium Staff Augmentation Colombia | LATAM Tech Talent | Nivelics",
      seoDescriptionEs:
        "Equipos de ingenier\u00eda on-demand con talento senior verificado. Integraci\u00f3n en 6 d\u00edas h\u00e1biles. Ahorro hasta 40% vs. USA/Europa.",
      seoDescriptionEn:
        "On-demand engineering teams with verified senior talent. Integration in 6 business days. Up to 40% savings vs. USA/Europe.",
      sortOrder: 3,
      status: "published" as const,
      translationStatusEn: "pending" as const,
    },
    // ── Hub: Desarrollo Digital ──
    {
      slugEs: "desarrollo-digital",
      slugEn: "digital-development",
      serviceType: "hub" as const,
      accentColor: "dev" as const,
      icon: "code-2",
      titleEs: "Del concepto a producci\u00f3n",
      titleEn: "From concept to production",
      subtitleEs: "Apps, plataformas y e-commerce con arquitectura moderna y demos quincenales.",
      subtitleEn: "Apps, platforms and e-commerce with modern architecture and biweekly demos.",
      descriptionEs:
        "Desarrollo de productos digitales, aplicaciones web y m\u00f3viles con metodolog\u00edas \u00e1giles y arquitectura moderna.",
      descriptionEn:
        "Digital product development, web and mobile applications with agile methodologies and modern architecture.",
      ctaPrimaryTextEs: "Ver Desarrollo Digital",
      ctaPrimaryTextEn: "View Digital Development",
      ctaPrimaryUrl: "/servicios/desarrollo-digital",
      seoTitleEs: "Desarrollo Digital | Apps, Plataformas Web y E-commerce",
      seoTitleEn: "Digital Development | Apps, Web Platforms & E-commerce | Nivelics",
      seoDescriptionEs:
        "Del concepto a producci\u00f3n. Sprints medibles. 13 a\u00f1os de proyectos en LATAM y USA.",
      seoDescriptionEn:
        "From concept to production. Measurable sprints. 13 years of projects in LATAM and USA.",
      sortOrder: 4,
      status: "published" as const,
      translationStatusEn: "pending" as const,
    },
    // ── Sub: FinOps ──
    {
      slugEs: "finops",
      slugEn: "finops",
      parentId: undefined as string | undefined, // set after cloud hub is inserted
      serviceType: "sub" as const,
      accentColor: "finops" as const,
      icon: "dollar-sign",
      titleEs: "Optimiza tu inversi\u00f3n cloud hasta un 40%",
      titleEn: "Optimize your cloud investment by up to 40%",
      subtitleEs:
        "Implementamos pr\u00e1cticas FinOps para que cada d\u00f3lar en la nube genere valor medible para tu negocio.",
      subtitleEn:
        "We implement FinOps practices so every dollar in the cloud generates measurable value for your business.",
      descriptionEs:
        "Optimizaci\u00f3n y gobernanza financiera de la nube. Reducimos costos hasta un 40% sin perder rendimiento.",
      descriptionEn:
        "Cloud financial governance and optimization. We reduce costs up to 40% without losing performance.",
      benefits: [
        {
          icon: "eye",
          titleEs: "Visibilidad",
          titleEn: "Visibility",
          copyEs: "Dashboards en tiempo real de consumo por equipo, servicio y ambiente.",
          copyEn: "Real-time dashboards of consumption by team, service and environment.",
        },
        {
          icon: "trending-down",
          titleEs: "Optimizaci\u00f3n",
          titleEn: "Optimization",
          copyEs:
            "Rightsizing, instancias reservadas, spot fleet y eliminaci\u00f3n de recursos hu\u00e9rfanos.",
          copyEn: "Rightsizing, reserved instances, spot fleet and orphaned resource elimination.",
        },
        {
          icon: "pie-chart",
          titleEs: "Asignaci\u00f3n de costos",
          titleEn: "Cost Allocation",
          copyEs: "Estrategia de tagging, showback/chargeback y unit economics por producto.",
          copyEn: "Tagging strategy, showback/chargeback and unit economics per product.",
        },
        {
          icon: "bar-chart",
          titleEs: "Forecasting",
          titleEn: "Forecasting",
          copyEs: "Proyecci\u00f3n de costos con modelos predictivos y alertas de anomal\u00edas.",
          copyEn: "Cost projection with predictive models and anomaly alerts.",
        },
        {
          icon: "settings",
          titleEs: "Gobernanza",
          titleEn: "Governance",
          copyEs: "Pol\u00edticas automatizadas, presupuestos y workflows de aprobaci\u00f3n.",
          copyEn: "Automated policies, budgets and approval workflows.",
        },
        {
          icon: "dollar-sign",
          titleEs: "Cultura FinOps",
          titleEn: "FinOps Culture",
          copyEs: "Capacitaci\u00f3n de equipos, ceremonias FinOps y m\u00e9tricas de eficiencia.",
          copyEn: "Team training, FinOps ceremonies and efficiency metrics.",
        },
      ],
      processSteps: [
        {
          number: 1,
          titleEs: "Discovery",
          titleEn: "Discovery",
          descEs:
            "Mapeo del gasto actual, identificaci\u00f3n de waste, benchmark contra mejores pr\u00e1cticas.",
          descEn: "Current spend mapping, waste identification, benchmark against best practices.",
          duration: "Semana 1-2",
        },
        {
          number: 2,
          titleEs: "Quick Wins",
          titleEn: "Quick Wins",
          descEs:
            "Primeros ahorros implementados: rightsizing, instancias reservadas, eliminaci\u00f3n de recursos hu\u00e9rfanos.",
          descEn:
            "First savings implemented: rightsizing, reserved instances, orphaned resource elimination.",
          duration: "Semana 3-4",
        },
        {
          number: 3,
          titleEs: "Gobernanza",
          titleEn: "Governance",
          descEs:
            "Pol\u00edticas automatizadas, alertas de anomal\u00edas, dashboards de gobernanza y handoff al equipo interno.",
          descEn:
            "Automated policies, anomaly alerts, governance dashboards and handoff to internal team.",
          duration: "Semana 5-6",
        },
      ],
      metrics: [
        {
          value: "30-40%",
          unit: "",
          labelEs: "Reducci\u00f3n factura cloud",
          labelEn: "Cloud bill reduction",
        },
        {
          value: "2-3",
          unit: "sem",
          labelEs: "Tiempo al primer ahorro",
          labelEn: "Time to first savings",
        },
        { value: "5x-10x", unit: "", labelEs: "ROI del proyecto", labelEn: "Project ROI" },
        {
          value: "15-30%",
          unit: "",
          labelEs: "Recursos hu\u00e9rfanos eliminados",
          labelEn: "Orphaned resources eliminated",
        },
      ],
      ctaPrimaryTextEs: "Solicitar evaluaci\u00f3n",
      ctaPrimaryTextEn: "Request assessment",
      ctaPrimaryUrl: "/servicios/cloud/finops",
      seoTitleEs: "FinOps \u2014 Optimizaci\u00f3n Financiera Cloud | Nivelics",
      seoTitleEn: "FinOps \u2014 Cloud Financial Optimization | Nivelics",
      seoDescriptionEs:
        "Gobernanza y optimizaci\u00f3n financiera cloud. Ahorro t\u00edpico de 30-40% en gasto cloud.",
      seoDescriptionEn:
        "Cloud financial governance and optimization. Typical 30-40% savings in cloud spend.",
      sortOrder: 1,
      status: "published" as const,
      translationStatusEn: "complete" as const,
    },
    // ── Sub: Agentes IA ──
    {
      slugEs: "agentes-ia",
      slugEn: "ai-agents",
      serviceType: "sub" as const,
      accentColor: "ia" as const,
      icon: "bot",
      titleEs: "Agentes de IA",
      titleEn: "AI Agents",
      subtitleEs: "Automatizaci\u00f3n inteligente para ventas, soporte y operaciones.",
      subtitleEn: "Intelligent automation for sales, support and operations.",
      descriptionEs:
        "Automatizaci\u00f3n inteligente para ventas, soporte y operaciones. Integraci\u00f3n con WhatsApp, CRM y plataformas empresariales.",
      descriptionEn:
        "Intelligent automation for sales, support and operations. Integration with WhatsApp, CRM and enterprise platforms.",
      seoTitleEs: "Agentes de IA para Empresas | Nivelics",
      seoTitleEn: "AI Agents for Business | Nivelics",
      seoDescriptionEs:
        "LLMs que ejecutan tareas reales de negocio. Agentes aut\u00f3nomos integrados con tus sistemas.",
      seoDescriptionEn:
        "LLMs that execute real business tasks. Autonomous agents integrated with your systems.",
      sortOrder: 1,
      status: "published" as const,
      translationStatusEn: "pending" as const,
    },
    // ── Sub: Agentes Comerciales ──
    {
      slugEs: "agentes-comerciales",
      slugEn: "sales-agents",
      serviceType: "sub" as const,
      accentColor: "ia" as const,
      icon: "trending-up",
      titleEs: "Agentes Comerciales",
      titleEn: "Sales Agents",
      subtitleEs:
        "IA que califica leads, hace seguimiento y escala oportunidades a tu equipo de ventas.",
      subtitleEn:
        "AI that qualifies leads, follows up and scales opportunities to your sales team.",
      descriptionEs:
        "IA que califica leads, hace seguimiento y escala oportunidades a tu equipo de ventas.",
      descriptionEn:
        "AI that qualifies leads, follows up and scales opportunities to your sales team.",
      seoTitleEs: "Agentes Comerciales IA | Nivelics",
      seoTitleEn: "AI Sales Agents | Nivelics",
      sortOrder: 2,
      status: "published" as const,
      translationStatusEn: "pending" as const,
    },
    // ── Sub: Automatizaci\u00f3n de Procesos ──
    {
      slugEs: "automatizacion-procesos",
      slugEn: "process-automation",
      serviceType: "sub" as const,
      accentColor: "ia" as const,
      icon: "settings",
      titleEs: "Automatizaci\u00f3n de Procesos",
      titleEn: "Process Automation",
      descriptionEs: "Elimina trabajo manual repetitivo con flujos inteligentes impulsados por IA.",
      descriptionEn: "Eliminate repetitive manual work with intelligent AI-powered workflows.",
      seoTitleEs: "Automatizaci\u00f3n de Procesos con IA | Nivelics",
      seoTitleEn: "AI Process Automation | Nivelics",
      sortOrder: 3,
      status: "published" as const,
      translationStatusEn: "pending" as const,
    },
    // ── Sub: Gesti\u00f3n de Contenido ──
    {
      slugEs: "gestion-contenido",
      slugEn: "content-management",
      serviceType: "sub" as const,
      accentColor: "ia" as const,
      icon: "file-text",
      titleEs: "Gesti\u00f3n de Contenido",
      titleEn: "Content Management",
      descriptionEs:
        "SEO y contenido a escala con IA. Generaci\u00f3n, optimizaci\u00f3n y distribuci\u00f3n inteligente.",
      descriptionEn:
        "SEO and content at scale with AI. Intelligent generation, optimization and distribution.",
      seoTitleEs: "Gesti\u00f3n de Contenido con IA | Nivelics",
      seoTitleEn: "AI Content Management | Nivelics",
      sortOrder: 4,
      status: "published" as const,
      translationStatusEn: "pending" as const,
    },
    // ── Sub: Marketing y CRM ──
    {
      slugEs: "marketing-crm",
      slugEn: "marketing-crm",
      serviceType: "sub" as const,
      accentColor: "ia" as const,
      icon: "mail",
      titleEs: "Marketing y CRM",
      titleEn: "Marketing & CRM",
      descriptionEs:
        "Prospectos calificados autom\u00e1ticamente con IA integrada a tu CRM y herramientas de marketing.",
      descriptionEn:
        "Automatically qualified prospects with AI integrated into your CRM and marketing tools.",
      seoTitleEs: "Marketing y CRM con IA | Nivelics",
      seoTitleEn: "AI Marketing & CRM | Nivelics",
      sortOrder: 5,
      status: "published" as const,
      translationStatusEn: "pending" as const,
    },
    // ── Sub: Migraci\u00f3n AWS ──
    {
      slugEs: "migracion-aws",
      slugEn: "aws-migration",
      serviceType: "sub" as const,
      accentColor: "cloud" as const,
      icon: "server",
      titleEs: "Migraci\u00f3n a AWS",
      titleEn: "AWS Migration",
      descriptionEs:
        "Zero downtime, rollback garantizado. Migraci\u00f3n planificada y ejecutada con experiencia.",
      descriptionEn:
        "Zero downtime, guaranteed rollback. Migration planned and executed with experience.",
      seoTitleEs: "Migraci\u00f3n a AWS | Zero Downtime | Nivelics",
      seoTitleEn: "AWS Migration | Zero Downtime | Nivelics",
      sortOrder: 2,
      status: "published" as const,
      translationStatusEn: "pending" as const,
    },
    // ── Sub: Infraestructura ──
    {
      slugEs: "infraestructura",
      slugEn: "infrastructure",
      serviceType: "sub" as const,
      accentColor: "cloud" as const,
      icon: "layers",
      titleEs: "Infraestructura Cloud",
      titleEn: "Cloud Infrastructure",
      descriptionEs:
        "Multi-cloud con IaC y observabilidad. Arquitectura escalable desde el d\u00eda 1.",
      descriptionEn: "Multi-cloud with IaC and observability. Scalable architecture from day 1.",
      seoTitleEs: "Infraestructura Cloud | Multi-cloud con IaC | Nivelics",
      seoTitleEn: "Cloud Infrastructure | Multi-cloud with IaC | Nivelics",
      sortOrder: 3,
      status: "published" as const,
      translationStatusEn: "pending" as const,
    },
    // ── Sub: Seguridad Cloud ──
    {
      slugEs: "seguridad",
      slugEn: "security",
      serviceType: "sub" as const,
      accentColor: "cloud" as const,
      icon: "shield",
      titleEs: "Seguridad Cloud",
      titleEn: "Cloud Security",
      descriptionEs: "SOC2, ISO27001 y hardening real. Seguridad desde la arquitectura.",
      descriptionEn: "SOC2, ISO27001 and real hardening. Security from the architecture.",
      seoTitleEs: "Seguridad Cloud | SOC2, ISO27001 | Nivelics",
      seoTitleEn: "Cloud Security | SOC2, ISO27001 | Nivelics",
      sortOrder: 4,
      status: "published" as const,
      translationStatusEn: "pending" as const,
    },
    // ── Sub: Serverless ──
    {
      slugEs: "serverless",
      slugEn: "serverless",
      serviceType: "sub" as const,
      accentColor: "cloud" as const,
      icon: "zap",
      titleEs: "Serverless",
      titleEn: "Serverless",
      descriptionEs:
        "Pay-per-use, escala autom\u00e1tica. Arquitecturas event-driven sin servidores.",
      descriptionEn: "Pay-per-use, automatic scaling. Event-driven serverless architectures.",
      seoTitleEs: "Serverless | Pay-per-use, escala autom\u00e1tica | Nivelics",
      seoTitleEn: "Serverless | Pay-per-use, Automatic Scaling | Nivelics",
      sortOrder: 5,
      status: "published" as const,
      translationStatusEn: "pending" as const,
    },
    // ── Sub: Desarrollo de Software (Staff) ──
    {
      slugEs: "desarrollo-software",
      slugEn: "software-development",
      serviceType: "sub" as const,
      accentColor: "staffing" as const,
      icon: "code-2",
      titleEs: "Desarrollo de Software",
      titleEn: "Software Development",
      descriptionEs:
        "Backend, Frontend y Full-Stack engineers senior con React, Node.js, Python, Java y Go.",
      descriptionEn:
        "Senior Backend, Frontend and Full-Stack engineers with React, Node.js, Python, Java and Go.",
      seoTitleEs: "Desarrollo de Software | Staff Augmentation | Nivelics",
      seoTitleEn: "Software Development | Staff Augmentation | Nivelics",
      sortOrder: 1,
      status: "published" as const,
      translationStatusEn: "pending" as const,
    },
    // ── Sub: Datos e IA (Staff) ──
    {
      slugEs: "datos-ia",
      slugEn: "data-ai",
      serviceType: "sub" as const,
      accentColor: "staffing" as const,
      icon: "database",
      titleEs: "Datos e IA",
      titleEn: "Data & AI",
      descriptionEs:
        "Data Scientists, Data Engineers y ML Engineers para anal\u00edtica avanzada y machine learning.",
      descriptionEn:
        "Data Scientists, Data Engineers and ML Engineers for advanced analytics and machine learning.",
      seoTitleEs: "Datos e IA | Staff Augmentation | Nivelics",
      seoTitleEn: "Data & AI | Staff Augmentation | Nivelics",
      sortOrder: 2,
      status: "published" as const,
      translationStatusEn: "pending" as const,
    },
    // ── Sub: DevOps & Cloud (Staff) ──
    {
      slugEs: "devops-cloud",
      slugEn: "devops-cloud",
      serviceType: "sub" as const,
      accentColor: "staffing" as const,
      icon: "cloud",
      titleEs: "DevOps y Cloud",
      titleEn: "DevOps & Cloud",
      descriptionEs: "Cloud Architects y DevOps Engineers certificados en AWS, GCP y Azure.",
      descriptionEn: "Certified Cloud Architects and DevOps Engineers in AWS, GCP and Azure.",
      seoTitleEs: "DevOps y Cloud | Staff Augmentation | Nivelics",
      seoTitleEn: "DevOps & Cloud | Staff Augmentation | Nivelics",
      sortOrder: 3,
      status: "published" as const,
      translationStatusEn: "pending" as const,
    },
    // ── Sub: Dise\u00f1o UX/UI (Staff) ──
    {
      slugEs: "diseno-ux-ui",
      slugEn: "ux-ui-design",
      serviceType: "sub" as const,
      accentColor: "staffing" as const,
      icon: "palette",
      titleEs: "Dise\u00f1o UX/UI",
      titleEn: "UX/UI Design",
      descriptionEs:
        "Product designers senior con experiencia en design systems, research y prototipado.",
      descriptionEn:
        "Senior product designers with experience in design systems, research and prototyping.",
      seoTitleEs: "Dise\u00f1o UX/UI | Staff Augmentation | Nivelics",
      seoTitleEn: "UX/UI Design | Staff Augmentation | Nivelics",
      sortOrder: 4,
      status: "published" as const,
      translationStatusEn: "pending" as const,
    },
    // ── Sub: QA y Seguridad (Staff) ──
    {
      slugEs: "qa-seguridad",
      slugEn: "qa-security",
      serviceType: "sub" as const,
      accentColor: "staffing" as const,
      icon: "shield-check",
      titleEs: "QA y Ciberseguridad",
      titleEn: "QA & Cybersecurity",
      descriptionEs:
        "QA Engineers, SDET y especialistas en ciberseguridad. Calidad garantizada en cada sprint.",
      descriptionEn:
        "QA Engineers, SDET and cybersecurity specialists. Guaranteed quality in every sprint.",
      seoTitleEs: "QA y Seguridad | Staff Augmentation | Nivelics",
      seoTitleEn: "QA & Security | Staff Augmentation | Nivelics",
      sortOrder: 5,
      status: "published" as const,
      translationStatusEn: "pending" as const,
    },
    // ── Sub: Apps M\u00f3viles ──
    {
      slugEs: "apps-moviles",
      slugEn: "mobile-apps",
      serviceType: "sub" as const,
      accentColor: "dev" as const,
      icon: "smartphone",
      titleEs: "Apps M\u00f3viles",
      titleEn: "Mobile Apps",
      descriptionEs: "iOS, Android, Flutter, React Native. Desarrollo nativo y cross-platform.",
      descriptionEn: "iOS, Android, Flutter, React Native. Native and cross-platform development.",
      seoTitleEs: "Apps M\u00f3viles | iOS, Android, Flutter | Nivelics",
      seoTitleEn: "Mobile Apps | iOS, Android, Flutter | Nivelics",
      sortOrder: 1,
      status: "published" as const,
      translationStatusEn: "pending" as const,
    },
    // ── Sub: E-commerce ──
    {
      slugEs: "ecommerce",
      slugEn: "ecommerce",
      serviceType: "sub" as const,
      accentColor: "dev" as const,
      icon: "shopping-cart",
      titleEs: "E-commerce",
      titleEn: "E-commerce",
      descriptionEs:
        "Plataformas propias sin comisiones. Arquitectura escalable para ventas digitales.",
      descriptionEn:
        "Own platforms with zero commissions. Scalable architecture for digital sales.",
      seoTitleEs: "E-commerce | Plataformas Propias | Nivelics",
      seoTitleEn: "E-commerce | Custom Platforms | Nivelics",
      sortOrder: 2,
      status: "published" as const,
      translationStatusEn: "pending" as const,
    },
    // ── Sub: Plataformas Web ──
    {
      slugEs: "plataformas-web",
      slugEn: "web-platforms",
      serviceType: "sub" as const,
      accentColor: "dev" as const,
      icon: "globe",
      titleEs: "Plataformas Web",
      titleEn: "Web Platforms",
      descriptionEs:
        "Arquitectura escalable desde el d\u00eda 1. SaaS, portales B2B y aplicaciones enterprise.",
      descriptionEn:
        "Scalable architecture from day 1. SaaS, B2B portals and enterprise applications.",
      seoTitleEs: "Plataformas Web | SaaS, Portales B2B | Nivelics",
      seoTitleEn: "Web Platforms | SaaS, B2B Portals | Nivelics",
      sortOrder: 3,
      status: "published" as const,
      translationStatusEn: "pending" as const,
    },
    // ── Sub: Sitios Web Agentic ──
    {
      slugEs: "sitios-web-agentic",
      slugEn: "agentic-websites",
      serviceType: "sub" as const,
      accentColor: "dev" as const,
      icon: "bot",
      titleEs: "Sitios Web Agentic-First",
      titleEn: "Agentic-First Websites",
      descriptionEs:
        "Sitios navegables por IA, agentes y LLMs. Dise\u00f1ados para humanos y m\u00e1quinas.",
      descriptionEn: "Websites navigable by AI, agents and LLMs. Designed for humans and machines.",
      seoTitleEs: "Sitios Web Agentic-First | Nivelics",
      seoTitleEn: "Agentic-First Websites | Nivelics",
      sortOrder: 4,
      status: "published" as const,
      translationStatusEn: "complete" as const,
    },
  ];

  // Map of parent slugs for setting parentId
  const parentMap: Record<string, string> = {};

  for (const svc of services) {
    const existing = await db
      .select()
      .from(schema.servicios)
      .where(eq(schema.servicios.slugEs, svc.slugEs))
      .limit(1);

    if (existing.length > 0) {
      report.skipped.push(`servicio: ${svc.slugEs} (already exists)`);
      if (svc.serviceType === "hub") parentMap[svc.slugEs] = existing[0].id;
      continue;
    }

    // Determine parent
    let parentId: string | undefined;
    if (svc.serviceType === "sub") {
      // Infer parent from slug + accentColor
      const parentSlugMap: Record<string, string> = {
        ia: "inteligencia-artificial",
        cloud: "cloud",
        staffing: "staff-augmentation",
        finops: "cloud",
        dev: "desarrollo-digital",
      };
      const parentSlug = parentSlugMap[svc.accentColor];
      if (parentSlug && parentMap[parentSlug]) {
        parentId = parentMap[parentSlug];
      }
    }

    if (!DRY_RUN) {
      const [inserted] = await db
        .insert(schema.servicios)
        .values({
          ...svc,
          parentId,
        })
        .returning({ id: schema.servicios.id });
      if (svc.serviceType === "hub") parentMap[svc.slugEs] = inserted.id;
    }
    report.inserted.push(`servicio: ${svc.slugEs}`);
  }
}

// ─── INDUSTRIAS ──────────────────────────────────────────

async function seedIndustrias() {
  log("Seeding industrias...");

  const industries = [
    {
      slugEs: "fintech",
      slugEn: "fintech",
      icon: "trending-up",
      accentColor: "ia" as const,
      nameEs: "Fintech",
      nameEn: "Fintech",
      heroTitleEs: "Transformaci\u00f3n Digital para Fintech",
      heroTitleEn: "Digital Transformation for Fintech",
      heroSubtitleEs:
        "Combinamos inteligencia artificial, infraestructura cloud y talento especializado para que tu fintech escale con confianza.",
      heroSubtitleEn:
        "We combine artificial intelligence, cloud infrastructure and specialized talent so your fintech scales with confidence.",
      painPoints: [
        {
          icon: "shield",
          titleEs: "Compliance regulatorio",
          titleEn: "Regulatory compliance",
          descEs:
            "Normativas cambiantes y requisitos de cumplimiento que demandan arquitecturas seguras, auditables y adaptables.",
          descEn:
            "Changing regulations and compliance requirements demanding secure, auditable and adaptable architectures.",
        },
        {
          icon: "server",
          titleEs: "Escalabilidad de infraestructura",
          titleEn: "Infrastructure scalability",
          descEs:
            "Picos de transacciones impredecibles que requieren infraestructura el\u00e1stica sin comprometer latencia.",
          descEn:
            "Unpredictable transaction peaks requiring elastic infrastructure without compromising latency.",
        },
        {
          icon: "smartphone",
          titleEs: "Experiencia del usuario",
          titleEn: "User experience",
          descEs:
            "Usuarios digitales que exigen interfaces intuitivas, onboarding sin fricci\u00f3n y respuestas en milisegundos.",
          descEn:
            "Digital users demanding intuitive interfaces, frictionless onboarding and millisecond responses.",
        },
      ],
      solutions: [
        {
          icon: "brain",
          titleEs: "IA para Fintech",
          titleEn: "AI for Fintech",
          descEs:
            "Modelos de scoring crediticio, detecci\u00f3n de fraude en tiempo real y asistentes virtuales.",
          descEn: "Credit scoring models, real-time fraud detection and virtual assistants.",
        },
        {
          icon: "cloud",
          titleEs: "Cloud para Fintech",
          titleEn: "Cloud for Fintech",
          descEs:
            "Arquitecturas serverless y multi-AZ que escalan autom\u00e1ticamente, cumpliendo est\u00e1ndares PCI-DSS.",
          descEn:
            "Serverless and multi-AZ architectures that scale automatically, meeting PCI-DSS standards.",
        },
        {
          icon: "users",
          titleEs: "Staffing para Fintech",
          titleEn: "Staffing for Fintech",
          descEs:
            "Ingenieros senior con experiencia en banca digital y pagos, integrados en menos de 10 d\u00edas.",
          descEn:
            "Senior engineers with digital banking and payments experience, integrated in under 10 days.",
        },
      ],
      ctaTextEs: "Hablemos de tu proyecto en Fintech",
      ctaTextEn: "Let\u2019s talk about your Fintech project",
      seoTitleEs: "IA y Cloud para Fintech | Nivelics",
      seoTitleEn: "AI & Cloud for Fintech | Nivelics",
      seoDescriptionEs:
        "Soluciones de inteligencia artificial, cloud e ingenier\u00eda para empresas fintech.",
      seoDescriptionEn:
        "Artificial intelligence, cloud and engineering solutions for fintech companies.",
      status: "published" as const,
      translationStatusEn: "pending" as const,
    },
    {
      slugEs: "medios-entretenimiento",
      slugEn: "media-entertainment",
      icon: "play-circle",
      accentColor: "dev" as const,
      nameEs: "Medios y Entretenimiento",
      nameEn: "Media & Entertainment",
      heroTitleEs: "IA \u00b7 Cloud \u00b7 Staffing para Medios y Entretenimiento",
      heroTitleEn: "AI \u00b7 Cloud \u00b7 Staffing for Media & Entertainment",
      heroSubtitleEs:
        "Potenciamos plataformas de contenido digital con tecnolog\u00eda que escala, personaliza y monetiza como Televisa/N+, Pulzo, Univision y Cr\u00f3nica.",
      heroSubtitleEn:
        "We power digital content platforms with technology that scales, personalizes and monetizes \u2014 like Televisa/N+, Pulzo, Univision and Cr\u00f3nica.",
      painPoints: [
        {
          icon: "play",
          titleEs: "Streaming a escala",
          titleEn: "Streaming at scale",
          descEs: "Entregar contenido en vivo y on-demand a millones de usuarios simult\u00e1neos.",
          descEn: "Delivering live and on-demand content to millions of simultaneous users.",
        },
        {
          icon: "sparkles",
          titleEs: "Personalizaci\u00f3n de contenido",
          titleEn: "Content personalization",
          descEs: "Recomendar el contenido correcto al usuario correcto en el momento correcto.",
          descEn: "Recommending the right content to the right user at the right time.",
        },
        {
          icon: "dollar-sign",
          titleEs: "Monetizaci\u00f3n digital",
          titleEn: "Digital monetization",
          descEs:
            "Diversificar fuentes de ingreso entre suscripciones, publicidad y modelos freemium.",
          descEn:
            "Diversifying revenue streams across subscriptions, advertising and freemium models.",
        },
      ],
      solutions: [
        {
          icon: "brain",
          titleEs: "IA para Medios",
          titleEn: "AI for Media",
          descEs:
            "Motores de recomendaci\u00f3n, clasificaci\u00f3n autom\u00e1tica de contenido y anal\u00edtica de audiencia.",
          descEn:
            "Recommendation engines, automatic content classification and audience analytics.",
        },
        {
          icon: "cloud",
          titleEs: "Cloud para Medios",
          titleEn: "Cloud for Media",
          descEs:
            "CDN global, transcodificaci\u00f3n el\u00e1stica y arquitecturas serverless para millones de streams.",
          descEn:
            "Global CDN, elastic transcoding and serverless architectures for millions of streams.",
        },
        {
          icon: "users",
          titleEs: "Staffing para Medios",
          titleEn: "Staffing for Media",
          descEs:
            "Equipos con experiencia en plataformas editoriales, CMS headless y stacks de video digital.",
          descEn:
            "Teams with experience in editorial platforms, headless CMS and digital video stacks.",
        },
      ],
      ctaTextEs: "Hablemos de tu proyecto en Medios y Entretenimiento",
      ctaTextEn: "Let\u2019s talk about your Media & Entertainment project",
      seoTitleEs: "Tecnolog\u00eda para Medios y Entretenimiento | Nivelics",
      seoTitleEn: "Technology for Media & Entertainment | Nivelics",
      seoDescriptionEs:
        "Soluciones de streaming, personalizaci\u00f3n de contenido y monetizaci\u00f3n digital.",
      seoDescriptionEn: "Streaming, content personalization and digital monetization solutions.",
      status: "published" as const,
      translationStatusEn: "pending" as const,
    },
    {
      slugEs: "salud",
      slugEn: "healthcare",
      icon: "heart-pulse",
      accentColor: "cloud" as const,
      nameEs: "Salud",
      nameEn: "Healthcare",
      heroTitleEs: "Tecnolog\u00eda para el Sector Salud",
      heroTitleEn: "Technology for Healthcare",
      heroSubtitleEs:
        "Conectamos sistemas, habilitamos telemedicina y transformamos datos cl\u00ednicos en mejores resultados para pacientes.",
      heroSubtitleEn:
        "We connect systems, enable telemedicine and transform clinical data into better patient outcomes.",
      painPoints: [
        {
          icon: "link",
          titleEs: "Interoperabilidad de sistemas",
          titleEn: "Systems interoperability",
          descEs: "Sistemas legacy aislados que no se comunican entre s\u00ed.",
          descEn: "Isolated legacy systems that don\u2019t communicate with each other.",
        },
        {
          icon: "video",
          titleEs: "Telemedicina",
          titleEn: "Telemedicine",
          descEs:
            "Plataformas de consulta remota seguras y que cumplan regulaciones de privacidad.",
          descEn: "Secure remote consultation platforms compliant with privacy regulations.",
        },
        {
          icon: "database",
          titleEs: "Gesti\u00f3n de datos cl\u00ednicos",
          titleEn: "Clinical data management",
          descEs:
            "Vol\u00famenes masivos de datos cl\u00ednicos que requieren almacenamiento seguro y anal\u00edtica.",
          descEn: "Massive volumes of clinical data requiring secure storage and analytics.",
        },
      ],
      solutions: [
        {
          icon: "brain",
          titleEs: "IA para Salud",
          titleEn: "AI for Healthcare",
          descEs:
            "Modelos predictivos para diagn\u00f3stico temprano, NLP para historias cl\u00ednicas y asistentes virtuales.",
          descEn:
            "Predictive models for early diagnosis, NLP for clinical records and virtual assistants.",
        },
        {
          icon: "cloud",
          titleEs: "Cloud para Salud",
          titleEn: "Cloud for Healthcare",
          descEs:
            "Infraestructura HIPAA-compliant con alta disponibilidad y arquitecturas HL7/FHIR.",
          descEn:
            "HIPAA-compliant infrastructure with high availability and HL7/FHIR architectures.",
        },
        {
          icon: "users",
          titleEs: "Staffing para Salud",
          titleEn: "Staffing for Healthcare",
          descEs:
            "Ingenieros con experiencia en healthtech e integraciones de sistemas cl\u00ednicos.",
          descEn: "Engineers with experience in healthtech and clinical systems integrations.",
        },
      ],
      ctaTextEs: "Hablemos de tu proyecto en Salud",
      ctaTextEn: "Let\u2019s talk about your Healthcare project",
      seoTitleEs: "Transformaci\u00f3n Digital en Salud | Nivelics",
      seoTitleEn: "Digital Transformation in Healthcare | Nivelics",
      seoDescriptionEs:
        "Soluciones de interoperabilidad, telemedicina y gesti\u00f3n de datos cl\u00ednicos.",
      seoDescriptionEn: "Interoperability, telemedicine and clinical data management solutions.",
      status: "published" as const,
      translationStatusEn: "pending" as const,
    },
    {
      slugEs: "retail-ecommerce",
      slugEn: "retail-ecommerce",
      icon: "shopping-bag",
      accentColor: "staffing" as const,
      nameEs: "Retail y E-commerce",
      nameEn: "Retail & E-commerce",
      heroTitleEs: "IA \u00b7 Cloud \u00b7 Staffing para Retail y E-commerce",
      heroTitleEn: "AI \u00b7 Cloud \u00b7 Staffing for Retail & E-commerce",
      heroSubtitleEs:
        "Conectamos cada canal de venta, personalizamos la experiencia de compra y optimizamos la \u00faltima milla.",
      heroSubtitleEn:
        "We connect every sales channel, personalize the shopping experience and optimize the last mile.",
      painPoints: [
        {
          icon: "layers",
          titleEs: "Omnicanalidad",
          titleEn: "Omnichannel",
          descEs:
            "Integrar tiendas f\u00edsicas, e-commerce, marketplace y apps en una experiencia unificada.",
          descEn:
            "Integrating physical stores, e-commerce, marketplace and apps into a unified experience.",
        },
        {
          icon: "sparkles",
          titleEs: "Personalizaci\u00f3n",
          titleEn: "Personalization",
          descEs:
            "Recomendaciones de producto, precios din\u00e1micos y experiencias \u00fanicas por cliente.",
          descEn: "Product recommendations, dynamic pricing and unique experiences per customer.",
        },
        {
          icon: "truck",
          titleEs: "Log\u00edstica last-mile",
          titleEn: "Last-mile logistics",
          descEs:
            "Optimizar la \u00faltima milla con visibilidad en tiempo real y rutas inteligentes.",
          descEn: "Optimizing the last mile with real-time visibility and intelligent routing.",
        },
      ],
      solutions: [
        {
          icon: "brain",
          titleEs: "IA para Retail",
          titleEn: "AI for Retail",
          descEs:
            "Motores de recomendaci\u00f3n, predicci\u00f3n de demanda, pricing din\u00e1mico y chatbots con IA generativa.",
          descEn:
            "Recommendation engines, demand prediction, dynamic pricing and chatbots with generative AI.",
        },
        {
          icon: "cloud",
          titleEs: "Cloud para Retail",
          titleEn: "Cloud for Retail",
          descEs:
            "Arquitecturas el\u00e1sticas para picos de venta, CDN para cat\u00e1logos y microservicios.",
          descEn: "Elastic architectures for sales peaks, CDN for catalogs and microservices.",
        },
        {
          icon: "users",
          titleEs: "Staffing para Retail",
          titleEn: "Staffing for Retail",
          descEs:
            "Desarrolladores con experiencia en plataformas e-commerce e integraciones ERP/POS.",
          descEn: "Developers with experience in e-commerce platforms and ERP/POS integrations.",
        },
      ],
      ctaTextEs: "Hablemos de tu proyecto en Retail y E-commerce",
      ctaTextEn: "Let\u2019s talk about your Retail & E-commerce project",
      seoTitleEs: "Soluciones Tech para Retail y E-commerce | Nivelics",
      seoTitleEn: "Tech Solutions for Retail & E-commerce | Nivelics",
      seoDescriptionEs:
        "Soluciones de omnicanalidad, personalizaci\u00f3n y log\u00edstica last-mile.",
      seoDescriptionEn: "Omnichannel, personalization and last-mile logistics solutions.",
      status: "published" as const,
      translationStatusEn: "pending" as const,
    },
    {
      slugEs: "logistica",
      slugEn: "logistics",
      icon: "truck",
      accentColor: "finops" as const,
      nameEs: "Log\u00edstica",
      nameEn: "Logistics",
      heroTitleEs: "Transformaci\u00f3n Digital en Log\u00edstica",
      heroTitleEn: "Digital Transformation in Logistics",
      heroSubtitleEs:
        "Trazabilidad total, rutas inteligentes y almacenes automatizados con IA, cloud y talento especializado.",
      heroSubtitleEn:
        "Full traceability, intelligent routing and automated warehouses with AI, cloud and specialized talent.",
      painPoints: [
        {
          icon: "map-pin",
          titleEs: "Trazabilidad en tiempo real",
          titleEn: "Real-time traceability",
          descEs:
            "Visibilidad completa de la cadena de suministro desde el origen hasta la entrega final.",
          descEn: "Full supply chain visibility from origin to final delivery.",
        },
        {
          icon: "route",
          titleEs: "Optimizaci\u00f3n de rutas",
          titleEn: "Route optimization",
          descEs: "Reducir costos de transporte y tiempos de entrega con algoritmos inteligentes.",
          descEn: "Reducing transport costs and delivery times with intelligent algorithms.",
        },
        {
          icon: "warehouse",
          titleEs: "Automatizaci\u00f3n de warehouse",
          titleEn: "Warehouse automation",
          descEs: "Picking inteligente, inventario en tiempo real y coordinaci\u00f3n con flotas.",
          descEn: "Intelligent picking, real-time inventory and fleet coordination.",
        },
      ],
      solutions: [
        {
          icon: "brain",
          titleEs: "IA para Log\u00edstica",
          titleEn: "AI for Logistics",
          descEs:
            "Predicci\u00f3n de demanda, optimizaci\u00f3n de rutas con ML y visi\u00f3n por computadora.",
          descEn: "Demand prediction, route optimization with ML and computer vision.",
        },
        {
          icon: "cloud",
          titleEs: "Cloud para Log\u00edstica",
          titleEn: "Cloud for Logistics",
          descEs:
            "Plataformas IoT en la nube para tracking en tiempo real y dashboards operativos.",
          descEn: "Cloud IoT platforms for real-time tracking and operational dashboards.",
        },
        {
          icon: "users",
          titleEs: "Staffing para Log\u00edstica",
          titleEn: "Staffing for Logistics",
          descEs: "Ingenieros con experiencia en TMS, WMS e integraciones IoT.",
          descEn: "Engineers with experience in TMS, WMS and IoT integrations.",
        },
      ],
      ctaTextEs: "Hablemos de tu proyecto en Log\u00edstica",
      ctaTextEn: "Let\u2019s talk about your Logistics project",
      seoTitleEs: "Tecnolog\u00eda para Log\u00edstica y Transporte | Nivelics",
      seoTitleEn: "Technology for Logistics & Transportation | Nivelics",
      seoDescriptionEs:
        "Soluciones de trazabilidad, optimizaci\u00f3n de rutas y automatizaci\u00f3n de warehouse.",
      seoDescriptionEn: "Traceability, route optimization and warehouse automation solutions.",
      status: "published" as const,
      translationStatusEn: "pending" as const,
    },
    {
      slugEs: "manufactura",
      slugEn: "manufacturing",
      icon: "factory",
      accentColor: "cloud" as const,
      nameEs: "Manufactura",
      nameEn: "Manufacturing",
      heroTitleEs: "Industria 4.0: IA y Cloud para Manufactura",
      heroTitleEn: "Industry 4.0: AI & Cloud for Manufacturing",
      heroSubtitleEs:
        "Conectamos sensores, predecimos fallas y automatizamos calidad para llevar tu planta al siguiente nivel.",
      heroSubtitleEn:
        "We connect sensors, predict failures and automate quality to take your plant to the next level.",
      painPoints: [
        {
          icon: "wifi",
          titleEs: "IoT y sensores",
          titleEn: "IoT & sensors",
          descEs: "Conectar miles de sensores en planta para recolectar datos en tiempo real.",
          descEn: "Connecting thousands of plant sensors for real-time data collection.",
        },
        {
          icon: "activity",
          titleEs: "Mantenimiento predictivo",
          titleEn: "Predictive maintenance",
          descEs: "Anticipar fallas en equipos antes de que ocurran.",
          descEn: "Anticipating equipment failures before they happen.",
        },
        {
          icon: "eye",
          titleEs: "Calidad automatizada",
          titleEn: "Automated quality",
          descEs: "Detectar defectos de producci\u00f3n con visi\u00f3n por computadora.",
          descEn: "Detecting production defects with computer vision.",
        },
      ],
      solutions: [
        {
          icon: "brain",
          titleEs: "IA para Manufactura",
          titleEn: "AI for Manufacturing",
          descEs:
            "Modelos de mantenimiento predictivo, visi\u00f3n por computadora y optimizaci\u00f3n de procesos.",
          descEn: "Predictive maintenance models, computer vision and process optimization.",
        },
        {
          icon: "cloud",
          titleEs: "Cloud para Manufactura",
          titleEn: "Cloud for Manufacturing",
          descEs: "Plataformas IoT, digital twins y dashboards de producci\u00f3n en tiempo real.",
          descEn: "IoT platforms, digital twins and real-time production dashboards.",
        },
        {
          icon: "users",
          titleEs: "Staffing para Manufactura",
          titleEn: "Staffing for Manufacturing",
          descEs: "Ingenieros con experiencia en IoT industrial e integraciones SCADA/MES.",
          descEn: "Engineers with experience in industrial IoT and SCADA/MES integrations.",
        },
      ],
      ctaTextEs: "Hablemos de tu proyecto en Manufactura",
      ctaTextEn: "Let\u2019s talk about your Manufacturing project",
      seoTitleEs: "Industria 4.0 y Manufactura Inteligente | Nivelics",
      seoTitleEn: "Industry 4.0 & Smart Manufacturing | Nivelics",
      seoDescriptionEs: "Soluciones de IoT, mantenimiento predictivo y calidad automatizada.",
      seoDescriptionEn: "IoT, predictive maintenance and automated quality solutions.",
      status: "published" as const,
      translationStatusEn: "pending" as const,
    },
  ];

  for (const ind of industries) {
    const existing = await db
      .select()
      .from(schema.industrias)
      .where(eq(schema.industrias.slugEs, ind.slugEs))
      .limit(1);
    if (existing.length > 0) {
      report.skipped.push(`industria: ${ind.slugEs}`);
      continue;
    }
    if (!DRY_RUN) {
      await db.insert(schema.industrias).values(ind);
    }
    report.inserted.push(`industria: ${ind.slugEs}`);
  }
}

// ─── CASOS DE EXITO ─────────────────────────────────────

async function seedCasosExito() {
  log("Seeding casos_exito...");

  const cases = [
    {
      slug: "televisa",
      clientName: "Televisa / N+",
      clientCountry: "M\u00e9xico",
      clientSector: "Medios / Streaming",
      titleEs: "Televisa / N+: Plataforma de Noticias Digitales",
      challengeEs:
        "Televisa necesitaba una plataforma digital de noticias tipo streaming para el mercado hispanohablante, capaz de manejar picos masivos de tr\u00e1fico durante eventos noticiosos en vivo.",
      solutionEs:
        "Dise\u00f1amos una arquitectura cloud escalable en AWS con CDN global, equipo de ingenier\u00eda Nivelics integrado al equipo Televisa, y pipelines de CI/CD para deploys m\u00faltiples al d\u00eda.",
      resultsEs:
        "Plataforma escalable a millones de usuarios con 99.9% uptime en eventos en vivo y 40% m\u00e1s r\u00e1pido en time-to-market.",
      metric1Value: "Millones",
      metric1LabelEs: "Plataforma escalable a millones de usuarios",
      metric1LabelEn: "Platform scalable to millions of users",
      metric2Value: "99.9%",
      metric2LabelEs: "Uptime en eventos en vivo",
      metric2LabelEn: "Uptime during live events",
      metric3Value: "40%",
      metric3LabelEs: "Time-to-market m\u00e1s r\u00e1pido",
      metric3LabelEn: "Faster time-to-market",
      servicesUsed: ["Desarrollo", "Cloud", "Staffing"],
      featured: true,
      seoTitleEs: "Caso de \u00c9xito Televisa N+ | Nivelics",
      seoTitleEn: "Televisa N+ Success Story | Nivelics",
      seoDescriptionEs:
        "C\u00f3mo Nivelics ayud\u00f3 a Televisa a construir N+, una plataforma de noticias digitales tipo streaming escalable a millones de usuarios.",
      seoDescriptionEn:
        "How Nivelics helped Televisa build N+, a streaming-style digital news platform scalable to millions of users.",
      status: "published" as const,
      translationStatusEn: "pending" as const,
    },
    {
      slug: "grupo-bolivar",
      clientName: "Grupo Bol\u00edvar",
      clientCountry: "Colombia",
      clientSector: "Seguros / Salud / E-commerce",
      titleEs: "Grupo Bol\u00edvar: Transformaci\u00f3n Digital Multi-l\u00ednea",
      challengeEs:
        "Grupo Bol\u00edvar necesitaba modernizar m\u00faltiples l\u00edneas de negocio simult\u00e1neamente, integrando canales digitales y optimizando procesos internos.",
      solutionEs:
        "Redise\u00f1o y desarrollo de productos digitales para seguros, salud y e-commerce con equipo dedicado y metodolog\u00eda \u00e1gil.",
      resultsEs:
        "3 productos digitales lanzados, 25% reducci\u00f3n de costos operativos, 85% adopci\u00f3n digital.",
      metric1Value: "3",
      metric1LabelEs: "Productos digitales lanzados",
      metric1LabelEn: "Digital products launched",
      metric2Value: "25%",
      metric2LabelEs: "Reducci\u00f3n de costos operativos",
      metric2LabelEn: "Operating cost reduction",
      metric3Value: "85%",
      metric3LabelEs: "Adopci\u00f3n digital",
      metric3LabelEn: "Digital adoption",
      servicesUsed: ["Desarrollo", "Cloud", "IA"],
      featured: true,
      seoTitleEs: "Caso de \u00c9xito Grupo Bol\u00edvar | Nivelics",
      seoTitleEn: "Grupo Bol\u00edvar Success Story | Nivelics",
      status: "published" as const,
      translationStatusEn: "pending" as const,
    },
    {
      slug: "two-maids",
      clientName: "Two Maids",
      clientCountry: "USA",
      clientSector: "Servicios / Franquicias",
      titleEs: "Two Maids: Escalamiento de Equipo Tech en USA",
      challengeEs:
        "Two Maids necesitaba escalar su equipo de desarrollo r\u00e1pidamente para construir una plataforma de gesti\u00f3n de franquicias sin los costos de contrataci\u00f3n directa en USA.",
      solutionEs:
        "Staff Augmentation con ingenieros senior colombianos integrados al equipo de Two Maids. Desarrollo de plataforma para +100 franquicias.",
      resultsEs:
        "Equipo escalado en menos de 10 d\u00edas, 40% ahorro vs contrataci\u00f3n USA, +100 franquicias gestionadas.",
      metric1Value: "<10 d\u00edas",
      metric1LabelEs: "Equipo escalado",
      metric1LabelEn: "Team scaled",
      metric2Value: "40%",
      metric2LabelEs: "Ahorro vs contrataci\u00f3n USA",
      metric2LabelEn: "Savings vs. USA hiring",
      metric3Value: "+100",
      metric3LabelEs: "Franquicias gestionadas",
      metric3LabelEn: "Franchises managed",
      servicesUsed: ["Staffing", "Desarrollo"],
      featured: true,
      seoTitleEs: "Caso de \u00c9xito Two Maids | Nivelics",
      seoTitleEn: "Two Maids Success Story | Nivelics",
      status: "published" as const,
      translationStatusEn: "pending" as const,
    },
    {
      slug: "ab-inbev",
      clientName: "AB InBev-Bavaria",
      clientCountry: "El Salvador",
      clientSector: "Consumo Masivo",
      titleEs: "AB InBev-Bavaria: Transformaci\u00f3n Digital en Consumo Masivo",
      challengeEs:
        "AB InBev-Bavaria necesitaba digitalizar procesos de distribuci\u00f3n y ventas en la regi\u00f3n centroamericana.",
      solutionEs:
        "Desarrollo de soluciones digitales para optimizar la cadena de distribuci\u00f3n y las operaciones de venta en campo.",
      resultsEs:
        "Procesos de distribuci\u00f3n digitalizados con trazabilidad en tiempo real y eficiencia operativa mejorada.",
      metric1Value: "Digital",
      metric1LabelEs: "Procesos de distribuci\u00f3n digitalizados",
      metric1LabelEn: "Distribution processes digitized",
      metric2Value: "Real-time",
      metric2LabelEs: "Trazabilidad en tiempo real",
      metric2LabelEn: "Real-time traceability",
      metric3Value: "Mejorada",
      metric3LabelEs: "Eficiencia operativa mejorada",
      metric3LabelEn: "Improved operational efficiency",
      servicesUsed: ["Desarrollo", "Cloud"],
      featured: true,
      seoTitleEs: "Caso de \u00c9xito AB InBev-Bavaria | Nivelics",
      seoTitleEn: "AB InBev-Bavaria Success Story | Nivelics",
      status: "published" as const,
      translationStatusEn: "pending" as const,
    },
    {
      slug: "cronica",
      clientName: "Cr\u00f3nica",
      clientCountry: "Argentina",
      clientSector: "Medios",
      titleEs: "Cr\u00f3nica: Modernizaci\u00f3n de Plataforma de Noticias",
      challengeEs:
        "Cr\u00f3nica, uno de los medios m\u00e1s reconocidos de Argentina, necesitaba modernizar su plataforma digital para competir en la era del contenido personalizado.",
      solutionEs:
        "Redise\u00f1o completo del portal de noticias con arquitectura moderna, personalizaci\u00f3n de contenido con IA y optimizaci\u00f3n de procesos editoriales.",
      resultsEs:
        "Portal de alto tr\u00e1fico modernizado, personalizaci\u00f3n con IA implementada, procesos editoriales 50% m\u00e1s eficientes.",
      metric1Value: "Alto tr\u00e1fico",
      metric1LabelEs: "Portal de alto tr\u00e1fico modernizado",
      metric1LabelEn: "High-traffic portal modernized",
      metric2Value: "IA",
      metric2LabelEs: "Personalizaci\u00f3n con IA implementada",
      metric2LabelEn: "AI personalization implemented",
      metric3Value: "50%",
      metric3LabelEs: "Procesos editoriales m\u00e1s eficientes",
      metric3LabelEn: "More efficient editorial processes",
      servicesUsed: ["Desarrollo", "IA"],
      featured: true,
      seoTitleEs: "Caso de \u00c9xito Cr\u00f3nica Argentina | Nivelics",
      seoTitleEn: "Cr\u00f3nica Argentina Success Story | Nivelics",
      status: "published" as const,
      translationStatusEn: "pending" as const,
    },
    {
      slug: "pulzo",
      clientName: "Pulzo",
      clientCountry: "Colombia",
      clientSector: "Medios Digitales",
      titleEs: "Pulzo: Partnership Tecnol\u00f3gico desde 2014",
      challengeEs:
        "Pulzo, medio digital l\u00edder en Colombia, necesitaba un partner tecnol\u00f3gico de confianza para escalar su plataforma y optimizar su operaci\u00f3n digital.",
      solutionEs:
        "Partnership tecnol\u00f3gico de largo plazo con Nivelics. Desarrollo y evoluci\u00f3n continua de la plataforma editorial con foco en performance y escalabilidad.",
      resultsEs:
        "Partnership de largo plazo (+10 a\u00f1os), plataforma escalable a millones de visitas, evoluci\u00f3n tecnol\u00f3gica continua.",
      metric1Value: "+10 a\u00f1os",
      metric1LabelEs: "Partnership de largo plazo",
      metric1LabelEn: "Long-term partnership",
      metric2Value: "Millones",
      metric2LabelEs: "Plataforma escalable a millones de visitas",
      metric2LabelEn: "Platform scalable to millions of visits",
      metric3Value: "Continua",
      metric3LabelEs: "Evoluci\u00f3n tecnol\u00f3gica continua",
      metric3LabelEn: "Continuous technology evolution",
      servicesUsed: ["Desarrollo", "Staffing"],
      featured: true,
      seoTitleEs: "Caso de \u00c9xito Pulzo | Nivelics",
      seoTitleEn: "Pulzo Success Story | Nivelics",
      status: "published" as const,
      translationStatusEn: "pending" as const,
    },
    {
      slug: "univision",
      clientName: "Univision",
      clientCountry: "USA",
      clientSector: "Medios / Broadcasting",
      titleEs: "Univision: Desarrollo Digital para Medios Hispanos",
      challengeEs:
        "Univision requer\u00eda capacidad de desarrollo adicional para sus plataformas digitales dirigidas al mercado hispano en USA y M\u00e9xico.",
      solutionEs:
        "Equipo de desarrollo Nivelics integrado para fortalecer las capacidades digitales de Univision con talento senior biling\u00fce.",
      resultsEs:
        "Equipo integrado exitosamente, plataformas digitales mejoradas, cobertura biling\u00fce total.",
      metric1Value: "Integrado",
      metric1LabelEs: "Equipo integrado exitosamente",
      metric1LabelEn: "Team successfully integrated",
      metric2Value: "Mejoradas",
      metric2LabelEs: "Plataformas digitales mejoradas",
      metric2LabelEn: "Digital platforms improved",
      metric3Value: "100%",
      metric3LabelEs: "Cobertura biling\u00fce total",
      metric3LabelEn: "Full bilingual coverage",
      servicesUsed: ["Staffing", "Desarrollo"],
      featured: true,
      seoTitleEs: "Caso de \u00c9xito Univision | Nivelics",
      seoTitleEn: "Univision Success Story | Nivelics",
      status: "published" as const,
      translationStatusEn: "pending" as const,
    },
  ];

  for (const c of cases) {
    const existing = await db
      .select()
      .from(schema.casosExito)
      .where(eq(schema.casosExito.slug, c.slug))
      .limit(1);
    if (existing.length > 0) {
      report.skipped.push(`caso: ${c.slug}`);
      continue;
    }
    if (!DRY_RUN) {
      await db.insert(schema.casosExito).values(c);
    }
    report.inserted.push(`caso: ${c.slug}`);
  }
}

// ─── TEAM MEMBERS ───────────────────────────────────────

async function seedTeamMembers() {
  log("Seeding team_members...");

  const members = [
    {
      slug: "camilo-villanueva",
      name: "Camilo Andr\u00e9s Villanueva Ni\u00f1o",
      roleEs: "CEO & Co-Fundador",
      roleEn: "CEO & Co-Founder",
      bioEs:
        "Lidera la visi\u00f3n estrat\u00e9gica y el crecimiento de Nivelics desde su fundaci\u00f3n en 2012. Experiencia en desarrollo de negocios tecnol\u00f3gicos B2B en LATAM y USA.",
      bioEn:
        "Leads the strategic vision and growth of Nivelics since its founding in 2012. Experience in B2B tech business development in LATAM and USA.",
      isFounder: true,
      isFeatured: true,
      sortOrder: 1,
      status: "published" as const,
    },
    {
      slug: "jonathan-olarte",
      name: "Jonathan Olarte",
      roleEs: "CTO / Chief Technology Strategist",
      roleEn: "CTO / Chief Technology Strategist",
      bioEs:
        "Responsable de la estrategia tecnol\u00f3gica, arquitectura de soluciones y liderazgo del equipo de ingenier\u00eda.",
      bioEn:
        "Responsible for technology strategy, solutions architecture and engineering team leadership.",
      isFounder: true,
      isFeatured: true,
      sortOrder: 2,
      status: "published" as const,
    },
    {
      slug: "omar-neira",
      name: "Omar Neira",
      roleEs: "CSO (Chief Sales Officer)",
      roleEn: "CSO (Chief Sales Officer)",
      bioEs:
        "Lidera la estrategia comercial y desarrollo de nuevos mercados. Foco en expansi\u00f3n regional y partnerships estrat\u00e9gicos.",
      bioEn:
        "Leads commercial strategy and new market development. Focus on regional expansion and strategic partnerships.",
      isFounder: false,
      isFeatured: true,
      sortOrder: 3,
      status: "published" as const,
    },
    {
      slug: "fernanda-soto",
      name: "Fernanda Soto",
      roleEs: "CD / DMM (Directora de Marketing y Mercadeo)",
      roleEn: "Chief Marketing Officer",
      bioEs:
        "Responsable de posicionamiento de marca, generaci\u00f3n de demanda y estrategia digital de Nivelics.",
      bioEn: "Responsible for brand positioning, demand generation and Nivelics digital strategy.",
      isFounder: false,
      isFeatured: true,
      sortOrder: 4,
      status: "published" as const,
    },
    {
      slug: "hernando-villanueva",
      name: "Hernando Villanueva",
      roleEs: "Director Administrativo",
      roleEn: "Administrative Director",
      bioEs: "Gesti\u00f3n administrativa, financiera y operativa de la compa\u00f1\u00eda.",
      bioEn: "Administrative, financial and operational management of the company.",
      isFounder: false,
      isFeatured: true,
      sortOrder: 5,
      status: "published" as const,
    },
  ];

  for (const m of members) {
    const existing = await db
      .select()
      .from(schema.teamMembers)
      .where(eq(schema.teamMembers.slug, m.slug))
      .limit(1);
    if (existing.length > 0) {
      report.skipped.push(`team: ${m.slug}`);
      continue;
    }
    if (!DRY_RUN) {
      await db.insert(schema.teamMembers).values(m);
    }
    report.inserted.push(`team: ${m.slug}`);
  }
}

// ─── HISTORIA ITEMS ─────────────────────────────────────

async function seedHistoria() {
  log("Seeding historia_items...");

  const items = [
    {
      year: 2012,
      titleEs: "Fundaci\u00f3n",
      titleEn: "Founded",
      descriptionEs: "Nivelics nace en Bogot\u00e1 como consultora de desarrollo de software.",
      descriptionEn: "Nivelics is born in Bogot\u00e1 as a software development consultancy.",
      milestoneType: "founding" as const,
      sortOrder: 1,
    },
    {
      year: 2014,
      titleEs: "Primeros grandes clientes",
      titleEn: "First major clients",
      descriptionEs: "Contratos con empresas del sector financiero y asegurador colombiano.",
      descriptionEn: "Contracts with companies in the Colombian financial and insurance sectors.",
      milestoneType: "growth" as const,
      sortOrder: 2,
    },
    {
      year: 2016,
      titleEs: "Pivot a Cloud",
      titleEn: "Cloud pivot",
      descriptionEs: "Incorporamos servicios de arquitectura e infraestructura cloud (AWS, Azure).",
      descriptionEn: "We added cloud architecture and infrastructure services (AWS, Azure).",
      milestoneType: "product" as const,
      sortOrder: 3,
    },
    {
      year: 2018,
      titleEs: "Staff Augmentation",
      titleEn: "Staff Augmentation",
      descriptionEs:
        "Lanzamos nuestra l\u00ednea de staffing premium con +20 ingenieros dedicados.",
      descriptionEn: "We launched our premium staffing line with 20+ dedicated engineers.",
      milestoneType: "product" as const,
      sortOrder: 4,
    },
    {
      year: 2019,
      titleEs: "Expansi\u00f3n a M\u00e9xico",
      titleEn: "Mexico expansion",
      descriptionEs: "Proyecto con Televisa/N+. Primer cliente fuera de Colombia.",
      descriptionEn: "Project with Televisa/N+. First client outside Colombia.",
      milestoneType: "expansion" as const,
      sortOrder: 5,
    },
    {
      year: 2020,
      titleEs: "Expansi\u00f3n Regional",
      titleEn: "Regional expansion",
      descriptionEs:
        "Clientes en M\u00e9xico, Per\u00fa, Chile y Centroam\u00e9rica. Equipo supera las 40 personas.",
      descriptionEn: "Clients in Mexico, Peru, Chile and Central America. Team exceeds 40 people.",
      milestoneType: "expansion" as const,
      sortOrder: 6,
    },
    {
      year: 2021,
      titleEs: "Grupo Bol\u00edvar & GPTW",
      titleEn: "Grupo Bol\u00edvar & GPTW",
      descriptionEs:
        "Proyecto Grupo Bol\u00edvar. Certificaci\u00f3n Great Place to Work Colombia.",
      descriptionEn: "Grupo Bol\u00edvar project. Great Place to Work Colombia certification.",
      milestoneType: "award" as const,
      sortOrder: 7,
    },
    {
      year: 2022,
      titleEs: "Oficina Miami",
      titleEn: "Miami office",
      descriptionEs: "Apertura de sede en Miami (Nivelics LLC) para mercado US-LATAM.",
      descriptionEn: "Miami office opening (Nivelics LLC) for the US-LATAM market.",
      milestoneType: "expansion" as const,
      sortOrder: 8,
    },
    {
      year: 2023,
      titleEs: "Pr\u00e1ctica de IA",
      titleEn: "AI practice",
      descriptionEs:
        "Inicio de pr\u00e1ctica de Inteligencia Artificial. Primeros proyectos de IA generativa.",
      descriptionEn: "AI practice launch. First generative AI projects.",
      milestoneType: "product" as const,
      sortOrder: 9,
    },
    {
      year: 2024,
      titleEs: "IA & FinOps",
      titleEn: "AI & FinOps",
      descriptionEs:
        "Lanzamiento formal de pr\u00e1cticas de IA y FinOps. Marco estrat\u00e9gico I+C+S.",
      descriptionEn: "Formal launch of AI and FinOps practices. I+C+S strategic framework.",
      milestoneType: "product" as const,
      sortOrder: 10,
    },
    {
      year: 2025,
      titleEs: "Argentina & Consolidaci\u00f3n",
      titleEn: "Argentina & consolidation",
      descriptionEs:
        "Expansi\u00f3n a Argentina (Cr\u00f3nica). +200 proyectos entregados acumulados.",
      descriptionEn: "Expansion to Argentina (Cr\u00f3nica). 200+ cumulative projects delivered.",
      milestoneType: "expansion" as const,
      sortOrder: 11,
    },
    {
      year: 2026,
      titleEs: "Hoy",
      titleEn: "Today",
      descriptionEs:
        "+50 ingenieros, presencia en 8 pa\u00edses, consolidaci\u00f3n del marco I+C+S.",
      descriptionEn:
        "50+ engineers, presence in 8 countries, consolidation of the I+C+S framework.",
      milestoneType: "growth" as const,
      sortOrder: 12,
    },
  ];

  const existing = await db.select().from(schema.historiaItems).limit(1);
  if (existing.length > 0) {
    report.skipped.push("historia_items (already seeded)");
    return;
  }

  for (const item of items) {
    if (!DRY_RUN) {
      await db.insert(schema.historiaItems).values(item);
    }
  }
  report.inserted.push(`historia_items: ${items.length} milestones`);
}

// ─── CERTIFICACIONES ────────────────────────────────────

async function seedCertificaciones() {
  log("Seeding certificaciones...");

  const certs = [
    {
      nameEs: "Great Place to Work Colombia 2022",
      nameEn: "Great Place to Work Colombia 2022",
      issuer: "Great Place to Work",
      year: 2022,
      descriptionEs:
        "Nivelics fue certificada como Great Place to Work en Colombia en 2022, reconociendo nuestra cultura organizacional basada en la confianza, el respeto y el desarrollo profesional de nuestro equipo.",
      descriptionEn:
        "Nivelics was certified as a Great Place to Work in Colombia in 2022, recognizing our organizational culture based on trust, respect and the professional development of our team.",
      sortOrder: 1,
    },
    {
      nameEs: "Miembro ANDI",
      nameEn: "ANDI Member",
      issuer: "ANDI",
      descriptionEs:
        "Somos miembros activos de la Asociaci\u00f3n Nacional de Empresarios de Colombia (ANDI), la agremiaci\u00f3n empresarial m\u00e1s importante del pa\u00eds.",
      descriptionEn:
        "We are active members of the National Association of Colombian Entrepreneurs (ANDI), the country's most important business association.",
      sortOrder: 2,
    },
    {
      nameEs: "Nivelics LLC \u2014 Presencia USA",
      nameEn: "Nivelics LLC \u2014 USA Presence",
      issuer: "Nivelics LLC",
      descriptionEs:
        "A trav\u00e9s de Nivelics LLC, nuestra entidad en Estados Unidos con sede en Miami, Florida, atendemos clientes en el mercado norteamericano.",
      descriptionEn:
        "Through Nivelics LLC, our US entity headquartered in Miami, Florida, we serve clients in the North American market.",
      sortOrder: 3,
    },
  ];

  const existing = await db.select().from(schema.certificaciones).limit(1);
  if (existing.length > 0) {
    report.skipped.push("certificaciones (already seeded)");
    return;
  }

  for (const cert of certs) {
    if (!DRY_RUN) {
      await db.insert(schema.certificaciones).values(cert);
    }
  }
  report.inserted.push(`certificaciones: ${certs.length} items`);
}

// ─── PAGES GENERAL ──────────────────────────────────────

async function seedPagesGeneral() {
  log("Seeding pages_general...");

  const pages = [
    {
      slugEs: "contacto",
      slugEn: "contact",
      pageType: "contact" as const,
      titleEs: "Hablemos",
      titleEn: "Let\u2019s Talk",
      seoTitleEs: "Contacto | Nivelics",
      seoTitleEn: "Contact | Nivelics",
      seoDescriptionEs:
        "Cu\u00e9ntanos sobre tu proyecto o desaf\u00edo tecnol\u00f3gico. Te contactamos en menos de 24 horas.",
      seoDescriptionEn:
        "Tell us about your project or technology challenge. We\u2019ll get back to you within 24 hours.",
      translationStatusEn: "complete" as const,
    },
    {
      slugEs: "privacidad",
      slugEn: "privacy",
      pageType: "privacy" as const,
      titleEs: "Pol\u00edtica de Privacidad",
      titleEn: "Privacy Policy",
      seoTitleEs: "Pol\u00edtica de Privacidad | Nivelics",
      seoTitleEn: "Privacy Policy | Nivelics",
      seoDescriptionEs:
        "Pol\u00edtica de privacidad de Nivelics SAS. Informaci\u00f3n sobre el tratamiento de datos personales.",
      seoDescriptionEn: "Nivelics SAS privacy policy. Information about personal data processing.",
      translationStatusEn: "pending" as const,
    },
    {
      slugEs: "soporte",
      slugEn: "support",
      pageType: "support" as const,
      titleEs: "Soporte y Contacto T\u00e9cnico",
      titleEn: "Support & Technical Contact",
      seoTitleEs: "Soporte y Contacto T\u00e9cnico | Nivelics",
      seoTitleEn: "Support & Technical Contact | Nivelics",
      seoDescriptionEs: "Soporte t\u00e9cnico Nivelics. Contacto por WhatsApp y email.",
      seoDescriptionEn: "Nivelics technical support. Contact via WhatsApp and email.",
      translationStatusEn: "pending" as const,
    },
    {
      slugEs: "trabaja-con-nosotros",
      slugEn: "careers",
      pageType: "careers" as const,
      titleEs: "Trabaja con Nivelics",
      titleEn: "Careers at Nivelics",
      seoTitleEs: "Trabaja con Nivelics | \u00danete al Equipo",
      seoTitleEn: "Careers at Nivelics | Join the Team",
      seoDescriptionEs: "\u00danete al equipo de Nivelics. Cultura directa, humana y ambiciosa.",
      seoDescriptionEn: "Join the Nivelics team. Direct, human and ambitious culture.",
      translationStatusEn: "pending" as const,
    },
  ];

  for (const page of pages) {
    const existing = await db
      .select()
      .from(schema.pagesGeneral)
      .where(eq(schema.pagesGeneral.slugEs, page.slugEs))
      .limit(1);
    if (existing.length > 0) {
      report.skipped.push(`page: ${page.slugEs}`);
      continue;
    }
    if (!DRY_RUN) {
      await db.insert(schema.pagesGeneral).values(page);
    }
    report.inserted.push(`page: ${page.slugEs}`);
  }
}

// ─── BLOG POSTS ─────────────────────────────────────────

async function seedBlogPosts() {
  log("Seeding blog_posts...");

  const posts = [
    {
      slug: "como-implementar-ia-generativa-en-tu-empresa",
      titleEs: "C\u00f3mo implementar IA generativa en tu empresa: gu\u00eda pr\u00e1ctica 2026",
      excerptEs:
        "Una gu\u00eda paso a paso para adoptar LLMs y agentes de IA en procesos empresariales reales.",
      readingTimeMinutes: 8,
      status: "published" as const,
      translationStatusEn: "pending" as const,
      tags: ["ia", "llm", "agentes"],
    },
    {
      slug: "finops-guia-completa",
      titleEs: "FinOps: la gu\u00eda completa para optimizar tu inversi\u00f3n cloud",
      excerptEs:
        "Todo lo que necesitas saber sobre FinOps, desde los fundamentos hasta la implementaci\u00f3n.",
      readingTimeMinutes: 12,
      status: "published" as const,
      translationStatusEn: "pending" as const,
      tags: ["finops", "cloud", "optimizacion"],
    },
    {
      slug: "staff-augmentation-vs-outsourcing",
      titleEs: "Staff Augmentation vs Outsourcing: \u00bfcu\u00e1l es mejor para tu proyecto?",
      excerptEs:
        "An\u00e1lisis comparativo de modelos de contrataci\u00f3n de talento tech con pros y contras.",
      readingTimeMinutes: 6,
      status: "published" as const,
      translationStatusEn: "pending" as const,
      tags: ["staffing", "outsourcing", "talento"],
    },
    {
      slug: "migracion-cloud-errores-comunes",
      titleEs: "5 errores comunes en migraciones cloud (y c\u00f3mo evitarlos)",
      excerptEs: "Lecciones aprendidas de +50 migraciones cloud exitosas en empresas B2B.",
      readingTimeMinutes: 7,
      status: "published" as const,
      translationStatusEn: "pending" as const,
      tags: ["cloud", "migracion", "aws"],
    },
  ];

  for (const post of posts) {
    const existing = await db
      .select()
      .from(schema.blogPosts)
      .where(eq(schema.blogPosts.slug, post.slug))
      .limit(1);
    if (existing.length > 0) {
      report.skipped.push(`blog: ${post.slug}`);
      continue;
    }
    if (!DRY_RUN) {
      await db.insert(schema.blogPosts).values(post);
    }
    report.inserted.push(`blog: ${post.slug}`);
  }
}

// ─── MAIN ───────────────────────────────────────────────

async function main() {
  console.log("=== Nivelics Content Seed Script ===");
  if (DRY_RUN) console.log("*** DRY RUN MODE — no DB writes ***\n");

  try {
    await upsertHomeContent();
    await upsertSiteConfig();
    await seedServicios();
    await seedIndustrias();
    await seedCasosExito();
    await seedTeamMembers();
    await seedHistoria();
    await seedCertificaciones();
    await seedPagesGeneral();
    await seedBlogPosts();

    console.log("\n=== SEED REPORT ===");
    console.log(`Inserted: ${report.inserted.length}`);
    for (const i of report.inserted) console.log(`  + ${i}`);
    console.log(`Skipped:  ${report.skipped.length}`);
    for (const s of report.skipped) console.log(`  - ${s}`);
    if (report.errors.length > 0) {
      console.log(`Errors:   ${report.errors.length}`);
      for (const e of report.errors) console.log(`  ! ${e}`);
    }
    console.log("\nDone.");
  } catch (err) {
    console.error("Seed failed:", err);
    process.exit(1);
  }

  process.exit(0);
}

main();
