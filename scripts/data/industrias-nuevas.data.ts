/**
 * Contenido completo (ES + EN) de las 2 industrias nuevas:
 *
 *   1. Medición de Audiencias y Ratings  (medicion-de-audiencias / audience-measurement)
 *   2. Investigación de Mercados y Trabajo de Campo  (investigacion-de-mercados / market-research)
 *
 * Consumido por:
 *   - scripts/seed-industrias-nuevas.ts        → INSERT en la tabla `industrias` + nav_config
 *   - scripts/update-industrias-fallback.ts    → data/fallbacks/industrias.json
 *
 * Las cifras con `source` provienen de investigación real (Retell AI, Gartner,
 * Thoughtly, GRIT, ESOMAR — 2025/2026). El copy habla de la industria y sus
 * procesos; nunca de compañías objetivo.
 */

export type IndustriaNuevaSeed = {
  slugEs: string;
  slugEn: string;
  icon: string;
  accentColor: "ia" | "cloud" | "staffing" | "finops" | "dev";
  nameEs: string;
  nameEn: string;
  heroTitleEs: string;
  heroTitleEn: string;
  heroSubtitleEs: string;
  heroSubtitleEn: string;
  painPoints: Array<{
    icon: string;
    titleEs: string;
    titleEn: string;
    descEs: string;
    descEn: string;
    statEs?: string;
    statEn?: string;
  }>;
  solutions: Array<{
    icon: string;
    titleEs: string;
    titleEn: string;
    descEs: string;
    descEn: string;
  }>;
  metrics: Array<{ value: string; labelEs: string; labelEn: string }>;
  statHighlights: Array<{ value: string; labelEs: string; labelEn: string; source?: string }>;
  regulations: Array<{
    code: string;
    nameEs: string;
    nameEn: string;
    descEs?: string;
    descEn?: string;
  }>;
  useCases: Array<{
    icon: string;
    titleEs: string;
    titleEn: string;
    descEs: string;
    descEn: string;
    outcomeEs?: string;
    outcomeEn?: string;
  }>;
  playbook: Array<{
    number: string;
    titleEs: string;
    titleEn: string;
    descEs: string;
    descEn: string;
  }>;
  industryFaqs: Array<{
    questionEs: string;
    questionEn: string;
    answerEs: string;
    answerEn: string;
  }>;
  techStack: Array<{
    label: string;
    category: "cloud" | "data" | "ai" | "frontend" | "backend" | "security" | "other";
  }>;
  servicesHighlight: string[];
  ctaTitleEs: string;
  ctaTitleEn: string;
  ctaPrimaryTextEs: string;
  ctaPrimaryTextEn: string;
  ctaPrimaryUrl: string;
  hubIntroTitleEs: string;
  hubIntroTitleEn: string;
  hubIntroSubtitleEs: string;
  hubIntroSubtitleEn: string;
  ctaTextEs: string;
  ctaTextEn: string;
  seoTitleEs: string;
  seoTitleEn: string;
  seoDescriptionEs: string;
  seoDescriptionEn: string;
};

export const INDUSTRIAS_NUEVAS: IndustriaNuevaSeed[] = [
  // ═══════════════════════ MEDICIÓN DE AUDIENCIAS ═══════════════════════
  {
    slugEs: "medicion-de-audiencias",
    slugEn: "audience-measurement",
    icon: "radio",
    accentColor: "ia",
    nameEs: "Medición de Audiencias",
    nameEn: "Audience Measurement",
    heroTitleEs: "Transformación Digital para Medición de Audiencias",
    heroTitleEn: "Digital Transformation for Audience Measurement",
    heroSubtitleEs:
      "Agentes de voz con IA, dashboards en tiempo real y automatización para las operaciones que hoy dependen de llamadas y procesos manuales: gestión de paneles, control de calidad de datos y reportería a clientes.",
    heroSubtitleEn:
      "AI voice agents, real-time dashboards and automation for the operations that still run on calls and manual processes: panel management, data quality control and client reporting.",
    painPoints: [
      {
        icon: "arc-person",
        titleEs: "Miles de llamadas humanas para gestionar el panel",
        titleEn: "Thousands of human calls to manage the panel",
        descEs:
          "Reclutamiento, verificación, retención e incidencias de panelistas dependen de un call center en horario hábil. Cada contacto efectivo cuesta tiempo de un equipo que no escala con picos de operación.",
        descEn:
          "Panelist recruitment, verification, retention and incident handling depend on a business-hours call center. Every effective contact costs time from a team that can't scale with operational peaks.",
        statEs: "Una llamada operativa cuesta US$7–12 con humanos; ~US$0.40 con agentes de voz IA.",
        statEn: "An operational call costs US$7–12 with humans; ~US$0.40 with AI voice agents.",
      },
      {
        icon: "dia-trend",
        titleEs: "Cooperación de panelistas en declive",
        titleEn: "Declining panelist cooperation",
        descEs:
          "Las tasas de respuesta caen año a año en toda la industria. Sostener el panel exige cada vez más intentos de contacto por panelista efectivo, en más horarios y más canales.",
        descEn:
          "Response rates fall year after year across the industry. Sustaining the panel demands more contact attempts per effective panelist, across more time slots and channels.",
        statEs:
          "Las encuestas telefónicas con IA superan el 35% de completitud vs. menos del 10% por email.",
        statEn: "AI phone surveys exceed 35% completion vs. under 10% via email.",
      },
      {
        icon: "oct-scan",
        titleEs: "QA de datos de sintonía por muestreo",
        titleEn: "Tuning-data QA by sampling",
        descEs:
          "La validación de los datos de medición se hace sobre muestras revisadas a mano. Las anomalías —fallas de medidor, datos atípicos, fraude— se detectan tarde y cuestan credibilidad frente a clientes.",
        descEn:
          "Measurement data validation runs on manually reviewed samples. Anomalies — meter failures, outliers, fraud — are caught late and cost credibility with clients.",
        statEs: "Con IA se audita el 100% de los registros en minutos, no una muestra.",
        statEn: "With AI, 100% of records are audited in minutes — not a sample.",
      },
      {
        icon: "hex-nodes",
        titleEs: "Operación de campo intensiva",
        titleEn: "Field-heavy operations",
        descEs:
          "Instalación y mantenimiento de medidores, visitas técnicas y agendamiento telefónico coordinados a mano, sin visibilidad centralizada del estado de cada hogar del panel.",
        descEn:
          "Meter installation and maintenance, technical visits and phone scheduling coordinated by hand, without centralized visibility into each panel household's status.",
      },
      {
        icon: "hex-chart",
        titleEs: "Reportería a clientes que llega tarde",
        titleEn: "Client reporting that arrives late",
        descEs:
          "Canales, agencias y anunciantes esperan datos accionables el mismo día. Los informes armados a mano tardan días y consumen horas de analistas que podrían estar generando insights.",
        descEn:
          "Networks, agencies and advertisers expect same-day actionable data. Hand-built reports take days and consume analyst hours that could be producing insights.",
        statEs:
          "De informes semanales a dashboards en tiempo real: es el estándar que la industria ya está adoptando.",
        statEn:
          "From weekly reports to real-time dashboards: the standard the industry is already adopting.",
      },
    ],
    solutions: [
      {
        icon: "brain",
        titleEs: "IA para Medición de Audiencias",
        titleEn: "AI for Audience Measurement",
        descEs:
          "Agentes de voz 24/7 para reclutamiento, retención y encuestas de panel; detección de anomalías y fraude sobre el 100% de los datos de sintonía.",
        descEn:
          "24/7 voice agents for panel recruitment, retention and surveys; anomaly and fraud detection across 100% of tuning data.",
      },
      {
        icon: "hex-cloud",
        titleEs: "Cloud para Medición de Audiencias",
        titleEn: "Cloud for Audience Measurement",
        descEs:
          "Pipelines de datos en tiempo real y dashboards inteligentes para decisiones internas y entrega a canales, agencias y anunciantes.",
        descEn:
          "Real-time data pipelines and intelligent dashboards for internal decisions and delivery to networks, agencies and advertisers.",
      },
      {
        icon: "tri-person",
        titleEs: "Talento para Medición de Audiencias",
        titleEn: "Talent for Audience Measurement",
        descEs:
          "Ingenieros de datos e IA bilingües con experiencia en medios, integrados a tu equipo de medición en 5 días.",
        descEn:
          "Bilingual data and AI engineers with media experience, integrated into your measurement team in 5 days.",
      },
    ],
    metrics: [
      {
        value: "24/7",
        labelEs: "Cobertura de llamadas con agentes de voz",
        labelEn: "Call coverage with voice agents",
      },
      {
        value: "~90%",
        labelEs: "Menor costo por contacto operativo",
        labelEn: "Lower cost per operational contact",
      },
      {
        value: "100%",
        labelEs: "De registros auditados con IA, no una muestra",
        labelEn: "Of records audited with AI, not a sample",
      },
      {
        value: "5 días",
        labelEs: "Al primer ingeniero senior integrado",
        labelEn: "To the first senior engineer integrated",
      },
    ],
    statHighlights: [
      {
        value: ">35%",
        labelEs: "Completitud en encuestas telefónicas con IA, vs. menos del 10% por email",
        labelEn: "Completion rate in AI phone surveys, vs. under 10% via email",
        source: "Retell AI, 2025",
      },
      {
        value: "US$80B",
        labelEs: "Ahorro proyectado por IA conversacional en contact centers en 2026",
        labelEn: "Projected savings from conversational AI in contact centers in 2026",
        source: "Gartner",
      },
      {
        value: "82%",
        labelEs: "Empresas con voice AI que reportan ROI positivo en los primeros 12 meses",
        labelEn: "Companies with voice AI reporting positive ROI within the first 12 months",
        source: "Thoughtly, 2025",
      },
    ],
    regulations: [
      {
        code: "Ley 1581",
        nameEs: "Habeas Data (Colombia)",
        nameEn: "Habeas Data (Colombia)",
        descEs:
          "Tratamiento de datos personales de panelistas y hogares medidos: consentimiento, finalidad y derechos de los titulares.",
        descEn:
          "Personal data processing for panelists and measured households: consent, purpose limitation and data-subject rights.",
      },
      {
        code: "GDPR",
        nameEs: "Reglamento General de Protección de Datos",
        nameEn: "General Data Protection Regulation",
        descEs:
          "Aplica cuando la medición involucra ciudadanos europeos o clientes globales que lo exigen por contrato.",
        descEn:
          "Applies when measurement involves EU citizens or global clients that require it contractually.",
      },
      {
        code: "ISO 20252",
        nameEs: "Norma internacional para investigación de mercados y social",
        nameEn: "International standard for market and social research",
        descEs:
          "Estándar de calidad para procesos de investigación, paneles y analítica de datos — incluye los procesos automatizados.",
        descEn:
          "Quality standard for research processes, panels and data analytics — automated processes included.",
      },
      {
        code: "ICC/ESOMAR",
        nameEs: "Código internacional de investigación de mercados",
        nameEn: "International code on market research",
        descEs:
          "Principios éticos para la recolección de datos: transparencia con los participantes también cuando interviene IA.",
        descEn:
          "Ethical principles for data collection: transparency with participants, also when AI is involved.",
      },
    ],
    useCases: [
      {
        icon: "arc-broadcast",
        titleEs: "Gestión de panel con agentes de voz",
        titleEn: "Panel management with voice agents",
        descEs:
          "Reclutamiento, verificación de datos, recordatorios, incidencias y encuestas de satisfacción con voz natural en español, operando 24/7 e integrado a tus sistemas de panel.",
        descEn:
          "Recruitment, data verification, reminders, incident handling and satisfaction surveys with natural voice, running 24/7 and integrated with your panel systems.",
        outcomeEs: "Cobertura 24/7 con un costo por contacto ~90% menor.",
        outcomeEn: "24/7 coverage at ~90% lower cost per contact.",
      },
      {
        icon: "oct-scan",
        titleEs: "QA inteligente de datos de medición",
        titleEn: "Intelligent measurement-data QA",
        descEs:
          "Modelos que auditan la totalidad de los registros de sintonía, marcan anomalías y priorizan qué debe revisar el equipo humano.",
        descEn:
          "Models that audit all tuning records, flag anomalies and prioritize what the human team should review.",
        outcomeEs: "100% de los datos auditados, no el 10–20% de una muestra.",
        outcomeEn: "100% of data audited — not a 10–20% sample.",
      },
      {
        icon: "hex-chart",
        titleEs: "Dashboards de audiencia para decisión",
        titleEn: "Audience dashboards for decision-making",
        descEs:
          "Analítica en tiempo real para dirección y equipos comerciales: qué pasó con la audiencia, dónde y qué hacer al respecto, sin esperar el informe.",
        descEn:
          "Real-time analytics for leadership and commercial teams: what happened with the audience, where, and what to do about it — without waiting for the report.",
        outcomeEs: "Decisiones el mismo día, no la semana siguiente.",
        outcomeEn: "Same-day decisions, not next week's.",
      },
      {
        icon: "arc-doc",
        titleEs: "Reportería automática a clientes",
        titleEn: "Automated client reporting",
        descEs:
          "Generación automática de entregables por cliente —canales, agencias, anunciantes— con IA sobre los datos ya validados.",
        descEn:
          "Automatic generation of per-client deliverables — networks, agencies, advertisers — with AI on top of validated data.",
        outcomeEs: "Horas de armado manual convertidas en minutos.",
        outcomeEn: "Hours of manual assembly turned into minutes.",
      },
    ],
    playbook: [
      {
        number: "01",
        titleEs: "Assessment de la operación",
        titleEn: "Operations assessment",
        descEs:
          "Mapeamos tus procesos de llamadas, campo, QA y reportería, y cuantificamos el costo actual de cada uno frente a su versión automatizada.",
        descEn:
          "We map your call, field, QA and reporting processes, and quantify the current cost of each versus its automated version.",
      },
      {
        number: "02",
        titleEs: "Piloto controlado en semanas",
        titleEn: "Controlled pilot in weeks",
        descEs:
          "Elegimos un proceso —por ejemplo retención de panelistas— y lo operamos con agentes de voz en paralelo al equipo humano, midiendo completitud, costo y satisfacción.",
        descEn:
          "We pick one process — e.g. panelist retention — and run it with voice agents alongside the human team, measuring completion, cost and satisfaction.",
      },
      {
        number: "03",
        titleEs: "Escalamiento con métricas",
        titleEn: "Metrics-driven scale-up",
        descEs:
          "Ampliamos cobertura a más procesos y horarios, conectamos dashboards y automatizamos la reportería sobre datos validados.",
        descEn:
          "We extend coverage to more processes and time slots, connect dashboards and automate reporting on validated data.",
      },
      {
        number: "04",
        titleEs: "Operación continua y gobierno",
        titleEn: "Continuous operations and governance",
        descEs:
          "Monitoreo, mejora continua de los agentes y gobierno de datos alineado a Habeas Data, ISO 20252 y los códigos de la industria.",
        descEn:
          "Monitoring, continuous agent improvement and data governance aligned with Habeas Data, ISO 20252 and industry codes.",
      },
    ],
    industryFaqs: [
      {
        questionEs: "¿Los agentes de voz reemplazan a mi equipo de operación?",
        questionEn: "Do voice agents replace my operations team?",
        answerEs:
          "No. Absorben el volumen repetitivo —recordatorios, verificaciones, encuestas cortas— y liberan al equipo humano para los casos que requieren criterio: incidencias complejas, panelistas sensibles, decisiones de muestra. La operación escala sin crecer la nómina.",
        answerEn:
          "No. They absorb repetitive volume — reminders, verifications, short surveys — and free the human team for judgment cases: complex incidents, sensitive panelists, sample decisions. Operations scale without growing payroll.",
      },
      {
        questionEs: "¿La voz suena natural en español latinoamericano?",
        questionEn: "Does the voice sound natural in Latin American Spanish?",
        answerEs:
          "Sí. Trabajamos con voces neurales en español (acentos locales incluidos), guiones co-diseñados con tu equipo de campo y transferencia a humano cuando el panelista lo pide o el caso lo amerita.",
        answerEn:
          "Yes. We work with neural voices in Spanish (local accents included), scripts co-designed with your field team, and human handoff whenever the panelist asks or the case warrants it.",
      },
      {
        questionEs: "¿Cómo se integra con nuestros sistemas de medición y panel?",
        questionEn: "How does it integrate with our measurement and panel systems?",
        answerEs:
          "Vía API o capas de integración sobre tus sistemas actuales: CRM de panel, software de medición y data warehouse. No exigimos reemplazar nada; construimos encima de lo que ya funciona.",
        answerEn:
          "Via APIs or integration layers on top of your current systems: panel CRM, measurement software and data warehouse. Nothing needs replacing; we build on what already works.",
      },
      {
        questionEs: "¿Qué pasa con los datos de los panelistas?",
        questionEn: "What happens with panelist data?",
        answerEs:
          "Los datos permanecen bajo tu control, en tu nube y tu jurisdicción. Los flujos cumplen Habeas Data/GDPR: consentimiento, minimización y trazabilidad de cada interacción, incluidas las llamadas de IA.",
        answerEn:
          "Data stays under your control, in your cloud and jurisdiction. Flows comply with Habeas Data/GDPR: consent, minimization and traceability for every interaction, AI calls included.",
      },
      {
        questionEs: "¿Cuánto toma ver el primer resultado?",
        questionEn: "How long until the first result?",
        answerEs:
          "Un piloto acotado —un proceso, una cohorte del panel— queda operando en semanas, con métricas comparables contra la operación actual antes de decidir el escalamiento.",
        answerEn:
          "A scoped pilot — one process, one panel cohort — is live in weeks, with metrics comparable against current operations before deciding to scale.",
      },
    ],
    techStack: [
      { label: "AWS", category: "cloud" },
      { label: "GCP", category: "cloud" },
      { label: "Kafka", category: "data" },
      { label: "Airflow", category: "data" },
      { label: "BigQuery", category: "data" },
      { label: "dbt", category: "data" },
      { label: "Python / FastAPI", category: "ai" },
      { label: "LangChain", category: "ai" },
      { label: "Whisper / ASR", category: "ai" },
      { label: "Twilio", category: "other" },
      { label: "PostgreSQL", category: "backend" },
      { label: "Next.js", category: "frontend" },
      { label: "Datadog", category: "other" },
    ],
    servicesHighlight: ["ia", "cloud", "staffing", "desarrollo-digital"],
    ctaTitleEs: "¿Tu operación de medición puede escalar sin escalar la nómina de llamadas?",
    ctaTitleEn: "Can your measurement operation scale without scaling the call payroll?",
    ctaPrimaryTextEs: "Hablar con un especialista en audiencias",
    ctaPrimaryTextEn: "Talk to an audience specialist",
    ctaPrimaryUrl: "/contacto?industria=medicion-de-audiencias",
    hubIntroTitleEs: "Paneles, ratings y datos que no pueden esperar",
    hubIntroTitleEn: "Panels, ratings and data that can't wait",
    hubIntroSubtitleEs:
      "Agentes de voz, QA con IA y dashboards en tiempo real para operaciones de medición de audiencias en LATAM.",
    hubIntroSubtitleEn:
      "Voice agents, AI-powered QA and real-time dashboards for audience measurement operations in LATAM.",
    ctaTextEs: "Hablemos de tu operación de medición",
    ctaTextEn: "Let's talk about your measurement operation",
    seoTitleEs: "IA y Automatización para Medición de Audiencias",
    seoTitleEn: "AI & Automation for Audience Measurement",
    seoDescriptionEs:
      "Agentes de voz con IA, dashboards en tiempo real y automatización para operaciones de medición de audiencias: gestión de paneles, QA de datos y reportería.",
    seoDescriptionEn:
      "AI voice agents, real-time dashboards and automation for audience measurement operations: panel management, data QA and client reporting.",
  },

  // ═══════════════════ INVESTIGACIÓN DE MERCADOS ═══════════════════
  {
    slugEs: "investigacion-de-mercados",
    slugEn: "market-research",
    icon: "clipboard-list",
    accentColor: "finops",
    nameEs: "Investigación de Mercados",
    nameEn: "Market Research",
    heroTitleEs: "Transformación Digital para Investigación de Mercados",
    heroTitleEn: "Digital Transformation for Market Research",
    heroSubtitleEs:
      "Verificación con llamadas de IA al 100% de la muestra, dashboards de campo en tiempo real y automatización de entregables para estudios que hoy dependen de operación manual.",
    heroSubtitleEn:
      "AI-call verification across 100% of your sample, real-time field dashboards and automated deliverables for studies that still depend on manual operations.",
    painPoints: [
      {
        icon: "tri-check",
        titleEs: "Back-checks que solo cubren una muestra",
        titleEn: "Back-checks that only cover a sample",
        descEs:
          "La supervisión telefónica de encuestas verifica el 10–20% del trabajo de campo. El resto queda sin auditar, y un solo hallazgo tardío puede comprometer un estudio completo.",
        descEn:
          "Phone supervision verifies 10–20% of fieldwork. The rest goes unaudited, and a single late finding can compromise an entire study.",
        statEs:
          "Con llamadas de IA la verificación cubre el 100% de la muestra, al costo de la muestra actual.",
        statEn:
          "With AI calls, verification covers 100% of the sample — at the cost of today's sample.",
      },
      {
        icon: "hex-nodes",
        titleEs: "Coordinación de campo con planillas y llamadas",
        titleEn: "Field coordination via spreadsheets and calls",
        descEs:
          "Rutas, agendas, reemplazos y supervisión de encuestadores se gestionan a mano. Sin visibilidad en tiempo real, los problemas de cuota se descubren al cierre del día — o del estudio.",
        descEn:
          "Routes, schedules, replacements and interviewer supervision are managed by hand. Without real-time visibility, quota problems surface at day's end — or the study's.",
      },
      {
        icon: "arc-person",
        titleEs: "CATI con costos crecientes y alta rotación",
        titleEn: "CATI with rising costs and high turnover",
        descEs:
          "Sostener un call center de encuestas es cada vez más caro y difícil de escalar por picos de proyecto. Entrenar a un encuestador toma semanas; los proyectos llegan de a golpes.",
        descEn:
          "Running a survey call center keeps getting more expensive and harder to scale for project peaks. Training an interviewer takes weeks; projects arrive in bursts.",
        statEs: "~US$0.40 por llamada con IA vs US$7–12 humana, con capacidad elástica inmediata.",
        statEn: "~US$0.40 per AI call vs US$7–12 human, with instantly elastic capacity.",
      },
      {
        icon: "oct-shield",
        titleEs: "Calidad de datos bajo presión",
        titleEn: "Data quality under pressure",
        descEs:
          "La industria enfrenta datos fabricados, respuestas de bots y fraude en paneles online. Detectarlo con revisión manual no escala al volumen actual de los estudios.",
        descEn:
          "The industry faces fabricated data, bot responses and online panel fraud. Catching it with manual review doesn't scale to today's study volumes.",
        statEs:
          "Detección de anomalías con IA sobre el 100% de los registros, no sobre una muestra.",
        statEn: "AI anomaly detection across 100% of records — not a sample.",
      },
      {
        icon: "hex-time",
        titleEs: "Entregables que tardan semanas",
        titleEn: "Deliverables that take weeks",
        descEs:
          "Codificación de abiertas, cruces y armado de informes consumen el tiempo entre cierre de campo y cliente. Mientras tanto, la decisión que motivó el estudio no espera.",
        descEn:
          "Open-end coding, cross-tabs and report assembly eat the time between field close and client. Meanwhile, the decision that motivated the study doesn't wait.",
        statEs:
          "El 72% de los compradores de insights ya usa IA generativa en al menos una etapa (GRIT 2025).",
        statEn:
          "72% of insights buyers already use generative AI in at least one stage (GRIT 2025).",
      },
    ],
    solutions: [
      {
        icon: "brain",
        titleEs: "IA para Investigación de Mercados",
        titleEn: "AI for Market Research",
        descEs:
          "Agentes de voz para back-checks y CATI híbrido; codificación automática de preguntas abiertas y detección de fraude en los datos.",
        descEn:
          "Voice agents for back-checks and hybrid CATI; automatic open-end coding and data fraud detection.",
      },
      {
        icon: "hex-cloud",
        titleEs: "Cloud para Investigación de Mercados",
        titleEn: "Cloud for Market Research",
        descEs:
          "Dashboards de operación de campo en tiempo real y pipelines que conectan captura, validación y entrega en un solo flujo.",
        descEn:
          "Real-time field-operations dashboards and pipelines connecting capture, validation and delivery in a single flow.",
      },
      {
        icon: "tri-person",
        titleEs: "Talento para Investigación de Mercados",
        titleEn: "Talent for Market Research",
        descEs:
          "Científicos de datos e ingenieros bilingües integrados a tus proyectos de research en 5 días, sin overhead de contratación.",
        descEn:
          "Bilingual data scientists and engineers integrated into your research projects in 5 days, without hiring overhead.",
      },
    ],
    metrics: [
      {
        value: "100%",
        labelEs: "De la muestra verificable con back-checks de IA",
        labelEn: "Of the sample verifiable with AI back-checks",
      },
      {
        value: "~90%",
        labelEs: "Menor costo por llamada de verificación",
        labelEn: "Lower cost per verification call",
      },
      {
        value: "24/7",
        labelEs: "Capacidad de contacto sin depender de turnos",
        labelEn: "Contact capacity without depending on shifts",
      },
      {
        value: "5 días",
        labelEs: "Al primer especialista senior integrado",
        labelEn: "To the first senior specialist integrated",
      },
    ],
    statHighlights: [
      {
        value: "US$140B",
        labelEs:
          "Industria global de investigación, creciendo 6.4% anual — solo los métodos AI-native crecen a doble dígito",
        labelEn:
          "Global research industry, growing 6.4% yearly — only AI-native methods grow double digits",
        source: "ESOMAR, 2025",
      },
      {
        value: "72%",
        labelEs:
          "Compradores de insights que usan IA generativa en al menos una etapa (23% en 2023)",
        labelEn: "Insights buyers using generative AI in at least one stage (23% in 2023)",
        source: "GRIT Report, 2025",
      },
      {
        value: "47%",
        labelEs:
          "Investigadores que ya usan IA regularmente en sus proyectos; 83% planea invertir en IA",
        labelEn: "Researchers already using AI regularly; 83% plan to invest in AI",
        source: "Industria, 2025",
      },
    ],
    regulations: [
      {
        code: "Ley 1581",
        nameEs: "Habeas Data (Colombia)",
        nameEn: "Habeas Data (Colombia)",
        descEs:
          "Tratamiento de datos personales de encuestados: consentimiento informado, finalidad y derechos de los titulares en cada estudio.",
        descEn:
          "Respondent personal data processing: informed consent, purpose limitation and data-subject rights in every study.",
      },
      {
        code: "GDPR",
        nameEs: "Reglamento General de Protección de Datos",
        nameEn: "General Data Protection Regulation",
        descEs:
          "Aplica en estudios multinacionales y cuando clientes globales lo exigen por contrato.",
        descEn:
          "Applies in multinational studies and when global clients require it contractually.",
      },
      {
        code: "ISO 20252",
        nameEs: "Norma internacional para investigación de mercados y social",
        nameEn: "International standard for market and social research",
        descEs:
          "Estándar de calidad para el ciclo completo del estudio: muestreo, campo, procesamiento y reporte — incluidos los procesos asistidos por IA.",
        descEn:
          "Quality standard for the full study cycle: sampling, fieldwork, processing and reporting — AI-assisted processes included.",
      },
      {
        code: "ICC/ESOMAR",
        nameEs: "Código internacional de investigación de mercados",
        nameEn: "International code on market research",
        descEs:
          "Principios éticos de la profesión: transparencia con los participantes, también cuando interviene una IA en la recolección.",
        descEn:
          "The profession's ethical principles: transparency with participants, also when AI takes part in data collection.",
      },
    ],
    useCases: [
      {
        icon: "tri-check",
        titleEs: "Back-check con llamadas de IA",
        titleEn: "Back-checks with AI calls",
        descEs:
          "Verificación automática de entrevistas realizadas: la IA llama, confirma que la entrevista ocurrió, valida respuestas clave y registra evidencia auditable.",
        descEn:
          "Automatic verification of completed interviews: the AI calls, confirms the interview happened, validates key answers and records auditable evidence.",
        outcomeEs: "Supervisión total (100% de la muestra), no muestral.",
        outcomeEn: "Total supervision (100% of the sample), not sample-based.",
      },
      {
        icon: "arc-person",
        titleEs: "CATI híbrido humano + IA",
        titleEn: "Hybrid human + AI CATI",
        descEs:
          "Agentes de voz absorben volumen, horarios extendidos y cuestionarios cortos; el equipo humano toma los casos complejos y las entrevistas en profundidad.",
        descEn:
          "Voice agents absorb volume, extended hours and short questionnaires; the human team takes complex cases and in-depth interviews.",
        outcomeEs: "Capacidad elástica por picos de proyecto, sin crecer nómina.",
        outcomeEn: "Elastic capacity for project peaks, without growing payroll.",
      },
      {
        icon: "oct-monitor",
        titleEs: "Dashboard de campo en tiempo real",
        titleEn: "Real-time field dashboard",
        descEs:
          "Avance de cuotas, productividad por encuestador, geolocalización de entrevistas y alertas de calidad en vivo durante el operativo.",
        descEn:
          "Quota progress, per-interviewer productivity, interview geolocation and live quality alerts throughout the field operation.",
        outcomeEs: "Correcciones el mismo día, no al cierre del estudio.",
        outcomeEn: "Same-day corrections, not at study close.",
      },
      {
        icon: "arc-doc",
        titleEs: "Análisis y entregables con IA",
        titleEn: "AI-powered analysis and deliverables",
        descEs:
          "Codificación de preguntas abiertas, cruces automáticos y primeros borradores de informe generados con IA sobre datos validados.",
        descEn:
          "Open-end coding, automatic cross-tabs and first report drafts generated with AI on validated data.",
        outcomeEs: "Entregables en días, no semanas.",
        outcomeEn: "Deliverables in days, not weeks.",
      },
    ],
    playbook: [
      {
        number: "01",
        titleEs: "Assessment del ciclo del estudio",
        titleEn: "Study-cycle assessment",
        descEs:
          "Mapeamos campo, supervisión, procesamiento y entrega, y cuantificamos dónde la automatización genera más margen y velocidad.",
        descEn:
          "We map fieldwork, supervision, processing and delivery, and quantify where automation yields the most margin and speed.",
      },
      {
        number: "02",
        titleEs: "Piloto en un estudio real",
        titleEn: "Pilot on a real study",
        descEs:
          "Elegimos un proceso —por ejemplo back-checks— y lo corremos con IA en paralelo al método actual, comparando cobertura, costo y hallazgos.",
        descEn:
          "We pick one process — e.g. back-checks — and run it with AI alongside the current method, comparing coverage, cost and findings.",
      },
      {
        number: "03",
        titleEs: "Escalamiento por línea de servicio",
        titleEn: "Scale-up by service line",
        descEs:
          "Extendemos la automatización a CATI, dashboards de campo y generación de entregables, estudio por estudio.",
        descEn:
          "We extend automation to CATI, field dashboards and deliverable generation, study by study.",
      },
      {
        number: "04",
        titleEs: "Operación continua y gobierno",
        titleEn: "Continuous operations and governance",
        descEs:
          "Monitoreo de calidad, mejora continua de modelos y cumplimiento ISO 20252 / ICC-ESOMAR en los procesos automatizados.",
        descEn:
          "Quality monitoring, continuous model improvement and ISO 20252 / ICC-ESOMAR compliance across automated processes.",
      },
    ],
    industryFaqs: [
      {
        questionEs: "¿Las llamadas de IA sesgan las respuestas de los encuestados?",
        questionEn: "Do AI calls bias respondent answers?",
        answerEs:
          "Los estudios muestran tasas de completitud superiores al email y consistencia alta en cuestionarios estructurados. Para instrumentos sensibles diseñamos pruebas A/B contra el método actual antes de escalar, y el modo híbrido siempre deja las entrevistas delicadas en manos humanas.",
        answerEn:
          "Studies show completion rates above email and high consistency on structured questionnaires. For sensitive instruments we design A/B tests against the current method before scaling, and hybrid mode always keeps delicate interviews in human hands.",
      },
      {
        questionEs: "¿Funciona con nuestros cuestionarios y plataformas actuales?",
        questionEn: "Does it work with our current questionnaires and platforms?",
        answerEs:
          "Sí. Los agentes se configuran desde tus cuestionarios existentes y se integran vía API con tu software de campo, CATI o panel. No hay que migrar de plataforma para empezar.",
        answerEn:
          "Yes. Agents are configured from your existing questionnaires and integrate via API with your field, CATI or panel software. No platform migration needed to start.",
      },
      {
        questionEs: "¿Y los estudios presenciales o cualitativos?",
        questionEn: "What about face-to-face or qualitative studies?",
        answerEs:
          "El campo presencial se beneficia de la supervisión: back-checks de IA sobre el 100% de las entrevistas, dashboards de avance y transcripción/análisis automático de sesiones cualitativas. La IA potencia el campo, no lo sustituye.",
        answerEn:
          "Face-to-face fieldwork benefits from supervision: AI back-checks across 100% of interviews, progress dashboards and automatic transcription/analysis of qualitative sessions. AI augments fieldwork — it doesn't replace it.",
      },
      {
        questionEs: "¿Cómo se protegen los datos de los encuestados?",
        questionEn: "How is respondent data protected?",
        answerEs:
          "Los datos viven en tu infraestructura y jurisdicción, con consentimiento informado, minimización y trazabilidad por interacción. Los flujos se diseñan alineados a Habeas Data, GDPR e ISO 20252.",
        answerEn:
          "Data lives in your infrastructure and jurisdiction, with informed consent, minimization and per-interaction traceability. Flows are designed to align with Habeas Data, GDPR and ISO 20252.",
      },
      {
        questionEs: "¿Cuánto toma tener un piloto andando?",
        questionEn: "How long to get a pilot running?",
        answerEs:
          "Un piloto de back-checks o CATI corto queda operando en semanas sobre un estudio real, con métricas comparables contra tu método actual antes de decidir el escalamiento.",
        answerEn:
          "A back-check or short-CATI pilot runs within weeks on a real study, with metrics comparable against your current method before deciding to scale.",
      },
    ],
    techStack: [
      { label: "AWS", category: "cloud" },
      { label: "GCP", category: "cloud" },
      { label: "Airflow", category: "data" },
      { label: "BigQuery", category: "data" },
      { label: "dbt", category: "data" },
      { label: "Power BI / Looker", category: "data" },
      { label: "Python / FastAPI", category: "ai" },
      { label: "LangChain", category: "ai" },
      { label: "Whisper / ASR", category: "ai" },
      { label: "Twilio", category: "other" },
      { label: "WhatsApp Business API", category: "other" },
      { label: "PostgreSQL", category: "backend" },
      { label: "Next.js", category: "frontend" },
    ],
    servicesHighlight: ["ia", "cloud", "staffing", "desarrollo-digital"],
    ctaTitleEs:
      "¿Y si tu próximo estudio saliera a campo con el doble de supervisión y una fracción del costo operativo?",
    ctaTitleEn:
      "What if your next study went to field with twice the supervision at a fraction of the operating cost?",
    ctaPrimaryTextEs: "Hablar con un especialista en research",
    ctaPrimaryTextEn: "Talk to a research specialist",
    ctaPrimaryUrl: "/contacto?industria=investigacion-de-mercados",
    hubIntroTitleEs: "Campo supervisado al 100% y entregables en días",
    hubIntroTitleEn: "Fieldwork 100% supervised, deliverables in days",
    hubIntroSubtitleEs:
      "Automatización con IA para firmas de investigación que quieren escalar operación y calidad sin escalar nómina.",
    hubIntroSubtitleEn:
      "AI automation for research firms that want to scale operations and quality without scaling payroll.",
    ctaTextEs: "Hablemos de tu operación de campo",
    ctaTextEn: "Let's talk about your field operation",
    seoTitleEs: "IA y Automatización para Investigación de Mercados",
    seoTitleEn: "AI & Automation for Market Research",
    seoDescriptionEs:
      "Back-checks con llamadas de IA al 100% de la muestra, CATI híbrido, dashboards de campo en tiempo real y entregables automáticos para firmas de investigación.",
    seoDescriptionEn:
      "AI-call back-checks across 100% of the sample, hybrid CATI, real-time field dashboards and automated deliverables for research firms.",
  },
];

/** Entradas para el mega-menú (sección "industrias", kind: grid). */
export const NAV_ITEMS_NUEVAS = [
  {
    url: "/industrias/medicion-de-audiencias",
    icon: "radio",
    labelEs: "Medición de Audiencias",
    labelEn: "Audience Measurement",
    ariaLabelEs:
      "Medición de Audiencias — agentes de voz IA, QA de datos y dashboards para operaciones de ratings y paneles",
    ariaLabelEn:
      "Audience Measurement — AI voice agents, data QA and dashboards for ratings and panel operations",
    descriptionEs: "Paneles, ratings y QA de datos con IA",
    descriptionEn: "Panels, ratings and AI-powered data QA",
  },
  {
    url: "/industrias/investigacion-de-mercados",
    icon: "clipboard-list",
    labelEs: "Investigación de Mercados",
    labelEn: "Market Research",
    ariaLabelEs:
      "Investigación de Mercados — back-checks con IA, CATI híbrido y dashboards de campo para firmas de research",
    ariaLabelEn:
      "Market Research — AI back-checks, hybrid CATI and field dashboards for research firms",
    descriptionEs: "Campo, CATI y entregables con IA",
    descriptionEn: "Fieldwork, CATI and AI deliverables",
  },
];
