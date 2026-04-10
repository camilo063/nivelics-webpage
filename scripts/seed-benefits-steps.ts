/**
 * Seed benefits[] and process_steps[] for ALL servicios from hardcoded page content.
 * Translates ES→EN via Anthropic API, then updates DB.
 *
 * Usage: DATABASE_URL="..." ANTHROPIC_API_KEY="..." npx tsx scripts/seed-benefits-steps.ts
 */

import { drizzle } from "drizzle-orm/node-postgres";
import { eq } from "drizzle-orm";
import * as schema from "../lib/db/schema/admin";

const db = drizzle(process.env.DATABASE_URL!, { schema });
const API_KEY = process.env.ANTHROPIC_API_KEY!;
if (!API_KEY) {
  console.error("ANTHROPIC_API_KEY required");
  process.exit(1);
}

let translated = 0,
  errors = 0;

async function tr(text: string, ctx: string): Promise<string> {
  if (!text) return "";
  for (let i = 0; i < 3; i++) {
    try {
      const r = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": API_KEY,
          "anthropic-version": "2023-06-01",
        },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1024,
          system:
            "Translate ES→EN for Nivelics (B2B tech: AI, Cloud, Staff Augmentation). Tone: direct, confident. Do NOT translate: Staff Augmentation, FinOps, Cloud, Sprint, KPI, SLA, ROI. Return ONLY translation.",
          messages: [{ role: "user", content: text }],
        }),
      });
      if (r.status === 429) {
        console.log(`    Rate limited, waiting 60s...`);
        await delay(60000);
        continue;
      }
      if (!r.ok) throw new Error(`API ${r.status}`);
      const d = await r.json();
      translated++;
      await delay(13000);
      return d.content?.[0]?.text || "";
    } catch (e) {
      if (i === 2) {
        console.log(`    ERROR: ${ctx} — ${(e as Error).message}`);
        errors++;
        return "";
      }
      await delay(15000);
    }
  }
  return "";
}

function delay(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}

// ═══════════════════════════════════════════════════════
// ALL HARDCODED CONTENT — EXACT TEXT FROM PAGE.TSX FILES
// ═══════════════════════════════════════════════════════

interface BenefitES {
  icon: string;
  titleEs: string;
  copyEs: string;
}
interface StepES {
  number: number;
  titleEs: string;
  descEs: string;
  duration: string;
}

const CONTENT: Record<string, { benefits: BenefitES[]; steps: StepES[] }> = {
  // ─── IA HUB ────────────────────────────────────────────
  "inteligencia-artificial": {
    benefits: [
      {
        icon: "brain",
        titleEs: "50% reducción costos operativos",
        copyEs: "Automatización inteligente de procesos repetitivos",
      },
      {
        icon: "zap",
        titleEs: "Primer agente en 6-8 semanas",
        copyEs: "De concepto a producción rápidamente",
      },
      {
        icon: "link",
        titleEs: "Integrado con tus sistemas",
        copyEs: "CRM, ERP y flujos existentes",
      },
    ],
    steps: [
      {
        number: 1,
        titleEs: "Discovery de procesos",
        descEs: "Identificamos qué procesos tienen mayor ROI al automatizar.",
        duration: "Semana 1",
      },
      {
        number: 2,
        titleEs: "POC funcional",
        descEs: "Construimos una prueba de concepto en tu entorno real.",
        duration: "Semanas 2-3",
      },
      {
        number: 3,
        titleEs: "MVP a producción",
        descEs: "Refinamos, integramos y lanzamos a producción con monitoreo.",
        duration: "Semanas 4-8",
      },
      {
        number: 4,
        titleEs: "Operación continua",
        descEs: "Monitoreamos, evaluamos y evolucionamos el agente.",
        duration: "MRR ongoing",
      },
    ],
  },
  // ─── IA SUBSERVICIOS ───────────────────────────────────
  "agentes-ia": {
    benefits: [
      {
        icon: "bot",
        titleEs: "Agentes autónomos 24/7",
        copyEs:
          "Ejecutan tareas complejas sin intervención humana, conectados a tus sistemas con trazabilidad completa",
      },
      {
        icon: "zap",
        titleEs: "Primer agente en 6-8 semanas",
        copyEs: "Desde discovery hasta producción con metodología probada",
      },
      {
        icon: "shield",
        titleEs: "Trazabilidad completa",
        copyEs: "Logging, evals y alertas en cada ejecución del agente",
      },
    ],
    steps: [],
  },
  "agentes-comerciales": {
    benefits: [
      {
        icon: "target",
        titleEs: "Calificación automática MEDDPICC",
        copyEs: "Scoring de leads con criterios personalizados para tu negocio",
      },
      {
        icon: "mail",
        titleEs: "Seguimiento multicanal",
        copyEs: "Email, WhatsApp y chat en vivo con cadencias personalizadas",
      },
      {
        icon: "refresh-cw",
        titleEs: "Sync en tiempo real con CRM",
        copyEs: "Integración directa con Odoo, HubSpot y Salesforce",
      },
    ],
    steps: [],
  },
  "automatizacion-procesos": {
    benefits: [
      {
        icon: "clock",
        titleEs: "50% reducción tiempo operativo",
        copyEs: "Promedio documentado en proyectos de automatización",
      },
      {
        icon: "link",
        titleEs: "Integración con sistemas legacy",
        copyEs: "Sin necesidad de reemplazar tus sistemas actuales",
      },
      {
        icon: "file-check",
        titleEs: "Log completo para auditoría",
        copyEs: "Cada ejecución registrada para compliance",
      },
    ],
    steps: [],
  },
  "gestion-contenido": {
    benefits: [
      {
        icon: "file-text",
        titleEs: "10x más volumen de contenido",
        copyEs: "Artículos, landing pages y descripciones optimizados para SEO",
      },
      {
        icon: "users",
        titleEs: "Variantes por segmento",
        copyEs: "Contenido adaptado automáticamente por audiencia",
      },
      {
        icon: "upload",
        titleEs: "Publicación directa a CMS",
        copyEs: "Integración via API con tu CMS existente",
      },
    ],
    steps: [],
  },
  "marketing-crm": {
    benefits: [
      {
        icon: "bar-chart-3",
        titleEs: "Segmentación predictiva en tiempo real",
        copyEs: "Se recalcula automáticamente con cada interacción",
      },
      {
        icon: "user",
        titleEs: "Personalización 1:1 a escala",
        copyEs: "Cada lead recibe el mensaje correcto en el momento correcto",
      },
      {
        icon: "refresh-cw",
        titleEs: "Sync en tiempo real con CRM",
        copyEs: "Integración directa con Odoo, HubSpot y Salesforce",
      },
    ],
    steps: [],
  },
  // ─── CLOUD HUB ─────────────────────────────────────────
  cloud: {
    benefits: [
      {
        icon: "trending-down",
        titleEs: "30-40% reducción gasto cloud",
        copyEs: "Promedio en proyectos FinOps en los primeros 90 días",
      },
      {
        icon: "shield",
        titleEs: "Zero downtime en migraciones",
        copyEs: "Estrategia de rollback siempre activa",
      },
      {
        icon: "activity",
        titleEs: "SLA de uptime 99.9%",
        copyEs: "En operación de infraestructura continua",
      },
    ],
    steps: [
      {
        number: 1,
        titleEs: "Discovery y auditoría",
        descEs:
          "Analizamos tu factura cloud, identificamos recursos huérfanos y oportunidades de optimización.",
        duration: "Semana 1-2",
      },
      {
        number: 2,
        titleEs: "Quick wins",
        descEs:
          "Eliminamos recursos sin uso, optimizamos instancias y configuramos Reserved Instances.",
        duration: "Semana 3-4",
      },
      {
        number: 3,
        titleEs: "Gobierno y automatización",
        descEs: "Tagging, budgets, alertas automáticas y dashboard en tiempo real.",
        duration: "Semana 5-6",
      },
      {
        number: 4,
        titleEs: "Operación continua",
        descEs: "Revisión mensual, ajustes proactivos y reporte de ahorro acumulado.",
        duration: "MRR",
      },
    ],
  },
  // ─── CLOUD SUBSERVICIOS ────────────────────────────────
  finops: {
    benefits: [
      {
        icon: "eye",
        titleEs: "Visibilidad",
        copyEs: "Dashboards en tiempo real de consumo por equipo, servicio y ambiente.",
      },
      {
        icon: "trending-down",
        titleEs: "Optimización",
        copyEs: "Rightsizing, reserved instances, spot fleet y eliminación de recursos huérfanos.",
      },
      {
        icon: "pie-chart",
        titleEs: "Asignación de Costos",
        copyEs: "Tagging strategy, showback/chargeback y unit economics por producto.",
      },
      {
        icon: "bar-chart",
        titleEs: "Forecasting",
        copyEs: "Proyección de costos con modelos predictivos y alertas de anomalías.",
      },
      {
        icon: "settings",
        titleEs: "Gobernanza",
        copyEs: "Políticas automatizadas, budgets y aprobación de recursos costosos.",
      },
      {
        icon: "dollar-sign",
        titleEs: "Cultura FinOps",
        copyEs: "Capacitación de equipos, ceremonias FinOps y métricas de eficiencia.",
      },
    ],
    steps: [],
  },
  "migracion-aws": {
    benefits: [
      {
        icon: "clipboard-check",
        titleEs: "Assessment y estrategia de migración",
        copyEs:
          "Evaluamos tu infraestructura actual, definimos la estrategia de migración (rehost, replatform, refactor) y el roadmap paso a paso.",
      },
      {
        icon: "shield-check",
        titleEs: "Zero downtime con rollback",
        copyEs:
          "Migración sin interrupciones con plan de rollback probado, validación continua y cutover controlado para cero impacto en tu operación.",
      },
      {
        icon: "gauge",
        titleEs: "Optimización post-migración",
        copyEs:
          "Rightsizing, reserved instances y monitoreo de costos desde el primer día en AWS para maximizar tu inversión en la nube.",
      },
    ],
    steps: [],
  },
  infraestructura: {
    benefits: [
      {
        icon: "cloud",
        titleEs: "Arquitectura multi-cloud",
        copyEs:
          "Diseñamos arquitecturas que aprovechan lo mejor de AWS, GCP y Azure, evitando vendor lock-in y optimizando costos.",
      },
      {
        icon: "file-code",
        titleEs: "IaC con Terraform/Pulumi",
        copyEs:
          "Infraestructura como código versionada, reproducible y auditada con Terraform, Pulumi o CloudFormation.",
      },
      {
        icon: "shield-check",
        titleEs: "Alta disponibilidad y disaster recovery",
        copyEs:
          "Arquitecturas multi-AZ y multi-región con RPO/RTO definidos, failover automático y planes de recuperación probados.",
      },
    ],
    steps: [],
  },
  seguridad: {
    benefits: [
      {
        icon: "shield",
        titleEs: "Compliance SOC2 e ISO27001",
        copyEs:
          "Implementación de controles y procesos para cumplir con SOC2, ISO27001 y otras normativas regulatorias del sector.",
      },
      {
        icon: "key-round",
        titleEs: "IAM y Zero Trust",
        copyEs:
          "Gestión de identidades con principio de mínimo privilegio, MFA, SSO y arquitectura Zero Trust en toda tu infraestructura.",
      },
      {
        icon: "activity",
        titleEs: "Monitoreo y respuesta a incidentes",
        copyEs:
          "Detección de amenazas en tiempo real, alertas automatizadas y playbooks de respuesta a incidentes de seguridad.",
      },
    ],
    steps: [],
  },
  serverless: {
    benefits: [
      {
        icon: "zap",
        titleEs: "Event-driven architecture",
        copyEs:
          "Arquitecturas reactivas que procesan eventos en tiempo real con Lambda, Cloud Functions y Azure Functions.",
      },
      {
        icon: "scaling",
        titleEs: "Auto-scaling nativo",
        copyEs:
          "Escalamiento automático de cero a millones de requests sin configuración manual ni gestión de servidores.",
      },
      {
        icon: "dollar-sign",
        titleEs: "Costos basados en uso real",
        copyEs:
          "Paga solo por el tiempo de ejecución que consumes. Sin servidores idle, sin costos fijos innecesarios.",
      },
    ],
    steps: [],
  },
  // ─── STAFF AUG HUB ────────────────────────────────────
  "staff-augmentation": {
    benefits: [
      {
        icon: "clock",
        titleEs: "Candidatos en 5 días hábiles",
        copyEs:
          "Presentamos perfiles validados en máximo 5 días. Si no los tenemos, te lo decimos antes.",
      },
      {
        icon: "refresh-cw",
        titleEs: "Reemplazo en 10 días sin costo",
        copyEs:
          "Si el perfil no funciona por cualquier razón, lo reemplazamos en menos de 10 días hábiles sin cargo adicional.",
      },
      {
        icon: "shield",
        titleEs: "Propiedad intelectual 100% del cliente",
        copyEs:
          "Todo el código, diseños y entregables son exclusivamente tuyos. Sin letra pequeña.",
      },
      {
        icon: "rocket",
        titleEs: "Integración en 6 días hábiles",
        copyEs:
          "El perfil puede estar operativo en tu equipo en menos de una semana de aceptar la propuesta.",
      },
    ],
    steps: [
      {
        number: 1,
        titleEs: "Brief de perfil",
        descEs: "Nos cuentas qué necesitas: stack, nivel, dedicación, zona horaria.",
        duration: "30 minutos",
      },
      {
        number: 2,
        titleEs: "Selección y validación",
        descEs: "Filtramos, entrevistamos técnicamente y validamos el match cultural.",
        duration: "3-4 días",
      },
      {
        number: 3,
        titleEs: "Entrevista con el cliente",
        descEs: "Presentamos los perfiles y coordinas tu propio proceso de entrevista.",
        duration: "Día 5",
      },
      {
        number: 4,
        titleEs: "Onboarding e integración",
        descEs: "Coordinamos el acceso, herramientas y primeros días con tu equipo.",
        duration: "Día 6-10",
      },
      {
        number: 5,
        titleEs: "Seguimiento continuo",
        descEs: "Delivery Manager asignado para asegurar que todo funcione bien.",
        duration: "Mensual",
      },
    ],
  },
  // ─── STAFF AUG SUBSERVICIOS ────────────────────────────
  "desarrollo-software": {
    benefits: [
      {
        icon: "code",
        titleEs: "Full-stack engineers certificados",
        copyEs:
          "Desarrolladores senior con experiencia en React, Node.js, Python, Java, Go y las tecnologías que tu proyecto necesita.",
      },
      {
        icon: "rocket",
        titleEs: "Integración en 5 días hábiles",
        copyEs:
          "Tu nuevo ingeniero está trabajando con tu equipo en menos de una semana, con onboarding y alineación cultural incluidos.",
      },
      {
        icon: "dollar-sign",
        titleEs: "Ahorro hasta 40% vs USA",
        copyEs:
          "Talento senior bilingüe en zona horaria compatible con Estados Unidos a una fracción del costo de contratar localmente.",
      },
    ],
    steps: [],
  },
  "diseno-ux-ui": {
    benefits: [
      {
        icon: "layers",
        titleEs: "Design systems escalables",
        copyEs:
          "Creación y mantenimiento de design systems con componentes reutilizables, tokens y documentación para equipos de producto.",
      },
      {
        icon: "search",
        titleEs: "User research y testing",
        copyEs:
          "Investigación de usuarios, pruebas de usabilidad y análisis heurístico para tomar decisiones de diseño basadas en datos.",
      },
      {
        icon: "pen-tool",
        titleEs: "Figma y herramientas modernas",
        copyEs:
          "Dominio de Figma, Framer, Maze y las herramientas más actuales del ecosistema de diseño de producto.",
      },
    ],
    steps: [],
  },
  "devops-cloud": {
    benefits: [
      {
        icon: "award",
        titleEs: "Certificaciones AWS/GCP/Azure",
        copyEs:
          "Ingenieros con certificaciones oficiales de los principales proveedores cloud, garantizando mejores prácticas en cada proyecto.",
      },
      {
        icon: "git-branch",
        titleEs: "CI/CD y GitOps",
        copyEs:
          "Implementación de pipelines de integración y despliegue continuo con GitHub Actions, GitLab CI, ArgoCD y FluxCD.",
      },
      {
        icon: "container",
        titleEs: "Kubernetes y contenedores",
        copyEs:
          "Orquestación de contenedores con Kubernetes (EKS, GKE, AKS), Docker, Helm y service mesh para microservicios.",
      },
    ],
    steps: [],
  },
  "datos-ia": {
    benefits: [
      {
        icon: "database",
        titleEs: "Pipelines de datos escalables",
        copyEs:
          "Diseño e implementación de pipelines ETL/ELT con Spark, Airflow, dbt y servicios nativos de la nube para procesamiento a escala.",
      },
      {
        icon: "brain",
        titleEs: "Modelos de ML en producción",
        copyEs:
          "Entrenamiento, despliegue y monitoreo de modelos de machine learning en producción con MLflow, SageMaker y Vertex AI.",
      },
      {
        icon: "bar-chart-3",
        titleEs: "Visualización y BI",
        copyEs:
          "Dashboards interactivos y reportes automatizados con Looker, Power BI, Tableau y herramientas open source.",
      },
    ],
    steps: [],
  },
  "qa-seguridad": {
    benefits: [
      {
        icon: "test-tube",
        titleEs: "Testing automatizado E2E",
        copyEs:
          "Frameworks de testing end-to-end con Cypress, Playwright y Selenium para validar flujos completos de usuario de forma automatizada.",
      },
      {
        icon: "shield-alert",
        titleEs: "Pentesting y auditoría de seguridad",
        copyEs:
          "Pruebas de penetración, análisis de vulnerabilidades y auditorías de seguridad para proteger tu aplicación y datos.",
      },
      {
        icon: "git-merge",
        titleEs: "Integración en pipelines CI/CD",
        copyEs:
          "Tests automáticos integrados en tus pipelines de CI/CD para detectar bugs y vulnerabilidades antes de cada despliegue.",
      },
    ],
    steps: [],
  },
  // ─── DEV DIGITAL HUB ──────────────────────────────────
  "desarrollo-digital": {
    benefits: [
      {
        icon: "monitor",
        titleEs: "Demo quincenal",
        copyEs: "Siempre sabes en qué estamos — entregas cada 2 semanas",
      },
      {
        icon: "code",
        titleEs: "Código 100% tuyo",
        copyEs: "Desde el primer sprint, sin vendor lock-in",
      },
      {
        icon: "check-circle",
        titleEs: "QA integrado",
        copyEs: "No es un paso final, es parte de cada sprint",
      },
    ],
    steps: [
      {
        number: 1,
        titleEs: "Discovery",
        descEs: "Entendemos el negocio, definimos el alcance y validamos viabilidad técnica.",
        duration: "Semana 1",
      },
      {
        number: 2,
        titleEs: "Arquitectura",
        descEs: "Diseñamos la arquitectura técnica y el plan de sprints.",
        duration: "Semana 2",
      },
      {
        number: 3,
        titleEs: "Sprints de desarrollo",
        descEs: "Iteraciones de 2 semanas con demo al cliente al final de cada sprint.",
        duration: "Semanas 3-N",
      },
      {
        number: 4,
        titleEs: "QA y launch",
        descEs: "Testing completo, correcciones y lanzamiento a producción.",
        duration: "Última semana",
      },
      {
        number: 5,
        titleEs: "Soporte post-launch",
        descEs: "Mantenimiento, monitoreo y evolución del producto.",
        duration: "Ongoing",
      },
    ],
  },
  // ─── DEV DIGITAL SUBSERVICIOS ──────────────────────────
  "apps-moviles": {
    benefits: [
      {
        icon: "smartphone",
        titleEs: "iOS y Android nativo",
        copyEs:
          "Desarrollo nativo con Swift y Kotlin para apps que aprovechan al máximo las capacidades de cada plataforma.",
      },
      {
        icon: "repeat",
        titleEs: "Cross-platform con React Native/Flutter",
        copyEs:
          "Una sola base de código para iOS y Android con React Native o Flutter, reduciendo tiempos y costos de desarrollo.",
      },
      {
        icon: "monitor-smartphone",
        titleEs: "UX mobile-first",
        copyEs:
          "Diseño centrado en la experiencia móvil con gestos nativos, animaciones fluidas y rendimiento optimizado.",
      },
    ],
    steps: [],
  },
  "plataformas-web": {
    benefits: [
      {
        icon: "globe",
        titleEs: "React y Next.js",
        copyEs:
          "Desarrollo frontend con React y Next.js para aplicaciones web rápidas, SEO-friendly y con excelente experiencia de usuario.",
      },
      {
        icon: "network",
        titleEs: "APIs RESTful y GraphQL",
        copyEs:
          "Backend robusto con APIs RESTful y GraphQL diseñadas para escalabilidad, seguridad y facilidad de integración.",
      },
      {
        icon: "cloud-cog",
        titleEs: "Arquitectura serverless",
        copyEs:
          "Despliegue en arquitecturas serverless que escalan automáticamente y eliminan la gestión de infraestructura.",
      },
    ],
    steps: [],
  },
  ecommerce: {
    benefits: [
      {
        icon: "shopping-cart",
        titleEs: "Catálogo y pricing dinámico",
        copyEs:
          "Gestión avanzada de catálogo con variantes, precios por segmento, descuentos programados y reglas de pricing dinámico.",
      },
      {
        icon: "credit-card",
        titleEs: "Pasarelas de pago integradas",
        copyEs:
          "Integración con Stripe, MercadoPago, PayU y pasarelas locales para pagos seguros con múltiples métodos de pago.",
      },
      {
        icon: "package-check",
        titleEs: "Integración ERP y logística",
        copyEs:
          "Conexión con SAP, Oracle, Odoo y sistemas de logística para sincronización de inventario, órdenes y fulfillment.",
      },
    ],
    steps: [],
  },
  "sitios-web-agentic": {
    benefits: [
      {
        icon: "globe",
        titleEs: "Multi-idioma nativo",
        copyEs:
          "Arquitectura i18n con español en la raíz e inglés en /en/. Cada página tiene su equivalente traducido con hreflang verificado.",
      },
      {
        icon: "link",
        titleEs: "URLs semánticas",
        copyEs:
          "Estructura de URLs definida antes de escribir código. Jerarquía clara: /servicios/desarrollo-digital/plataformas-web.",
      },
      {
        icon: "zap",
        titleEs: "Core Web Vitals ≥95",
        copyEs:
          "Performance diseñada desde la arquitectura. Server Components, lazy loading estratégico y zero layout shift.",
      },
      {
        icon: "code",
        titleEs: "Schema.org completo",
        copyEs:
          "JSON-LD server-side en cada página: Organization, Service, BreadcrumbList, FAQPage. Esquemas escritos a mano.",
      },
      {
        icon: "file-text",
        titleEs: "llms.txt implementado",
        copyEs:
          "Archivo en la raíz del dominio que indica a los LLMs qué hace tu empresa y cómo contactarte. Bilingüe.",
      },
      {
        icon: "shield",
        titleEs: "robots.txt optimizado",
        copyEs:
          "Permite crawl de buscadores y agentes IA, bloquea rutas internas y apunta al sitemap XML correcto.",
      },
    ],
    steps: [
      {
        number: 1,
        titleEs: "Arquitectura",
        descEs:
          "Definición de URLs, estructura de contenido, esquemas JSON-LD, estrategia i18n y wireframes de navegación.",
        duration: "Semana 1-2",
      },
      {
        number: 2,
        titleEs: "Infraestructura",
        descEs:
          "Setup de Next.js, CI/CD, hosting edge, configuración de robots.txt, sitemap, llms.txt y analytics.",
        duration: "Semana 2-4",
      },
      {
        number: 3,
        titleEs: "Páginas",
        descEs:
          "Desarrollo de cada página con Server Components, Schema.org, hreflang y contenido bilingüe.",
        duration: "Semana 3-6",
      },
      {
        number: 4,
        titleEs: "Performance",
        descEs:
          "Optimización de Core Web Vitals, lazy loading, font subsetting, image optimization y bundle analysis.",
        duration: "Semana 5-7",
      },
      {
        number: 5,
        titleEs: "Auditoría",
        descEs:
          "Script automático que valida Schema.org, hreflang, canonical tags, sitemap, llms.txt y PageSpeed en cada deploy.",
        duration: "Semana 6-8",
      },
    ],
  },
};

// ═══════════════════════════════════════════════════════
// MAIN — Translate and update DB
// ═══════════════════════════════════════════════════════

async function main() {
  console.log("=== Seed Benefits & Process Steps ===\n");
  console.log(`Services to process: ${Object.keys(CONTENT).length}\n`);

  for (const [slug, data] of Object.entries(CONTENT)) {
    console.log(`Processing: ${slug}`);

    // Check if record exists
    const [existing] = await db
      .select()
      .from(schema.servicios)
      .where(eq(schema.servicios.slugEs, slug));
    if (!existing) {
      console.log(`  SKIP: not in DB`);
      continue;
    }

    const updates: Record<string, unknown> = { updatedAt: new Date() };

    // Benefits — translate and set
    if (data.benefits.length > 0) {
      const existingBenefits = existing.benefits as unknown[] | null;
      if (!existingBenefits || existingBenefits.length === 0) {
        console.log(`  Translating ${data.benefits.length} benefits...`);
        const translatedBenefits = [];
        for (const b of data.benefits) {
          const titleEn = await tr(b.titleEs, `benefit title: ${slug}`);
          const copyEn = await tr(b.copyEs, `benefit copy: ${slug}`);
          translatedBenefits.push({
            icon: b.icon,
            titleEs: b.titleEs,
            titleEn,
            copyEs: b.copyEs,
            copyEn,
          });
        }
        updates.benefits = translatedBenefits;
      } else {
        console.log(`  Benefits already exist (${existingBenefits.length}), skipping`);
      }
    }

    // Process steps — translate and set
    if (data.steps.length > 0) {
      const existingSteps = existing.processSteps as unknown[] | null;
      if (!existingSteps || existingSteps.length === 0) {
        console.log(`  Translating ${data.steps.length} steps...`);
        const translatedSteps = [];
        for (const s of data.steps) {
          const titleEn = await tr(s.titleEs, `step title: ${slug}`);
          const descEn = await tr(s.descEs, `step desc: ${slug}`);
          translatedSteps.push({
            number: s.number,
            titleEs: s.titleEs,
            titleEn,
            descEs: s.descEs,
            descEn,
            duration: s.duration,
          });
        }
        updates.processSteps = translatedSteps;
      } else {
        console.log(`  Steps already exist (${existingSteps.length}), skipping`);
      }
    }

    // Apply
    if (Object.keys(updates).length > 1) {
      updates.translationStatusEn = "auto";
      await db.update(schema.servicios).set(updates).where(eq(schema.servicios.slugEs, slug));
      const bCount = (updates.benefits as unknown[] | undefined)?.length || 0;
      const sCount = (updates.processSteps as unknown[] | undefined)?.length || 0;
      console.log(`  ✅ ${slug} — benefits: ${bCount}, steps: ${sCount}`);
    } else {
      console.log(`  ✅ ${slug} — already complete`);
    }
  }

  console.log(`\n========================================`);
  console.log(`  DONE`);
  console.log(`========================================`);
  console.log(`Translated: ${translated} fields`);
  console.log(`Errors: ${errors}`);

  process.exit(0);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
