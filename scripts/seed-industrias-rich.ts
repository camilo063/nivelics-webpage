/**
 * Seed rich expertise content (ES) for the 6 industry pages.
 *
 * Populates: metrics, statHighlights, regulations, useCases, playbook,
 * industryFaqs, techStack, servicesHighlight, ctaTitle/ctaPrimary,
 * hubIntro, and extends painPoints with statEs/statEn (statEn left blank
 * for the translation agent).
 *
 * English fields are left null — a second pass with Anthropic will fill them.
 * Safe to re-run: uses UPDATE ... WHERE slug_es = X, overwrites rich fields only.
 */
import { drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";
import { eq } from "drizzle-orm";
import * as schema from "../lib/db/schema/admin";

type IndustriaSeed = {
  slug: string;
  painPoints: Array<{
    icon: string;
    titleEs: string;
    descEs: string;
    statEs?: string;
  }>;
  metrics: Array<{ value: string; labelEs: string }>;
  statHighlights: Array<{ value: string; labelEs: string; source?: string }>;
  regulations: Array<{ code: string; nameEs: string; descEs?: string }>;
  useCases: Array<{
    icon: string;
    titleEs: string;
    descEs: string;
    outcomeEs?: string;
  }>;
  playbook: Array<{ number: string; titleEs: string; descEs: string }>;
  industryFaqs: Array<{ questionEs: string; answerEs: string }>;
  techStack: Array<{
    label: string;
    category: "cloud" | "data" | "ai" | "frontend" | "backend" | "security" | "other";
  }>;
  servicesHighlight: string[];
  ctaTitleEs: string;
  ctaPrimaryTextEs: string;
  ctaPrimaryUrl: string;
  hubIntroTitleEs?: string;
  hubIntroSubtitleEs?: string;
};

const SEEDS: IndustriaSeed[] = [
  // ─────────────────────────── FINTECH ───────────────────────────
  {
    slug: "fintech",
    painPoints: [
      {
        icon: "⚖️",
        titleEs: "Regulación financiera que cambia cada trimestre",
        descEs:
          "PCI-DSS, Open Banking, SARLAFT, Habeas Data. Cada reforma obliga a tocar infraestructura, flujos de datos y controles de acceso. Un solo hallazgo de auditoría puede bloquear un lanzamiento 90 días.",
        statEs: "73% de las fintechs en LATAM citan compliance como el freno #1 al crecimiento.",
      },
      {
        icon: "🔐",
        titleEs: "Fraude en tiempo real sin fricción al usuario",
        descEs:
          "Los patrones de fraude mutan en semanas. Reglas estáticas fallan; los modelos lentos bloquean buenos usuarios. Se necesita scoring sub-100ms con fallback humano auditable.",
        statEs:
          "El fraude en pagos digitales creció 28% YoY en 2024 (fuente: Chainalysis, Felaban).",
      },
      {
        icon: "⚡",
        titleEs: "Picos de transacciones en días de nómina y cierres",
        descEs:
          "5–10× de carga concentrados en 2 horas. Tumba endpoints críticos, dispara costos cloud y genera timeouts que se traducen en abandono. Escalar por adelantado no es una opción rentable.",
      },
      {
        icon: "🧩",
        titleEs: "Core legacy que no se puede apagar",
        descEs:
          "El mainframe o el monolito bancario sigue siendo el sistema de verdad. Modernizar encima —sin migrar en big-bang— exige anti-corruption layers, event streaming y gobierno de datos estricto.",
      },
      {
        icon: "📱",
        titleEs: "Onboarding KYC que convierte",
        descEs:
          "Cada paso extra de verificación cuesta 10–15% de conversión. Liveness, OCR de documento, validación de bureau y AML deben ocurrir en < 90 segundos sin ceder compliance.",
        statEs: "Solo el 45% de usuarios que inicia un onboarding de cuenta digital lo completa.",
      },
    ],
    metrics: [
      { value: "99.95%", labelEs: "Uptime en sistemas de pago entregados" },
      { value: "<100ms", labelEs: "Latencia scoring de fraude" },
      { value: "40%", labelEs: "Reducción costo cloud por FinOps" },
      { value: "5 días", labelEs: "Al primer ingeniero senior integrado" },
    ],
    statHighlights: [
      {
        value: "US$156B",
        labelEs: "Volumen anual de pagos digitales en LATAM",
        source: "Americas Market Intelligence, 2024",
      },
      {
        value: "68%",
        labelEs: "De bancos en LATAM con iniciativas de IA generativa en producción",
        source: "Felaban LATAM Survey 2024",
      },
      {
        value: "1 de 3",
        labelEs: "Fintechs regionales cierra por problemas de escalabilidad técnica",
        source: "Finnovista Fintech Radar 2024",
      },
    ],
    regulations: [
      {
        code: "PCI-DSS",
        nameEs: "Payment Card Industry Data Security Standard",
        descEs:
          "Estándar obligatorio para cualquier sistema que toque datos de tarjeta. Exige segmentación de red, logging inmutable y tokenización.",
      },
      {
        code: "SARLAFT",
        nameEs: "Sistema de Administración de Riesgo de LA/FT",
        descEs:
          "Prevención de lavado de activos y financiación del terrorismo. Reportería a UIAF y monitoreo continuo de transacciones.",
      },
      {
        code: "Ley 1581",
        nameEs: "Habeas Data Colombia",
        descEs: "Consentimiento, derecho de supresión y reporte de incidentes a la SIC.",
      },
      {
        code: "SOC 2 Type II",
        nameEs: "Service Organization Control 2",
        descEs: "Auditoría anual de controles de seguridad, disponibilidad y confidencialidad.",
      },
      {
        code: "Open Banking",
        nameEs: "Circular 004 Banco de la República",
        descEs:
          "APIs estandarizadas para compartir datos financieros con autorización del cliente.",
      },
      {
        code: "Circular 007",
        nameEs: "Ciberseguridad SFC",
        descEs:
          "Superintendencia Financiera: gestión de ciber-riesgos, reporte de incidentes en 24h.",
      },
    ],
    useCases: [
      {
        icon: "🧠",
        titleEs: "Scoring alternativo con datos no tradicionales",
        descEs:
          "Modelos que usan comportamiento digital, histórico de pagos de servicios y señales open banking para evaluar riesgo de clientes sin historial bancario tradicional.",
        outcomeEs:
          "Aprobación 2.3× mayor en segmentos sub-bancarizados manteniendo tasa de mora controlada.",
      },
      {
        icon: "🛡️",
        titleEs: "Detección de fraude con gradient boosting + reglas",
        descEs:
          "Pipeline de features en tiempo real sobre Kafka, modelo servido en < 80ms, motor de reglas editable por el equipo de fraude sin redeploy.",
        outcomeEs: "38% menos falsos positivos, sin aumentar chargebacks.",
      },
      {
        icon: "🏗️",
        titleEs: "Migración de core legacy con strangler pattern",
        descEs:
          "Anti-corruption layer entre el core antiguo y los nuevos microservicios. Se van apagando módulos mes a mes, nunca en big-bang.",
        outcomeEs:
          "3 productos digitales lanzados en paralelo sin tocar una línea del core original.",
      },
      {
        icon: "📲",
        titleEs: "Onboarding digital en 90 segundos",
        descEs:
          "Liveness con proveedor regional, OCR on-device, validación bureau en paralelo y AML con screening a listas restrictivas. Abandonos monitoreados por paso.",
        outcomeEs: "De 45% a 71% de completion rate en apertura de cuenta.",
      },
    ],
    playbook: [
      {
        number: "01",
        titleEs: "Assessment regulatorio y de riesgo",
        descEs:
          "Mapeamos controles actuales vs. lo que exige tu regulador. Salida: plan priorizado de remediación.",
      },
      {
        number: "02",
        titleEs: "Arquitectura event-driven con compliance embebido",
        descEs:
          "Logging inmutable, tokenización y segmentación de red se diseñan desde el día 1. No se pega después.",
      },
      {
        number: "03",
        titleEs: "Entrega incremental con demos quincenales",
        descEs:
          "Cada sprint produce algo auditable. Nunca ves un big-bang; siempre puedes frenar sin perder inversión.",
      },
      {
        number: "04",
        titleEs: "Operación con FinOps y handover real",
        descEs:
          "Transferimos runbooks, dashboards y ownership a tu equipo. El código es 100% tuyo.",
      },
    ],
    industryFaqs: [
      {
        questionEs: "¿Nivelics puede operar bajo PCI-DSS y SOC 2?",
        answerEs:
          "Sí. Los equipos que asignamos a proyectos PCI trabajan en ambientes aislados con controles de acceso y revisión de código según el scope del cliente. Participamos en auditorías de renovación SOC 2 Type II con nuestros clientes bancarios.",
      },
      {
        questionEs: "¿Cuánto demoran en integrar un perfil senior para un core financiero?",
        answerEs:
          "Presentamos candidatos en 5 días hábiles. Para perfiles que tocan core bancario exigimos experiencia comprobable en Java/Spring, Kafka y bases de datos transaccionales. La integración completa al equipo del cliente toma 6–10 días.",
      },
      {
        questionEs: "¿Tienen experiencia con Open Banking en LATAM?",
        answerEs:
          "Sí. Hemos implementado APIs de Open Banking bajo la Circular 004 en Colombia y estándares equivalentes en México y Chile. Conocemos los flujos de consentimiento, los plazos de revocación y los requisitos de firma electrónica.",
      },
      {
        questionEs: "¿Pueden migrar un core bancario sin apagar el existente?",
        answerEs:
          "Sí, usamos strangler pattern con una capa anti-corrupción. Nuestra referencia más reciente es Grupo Bolívar: 3 productos digitales lanzados sin tocar el core original. Los apagados son graduales y siempre con rollback posible.",
      },
      {
        questionEs: "¿Qué modelos de contratación manejan para fintechs?",
        answerEs:
          "Tres opciones: (1) Staff Augmentation mensual por ingeniero, (2) Proyecto a precio fijo con alcance cerrado, (3) Fee + success sobre KPIs medibles (ahorro cloud, conversión de onboarding, reducción de fraude). Elegimos con el cliente según el riesgo compartido que tenga sentido.",
      },
    ],
    techStack: [
      { label: "AWS", category: "cloud" },
      { label: "GCP", category: "cloud" },
      { label: "Terraform", category: "cloud" },
      { label: "Kafka", category: "data" },
      { label: "PostgreSQL", category: "backend" },
      { label: "Redis", category: "backend" },
      { label: "Kubernetes", category: "cloud" },
      { label: "Java / Spring", category: "backend" },
      { label: "Node.js", category: "backend" },
      { label: "React Native", category: "frontend" },
      { label: "Python / FastAPI", category: "ai" },
      { label: "Snowflake", category: "data" },
      { label: "HashiCorp Vault", category: "security" },
      { label: "Datadog", category: "other" },
    ],
    servicesHighlight: ["ia", "cloud", "staffing", "desarrollo-digital"],
    ctaTitleEs: "¿Tu fintech necesita escalar sin perder compliance?",
    ctaPrimaryTextEs: "Hablar con un especialista Fintech",
    ctaPrimaryUrl: "/contacto?industria=fintech",
    hubIntroTitleEs: "Compliance, escalabilidad y fraude en tiempo real",
    hubIntroSubtitleEs:
      "13 años entregando tecnología para bancos, neobancos y plataformas de pago en LATAM y USA.",
  },

  // ─────────────────────── MEDIOS Y ENTRETENIMIENTO ───────────────────────
  {
    slug: "medios-entretenimiento",
    painPoints: [
      {
        icon: "📺",
        titleEs: "Lanzamientos en vivo con millones concurrentes",
        descEs:
          "Un partido, un estreno o una noticia explosiva puede generar 50× el tráfico habitual en minutos. La infraestructura debe escalar sin fricción y sin sorprenderte con la factura.",
        statEs: "Un trending topic puede generar hasta 50× el tráfico habitual en < 10 minutos.",
      },
      {
        icon: "💵",
        titleEs: "Monetización más allá del pre-roll",
        descEs:
          "El CPM tradicional se erosiona. Suscripciones, membresías, ad-tech contextual y comercio afiliado requieren data unificada del usuario y A/B testing continuo.",
      },
      {
        icon: "🎬",
        titleEs: "Pipeline de contenido VOD + live",
        descEs:
          "Ingest, transcoding adaptativo, DRM multi-plataforma, subtítulos automáticos y metadatos SEO. Todo con SLA de publicación sub-hora para medios noticiosos.",
      },
      {
        icon: "🤖",
        titleEs: "IA para curación, personalización y moderación",
        descEs:
          "Recomendador de contenido, resumen automático, detección de copyright y moderación de comentarios en tiempo real. No son features opcionales, son tabla mínima.",
      },
      {
        icon: "🔗",
        titleEs: "SEO técnico para portales de alto tráfico",
        descEs:
          "Millones de URLs, paginación profunda, imagen crítica para LCP, schema de NewsArticle. Una regresión de Core Web Vitals cuesta tráfico orgánico real.",
      },
    ],
    metrics: [
      { value: "10M+", labelEs: "Usuarios activos en plataformas entregadas" },
      { value: "50×", labelEs: "Picos de tráfico absorbidos sin degradación" },
      { value: "<2s", labelEs: "Tiempo a primer frame en live streaming" },
      { value: "7 países", labelEs: "Con plataformas de medios en producción" },
    ],
    statHighlights: [
      {
        value: "73%",
        labelEs: "Del consumo de video en LATAM es via streaming OTT",
        source: "Dataxis LATAM Report 2024",
      },
      {
        value: "3.2×",
        labelEs: "Más retención con recomendador personalizado vs. parrilla estática",
        source: "Nivelics benchmark con clientes en medios",
      },
      {
        value: "40%",
        labelEs: "Del inventario publicitario digital no se llena por falta de data unificada",
        source: "IAB LATAM 2024",
      },
    ],
    regulations: [
      {
        code: "COPPA",
        nameEs: "Children's Online Privacy Protection Act (USA)",
        descEs: "Requerido para cualquier contenido dirigido a menores de 13 años.",
      },
      {
        code: "DRM",
        nameEs: "Widevine / FairPlay / PlayReady",
        descEs:
          "Gestión de derechos digitales multi-plataforma. Obligatorio para catálogo con licencias.",
      },
      {
        code: "GDPR",
        nameEs: "Consentimiento de cookies y datos",
        descEs: "Aplica para audiencia europea. CMP y flujos de opt-out documentados.",
      },
      {
        code: "Habeas Data",
        nameEs: "Colombia / LATAM",
        descEs: "Tratamiento de datos de usuarios registrados y preferencias de consumo.",
      },
    ],
    useCases: [
      {
        icon: "🎥",
        titleEs: "Plataforma de streaming OTT desde cero",
        descEs:
          "Ingest multi-formato, transcoding con packaging HLS/DASH, DRM, CDN geo-distribuida, apps para iOS/Android/Smart TV y analytics unificado. Lanzamiento en 6 meses.",
        outcomeEs: "Caso Televisa/N+: millones de usuarios activos, SLA 99.95%.",
      },
      {
        icon: "✍️",
        titleEs: "Portal de noticias con SEO de clase mundial",
        descEs:
          "Publicación sub-hora, schema NewsArticle, Core Web Vitals en verde, paginación optimizada para crawlers. Integración con AMP y CDN multi-región.",
        outcomeEs: "Caso Pulzo/Crónica: millones de visitas mensuales con infra elástica.",
      },
      {
        icon: "🎯",
        titleEs: "Recomendador híbrido (collaborative + content-based)",
        descEs:
          "Modelo de embeddings sobre historial de consumo y metadata de contenido. A/B test continuo contra parrilla editorial.",
        outcomeEs: "2.3× incremento en minutos consumidos por sesión.",
      },
      {
        icon: "🔴",
        titleEs: "Live event infrastructure con auto-scale agresivo",
        descEs:
          "Pre-warm de infra 30min antes del evento, circuit breakers entre servicios, monitoreo por tenant. Rollback manual siempre disponible.",
        outcomeEs: "0 downtime en transmisiones de eventos masivos.",
      },
    ],
    playbook: [
      {
        number: "01",
        titleEs: "Análisis de catálogo, audiencia y canales",
        descEs:
          "Entendemos tu parrilla, tu audiencia actual y los dispositivos donde viven. Priorizamos features por impacto en retención.",
      },
      {
        number: "02",
        titleEs: "Arquitectura event-driven lista para picos",
        descEs:
          "CDN multi-región, mensajería asíncrona, caché por tier y observabilidad desde el día 1.",
      },
      {
        number: "03",
        titleEs: "Entrega modular con demos quincenales",
        descEs:
          "Primero el player y el catálogo, luego recomendador, luego ad-tech. Cada módulo entra a producción con feature flag.",
      },
      {
        number: "04",
        titleEs: "Operación con FinOps y handover a tu equipo",
        descEs:
          "El costo por usuario activo se documenta y se optimiza mes a mes. Tu equipo recibe runbooks y dashboards listos.",
      },
    ],
    industryFaqs: [
      {
        questionEs: "¿Han entregado plataformas de streaming con millones de usuarios?",
        answerEs:
          "Sí. Construimos N+ de Televisa (México) desde cero, operando con millones de usuarios activos. También operamos infraestructura para Univision (USA), Pulzo (Colombia) y Crónica (Colombia).",
      },
      {
        questionEs: "¿Cuánto tardan en lanzar un portal de noticias de alto tráfico?",
        answerEs:
          "Entre 3 y 6 meses según alcance. El primer sprint entrega un CMS headless funcional con publicación sub-hora. Los siguientes sprints agregan personalización, paywall o ad-tech según prioridades.",
      },
      {
        questionEs: "¿Pueden manejar DRM en todas las plataformas?",
        answerEs:
          "Sí. Empaquetamos con Widevine (Android/Web), FairPlay (Apple) y PlayReady (Smart TV). Integramos con proveedores de DRM regionales y globales, y gestionamos las políticas de output protection.",
      },
      {
        questionEs: "¿Cómo optimizan Core Web Vitals en portales con millones de URLs?",
        answerEs:
          "LCP de imagen crítica, lazy loading selectivo, prerender de rutas top-100 y CDN por región. Auditamos cada sprint con Lighthouse en rutas representativas; regresiones rompen el pipeline.",
      },
      {
        questionEs: "¿Qué stack usan para recomendadores de contenido?",
        answerEs:
          "Python + PyTorch para entrenamiento, embeddings servidos por pgvector o Pinecone, ranking en tiempo real con FastAPI. Monitoreo de drift y A/B testing contra parrilla editorial.",
      },
    ],
    techStack: [
      { label: "AWS MediaConvert", category: "cloud" },
      { label: "CloudFront", category: "cloud" },
      { label: "Kafka", category: "data" },
      { label: "Next.js", category: "frontend" },
      { label: "React Native", category: "frontend" },
      { label: "Node.js", category: "backend" },
      { label: "PostgreSQL", category: "backend" },
      { label: "Redis", category: "backend" },
      { label: "ElasticSearch", category: "data" },
      { label: "PyTorch", category: "ai" },
      { label: "pgvector", category: "ai" },
      { label: "Widevine / FairPlay", category: "security" },
      { label: "Datadog", category: "other" },
    ],
    servicesHighlight: ["desarrollo-digital", "cloud", "ia", "staffing"],
    ctaTitleEs: "¿Necesitas una plataforma que aguante el próximo evento en vivo?",
    ctaPrimaryTextEs: "Hablar con un especialista en medios",
    ctaPrimaryUrl: "/contacto?industria=medios",
    hubIntroTitleEs: "Streaming, noticias y ad-tech que escalan con el trending topic",
    hubIntroSubtitleEs:
      "Operamos plataformas de medios en 7 países. Televisa, Univision, Pulzo y Crónica confían en nosotros.",
  },

  // ─────────────────────── SALUD ───────────────────────
  {
    slug: "salud",
    painPoints: [
      {
        icon: "🔒",
        titleEs: "Datos clínicos que no pueden salirse del perímetro",
        descEs:
          "HIPAA, HITECH y normativas locales obligan a cifrado en reposo y tránsito, trazabilidad completa y BAA firmados con cada proveedor cloud que toque PHI.",
        statEs:
          "El costo promedio de una brecha en salud es US$10.9M — el más alto de cualquier industria.",
      },
      {
        icon: "🏥",
        titleEs: "Interoperabilidad real entre sistemas heterogéneos",
        descEs:
          "HIS, LIS, RIS, PACS, EMR propios de cada clínica. Integrar sin perder semántica exige HL7/FHIR, terminologías estándar (LOINC, SNOMED) y observabilidad de mensajes.",
      },
      {
        icon: "⏱️",
        titleEs: "Flujos clínicos que no toleran fricción",
        descEs:
          "Si la consulta digital agrega más de 60 segundos al tiempo del médico, se abandona. Las interfaces deben ser operables en 1–2 clics, con fallback a papel cuando falla la red.",
      },
      {
        icon: "🧪",
        titleEs: "Modelos de IA con validación clínica, no marketing",
        descEs:
          "Triaje, lectura de imagen o predicción de deterioro deben tener métricas publicables (sensibilidad, especificidad), protocolo de validación con médicos y gobernanza de drift.",
      },
      {
        icon: "📲",
        titleEs: "Telemedicina que sobrevive a conexiones débiles",
        descEs:
          "Zonas rurales, hoteles, casas. Videollamada adaptativa, fallback a chat + foto, sincronización offline-first para historia clínica del terreno.",
      },
    ],
    metrics: [
      { value: "100%", labelEs: "Logging auditable en proyectos con PHI" },
      { value: "HIPAA", labelEs: "BAA vigente con proveedores cloud" },
      { value: "<500ms", labelEs: "Latencia en consultas a FHIR server" },
      { value: "0", labelEs: "Incidentes de exposición de datos en 13 años" },
    ],
    statHighlights: [
      {
        value: "67%",
        labelEs: "De instituciones de salud en LATAM planean adoptar IA en 2 años",
        source: "Frost & Sullivan Healthcare 2024",
      },
      {
        value: "US$1.5T",
        labelEs: "Gasto global en salud digital para 2027",
        source: "Grand View Research",
      },
      {
        value: "30%",
        labelEs: "Reducción en tiempos de consulta con triaje asistido por IA",
        source: "JAMA Network Open, 2023",
      },
    ],
    regulations: [
      {
        code: "HIPAA",
        nameEs: "Health Insurance Portability and Accountability Act (USA)",
        descEs: "BAA obligatorio, cifrado AES-256, audit trails inmutables y right-to-access.",
      },
      {
        code: "HITECH",
        nameEs: "Health Information Technology for Economic and Clinical Health",
        descEs: "Breach notification en 60 días, controles adicionales sobre proveedores.",
      },
      {
        code: "ISO 27799",
        nameEs: "Information security in health",
        descEs: "Gestión de seguridad de información específicamente para datos clínicos.",
      },
      {
        code: "Ley 1581",
        nameEs: "Habeas Data Colombia — datos sensibles de salud",
        descEs: "Consentimiento expreso e informado, protección reforzada por categoría sensible.",
      },
      {
        code: "HL7 FHIR",
        nameEs: "Fast Healthcare Interoperability Resources",
        descEs: "Estándar de intercambio de información clínica. Base para interoperabilidad real.",
      },
    ],
    useCases: [
      {
        icon: "👩‍⚕️",
        titleEs: "Historia clínica electrónica con workflow clínico",
        descEs:
          "EMR diseñado con médicos, no con product managers. Orden de entrada rápida, plantillas por especialidad, integración con PACS y resultados de laboratorio en la misma vista.",
        outcomeEs: "Reducción 40% en tiempo de documentación clínica.",
      },
      {
        icon: "🩺",
        titleEs: "Plataforma de telemedicina con offline-first",
        descEs:
          "Videoconsulta con adaptación de bitrate, fallback a chat + archivos, sync diferido de historia clínica. Funciona en conexiones de 3G inestable.",
        outcomeEs:
          "Consulta completada exitosa en 94% de los intentos, incluso en zonas con conectividad limitada.",
      },
      {
        icon: "🧠",
        titleEs: "Triaje asistido por IA con protocolo de validación",
        descEs:
          "Modelo de clasificación entrenado con historias locales, no datasets importados. Validación ciega con comité médico antes de producción. Gobernanza de drift mensual.",
        outcomeEs: "Priorización de urgencias consistente con el juicio médico en 91% de casos.",
      },
      {
        icon: "🔗",
        titleEs: "Motor de interoperabilidad HL7/FHIR",
        descEs:
          "Gateway que traduce mensajes entre HIS legacy y plataformas modernas. Cola con retries, mapeo de terminologías y dashboard de mensajes fallidos para el equipo clínico.",
        outcomeEs:
          "Integración 12 sistemas hospitalarios heterogéneos en un solo timeline clínico.",
      },
    ],
    playbook: [
      {
        number: "01",
        titleEs: "Diagnóstico regulatorio y clínico",
        descEs:
          "Mapeamos flujos clínicos reales y obligaciones de HIPAA/HITECH aplicables. No diseñamos tecnología en abstracto.",
      },
      {
        number: "02",
        titleEs: "Arquitectura con privacidad por diseño",
        descEs:
          "Segmentación de redes, cifrado gestionado, BAA con proveedores y logging inmutable desde el primer sprint.",
      },
      {
        number: "03",
        titleEs: "Validación con médicos reales, no demos",
        descEs:
          "Cada feature clínica pasa por un comité médico. Sin buy-in de los usuarios, no va a producción.",
      },
      {
        number: "04",
        titleEs: "Gobernanza de datos y modelos post-go-live",
        descEs:
          "Monitoreo de drift, auditorías trimestrales de permisos, reporte de incidentes según HITECH.",
      },
    ],
    industryFaqs: [
      {
        questionEs: "¿Operan bajo HIPAA en USA?",
        answerEs:
          "Sí. Firmamos BAA con clientes en USA y usamos servicios cloud con HIPAA-eligibility (AWS, GCP, Azure). Los perfiles asignados a proyectos con PHI reciben entrenamiento HIPAA documentado.",
      },
      {
        questionEs: "¿Tienen experiencia con HL7 y FHIR?",
        answerEs:
          "Sí. Implementamos gateways FHIR para integrar HIS, LIS y EMR de terceros. Manejamos recursos Patient, Encounter, Observation, DiagnosticReport y los extendemos cuando las terminologías locales lo requieren.",
      },
      {
        questionEs: "¿Cómo validan modelos de IA clínica antes de producción?",
        answerEs:
          "Protocolo de 3 fases: (1) validación retrospectiva contra dataset etiquetado por médicos, (2) shadow mode en producción sin tocar decisión clínica, (3) rollout por servicio con comité médico revisando métricas mensuales. Drift monitoring obligatorio.",
      },
      {
        questionEs: "¿Pueden integrar nuevas plataformas con nuestro HIS legacy?",
        answerEs:
          "Sí. Usamos anti-corruption layer con mensajería asíncrona para no tocar el HIS original. Los mensajes fallidos quedan en dashboard accionable por el equipo clínico, no se pierden silenciosamente.",
      },
      {
        questionEs: "¿Qué garantías ofrecen sobre datos sensibles?",
        answerEs:
          "Contractual: cifrado AES-256 en reposo y TLS 1.3 en tránsito, audit trail inmutable, revocación de accesos en 24h al terminar un perfil, penetration test trimestral. En 13 años no hemos tenido un solo incidente de exposición de datos clínicos.",
      },
    ],
    techStack: [
      { label: "AWS HIPAA-eligible", category: "cloud" },
      { label: "GCP Healthcare API", category: "cloud" },
      { label: "FHIR Server (HAPI)", category: "data" },
      { label: "PostgreSQL", category: "backend" },
      { label: "Kafka", category: "data" },
      { label: "Next.js", category: "frontend" },
      { label: "React Native", category: "frontend" },
      { label: "Node.js / NestJS", category: "backend" },
      { label: "Python / PyTorch", category: "ai" },
      { label: "WebRTC", category: "other" },
      { label: "HashiCorp Vault", category: "security" },
      { label: "AWS KMS", category: "security" },
    ],
    servicesHighlight: ["ia", "cloud", "desarrollo-digital", "staffing"],
    ctaTitleEs: "¿Tu organización de salud necesita transformar sin arriesgar compliance?",
    ctaPrimaryTextEs: "Hablar con un especialista en salud",
    ctaPrimaryUrl: "/contacto?industria=salud",
    hubIntroTitleEs: "HealthTech con compliance real y validación clínica",
    hubIntroSubtitleEs:
      "HIPAA, HL7/FHIR, telemedicina y triaje con IA. 0 incidentes de exposición de datos en 13 años.",
  },

  // ─────────────────────── RETAIL Y E-COMMERCE ───────────────────────
  {
    slug: "retail-ecommerce",
    painPoints: [
      {
        icon: "🛒",
        titleEs: "Experiencia omnicanal que el cliente realmente siente",
        descEs:
          "Inventario unificado, historial de compras compartido entre tienda y web, click-and-collect que funciona el sábado a las 6pm. No es un slogan — es un problema de datos y orquestación.",
        statEs: "El 73% de clientes espera una experiencia consistente entre canales (McKinsey).",
      },
      {
        icon: "📦",
        titleEs: "Última milla urbana en 2 horas",
        descEs:
          "Los mejores ruteadores fallan si el stock por tienda está desactualizado o si la promesa de entrega no considera el corte logístico real. Exige streaming de inventario y simulación continua.",
      },
      {
        icon: "🎯",
        titleEs: "Personalización que no viola la intención de compra",
        descEs:
          "Recomendar lo que ya compró mata conversión. Recomendar sin contexto de stock regional frustra. El recomendador tiene que conocer catálogo, inventario y momento del cliente.",
      },
      {
        icon: "💳",
        titleEs: "Checkout que no pierde carros en el último paso",
        descEs:
          "Cada método de pago regional extra (PSE, Nequi, Pix, OXXO) sube conversión pero agrega fricción técnica. Hay que integrar sin degradar Core Web Vitals ni inflar el bundle.",
        statEs: "El 69.8% de los carritos se abandonan en el checkout, la mayoría por fricción.",
      },
      {
        icon: "📊",
        titleEs: "Operación con margen pequeño que vive del dato",
        descEs:
          "El retail opera con 3–8% de margen. Cada punto de ineficiencia en cloud, logística o publicidad se come utilidad. Data warehouse unificado deja de ser opcional.",
      },
    ],
    metrics: [
      { value: "35%", labelEs: "Aumento promedio en conversión con checkout optimizado" },
      { value: "<200ms", labelEs: "Latencia consulta catálogo con > 1M SKUs" },
      { value: "99.9%", labelEs: "Uptime en temporada alta (Black Friday / Hot Sale)" },
      { value: "25%", labelEs: "Reducción costo logístico con ruteo optimizado" },
    ],
    statHighlights: [
      {
        value: "US$85B",
        labelEs: "E-commerce en LATAM en 2024",
        source: "Statista Market Insights",
      },
      {
        value: "22%",
        labelEs: "Crecimiento anual de e-commerce en LATAM (2x USA)",
        source: "Americas Market Intelligence",
      },
      {
        value: "57%",
        labelEs: "De compras online en LATAM se pagan con métodos alternativos (no tarjeta)",
        source: "EBANX Beyond Borders Report 2024",
      },
    ],
    regulations: [
      {
        code: "PCI-DSS",
        nameEs: "Estándar de seguridad de datos de tarjetas",
        descEs: "Aplicable si procesas pagos on-site; evitable con redirect/iframes de PSPs.",
      },
      {
        code: "Estatuto del Consumidor",
        nameEs: "Ley 1480 Colombia",
        descEs: "Derecho de retracto, política clara de devoluciones, publicidad no engañosa.",
      },
      {
        code: "Habeas Data",
        nameEs: "Tratamiento de datos de clientes",
        descEs: "Consentimiento para marketing, derecho a supresión, responsable ante SIC.",
      },
      {
        code: "Factura Electrónica",
        nameEs: "DIAN (Colombia), SAT (México), AFIP (Argentina)",
        descEs: "Emisión, validación y almacenamiento según normativa local.",
      },
    ],
    useCases: [
      {
        icon: "🌐",
        titleEs: "E-commerce headless con catálogo de 1M+ SKUs",
        descEs:
          "Frontend en Next.js con SSG + ISR, catálogo servido desde ElasticSearch, imagen optimizada por CDN, checkout con métodos de pago regionales (PSE, Nequi, Pix, OXXO, tarjeta).",
        outcomeEs: "35% de incremento en conversión y Core Web Vitals en verde en el 95% de URLs.",
      },
      {
        icon: "🚚",
        titleEs: "Orquestador OMS con inventario unificado",
        descEs:
          "Un endpoint de verdad para stock entre tiendas, bodegas y dark stores. Reservas distribuidas con compensación, simulación de promesa de entrega antes de confirmar compra.",
        outcomeEs: "Reducción 40% en cancelaciones por falta de stock.",
      },
      {
        icon: "🤖",
        titleEs: "Recomendador contextual (cliente + stock + estacionalidad)",
        descEs:
          "Embeddings de catálogo sobre pgvector, ranking que considera inventario por región y recencia de compra. A/B test permanente contra baseline editorial.",
        outcomeEs: "AOV (ticket promedio) +18% en los segmentos testeados.",
      },
      {
        icon: "📞",
        titleEs: "Agente IA para atención post-venta",
        descEs:
          "Responde estado de pedido, gestiona devoluciones, ejecuta reembolsos acotados con handoff a humano. Integrado con ERP, transportadora y PSP.",
        outcomeEs: "Resolución en primer contacto 68%, reducción 50% en tickets escalados.",
      },
    ],
    playbook: [
      {
        number: "01",
        titleEs: "Mapeo de canales, inventario y puntos de fuga",
        descEs:
          "Identificamos dónde se pierde plata: checkout, stock desactualizado, logística, atención. Priorizamos por impacto medible en margen.",
      },
      {
        number: "02",
        titleEs: "Arquitectura headless + event-driven",
        descEs:
          "Frontend desacoplado, catálogo e inventario como fuente única, mensajería asíncrona para OMS, WMS y ERP.",
      },
      {
        number: "03",
        titleEs: "Go-live por canal con monitoreo exhaustivo",
        descEs:
          "Primero web, luego mobile, luego tienda. Cada canal entra con dashboards de conversión y error rates visibles para el negocio.",
      },
      {
        number: "04",
        titleEs: "Optimización continua con FinOps + AB testing",
        descEs:
          "Revisión mensual de costo por transacción, experimentación sobre hipótesis de negocio, no sobre intuición de UX.",
      },
    ],
    industryFaqs: [
      {
        questionEs: "¿Implementan sobre Shopify, VTEX, Magento o headless custom?",
        answerEs:
          "Los cuatro. Elegimos según volumen, complejidad de catálogo y profundidad de customización. Para catálogos de < 50K SKUs y pocos flujos custom, plataformas SaaS. Para retail con OMS propio y operación multi-país, headless custom sobre Next.js + ElasticSearch.",
      },
      {
        questionEs: "¿Manejan métodos de pago regionales (PSE, Nequi, Pix, OXXO)?",
        answerEs:
          "Sí. Integramos con las pasarelas dominantes en cada mercado (PayU, ePayco, Wompi, EBANX, MercadoPago, Stripe). Validamos conversión por método y optimizamos el orden de presentación en el checkout.",
      },
      {
        questionEs: "¿Cómo manejan picos de Black Friday o Hot Sale?",
        answerEs:
          "Pre-warm de infra 2 semanas antes, circuit breakers entre servicios críticos, queueing virtual si la carga supera umbral, dashboards con drilldown por país y canal. Monitoreamos en vivo con el cliente durante el evento.",
      },
      {
        questionEs: "¿Pueden integrarse con nuestro ERP (SAP, Oracle, Dynamics)?",
        answerEs:
          "Sí. Usamos middleware o integraciones directas vía REST/SOAP según el ERP. El patrón es siempre anti-corruption layer para no acoplar el frontend al ritmo de releases del ERP.",
      },
      {
        questionEs: "¿Cuánto tardan en lanzar un e-commerce headless con operación multi-país?",
        answerEs:
          "Primera versión operativa en 3–4 meses. Incluye catálogo, checkout, integración con PSP y OMS base. Los siguientes 2 meses se dedican a ajuste fino de conversión y onboarding del segundo país.",
      },
    ],
    techStack: [
      { label: "Next.js", category: "frontend" },
      { label: "React Native", category: "frontend" },
      { label: "Node.js / NestJS", category: "backend" },
      { label: "ElasticSearch", category: "data" },
      { label: "PostgreSQL", category: "backend" },
      { label: "Redis", category: "backend" },
      { label: "Kafka", category: "data" },
      { label: "AWS / GCP", category: "cloud" },
      { label: "VTEX / Shopify", category: "other" },
      { label: "Stripe / EBANX / Wompi", category: "other" },
      { label: "Snowflake / BigQuery", category: "data" },
      { label: "Segment", category: "data" },
      { label: "Python / ML", category: "ai" },
    ],
    servicesHighlight: ["desarrollo-digital", "ia", "cloud", "staffing"],
    ctaTitleEs: "¿Tu e-commerce puede soportar el próximo Hot Sale sin caerse?",
    ctaPrimaryTextEs: "Hablar con un especialista en retail",
    ctaPrimaryUrl: "/contacto?industria=retail",
    hubIntroTitleEs: "E-commerce, omnicanalidad y última milla que mueven el margen",
    hubIntroSubtitleEs:
      "Arquitecturas headless, OMS real y personalización que respeta stock regional. Para retailers que viven de puntos de conversión.",
  },

  // ─────────────────────── LOGÍSTICA ───────────────────────
  {
    slug: "logistica",
    painPoints: [
      {
        icon: "🗺️",
        titleEs: "Trazabilidad de extremo a extremo en tiempo real",
        descEs:
          "El cliente espera saber dónde está su paquete al minuto. Eso implica eventos desde el dispositivo del conductor, API del socio logístico y consolidación con reglas de negocio, todo bajo un SLA sub-segundo.",
      },
      {
        icon: "🚛",
        titleEs: "Ruteo con restricciones reales",
        descEs:
          "Ventanas de entrega, capacidad del vehículo, tráfico urbano, zonas peligrosas, horarios de carga. Un VRP real no se resuelve con Google Maps — requiere optimización con OR-tools o equivalente.",
      },
      {
        icon: "📦",
        titleEs: "WMS que hable con OMS, TMS y ERP sin romper",
        descEs:
          "El picking erróneo, la bodega con inventario fantasma y las guías duplicadas viven en la junta de sistemas heterogéneos. Event sourcing y conciliación continua son tabla.",
      },
      {
        icon: "💡",
        titleEs: "Predicción de demanda por zona, no global",
        descEs:
          "Stock-out en Bogotá mientras sobra en Medellín. Requiere forecasting por SKU × zona con reentrenamiento semanal y detección de productos con cola corta vs. larga.",
      },
      {
        icon: "👷",
        titleEs: "Apps para operación móvil con baja conectividad",
        descEs:
          "Conductores y bodegueros trabajan con 3G inestable. Las apps tienen que funcionar offline-first, sincronizar cuando pueden y nunca perder datos de escaneo.",
      },
    ],
    metrics: [
      { value: "25%", labelEs: "Reducción promedio en costo por entrega" },
      { value: "95%", labelEs: "On-time delivery en proyectos entregados" },
      { value: "<2s", labelEs: "Actualización de tracking en cliente final" },
      { value: "30%", labelEs: "Aumento en productividad del conductor con mejor ruteo" },
    ],
    statHighlights: [
      {
        value: "US$12.4T",
        labelEs: "Costos logísticos globales en 2024",
        source: "Armstrong & Associates",
      },
      {
        value: "53%",
        labelEs: "De operadores logísticos en LATAM planean invertir en IA en 2 años",
        source: "DHL LATAM Logistics Outlook 2024",
      },
      {
        value: "28%",
        labelEs: "Ahorro en combustible con ruteo dinámico vs. estático",
        source: "McKinsey Last-Mile Delivery Study",
      },
    ],
    regulations: [
      {
        code: "DIAN",
        nameEs: "Facturación y remisiones electrónicas",
        descEs: "Emisión, validación y almacenamiento de documentos de transporte.",
      },
      {
        code: "ISO 9001",
        nameEs: "Gestión de calidad logística",
        descEs: "Aplicable para operadores que exportan o sirven clientes corporativos.",
      },
      {
        code: "Mintransporte",
        nameEs: "Normativa de transporte de carga",
        descEs: "Registro, permisos y compliance de vehículos y conductores.",
      },
      {
        code: "Habeas Data",
        nameEs: "Datos de destinatarios y conductores",
        descEs: "Consentimiento, retención y derechos de supresión.",
      },
    ],
    useCases: [
      {
        icon: "📍",
        titleEs: "Plataforma de trazabilidad end-to-end",
        descEs:
          "Eventos de dispositivos de conductor, socios logísticos y sensores IoT consolidados en un timeline único. API pública para integraciones de cliente corporativo.",
        outcomeEs: "Visibilidad sub-2s desde pickup hasta entrega confirmada.",
      },
      {
        icon: "🧭",
        titleEs: "Ruteador VRP con OR-tools y tráfico en vivo",
        descEs:
          "Optimización multi-restricción (capacidad, ventanas, zonas, reabastecimiento) con reoptimización periódica durante el día. Integración con datos de tráfico urbano.",
        outcomeEs: "-28% en combustible y +22% en entregas por ruta.",
      },
      {
        icon: "🏭",
        titleEs: "WMS cloud con conciliación en tiempo real",
        descEs:
          "Picking guiado por ruta óptima en bodega, reconteo automático por ABC, reconciliación continua contra ERP con dashboard de discrepancias.",
        outcomeEs: "Reducción 60% en inventario fantasma.",
      },
      {
        icon: "📈",
        titleEs: "Forecasting por SKU × zona con reentrenamiento semanal",
        descEs:
          "Series temporales con causales (promociones, eventos, clima), detección de cola corta/larga, recomendaciones de reposición por bodega.",
        outcomeEs: "-35% en stock-outs en zonas históricamente problemáticas.",
      },
    ],
    playbook: [
      {
        number: "01",
        titleEs: "Mapeo de flujos y puntos de dolor",
        descEs:
          "Levantamos flujo físico (bodega → última milla) y digital (WMS, TMS, OMS, ERP). Identificamos dónde se pierde tiempo o margen.",
      },
      {
        number: "02",
        titleEs: "Arquitectura event-driven con trazabilidad",
        descEs:
          "Event sourcing de movimientos, timeline único por guía, observabilidad de mensajes fallidos accionable.",
      },
      {
        number: "03",
        titleEs: "Ruteo y forecasting con validación operativa",
        descEs:
          "Piloto en una ciudad o bodega, medición contra baseline, ajuste con operaciones antes de rollout.",
      },
      {
        number: "04",
        titleEs: "Apps móviles offline-first y operación",
        descEs:
          "App de conductor y bodeguero con sync diferido, nunca pierden datos. Dashboards de monitoreo en vivo.",
      },
    ],
    industryFaqs: [
      {
        questionEs: "¿Tienen experiencia con VRP y optimización de rutas?",
        answerEs:
          "Sí. Usamos OR-tools de Google y alternativas comerciales según volumen. Modelamos restricciones reales (capacidad, ventanas, zonas prohibidas, reabastecimiento intermedio) y reoptimizamos a lo largo del día con datos de tráfico.",
      },
      {
        questionEs: "¿Pueden integrar con nuestro TMS o WMS actual?",
        answerEs:
          "Sí. Lo que sea que tengas — SAP TM, Manhattan, Oracle, propietario — lo integramos vía REST/SOAP o con middleware si no expone API. Patrón anti-corruption layer siempre, para no acoplar ritmos de release.",
      },
      {
        questionEs: "¿Cómo manejan apps móviles en zonas con mala conectividad?",
        answerEs:
          "Offline-first con sync diferido. Las operaciones críticas (escaneo, foto de entrega, firma) se almacenan local y se sincronizan cuando hay red. Monitoreo de divergencia entre dispositivo y servidor para alertar discrepancias.",
      },
      {
        questionEs: "¿Hacen forecasting de demanda por zona?",
        answerEs:
          "Sí. Modelos por SKU × zona geográfica, con variables causales (promociones, clima, eventos). Reentrenamiento semanal y detección de productos cola-corta vs. cola-larga para no sobre-ajustar.",
      },
      {
        questionEs: "¿Qué SLA operan en tracking al cliente final?",
        answerEs:
          "Target sub-2 segundos desde que el evento se dispara en el dispositivo del conductor hasta que se refleja en la API pública del cliente. Con degradación graciosa (eventual consistency) si el backend de un socio falla.",
      },
    ],
    techStack: [
      { label: "AWS / GCP", category: "cloud" },
      { label: "Kafka", category: "data" },
      { label: "PostgreSQL + PostGIS", category: "data" },
      { label: "ClickHouse", category: "data" },
      { label: "Node.js / Go", category: "backend" },
      { label: "React Native", category: "frontend" },
      { label: "OR-tools", category: "ai" },
      { label: "Python / ML", category: "ai" },
      { label: "Mapbox / HERE", category: "other" },
      { label: "Redis", category: "backend" },
      { label: "Kubernetes", category: "cloud" },
      { label: "Datadog", category: "other" },
    ],
    servicesHighlight: ["ia", "desarrollo-digital", "cloud", "staffing"],
    ctaTitleEs: "¿Buscas optimizar última milla o trazabilidad sin reemplazar todo?",
    ctaPrimaryTextEs: "Hablar con un especialista en logística",
    ctaPrimaryUrl: "/contacto?industria=logistica",
    hubIntroTitleEs: "Trazabilidad, ruteo y WMS que reducen costo por envío",
    hubIntroSubtitleEs:
      "Integración con tu TMS/WMS/ERP existente. Optimización con OR-tools, ML y apps offline-first para la operación.",
  },

  // ─────────────────────── MANUFACTURA ───────────────────────
  {
    slug: "manufactura",
    painPoints: [
      {
        icon: "🏭",
        titleEs: "Sistemas OT (PLC, SCADA) aislados del mundo IT",
        descEs:
          "Las líneas de producción fueron diseñadas sin pensar en la nube. Unificar datos de planta con ERP/MES exige gateways industriales, protocolos OPC-UA/MQTT y red segmentada según IEC 62443.",
      },
      {
        icon: "🛑",
        titleEs: "Paradas no planeadas que se comen la utilidad",
        descEs:
          "Un minuto de paro en una línea crítica puede costar decenas de miles de dólares. El mantenimiento reactivo no escala; el predictivo requiere sensores, historización y modelos entrenados con datos de la planta específica.",
        statEs: "El downtime no planeado cuesta a la industria global US$50B+ anuales (IDC).",
      },
      {
        icon: "📊",
        titleEs: "Trazabilidad lote-a-lote para calidad y regulación",
        descEs:
          "Farmacéutico, alimentos, automotriz: todos necesitan saber qué lote de materia prima entró a qué producto final. Exige integración entre recepción, producción y empaque sin papel.",
      },
      {
        icon: "🧪",
        titleEs: "Control de calidad con visión y ML",
        descEs:
          "Inspección 100% en línea requiere cámaras industriales, modelos de visión entrenados con defectos locales y feedback rápido al operador. No son POCs — son procesos en producción con SLAs.",
      },
      {
        icon: "🧠",
        titleEs: "Optimización de producción y consumo energético",
        descEs:
          "Datos de consumo, temperatura, presión y rendimiento combinados para optimizar setpoints. Los gains de 3–5% son reales pero solo con data pipeline estable y gobernanza de modelos.",
      },
    ],
    metrics: [
      { value: "15–30%", labelEs: "Reducción en downtime no planeado" },
      { value: "24/7", labelEs: "Dashboards de línea en tiempo real" },
      { value: "<5s", labelEs: "Latencia eventos planta → dashboard" },
      { value: "99.5%", labelEs: "Uptime plataforma MES cloud" },
    ],
    statHighlights: [
      {
        value: "US$4.4T",
        labelEs: "Inversión global en Industria 4.0 para 2030",
        source: "Fortune Business Insights",
      },
      {
        value: "82%",
        labelEs: "De manufactureros que adoptan IA reportan mejora operativa",
        source: "Deloitte Manufacturing Outlook 2024",
      },
      {
        value: "30%",
        labelEs: "Reducción en desperdicio con inspección por visión + ML",
        source: "McKinsey Global Manufacturing Index",
      },
    ],
    regulations: [
      {
        code: "IEC 62443",
        nameEs: "Ciberseguridad de sistemas OT industriales",
        descEs: "Segmentación de red, control de acceso por zona y defense-in-depth.",
      },
      {
        code: "ISO 9001",
        nameEs: "Gestión de calidad",
        descEs: "Trazabilidad documental, control de no conformidades, mejora continua.",
      },
      {
        code: "GMP",
        nameEs: "Buenas Prácticas de Manufactura (farma / alimentos)",
        descEs: "Documentación de procesos, cualificación de equipos, trazabilidad de lotes.",
      },
      {
        code: "FDA 21 CFR Part 11",
        nameEs: "Registros y firmas electrónicas",
        descEs: "Obligatorio para manufactureros que exportan a USA en farma y dispositivos.",
      },
    ],
    useCases: [
      {
        icon: "🔌",
        titleEs: "IIoT gateway + historización en cloud",
        descEs:
          "Conectamos PLCs vía OPC-UA/Modbus/MQTT, normalizamos datos con edge computing y los llevamos a Time Series DB en cloud con retención por zona y conformidad con IEC 62443.",
        outcomeEs: "Visibilidad 24/7 de KPIs de planta sin tocar el SCADA existente.",
      },
      {
        icon: "🧠",
        titleEs: "Mantenimiento predictivo por activo crítico",
        descEs:
          "Modelos entrenados con datos propios de cada motor, bomba o prensa. Detectamos drift en señales antes de falla con 7–30 días de antelación.",
        outcomeEs: "Reducción 22% en horas de paro no planeado en líneas piloto.",
      },
      {
        icon: "👁️",
        titleEs: "Inspección por visión con modelos custom",
        descEs:
          "Cámaras industriales sobre la línea, modelos entrenados con defectos específicos del producto, feedback al operador en menos de 300ms, bucle de reentrenamiento mensual.",
        outcomeEs: "95%+ de detección de defectos críticos, 3× más rápido que inspección humana.",
      },
      {
        icon: "📦",
        titleEs: "Trazabilidad de lote end-to-end",
        descEs:
          "Desde recepción de materia prima hasta empaque final, cada movimiento se registra con QR/RFID. Consulta por lote en < 2 segundos para auditorías y retiros.",
        outcomeEs: "Tiempo de respuesta a auditoría reducido de días a minutos.",
      },
    ],
    playbook: [
      {
        number: "01",
        titleEs: "Assessment de planta y objetivos",
        descEs:
          "Identificamos activos críticos, medición actual, silos de datos y los 2–3 casos de uso con mayor retorno.",
      },
      {
        number: "02",
        titleEs: "Arquitectura híbrida edge + cloud",
        descEs:
          "Edge para resiliencia y latencia, cloud para historización y ML. Segmentación de red según IEC 62443 siempre.",
      },
      {
        number: "03",
        titleEs: "POC medible en un activo, luego rollout",
        descEs:
          "Un motor, una línea, una celda. Medimos contra baseline y solo entonces rollout. Evitamos el big-bang que fracasa en manufactura.",
      },
      {
        number: "04",
        titleEs: "Transferencia de conocimiento y operación",
        descEs:
          "Runbooks, capacitación a mantenimiento y entrega del modelo con protocolo de reentrenamiento. Tu equipo opera.",
      },
    ],
    industryFaqs: [
      {
        questionEs: "¿Pueden integrarse con nuestro SCADA/MES existente?",
        answerEs:
          "Sí. OPC-UA, Modbus, MQTT, y conectores específicos a Siemens, Rockwell, Schneider, Wonderware e Ignition. Patrón anti-corruption layer para no afectar el PLC/SCADA original y respetando IEC 62443.",
      },
      {
        questionEs: "¿Qué garantizan sobre ciberseguridad OT?",
        answerEs:
          "Segmentación de red por zona Purdue, gateways con lista blanca de protocolos, logging de accesos y pruebas de seguridad específicas para entornos industriales. Firmamos NDAs y cumplimos IEC 62443 aplicable al scope del proyecto.",
      },
      {
        questionEs: "¿Cuánto tardan en entregar un piloto de mantenimiento predictivo?",
        answerEs:
          "8–12 semanas para el primer activo crítico, asumiendo que los sensores necesarios están instalados o se pueden instalar en las primeras 2 semanas. El primer mes es data pipeline y baseline; del mes 2 en adelante es modelado e iteración con el equipo de mantenimiento.",
      },
      {
        questionEs: "¿Entrenan modelos con datos de planta o usan modelos genéricos?",
        answerEs:
          "Con datos de tu planta. Los modelos genéricos pre-entrenados fallan porque cada activo tiene firmas de señal específicas. Lo que sí reusamos son arquitecturas probadas y protocolos de validación.",
      },
      {
        questionEs: "¿Manejan trazabilidad bajo GMP o FDA 21 CFR Part 11?",
        answerEs:
          "Sí. Hemos trabajado con clientes en alimentos y farmacéuticos. Implementamos registros auditables, firmas electrónicas, control de versiones de procedimientos y los reportes exigidos por la normativa aplicable.",
      },
    ],
    techStack: [
      { label: "AWS IoT Greengrass", category: "cloud" },
      { label: "Azure IoT Hub", category: "cloud" },
      { label: "InfluxDB / TimescaleDB", category: "data" },
      { label: "Kafka / MQTT", category: "data" },
      { label: "OPC-UA", category: "other" },
      { label: "Python / PyTorch", category: "ai" },
      { label: "OpenCV", category: "ai" },
      { label: "Node.js / Go", category: "backend" },
      { label: "PostgreSQL", category: "backend" },
      { label: "Grafana", category: "other" },
      { label: "Ignition / Wonderware", category: "other" },
      { label: "Kubernetes", category: "cloud" },
    ],
    servicesHighlight: ["ia", "cloud", "desarrollo-digital", "staffing"],
    ctaTitleEs: "¿Quieres reducir downtime y llevar tu planta a Industria 4.0?",
    ctaPrimaryTextEs: "Hablar con un especialista en manufactura",
    ctaPrimaryUrl: "/contacto?industria=manufactura",
    hubIntroTitleEs: "Industria 4.0 con compliance OT y ROI medible",
    hubIntroSubtitleEs:
      "IIoT, mantenimiento predictivo y visión por computador integrados con tu SCADA/MES existente. Respetando IEC 62443.",
  },
];

async function main() {
  const sqlClient = neon(process.env.DATABASE_URL!);
  const db = drizzle(sqlClient, { schema });

  for (const seed of SEEDS) {
    const painPoints = seed.painPoints.map((pp) => ({
      icon: pp.icon,
      titleEs: pp.titleEs,
      titleEn: "",
      descEs: pp.descEs,
      descEn: "",
      statEs: pp.statEs,
      statEn: undefined,
    }));

    const metrics = seed.metrics.map((m) => ({
      value: m.value,
      labelEs: m.labelEs,
      labelEn: "",
    }));

    const statHighlights = seed.statHighlights.map((s) => ({
      value: s.value,
      labelEs: s.labelEs,
      labelEn: "",
      source: s.source,
    }));

    const regulations = seed.regulations.map((r) => ({
      code: r.code,
      nameEs: r.nameEs,
      nameEn: "",
      descEs: r.descEs,
      descEn: undefined,
    }));

    const useCases = seed.useCases.map((u) => ({
      icon: u.icon,
      titleEs: u.titleEs,
      titleEn: "",
      descEs: u.descEs,
      descEn: "",
      outcomeEs: u.outcomeEs,
      outcomeEn: undefined,
    }));

    const playbook = seed.playbook.map((p) => ({
      number: p.number,
      titleEs: p.titleEs,
      titleEn: "",
      descEs: p.descEs,
      descEn: "",
    }));

    const industryFaqs = seed.industryFaqs.map((f) => ({
      questionEs: f.questionEs,
      questionEn: "",
      answerEs: f.answerEs,
      answerEn: "",
    }));

    const result = await db
      .update(schema.industrias)
      .set({
        painPoints,
        metrics,
        statHighlights,
        regulations,
        useCases,
        playbook,
        industryFaqs,
        techStack: seed.techStack,
        servicesHighlight: seed.servicesHighlight,
        ctaTitleEs: seed.ctaTitleEs,
        ctaTitleEn: null,
        ctaPrimaryTextEs: seed.ctaPrimaryTextEs,
        ctaPrimaryTextEn: null,
        ctaPrimaryUrl: seed.ctaPrimaryUrl,
        hubIntroTitleEs: seed.hubIntroTitleEs ?? null,
        hubIntroTitleEn: null,
        hubIntroSubtitleEs: seed.hubIntroSubtitleEs ?? null,
        hubIntroSubtitleEn: null,
        translationStatusEn: "pending",
        updatedAt: new Date(),
      })
      .where(eq(schema.industrias.slugEs, seed.slug))
      .returning({ slug: schema.industrias.slugEs });

    if (result.length === 0) {
      console.warn(`[WARN] no row updated for slug=${seed.slug}`);
    } else {
      console.log(`[OK] ${seed.slug} — updated`);
    }
  }

  console.log("\n✅ Seed complete for 6 industrias (ES content).");
  console.log("   EN translation is pending — run the translation agent next.");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
