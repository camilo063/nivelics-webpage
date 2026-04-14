/**
 * Seeds the 5 initial landing pages into the landing_pages table
 * using the block format (B01-B18). Idempotent (upsert by slug).
 *
 * Usage: DATABASE_URL="..." npx tsx scripts/seed-landings.ts
 */

import { drizzle } from "drizzle-orm/node-postgres";
import { eq } from "drizzle-orm";
import * as schema from "../lib/db/schema/admin";

const db = drizzle(process.env.DATABASE_URL!, { schema });

interface Block {
  type: string;
  order: number;
  data: Record<string, unknown>;
}

interface LandingSeed {
  slug: string;
  campaignName: string;
  serviceType: "ia" | "cloud" | "staffing" | "finops" | "dev";
  accentColor: "ia" | "cloud" | "staffing" | "finops" | "dev";
  noindex: boolean;
  metaTitle: string;
  metaDescription: string;
  whatsappMessage: string;
  blocks: Block[];
}

const LANDINGS: LandingSeed[] = [
  // ═══════════════════════════════════════════════════
  // LANDING 1 — Staff Augmentation Colombia (Plantilla A)
  // ═══════════════════════════════════════════════════
  {
    slug: "staff-augmentation-colombia",
    campaignName: "Staff Augmentation Colombia",
    serviceType: "staffing",
    accentColor: "staffing",
    noindex: true,
    metaTitle: "Staff Augmentation Colombia | Talento Tech en 5 Días | Nivelics",
    metaDescription:
      "Escala tu equipo de desarrollo con ingenieros colombianos senior. Candidatos en 5 días hábiles. -40% vs. costos USA. Great Place to Work 2022.",
    whatsappMessage: "Hola, quiero información sobre Staff Augmentation con Nivelics",
    blocks: [
      {
        type: "B01",
        order: 1,
        data: {
          badge_text: "Staff Augmentation · Colombia → USA",
          h1: "Talento tech senior en 5 días. Sin los costos de contratar en USA.",
          subtitulo:
            "Escalamos tu equipo de desarrollo con ingenieros colombianos verificados — inglés profesional, zona horaria compatible, sin overhead de RRHH.",
          cta_primario_texto: "Solicitar perfiles ahora",
          cta_primario_url: "#formulario",
          cta_secundario_texto: "Ver cómo funciona",
          cta_secundario_url: "#proceso",
          trust_badge: "🏆 Great Place to Work · 13+ años · 7 países",
        },
      },
      {
        type: "B04",
        order: 2,
        data: {
          metricas: [
            { valor: "5 días", label: "Primeros perfiles presentados" },
            { valor: "40%", label: "Ahorro vs. contratar en USA o Europa" },
            { valor: "13+", label: "Años entregando equipos tech" },
            { valor: "7", label: "Países con clientes activos" },
          ],
        },
      },
      {
        type: "B05",
        order: 3,
        data: {
          titulo: "¿Por qué Nivelics y no una bolsa de trabajo?",
          items: [
            {
              icono: "shield",
              titulo: "Candidatos pre-validados",
              descripcion:
                "Evaluamos habilidades técnicas, inglés y cultura antes de presentarte a alguien. No recibes CVs — recibes candidatos listos para entrevistar.",
            },
            {
              icono: "clock",
              titulo: "Velocidad real, no promesas",
              descripcion:
                "En 5 días hábiles tienes los primeros perfiles. En 15 días, el ingeniero puede estar en tu standup. Sin procesos burocráticos.",
            },
            {
              icono: "rotate-ccw",
              titulo: "Garantía de reemplazo",
              descripcion:
                "Si en los primeros 30 días el perfil no encaja, lo reemplazamos sin costo adicional. El riesgo es nuestro.",
            },
          ],
        },
      },
      {
        type: "B07",
        order: 4,
        data: {
          titulo: "Cómo funciona — sin burocracia",
          pasos: [
            {
              titulo: "Briefing técnico (día 1)",
              descripcion:
                "Nos cuentas el stack, el rol y el contexto del equipo. 30 minutos en videollamada.",
            },
            {
              titulo: "Sourcing y validación (días 1–3)",
              descripcion:
                "Buscamos en nuestra red de 500+ ingenieros activos. Validamos técnico, inglés y disponibilidad.",
            },
            {
              titulo: "Presentación de perfiles (día 5)",
              descripcion:
                "Recibes entre 2 y 4 candidatos con video de presentación, evaluación técnica y disponibilidad confirmada.",
            },
            {
              titulo: "Entrevista y arranque (días 6–15)",
              descripcion:
                "Tú entrevistas, decides. Una vez confirmado, el ingeniero está activo en tu equipo.",
            },
          ],
        },
      },
      {
        type: "B08",
        order: 5,
        data: {
          client_name: "Two Maids",
          country: "🇺🇸 USA",
          sector: "Servicios a domicilio / SaaS",
          resultado: "-40% en costos de desarrollo. Equipo escalado en 10 días.",
          extracto:
            "Necesitaban crecer el equipo tech rápido para su plataforma SaaS sin duplicar su nómina en USA. Nivelics entregó 3 ingenieros senior en 10 días.",
        },
      },
      {
        type: "B12",
        order: 6,
        data: {
          titulo: "Solicita tus primeros perfiles",
          subtitulo: "Sin compromiso. En menos de 24h te respondemos.",
          cta_texto: "Solicitar perfiles →",
          trust_signals: [
            "🔒 Tus datos no se comparten con terceros",
            "✅ Great Place to Work Colombia 2022",
            "⚡ Respuesta en menos de 24 horas",
          ],
        },
      },
      {
        type: "B18",
        order: 7,
        data: {
          mostrar_whatsapp: true,
          whatsapp_numero: "+573103926621",
          whatsapp_mensaje: "Hola, quiero información sobre Staff Augmentation con Nivelics",
        },
      },
    ],
  },

  // ═══════════════════════════════════════════════════
  // LANDING 2 — FinOps AWS (Plantilla B)
  // ═══════════════════════════════════════════════════
  {
    slug: "finops-aws",
    campaignName: "FinOps AWS",
    serviceType: "finops",
    accentColor: "finops",
    noindex: true,
    metaTitle: "FinOps AWS | Reduce tu Factura Cloud hasta 40% | Nivelics",
    metaDescription:
      "Diagnóstico gratuito de tu gasto en AWS. Identificamos ahorros en 6 semanas. Sin cambiar arquitectura, sin riesgo, con resultados medibles.",
    whatsappMessage: "Hola, quiero el diagnóstico gratuito de FinOps AWS con Nivelics",
    blocks: [
      {
        type: "B02",
        order: 1,
        data: {
          badge_text: "FinOps · Optimización AWS",
          h1: "Reduce tu factura de AWS hasta un 40% en 6 semanas.",
          subtitulo:
            "Sin cambiar tu arquitectura. Sin riesgo. Con resultados medibles desde la semana 2.",
          form_title: "Diagnóstico gratuito de tu gasto cloud",
          cta_texto: "Quiero mi diagnóstico →",
        },
      },
      {
        type: "B03",
        order: 2,
        data: {
          titulo: "Empresas que ya optimizaron su cloud con nosotros",
          logos: ["Televisa", "Pulzo", "Grupo Bolívar", "Two Maids", "Univision"],
        },
      },
      {
        type: "B04",
        order: 3,
        data: {
          metricas: [
            { valor: "40%", label: "Reducción promedio en gasto cloud" },
            { valor: "6", label: "Semanas para ver resultados reales" },
            { valor: "0", label: "Downtime durante la optimización", isZeroSpecial: "Cero" },
            { valor: "13+", label: "Años auditando arquitecturas cloud" },
          ],
        },
      },
      {
        type: "B06",
        order: 4,
        data: {
          h2: "¿Qué incluye el diagnóstico gratuito?",
          bullets: [
            "Auditoría completa de tu cuenta AWS (costos, arquitectura, tagging)",
            "Identificación de recursos ociosos y sobredimensionados",
            "Mapa de ahorro con cifras concretas (sin rodeos)",
            "Recomendaciones priorizadas por ROI",
            "Reunión de resultados con tu equipo técnico",
          ],
        },
      },
      {
        type: "B10",
        order: 5,
        data: {
          titulo: "Preguntas frecuentes",
          preguntas: [
            {
              pregunta: "¿Tienen que tener acceso a nuestra cuenta de AWS?",
              respuesta:
                "Solo necesitamos acceso de lectura (read-only) a AWS Cost Explorer y Trusted Advisor. En ningún momento modificamos nada sin tu aprobación explícita.",
            },
            {
              pregunta: "¿En qué tiempo vemos el primer ahorro?",
              respuesta:
                "Los quick wins (recursos ociosos, snapshots viejos, instancias sobredimensionadas) se pueden ejecutar en la semana 1. Los ahorros estructurales toman entre 4 y 6 semanas.",
            },
            {
              pregunta: "¿Trabajan solo con AWS o también GCP y Azure?",
              respuesta:
                "Principalmente AWS, donde tenemos mayor profundidad. También trabajamos con GCP. Para Azure, podemos hacer un assessment inicial.",
            },
            {
              pregunta: "¿Cuánto cuesta el servicio después del diagnóstico?",
              respuesta:
                "Depende del alcance. Algunos clientes prefieren fee fijo mensual; otros, un modelo de success fee sobre el ahorro real. Lo definimos después del diagnóstico cuando ya tenemos los números reales.",
            },
            {
              pregunta:
                "¿Tienen experiencia con arquitecturas de empresas de medios/retail/fintech?",
              respuesta:
                "Sí. Hemos optimizado cloud para Televisa, plataformas de e-commerce con picos de Black Friday, y fintechs con cargas variables. Cada caso tiene sus particularidades y las conocemos.",
            },
          ],
        },
      },
      {
        type: "B12",
        order: 6,
        data: {
          titulo: "¿Listo para ver cuánto estás desperdiciando?",
          subtitulo: "El diagnóstico no cuesta nada. El desperdicio sí.",
          cta_texto: "Quiero mi diagnóstico gratuito →",
        },
      },
      {
        type: "B18",
        order: 7,
        data: {
          mostrar_whatsapp: true,
          whatsapp_numero: "+573103926621",
          whatsapp_mensaje: "Hola, quiero el diagnóstico gratuito de FinOps AWS con Nivelics",
        },
      },
    ],
  },

  // ═══════════════════════════════════════════════════
  // LANDING 3 — IA Retail (Plantilla C)
  // ═══════════════════════════════════════════════════
  {
    slug: "ia-retail",
    campaignName: "IA para Retail y E-Commerce",
    serviceType: "ia",
    accentColor: "ia",
    noindex: false,
    metaTitle: "IA para Retail y E-Commerce | Nivelics | Colombia",
    metaDescription:
      "Agentes de IA para personalización, recuperación de carritos e inventario inteligente. Resultados en semanas. Integración con Shopify, Vtex y más.",
    whatsappMessage: "Hola, quiero información sobre IA para retail con Nivelics",
    blocks: [
      {
        type: "B01",
        order: 1,
        data: {
          badge_text: "IA Aplicada · Retail & E-Commerce",
          h1: "IA para retail que vende más, predice mejor y opera sin fricciones.",
          subtitulo:
            "Implementamos agentes de IA para personalización, recuperación de carrito y optimización de inventario. Tu equipo se enfoca en el negocio — la IA hace el trabajo repetitivo.",
          cta_primario_texto: "Hablar con un especialista en retail →",
          cta_primario_url: "#formulario",
          cta_secundario_texto: "Ver casos reales →",
          cta_secundario_url: "#caso",
        },
      },
      {
        type: "B14",
        order: 2,
        data: {
          titulo: "Los retos de retail en 2026 que la IA ya puede resolver",
          items: [
            {
              icono: "trending-up",
              titulo: "Personalización a escala imposible para humanos",
              descripcion:
                "Tu catálogo tiene 50.000 SKUs. Cada cliente es diferente. La IA de recomendación opera en tiempo real — muestra el producto correcto, en el momento correcto, para cada persona.",
            },
            {
              icono: "shopping-cart",
              titulo: "Carritos abandonados = dinero sobre la mesa",
              descripcion:
                "El 70% de los carritos se abandona. Un agente de IA puede recuperar entre el 10 y el 25% con mensajes personalizados por canal (WhatsApp, email, push) en el momento óptimo.",
            },
            {
              icono: "package",
              titulo: "Inventario que se gestiona solo",
              descripcion:
                "Sobrestock y quiebre de stock cuestan millones. La IA predice la demanda con datos históricos, estacionalidad y señales externas — antes de que el problema ocurra.",
            },
          ],
        },
      },
      {
        type: "B04",
        order: 3,
        data: {
          metricas: [
            { valor: "25%", label: "Recuperación de carritos con agente IA" },
            { valor: "3x", label: "ROI promedio en proyectos IA retail" },
            { valor: "72h", label: "Tiempo al primer prototipo funcional" },
            {
              valor: "0",
              label: "Reemplazos de personal — la IA aumenta, no reemplaza",
              isZeroSpecial: "Ninguno",
            },
          ],
        },
      },
      {
        type: "B08",
        order: 4,
        data: {
          client_name: "Retailer LATAM",
          country: "🇲🇽 México",
          sector: "Retail / E-commerce",
          resultado: "+18% conversión. Sistema de recomendación en 6 semanas.",
          extracto:
            "Retailer con 200K SKUs necesitaba personalización sin un equipo de ML propio. Implementamos motor de recomendación sobre su infraestructura AWS existente — sin migrar nada.",
        },
      },
      {
        type: "B05",
        order: 5,
        data: {
          titulo: "¿Por qué Nivelics para IA en retail?",
          items: [
            {
              icono: "zap",
              titulo: "Implementación rápida, no laboratorio",
              descripcion:
                "No somos una consultora de investigación. Entregamos agentes que funcionan en producción — en semanas, no en meses.",
            },
            {
              icono: "link",
              titulo: "Integración con tu stack existente",
              descripcion:
                "Shopify, Vtex, Magento, plataforma propia. Nos adaptamos a lo que ya tienes — sin migraciones dolorosas.",
            },
            {
              icono: "bar-chart-2",
              titulo: "ROI medible desde el día 1",
              descripcion:
                "Definimos métricas de éxito antes de empezar. Cada agente tiene un KPI asociado. Sabes exactamente cuánto vale.",
            },
          ],
        },
      },
      {
        type: "B12",
        order: 6,
        data: {
          titulo: "Cuéntanos tu reto de retail",
          subtitulo: "En 24h te respondemos con una propuesta inicial.",
          cta_texto: "Hablar con un especialista →",
        },
      },
      {
        type: "B18",
        order: 7,
        data: {
          mostrar_whatsapp: true,
          whatsapp_numero: "+573103926621",
          whatsapp_mensaje: "Hola, quiero información sobre IA para retail con Nivelics",
        },
      },
    ],
  },

  // ═══════════════════════════════════════════════════
  // LANDING 4 — Staffing vs Contratar (Plantilla D)
  // ═══════════════════════════════════════════════════
  {
    slug: "staffing-vs-contratar",
    campaignName: "Staff Augmentation vs. Contratar In-House",
    serviceType: "staffing",
    accentColor: "staffing",
    noindex: false,
    metaTitle: "Staff Augmentation vs. Contratar In-House | Comparativa Real | Nivelics",
    metaDescription:
      "Compara costos reales: contratar en USA vs. staff augmentation nearshore. 40% de ahorro, 5 días para candidatos, garantía de reemplazo.",
    whatsappMessage: "Hola, quiero comparar opciones de Staff Augmentation con Nivelics",
    blocks: [
      {
        type: "B01",
        order: 1,
        data: {
          badge_text: "Staff Augmentation vs. Contratación Directa",
          h1: "¿Contratar en USA o escalar con talento nearshore? Los números hablan.",
          subtitulo:
            "Antes de pagar un recruiter y esperar 3 meses, compara los costos reales. Spoiler: la diferencia es del 40%.",
          cta_primario_texto: "Ver la comparativa →",
          cta_primario_url: "#tabla",
          cta_secundario_texto: "Hablar con un especialista →",
          cta_secundario_url: "#formulario",
        },
      },
      {
        type: "B13",
        order: 2,
        data: {
          anchor_id: "tabla",
          titulo: "La comparativa real — 2026",
          subtitulo: "Cifras basadas en promedios de mercado. Ahorros reales. Sin letra pequeña.",
          columnas: ["Contratar in-house USA", "Nivelics Staff Aug", "Freelance marketplace"],
          highlight_col_idx: 1,
          filas: [
            {
              criterio: "Tiempo para primer candidato",
              values: ["60–90 días", "✅ 5 días hábiles", "3–7 días"],
            },
            {
              criterio: "Costo mensual (senior dev)",
              values: ["$12,000–$18,000 USD", "✅ $4,500–$7,000 USD", "$5,000–$9,000 USD"],
            },
            {
              criterio: "Inglés profesional garantizado",
              values: ["✅ Sí", "✅ Sí", "Variable"],
            },
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
          ],
          footnote:
            "*Cifras basadas en promedios de mercado 2025–2026. Los costos de Nivelics varían según perfil y senioridad.",
        },
      },
      {
        type: "B04",
        order: 3,
        data: {
          metricas: [
            { valor: "40%", label: "Ahorro promedio vs. contratar en USA" },
            { valor: "5 días", label: "Primeros candidatos presentados" },
            { valor: "500+", label: "Ingenieros en nuestra red activa" },
            { valor: "30 días", label: "Garantía de reemplazo sin costo" },
          ],
        },
      },
      {
        type: "B08",
        order: 4,
        data: {
          client_name: "Two Maids",
          country: "🇺🇸 USA",
          sector: "SaaS",
          resultado: "3 ingenieros senior en 10 días. -40% vs. su costo local anterior.",
          extracto:
            "Habían intentado contratar in-house durante 4 meses sin éxito. Con Nivelics tuvieron el equipo en funcionamiento en menos de 2 semanas.",
        },
      },
      {
        type: "B09",
        order: 5,
        data: {
          quote:
            "Llevábamos meses buscando un desarrollador senior. Con Nivelics lo tuvimos en 6 días. El nivel técnico superó nuestras expectativas y el inglés no fue ningún problema.",
          autor_nombre: "Director de Tecnología",
          autor_cargo: "Empresa SaaS",
          autor_empresa: "USA",
        },
      },
      {
        type: "B11",
        order: 6,
        data: {
          copy: "¿Quieres los perfiles específicos que necesitas?",
          subtitulo: "Dinos el stack y el rol — en 24h te presentamos opciones.",
          boton_texto: "Solicitar perfiles ahora →",
          boton_url: "#formulario",
        },
      },
      {
        type: "B12",
        order: 7,
        data: {
          titulo: "Solicita candidatos para tu equipo",
          subtitulo: "Sin compromiso. Sin recruiters intermedios. Directo al grano.",
          cta_texto: "Solicitar candidatos →",
        },
      },
      {
        type: "B18",
        order: 8,
        data: {
          mostrar_whatsapp: true,
          whatsapp_numero: "+573103926621",
          whatsapp_mensaje: "Hola, quiero comparar opciones de Staff Augmentation con Nivelics",
        },
      },
    ],
  },

  // ═══════════════════════════════════════════════════
  // LANDING 5 — Diagnóstico Gratuito (Plantilla E)
  // ═══════════════════════════════════════════════════
  {
    slug: "diagnostico-gratuito",
    campaignName: "Diagnóstico Digital Gratuito",
    serviceType: "dev",
    accentColor: "dev",
    noindex: false,
    metaTitle: "Diagnóstico Digital Gratuito | IA · Cloud · Talento | Nivelics",
    metaDescription:
      "45 minutos. 3 áreas evaluadas. Reporte ejecutivo en 48h. Descubre dónde tu empresa puede transformarse más rápido — sin costo ni compromiso.",
    whatsappMessage: "Hola, quiero agendar mi diagnóstico gratuito con Nivelics",
    blocks: [
      {
        type: "B02",
        order: 1,
        data: {
          badge_text: "Oferta limitada · Diagnóstico 100% gratuito",
          h1: "¿Cuánto te está costando no transformarte digitalmente?",
          subtitulo:
            "En 45 minutos te decimos exactamente dónde estás, qué frenar, qué acelerar y qué automatizar. Sin costo. Sin venta disfrazada.",
          form_title: "Agenda tu diagnóstico gratuito",
          cta_texto: "Quiero mi diagnóstico →",
        },
      },
      {
        type: "B04",
        order: 2,
        data: {
          metricas: [
            { valor: "45 min", label: "Duración del diagnóstico" },
            { valor: "100%", label: "Gratuito y sin compromiso" },
            { valor: "3", label: "Áreas evaluadas: IA, Cloud, Talento" },
            { valor: "48h", label: "Entrega del reporte de hallazgos" },
          ],
        },
      },
      {
        type: "B05",
        order: 3,
        data: {
          titulo: "¿Qué obtienes en el diagnóstico?",
          items: [
            {
              icono: "search",
              titulo: "Mapa de madurez digital",
              descripcion:
                "Evaluamos en qué punto está tu empresa en IA, Cloud y Talento tech. Sin tecnicismos — lenguaje de negocio, con impacto en números.",
            },
            {
              icono: "target",
              titulo: "Top 3 oportunidades de impacto",
              descripcion:
                "Identificamos las 3 palancas donde puedes obtener el mayor retorno en los próximos 90 días. Priorizado por ROI, no por moda.",
            },
            {
              icono: "file-text",
              titulo: "Reporte ejecutivo entregable",
              descripcion:
                "A las 48h recibes un documento con hallazgos, recomendaciones y un roadmap inicial. Algo que puedes llevar a tu directivo o junta.",
            },
          ],
        },
      },
      {
        type: "B09",
        order: 4,
        data: {
          quote:
            "El diagnóstico nos abrió los ojos. Estábamos gastando $8,000 USD al mes en cloud sin saberlo. En 6 semanas Nivelics lo redujo a $4,200.",
          autor_nombre: "CFO",
          autor_cargo: "Empresa de logística",
          autor_empresa: "Colombia",
        },
      },
      {
        type: "B12",
        order: 5,
        data: {
          titulo: "Una sesión de 45 minutos puede cambiar tu roadmap del año",
          subtitulo: "Elige el slot que mejor te convenga. Sin preparación previa necesaria.",
          cta_texto: "Agendar mi diagnóstico →",
          trust_signals: [
            "✅ Sin costo ni compromiso",
            "🔒 Información 100% confidencial",
            "⏱ 45 minutos — respetamos tu tiempo",
            "🏆 Great Place to Work Colombia 2022",
          ],
        },
      },
      {
        type: "B18",
        order: 6,
        data: {
          mostrar_whatsapp: true,
          whatsapp_numero: "+573103926621",
          whatsapp_mensaje: "Hola, quiero agendar mi diagnóstico gratuito con Nivelics",
        },
      },
    ],
  },
];

async function main() {
  console.log("=== Seeding 5 landing pages ===\n");

  for (const landing of LANDINGS) {
    const existing = await db
      .select()
      .from(schema.landingPages)
      .where(eq(schema.landingPages.slug, landing.slug))
      .limit(1);

    if (existing.length > 0) {
      await db
        .update(schema.landingPages)
        .set({
          campaignName: landing.campaignName,
          serviceType: landing.serviceType,
          accentColor: landing.accentColor,
          noindex: landing.noindex,
          metaTitle: landing.metaTitle,
          metaDescription: landing.metaDescription,
          whatsappMessage: landing.whatsappMessage,
          blocks: landing.blocks,
          status: "published",
          updatedAt: new Date(),
        })
        .where(eq(schema.landingPages.slug, landing.slug));
      console.log(`🔄 Updated: ${landing.slug} (${landing.blocks.length} bloques)`);
    } else {
      await db.insert(schema.landingPages).values({
        slug: landing.slug,
        campaignName: landing.campaignName,
        serviceType: landing.serviceType,
        accentColor: landing.accentColor,
        noindex: landing.noindex,
        metaTitle: landing.metaTitle,
        metaDescription: landing.metaDescription,
        whatsappMessage: landing.whatsappMessage,
        blocks: landing.blocks,
        status: "published",
      });
      console.log(`✅ Created: ${landing.slug} (${landing.blocks.length} bloques)`);
    }
  }

  console.log("\n✅ Seed complete!");
  console.log("Las 5 landings ahora son editables desde /admin/landing-pages");
  process.exit(0);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
