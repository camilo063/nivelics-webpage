/**
 * Seed de las 4 landings de campaña para las industrias nuevas (Niveleads):
 *
 *   ES: /lp/ia-medicion-audiencias      EN: /en/lp/ai-audience-measurement
 *   ES: /lp/ia-investigacion-mercados   EN: /en/lp/ai-market-research
 *
 * Todas noindex (solo tráfico de secuencias). Quedan editables desde
 * Admin → Landings. Idempotente: salta slugs existentes.
 *
 * Las cifras de mercado provienen de investigación citable (Retell AI, Gartner,
 * Thoughtly, GRIT, ESOMAR 2025/2026); las de casos, de los casos de éxito
 * reales de Nivelics (Televisa, Pulzo, Grupo Bolívar).
 *
 * Uso: node --env-file=.env.local --import tsx scripts/seed-landings-industrias.ts
 */
import { drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";
import { eq } from "drizzle-orm";
import * as schema from "../lib/db/schema/admin";

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
  utmSource: string;
  utmMedium: string;
  utmCampaign: string;
  blocks: Block[];
}

const LOGOS = ["Televisa", "Univision", "Pulzo", "Crónica", "Grupo Bolívar", "AB InBev"];

const LANDINGS: LandingSeed[] = [
  // ═══════════════════════════════════════════════════════════════════
  // 1 — IA para Medición de Audiencias (ES)
  // ═══════════════════════════════════════════════════════════════════
  {
    slug: "ia-medicion-audiencias",
    campaignName: "IA para Medición de Audiencias",
    serviceType: "ia",
    accentColor: "ia",
    noindex: true,
    metaTitle: "IA para Medición de Audiencias — Llamadas, QA y Dashboards",
    metaDescription:
      "Agentes de voz 24/7 para gestión de paneles, QA del 100% de los datos de sintonía y dashboards en tiempo real. Piloto operando en semanas.",
    whatsappMessage: "Hola, vi la página de IA para medición de audiencias y quiero saber más",
    utmSource: "niveleads",
    utmMedium: "email",
    utmCampaign: "audiencias-2026",
    blocks: [
      {
        type: "B02",
        order: 1,
        data: {
          badge_text: "IA para Medición de Audiencias",
          h1: "Tu panel, tus datos y tu reportería pueden operar 24/7 — sin crecer la nómina",
          subtitulo:
            "La industria de medición ya está automatizando llamadas de panel, QA de datos y entrega a clientes con IA. Agenda un diagnóstico y mira qué procesos de tu operación pueden automatizarse en semanas.",
          form_title: "Agenda tu diagnóstico sin costo",
          cta_texto: "Quiero mi diagnóstico →",
        },
      },
      {
        type: "B03",
        order: 2,
        data: {
          titulo: "Tecnología entregada a líderes de medios y datos en LATAM",
          logos: LOGOS,
        },
      },
      {
        type: "B04",
        order: 3,
        data: {
          titulo: "La oportunidad, en cifras",
          metricas: [
            {
              valor: ">35%",
              label:
                "Completitud en encuestas telefónicas con IA vs <10% por email (Retell AI, 2025)",
            },
            { valor: "US$0.40", label: "Costo por llamada con IA vs US$7–12 humana (~90% menos)" },
            {
              valor: "US$80B",
              label: "Ahorro proyectado por IA conversacional en contact centers en 2026 (Gartner)",
            },
            {
              valor: "82%",
              label: "Empresas con voice AI reportan ROI positivo en 12 meses (Thoughtly, 2025)",
            },
          ],
        },
      },
      {
        type: "B13",
        order: 4,
        data: {
          titulo: "Operación de hoy vs. operación con IA",
          subtitulo:
            "No se trata de reemplazar tu operación: se trata de lo que hoy es posible sumarle.",
          columnas: ["Operación tradicional", "Con Nivelics + IA"],
          highlight_col_idx: 1,
          filas: [
            {
              criterio: "Llamadas de gestión de panel",
              values: ["Call center en horario hábil", "Agentes de voz 24/7, ~US$0.40 por llamada"],
            },
            {
              criterio: "QA de datos de sintonía",
              values: ["Muestreo manual (10–20%)", "100% auditado con detección de anomalías"],
            },
            {
              criterio: "Reportería a clientes",
              values: [
                "Informes armados a mano, días",
                "Dashboards en tiempo real + entregables automáticos",
              ],
            },
            { criterio: "Cobertura horaria", values: ["8×5", "24/7"] },
            {
              criterio: "Escalar la operación",
              values: ["Contratar y entrenar personal", "Capacidad elástica inmediata"],
            },
          ],
          footnote: "Cifras de costo por llamada: Retell AI / Ringly, 2025.",
        },
      },
      {
        type: "B05",
        order: 5,
        data: {
          titulo: "Qué construimos para operaciones de medición",
          items: [
            {
              icono: "brain",
              titulo: "Agentes de voz para tu panel",
              descripcion:
                "Reclutamiento, verificación, retención y encuestas con voz natural en español, integrados a tus sistemas de panel y con transferencia a humano cuando el caso lo amerita.",
            },
            {
              icono: "bar-chart-3",
              titulo: "Dashboards inteligentes de audiencia",
              descripcion:
                "Datos de sintonía validados y accionables el mismo día, para tu dirección y para tus clientes: canales, agencias y anunciantes.",
            },
            {
              icono: "shield",
              titulo: "QA automatizado del 100% de los datos",
              descripcion:
                "Modelos que auditan la totalidad de los registros, marcan anomalías y priorizan qué revisa tu equipo. Credibilidad defendible frente a cualquier cliente.",
            },
          ],
        },
      },
      {
        type: "B08",
        order: 6,
        data: {
          client_name: "Televisa / N+",
          country: "🇲🇽 México",
          sector: "Medios / Streaming",
          resultado:
            "99.9% de uptime en eventos en vivo y plataforma escalable a millones de usuarios",
          extracto:
            "Construimos con Televisa la plataforma de noticias digitales de N+: millones de usuarios, 99.9% de uptime en eventos en vivo y 40% menos time-to-market. Sabemos operar datos de medios a escala.",
        },
      },
      {
        type: "B07",
        order: 7,
        data: {
          titulo: "De diagnóstico a piloto operando — en semanas",
          pasos: [
            {
              titulo: "Diagnóstico de la operación (semana 1)",
              descripcion:
                "Mapeamos tus procesos de llamadas, QA y reportería, y cuantificamos el costo actual de cada uno frente a su versión automatizada.",
            },
            {
              titulo: "Piloto controlado (semanas 2–6)",
              descripcion:
                "Un proceso —por ejemplo retención de panelistas— operando con agentes de voz en paralelo a tu equipo, con métricas comparables.",
            },
            {
              titulo: "Escalamiento con métricas",
              descripcion:
                "Ampliamos cobertura a más procesos y horarios, conectamos dashboards y automatizamos la reportería.",
            },
            {
              titulo: "Operación continua",
              descripcion:
                "Monitoreo, mejora continua y gobierno de datos alineado a Habeas Data, ISO 20252 y los códigos de la industria.",
            },
          ],
        },
      },
      {
        type: "B10",
        order: 8,
        data: {
          preguntas: [
            {
              pregunta: "¿Los agentes de voz reemplazan a mi equipo de operación?",
              respuesta:
                "No. Absorben el volumen repetitivo —recordatorios, verificaciones, encuestas cortas— y liberan al equipo humano para los casos que requieren criterio. La operación escala sin crecer la nómina.",
            },
            {
              pregunta: "¿La voz suena natural en español latinoamericano?",
              respuesta:
                "Sí. Voces neurales en español con acentos locales, guiones co-diseñados con tu equipo y transferencia a humano cuando el panelista lo pide.",
            },
            {
              pregunta: "¿Cómo se integra con nuestros sistemas de medición y panel?",
              respuesta:
                "Vía API sobre tus sistemas actuales: CRM de panel, software de medición y data warehouse. No hay que reemplazar nada para empezar.",
            },
            {
              pregunta: "¿Qué pasa con los datos de los panelistas?",
              respuesta:
                "Permanecen bajo tu control, en tu nube y jurisdicción, con flujos alineados a Habeas Data/GDPR: consentimiento, minimización y trazabilidad de cada interacción.",
            },
            {
              pregunta: "¿Cuánto toma ver el primer resultado?",
              respuesta:
                "Un piloto acotado queda operando en semanas, con métricas comparables contra tu operación actual antes de decidir el escalamiento.",
            },
          ],
        },
      },
      {
        type: "B12",
        order: 9,
        data: {
          titulo: "Hablemos de tu operación de medición",
          subtitulo:
            "Diagnóstico de 30 minutos, sin costo y sin compromiso. Te respondemos en menos de 24h.",
          cta_texto: "Agendar diagnóstico →",
          trust_signals: [
            "🔒 Datos tratados bajo Habeas Data / GDPR",
            "🏆 Great Place to Work · 13+ años · 7 países",
            "⚡ Piloto operando en semanas, no trimestres",
          ],
        },
      },
      {
        type: "B18",
        order: 10,
        data: {
          mostrar_whatsapp: true,
          whatsapp_mensaje:
            "Hola, vi la página de IA para medición de audiencias y quiero saber más",
        },
      },
    ],
  },

  // ═══════════════════════════════════════════════════════════════════
  // 2 — AI for Audience Measurement (EN)
  // ═══════════════════════════════════════════════════════════════════
  {
    slug: "ai-audience-measurement",
    campaignName: "AI for Audience Measurement",
    serviceType: "ia",
    accentColor: "ia",
    noindex: true,
    metaTitle: "AI for Audience Measurement — Calls, QA & Dashboards",
    metaDescription:
      "24/7 voice agents for panel management, QA across 100% of tuning data and real-time dashboards. Pilot running in weeks.",
    whatsappMessage: "Hi, I saw the AI for audience measurement page and want to know more",
    utmSource: "niveleads",
    utmMedium: "email",
    utmCampaign: "audience-measurement-2026",
    blocks: [
      {
        type: "B02",
        order: 1,
        data: {
          badge_text: "AI for Audience Measurement",
          h1: "Your panel, your data and your reporting can run 24/7 — without growing payroll",
          subtitulo:
            "The measurement industry is already automating panel calls, data QA and client delivery with AI. Book a diagnostic and see which of your processes can be automated in weeks.",
          form_title: "Book your free diagnostic",
          cta_texto: "Get my diagnostic →",
        },
      },
      {
        type: "B03",
        order: 2,
        data: {
          titulo: "Technology delivered to media and data leaders across LATAM",
          logos: LOGOS,
        },
      },
      {
        type: "B04",
        order: 3,
        data: {
          titulo: "The opportunity, in numbers",
          metricas: [
            {
              valor: ">35%",
              label: "Completion on AI phone surveys vs <10% via email (Retell AI, 2025)",
            },
            { valor: "US$0.40", label: "Cost per AI call vs US$7–12 human (~90% less)" },
            {
              valor: "US$80B",
              label: "Projected contact-center savings from conversational AI in 2026 (Gartner)",
            },
            {
              valor: "82%",
              label:
                "Companies with voice AI report positive ROI within 12 months (Thoughtly, 2025)",
            },
          ],
        },
      },
      {
        type: "B13",
        order: 4,
        data: {
          titulo: "Today's operation vs. an AI-powered one",
          subtitulo:
            "This isn't about replacing your operation — it's about what you can add to it today.",
          columnas: ["Traditional operation", "With Nivelics + AI"],
          highlight_col_idx: 1,
          filas: [
            {
              criterio: "Panel management calls",
              values: ["Business-hours call center", "24/7 voice agents, ~US$0.40 per call"],
            },
            {
              criterio: "Tuning-data QA",
              values: ["Manual sampling (10–20%)", "100% audited with anomaly detection"],
            },
            {
              criterio: "Client reporting",
              values: ["Hand-built reports, days", "Real-time dashboards + automated deliverables"],
            },
            { criterio: "Coverage hours", values: ["8×5", "24/7"] },
            {
              criterio: "Scaling the operation",
              values: ["Hire and train staff", "Instantly elastic capacity"],
            },
          ],
          footnote: "Cost-per-call figures: Retell AI / Ringly, 2025.",
        },
      },
      {
        type: "B05",
        order: 5,
        data: {
          titulo: "What we build for measurement operations",
          items: [
            {
              icono: "brain",
              titulo: "Voice agents for your panel",
              descripcion:
                "Recruitment, verification, retention and surveys with natural voice, integrated with your panel systems, with human handoff whenever a case warrants it.",
            },
            {
              icono: "bar-chart-3",
              titulo: "Intelligent audience dashboards",
              descripcion:
                "Validated, same-day actionable tuning data for your leadership and your clients: networks, agencies and advertisers.",
            },
            {
              icono: "shield",
              titulo: "Automated QA across 100% of data",
              descripcion:
                "Models that audit every record, flag anomalies and prioritize what your team reviews. Credibility you can defend with any client.",
            },
          ],
        },
      },
      {
        type: "B08",
        order: 6,
        data: {
          client_name: "Televisa / N+",
          country: "🇲🇽 Mexico",
          sector: "Media / Streaming",
          resultado: "99.9% uptime during live events and a platform scaling to millions of users",
          extracto:
            "We built Televisa's N+ digital news platform: millions of users, 99.9% uptime during live events and 40% faster time-to-market. We know how to operate media data at scale.",
        },
      },
      {
        type: "B07",
        order: 7,
        data: {
          titulo: "From diagnostic to a running pilot — in weeks",
          pasos: [
            {
              titulo: "Operations diagnostic (week 1)",
              descripcion:
                "We map your call, QA and reporting processes and quantify today's cost of each versus its automated version.",
            },
            {
              titulo: "Controlled pilot (weeks 2–6)",
              descripcion:
                "One process — e.g. panelist retention — running with voice agents alongside your team, with comparable metrics.",
            },
            {
              titulo: "Metrics-driven scale-up",
              descripcion:
                "We extend coverage to more processes and hours, connect dashboards and automate reporting.",
            },
            {
              titulo: "Continuous operations",
              descripcion:
                "Monitoring, continuous improvement and data governance aligned with Habeas Data, ISO 20252 and industry codes.",
            },
          ],
        },
      },
      {
        type: "B10",
        order: 8,
        data: {
          preguntas: [
            {
              pregunta: "Do voice agents replace my operations team?",
              respuesta:
                "No. They absorb repetitive volume — reminders, verifications, short surveys — and free your team for judgment cases. Operations scale without growing payroll.",
            },
            {
              pregunta: "Does the voice sound natural in Spanish and English?",
              respuesta:
                "Yes. Neural voices with local accents, scripts co-designed with your field team, and human handoff whenever the panelist asks.",
            },
            {
              pregunta: "How does it integrate with our measurement and panel systems?",
              respuesta:
                "Via APIs on top of your current systems: panel CRM, measurement software and data warehouse. Nothing needs replacing to start.",
            },
            {
              pregunta: "What happens with panelist data?",
              respuesta:
                "It stays under your control, in your cloud and jurisdiction, with flows aligned to Habeas Data/GDPR: consent, minimization and per-interaction traceability.",
            },
            {
              pregunta: "How long until the first result?",
              respuesta:
                "A scoped pilot is live in weeks, with metrics comparable against your current operation before deciding to scale.",
            },
          ],
        },
      },
      {
        type: "B12",
        order: 9,
        data: {
          titulo: "Let's talk about your measurement operation",
          subtitulo: "30-minute diagnostic, free and no strings attached. We reply within 24h.",
          cta_texto: "Book diagnostic →",
          trust_signals: [
            "🔒 Data handled under Habeas Data / GDPR",
            "🏆 Great Place to Work · 13+ years · 7 countries",
            "⚡ Pilot running in weeks, not quarters",
          ],
        },
      },
      {
        type: "B18",
        order: 10,
        data: {
          mostrar_whatsapp: true,
          whatsapp_mensaje: "Hi, I saw the AI for audience measurement page and want to know more",
        },
      },
    ],
  },

  // ═══════════════════════════════════════════════════════════════════
  // 3 — IA para Investigación de Mercados (ES)
  // ═══════════════════════════════════════════════════════════════════
  {
    slug: "ia-investigacion-mercados",
    campaignName: "IA para Investigación de Mercados",
    serviceType: "ia",
    accentColor: "finops",
    noindex: true,
    metaTitle: "IA para Investigación de Mercados — Back-checks, CATI y Campo",
    metaDescription:
      "Back-checks con llamadas de IA al 100% de la muestra, CATI híbrido, dashboards de campo en tiempo real y entregables en días. Piloto en semanas.",
    whatsappMessage: "Hola, vi la página de IA para investigación de mercados y quiero saber más",
    utmSource: "niveleads",
    utmMedium: "email",
    utmCampaign: "research-2026",
    blocks: [
      {
        type: "B02",
        order: 1,
        data: {
          badge_text: "IA para Investigación de Mercados",
          h1: "¿Y si tu próximo estudio saliera a campo con el doble de supervisión y una fracción del costo?",
          subtitulo:
            "Back-checks con IA al 100% de la muestra, CATI híbrido, dashboards de campo en tiempo real y entregables en días. El 72% de los compradores de insights ya usa IA — tus clientes también la esperan.",
          form_title: "Agenda tu diagnóstico sin costo",
          cta_texto: "Quiero mi diagnóstico →",
        },
      },
      {
        type: "B03",
        order: 2,
        data: {
          titulo: "Tecnología entregada a líderes de datos y consumo en LATAM",
          logos: LOGOS,
        },
      },
      {
        type: "B04",
        order: 3,
        data: {
          titulo: "La industria ya se está moviendo",
          metricas: [
            {
              valor: "US$140B",
              label:
                "Industria global de investigación; solo lo AI-native crece a doble dígito (ESOMAR, 2025)",
            },
            {
              valor: "72%",
              label:
                "Compradores de insights usan IA generativa en al menos una etapa (GRIT, 2025)",
            },
            {
              valor: "100%",
              label: "De la muestra verificable con back-checks de IA (vs 10–20% manual)",
            },
            {
              valor: "US$0.40",
              label: "Costo por llamada de verificación con IA vs US$7–12 humana",
            },
          ],
        },
      },
      {
        type: "B13",
        order: 4,
        data: {
          titulo: "Estudio de hoy vs. estudio con IA",
          subtitulo: "La misma calidad metodológica, con supervisión total y entregas más rápidas.",
          columnas: ["Operación tradicional", "Con Nivelics + IA"],
          highlight_col_idx: 1,
          filas: [
            {
              criterio: "Back-checks de campo",
              values: ["10–20% de la muestra", "100% con llamadas de IA"],
            },
            {
              criterio: "Supervisión de encuestadores",
              values: ["Planillas y llamadas", "Dashboard en tiempo real con alertas"],
            },
            { criterio: "Codificación de abiertas", values: ["Manual, días", "IA, horas"] },
            {
              criterio: "Entrega de resultados",
              values: [
                "Semanas tras cierre de campo",
                "Días, con informes generados automáticamente",
              ],
            },
            { criterio: "Costo por verificación telefónica", values: ["US$7–12", "~US$0.40"] },
          ],
          footnote: "Cifras de costo por llamada: Retell AI / Ringly, 2025.",
        },
      },
      {
        type: "B05",
        order: 5,
        data: {
          titulo: "Qué construimos para firmas de investigación",
          items: [
            {
              icono: "shield",
              titulo: "Back-checks con llamadas de IA",
              descripcion:
                "Verificación automática de entrevistas: la IA llama, confirma, valida respuestas clave y deja evidencia auditable. Supervisión del 100%, no muestral.",
            },
            {
              icono: "users",
              titulo: "CATI híbrido humano + IA",
              descripcion:
                "Agentes de voz absorben volumen, horarios extendidos y cuestionarios cortos; tu equipo toma los casos complejos y las entrevistas en profundidad.",
            },
            {
              icono: "bar-chart-3",
              titulo: "Dashboards de campo y entregables con IA",
              descripcion:
                "Avance de cuotas y alertas de calidad en vivo; codificación de abiertas, cruces y primeros borradores de informe generados automáticamente.",
            },
          ],
        },
      },
      {
        type: "B08",
        order: 6,
        data: {
          client_name: "Grupo Bolívar",
          country: "🇨🇴 Colombia",
          sector: "Seguros / Salud / E-commerce",
          resultado: "25% de reducción de costos operativos y 85% de adopción digital",
          extracto:
            "Con Grupo Bolívar lanzamos 3 productos digitales con 25% de reducción de costos operativos y 85% de adopción digital. Sabemos convertir operación manual en operación digital medible.",
        },
      },
      {
        type: "B07",
        order: 7,
        data: {
          titulo: "De diagnóstico a piloto en un estudio real",
          pasos: [
            {
              titulo: "Diagnóstico del ciclo del estudio (semana 1)",
              descripcion:
                "Mapeamos campo, supervisión, procesamiento y entrega, y cuantificamos dónde la automatización genera más margen y velocidad.",
            },
            {
              titulo: "Piloto en un estudio real (semanas 2–6)",
              descripcion:
                "Un proceso —por ejemplo back-checks— corriendo con IA en paralelo a tu método actual, comparando cobertura, costo y hallazgos.",
            },
            {
              titulo: "Escalamiento por línea de servicio",
              descripcion:
                "Extendemos la automatización a CATI, dashboards de campo y generación de entregables, estudio por estudio.",
            },
            {
              titulo: "Operación continua",
              descripcion:
                "Monitoreo de calidad, mejora de modelos y cumplimiento ISO 20252 / ICC-ESOMAR en los procesos automatizados.",
            },
          ],
        },
      },
      {
        type: "B10",
        order: 8,
        data: {
          preguntas: [
            {
              pregunta: "¿Las llamadas de IA sesgan las respuestas?",
              respuesta:
                "Los estudios muestran completitud superior al email y consistencia alta en cuestionarios estructurados. Para instrumentos sensibles diseñamos pruebas A/B contra tu método actual antes de escalar.",
            },
            {
              pregunta: "¿Funciona con nuestros cuestionarios y plataformas actuales?",
              respuesta:
                "Sí. Los agentes se configuran desde tus cuestionarios existentes y se integran vía API con tu software de campo, CATI o panel.",
            },
            {
              pregunta: "¿Y los estudios presenciales o cualitativos?",
              respuesta:
                "Se benefician de la supervisión: back-checks de IA sobre el 100% de las entrevistas, dashboards de avance y transcripción/análisis automático de sesiones. La IA potencia el campo, no lo sustituye.",
            },
            {
              pregunta: "¿Cómo se protegen los datos de los encuestados?",
              respuesta:
                "Viven en tu infraestructura y jurisdicción, con consentimiento informado, minimización y trazabilidad por interacción, alineado a Habeas Data, GDPR e ISO 20252.",
            },
            {
              pregunta: "¿Cuánto toma tener un piloto andando?",
              respuesta:
                "Un piloto de back-checks o CATI corto queda operando en semanas sobre un estudio real, con métricas comparables antes de decidir el escalamiento.",
            },
          ],
        },
      },
      {
        type: "B12",
        order: 9,
        data: {
          titulo: "Hablemos de tu operación de campo",
          subtitulo:
            "Diagnóstico de 30 minutos, sin costo y sin compromiso. Te respondemos en menos de 24h.",
          cta_texto: "Agendar diagnóstico →",
          trust_signals: [
            "🔒 Datos tratados bajo Habeas Data / GDPR e ISO 20252",
            "🏆 Great Place to Work · 13+ años · 7 países",
            "⚡ Piloto sobre un estudio real, en semanas",
          ],
        },
      },
      {
        type: "B18",
        order: 10,
        data: {
          mostrar_whatsapp: true,
          whatsapp_mensaje:
            "Hola, vi la página de IA para investigación de mercados y quiero saber más",
        },
      },
    ],
  },

  // ═══════════════════════════════════════════════════════════════════
  // 4 — AI for Market Research (EN)
  // ═══════════════════════════════════════════════════════════════════
  {
    slug: "ai-market-research",
    campaignName: "AI for Market Research",
    serviceType: "ia",
    accentColor: "finops",
    noindex: true,
    metaTitle: "AI for Market Research — Back-checks, CATI & Fieldwork",
    metaDescription:
      "AI-call back-checks across 100% of your sample, hybrid CATI, real-time field dashboards and deliverables in days. Pilot in weeks.",
    whatsappMessage: "Hi, I saw the AI for market research page and want to know more",
    utmSource: "niveleads",
    utmMedium: "email",
    utmCampaign: "market-research-2026",
    blocks: [
      {
        type: "B02",
        order: 1,
        data: {
          badge_text: "AI for Market Research",
          h1: "What if your next study went to field with twice the supervision at a fraction of the cost?",
          subtitulo:
            "AI back-checks across 100% of the sample, hybrid CATI, real-time field dashboards and deliverables in days. 72% of insights buyers already use AI — your clients expect it too.",
          form_title: "Book your free diagnostic",
          cta_texto: "Get my diagnostic →",
        },
      },
      {
        type: "B03",
        order: 2,
        data: {
          titulo: "Technology delivered to data and consumer leaders across LATAM",
          logos: LOGOS,
        },
      },
      {
        type: "B04",
        order: 3,
        data: {
          titulo: "The industry is already moving",
          metricas: [
            {
              valor: "US$140B",
              label:
                "Global research industry; only AI-native methods grow double digits (ESOMAR, 2025)",
            },
            {
              valor: "72%",
              label: "Insights buyers using generative AI in at least one stage (GRIT, 2025)",
            },
            {
              valor: "100%",
              label: "Of the sample verifiable with AI back-checks (vs 10–20% manual)",
            },
            { valor: "US$0.40", label: "Cost per AI verification call vs US$7–12 human" },
          ],
        },
      },
      {
        type: "B13",
        order: 4,
        data: {
          titulo: "Today's study vs. an AI-powered study",
          subtitulo: "The same methodological rigor, with total supervision and faster delivery.",
          columnas: ["Traditional operation", "With Nivelics + AI"],
          highlight_col_idx: 1,
          filas: [
            {
              criterio: "Field back-checks",
              values: ["10–20% of the sample", "100% with AI calls"],
            },
            {
              criterio: "Interviewer supervision",
              values: ["Spreadsheets and calls", "Real-time dashboard with alerts"],
            },
            { criterio: "Open-end coding", values: ["Manual, days", "AI, hours"] },
            {
              criterio: "Results delivery",
              values: ["Weeks after field close", "Days, with automatically generated reports"],
            },
            { criterio: "Cost per verification call", values: ["US$7–12", "~US$0.40"] },
          ],
          footnote: "Cost-per-call figures: Retell AI / Ringly, 2025.",
        },
      },
      {
        type: "B05",
        order: 5,
        data: {
          titulo: "What we build for research firms",
          items: [
            {
              icono: "shield",
              titulo: "AI-call back-checks",
              descripcion:
                "Automatic interview verification: the AI calls, confirms, validates key answers and records auditable evidence. 100% supervision, not sample-based.",
            },
            {
              icono: "users",
              titulo: "Hybrid human + AI CATI",
              descripcion:
                "Voice agents absorb volume, extended hours and short questionnaires; your team takes complex cases and in-depth interviews.",
            },
            {
              icono: "bar-chart-3",
              titulo: "Field dashboards and AI deliverables",
              descripcion:
                "Live quota progress and quality alerts; open-end coding, cross-tabs and first report drafts generated automatically.",
            },
          ],
        },
      },
      {
        type: "B08",
        order: 6,
        data: {
          client_name: "Grupo Bolívar",
          country: "🇨🇴 Colombia",
          sector: "Insurance / Health / E-commerce",
          resultado: "25% reduction in operational costs and 85% digital adoption",
          extracto:
            "With Grupo Bolívar we launched 3 digital products achieving a 25% reduction in operational costs and 85% digital adoption. We know how to turn manual operations into measurable digital ones.",
        },
      },
      {
        type: "B07",
        order: 7,
        data: {
          titulo: "From diagnostic to a pilot on a real study",
          pasos: [
            {
              titulo: "Study-cycle diagnostic (week 1)",
              descripcion:
                "We map fieldwork, supervision, processing and delivery, and quantify where automation yields the most margin and speed.",
            },
            {
              titulo: "Pilot on a real study (weeks 2–6)",
              descripcion:
                "One process — e.g. back-checks — running with AI alongside your current method, comparing coverage, cost and findings.",
            },
            {
              titulo: "Scale-up by service line",
              descripcion:
                "We extend automation to CATI, field dashboards and deliverable generation, study by study.",
            },
            {
              titulo: "Continuous operations",
              descripcion:
                "Quality monitoring, model improvement and ISO 20252 / ICC-ESOMAR compliance across automated processes.",
            },
          ],
        },
      },
      {
        type: "B10",
        order: 8,
        data: {
          preguntas: [
            {
              pregunta: "Do AI calls bias respondent answers?",
              respuesta:
                "Studies show completion above email and high consistency on structured questionnaires. For sensitive instruments we design A/B tests against your current method before scaling.",
            },
            {
              pregunta: "Does it work with our current questionnaires and platforms?",
              respuesta:
                "Yes. Agents are configured from your existing questionnaires and integrate via API with your field, CATI or panel software.",
            },
            {
              pregunta: "What about face-to-face or qualitative studies?",
              respuesta:
                "They benefit from supervision: AI back-checks across 100% of interviews, progress dashboards and automatic session transcription/analysis. AI augments fieldwork — it doesn't replace it.",
            },
            {
              pregunta: "How is respondent data protected?",
              respuesta:
                "It lives in your infrastructure and jurisdiction, with informed consent, minimization and per-interaction traceability, aligned with Habeas Data, GDPR and ISO 20252.",
            },
            {
              pregunta: "How long to get a pilot running?",
              respuesta:
                "A back-check or short-CATI pilot runs within weeks on a real study, with comparable metrics before deciding to scale.",
            },
          ],
        },
      },
      {
        type: "B12",
        order: 9,
        data: {
          titulo: "Let's talk about your field operation",
          subtitulo: "30-minute diagnostic, free and no strings attached. We reply within 24h.",
          cta_texto: "Book diagnostic →",
          trust_signals: [
            "🔒 Data handled under Habeas Data / GDPR and ISO 20252",
            "🏆 Great Place to Work · 13+ years · 7 countries",
            "⚡ Pilot on a real study, in weeks",
          ],
        },
      },
      {
        type: "B18",
        order: 10,
        data: {
          mostrar_whatsapp: true,
          whatsapp_mensaje: "Hi, I saw the AI for market research page and want to know more",
        },
      },
    ],
  },
];

async function main() {
  const url = process.env.DATABASE_URL;
  if (!url) throw new Error("DATABASE_URL no está definida");
  const db = drizzle(neon(url), { schema });

  for (const landing of LANDINGS) {
    const existing = await db
      .select({ id: schema.landingPages.id })
      .from(schema.landingPages)
      .where(eq(schema.landingPages.slug, landing.slug))
      .limit(1);

    if (existing.length > 0) {
      console.log(`[SKIP] ${landing.slug} — ya existe`);
      continue;
    }

    await db.insert(schema.landingPages).values({
      slug: landing.slug,
      campaignName: landing.campaignName,
      serviceType: landing.serviceType,
      accentColor: landing.accentColor,
      noindex: landing.noindex,
      metaTitle: landing.metaTitle,
      metaDescription: landing.metaDescription,
      whatsappMessage: landing.whatsappMessage,
      utmSource: landing.utmSource,
      utmMedium: landing.utmMedium,
      utmCampaign: landing.utmCampaign,
      blocks: landing.blocks,
      status: "published",
    });
    console.log(`[OK] ${landing.slug} — creada (published, noindex)`);
  }

  console.log("\n✅ 4 landings listas. URLs:");
  for (const l of LANDINGS)
    console.log(`   https://www.nivelics.com${l.slug.startsWith("ai-") ? "/en" : ""}/lp/${l.slug}`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
