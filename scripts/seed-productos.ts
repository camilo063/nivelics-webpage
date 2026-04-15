import { drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";
import { eq } from "drizzle-orm";
import { productos } from "../lib/db/schema/admin";

const seed = [
  {
    slugEs: "paywl",
    slugEn: "paywl",
    name: "PAYWL",
    taglineEs: "Motor de paywall para medios digitales en LATAM",
    taglineEn: "Paywall engine for digital media in LATAM",
    descriptionEs:
      "Convierte tu audiencia en suscriptores sin depender de tu CMS. Arquitectura desacoplada con API REST, reglas de acceso configurables sin código, pasarelas locales (MercadoPago, PSE, Wompi) y datos 100% tuyos en AWS. La alternativa LATAM-first a Piano.io a 1/7 del precio.",
    descriptionEn:
      "Convert your audience into subscribers without depending on your CMS. Decoupled architecture with REST API, no-code access rules, local payment gateways (MercadoPago, PSE, Wompi) and 100% your data on AWS. The LATAM-first alternative to Piano.io at 1/7 the price.",
    externalUrl: "https://paywl.io",
    externalCtaEs: "Ir a paywl.io",
    externalCtaEn: "Go to paywl.io",
    icpEs: "Medios digitales LATAM con 100K–5M page views/mes",
    icpEn: "LATAM digital media with 100K–5M page views/month",
    categoryEs: "Medios · LATAM",
    categoryEn: "Media · LATAM",
    pricingFrom: 450,
    pricingCurrency: "USD",
    pricingLabelEs: "Desde $450/mes",
    pricingLabelEn: "From $450/month",
    pricingNoteEs: "Piloto gratuito de 90 días para medios elegibles",
    pricingNoteEn: "90-day free pilot for eligible media companies",
    metrics: [
      { value: "$450", labelEs: "vs $3,000 de Piano.io", labelEn: "vs $3,000 Piano.io" },
      { value: "<2 meses", labelEs: "implementación", labelEn: "implementation" },
      { value: "5", labelEs: "tipos de muro", labelEn: "wall types" },
      { value: "100%", labelEs: "datos tuyos", labelEn: "your data" },
    ],
    features: [
      {
        icon: "oct-lock",
        titleEs: "Reglas sin código",
        titleEn: "No-code rules",
        descriptionEs:
          "Configura quién puede leer qué, en cuánto tiempo y bajo qué condiciones — sin tocar una línea de código. El Editor Jefe lo hace desde el celular.",
        descriptionEn:
          "Configure who can read what, in how much time and under what conditions — without touching a line of code. The Editor-in-Chief does it from their phone.",
      },
      {
        icon: "hex-chart",
        titleEs: "Pasarelas LATAM nativas",
        titleEn: "Native LATAM gateways",
        descriptionEs:
          "MercadoPago, PSE, Wompi. Más del 70% de las transacciones digitales en LATAM usan pasarelas locales. Piano.io solo tiene Stripe.",
        descriptionEn:
          "MercadoPago, PSE, Wompi. Over 70% of digital transactions in LATAM use local gateways. Piano.io only has Stripe.",
      },
      {
        icon: "oct-cube",
        titleEs: "Datos 100% tuyos en AWS",
        titleEn: "100% your data on AWS",
        descriptionEs:
          "Infraestructura dedicada en AWS. Exporta en CSV o JSON en cualquier momento sin cargos adicionales.",
        descriptionEn:
          "Dedicated AWS infrastructure. Export in CSV or JSON at any time with no extra charges.",
      },
      {
        icon: "tri-person",
        titleEs: "CRM de audiencia de pago",
        titleEn: "Paid audience CRM",
        descriptionEs:
          "Suscripciones, historial de pagos, alertas de renovación y gestión de acceso integrada con tu pasarela de pagos local.",
        descriptionEn:
          "Subscriptions, payment history, renewal alerts and access management integrated with your local payment gateway.",
      },
    ],
    comparisonTable: {
      headersEs: ["Proveedor", "Setup", "Mensualidad", "Pasarela LATAM", "Datos propios"],
      headersEn: ["Provider", "Setup", "Monthly fee", "LATAM Gateway", "Your data"],
      rows: [
        {
          featureEs: "Piano.io",
          featureEn: "Piano.io",
          isNivelicsProduct: false,
          values: ["$10k-$25k", "~$3,000", "Solo Stripe", "No"],
        },
        {
          featureEs: "Pelcro",
          featureEn: "Pelcro",
          isNivelicsProduct: false,
          values: ["$0-$2,500", "$800", "Solo Stripe", "No"],
        },
        {
          featureEs: "Evolok",
          featureEn: "Evolok",
          isNivelicsProduct: false,
          values: ["~$5,000", "~$1,500", "Internacional", "No"],
        },
        {
          featureEs: "PAYWL (Nivelics)",
          featureEn: "PAYWL (Nivelics)",
          isNivelicsProduct: true,
          values: ["$0 (Piloto)", "$450-$850", "MP, PSE, Wompi", "100%"],
        },
      ],
    },
    faqs: [
      {
        questionEs: "¿Necesito cambiar mi CMS actual para usar PAYWL?",
        questionEn: "Do I need to change my current CMS to use PAYWL?",
        answerEs:
          "No. PAYWL es completamente independiente de tu CMS. Se integra mediante API REST en menos de 2 meses sin modificar tu infraestructura existente.",
        answerEn:
          "No. PAYWL is completely independent of your CMS. It integrates via REST API in less than 2 months without modifying your existing infrastructure.",
      },
      {
        questionEs: "¿Qué pasarelas de pago soporta PAYWL en LATAM?",
        questionEn: "What payment gateways does PAYWL support in LATAM?",
        answerEs:
          "MercadoPago, PSE, Wompi, Nequi y más. Si usas una pasarela diferente, podemos integrarla. El plan Enterprise incluye pasarelas ilimitadas vía API/SDK.",
        answerEn:
          "MercadoPago, PSE, Wompi, Nequi and more. If you use a different gateway, we can integrate it. The Enterprise plan includes unlimited gateways via API/SDK.",
      },
      {
        questionEs: "¿Qué pasa con mis datos si decido cambiar de plataforma?",
        questionEn: "What happens to my data if I decide to switch platforms?",
        answerEs:
          "Te entregamos todo tu historial de suscriptores en formatos estándar (CSV, JSON) sin cargos adicionales ni procesos complicados.",
        answerEn:
          "We deliver your complete subscriber history in standard formats (CSV, JSON) with no extra charges or complicated processes.",
      },
    ],
    accentColor: "cyan",
    heroEffect: "particles",
    seoTitleEs: "PAYWL — Motor de paywall para medios LATAM | Nivelics",
    seoTitleEn: "PAYWL — Paywall engine for LATAM media | Nivelics",
    seoDescriptionEs:
      "Motor de paywall SaaS para medios en LATAM. MercadoPago, PSE, Wompi. Desde $450/mes. Alternativa a Piano.io con datos 100% tuyos.",
    seoDescriptionEn:
      "SaaS paywall engine for LATAM media. MercadoPago, PSE, Wompi. From $450/month. Alternative to Piano.io with 100% your data.",
    schemaCategory: "BusinessApplication",
    status: "published" as const,
    translationStatusEn: "complete" as const,
    sortOrder: 1,
    publishedAt: new Date(),
  },
  {
    slugEs: "niveleads",
    slugEn: "niveleads",
    name: "Niveleads",
    taglineEs: "Lead scoring B2B con inteligencia artificial",
    taglineEn: "B2B lead scoring with artificial intelligence",
    descriptionEs:
      "Clasifica automáticamente cada prospecto como HOT, WARM o COLD usando inteligencia artificial. Secuencias de email multi-paso, enriquecimiento de datos, monitor de LinkedIn y pipeline configurable. Setup en menos de 24 horas, sin tarjeta de crédito.",
    descriptionEn:
      "Automatically classifies each prospect as HOT, WARM or COLD using artificial intelligence. Multi-step email sequences, data enrichment, LinkedIn monitor and configurable pipeline. Setup in less than 24 hours, no credit card required.",
    externalUrl: "https://leads.nivelics.com",
    externalCtaEs: "Ver demo gratis",
    externalCtaEn: "See free demo",
    icpEs: "Equipos de ventas B2B: SDRs, Account Executives y Revenue Operations",
    icpEn: "B2B sales teams: SDRs, Account Executives and Revenue Operations",
    categoryEs: "Ventas B2B · IA",
    categoryEn: "B2B Sales · AI",
    pricingFrom: 99,
    pricingCurrency: "USD",
    pricingLabelEs: "Desde $99/mes",
    pricingLabelEn: "From $99/month",
    pricingNoteEs: "Menos que 2 horas de un SDR por mes",
    pricingNoteEn: "Less than 2 hours of an SDR per month",
    metrics: [
      { value: "+5,000", labelEs: "leads gestionados", labelEn: "leads managed" },
      { value: "9", labelEs: "fuentes de datos", labelEn: "data sources" },
      { value: "24h", labelEs: "setup promedio", labelEn: "average setup" },
      { value: "$99", labelEs: "desde/mes", labelEn: "from/month" },
    ],
    features: [
      {
        icon: "dia-pulse",
        titleEs: "Scoring HOT/WARM/COLD con IA",
        titleEn: "HOT/WARM/COLD AI scoring",
        descriptionEs:
          "El score se calcula en tiempo real considerando cargo, industria, empresa, interacciones en LinkedIn, apertura de emails y análisis de IA.",
        descriptionEn:
          "The score is calculated in real time considering role, industry, company, LinkedIn interactions, email opens and AI analysis.",
      },
      {
        icon: "dia-flow",
        titleEs: "Secuencias de email automatizadas",
        titleEn: "Automated email sequences",
        descriptionEs:
          "Crea flujos de outreach multi-paso con personalización por variables. Outreach automatizado al momento correcto con seguimiento en tiempo real.",
        descriptionEn:
          "Create multi-step outreach flows with variable personalization. Automated outreach at the right moment with real-time tracking.",
      },
      {
        icon: "dia-search",
        titleEs: "Enriquecimiento de datos",
        titleEn: "Data enrichment",
        descriptionEs:
          "Completa automáticamente el perfil de cada lead: empresa, cargo, email, teléfono y más desde 9 fuentes de datos combinadas.",
        descriptionEn:
          "Automatically completes each lead profile: company, role, email, phone and more from 9 combined data sources.",
      },
      {
        icon: "tri-growth",
        titleEs: "Pipeline de ventas configurable",
        titleEn: "Configurable sales pipeline",
        descriptionEs:
          "Gestiona cada oportunidad a través de etapas configurables. Asigna leads a comerciales y mantén a todo el equipo alineado.",
        descriptionEn:
          "Manage each opportunity through configurable stages. Assign leads to sales reps and keep the entire team aligned.",
      },
    ],
    comparisonTable: null,
    faqs: [
      {
        questionEs: "¿Puedo importar mis leads desde LinkedIn o un CRM?",
        questionEn: "Can I import my leads from LinkedIn or a CRM?",
        answerEs:
          "Sí. Niveleads permite importar desde LinkedIn Sales Navigator, CSV masivo o conexión directa con tu CRM. El setup completo toma menos de 24 horas.",
        answerEn:
          "Yes. Niveleads allows importing from LinkedIn Sales Navigator, bulk CSV or direct connection with your CRM. The complete setup takes less than 24 hours.",
      },
      {
        questionEs: "¿Cómo funciona el scoring de IA?",
        questionEn: "How does AI scoring work?",
        answerEs:
          "El score base usa IA para analizar señales de comportamiento. Además, puedes configurar reglas propias desde el panel — por ejemplo, dar más peso a un cargo o industria objetivo.",
        answerEn:
          "The base score uses AI to analyze behavioral signals. You can also configure your own rules from the dashboard — for example, giving more weight to a specific role or target industry.",
      },
      {
        questionEs: "¿Niveleads se integra con mi CRM actual (Odoo, HubSpot, Salesforce)?",
        questionEn: "Does Niveleads integrate with my current CRM (Odoo, HubSpot, Salesforce)?",
        answerEs:
          "Sí, el plan Growth y Enterprise incluyen integraciones con los principales CRMs. El plan Starter permite integración manual vía CSV o webhook.",
        answerEn:
          "Yes, the Growth and Enterprise plans include integrations with major CRMs. The Starter plan allows manual integration via CSV or webhook.",
      },
    ],
    accentColor: "teal",
    heroEffect: "grid",
    seoTitleEs: "Niveleads — Lead scoring B2B con IA | Nivelics",
    seoTitleEn: "Niveleads — B2B lead scoring with AI | Nivelics",
    seoDescriptionEs:
      "Clasifica prospectos como HOT, WARM o COLD con IA. Secuencias email automatizadas. Setup en 24h. Desde $99/mes.",
    seoDescriptionEn:
      "Classify prospects as HOT, WARM or COLD with AI. Automated email sequences. Setup in 24h. From $99/month.",
    schemaCategory: "BusinessApplication",
    status: "published" as const,
    translationStatusEn: "complete" as const,
    sortOrder: 2,
    publishedAt: new Date(),
  },
  {
    slugEs: "hirely",
    slugEn: "hirely",
    name: "Hirely",
    taglineEs: "Reclutamiento inteligente del CV al contrato firmado",
    taglineEn: "Intelligent recruitment from CV to signed contract",
    descriptionEs:
      "Automatiza todo el ciclo de selección: parsing de CV con Claude AI, entrevistas por voz con IA, evaluaciones técnicas, firma digital con SignWell y onboarding. 10 módulos, 7 fases completamente automatizadas.",
    descriptionEn:
      "Automates the entire recruitment cycle: CV parsing with Claude AI, AI voice interviews, technical assessments, digital signing with SignWell and onboarding. 10 modules, 7 fully automated phases.",
    externalUrl: "https://hirely-sepia.vercel.app",
    externalCtaEs: "Ver demo",
    externalCtaEn: "See demo",
    icpEs: "Equipos de RR.HH. y empresas colombianas que contratan perfiles tecnológicos",
    icpEn: "HR teams and Colombian companies hiring technology profiles",
    categoryEs: "Recursos Humanos · IA",
    categoryEn: "Human Resources · AI",
    pricingFrom: null,
    pricingCurrency: "USD",
    pricingLabelEs: "Demo gratis · Acceso anticipado",
    pricingLabelEn: "Free demo · Early access",
    pricingNoteEs: "Producto en fase de lanzamiento.",
    pricingNoteEn: "Product in launch phase.",
    metrics: [
      { value: "10", labelEs: "módulos integrados", labelEn: "integrated modules" },
      { value: "7", labelEs: "fases automatizadas", labelEn: "automated phases" },
      { value: "90%", labelEs: "MVP completo", labelEn: "complete MVP" },
      { value: "Claude AI", labelEs: "parsing de CV", labelEn: "CV parsing" },
    ],
    features: [
      {
        icon: "dia-pulse",
        titleEs: "CV parsing con Claude AI",
        titleEn: "CV parsing with Claude AI",
        descriptionEs:
          "Claude AI extrae y estructura automáticamente la información de cada CV y asigna un puntaje ATS en 6 dimensiones objetivas de 0 a 100.",
        descriptionEn:
          "Claude AI automatically extracts and structures information from each CV and assigns an ATS score in 6 objective dimensions from 0 to 100.",
      },
      {
        icon: "arc-broadcast",
        titleEs: "Entrevistas por voz con IA",
        titleEn: "AI voice interviews",
        descriptionEs:
          "Agente de voz llama automáticamente al candidato, conduce la entrevista y genera un análisis de 5 competencias con Claude AI.",
        descriptionEn:
          "Voice agent automatically calls the candidate, conducts the interview and generates a 5-competency analysis with Claude AI.",
      },
      {
        icon: "oct-code",
        titleEs: "Firma digital con SignWell",
        titleEn: "Digital signing with SignWell",
        descriptionEs:
          "3 tipos de contrato colombianos con variables dinámicas. Firma bilateral electrónica vía SignWell con trazabilidad y versionamiento completo.",
        descriptionEn:
          "3 Colombian contract types with dynamic variables. Bilateral electronic signing via SignWell with complete traceability and versioning.",
      },
      {
        icon: "hex-chart",
        titleEs: "Score final objetivo de 4 fuentes",
        titleEn: "Objective final score from 4 sources",
        descriptionEs:
          "Score ponderado: ATS (20%) + entrevista IA (30%) + evaluación técnica (30%) + entrevista humana (20%). Sin subjetividad.",
        descriptionEn:
          "Weighted score: ATS (20%) + AI interview (30%) + technical assessment (30%) + human interview (20%). No subjectivity.",
      },
    ],
    comparisonTable: null,
    faqs: [
      {
        questionEs: "¿Hirely funciona solo para empresas colombianas?",
        questionEn: "Does Hirely work only for Colombian companies?",
        answerEs:
          "El sistema de contratos está optimizado para Colombia. La plataforma ATS en sí puede usarse en cualquier país latinoamericano.",
        answerEn:
          "The contract system is optimized for Colombia. The ATS platform itself can be used in any Latin American country.",
      },
      {
        questionEs: "¿Qué tan automatizado está realmente el proceso?",
        questionEn: "How automated is the process really?",
        answerEs:
          "Las fases de CV parsing, entrevista IA por voz, evaluación técnica y score final son 100% automáticas sin intervención humana.",
        answerEn:
          "The CV parsing, AI voice interview, technical assessment and final score phases are 100% automatic without human intervention.",
      },
    ],
    accentColor: "violet",
    heroEffect: "hex",
    seoTitleEs: "Hirely — Reclutamiento inteligente con IA | Nivelics",
    seoTitleEn: "Hirely — Intelligent recruitment with AI | Nivelics",
    seoDescriptionEs:
      "ATS con Claude AI, entrevistas por voz, firma digital SignWell. Del CV al contrato firmado en un solo flujo automatizado.",
    seoDescriptionEn:
      "ATS with Claude AI, voice interviews, SignWell digital signing. From CV to signed contract in a single automated flow.",
    schemaCategory: "WebApplication",
    status: "published" as const,
    translationStatusEn: "complete" as const,
    sortOrder: 3,
    publishedAt: new Date(),
  },
];

async function main() {
  const db = drizzle(neon(process.env.DATABASE_URL!), { schema: { productos } });

  for (const p of seed) {
    const existing = await db.select().from(productos).where(eq(productos.slugEs, p.slugEs));
    if (existing.length > 0) {
      await db
        .update(productos)
        .set({ ...p, updatedAt: new Date() })
        .where(eq(productos.slugEs, p.slugEs));
      console.log(`↻ Updated: ${p.name}`);
    } else {
      await db.insert(productos).values(p);
      console.log(`+ Inserted: ${p.name}`);
    }
  }

  console.log("✅ Seed de productos completado: PAYWL, Niveleads, Hirely");
  process.exit(0);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
