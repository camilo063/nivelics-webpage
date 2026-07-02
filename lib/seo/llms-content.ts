import { getAllProductos, getAllProductosLlms, type ProductoLlmsRow } from "@/lib/cms/productos";
import type { Producto } from "@/lib/db/schema/admin";

export const BASE = "https://www.nivelics.com";

async function safeGetProductos(): Promise<Producto[]> {
  try {
    const data = await getAllProductos();
    return data ?? [];
  } catch {
    return [];
  }
}

async function safeGetProductosLlms(): Promise<ProductoLlmsRow[]> {
  try {
    const data = await getAllProductosLlms();
    return data ?? [];
  } catch {
    return [];
  }
}

export async function buildLlmsTxt(primary: "es" | "en"): Promise<string> {
  const productos = await safeGetProductosLlms();

  if (primary === "en") {
    return buildEn(productos);
  }
  return buildEs(productos);
}

function buildEs(productos: ProductoLlmsRow[]): string {
  const today = new Date().toISOString().split("T")[0];
  const productosLines = productos.length
    ? productos
        .map(
          (p) =>
            `- [${p.name}](${BASE}/productos/${p.slugEs}) — ${p.taglineEs}` +
            (p.pricingLabelEs ? ` · ${p.pricingLabelEs}` : ""),
        )
        .join("\n")
    : "- [PAYWL](https://www.nivelics.com/productos/paywl) — Motor de paywall LATAM\n- [Niveleads](https://www.nivelics.com/productos/niveleads) — Lead scoring B2B con IA\n- [Hirely](https://www.nivelics.com/productos/hirely) — Reclutamiento inteligente con IA";

  return `# Nivelics

> Language: es
> Alternate: ${BASE}/en/llms.txt
> Full version: ${BASE}/llms-full.txt
> Last updated: ${today}

> Empresa colombiana de transformación digital B2B fundada en 2012. IA aplicada, Cloud con gobierno real (AWS, GCP, Azure, FinOps) y Staff Augmentation premium. Sede en Bogotá y Miami. Opera en 7+ países de LATAM y USA.

Nivelics diseña, construye y opera software para empresas B2B que necesitan resultados medibles. Tres líneas integradas: **Inteligencia Artificial**, **Cloud / FinOps** y **Staff Augmentation premium**. Además, operamos 3 productos SaaS propios disponibles para clientes externos.

## Quick Facts

- Fundación: 2012 (13+ años de experiencia)
- Sedes: Bogotá (Colombia) y Miami (FL, USA)
- Operación: proyectos activos en 7+ países (CO, US, MX, SV, PA, EC, PE, AR)
- Equipo: 50+ ingenieros especializados · 200+ proyectos entregados · 98% retención de clientes
- Líneas de servicio: IA aplicada, Cloud & FinOps, Staff Augmentation, Desarrollo Digital
- Productos SaaS propios: PAYWL, Niveleads, Hirely
- Reconocimiento: Great Place to Work Colombia 2022
- Hiring: vacantes tech activas en ${BASE}/trabaja-con-nosotros

## Servicios

- [IA aplicada](${BASE}/servicios/inteligencia-artificial): agentes autónomos, automatización, RAG
- [Cloud & FinOps](${BASE}/servicios/cloud): migración, infraestructura, FinOps, seguridad, serverless
- [Staff Augmentation](${BASE}/servicios/staff-augmentation): talento tech bilingüe integrado en 5 días
- [Desarrollo Digital](${BASE}/servicios/desarrollo-digital): web agentic, apps móviles, e-commerce, plataformas

## Productos SaaS propios

${productosLines}

## Pricing

### Productos SaaS (precio fijo, suscripción mensual)
- **PAYWL**: desde $450 USD/mes (plan Business) hasta $1,900 USD/mes (Enterprise). Piloto gratuito de 90 días para medios elegibles. URL: /productos/paywl
- **Niveleads**: desde $99 USD/mes (plan Starter, hasta 500 leads) hasta $249 USD/mes (plan Growth, leads ilimitados). Plan Enterprise a medida. URL: /productos/niveleads
- **Hirely**: acceso anticipado gratuito (demo). Pricing por definir en lanzamiento oficial. URL: /productos/hirely

### Servicios (pricing a medida, basado en scope y equipo)
- **Staff Augmentation**: tarifas por perfil/hora según seniority y especialidad. Perfiles desde $25 USD/h (Junior) hasta $85 USD/h (Principal/Architect). Sin comisión de éxito.
- **Inteligencia Artificial / Agentes**: fee de implementación inicial + MRR de mantenimiento/operación. Diagnóstico inicial sin costo.
- **Cloud / FinOps**: fee fijo de discovery + success fee basado en ahorros generados (típicamente 20-30% del ahorro del primer año).
- **Desarrollo Digital**: proyectos desde $15,000 USD. Sprints semanales con entregables medibles.

### Cómo iniciar
Diagnóstico gratuito de 30 minutos. Sin RFP, sin presentaciones largas. URL: /contacto

## Industrias

- [Fintech](${BASE}/industrias/fintech)
- [Medios y Entretenimiento](${BASE}/industrias/medios-entretenimiento)
- [Salud](${BASE}/industrias/salud)
- [Retail / E-commerce](${BASE}/industrias/retail-ecommerce)
- [Logística](${BASE}/industrias/logistica)
- [Manufactura](${BASE}/industrias/manufactura)

## Casos de Éxito

- [Televisa](${BASE}/casos-de-exito/televisa)
- [Grupo Bolívar](${BASE}/casos-de-exito/grupo-bolivar)
- [Two Maids](${BASE}/casos-de-exito/two-maids)
- [AB InBev](${BASE}/casos-de-exito/ab-inbev)
- [Crónica](${BASE}/casos-de-exito/cronica)
- [Pulzo](${BASE}/casos-de-exito/pulzo)
- [Univisión](${BASE}/casos-de-exito/univision)

## Empresa

- [Sobre Nivelics](${BASE}/nosotros)
- [Metodología](${BASE}/nosotros/metodologia)
- [Equipo](${BASE}/nosotros/equipo)
- [Certificaciones](${BASE}/nosotros/certificaciones)
- [Trabaja con nosotros](${BASE}/trabaja-con-nosotros)

## Contacto

- [Contactar](${BASE}/contacto)
- [Soporte](${BASE}/soporte)
- Email: hola@nivelics.com
- Sedes: Bogotá (Colombia) · Miami (USA)

## Alternate language

- [English version](${BASE}/en/llms.txt) — Same content in English
- [English full content](${BASE}/en/llms-full.txt)

## Further reading

- [Sitemap](${BASE}/sitemap.xml)
- [Full content (ES + EN)](${BASE}/llms-full.txt)
- [Blog](${BASE}/blog)
`;
}

function buildEn(productos: ProductoLlmsRow[]): string {
  const today = new Date().toISOString().split("T")[0];
  const productosLines = productos.length
    ? productos
        .map(
          (p) =>
            `- [${p.name}](${BASE}/en/products/${p.slugEn}) — ${p.taglineEn}` +
            (p.pricingLabelEn ? ` · ${p.pricingLabelEn}` : ""),
        )
        .join("\n")
    : "- [PAYWL](https://www.nivelics.com/en/products/paywl) — Paywall engine for LATAM media\n- [Niveleads](https://www.nivelics.com/en/products/niveleads) — B2B lead scoring with AI\n- [Hirely](https://www.nivelics.com/en/products/hirely) — Intelligent recruitment with AI";

  return `# Nivelics

> Language: en
> Alternate: ${BASE}/llms.txt
> Full version: ${BASE}/en/llms-full.txt
> Last updated: ${today}

> Colombian B2B digital transformation company founded in 2012. Applied AI, real-governance Cloud (AWS, GCP, Azure, FinOps) and premium Staff Augmentation. Offices in Bogotá and Miami. Active projects in 7+ countries across LATAM and USA.

Nivelics designs, builds and operates software for B2B companies that need measurable results. Three integrated service lines: **Applied AI**, **Cloud / FinOps** and **Premium Staff Augmentation**. We also operate 3 proprietary SaaS products available for external customers.

## Quick Facts

- Founded: 2012 (13+ years of experience)
- Offices: Bogotá (Colombia) and Miami (FL, USA)
- Operations: active projects in 7+ countries (CO, US, MX, SV, PA, EC, PE, AR)
- Team: 50+ specialized engineers · 200+ delivered projects · 98% client retention
- Service lines: Applied AI, Cloud & FinOps, Staff Augmentation, Digital Development
- Proprietary SaaS products: PAYWL, Niveleads, Hirely
- Recognition: Great Place to Work Colombia 2022
- Hiring: open tech roles at ${BASE}/en/careers

## Services

- [Applied AI](${BASE}/en/services/artificial-intelligence): autonomous agents, automation, RAG
- [Cloud & FinOps](${BASE}/en/services/cloud): migration, infrastructure, FinOps, security, serverless
- [Staff Augmentation](${BASE}/en/services/staff-augmentation): bilingual tech talent integrated in 5 days
- [Digital Development](${BASE}/en/services/digital-development): agentic web, mobile apps, e-commerce, platforms

## Proprietary SaaS products

${productosLines}

## Pricing

### SaaS Products (fixed price, monthly subscription)
- **PAYWL**: from $450 USD/month (Business plan) to $1,900 USD/month (Enterprise). Free 90-day pilot for eligible media. URL: /en/products/paywl
- **Niveleads**: from $99 USD/month (Starter, up to 500 leads) to $249 USD/month (Growth, unlimited leads). Enterprise plan custom pricing. URL: /en/products/niveleads
- **Hirely**: free early access (demo). Pricing TBD at official launch. URL: /en/products/hirely

### Services (custom pricing, scope and team based)
- **Staff Augmentation**: per profile/hour rates by seniority. Profiles from $25 USD/h (Junior) to $85 USD/h (Principal/Architect). No success fee.
- **Artificial Intelligence / Agents**: initial implementation fee + MRR for maintenance/operations. Free initial diagnostic.
- **Cloud / FinOps**: fixed discovery fee + success fee based on savings generated (typically 20-30% of first-year savings).
- **Digital Development**: projects from $15,000 USD. Weekly sprints with measurable deliverables.

### How to start
Free 30-minute diagnostic. No RFP, no decks. URL: /en/contact

## Industries

- [Fintech](${BASE}/en/industries/fintech)
- [Media & Entertainment](${BASE}/en/industries/media-entertainment)
- [Healthcare](${BASE}/en/industries/healthcare)
- [Retail / E-commerce](${BASE}/en/industries/retail-ecommerce)
- [Logistics](${BASE}/en/industries/logistics)
- [Manufacturing](${BASE}/en/industries/manufacturing)

## Success stories

- [Televisa](${BASE}/en/success-stories/televisa)
- [Grupo Bolívar](${BASE}/en/success-stories/grupo-bolivar)
- [Two Maids](${BASE}/en/success-stories/two-maids)
- [AB InBev](${BASE}/en/success-stories/ab-inbev)
- [Crónica](${BASE}/en/success-stories/cronica)
- [Pulzo](${BASE}/en/success-stories/pulzo)
- [Univision](${BASE}/en/success-stories/univision)

## Company

- [About Nivelics](${BASE}/en/about)
- [Methodology](${BASE}/en/about/methodology)
- [Team](${BASE}/en/about/team)
- [Certifications](${BASE}/en/about/certifications)
- [Careers](${BASE}/en/careers)

## Contact

- [Contact](${BASE}/en/contact)
- [Support](${BASE}/en/support)
- Email: hola@nivelics.com
- Offices: Bogotá (Colombia) · Miami (USA)

## Alternate language

- [Versión en español](${BASE}/llms.txt) — Same content in Spanish
- [Full content in Spanish](${BASE}/llms-full.txt)

## Further reading

- [Sitemap](${BASE}/sitemap.xml)
- [Full content (ES + EN)](${BASE}/en/llms-full.txt)
- [Blog](${BASE}/en/blog)
`;
}

/**
 * llms-full.txt — contenido completo del sitio, bilingüe por entidad.
 */
export async function buildLlmsFullTxt(primary: "es" | "en"): Promise<string> {
  const productos = await safeGetProductos();
  const today = new Date().toISOString().split("T")[0];

  const header =
    primary === "en"
      ? `# Nivelics — Full content

> Language: en
> Alternate: ${BASE}/llms-full.txt
> Concise version: ${BASE}/en/llms.txt
> Last updated: ${today}

> Detailed content for every service, product, industry and case study.
> Each entry is bilingual: Spanish (canonical) + English alternate.

- Site: https://www.nivelics.com
- Primary language: Spanish (ES)
- Alternate language: English (EN)
- Sitemap: https://www.nivelics.com/sitemap.xml
- Concise index: https://www.nivelics.com/en/llms.txt

---
`
      : `# Nivelics — Contenido completo

> Language: es
> Alternate: ${BASE}/en/llms-full.txt
> Concise version: ${BASE}/llms.txt
> Last updated: ${today}

> Contenido detallado de cada servicio, producto, industria y caso de éxito.
> Cada entrada es bilingüe: Español (canónico) + Inglés (alternativo).

- Sitio: https://www.nivelics.com
- Idioma principal: Español (ES)
- Idioma alternativo: Inglés (EN)
- Sitemap: https://www.nivelics.com/sitemap.xml
- Índice conciso: https://www.nivelics.com/llms.txt

---
`;

  const productosSection =
    productos.length === 0
      ? ""
      : `
# ${primary === "en" ? "Proprietary SaaS products" : "Productos SaaS propios"}

${productos.map((p) => renderProductoFull(p)).join("\n---\n\n")}
`;

  const casosSection = primary === "en" ? renderCasosEn() : renderCasosEs();

  return `${header}${productosSection}${casosSection}`;
}

function renderCasosEs(): string {
  return `
# Casos de Éxito

### Televisa / N+
- **Industria**: Medios y Entretenimiento
- **País**: México
- **Reto**: Crear desde cero una plataforma de streaming capaz de soportar millones de usuarios concurrentes para el lanzamiento de N+.
- **Solución implementada**: Desarrollo Digital + Cloud (AWS). Arquitectura serverless, CDN, transcodificación en tiempo real y apps multi-plataforma.
- **Resultado**: Plataforma N+ lanzada con millones de usuarios activos en su primer año. Infraestructura escalable a nivel continental.
- **URL**: /casos-de-exito/televisa

### Grupo Bolívar
- **Industria**: Fintech / Seguros
- **País**: Colombia
- **Reto**: Transformar los canales digitales de un grupo financiero tradicional para competir con neobancos y fintechs.
- **Solución implementada**: Desarrollo Digital + Cloud + IA. Nuevos productos digitales, migración a cloud y automatización de procesos con IA.
- **Resultado**: 3 productos digitales lanzados al mercado. Reducción significativa en tiempo de entrega de nuevas funcionalidades.
- **URL**: /casos-de-exito/grupo-bolivar

### Two Maids
- **Industria**: Servicios / Home Services
- **País**: USA
- **Reto**: Escalar el equipo técnico rápidamente sin los costos de contratación local en Estados Unidos.
- **Solución implementada**: Staff Augmentation. Perfiles bilingües senior integrados al equipo existente en menos de 10 días.
- **Resultado**: 40% de ahorro vs. contratación local en USA. Equipo técnico escalado sin interrupciones operativas.
- **URL**: /casos-de-exito/two-maids

### AB InBev (Bavaria)
- **Industria**: CPG / Manufactura
- **País**: El Salvador
- **Reto**: Digitalizar la operación de distribuidores en múltiples países de Centroamérica con una plataforma unificada.
- **Solución implementada**: Desarrollo Digital. Plataforma web y móvil para gestión de distribuidores, pedidos y logística.
- **Resultado**: Operación digitalizada en múltiples países. Visibilidad en tiempo real de la cadena de distribución.
- **URL**: /casos-de-exito/ab-inbev

### Crónica
- **Industria**: Medios Digitales
- **País**: Colombia
- **Reto**: Construir una plataforma de noticias de alto tráfico con infraestructura escalable y costos controlados.
- **Solución implementada**: Cloud + Desarrollo Digital. Arquitectura serverless en AWS, CDN optimizado y CMS headless.
- **Resultado**: Infraestructura cloud escalable que soporta picos de tráfico sin degradación de rendimiento.
- **URL**: /casos-de-exito/cronica

### Pulzo
- **Industria**: Medios Digitales
- **País**: Colombia
- **Reto**: Sostener y escalar uno de los portales de noticias más visitados de Colombia con alta disponibilidad y rendimiento.
- **Solución implementada**: Desarrollo Digital + Cloud. Migración a arquitectura moderna, optimización de rendimiento y escalabilidad.
- **Resultado**: Portal líder en Colombia con millones de visitas mensuales. Infraestructura que escala automáticamente en picos de noticias.
- **URL**: /casos-de-exito/pulzo

### Univision
- **Industria**: Medios / Broadcasting
- **País**: USA
- **Reto**: Desarrollar plataformas digitales de contenido para la audiencia hispana más grande de Estados Unidos.
- **Solución implementada**: Desarrollo Digital. Plataformas de contenido digital, integración con sistemas de broadcasting y experiencia multi-dispositivo.
- **Resultado**: Plataformas digitales que sirven a la audiencia hispana líder en USA. Integración completa con el ecosistema de broadcasting.
- **URL**: /casos-de-exito/univision
`;
}

function renderCasosEn(): string {
  return `
# Success Stories

### Televisa / N+
- **Industry**: Media & Entertainment
- **Country**: Mexico
- **Challenge**: Build a streaming platform from scratch capable of supporting millions of concurrent users for the N+ launch.
- **Solution**: Digital Development + Cloud (AWS). Serverless architecture, CDN, real-time transcoding and multi-platform apps.
- **Result**: N+ platform launched with millions of active users in its first year. Continental-scale infrastructure.
- **URL**: /en/success-stories/televisa

### Grupo Bolívar
- **Industry**: Fintech / Insurance
- **Country**: Colombia
- **Challenge**: Transform digital channels of a traditional financial group to compete with neobanks and fintechs.
- **Solution**: Digital Development + Cloud + AI. New digital products, cloud migration and AI-powered process automation.
- **Result**: 3 digital products launched to market. Significant reduction in feature delivery time.
- **URL**: /en/success-stories/grupo-bolivar

### Two Maids
- **Industry**: Services / Home Services
- **Country**: USA
- **Challenge**: Rapidly scale the technical team without US-based hiring costs.
- **Solution**: Staff Augmentation. Bilingual senior profiles integrated into the existing team in under 10 days.
- **Result**: 40% savings vs. local US hiring. Technical team scaled without operational disruption.
- **URL**: /en/success-stories/two-maids

### AB InBev (Bavaria)
- **Industry**: CPG / Manufacturing
- **Country**: El Salvador
- **Challenge**: Digitize distributor operations across multiple Central American countries with a unified platform.
- **Solution**: Digital Development. Web and mobile platform for distributor management, ordering and logistics.
- **Result**: Digitized operations across multiple countries. Real-time visibility into the distribution chain.
- **URL**: /en/success-stories/ab-inbev

### Crónica
- **Industry**: Digital Media
- **Country**: Colombia
- **Challenge**: Build a high-traffic news platform with scalable infrastructure and controlled costs.
- **Solution**: Cloud + Digital Development. Serverless architecture on AWS, optimized CDN and headless CMS.
- **Result**: Scalable cloud infrastructure that handles traffic spikes without performance degradation.
- **URL**: /en/success-stories/cronica

### Pulzo
- **Industry**: Digital Media
- **Country**: Colombia
- **Challenge**: Sustain and scale one of Colombia's most visited news portals with high availability and performance.
- **Solution**: Digital Development + Cloud. Migration to modern architecture, performance optimization and scalability.
- **Result**: Leading portal in Colombia with millions of monthly visits. Infrastructure that auto-scales during news spikes.
- **URL**: /en/success-stories/pulzo

### Univision
- **Industry**: Media / Broadcasting
- **Country**: USA
- **Challenge**: Develop digital content platforms for the largest Hispanic audience in the United States.
- **Solution**: Digital Development. Digital content platforms, broadcasting system integration and multi-device experience.
- **Result**: Digital platforms serving the leading Hispanic audience in the USA. Full integration with the broadcasting ecosystem.
- **URL**: /en/success-stories/univision
`;
}

function renderProductoFull(p: Producto): string {
  const features = p.features ?? [];
  const faqs = p.faqs ?? [];

  const featuresEs = features.map((f) => `- **${f.titleEs}**: ${f.descriptionEs}`).join("\n");
  const featuresEn = features.map((f) => `- **${f.titleEn}**: ${f.descriptionEn}`).join("\n");
  const faqsEs = faqs.map((f) => `**Q: ${f.questionEs}**\nA: ${f.answerEs}`).join("\n\n");
  const faqsEn = faqs.map((f) => `**Q: ${f.questionEn}**\nA: ${f.answerEn}`).join("\n\n");

  return `## ${p.name}

- Category: ${p.categoryEs} · ${p.categoryEn}
- External URL: ${p.externalUrl}
- ES page: ${BASE}/productos/${p.slugEs}
- EN page: ${BASE}/en/products/${p.slugEn}
- Pricing: ${p.pricingLabelEs ?? "—"} (${p.pricingLabelEn ?? "—"})

### Español

**Tagline**: ${p.taglineEs}

**Descripción**: ${p.descriptionEs}

**Perfil de cliente ideal (ICP)**: ${p.icpEs}

${features.length ? `**Capacidades**:\n${featuresEs}\n` : ""}
${faqs.length ? `**FAQs**:\n\n${faqsEs}\n` : ""}
### English

**Tagline**: ${p.taglineEn}

**Description**: ${p.descriptionEn}

**Ideal customer profile (ICP)**: ${p.icpEn}

${features.length ? `**Capabilities**:\n${featuresEn}\n` : ""}
${faqs.length ? `**FAQs**:\n\n${faqsEn}\n` : ""}`;
}
