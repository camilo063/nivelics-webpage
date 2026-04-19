# Standard briefs (35) — Entrega 2b

**Formato:** cada brief ≈ 40–60 líneas. Suficiente para que Claude Code expanda a artículo de 1200–1500 palabras. Agrupados por cluster.

**Convenciones:**

- `MIGRATE_FULL` → reescribir manteniendo slug legacy
- `MIGRATE_NEW_SLUG` → crear con slug nuevo + redirect desde legacy
- `NEW` → contenido nuevo, sin slug legacy
- Extensión estándar: 1200–1500 palabras · 5–7 min lectura
- Todos incluyen FAQPage + BreadcrumbList + Article schema

---

# CLUSTER: Inteligencia Artificial (11 estándar)

## B1 — Chatbots IA para empresas: guía 2026

- **Tipo:** MIGRATE_NEW_SLUG
- **Slug ES:** `chatbots-ia-empresas-guia-2026`
- **Slug EN:** `enterprise-ai-chatbots-guide-2026`
- **Redirect desde:** `/blog/chatbot-con-ia-tips-para-utilizar-el-chat-y-sus-beneficios`
- **Categoría:** inteligencia-artificial
- **Query objetivo:** "chatbots IA empresa" · "chatbot inteligencia artificial"
- **Intención:** Informacional + comercial
- **Estructura:**
  - H2. Qué es un chatbot IA (y diferencia con chatbot tradicional rule-based)
  - H2. Los 4 tipos: FAQ, asistente, ventas, soporte técnico
  - H2. Tecnologías: LLM, RAG, fine-tuning
  - H2. Implementación típica en 4 semanas
  - H2. Costos 2026: setup + operación
  - H2. KPIs: CSAT, deflection rate, tiempo de respuesta
  - H2. Errores comunes
  - H2. FAQ
- **Puntos obligatorios:** mencionar Claude/GPT/Bedrock; diferenciar de agente IA (link a P1); caso de uso real B2B
- **CTA:** `/servicios/inteligencia-artificial/agentes-comerciales`
- **Links internos:** P1 pillar, `agentes-ia-casos-uso-empresa-b2b`, `chatbots-vs-agentes-ia-atencion-cliente`

## B2 — Chatbots vs agentes IA: cuál necesita tu empresa

- **Tipo:** MIGRATE_FULL
- **Slug ES:** `chatbots-vs-agentes-ia-atencion-cliente`
- **Slug EN:** `chatbots-vs-ai-agents-customer-service`
- **Categoría:** inteligencia-artificial
- **Query objetivo:** "chatbot vs agente IA" · "diferencia chatbot agente"
- **Intención:** Evaluativa
- **Estructura:**
  - H2. Definiciones precisas de cada uno
  - H2. Tabla comparativa: capacidades, autonomía, costo, tiempo implementación
  - H2. Cuándo usar chatbot (5 escenarios)
  - H2. Cuándo usar agente IA (5 escenarios)
  - H2. El modelo híbrido
  - H2. Cómo migrar de chatbot a agente
  - H2. FAQ
- **Puntos obligatorios:** tabla comparativa ejecutiva; caso de uso por escenario
- **CTA:** `/servicios/inteligencia-artificial/agentes-comerciales`
- **Links internos:** P1 pillar, B1

## B3 — Generación de contenido con IA en empresas B2B

- **Tipo:** MIGRATE_NEW_SLUG
- **Slug ES:** `generacion-contenido-ia-b2b`
- **Slug EN:** `ai-content-generation-b2b`
- **Redirect desde:** `/blog/generacion-contenido-IA`, `/blog/ia-generativa-creacion-contenido-empresas`
- **Categoría:** inteligencia-artificial
- **Query objetivo:** "generación contenido IA empresa" · "IA generativa marketing"
- **Intención:** Informacional + comercial
- **Estructura:**
  - H2. Qué tipos de contenido B2B generan bien los LLMs
  - H2. Qué NO generan bien (y por qué humano es necesario)
  - H2. Stack típico: LLM + templates + gobierno editorial
  - H2. Workflow: brief → draft → review → publish
  - H2. Casos: medios, marketing, sales enablement
  - H2. Riesgos: alucinaciones, SEO de Google, marca
  - H2. ROI y productividad
  - H2. FAQ
- **Puntos obligatorios:** ser honesto sobre límites; mencionar que este brief fue IA-asistido
- **CTA:** `/servicios/inteligencia-artificial/gestion-contenido`
- **Links internos:** `machine-learning-casos-uso-empresas`, P1 pillar

## B4 — IA para automatización de procesos de negocio

- **Tipo:** MIGRATE_FULL
- **Slug ES:** `ia-automatizacion-procesos-de-negocio`
- **Slug EN:** `ai-business-process-automation`
- **Categoría:** inteligencia-artificial
- **Query objetivo:** "automatización procesos IA" · "BPA inteligencia artificial"
- **Intención:** Comercial
- **Estructura:**
  - H2. Qué procesos son candidatos a automatización IA
  - H2. Framework de evaluación: volumen × complejidad × variabilidad
  - H2. IA vs RPA: cuándo cada uno, cuándo combinados
  - H2. Top 5 procesos automatizables en B2B LATAM
  - H2. Stack: RPA + LLM + orquestación (n8n, Temporal)
  - H2. Implementación típica y KPIs
  - H2. FAQ
- **Puntos obligatorios:** diferenciar RPA tradicional vs RPA + IA; mencionar n8n (tu stack favorito)
- **CTA:** `/servicios/inteligencia-artificial/automatizacion-procesos`
- **Links internos:** P1 pillar, B8 (`que-es-rpa-y-sus-beneficios`)

## B5 — IA generativa para C-Level: guía para CEOs y CFOs

- **Tipo:** MIGRATE_NEW_SLUG
- **Slug ES:** `ia-generativa-c-level-guia`
- **Slug EN:** `generative-ai-c-level-guide`
- **Redirect desde:** `/blog/descubre-los-beneficios-de-la-ia-generativa-para-consejos-directivos`, `/blog/como-la-ia-esta-revolucionando-la-toma-de-decisiones`
- **Categoría:** inteligencia-artificial
- **Query objetivo:** "IA generativa CEO" · "IA para directivos"
- **Intención:** Evaluativa C-level
- **Estructura:**
  - H2. IA generativa en 2026: qué sí es y qué no es
  - H2. Los 5 usos concretos para decisiones directivas
  - H2. Cómo C-level debe evaluar proyectos IA (criterios, no detalle técnico)
  - H2. Riesgos de governance: datos, sesgo, responsabilidad
  - H2. Cuánto debe invertir una empresa mid-market en IA
  - H2. Tablero ejecutivo: KPIs de adopción IA
  - H2. FAQ
- **Puntos obligatorios:** tono ejecutivo, cero jerga técnica; incluir checklist de 7 preguntas para el C-suite
- **CTA:** `/servicios/inteligencia-artificial` (hub) + `/contacto?source=c-level`
- **Links internos:** P1 pillar, B7

## B6 — Impacto real de la IA en empresas LATAM 2026

- **Tipo:** MIGRATE_NEW_SLUG
- **Slug ES:** `impacto-ia-empresas-latam-2026`
- **Slug EN:** `ai-impact-latam-enterprises-2026`
- **Redirect desde:** `/blog/impacto-inteligencia-artificial-empresas`
- **Categoría:** inteligencia-artificial
- **Query objetivo:** "impacto IA empresas LATAM" · "adopción IA América Latina"
- **Intención:** Informacional
- **Estructura:**
  - H2. Estado de adopción IA en LATAM 2026 (cifras)
  - H2. Sectores líderes: financiero, retail, telco, medios
  - H2. Brecha LATAM vs USA/Europa
  - H2. Casos concretos por industria
  - H2. Barreras de adopción específicas: talento, inversión, regulación
  - H2. Oportunidades 2026–2028
  - H2. FAQ
- **Datos a VERIFICAR:** Gartner LATAM 2025, IDC Latin America AI, Statista LATAM
- **CTA:** `/servicios/inteligencia-artificial` + `/industrias/*`
- **Links internos:** industrias pages, P1, B5

## B7 — Machine Learning: casos de uso reales en empresas

- **Tipo:** MIGRATE_NEW_SLUG
- **Slug ES:** `machine-learning-casos-uso-empresas`
- **Slug EN:** `machine-learning-enterprise-use-cases`
- **Redirect desde:** `/blog/beneficios-del-machine-learning`, `/blog/beneficios-del-aprendizaje-profundo-...`
- **Categoría:** inteligencia-artificial
- **Query objetivo:** "machine learning empresas" · "casos uso ML"
- **Intención:** Informacional
- **Estructura:**
  - H2. Qué es ML vs IA vs Deep Learning (aclaración común)
  - H2. 10 casos de uso validados en empresa (con KPI):
    1. Churn prediction, 2. Demand forecasting, 3. Fraud detection, 4. Pricing dinámico, 5. Recomendación, 6. Segmentación clientes, 7. Predictive maintenance, 8. Credit scoring, 9. Análisis de sentimiento, 10. Computer vision
  - H2. Cuándo ML es la herramienta correcta (y cuándo no lo es)
  - H2. Stack: Python, scikit-learn, Vertex AI, Bedrock, MLflow
  - H2. Roadmap implementación típica
  - H2. FAQ
- **CTA:** `/servicios/staff-augmentation/datos-ia`
- **Links internos:** P1, B6

## B8 — Qué es RPA y cuándo usarlo (vs IA)

- **Tipo:** MIGRATE_FULL
- **Slug ES:** `que-es-rpa-y-sus-beneficios`
- **Slug EN:** `what-is-rpa-benefits`
- **Categoría:** inteligencia-artificial
- **Query objetivo:** "qué es RPA" · "RPA beneficios"
- **Intención:** Informacional
- **Estructura:**
  - H2. RPA definido sin jerga
  - H2. RPA tradicional vs RPA + IA (intelligent automation)
  - H2. 7 procesos típicos para RPA
  - H2. Herramientas líderes: UiPath, Automation Anywhere, Microsoft Power Automate, n8n
  - H2. Costos y ROI
  - H2. Señales de que RPA NO es la solución (y mejor agente IA)
  - H2. FAQ
- **CTA:** `/servicios/inteligencia-artificial/automatizacion-procesos`
- **Links internos:** B4, P1

## B9 — Automatización y eficiencia operativa en empresas B2B

- **Tipo:** MIGRATE_FULL
- **Slug ES:** `automatizacion-eficiencia-operativa`
- **Slug EN:** `automation-operational-efficiency`
- **Categoría:** inteligencia-artificial
- **Query objetivo:** "automatización eficiencia empresa" · "automatizar procesos negocio"
- **Intención:** Comercial
- **Estructura:**
  - H2. La ecuación: costo manual vs costo automatización
  - H2. Framework: volumen, repetitividad, criticidad, variabilidad
  - H2. 5 niveles de automatización: scripts → RPA → RPA+IA → agentes → autonomía total
  - H2. Cómo medir el impacto: FTE saved, ciclo, error rate
  - H2. Implementación por olas (no big bang)
  - H2. Caso ilustrativo
  - H2. FAQ
- **CTA:** `/servicios/inteligencia-artificial/automatizacion-procesos`
- **Links internos:** B4, B8, P1

## B10 — IA aplicada a la ciberseguridad

- **Tipo:** MIGRATE_NEW_SLUG
- **Slug ES:** `ia-ciberseguridad-aplicaciones-empresa`
- **Slug EN:** `ai-cybersecurity-enterprise-applications`
- **Redirect desde:** `/blog/como-influye-la-ia-en-la-ciberseguridad`, `/blog/la-inteligencia-artificial-de-la-mano-con-la-ciberseguridad-...`
- **Categoría:** inteligencia-artificial (cross-link ciberseguridad)
- **Query objetivo:** "IA ciberseguridad empresa" · "inteligencia artificial seguridad"
- **Intención:** Informacional técnica
- **Estructura:**
  - H2. IA como vector de ataque: deepfakes, phishing LLM-generado
  - H2. IA como vector de defensa: detección anomalías, SIEM con ML
  - H2. Herramientas enterprise: Darktrace, Vectra, Microsoft Defender XDR
  - H2. AWS GuardDuty y análogos nativos cloud
  - H2. Roadmap integración IA en SOC
  - H2. Limitaciones actuales (2026)
  - H2. FAQ
- **CTA:** `/servicios/cloud/seguridad`
- **Links internos:** P4 pillar ciber, B30

## B11 — Pruebas unitarias con IA: cómo y cuándo usarlas

- **Tipo:** MIGRATE_FULL
- **Slug ES:** `pruebas-unitarias-con-inteligencia-artificial`
- **Slug EN:** `ai-powered-unit-testing`
- **Categoría:** inteligencia-artificial (cross-link QA)
- **Query objetivo:** "pruebas unitarias IA" · "testing con inteligencia artificial"
- **Intención:** Técnica/dev
- **Estructura:**
  - H2. Qué cambia la IA en el testing
  - H2. Herramientas: GitHub Copilot, Cursor, Codium AI, Diffblue
  - H2. Cómo se integra con CI/CD
  - H2. Métricas: coverage, defect escape rate
  - H2. Limitaciones y anti-patrones
  - H2. Cuándo vale la pena (y cuándo no)
  - H2. FAQ
- **CTA:** `/servicios/staff-augmentation/qa-seguridad`
- **Links internos:** B34, B35

## B12 — Data Science en tu empresa: guía de implementación

- **Tipo:** MIGRATE_NEW_SLUG
- **Slug ES:** `data-science-b2b-guia-implementacion`
- **Slug EN:** `data-science-b2b-implementation-guide`
- **Redirect desde:** `/blog/la-importancia-del-data-science-en-tu-sitio-web`
- **Categoría:** inteligencia-artificial
- **Query objetivo:** "data science empresa" · "implementar data science"
- **Intención:** Evaluativa
- **Estructura:**
  - H2. Data Science ≠ BI ≠ ML: jerarquía clara
  - H2. Los 4 roles típicos: data engineer, analyst, scientist, ML engineer
  - H2. Cómo armar un equipo mínimo viable (y cuándo tercerizar)
  - H2. Stack: data lake, warehouse, BI, ML platform
  - H2. 5 señales de que tu empresa está lista (y 3 que no)
  - H2. ROI y casos de valor
  - H2. FAQ
- **CTA:** `/servicios/staff-augmentation/datos-ia`
- **Links internos:** B7, P1

---

# CLUSTER: Cloud (7 estándar)

## B13 — Migración a AWS: guía empresarial paso a paso

- **Tipo:** MIGRATE_NEW_SLUG
- **Slug ES:** `aws-guia-empresarial-migracion`
- **Slug EN:** `aws-enterprise-migration-guide`
- **Redirect desde:** `/blog/aws-que-es-y-como-aplicarla-a-tu-agencia-digital`
- **Categoría:** cloud
- **Query objetivo:** "migración AWS empresa" · "cómo migrar a AWS"
- **Estructura:**
  - H2. AWS vs competencia (breve, link a B14)
  - H2. Arquitectura recomendada por tamaño de empresa
  - H2. Landing Zone y cuentas AWS Organization
  - H2. IAM e identidades: la base de todo
  - H2. Servicios core para arrancar: EC2, RDS, S3, CloudFront, VPC
  - H2. Costos: pricing model y pitfalls
  - H2. Cuándo usar Control Tower
  - H2. FAQ
- **CTA:** `/servicios/cloud/migracion-aws`
- **Links internos:** P2 pillar, B14, B16

## B14 — GCP vs AWS: cuál elegir para tu empresa

- **Tipo:** MIGRATE_FULL
- **Slug ES:** `gcp-vs-aws`
- **Slug EN:** `gcp-vs-aws`
- **Categoría:** cloud
- **Query objetivo:** "GCP vs AWS" · "Google Cloud vs Amazon"
- **Estructura:**
  - H2. Matriz comparativa: 15 criterios
  - H2. Pricing: cómo comparar real (no list price)
  - H2. Servicios diferenciadores AWS
  - H2. Servicios diferenciadores GCP (BigQuery, Vertex AI)
  - H2. Ecosistema y talento disponible en LATAM
  - H2. Cuándo multi-cloud tiene sentido
  - H2. Decisión por caso de uso
  - H2. FAQ
- **CTA:** `/servicios/cloud`
- **Links internos:** P2, B13

## B15 — FinOps en AWS: cómo optimizar costos reales

- **Tipo:** MIGRATE_NEW_SLUG
- **Slug ES:** `finops-aws-optimizacion-costos`
- **Slug EN:** `finops-aws-cost-optimization`
- **Redirect desde:** `/blog/optimizacion-costos-aws-estrategias-facturacion-eficiente`, `/blog/optimizacion-aws-experiencia-cliente`, `/blog/optimizacion-en-la-nube-estrategia-esencial-futuro-empresarial`, `/blog/la-nube-como-ahorrar-dinero-y-tiempo-en-tu-negocio`
- **Categoría:** cloud
- **Query objetivo:** "FinOps AWS" · "optimizar costos AWS"
- **Estructura:**
  - H2. Qué es FinOps (FinOps Foundation framework)
  - H2. Las 3 fases: inform, optimize, operate
  - H2. Quick wins: Reserved Instances, Savings Plans, Spot, Right-sizing
  - H2. Herramientas nativas: Cost Explorer, Budgets, CUR
  - H2. Tags y allocation: la base para todo lo demás
  - H2. KPIs FinOps: unit economics, waste ratio
  - H2. Cuándo contratar consultoría FinOps
  - H2. FAQ
- **Puntos obligatorios:** mencionar el servicio Nivelics explícitamente; datos reales de ahorros
- **CTA:** `/servicios/cloud/finops`
- **Links internos:** P2, B13

## B16 — Monitoreo y observabilidad en AWS

- **Tipo:** MIGRATE_NEW_SLUG
- **Slug ES:** `monitoreo-aws-observabilidad-guia`
- **Slug EN:** `aws-monitoring-observability-guide`
- **Redirect desde:** `/blog/monitoreo-administracion-aws-infraestructura-rendimiento-seguridad`, `/blog/monitoreo-proactivo-aws-sistemas-optimizados-seguros`
- **Categoría:** cloud
- **Query objetivo:** "monitoreo AWS" · "observabilidad AWS CloudWatch"
- **Estructura:**
  - H2. Monitoreo vs observabilidad: diferencia
  - H2. Los 3 pilares: logs, métricas, traces
  - H2. Stack nativo AWS: CloudWatch, X-Ray, CloudTrail
  - H2. Alternativas: Datadog, New Relic, Grafana+Prometheus
  - H2. Alertas que sí importan (y las que son ruido)
  - H2. SLI, SLO, error budget
  - H2. Costos de observabilidad: pitfalls
  - H2. FAQ
- **CTA:** `/servicios/cloud/infraestructura`
- **Links internos:** B13, B15

## B17 — Google Cloud Console: guía de gestión eficiente

- **Tipo:** MIGRATE_NEW_SLUG
- **Slug ES:** `gcp-console-gestion-eficiente`
- **Slug EN:** `gcp-console-efficient-management`
- **Redirect desde:** `/blog/gestion-eficiente-google-cloud-platform-console`
- **Categoría:** cloud
- **Query objetivo:** "GCP console" · "Google Cloud Platform gestión"
- **Estructura:**
  - H2. Navegación: proyectos, folders, organization
  - H2. IAM en GCP vs AWS (para quien viene de AWS)
  - H2. Servicios core: Compute, GKE, Cloud Run, BigQuery, Vertex AI
  - H2. Billing y budget alerts
  - H2. CLI (gcloud) vs Console: cuándo cada uno
  - H2. Seguridad: Security Command Center
  - H2. Tips productividad
  - H2. FAQ
- **CTA:** `/servicios/cloud`
- **Links internos:** B14

## B18 — Infrastructure as Code: automatización con Terraform

- **Tipo:** MIGRATE_FULL
- **Slug ES:** `automatizacion-de-infraestructura-optimizando-tu-entorno-tecnologico`
- **Slug EN:** `infrastructure-automation-optimizing-tech-environment`
- **Categoría:** cloud
- **Query objetivo:** "IaC Terraform" · "automatización infraestructura"
- **Estructura:**
  - H2. Qué es IaC y por qué ya no es opcional
  - H2. Terraform vs CloudFormation vs Pulumi
  - H2. Arquitectura: módulos, state, workspaces
  - H2. Pipeline CI/CD para infra
  - H2. Testing de infra (Terratest, OPA)
  - H2. Anti-patrones comunes
  - H2. FAQ
- **CTA:** `/servicios/cloud/infraestructura`
- **Links internos:** B13, B19

## B19 — Kubernetes vs Serverless: cuándo usar cada uno

- **Tipo:** NEW
- **Slug ES:** `kubernetes-vs-serverless-cuando-elegir`
- **Slug EN:** `kubernetes-vs-serverless-when-to-choose`
- **Categoría:** cloud
- **Query objetivo:** "kubernetes vs serverless" · "cuándo usar lambda kubernetes"
- **Intención:** Evaluativa técnica
- **Estructura:**
  - H2. Los dos paradigmas en 30 segundos
  - H2. Tabla de decisión: 10 criterios
  - H2. Cuándo Kubernetes gana (7 escenarios)
  - H2. Cuándo Serverless gana (7 escenarios)
  - H2. Arquitectura híbrida (la realidad en producción)
  - H2. Costo real: comparativo con números
  - H2. Talento disponible LATAM
  - H2. FAQ
- **CTA:** `/servicios/cloud/serverless` + `/servicios/cloud/infraestructura`
- **Links internos:** B13, B15, B18

---

# CLUSTER: Staff Augmentation (5 estándar)

## B20 — Staff Augmentation en LATAM: ventajas del nearshore

- **Tipo:** MIGRATE_NEW_SLUG
- **Slug ES:** `staff-augmentation-latam-ventajas-nearshore`
- **Slug EN:** `staff-augmentation-latam-nearshore-advantages`
- **Redirect desde:** `/blog/staffing-it-latinoamericano-talento-y-especializacion-a-un-mejor-costo`
- **Categoría:** staff-augmentation
- **Query objetivo:** "nearshore LATAM" · "staff augmentation Colombia"
- **Estructura:**
  - H2. Onshore, nearshore, offshore: definiciones
  - H2. LATAM vs India vs Filipinas: comparativa
  - H2. Ventajas time zone con USA y Canadá
  - H2. Calidad técnica: rankings, certificaciones
  - H2. Bilingüismo real
  - H2. Costos 2026: tabla por rol
  - H2. Países top: Colombia, México, Argentina, Brasil
  - H2. FAQ
- **CTA:** `/servicios/staff-augmentation`
- **Links internos:** P3 pillar, B21, B22

## B21 — Qué es Staff Augmentation y cómo ayuda a tu empresa

- **Tipo:** MIGRATE_FULL
- **Slug ES:** `que-es-staff-augmentation-y-como-puede-ayudarte-en-tu-compania`
- **Slug EN:** `what-is-staff-augmentation-benefits`
- **Categoría:** staff-augmentation
- **Query objetivo:** "qué es staff augmentation" · "staff augmentation definición"
- **Estructura:**
  - H2. Definición clara
  - H2. Cómo funciona el contrato y la relación
  - H2. 5 casos de uso típicos
  - H2. Cómo se diferencia de otras formas de contratación
  - H2. Qué exigir al proveedor (checklist)
  - H2. Señales de un buen fit
  - H2. FAQ
- **CTA:** `/servicios/staff-augmentation`
- **Links internos:** P3, B20, B22

## B22 — Cómo elegir un proveedor de Staff Augmentation

- **Tipo:** MIGRATE_NEW_SLUG
- **Slug ES:** `como-elegir-proveedor-staff-augmentation`
- **Slug EN:** `how-to-choose-staff-augmentation-provider`
- **Redirect desde:** `/blog/talento-it-a-la-medida-como-elegir-el-it-staffing-adecuado`
- **Categoría:** staff-augmentation
- **Query objetivo:** "elegir proveedor staff augmentation" · "cómo contratar staffing IT"
- **Estructura:**
  - H2. Los 8 criterios esenciales
  - H2. Preguntas de discovery al proveedor (15)
  - H2. Red flags (7)
  - H2. SLA y métricas a exigir
  - H2. Proceso de entrevista: qué pedirle al talento
  - H2. Contratación: cláusulas clave (IP, NDA, transición)
  - H2. FAQ
- **Puntos obligatorios:** incluir un comparativo breve marca blanca; posicionar Nivelics como premium (no commodity)
- **CTA:** `/contacto`
- **Links internos:** P3, B20, B21

## B23 — Reentrenamiento IT en nuevas tecnologías: por qué es inevitable

- **Tipo:** MIGRATE_FULL
- **Slug ES:** `reentrenamiento-it-nuevas-tecnologias`
- **Slug EN:** `it-reskilling-new-technologies`
- **Categoría:** staff-augmentation
- **Query objetivo:** "reentrenamiento IT" · "upskilling equipo IT"
- **Estructura:**
  - H2. La velocidad del cambio tech 2026
  - H2. Skills de mayor demanda (cloud, IA, ciber)
  - H2. Programas de upskilling que sí funcionan
  - H2. Build vs buy vs rent (upskilling interno vs contratar vs staff aug)
  - H2. Cómo medir efectividad del upskilling
  - H2. FAQ
- **CTA:** `/servicios/staff-augmentation`
- **Links internos:** B20, B24

## B24 — Staff Augmentation para proyectos de IA

- **Tipo:** NEW
- **Slug ES:** `staff-augmentation-para-proyectos-ia`
- **Slug EN:** `staff-augmentation-for-ai-projects`
- **Categoría:** staff-augmentation
- **Query objetivo:** "contratar ingeniero IA" · "staff augmentation machine learning"
- **Intención:** Comercial (cruza IA + Staff Aug)
- **Estructura:**
  - H2. Por qué IA es el cluster más difícil de contratar
  - H2. Roles IA típicos: ML engineer, data engineer, AI researcher, prompt engineer, MLOps
  - H2. Tarifas 2026 por rol (LATAM)
  - H2. Cómo evaluar técnicamente un candidato IA
  - H2. Modelos de engagement: full team vs individual vs coaching
  - H2. Cuándo staff aug es mejor que contratar in-house
  - H2. FAQ
- **CTA:** `/servicios/staff-augmentation/datos-ia`
- **Links internos:** P3, P1, B7

---

# CLUSTER: Ciberseguridad (4 estándar)

## B25 — Ciberataques más frecuentes en sitios web empresariales

- **Tipo:** MIGRATE_FULL
- **Slug ES:** `cuales-son-los-ciberataques-mas-frecuentes-en-los-sitios-web`
- **Slug EN:** `most-common-website-cyberattacks`
- **Categoría:** ciberseguridad
- **Query objetivo:** "ciberataques sitios web" · "tipos de ciberataques"
- **Estructura:**
  - H2. Top 10 ataques OWASP 2025
  - H2. Cada uno: cómo funciona, cómo detectar, cómo mitigar
  - H2. Ataques específicos a APIs
  - H2. Herramientas defensivas: WAF, RASP, rate limiting
  - H2. Respuesta a incidente de sitio web comprometido
  - H2. FAQ
- **CTA:** `/servicios/cloud/seguridad`
- **Links internos:** P4 pillar, B26, B28

## B26 — Ciberseguridad para ecommerce: guía específica

- **Tipo:** MIGRATE_FULL
- **Slug ES:** `ciberseguridad-para-ecommerce`
- **Slug EN:** `ecommerce-cybersecurity`
- **Categoría:** ciberseguridad
- **Query objetivo:** "ciberseguridad ecommerce" · "PCI DSS tienda online"
- **Estructura:**
  - H2. Amenazas específicas a ecommerce (carding, account takeover, magecart)
  - H2. PCI DSS: qué aplica y cómo cumplir
  - H2. Fraud prevention: stack técnico
  - H2. 3DS2, tokenization, encryption at rest
  - H2. Auditoría de seguridad ecommerce: checklist
  - H2. FAQ
- **CTA:** `/servicios/desarrollo-digital/ecommerce` + `/servicios/cloud/seguridad`
- **Links internos:** P4, B25

## B27 — Ciberseguridad en AWS: Well-Architected Security Pillar

- **Tipo:** MIGRATE_NEW_SLUG
- **Slug ES:** `ciberseguridad-aws-well-architected`
- **Slug EN:** `aws-well-architected-security-pillar`
- **Redirect desde:** `/blog/estrategias-de-ciberseguridad-en-aws-protegiendo-tus-activos-digitales`
- **Categoría:** ciberseguridad
- **Query objetivo:** "AWS Well-Architected security" · "ciberseguridad AWS"
- **Estructura:**
  - H2. El Security Pillar explicado
  - H2. Los 7 principios de diseño
  - H2. Shared Responsibility Model revisado
  - H2. IAM: principios de least privilege
  - H2. Detección: GuardDuty, Security Hub, Macie
  - H2. Respuesta: IR runbooks, backup, recovery
  - H2. Compliance: SOC 2, HIPAA, PCI en AWS
  - H2. FAQ
- **CTA:** `/servicios/cloud/seguridad`
- **Links internos:** P4, P2, B15, B25

## B28 — Pruebas de seguridad en sitios web: pentesting explicado

- **Tipo:** MIGRATE_FULL
- **Slug ES:** `pruebas-de-seguridad-en-los-sitios-web-descubre-los-beneficios`
- **Slug EN:** `web-security-testing-benefits`
- **Categoría:** ciberseguridad
- **Query objetivo:** "pentesting aplicaciones web" · "pruebas de penetración web"
- **Estructura:**
  - H2. Qué es pentesting vs vulnerability scanning
  - H2. Los 5 tipos: black/grey/white box, red team, bug bounty
  - H2. Metodologías: OWASP Testing Guide, PTES, NIST
  - H2. Cuándo y con qué frecuencia
  - H2. Herramientas: Burp Suite, OWASP ZAP, Metasploit
  - H2. Qué esperar del reporte
  - H2. FAQ
- **CTA:** `/servicios/cloud/seguridad`
- **Links internos:** P4, B25, B35

---

# CLUSTER: DevOps / QA (4 estándar)

## B29 — Qué es DevOps y cómo implementarlo

- **Tipo:** MIGRATE_FULL
- **Slug ES:** `que-es-devops`
- **Slug EN:** `what-is-devops`
- **Categoría:** desarrollo
- **Query objetivo:** "qué es DevOps" · "DevOps definición"
- **Estructura:**
  - H2. DevOps definido (no como moda, como práctica)
  - H2. Los 5 pilares (CAMS+L: Culture, Automation, Measurement, Sharing, Lean)
  - H2. CI/CD: qué es y no es
  - H2. Roles: SRE, DevOps engineer, Platform engineer
  - H2. KPIs DORA: lead time, deploy frequency, MTTR, change failure rate
  - H2. Roadmap implementación 6 meses
  - H2. FAQ
- **CTA:** `/servicios/staff-augmentation/devops-cloud`
- **Links internos:** B30

## B30 — Herramientas DevOps: stack recomendado 2026

- **Tipo:** MIGRATE_FULL
- **Slug ES:** `automatizacion-devops-herramientas`
- **Slug EN:** `devops-tools-stack-2026`
- **Categoría:** desarrollo
- **Query objetivo:** "herramientas DevOps" · "stack DevOps"
- **Estructura:**
  - H2. Control de versiones: GitHub/GitLab
  - H2. CI/CD: GitHub Actions, GitLab CI, Jenkins, CircleCI
  - H2. Containers: Docker, Podman
  - H2. Orquestación: Kubernetes, ECS, Nomad
  - H2. IaC: Terraform, Pulumi, CloudFormation
  - H2. Observabilidad: Datadog, Grafana, New Relic
  - H2. Security in pipeline: Snyk, Trivy, SonarQube
  - H2. FAQ
- **CTA:** `/servicios/staff-augmentation/devops-cloud`
- **Links internos:** B29, B18, B19

## B31 — Automatización de pruebas de software: guía práctica

- **Tipo:** MIGRATE_FULL
- **Slug ES:** `que-es-la-automatizacion-de-pruebas-de-software`
- **Slug EN:** `software-test-automation-guide`
- **Categoría:** desarrollo
- **Query objetivo:** "automatización pruebas software" · "test automation"
- **Estructura:**
  - H2. Qué automatizar y qué no
  - H2. Pirámide de testing (unit, integration, e2e)
  - H2. Frameworks por lenguaje
  - H2. Herramientas e2e: Playwright, Cypress, Selenium
  - H2. Performance testing: k6, JMeter
  - H2. ROI de automatización
  - H2. FAQ
- **CTA:** `/servicios/staff-augmentation/qa-seguridad`
- **Links internos:** B11, B32

## B32 — Testing automatizado vs manual: cuándo cada uno

- **Tipo:** MIGRATE_FULL
- **Slug ES:** `testing-automatizado-vs-manual`
- **Slug EN:** `automated-vs-manual-testing`
- **Categoría:** desarrollo
- **Query objetivo:** "testing automatizado vs manual" · "cuándo automatizar pruebas"
- **Estructura:**
  - H2. Tabla comparativa
  - H2. Cuándo testing manual es mejor (exploratorio, UX, usabilidad)
  - H2. Cuándo automatizado es obligatorio (regression, performance, API)
  - H2. El modelo híbrido (la realidad)
  - H2. Costos y ROI
  - H2. Skills del QA moderno
  - H2. FAQ
- **CTA:** `/servicios/staff-augmentation/qa-seguridad`
- **Links internos:** B31, B11

---

# CLUSTER: UX / Desarrollo (3 estándar)

## B33 — React vs Angular: guía de decisión 2026

- **Tipo:** MIGRATE_NEW_SLUG
- **Slug ES:** `react-vs-angular-decision-guia`
- **Slug EN:** `react-vs-angular-decision-guide`
- **Redirect desde:** `/blog/react-o-angular-diferencias-y-beneficios-segun-tus-necesidades`
- **Categoría:** desarrollo
- **Query objetivo:** "React vs Angular" · "cuál es mejor React o Angular"
- **Estructura:**
  - H2. Estado 2026 de ambos frameworks
  - H2. Tabla comparativa: 10 criterios
  - H2. Cuándo elegir React (7 escenarios)
  - H2. Cuándo elegir Angular (5 escenarios)
  - H2. Mención a Vue, Svelte, Solid (brevemente)
  - H2. Talento disponible LATAM
  - H2. Stack companion recomendado para cada uno
  - H2. FAQ
- **CTA:** `/servicios/staff-augmentation/desarrollo-software`
- **Links internos:** P5, B34

## B34 — Actualizar WordPress: core, plugins y seguridad

- **Tipo:** MIGRATE_FULL
- **Slug ES:** `actualizar-wordpress-core-plugins-seguridad`
- **Slug EN:** `updating-wordpress-core-plugins-security`
- **Categoría:** desarrollo
- **Query objetivo:** "actualizar WordPress" · "seguridad WordPress plugins"
- **Estructura:**
  - H2. Por qué actualizar no es opcional (riesgos)
  - H2. Workflow de actualización seguro (staging, backup, rollback)
  - H2. Plugins: cuáles sí, cuáles no, cómo evaluarlos
  - H2. Hardening WordPress: WAF, 2FA, hide login
  - H2. Hosting gestionado vs autogestionado
  - H2. Cuándo dejar WordPress (y migrar a headless)
  - H2. FAQ
- **CTA:** `/servicios/desarrollo-digital/plataformas-web`
- **Links internos:** P5, B28

## B35 — WCAG: accesibilidad web que suma usuarios

- **Tipo:** MIGRATE_FULL
- **Slug ES:** `wcag-que-es-y-como-sumar-mas-usuarios-en-tu-web`
- **Slug EN:** `wcag-accessibility-more-users`
- **Categoría:** desarrollo
- **Query objetivo:** "WCAG accesibilidad" · "accesibilidad web empresa"
- **Estructura:**
  - H2. WCAG 2.2 en 2026: qué cambió
  - H2. Los 4 principios POUR
  - H2. Niveles A, AA, AAA: cuál cumplir
  - H2. Cumplimiento legal por país (USA ADA, EU EAA, LATAM)
  - H2. Herramientas de audit: axe, WAVE, Lighthouse
  - H2. Impacto en SEO y conversión
  - H2. FAQ
- **CTA:** `/servicios/staff-augmentation/diseno-ux-ui`
- **Links internos:** P5, B33

---

# CLUSTER: Industrias / Fintech (2 estándar)

## B36 — Cómo las fintech están cambiando la industria financiera

- **Tipo:** MIGRATE_FULL
- **Slug ES:** `como-las-fintech-esta-cambiando-la-industria-financiera`
- **Slug EN:** `how-fintech-is-changing-financial-industry`
- **Categoría:** industrias
- **Query objetivo:** "fintech industria financiera" · "transformación financiera fintech"
- **Estructura:**
  - H2. Estado fintech LATAM 2026
  - H2. Verticales: pagos, crédito, wealth, insurtech, embedded finance
  - H2. Casos de disrupción: Nubank, Mercado Pago, Clip, Rappi Pay
  - H2. Cómo los bancos tradicionales están respondiendo
  - H2. Tecnología core: cloud, IA, open banking, blockchain (realista)
  - H2. Regulación LATAM: Ley Fintech México, sandboxes regionales
  - H2. Oportunidades 2026–2028
  - H2. FAQ
- **CTA:** `/industrias/fintech`
- **Links internos:** B37, P1

## B37 — Fintech vs bancos tradicionales: comparativa honesta

- **Tipo:** MIGRATE_FULL
- **Slug ES:** `fintech-vs-bancos-tradicionales-cual-es-la-mejor-opcion`
- **Slug EN:** `fintech-vs-traditional-banks-comparison`
- **Categoría:** industrias
- **Query objetivo:** "fintech vs banco tradicional" · "diferencia fintech banco"
- **Estructura:**
  - H2. Tabla comparativa: 12 dimensiones
  - H2. Cuándo fintech gana (5 casos)
  - H2. Cuándo banco tradicional gana (5 casos)
  - H2. El modelo coopetition (alianzas)
  - H2. Perspectiva del consumidor vs del SMB
  - H2. Seguridad comparada: mitos y realidades
  - H2. FAQ
- **CTA:** `/industrias/fintech`
- **Links internos:** B36

---

## Resumen ejecutivo de los 35 estándar

| Cluster            | Count  | Briefs              |
| ------------------ | ------ | ------------------- |
| IA                 | 12     | B1–B12              |
| Cloud              | 7      | B13–B19             |
| Staff Augmentation | 5      | B20–B24             |
| Ciberseguridad     | 4      | B25–B28             |
| DevOps/QA          | 4      | B29–B32             |
| UX/Desarrollo      | 3      | B33–B35             |
| Industrias Fintech | 2      | B36–B37             |
| **Total estándar** | **35** |                     |
| + Pillars (P1–P5)  | 5      | En archivo separado |
| **GRAN TOTAL**     | **40** |                     |

---

## Matriz de producción: qué hacer con cada brief

Cada brief del listado anterior es input directo para este prompt de Claude Code:

```
# Prompt para Claude Code — expansión de brief a artículo

Input: el brief completo de `content/briefs/b{N}-{slug}.md`
Output: `content/posts/es/{slug}.md` + `content/posts/en/{slug-en}.md`

Instrucciones:
1. Respeta la estructura H2/H3 del brief tal cual está.
2. Extensión ES: 1200–1500 palabras (estándar) o 2500–4000 (pillar). Idéntico para EN.
3. Cumple todos los "Puntos obligatorios".
4. Marca con [VERIFICAR: {tema}] cada dato/cifra de la sección "Datos a VERIFICAR".
5. Incluye los CTAs exactos y los links internos listados.
6. Genera el bloque JSON-LD completo para cada schema listado.
7. Tono Nivelics: directo, ejecutivo, sin "innovador/disruptivo/holístico".
8. En inglés: tono paralelo, orientado a USA tech buyer.
9. Al final del archivo añade metadata frontmatter con: title, slug,
   category, author, metaDescription, ogImage, canonicalUrl, hreflang links.
10. Guarda el artículo listo para pegar al CMS (Drizzle-friendly JSON o MD).

Output de Claude Code debe incluir:
- Artículo ES completo
- Artículo EN completo
- SQL insert para tabla blog_posts (2 rows, una por idioma) o alternativa
  como JSON para usar con el seed script.
```

---

## Roadmap de 4 semanas (2 posts/día hábil)

| Semana      | Días | Publicaciones                                           |
| ----------- | ---- | ------------------------------------------------------- |
| S1          | Lun  | P5 Agentic Web (pillar) + B36 Fintech                   |
|             | Mar  | B1 Chatbots IA + B29 DevOps                             |
|             | Mié  | B2 Chatbots vs Agentes + B30 Herramientas DevOps        |
|             | Jue  | B20 Nearshore LATAM + B33 React vs Angular              |
|             | Vie  | B21 Qué es Staff Aug + B34 WordPress                    |
| S2          | Lun  | P1 Agentes IA (pillar) + B37 Fintech vs Banco           |
|             | Mar  | B4 IA Automatización + B31 Test Automation              |
|             | Mié  | B8 RPA + B32 Automated vs Manual Testing                |
|             | Jue  | B24 Staff Aug para IA + B35 WCAG                        |
|             | Vie  | B22 Cómo elegir proveedor + B3 Contenido IA             |
| S3          | Lun  | P3 Staff Aug vs Outsourcing (pillar) + B25 Ciberataques |
|             | Mar  | B23 Reentrenamiento IT + B26 Ciberseguridad ecommerce   |
|             | Mié  | B5 IA C-level + B27 AWS Well-Architected                |
|             | Jue  | B7 Machine Learning + B28 Pentesting                    |
|             | Vie  | B6 Impacto IA LATAM + B10 IA Ciberseguridad             |
| S4          | Lun  | P2 Migración Cloud (pillar) + B13 AWS guía              |
|             | Mar  | B14 GCP vs AWS + B15 FinOps                             |
|             | Mié  | B16 Monitoreo AWS + B17 GCP Console                     |
|             | Jue  | B18 IaC + B19 Kubernetes vs Serverless                  |
|             | Vie  | P4 Ciberseguridad (pillar) + B11 Pruebas IA             |
| S5 (cierre) | Lun  | B9 Eficiencia operativa + B12 Data Science              |

Total: 42 publicaciones (40 artículos + 5 pillars cuentan como parte de los 40, queda margen).

---

**FIN Entrega 2b.**
