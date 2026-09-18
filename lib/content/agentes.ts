// Copy bilingüe de la línea «Ingeniería de agentes» (hub de IA + 4 subservicios).
//
// Vive en código y no en la BD por la misma razón que ethical hacking: la página tiene que
// salir entera en inglés en /en, y los campos del CMS solo cubren una parte de las
// secciones. El seed (scripts/seed-servicios-agentes.ts) escribe en `servicios` los mismos
// textos de SEO, subtítulo, CTAs, beneficios, proceso y FAQs para que el admin, la grid
// del hub y llms.txt digan lo mismo que la página.
//
// Regla de contenido: nada de cifras de resultados. La banda de números se reemplazó por
// «Principios de diseño» — reglas que se cumplen en cada agente, no métricas de clientes.

export type AgentLocale = "es" | "en";

export interface LinkRef {
  label: string;
  href: string;
}

export interface ServiceCopy {
  /** Nombre del servicio (schema, breadcrumb, nav de hermanos). */
  name: string;
  seoTitle: string;
  seoDescription: string;
  badge: string;
  h1: string;
  h1Accent: string;
  subtitle: string;
  bullets: string[];
  panelTitle: string;
  panel: { icon: string; label: string }[];
  principles: string[];
  contextTitle: string;
  contextBody: string[];
  contextLink: LinkRef;
  solutionsTitle: string;
  solutions: { icon: string; title: string; description: string; link?: LinkRef }[];
  processTitle: string;
  process: { number: string; title: string; description: string; duration: string }[];
  stackTitle: string;
  stack: { name: string; items: string[] }[];
  faqs: { question: string; answer: string }[];
  crossLink: { text: string; link: LinkRef };
  ctaPrimary: LinkRef;
  ctaSecondary: LinkRef;
  ctaBanner: { title: string; description: string; button: string };
  serviceType: string;
}

export interface AgentService {
  /** slug_es en la tabla `servicios` (lo que recibe getServicioData). */
  slug: string;
  path: { es: string; en: string };
  es: ServiceCopy;
  en: ServiceCopy;
}

export const AGENT_ACCENT = "#8B5CF6";

const IA = { es: "/servicios/inteligencia-artificial", en: "/en/services/artificial-intelligence" };

export const AGENT_PATHS = {
  agentesIa: { es: `${IA.es}/agentes-ia`, en: `${IA.en}/ai-agents` },
  mcp: { es: `${IA.es}/integracion-sistemas-mcp`, en: `${IA.en}/systems-integration-mcp` },
  iaPrivada: { es: `${IA.es}/ia-privada-on-premise`, en: `${IA.en}/private-ai-on-premises` },
  agentops: { es: `${IA.es}/agentops-gobierno-agentes`, en: `${IA.en}/agentops` },
} as const;

const ETHICAL_HACKING = {
  es: "/servicios/cloud/ciberseguridad-ethical-hacking",
  en: "/en/services/cloud/ethical-hacking",
};
const AUTOMATIZACION = {
  es: `${IA.es}/automatizacion-procesos`,
  en: `${IA.en}/process-automation`,
};
const CONTACT = { es: "/contacto", en: "/en/contact" };

const blog = (slug: string, locale: AgentLocale) =>
  locale === "en" ? `/en/blog/${slug}` : `/blog/${slug}`;

/* ── Navegación entre hermanos del hub de IA ─────────────────────────────── */
// Única lista para las 8 subpáginas: antes cada página llevaba su copia a mano y un
// servicio nuevo obligaba a tocarlas todas.

export const IA_PARENT = {
  name: "Inteligencia Artificial",
  nameEn: "Artificial Intelligence",
  accentColor: AGENT_ACCENT,
};

export const IA_SIBLINGS = [
  {
    name: "Ingeniería de agentes",
    nameEn: "Agent Engineering",
    url: AGENT_PATHS.agentesIa.es,
    urlEn: AGENT_PATHS.agentesIa.en,
  },
  {
    name: "Integración y MCP",
    nameEn: "Integration & MCP",
    url: AGENT_PATHS.mcp.es,
    urlEn: AGENT_PATHS.mcp.en,
  },
  {
    name: "IA privada",
    nameEn: "Private AI",
    url: AGENT_PATHS.iaPrivada.es,
    urlEn: AGENT_PATHS.iaPrivada.en,
  },
  {
    name: "AgentOps",
    nameEn: "AgentOps",
    url: AGENT_PATHS.agentops.es,
    urlEn: AGENT_PATHS.agentops.en,
  },
  {
    name: "Agentes Comerciales",
    nameEn: "Sales Agents",
    url: `${IA.es}/agentes-comerciales`,
    urlEn: `${IA.en}/sales-agents`,
  },
  {
    name: "Automatización",
    nameEn: "Automation",
    url: AUTOMATIZACION.es,
    urlEn: AUTOMATIZACION.en,
  },
  {
    name: "Gestión de Contenido",
    nameEn: "Content Management",
    url: `${IA.es}/gestion-contenido`,
    urlEn: `${IA.en}/content-management`,
  },
  {
    name: "Marketing y CRM",
    nameEn: "Marketing & CRM",
    url: `${IA.es}/marketing-crm`,
    urlEn: `${IA.en}/marketing-crm`,
  },
];

/* ── Stack compartido ────────────────────────────────────────────────────── */

const STACK_MODELS = [
  "Claude (Anthropic)",
  "Amazon Bedrock",
  "Azure OpenAI",
  "Llama · Qwen · Mistral",
];
const STACK_ORCHESTRATION = ["MCP", "LangGraph", "Vercel AI SDK", "n8n"];
const STACK_OBSERVABILITY = ["OpenTelemetry", "Langfuse", "LangSmith", "Grafana"];

/* ══ 1. Ingeniería de agentes a la medida (agentes-ia) ════════════════════ */

const agentesIa: AgentService = {
  slug: "agentes-ia",
  path: AGENT_PATHS.agentesIa,
  es: {
    name: "Ingeniería de agentes a la medida",
    seoTitle: "Ingeniería de agentes de IA a la medida para producción",
    seoDescription:
      "Agentes de IA con herramientas con permisos, verificación independiente, guardrails y trazabilidad. Del discovery al piloto controlado en producción.",
    badge: "Inteligencia Artificial · Ingeniería de agentes",
    h1: "Agentes de IA que llegan",
    h1Accent: "a producción",
    subtitle:
      "Construimos agentes que ejecutan procesos completos dentro de tu operación —no demos— con el sistema alrededor del modelo que los hace confiables: herramientas con permisos, verificación independiente, guardrails y trazabilidad de cada acción.",
    bullets: [
      "Método de 7 capas (harness) aplicado desde el diseño, no como parche",
      "Integrados a tus sistemas actuales vía APIs y MCP, sin reemplazarlos",
      "En la nube que elijas o en tu propia infraestructura",
    ],
    panelTitle: "¿Qué puede hacer un agente por tu operación?",
    panel: [
      { icon: "dia-flow", label: "Orquestar procesos multisistema" },
      { icon: "tri-alert", label: "Clasificar y priorizar alertas" },
      { icon: "arc-doc", label: "Procesar y validar documentos" },
      { icon: "tri-deploy", label: "Coordinar despliegues con aprobación" },
      { icon: "dia-search", label: "Consultar datos internos con permisos" },
      { icon: "tri-person", label: "Atender solicitudes a cualquier hora" },
    ],
    principles: [
      "Toda acción con efecto queda trazada y es auditable",
      "Ninguna acción crítica sin verificación o aprobación humana",
      "Evals propias antes de salir a producción",
      "Permisos mínimos por herramienta",
    ],
    contextTitle: "El modelo ya no es la ventaja",
    contextBody: [
      "Hoy cualquiera tiene acceso a los mismos modelos. La diferencia entre un agente que impresiona en una demo y uno que opera un proceso real está en la ingeniería que lo rodea: qué herramientas puede usar y con qué permisos, quién verifica su trabajo, qué recuerda, qué tiene prohibido y si alguien puede reconstruir lo que hizo.",
      "A eso se le llama harness engineering, y es donde nos especializamos.",
    ],
    contextLink: {
      label: "Lee: harness engineering, las 7 capas →",
      href: blog("harness-engineering-agentes-ia", "es"),
    },
    solutionsTitle: "Qué construimos",
    solutions: [
      {
        icon: "dia-flow",
        title: "Agentes de proceso de punta a punta",
        description:
          "Un agente recibe una solicitud, consulta los sistemas necesarios, ejecuta los pasos y entrega el resultado. Solo escala a una persona cuando corresponde.",
        link: {
          label: "¿Reglas fijas sin decisiones? Mejor una automatización →",
          href: AUTOMATIZACION.es,
        },
      },
      {
        icon: "hex-nodes",
        title: "Sistemas multiagente y orquestación",
        description:
          "Un orquestador reparte el trabajo entre agentes especializados (investigar, ejecutar, verificar), con contratos claros entre ellos.",
      },
      {
        icon: "tri-alert",
        title: "Agentes de operaciones TI",
        description:
          "Clasificación de alertas, correlación de incidentes, preparación de despliegues y runbooks asistidos. Siempre con aprobación humana para las acciones irreversibles.",
      },
      {
        icon: "dia-search",
        title: "Agentes sobre conocimiento interno (RAG con permisos)",
        description:
          "Responden sobre tus documentos, normas y bases de datos, respetan los permisos de quien pregunta y citan la fuente.",
      },
      {
        icon: "arc-doc",
        title: "Agentes documentales con criterio",
        description:
          "Extraen datos, validan contra reglas de negocio y resuelven ambigüedades. Verifican antes de registrar cualquier dato.",
      },
      {
        icon: "tri-person",
        title: "Copilotos para equipos internos",
        description: "Asistentes que preparan, redactan y proponen. La persona decide y aprueba.",
      },
    ],
    processTitle: "Cómo lo construimos (duraciones orientativas)",
    process: [
      {
        number: "01",
        title: "Discovery y diseño del harness",
        duration: "1–2 semanas",
        description:
          "Proceso, sistemas involucrados, riesgos, nivel de autonomía por acción y criterios de éxito medibles.",
      },
      {
        number: "02",
        title: "Integración y herramientas",
        duration: "2–3 semanas",
        description:
          "Conectores o servidores MCP con mínimo privilegio, entornos de prueba y datos de evaluación.",
      },
      {
        number: "03",
        title: "Construcción y evals",
        duration: "2–4 semanas",
        description:
          "Agente, verificador y conjunto de evals. Iteramos contra evidencia, no contra impresiones.",
      },
      {
        number: "04",
        title: "Piloto controlado",
        duration: "2–4 semanas",
        description:
          "Producción con alcance limitado, aprobación humana y observabilidad completa.",
      },
      {
        number: "05",
        title: "Operación y mejora",
        duration: "Continuo",
        description: "AgentOps: monitoreo, drift, costos y nuevas capacidades.",
      },
    ],
    stackTitle: "Stack con el que trabajamos",
    stack: [
      { name: "Modelos", items: STACK_MODELS },
      { name: "Orquestación e integración", items: STACK_ORCHESTRATION },
      { name: "Observabilidad y evals", items: STACK_OBSERVABILITY },
    ],
    faqs: [
      {
        question: "¿En qué se diferencia un agente de un chatbot?",
        answer:
          "Un chatbot conversa. Un agente ejecuta: consulta sistemas, toma decisiones acotadas y completa tareas. Por eso necesita permisos, verificación y trazabilidad que un chatbot no requiere.",
      },
      {
        question: "¿Tenemos que cambiar nuestros sistemas?",
        answer:
          "No. Construimos una capa de integración (APIs o servidores MCP) sobre lo que ya tienes, incluidos los sistemas legados. El agente opera a través de esa capa, nunca directamente.",
      },
      {
        question: "¿Qué pasa si el agente se equivoca?",
        answer:
          "Diseñamos para que el error sea detectable y contenido: verificador independiente, evals antes de cada cambio, aprobación humana en acciones irreversibles, límites operativos y reversión. Cada error en producción se vuelve un caso de prueba.",
      },
      {
        question: "¿Dónde se procesan nuestros datos?",
        answer:
          "Tú lo decides. Pueden procesarse en tu nube (Amazon Bedrock o Azure OpenAI, con despliegues regionales en la región que elijas, sin inferencia global ni entre regiones, y sin que el proveedor use tus datos para entrenar sus modelos) o en tu propia infraestructura con modelos de pesos abiertos.",
      },
      {
        question: "¿Cuánto cuesta?",
        answer:
          "Depende del proceso, las integraciones y el nivel de autonomía. En el discovery definimos alcance, arquitectura y costo con criterios de éxito medibles.",
      },
    ],
    crossLink: {
      text: "¿Tus sistemas no tienen API?",
      link: { label: "Empieza por la integración →", href: AGENT_PATHS.mcp.es },
    },
    ctaPrimary: { label: "Agendar discovery", href: CONTACT.es },
    ctaSecondary: { label: "Ver qué construimos", href: "#soluciones" },
    ctaBanner: {
      title: "¿Qué proceso quieres poner en manos de un agente?",
      description:
        "En el discovery aterrizamos el proceso, los riesgos y el nivel de autonomía antes de escribir una línea de código.",
      button: "Agendar discovery →",
    },
    serviceType: "AI Agent Development",
  },
  en: {
    name: "Custom AI Agent Engineering",
    seoTitle: "Custom AI agent engineering, built for production",
    seoDescription:
      "AI agents with permissioned tools, independent verification, guardrails and per-action traceability. From discovery to a controlled pilot in production.",
    badge: "Artificial Intelligence · Agent engineering",
    h1: "AI agents that actually reach",
    h1Accent: "production",
    subtitle:
      "We build agents that run complete processes inside your operation —not demos— together with the system around the model that makes them trustworthy: permissioned tools, independent verification, guardrails and traceability for every action.",
    bullets: [
      "A 7-layer method (the harness) applied from day one, not bolted on",
      "Integrated with your current systems through APIs and MCP, without replacing them",
      "On the cloud you choose or on your own infrastructure",
    ],
    panelTitle: "What can an agent do for your operation?",
    panel: [
      { icon: "dia-flow", label: "Orchestrate multi-system processes" },
      { icon: "tri-alert", label: "Triage and prioritize alerts" },
      { icon: "arc-doc", label: "Process and validate documents" },
      { icon: "tri-deploy", label: "Coordinate deployments with approval" },
      { icon: "dia-search", label: "Query internal data with permissions" },
      { icon: "tri-person", label: "Handle requests at any hour" },
    ],
    principles: [
      "Every action with side effects is traced and auditable",
      "No critical action without verification or human approval",
      "Custom evals before going to production",
      "Least privilege for every tool",
    ],
    contextTitle: "The model is no longer the advantage",
    contextBody: [
      "Everyone has access to the same models today. The difference between an agent that impresses in a demo and one that runs a real process is the engineering around it: which tools it can use and with what permissions, who checks its work, what it remembers, what it is forbidden to do and whether anyone can reconstruct what it did.",
      "That is called harness engineering, and it is what we specialize in.",
    ],
    contextLink: {
      label: "Read: harness engineering, the 7 layers →",
      href: blog("harness-engineering-agentes-ia", "en"),
    },
    solutionsTitle: "What we build",
    solutions: [
      {
        icon: "dia-flow",
        title: "End-to-end process agents",
        description:
          "An agent receives a request, queries the systems involved, runs the steps and delivers the result. It only escalates to a person when it should.",
        link: {
          label: "Fixed rules with no decisions? Automation fits better →",
          href: AUTOMATIZACION.en,
        },
      },
      {
        icon: "hex-nodes",
        title: "Multi-agent systems and orchestration",
        description:
          "An orchestrator splits the work across specialized agents (research, execute, verify), with clear contracts between them.",
      },
      {
        icon: "tri-alert",
        title: "IT operations agents",
        description:
          "Alert triage, incident correlation, deployment preparation and assisted runbooks. Always with human approval for irreversible actions.",
      },
      {
        icon: "dia-search",
        title: "Agents over internal knowledge (permission-aware RAG)",
        description:
          "They answer over your documents, policies and databases, respect the permissions of whoever asks and cite the source.",
      },
      {
        icon: "arc-doc",
        title: "Document agents with judgment",
        description:
          "They extract data, validate it against business rules and resolve ambiguity. They verify before recording anything.",
      },
      {
        icon: "tri-person",
        title: "Copilots for internal teams",
        description: "Assistants that prepare, draft and propose. The person decides and approves.",
      },
    ],
    processTitle: "How we build it (indicative timelines)",
    process: [
      {
        number: "01",
        title: "Discovery and harness design",
        duration: "1–2 weeks",
        description:
          "Process, systems involved, risks, autonomy level per action and measurable success criteria.",
      },
      {
        number: "02",
        title: "Integration and tools",
        duration: "2–3 weeks",
        description:
          "Least-privilege connectors or MCP servers, test environments and evaluation data.",
      },
      {
        number: "03",
        title: "Build and evals",
        duration: "2–4 weeks",
        description:
          "Agent, verifier and eval suite. We iterate against evidence, not impressions.",
      },
      {
        number: "04",
        title: "Controlled pilot",
        duration: "2–4 weeks",
        description: "Production with limited scope, human approval and full observability.",
      },
      {
        number: "05",
        title: "Operation and improvement",
        duration: "Ongoing",
        description: "AgentOps: monitoring, drift, costs and new capabilities.",
      },
    ],
    stackTitle: "The stack we work with",
    stack: [
      { name: "Models", items: STACK_MODELS },
      { name: "Orchestration and integration", items: STACK_ORCHESTRATION },
      { name: "Observability and evals", items: STACK_OBSERVABILITY },
    ],
    faqs: [
      {
        question: "How is an agent different from a chatbot?",
        answer:
          "A chatbot talks. An agent acts: it queries systems, makes bounded decisions and completes tasks. That is why it needs permissions, verification and traceability that a chatbot does not.",
      },
      {
        question: "Do we have to change our systems?",
        answer:
          "No. We build an integration layer (APIs or MCP servers) on top of what you already have, including legacy systems. The agent works through that layer, never directly.",
      },
      {
        question: "What happens if the agent makes a mistake?",
        answer:
          "We design so errors are detectable and contained: an independent verifier, evals before every change, human approval for irreversible actions, operational limits and rollback. Every production error becomes a test case.",
      },
      {
        question: "Where is our data processed?",
        answer:
          "You decide. It can be processed in your cloud (Amazon Bedrock or Azure OpenAI, with regional deployments in the region you choose, no global or cross-region inference, and without the provider using your data to train its models) or on your own infrastructure with open-weight models.",
      },
      {
        question: "How much does it cost?",
        answer:
          "It depends on the process, the integrations and the level of autonomy. In discovery we define scope, architecture and cost against measurable success criteria.",
      },
    ],
    crossLink: {
      text: "Your systems have no API?",
      link: { label: "Start with integration →", href: AGENT_PATHS.mcp.en },
    },
    ctaPrimary: { label: "Book a discovery session", href: CONTACT.en },
    ctaSecondary: { label: "See what we build", href: "#soluciones" },
    ctaBanner: {
      title: "Which process would you hand to an agent?",
      description:
        "In discovery we pin down the process, the risks and the autonomy level before writing a line of code.",
      button: "Book a discovery session →",
    },
    serviceType: "AI Agent Development",
  },
};

/* ══ 2. Integración de sistemas y MCP ═════════════════════════════════════ */

const mcp: AgentService = {
  slug: "integracion-sistemas-mcp",
  path: AGENT_PATHS.mcp,
  es: {
    name: "Integración de sistemas y MCP",
    seoTitle: "Integración de sistemas con MCP para agentes de IA",
    seoDescription:
      "Servidores MCP a la medida y adaptadores para sistemas legados: conecta ERP, bases de datos y APIs a tus agentes con mínimo privilegio y auditoría.",
    badge: "Inteligencia Artificial · Integración",
    h1: "Conecta tus sistemas",
    h1Accent: "a tus agentes, sin romperlos",
    subtitle:
      "Un agente vale lo que valen sus integraciones. Construimos la capa que une tus ERP, bases de datos, APIs internas y sistemas legados con agentes de IA usando Model Context Protocol (MCP), con mínimo privilegio y auditoría de cada llamada.",
    bullets: [
      "Servidores MCP a la medida sobre tus sistemas actuales",
      "Adaptadores para sistemas legados sin API",
      "Permisos, límites y registro de auditoría por herramienta",
    ],
    panelTitle: "¿Qué conectamos?",
    panel: [
      { icon: "hex-data", label: "ERP y sistemas financieros" },
      { icon: "oct-cube", label: "Bases de datos SQL y NoSQL" },
      { icon: "hex-nodes", label: "APIs internas y servicios web" },
      { icon: "oct-code", label: "Sistemas legados y archivos planos" },
      { icon: "arc-doc", label: "Gestores documentales" },
      { icon: "oct-monitor", label: "Monitoreo y tickets" },
    ],
    principles: [
      "Estándar abierto, sin encierro con un proveedor",
      "Cada herramienta con un permiso explícito",
      "Toda llamada registrada para auditoría",
      "Credenciales fuera del contexto del modelo",
    ],
    contextTitle: "Integración primero, agente después",
    contextBody: [
      "Muchos agentes no fallan por el modelo: fallan porque no pueden leer ni escribir de forma segura en los sistemas donde vive el trabajo.",
      "MCP es el estándar abierto que permite exponer esos sistemas como herramientas bien definidas. Diseñamos esas herramientas para que el agente pueda hacer exactamente lo que debe, y nada más.",
    ],
    contextLink: {
      label: "Lee: MCP para integrar agentes con sistemas legados →",
      href: blog("mcp-integrar-agentes-sistemas-legados", "es"),
    },
    solutionsTitle: "Qué construimos",
    solutions: [
      {
        icon: "hex-nodes",
        title: "Servidores MCP a la medida",
        description:
          "Exponemos tus sistemas como herramientas con esquemas claros, validación de entradas y respuestas pensadas para un modelo.",
      },
      {
        icon: "oct-code",
        title: "Adaptadores para sistemas legados",
        description:
          "Cuando no hay API, construimos una sobre bases de datos, archivos, colas o interfaces existentes, sin tocar el sistema original.",
      },
      {
        icon: "dia-flow",
        title: "Capa de APIs y eventos",
        description:
          "APIs internas, eventos y colas para que agentes y sistemas se comuniquen de forma confiable e idempotente.",
      },
      {
        icon: "oct-lock",
        title: "Seguridad de herramientas",
        description:
          "Mínimo privilegio, lectura separada de escritura, límites de uso, secretos fuera del alcance del modelo y defensa contra la inyección de instrucciones a través de herramientas.",
      },
      {
        icon: "oct-scan",
        title: "Auditoría y trazabilidad",
        description:
          "Registro de cada llamada, con quién la pidió, qué agente la hizo, con qué parámetros y qué resultado tuvo.",
      },
      {
        icon: "hex-cycle",
        title: "Capa de orquestación para agentes",
        description:
          "Combina pasos deterministas y decisiones de agentes, con reintentos y compensación.",
      },
    ],
    processTitle: "Cómo lo construimos (duraciones orientativas)",
    process: [
      {
        number: "01",
        title: "Inventario de sistemas y datos",
        duration: "1 semana",
        description:
          "Qué sistemas intervienen, qué datos exponen, quién es dueño de cada uno y qué restricciones tienen.",
      },
      {
        number: "02",
        title: "Diseño de herramientas y permisos",
        duration: "1–2 semanas",
        description:
          "Cada herramienta con su esquema, su permiso mínimo y su política de lectura o escritura.",
      },
      {
        number: "03",
        title: "Construcción de servidores y adaptadores",
        duration: "2–4 semanas",
        description:
          "Servidores MCP y adaptadores con validación, límites y registro de auditoría.",
      },
      {
        number: "04",
        title: "Pruebas de seguridad y carga",
        duration: "1–2 semanas",
        description:
          "Inyección a través de herramientas, abuso de permisos y comportamiento bajo carga.",
      },
      {
        number: "05",
        title: "Operación y versionado",
        duration: "Continuo",
        description:
          "Versionado de herramientas, monitoreo de uso y evolución junto con tus sistemas.",
      },
    ],
    stackTitle: "Stack con el que trabajamos",
    stack: [
      { name: "Protocolos e interfaces", items: ["MCP", "REST", "GraphQL", "Colas y eventos"] },
      { name: "Datos y sistemas", items: ["PostgreSQL", "SQL Server", "Oracle", "AWS", "Azure"] },
      { name: "Orquestación y observabilidad", items: ["n8n", "LangGraph", "OpenTelemetry"] },
    ],
    faqs: [
      {
        question: "¿Qué es MCP?",
        answer:
          "Model Context Protocol es un estándar abierto que Anthropic presentó en noviembre de 2024 para conectar modelos de IA con herramientas y datos. Desde diciembre de 2025 lo gobierna la Agentic AI Foundation, bajo la Linux Foundation. Define cómo un agente descubre y usa herramientas de forma uniforme, sin una integración a la medida para cada modelo.",
      },
      {
        question: "¿Funciona con sistemas que no tienen API?",
        answer:
          "Sí. Construimos un adaptador que expone el sistema de forma controlada, sin modificar el sistema original.",
      },
      {
        question: "¿MCP nos amarra a un proveedor de IA?",
        answer:
          "No. Es un protocolo abierto y neutral que soportan varios clientes y modelos. Las herramientas que construimos funcionan con distintos modelos.",
      },
      {
        question: "¿Cómo evitan que el agente haga algo indebido en un sistema?",
        answer:
          "Cada herramienta tiene el mínimo permiso necesario, separamos lectura de escritura, limitamos los parámetros y exigimos verificación o aprobación para toda acción con efecto.",
      },
      {
        question: "¿Sirve sin agentes?",
        answer:
          "Sí. La capa de integración también ordena tus sistemas para otros usos, como automatización, reportes o aplicaciones nuevas.",
      },
    ],
    crossLink: {
      text: "¿Los datos no pueden salir de tu red?",
      link: { label: "Mira IA privada →", href: AGENT_PATHS.iaPrivada.es },
    },
    ctaPrimary: { label: "Mapear mis integraciones", href: CONTACT.es },
    ctaSecondary: { label: "Ver qué conectamos", href: "#soluciones" },
    ctaBanner: {
      title: "¿Qué sistemas necesita tocar tu agente?",
      description:
        "Empezamos con un inventario de sistemas y permisos: sabrás qué se puede exponer, cómo y con qué riesgo.",
      button: "Mapear mis integraciones →",
    },
    serviceType: "Systems Integration",
  },
  en: {
    name: "Systems Integration & MCP",
    seoTitle: "Systems integration with MCP for AI agents",
    seoDescription:
      "Custom MCP servers and adapters for legacy systems: connect your ERP, databases and APIs to your agents with least privilege and a full audit trail.",
    badge: "Artificial Intelligence · Integration",
    h1: "Connect your systems",
    h1Accent: "to your agents, without breaking them",
    subtitle:
      "An agent is only as good as its integrations. We build the layer that connects your ERP, databases, internal APIs and legacy systems to AI agents using the Model Context Protocol (MCP), with least privilege and an audit trail for every call.",
    bullets: [
      "Custom MCP servers on top of your current systems",
      "Adapters for legacy systems with no API",
      "Permissions, limits and audit logging per tool",
    ],
    panelTitle: "What do we connect?",
    panel: [
      { icon: "hex-data", label: "ERP and financial systems" },
      { icon: "oct-cube", label: "SQL and NoSQL databases" },
      { icon: "hex-nodes", label: "Internal APIs and web services" },
      { icon: "oct-code", label: "Legacy systems and flat files" },
      { icon: "arc-doc", label: "Document management systems" },
      { icon: "oct-monitor", label: "Monitoring and ticketing" },
    ],
    principles: [
      "Open standard, no vendor lock-in",
      "Every tool with an explicit permission",
      "Every call logged for audit",
      "Credentials kept out of the model's context",
    ],
    contextTitle: "Integration first, agent second",
    contextBody: [
      "Many agents do not fail because of the model: they fail because they cannot safely read from or write to the systems where the work lives.",
      "MCP is the open standard for exposing those systems as well-defined tools. We design those tools so the agent can do exactly what it should, and nothing more.",
    ],
    contextLink: {
      label: "Read: MCP for connecting agents to legacy systems →",
      href: blog("mcp-integrar-agentes-sistemas-legados", "en"),
    },
    solutionsTitle: "What we build",
    solutions: [
      {
        icon: "hex-nodes",
        title: "Custom MCP servers",
        description:
          "We expose your systems as tools with clear schemas, input validation and responses designed for a model.",
      },
      {
        icon: "oct-code",
        title: "Adapters for legacy systems",
        description:
          "When there is no API, we build one on top of databases, files, queues or existing interfaces, without touching the original system.",
      },
      {
        icon: "dia-flow",
        title: "API and event layer",
        description:
          "Internal APIs, events and queues so agents and systems communicate reliably and idempotently.",
      },
      {
        icon: "oct-lock",
        title: "Tool security",
        description:
          "Least privilege, reads separated from writes, usage limits, secrets out of the model's reach and defense against instruction injection through tools.",
      },
      {
        icon: "oct-scan",
        title: "Audit and traceability",
        description:
          "Every call is logged: who requested it, which agent made it, with which parameters and what the result was.",
      },
      {
        icon: "hex-cycle",
        title: "Orchestration layer for agents",
        description:
          "Combines deterministic steps with agent decisions, with retries and compensation.",
      },
    ],
    processTitle: "How we build it (indicative timelines)",
    process: [
      {
        number: "01",
        title: "Systems and data inventory",
        duration: "1 week",
        description:
          "Which systems are involved, what data they expose, who owns each one and what constraints apply.",
      },
      {
        number: "02",
        title: "Tool and permission design",
        duration: "1–2 weeks",
        description:
          "Every tool with its schema, its minimum permission and its read or write policy.",
      },
      {
        number: "03",
        title: "Build servers and adapters",
        duration: "2–4 weeks",
        description: "MCP servers and adapters with validation, limits and audit logging.",
      },
      {
        number: "04",
        title: "Security and load testing",
        duration: "1–2 weeks",
        description: "Injection through tools, permission abuse and behavior under load.",
      },
      {
        number: "05",
        title: "Operation and versioning",
        duration: "Ongoing",
        description: "Tool versioning, usage monitoring and evolution alongside your systems.",
      },
    ],
    stackTitle: "The stack we work with",
    stack: [
      { name: "Protocols and interfaces", items: ["MCP", "REST", "GraphQL", "Queues and events"] },
      { name: "Data and systems", items: ["PostgreSQL", "SQL Server", "Oracle", "AWS", "Azure"] },
      { name: "Orchestration and observability", items: ["n8n", "LangGraph", "OpenTelemetry"] },
    ],
    faqs: [
      {
        question: "What is MCP?",
        answer:
          "The Model Context Protocol is an open standard that Anthropic introduced in November 2024 to connect AI models with tools and data. Since December 2025 it has been governed by the Agentic AI Foundation, under the Linux Foundation. It defines how an agent discovers and uses tools in a uniform way, with no custom integration for each model.",
      },
      {
        question: "Does it work with systems that have no API?",
        answer:
          "Yes. We build an adapter that exposes the system in a controlled way, without modifying the original system.",
      },
      {
        question: "Does MCP lock us into one AI provider?",
        answer:
          "No. It is an open, neutral protocol supported by several clients and models. The tools we build work across different models.",
      },
      {
        question: "How do you stop the agent from doing something it should not in a system?",
        answer:
          "Every tool has the minimum permission it needs, we separate reads from writes, constrain parameters and require verification or approval for any action with side effects.",
      },
      {
        question: "Is it useful without agents?",
        answer:
          "Yes. The integration layer also puts your systems in order for other uses, such as automation, reporting or new applications.",
      },
    ],
    crossLink: {
      text: "Your data cannot leave your network?",
      link: { label: "See private AI →", href: AGENT_PATHS.iaPrivada.en },
    },
    ctaPrimary: { label: "Map my integrations", href: CONTACT.en },
    ctaSecondary: { label: "See what we connect", href: "#soluciones" },
    ctaBanner: {
      title: "Which systems does your agent need to touch?",
      description:
        "We start with a systems and permissions inventory: you will know what can be exposed, how and with what risk.",
      button: "Map my integrations →",
    },
    serviceType: "Systems Integration",
  },
};

/* ══ 3. IA privada / on-premise ═══════════════════════════════════════════ */

const iaPrivada: AgentService = {
  slug: "ia-privada-on-premise",
  path: AGENT_PATHS.iaPrivada,
  es: {
    name: "IA privada",
    seoTitle: "IA privada: agentes de IA con modelos en tu infraestructura",
    seoDescription:
      "Agentes de IA con modelos abiertos en tu infraestructura o en tu cuenta de nube (Amazon Bedrock, Azure OpenAI), con enrutamiento por sensibilidad del dato.",
    badge: "Inteligencia Artificial · IA privada",
    h1: "Agentes de IA",
    h1Accent: "donde viven tus datos",
    subtitle:
      "Para organizaciones donde la información no puede salir de su control, desplegamos agentes con modelos de pesos abiertos en tu infraestructura o con modelos comerciales consumidos desde tu propia cuenta de nube. El rigor de evaluación, seguridad y operación es el mismo en ambos casos.",
    bullets: [
      "Modelos de pesos abiertos (Llama, Qwen, Mistral) en tu infraestructura",
      "Modelos comerciales consumidos desde tu cuenta de AWS o Azure, en tu región y con tus controles de acceso",
      "Enrutamiento por sensibilidad del dato: cada consulta va por la ruta que tú apruebes",
    ],
    panelTitle: "Tres modelos de despliegue",
    panel: [
      { icon: "oct-lock", label: "On-premise o aislado (sin salida a internet)" },
      { icon: "hex-cloud", label: "Nube en tu cuenta" },
      { icon: "dia-flow", label: "Híbrido con enrutamiento por sensibilidad" },
    ],
    principles: [
      "Lo sensible se procesa solo en la ruta que tú apruebes",
      "Benchmark con tus datos antes de elegir modelo",
      "Toda consulta queda trazada en tu infraestructura",
      "Actualizaciones de modelos controladas y probadas",
    ],
    contextTitle: "No todo dato puede viajar a una API pública",
    contextBody: [
      "Hay información que por regulación, por contrato o por prudencia no debe salir de tu organización. Eso no significa renunciar a los agentes; significa elegir bien dónde corre el modelo.",
      "Evaluamos con tus propios casos qué modelo abierto o privado alcanza la calidad necesaria, y diseñamos una arquitectura en la que cada dato va por la ruta que su sensibilidad permite.",
    ],
    contextLink: {
      label: "Lee: IA privada, las tres rutas de despliegue →",
      href: blog("ia-privada-agentes-on-premise", "es"),
    },
    solutionsTitle: "Qué construimos",
    solutions: [
      {
        icon: "oct-cube",
        title: "Despliegue on-premise de modelos abiertos",
        description:
          "vLLM para producción y Ollama para pilotos, en tus servidores con GPU, con cuantización y dimensionamiento según tu carga.",
      },
      {
        icon: "hex-cloud",
        title: "Nube en tu cuenta",
        description:
          "Modelos comerciales vía Amazon Bedrock o Azure OpenAI, consumidos desde tu cuenta, en tu región y con tus controles de acceso.",
      },
      {
        icon: "dia-flow",
        title: "Arquitectura híbrida con enrutamiento",
        description:
          "Clasificamos la sensibilidad de cada solicitud y la enviamos al modelo permitido: el privado para lo sensible y el más capaz para lo general.",
      },
      {
        icon: "dia-target",
        title: "Evaluación y selección de modelos",
        description:
          "Comparamos modelos con tus tareas reales antes de invertir en infraestructura.",
      },
      {
        icon: "oct-lock",
        title: "Entornos aislados",
        description:
          "Despliegues sin salida a internet, con actualizaciones controladas de modelos y dependencias.",
      },
      {
        icon: "dia-search",
        title: "RAG privado",
        description:
          "Búsqueda sobre tus documentos con índices y embeddings que también se quedan en tu infraestructura.",
      },
    ],
    processTitle: "Cómo lo construimos (duraciones orientativas)",
    process: [
      {
        number: "01",
        title: "Clasificación de datos y requisitos",
        duration: "1–2 semanas",
        description:
          "Qué datos intervienen, qué nivel de sensibilidad tienen y qué exige la regulación o el contrato.",
      },
      {
        number: "02",
        title: "Benchmark de modelos con tus casos",
        duration: "2 semanas",
        description:
          "Medimos calidad, latencia y costo operativo de los modelos candidatos con tus tareas reales.",
      },
      {
        number: "03",
        title: "Diseño de infraestructura y dimensionamiento",
        duration: "1–2 semanas",
        description: "GPU, memoria, almacenamiento y red según el modelo y la carga esperada.",
      },
      {
        number: "04",
        title: "Despliegue, hardening y pruebas",
        duration: "2–4 semanas",
        description:
          "Instalación, endurecimiento de seguridad, pruebas de carga y de comportamiento.",
      },
      {
        number: "05",
        title: "Operación, actualización de modelos y evals",
        duration: "Continuo",
        description: "Actualizaciones controladas, evals de regresión y monitoreo.",
      },
    ],
    stackTitle: "Stack con el que trabajamos",
    stack: [
      { name: "Modelos de pesos abiertos", items: ["Llama", "Qwen", "Mistral"] },
      { name: "Servir y desplegar", items: ["vLLM", "Ollama", "Kubernetes", "GPU NVIDIA"] },
      {
        name: "Nube en tu cuenta y observabilidad",
        items: ["Amazon Bedrock", "Azure OpenAI", "OpenTelemetry"],
      },
    ],
    faqs: [
      {
        question: "¿Un modelo abierto es tan bueno como uno comercial?",
        answer:
          "Para muchas tareas acotadas, sí; para otras, no. Por eso medimos con tus casos reales antes de decidir, y diseñamos arquitecturas híbridas cuando conviene.",
      },
      {
        question: "¿Qué infraestructura necesitamos?",
        answer:
          "Depende del modelo y de la carga. En el benchmark dimensionamos GPU, memoria y almacenamiento. También se puede empezar en la nube de tu cuenta y migrar después.",
      },
      {
        question: "¿Pueden operar sin conexión a internet?",
        answer:
          "Sí. Diseñamos despliegues aislados con un proceso controlado para actualizar modelos y dependencias.",
      },
      {
        question: "¿Esto nos hace cumplir la regulación de datos?",
        answer:
          "Ayuda a cumplirla, pero el cumplimiento depende de tus políticas y procesos. Trabajamos con tu equipo legal y de seguridad para que la arquitectura respalde esos requisitos (por ejemplo, la Ley 1581 de 2012).",
      },
      {
        question: "¿Quién opera los modelos después?",
        answer:
          "Podemos operarlos nosotros con AgentOps o transferir la operación a tu equipo, con documentación y acompañamiento.",
      },
    ],
    crossLink: {
      text: "Un agente privado también necesita operación.",
      link: { label: "Conoce AgentOps →", href: AGENT_PATHS.agentops.es },
    },
    ctaPrimary: { label: "Diseñar mi arquitectura privada", href: CONTACT.es },
    ctaSecondary: { label: "Ver modelos de despliegue", href: "#soluciones" },
    ctaBanner: {
      title: "¿Qué información no puede salir de tu organización?",
      description:
        "Clasificamos tus datos y medimos modelos con tus casos antes de recomendar una arquitectura.",
      button: "Diseñar mi arquitectura privada →",
    },
    serviceType: "Private AI Deployment",
  },
  en: {
    name: "Private AI",
    seoTitle: "Private AI: AI agents with models on your infrastructure",
    seoDescription:
      "AI agents with open-weight models on your infrastructure or in your own cloud account (Amazon Bedrock, Azure OpenAI), with routing by data sensitivity.",
    badge: "Artificial Intelligence · Private AI",
    h1: "AI agents",
    h1Accent: "where your data lives",
    subtitle:
      "For organizations whose information cannot leave their control, we deploy agents with open-weight models on your infrastructure or with commercial models consumed from your own cloud account. The rigor of evaluation, security and operation is the same either way.",
    bullets: [
      "Open-weight models (Llama, Qwen, Mistral) on your infrastructure",
      "Commercial models consumed from your AWS or Azure account, in your region and under your access controls",
      "Routing by data sensitivity: every request takes the path you approve",
    ],
    panelTitle: "Three deployment models",
    panel: [
      { icon: "oct-lock", label: "On-premises or air-gapped" },
      { icon: "hex-cloud", label: "Cloud in your own account" },
      { icon: "dia-flow", label: "Hybrid with sensitivity-based routing" },
    ],
    principles: [
      "Sensitive data is processed only on the path you approve",
      "Benchmark on your data before choosing a model",
      "Every request traced on your infrastructure",
      "Controlled, tested model updates",
    ],
    contextTitle: "Not all data can travel to a public API",
    contextBody: [
      "Some information must not leave your organization, whether because of regulation, contracts or plain prudence. That does not mean giving up on agents; it means choosing carefully where the model runs.",
      "We evaluate on your own cases which open or private model reaches the quality you need, and design an architecture where each piece of data takes the path its sensitivity allows.",
    ],
    contextLink: {
      label: "Read: private AI, the three deployment paths →",
      href: blog("ia-privada-agentes-on-premise", "en"),
    },
    solutionsTitle: "What we build",
    solutions: [
      {
        icon: "oct-cube",
        title: "On-premises deployment of open models",
        description:
          "vLLM for production and Ollama for pilots, on your GPU servers, with quantization and sizing for your load.",
      },
      {
        icon: "hex-cloud",
        title: "Cloud in your own account",
        description:
          "Commercial models through Amazon Bedrock or Azure OpenAI, consumed from your account, in your region and under your access controls.",
      },
      {
        icon: "dia-flow",
        title: "Hybrid architecture with routing",
        description:
          "We classify the sensitivity of every request and send it to the allowed model: the private one for sensitive data and the most capable one for everything else.",
      },
      {
        icon: "dia-target",
        title: "Model evaluation and selection",
        description: "We compare models on your real tasks before you invest in infrastructure.",
      },
      {
        icon: "oct-lock",
        title: "Air-gapped environments",
        description:
          "Deployments with no internet egress and controlled updates for models and dependencies.",
      },
      {
        icon: "dia-search",
        title: "Private RAG",
        description:
          "Search over your documents with indexes and embeddings that also stay on your infrastructure.",
      },
    ],
    processTitle: "How we build it (indicative timelines)",
    process: [
      {
        number: "01",
        title: "Data classification and requirements",
        duration: "1–2 weeks",
        description:
          "Which data is involved, how sensitive it is and what regulation or contracts require.",
      },
      {
        number: "02",
        title: "Model benchmark on your cases",
        duration: "2 weeks",
        description:
          "We measure quality, latency and operating cost of candidate models on your real tasks.",
      },
      {
        number: "03",
        title: "Infrastructure design and sizing",
        duration: "1–2 weeks",
        description: "GPU, memory, storage and network based on the model and expected load.",
      },
      {
        number: "04",
        title: "Deployment, hardening and testing",
        duration: "2–4 weeks",
        description: "Installation, security hardening, load and behavior testing.",
      },
      {
        number: "05",
        title: "Operation, model updates and evals",
        duration: "Ongoing",
        description: "Controlled updates, regression evals and monitoring.",
      },
    ],
    stackTitle: "The stack we work with",
    stack: [
      { name: "Open-weight models", items: ["Llama", "Qwen", "Mistral"] },
      { name: "Serving and deployment", items: ["vLLM", "Ollama", "Kubernetes", "NVIDIA GPUs"] },
      {
        name: "Your cloud account and observability",
        items: ["Amazon Bedrock", "Azure OpenAI", "OpenTelemetry"],
      },
    ],
    faqs: [
      {
        question: "Is an open model as good as a commercial one?",
        answer:
          "For many bounded tasks, yes; for others, no. That is why we measure on your real cases before deciding, and design hybrid architectures when they make sense.",
      },
      {
        question: "What infrastructure do we need?",
        answer:
          "It depends on the model and the load. In the benchmark we size GPU, memory and storage. You can also start in your own cloud account and migrate later.",
      },
      {
        question: "Can it run with no internet connection?",
        answer:
          "Yes. We design air-gapped deployments with a controlled process for updating models and dependencies.",
      },
      {
        question: "Does this make us compliant with data regulation?",
        answer:
          "It helps, but compliance depends on your policies and processes. We work with your legal and security teams so the architecture supports those requirements (for example, Colombia's Law 1581 of 2012 on personal data protection).",
      },
      {
        question: "Who operates the models afterwards?",
        answer:
          "We can operate them through AgentOps or hand the operation over to your team, with documentation and support.",
      },
    ],
    crossLink: {
      text: "A private agent still needs to be operated.",
      link: { label: "See AgentOps →", href: AGENT_PATHS.agentops.en },
    },
    ctaPrimary: { label: "Design my private architecture", href: CONTACT.en },
    ctaSecondary: { label: "See deployment models", href: "#soluciones" },
    ctaBanner: {
      title: "What information cannot leave your organization?",
      description:
        "We classify your data and measure models on your cases before recommending an architecture.",
      button: "Design my private architecture →",
    },
    serviceType: "Private AI Deployment",
  },
};

/* ══ 4. AgentOps ══════════════════════════════════════════════════════════ */

const agentops: AgentService = {
  slug: "agentops-gobierno-agentes",
  path: AGENT_PATHS.agentops,
  es: {
    name: "AgentOps: operación y gobierno de agentes",
    seoTitle: "AgentOps: operación y gobierno de agentes de IA",
    seoDescription:
      "Operamos agentes de IA en producción: trazas, evals de regresión, detección de drift, control de costos, red teaming y evidencia para auditoría.",
    badge: "Inteligencia Artificial · AgentOps",
    h1: "Agentes en producción,",
    h1Accent: "bajo control",
    subtitle:
      "Un agente no se entrega y se olvida. Operamos tus agentes con evals continuas, observabilidad de cada paso, detección de drift, auditoría y control humano, para que sigan haciendo lo correcto cuando cambian los datos, los procesos o el modelo.",
    bullets: [
      "Trazas de cada decisión y de cada herramienta usada",
      "Evals de regresión antes de cualquier cambio de prompt o de modelo",
      "Red teaming de agentes contra inyección y abuso de herramientas",
    ],
    panelTitle: "¿Qué operamos?",
    panel: [
      { icon: "oct-monitor", label: "Observabilidad y trazas" },
      { icon: "dia-check", label: "Evals continuas y de regresión" },
      { icon: "dia-pulse", label: "Detección de drift" },
      { icon: "hex-chart", label: "Control de costos por agente" },
      { icon: "oct-scan", label: "Auditoría y evidencia" },
      { icon: "oct-shield", label: "Respuesta a incidentes" },
    ],
    principles: [
      "Toda ejecución trazada",
      "Ningún cambio de modelo o prompt sin evals",
      "Alertas automáticas de comportamiento y costo",
      "Un registro de auditoría por acción",
    ],
    contextTitle: "Lo difícil empieza después del lanzamiento",
    contextBody: [
      "Los modelos cambian de versión, los datos cambian y los procesos cambian. Un agente que funcionaba bien puede degradarse sin que nadie lo note.",
      "AgentOps es la disciplina de operar agentes como sistemas críticos: medir, detectar, auditar y corregir, con personas en el punto de control correcto.",
    ],
    contextLink: {
      label: "Lee: AgentOps, cómo operar agentes en producción →",
      href: blog("agentops-observabilidad-agentes-produccion", "es"),
    },
    solutionsTitle: "Qué operamos",
    solutions: [
      {
        icon: "oct-monitor",
        title: "Observabilidad de agentes",
        description:
          "Trazas de cada paso (entradas, decisiones, herramientas, costos, latencia), basadas en estándares abiertos como OpenTelemetry.",
      },
      {
        icon: "dia-check",
        title: "Evals continuas",
        description:
          "Conjuntos de prueba propios que se ejecutan con cada cambio y periódicamente en producción.",
        link: {
          label: "Cómo evaluamos agentes →",
          href: blog("evals-verificacion-agentes-ia", "es"),
        },
      },
      {
        icon: "dia-pulse",
        title: "Detección de drift",
        description:
          "Alertas cuando el comportamiento, la calidad o el costo del agente se desvían de su línea base.",
      },
      {
        icon: "oct-lock",
        title: "Guardrails y control humano",
        description: "Niveles de autonomía por tipo de acción, aprobaciones y límites operativos.",
        link: {
          label: "Guardrails y control humano →",
          href: blog("guardrails-control-humano-agentes", "es"),
        },
      },
      {
        icon: "oct-shield",
        title: "Red teaming de agentes",
        description:
          "Pruebas ofensivas contra la inyección de instrucciones, la fuga de datos y el abuso de herramientas, con nuestro equipo de ethical hacking.",
        link: { label: "Ciberseguridad y ethical hacking →", href: ETHICAL_HACKING.es },
      },
      {
        icon: "oct-scan",
        title: "Gobierno y auditoría",
        description:
          "Inventario de agentes, responsables, versiones, permisos y evidencia para auditoría interna, tomando como referencia marcos como NIST AI RMF e ISO/IEC 42001.",
      },
    ],
    processTitle: "Cómo lo operamos (duraciones orientativas)",
    process: [
      {
        number: "01",
        title: "Inventario y línea base",
        duration: "1–2 semanas",
        description:
          "Qué agentes existen, quién es responsable, qué versiones corren y cómo se comportan hoy.",
      },
      {
        number: "02",
        title: "Instrumentación y tableros",
        duration: "1–2 semanas",
        description: "Trazas, métricas de calidad y costo, y tableros por agente.",
      },
      {
        number: "03",
        title: "Evals y alertas",
        duration: "2 semanas",
        description: "Conjuntos de prueba propios y alertas sobre calidad, drift y costo.",
      },
      {
        number: "04",
        title: "Red teaming inicial",
        duration: "1–2 semanas",
        description: "Pruebas ofensivas específicas para agentes y plan de corrección.",
      },
      {
        number: "05",
        title: "Operación con reportes periódicos",
        duration: "Continuo",
        description: "Reportes de calidad, incidentes, costos y mejoras aplicadas.",
      },
    ],
    stackTitle: "Stack con el que trabajamos",
    stack: [
      { name: "Observabilidad", items: ["OpenTelemetry", "Langfuse", "LangSmith", "Grafana"] },
      { name: "Plataformas de nube", items: ["Amazon CloudWatch", "Azure Monitor"] },
      { name: "Calidad y control", items: ["Evals propias", "MCP", "Red teaming"] },
    ],
    faqs: [
      {
        question: "¿Pueden operar agentes que no construyeron ustedes?",
        answer:
          "Sí. Empezamos con un inventario y una línea base, instrumentamos lo que falte y definimos evals antes de asumir la operación.",
      },
      {
        question: "¿Qué es el drift en un agente?",
        answer:
          "Es la desviación gradual de su comportamiento respecto a lo esperado, causada por cambios en los datos, en los procesos o en la versión del modelo. Se detecta comparando contra una línea base y con evals periódicas.",
      },
      {
        question: "¿Qué queda registrado?",
        answer:
          "Cada ejecución: qué recibió el agente, qué decidió, qué herramientas usó, con qué parámetros y permisos, y qué resultado obtuvo.",
      },
      {
        question: "¿Cómo se reportan los resultados?",
        answer:
          "Con tableros en vivo y un reporte periódico de calidad, incidentes, costos y mejoras aplicadas.",
      },
      {
        question: "¿Hacen pruebas de seguridad a los agentes?",
        answer:
          "Sí, con red teaming específico para agentes: inyección de instrucciones, abuso de herramientas y fuga de datos.",
      },
    ],
    crossLink: {
      text: "¿Quieres auditar la seguridad de tus agentes?",
      link: { label: "Conoce ethical hacking →", href: ETHICAL_HACKING.es },
    },
    ctaPrimary: { label: "Hablar de AgentOps", href: CONTACT.es },
    ctaSecondary: { label: "Ver qué operamos", href: "#soluciones" },
    ctaBanner: {
      title: "¿Cuántos agentes tienes hoy en producción y quién los vigila?",
      description:
        "Empezamos con un inventario y una línea base: sabrás qué hacen tus agentes, cuánto cuestan y dónde están los riesgos.",
      button: "Hablar de AgentOps →",
    },
    serviceType: "AI Operations and Governance",
  },
  en: {
    name: "AgentOps: agent operations and governance",
    seoTitle: "AgentOps: operations and governance for AI agents",
    seoDescription:
      "We run AI agents in production: tracing, regression evals, drift detection, cost control, red teaming and audit-ready evidence for every action.",
    badge: "Artificial Intelligence · AgentOps",
    h1: "Agents in production,",
    h1Accent: "under control",
    subtitle:
      "An agent is not delivered and forgotten. We operate your agents with continuous evals, step-level observability, drift detection, auditing and human control, so they keep doing the right thing when the data, the processes or the model change.",
    bullets: [
      "Traces for every decision and every tool used",
      "Regression evals before any prompt or model change",
      "Agent red teaming against injection and tool abuse",
    ],
    panelTitle: "What do we operate?",
    panel: [
      { icon: "oct-monitor", label: "Observability and tracing" },
      { icon: "dia-check", label: "Continuous and regression evals" },
      { icon: "dia-pulse", label: "Drift detection" },
      { icon: "hex-chart", label: "Cost control per agent" },
      { icon: "oct-scan", label: "Audit and evidence" },
      { icon: "oct-shield", label: "Incident response" },
    ],
    principles: [
      "Every run traced",
      "No model or prompt change without evals",
      "Automatic alerts on behavior and cost",
      "One audit record per action",
    ],
    contextTitle: "The hard part starts after launch",
    contextBody: [
      "Models get new versions, data changes and processes change. An agent that worked well can degrade without anyone noticing.",
      "AgentOps is the discipline of running agents as critical systems: measuring, detecting, auditing and correcting, with people at the right checkpoint.",
    ],
    contextLink: {
      label: "Read: AgentOps, running agents in production →",
      href: blog("agentops-observabilidad-agentes-produccion", "en"),
    },
    solutionsTitle: "What we operate",
    solutions: [
      {
        icon: "oct-monitor",
        title: "Agent observability",
        description:
          "Traces for every step (inputs, decisions, tools, costs, latency), built on open standards such as OpenTelemetry.",
      },
      {
        icon: "dia-check",
        title: "Continuous evals",
        description: "Custom test suites that run on every change and periodically in production.",
        link: {
          label: "How we evaluate agents →",
          href: blog("evals-verificacion-agentes-ia", "en"),
        },
      },
      {
        icon: "dia-pulse",
        title: "Drift detection",
        description: "Alerts when the agent's behavior, quality or cost drifts from its baseline.",
      },
      {
        icon: "oct-lock",
        title: "Guardrails and human control",
        description: "Autonomy levels per action type, approvals and operational limits.",
        link: {
          label: "Guardrails and human control →",
          href: blog("guardrails-control-humano-agentes", "en"),
        },
      },
      {
        icon: "oct-shield",
        title: "Agent red teaming",
        description:
          "Offensive testing against instruction injection, data leakage and tool abuse, with our ethical hacking team.",
        link: { label: "Cybersecurity and ethical hacking →", href: ETHICAL_HACKING.en },
      },
      {
        icon: "oct-scan",
        title: "Governance and audit",
        description:
          "An inventory of agents, owners, versions, permissions and evidence for internal audit, using frameworks such as the NIST AI RMF and ISO/IEC 42001 as a reference.",
      },
    ],
    processTitle: "How we run it (indicative timelines)",
    process: [
      {
        number: "01",
        title: "Inventory and baseline",
        duration: "1–2 weeks",
        description:
          "Which agents exist, who owns them, which versions are running and how they behave today.",
      },
      {
        number: "02",
        title: "Instrumentation and dashboards",
        duration: "1–2 weeks",
        description: "Traces, quality and cost metrics, and a dashboard per agent.",
      },
      {
        number: "03",
        title: "Evals and alerts",
        duration: "2 weeks",
        description: "Custom test suites and alerts on quality, drift and cost.",
      },
      {
        number: "04",
        title: "Initial red teaming",
        duration: "1–2 weeks",
        description: "Agent-specific offensive testing and a remediation plan.",
      },
      {
        number: "05",
        title: "Operation with periodic reports",
        duration: "Ongoing",
        description: "Reports on quality, incidents, costs and improvements applied.",
      },
    ],
    stackTitle: "The stack we work with",
    stack: [
      { name: "Observability", items: ["OpenTelemetry", "Langfuse", "LangSmith", "Grafana"] },
      { name: "Cloud platforms", items: ["Amazon CloudWatch", "Azure Monitor"] },
      { name: "Quality and control", items: ["Custom evals", "MCP", "Red teaming"] },
    ],
    faqs: [
      {
        question: "Can you operate agents you did not build?",
        answer:
          "Yes. We start with an inventory and a baseline, instrument whatever is missing and define evals before taking over operations.",
      },
      {
        question: "What is drift in an agent?",
        answer:
          "It is the gradual deviation of its behavior from what is expected, caused by changes in the data, the processes or the model version. It is detected by comparing against a baseline and with periodic evals.",
      },
      {
        question: "What gets logged?",
        answer:
          "Every run: what the agent received, what it decided, which tools it used with which parameters and permissions, and what result it got.",
      },
      {
        question: "How are results reported?",
        answer:
          "Through live dashboards and a periodic report on quality, incidents, costs and improvements applied.",
      },
      {
        question: "Do you security-test the agents?",
        answer:
          "Yes, with agent-specific red teaming: instruction injection, tool abuse and data leakage.",
      },
    ],
    crossLink: {
      text: "Want to audit your agents' security?",
      link: { label: "See ethical hacking →", href: ETHICAL_HACKING.en },
    },
    ctaPrimary: { label: "Talk about AgentOps", href: CONTACT.en },
    ctaSecondary: { label: "See what we operate", href: "#soluciones" },
    ctaBanner: {
      title: "How many agents do you have in production, and who is watching them?",
      description:
        "We start with an inventory and a baseline: you will know what your agents do, what they cost and where the risks are.",
      button: "Talk about AgentOps →",
    },
    serviceType: "AI Operations and Governance",
  },
};

export const AGENT_SERVICES = { agentesIa, mcp, iaPrivada, agentops } as const;
export type AgentServiceKey = keyof typeof AGENT_SERVICES;

/* ── Marco de 7 capas (hub) ──────────────────────────────────────────────── */

export const HARNESS_FRAMEWORK = {
  es: {
    title: "Harness: 7 capas alrededor del modelo",
    subtitle:
      "El modelo es la parte fácil. Lo que hace confiable a un agente es todo lo que lo rodea.",
    link: {
      label: "Lee el artículo completo →",
      href: blog("harness-engineering-agentes-ia", "es"),
    },
    layers: [
      {
        letter: "H",
        title: "Herramientas orquestadas",
        description:
          "El modelo nunca toca un sistema directamente: una capa intermedia valida, limita y registra cada llamada.",
      },
      {
        letter: "V",
        title: "Verificación independiente",
        description:
          "Quien revisa no es quien hace. Un verificador aprueba cada acción con efecto antes de ejecutarla.",
      },
      {
        letter: "C",
        title: "Contexto y memoria",
        description:
          "El agente recibe solo lo que necesita, de fuentes con permisos, y olvida lo que debe olvidar.",
      },
      {
        letter: "G",
        title: "Guardrails",
        description:
          "Límites de comportamiento, de datos, de herramientas y operativos, definidos antes de escribir el primer prompt.",
      },
      {
        letter: "O",
        title: "Observabilidad",
        description:
          "Cada paso queda trazado: qué vio, qué decidió, qué herramienta usó y con qué permiso. Diseñada para detectar el drift antes de que lo noten tus usuarios.",
      },
      {
        letter: "E",
        title: "Enrutamiento de modelos",
        description:
          "Cada tarea va al modelo adecuado por costo, latencia y sensibilidad del dato, incluidos modelos privados.",
      },
      {
        letter: "F",
        title: "Feedback continuo",
        description:
          "Los errores en producción se convierten en casos de prueba. El agente mejora con evidencia, no con intuición.",
      },
    ],
  },
  en: {
    title: "The harness: 7 layers around the model",
    subtitle:
      "The model is the easy part. What makes an agent trustworthy is everything around it.",
    link: { label: "Read the full article →", href: blog("harness-engineering-agentes-ia", "en") },
    layers: [
      {
        letter: "T",
        title: "Orchestrated tools",
        description:
          "The model never touches a system directly: an intermediate layer validates, limits and logs every call.",
      },
      {
        letter: "V",
        title: "Independent verification",
        description:
          "Whoever checks is not whoever acts. A verifier approves every action with side effects before it runs.",
      },
      {
        letter: "C",
        title: "Context and memory",
        description:
          "The agent gets only what it needs, from permissioned sources, and forgets what it should forget.",
      },
      {
        letter: "G",
        title: "Guardrails",
        description:
          "Behavioral, data, tool and operational limits, defined before the first prompt is written.",
      },
      {
        letter: "O",
        title: "Observability",
        description:
          "Every step is traced: what it saw, what it decided, which tool it used and with what permission. Designed to catch drift before your users do.",
      },
      {
        letter: "R",
        title: "Model routing",
        description:
          "Every task goes to the right model by cost, latency and data sensitivity, including private models.",
      },
      {
        letter: "F",
        title: "Continuous feedback",
        description:
          "Production errors become test cases. The agent improves on evidence, not intuition.",
      },
    ],
  },
};

/* ── Evidencia + arquitecturas de referencia ─────────────────────────────── */

export const AGENT_PROOF = {
  es: {
    title: "Antes de construir agentes para otros, los usamos en casa",
    subtitle: "Lo que ofrecemos es lo que usamos todos los días.",
    items: [
      {
        icon: "hex-nodes",
        title: "Niveleads: agentes en nuestra operación comercial",
        description:
          "En Niveleads, nuestra plataforma comercial, los agentes prospectan, arman campañas, envían correos automáticos y revisan cómo interactúa cada lead. También hacen llamadas de voz con IA y vigilancia tecnológica, apoyan a growth y marketing, y leen señales para darle insights al equipo.",
      },
      {
        icon: "dia-check",
        title: "Ingeniería con agentes y QA independiente",
        description:
          "Desarrollamos con agentes que escriben, prueban y revisan código, pero no le dejamos todo a la IA. Las entregas pasan por un agente de QA independiente y por estándares de verificación que define nuestro equipo. Quien construye no es quien aprueba.",
      },
      {
        icon: "oct-code",
        title: "Un sitio pensado para agentes",
        description:
          "nivelics.com está diseñado para que también lo lean agentes y LLMs: un llms.txt que se genera dinámicamente, datos estructurados schema.org y contenido pensado para LLMs.",
      },
    ],
    scenariosTitle: "Arquitecturas de referencia",
    scenariosNote:
      "Escenarios ilustrativos de cómo construimos. No describen clientes ni resultados.",
    scenarios: [
      {
        title: "Agente de operaciones: de la alerta al despliegue",
        context:
          "Una organización con muchos sistemas y un equipo de operaciones saturado de alertas.",
        flow: [
          "Alerta",
          "Agente de clasificación",
          "Cambios, logs y runbooks vía MCP",
          "Verificador",
          "Ejecutar y notificar o pedir aprobación",
          "Registro de auditoría",
        ],
        description:
          "El agente correlaciona cada alerta con despliegues y cambios recientes, consulta logs y runbooks, clasifica la severidad y propone la acción. Las acciones reversibles preaprobadas en el runbook, como reiniciar un servicio, las ejecuta con el visto bueno del verificador y luego notifica. Para las irreversibles prepara el plan y espera aprobación humana.",
        harness:
          "Herramientas de solo lectura por defecto · verificador contra el runbook · trazas de cada decisión · evals construidas con incidentes históricos",
      },
      {
        title: "Orquestación multisistema de un proceso de negocio",
        context:
          "Un proceso que atraviesa varios sistemas y áreas, con reprocesos por datos inconsistentes.",
        flow: [
          "Solicitud",
          "Orquestador",
          "Agentes de integración y ejecución",
          "Verificador",
          "Cierre o excepción a una persona",
        ],
        description:
          "Un orquestador recibe la solicitud. Un agente de integración valida datos entre el ERP, el gestor documental y la base de datos. Un agente ejecutor registra los cambios y un verificador independiente confirma la consistencia antes de cerrar. Las excepciones llegan a una persona con todo el contexto ya armado.",
        harness:
          "Servidores MCP por sistema con mínimo privilegio · transacciones idempotentes con compensación · enrutamiento de modelos · tablero de AgentOps",
      },
    ],
  },
  en: {
    title: "Before building agents for others, we use them ourselves",
    subtitle: "What we offer is what we use every day.",
    items: [
      {
        icon: "hex-nodes",
        title: "Niveleads: agents in our sales operation",
        description:
          "In Niveleads, our commercial platform, agents prospect, build campaigns, send automated emails and review how each lead engages. They also make AI voice calls, run technology watch, support growth and marketing, and read signals to give the team insights.",
      },
      {
        icon: "dia-check",
        title: "Agent-assisted engineering with independent QA",
        description:
          "We build software with agents that write, test and review code, but we do not leave everything to AI. Deliveries go through an independent QA agent and verification standards defined by our team. Whoever builds is not whoever approves.",
      },
      {
        icon: "oct-code",
        title: "A website built for agents",
        description:
          "nivelics.com is designed to be read by agents and LLMs as well: a dynamically generated llms.txt, schema.org structured data and content written with LLMs in mind.",
      },
    ],
    scenariosTitle: "Reference architectures",
    scenariosNote:
      "Illustrative scenarios of how we build. They do not describe clients or results.",
    scenarios: [
      {
        title: "Operations agent: from alert to deployment",
        context: "An organization with many systems and an operations team flooded with alerts.",
        flow: [
          "Alert",
          "Triage agent",
          "Changes, logs and runbooks via MCP",
          "Verifier",
          "Execute and notify, or request approval",
          "Audit log",
        ],
        description:
          "The agent correlates each alert with recent deployments and changes, queries logs and runbooks, classifies severity and proposes an action. Reversible actions pre-approved in the runbook, such as restarting a service, run once the verifier signs off, and the team is notified. For irreversible ones it prepares the plan and waits for human approval.",
        harness:
          "Read-only tools by default · verifier checks against the runbook · traces for every decision · evals built from past incidents",
      },
      {
        title: "Multi-system orchestration of a business process",
        context:
          "A process that crosses several systems and teams, with rework caused by inconsistent data.",
        flow: [
          "Request",
          "Orchestrator",
          "Integration and execution agents",
          "Verifier",
          "Close, or exception to a person",
        ],
        description:
          "An orchestrator receives the request. An integration agent validates data across the ERP, the document system and the database. An execution agent records the changes, and an independent verifier confirms consistency before closing. Exceptions reach a person with all the context already assembled.",
        harness:
          "One least-privilege MCP server per system · idempotent transactions with compensation · model routing · AgentOps dashboard",
      },
    ],
  },
};

/* ── Hub /servicios/inteligencia-artificial ──────────────────────────────── */

/** Ruta por idioma de cada subservicio, indexada por slug_es (lo que trae la BD). */
export const IA_SUB_PATHS: Record<string, { es: string; en: string }> = Object.fromEntries(
  IA_SIBLINGS.map((s) => [s.url.split("/").pop() as string, { es: s.url, en: s.urlEn }]),
);

export const IA_HUB = {
  es: {
    seoTitle: "Desarrollo de agentes de IA en producción para empresas",
    seoDescription:
      "Diseñamos, integramos y operamos agentes de IA en producción: integración vía MCP, IA privada, evals, guardrails y AgentOps. Sin cambiar tus sistemas.",
    badge: "Inteligencia Artificial Aplicada",
    h1: "Agentes de IA que ejecutan",
    h1Accent: "procesos reales",
    subtitle:
      "No son chatbots. Son agentes que se integran a tus sistemas, trabajan con permisos acotados y dejan rastro de cada decisión.",
    description:
      "Diseñamos, integramos y operamos agentes de IA en producción: con verificación independiente, guardrails, observabilidad y la opción de correr sobre tu propia infraestructura.",
    bullets: [
      "Método de 7 capas (harness) en cada agente",
      "Integración con tus sistemas vía APIs y MCP",
      "En tu nube o en tu propia infraestructura",
    ],
    panelTitle: "¿Por dónde empezar?",
    principles: [
      "Toda acción con efecto queda trazada y es auditable",
      "Ninguna acción crítica sin verificación o aprobación humana",
      "Evals propias antes de salir a producción",
      "Tus datos se procesan donde tú decidas",
    ],
    subServicesTitle: "Soluciones especializadas",
    logosTitle: "Empresas que confían en Nivelics",
    stackTitle: "Stack con el que trabajamos",
    stack: [
      {
        name: "Modelos",
        items: ["Claude (Anthropic)", "Amazon Bedrock", "Azure OpenAI", "Llama · Qwen · Mistral"],
      },
      { name: "Orquestación", items: ["LangGraph", "Vercel AI SDK", "n8n"] },
      { name: "Integración", items: ["MCP", "REST", "GraphQL", "Colas y eventos"] },
      { name: "RAG y vectores", items: ["pgvector", "Pinecone", "Weaviate"] },
      {
        name: "Observabilidad y evals",
        items: ["OpenTelemetry", "Langfuse", "LangSmith", "Grafana"],
      },
      { name: "IA privada", items: ["vLLM", "Ollama", "Kubernetes"] },
    ],
    securityLink: {
      lead: "Auditoría de seguridad de agentes de IA:",
      text: "inyección de instrucciones, fuga de datos y abuso de herramientas conectadas: una superficie de ataque que los pentests tradicionales no cubren.",
      link: { label: "Conoce Ciberseguridad y Ethical Hacking →", href: ETHICAL_HACKING.es },
    },
    processTitle: "Cómo llevamos un agente a producción (duraciones orientativas)",
    process: [
      {
        number: "01",
        title: "Discovery",
        duration: "1–2 semanas",
        description:
          "Elegimos un proceso, definimos criterios de éxito medibles y el nivel de autonomía de cada acción.",
        deliverable: "Diseño del harness y alcance",
      },
      {
        number: "02",
        title: "Integración y construcción",
        duration: "4–7 semanas",
        description: "Herramientas con permisos mínimos, agente, verificador y conjunto de evals.",
        deliverable: "Agente en staging con evals",
      },
      {
        number: "03",
        title: "Piloto controlado",
        duration: "2–4 semanas",
        description:
          "Producción con alcance limitado, aprobación humana y observabilidad completa.",
        deliverable: "Agente en producción y tablero",
      },
      {
        number: "04",
        title: "Operación continua",
        duration: "Continuo",
        description: "AgentOps: monitoreo, drift, costos y nuevas capacidades.",
        deliverable: "Reporte periódico de calidad y costos",
      },
    ],
    caseStudy: {
      sector: "Medios digitales",
      result: "Partnership tecnológico de más de 10 años",
      metric: "Millones de visitas mensuales",
      service: "Desarrollo Digital",
    },
    faqTitle: "Preguntas frecuentes sobre agentes e IA aplicada",
    faqs: [
      {
        question: "¿Qué construye Nivelics en inteligencia artificial?",
        answer:
          "Agentes de IA a la medida que operan procesos reales, la integración de tus sistemas vía APIs y MCP, despliegues de IA privada en tu infraestructura o en tu nube, y la operación continua de agentes (AgentOps). También agentes comerciales, automatización de procesos, gestión de contenido y marketing con IA.",
      },
      {
        question: "¿Por dónde empezamos?",
        answer:
          "Por un proceso concreto. En el discovery definimos criterios de éxito medibles, los sistemas involucrados y qué acciones puede ejecutar el agente solo y cuáles requieren aprobación. De ahí sale un piloto controlado en producción.",
      },
      {
        question: "¿Nuestros datos se usan para entrenar modelos?",
        answer:
          "No con la arquitectura que diseñamos. Podemos procesar tus datos en tu nube (Amazon Bedrock o Azure OpenAI, con despliegues regionales y sin que el proveedor los use para entrenar) o en tu propia infraestructura con modelos de pesos abiertos.",
      },
      {
        question: "¿Qué pasa si el agente se equivoca?",
        answer:
          "Diseñamos para que el error sea detectable y contenido: verificador independiente, evals antes de cada cambio, aprobación humana en acciones irreversibles y trazabilidad de cada acción. Cada error en producción se vuelve un caso de prueba.",
      },
      {
        question: "¿La IA reemplaza a mi equipo?",
        answer:
          "Diseñamos agentes para que absorban el trabajo repetitivo y de alto volumen, y para que las decisiones importantes sigan en manos de las personas.",
      },
    ],
    contactTitle: "¿Qué proceso quieres poner en manos de un agente?",
    contactSubtitle: "Cuéntanos el caso y te proponemos cómo llevarlo a producción.",
  },
  en: {
    seoTitle: "Production-ready AI agent development for enterprises",
    seoDescription:
      "We design, integrate and run AI agents in production: MCP integration, private AI, evals, guardrails and AgentOps. Without changing your systems.",
    badge: "Applied Artificial Intelligence",
    h1: "AI agents that run",
    h1Accent: "real processes",
    subtitle:
      "Not chatbots. Agents that plug into your systems, work with bounded permissions and leave a trail for every decision.",
    description:
      "We design, integrate and run AI agents in production: with independent verification, guardrails, observability and the option to run on your own infrastructure.",
    bullets: [
      "A 7-layer method (the harness) in every agent",
      "Integration with your systems through APIs and MCP",
      "On your cloud or on your own infrastructure",
    ],
    panelTitle: "Where to start?",
    principles: [
      "Every action with side effects is traced and auditable",
      "No critical action without verification or human approval",
      "Custom evals before going to production",
      "Your data is processed where you decide",
    ],
    subServicesTitle: "Specialized solutions",
    logosTitle: "Companies that trust Nivelics",
    stackTitle: "The stack we work with",
    stack: [
      {
        name: "Models",
        items: ["Claude (Anthropic)", "Amazon Bedrock", "Azure OpenAI", "Llama · Qwen · Mistral"],
      },
      { name: "Orchestration", items: ["LangGraph", "Vercel AI SDK", "n8n"] },
      { name: "Integration", items: ["MCP", "REST", "GraphQL", "Queues and events"] },
      { name: "RAG and vectors", items: ["pgvector", "Pinecone", "Weaviate"] },
      {
        name: "Observability and evals",
        items: ["OpenTelemetry", "Langfuse", "LangSmith", "Grafana"],
      },
      { name: "Private AI", items: ["vLLM", "Ollama", "Kubernetes"] },
    ],
    securityLink: {
      lead: "Security audits for AI agents:",
      text: "instruction injection, data leakage and abuse of connected tools: an attack surface traditional pentests do not cover.",
      link: { label: "See Cybersecurity and Ethical Hacking →", href: ETHICAL_HACKING.en },
    },
    processTitle: "How we take an agent to production (indicative timelines)",
    process: [
      {
        number: "01",
        title: "Discovery",
        duration: "1–2 weeks",
        description:
          "We pick one process, define measurable success criteria and the autonomy level of each action.",
        deliverable: "Harness design and scope",
      },
      {
        number: "02",
        title: "Integration and build",
        duration: "4–7 weeks",
        description: "Least-privilege tools, agent, verifier and eval suite.",
        deliverable: "Agent in staging with evals",
      },
      {
        number: "03",
        title: "Controlled pilot",
        duration: "2–4 weeks",
        description: "Production with limited scope, human approval and full observability.",
        deliverable: "Agent in production and dashboard",
      },
      {
        number: "04",
        title: "Ongoing operation",
        duration: "Ongoing",
        description: "AgentOps: monitoring, drift, costs and new capabilities.",
        deliverable: "Periodic quality and cost report",
      },
    ],
    caseStudy: {
      sector: "Digital media",
      result: "A technology partnership of more than 10 years",
      metric: "Millions of monthly visits",
      service: "Digital Development",
    },
    faqTitle: "Frequently asked questions about agents and applied AI",
    faqs: [
      {
        question: "What does Nivelics build in artificial intelligence?",
        answer:
          "Custom AI agents that run real processes, integration of your systems through APIs and MCP, private AI deployments on your infrastructure or cloud, and ongoing agent operations (AgentOps). Also sales agents, process automation, content management and AI-powered marketing.",
      },
      {
        question: "Where do we start?",
        answer:
          "With one concrete process. In discovery we define measurable success criteria, the systems involved, and which actions the agent can run on its own and which need approval. That leads to a controlled pilot in production.",
      },
      {
        question: "Is our data used to train models?",
        answer:
          "Not with the architecture we design. We can process your data in your cloud (Amazon Bedrock or Azure OpenAI, with regional deployments and without the provider using it for training) or on your own infrastructure with open-weight models.",
      },
      {
        question: "What happens if the agent makes a mistake?",
        answer:
          "We design so errors are detectable and contained: an independent verifier, evals before every change, human approval for irreversible actions and per-action traceability. Every production error becomes a test case.",
      },
      {
        question: "Will AI replace my team?",
        answer:
          "We design agents to absorb repetitive, high-volume work and to keep important decisions in people's hands.",
      },
    ],
    contactTitle: "Which process would you hand to an agent?",
    contactSubtitle: "Tell us about the case and we will propose how to take it to production.",
  },
};
