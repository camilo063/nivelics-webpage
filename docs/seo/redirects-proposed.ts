/**
 * Proposed legacy → new-site 301/308 redirects.
 *
 * Generated 2026-04-17T16:14:51.342Z by scripts/generate-redirects-proposed.ts
 * from GSC export docs/seo/legacy-urls-gsc-2026-04-12.csv + DB blog query.
 *
 * Rule count:   58
 *  - high confidence:   51
 *  - medium confidence: 5
 *  - low confidence:    2
 *
 * Do NOT merge into next.config.ts without running
 * `node --env-file=.env.local --import tsx scripts/verify-redirects.ts` first.
 */

export type LegacyRedirect = {
  source: string;
  destination: string;
  permanent: true;
  /** Human-readable hint. Strip before feeding to Next.js. */
  note?: string;
  /** Audit metadata. Strip before feeding to Next.js. */
  confidence: "high" | "medium" | "low";
};

export const LEGACY_REDIRECTS: LegacyRedirect[] = [
  {
    source: "/quienes-somos",
    destination: "/nosotros",
    permanent: true,
    confidence: "high",
  },
  {
    source: "/linea-del-tiempo",
    destination: "/nosotros/historia",
    permanent: true,
    confidence: "high",
  },
  {
    source: "/como-trabajamos",
    destination: "/nosotros/metodologia",
    permanent: true,
    confidence: "high",
  },
  {
    source: "/en/about-us",
    destination: "/en/about",
    permanent: true,
    confidence: "high",
  },
  {
    source: "/en/how-do-we-work",
    destination: "/en/about/methodology",
    permanent: true,
    confidence: "high",
  },
  {
    source: "/en/timeline",
    destination: "/en/about/history",
    permanent: true,
    confidence: "high",
  },
  {
    source: "/en/contact-us-at",
    destination: "/en/contact",
    permanent: true,
    confidence: "high",
  },
  {
    source: "/en/blogs",
    destination: "/en/blog",
    permanent: true,
    confidence: "high",
  },
  {
    source: "/en/success-stories/:slug(nivelics-and-grupo-bolivar)",
    destination: "/en/success-stories/grupo-bolivar",
    permanent: true,
    confidence: "high",
  },
  {
    source: "/en/success-stories/:slug(nivelics-and-televisa)",
    destination: "/en/success-stories/televisa",
    permanent: true,
    confidence: "high",
  },
  {
    source: "/servicios/:slug(ia-aplicada-a-negocios)",
    destination: "/servicios/inteligencia-artificial",
    permanent: true,
    confidence: "high",
  },
  {
    source: "/servicios/:slug(mejora-cadena-valor-inteligencia-artificial)",
    destination: "/servicios/inteligencia-artificial/automatizacion-procesos",
    permanent: true,
    confidence: "high",
  },
  {
    source: "/servicios/:slug(revoluciona-marketing-inteligencia-artificial)",
    destination: "/servicios/inteligencia-artificial/marketing-crm",
    permanent: true,
    confidence: "high",
  },
  {
    source: "/servicios/:slug(revoluciona-ventas-agentes-comerciales-inteligentes)",
    destination: "/servicios/inteligencia-artificial/agentes-comerciales",
    permanent: true,
    confidence: "high",
  },
  {
    source: "/servicios/:slug(gestion-de-contenido-con-ia-optimiza-tiempo-y-alcanza-mas-audiencia)",
    destination: "/servicios/inteligencia-artificial/gestion-contenido",
    permanent: true,
    confidence: "high",
  },
  {
    source: "/servicios/:slug(agentes)",
    destination: "/servicios/inteligencia-artificial",
    permanent: true,
    confidence: "high",
  },
  {
    source: "/servicios/:slug(servicios-cloud|servicios-cloud-nivelics)",
    destination: "/servicios/cloud",
    permanent: true,
    confidence: "high",
  },
  {
    source:
      "/servicios/:slug(administracion-de-infraestructura|arquitectura-e-implementacion-de-infraestructura|orquestacion-de-contenedores-en-kubernetes-k8-s)",
    destination: "/servicios/cloud/infraestructura",
    permanent: true,
    confidence: "high",
  },
  {
    source: "/servicios/:slug(implementacion-de-plataformas-en-la-nube)",
    destination: "/servicios/cloud/migracion-aws",
    permanent: true,
    confidence: "high",
  },
  {
    source: "/servicios/:slug(soluciones-serverless)",
    destination: "/servicios/cloud/serverless",
    permanent: true,
    confidence: "high",
  },
  {
    source:
      "/servicios/:slug(seguridad-informatica|pruebas-de-penetracion|remediacion-de-sitios-vulnerados)",
    destination: "/servicios/cloud/seguridad",
    permanent: true,
    confidence: "high",
  },
  {
    source:
      "/servicios/:slug(desarrollo-de-soluciones-digitales|desarrollo-de-soluciones-tecnologicas)",
    destination: "/servicios/desarrollo-digital",
    permanent: true,
    confidence: "high",
  },
  {
    source:
      "/servicios/:slug(desarrollo-de-aplicaciones-android|desarrollo-de-aplicaciones-hibridas|desarrollo-de-aplicaciones-moviles|desarrollo-de-i-os-app)",
    destination: "/servicios/desarrollo-digital/apps-moviles",
    permanent: true,
    confidence: "high",
  },
  {
    source:
      "/servicios/:slug(desarrollo-web|desarrollo-web-a-la-medida|desarrollo-de-portales-de-informacion|desarrollo-de-aplicaciones-web-pwa)",
    destination: "/servicios/desarrollo-digital/plataformas-web",
    permanent: true,
    confidence: "high",
  },
  {
    source:
      "/servicios/:slug(e-commerce|implementacion-de-tiendas-sobre-shopify|implementacion-online-con-woocommerce)",
    destination: "/servicios/desarrollo-digital/ecommerce",
    permanent: true,
    confidence: "high",
  },
  {
    source: "/servicios/:slug(auditorias-seo|estrategia-seo)",
    destination: "/servicios/desarrollo-digital/sitios-web-agentic",
    permanent: true,
    confidence: "medium",
  },
  {
    source: "/servicios/:slug(staff-argumentation)",
    destination: "/servicios/staff-augmentation",
    permanent: true,
    confidence: "high",
  },
  {
    source: "/servicios/:slug(devops|implementacion-agil-ci-cd)",
    destination: "/servicios/staff-augmentation/devops-cloud",
    permanent: true,
    confidence: "high",
  },
  {
    source:
      "/servicios/:slug(diseno-ux-ui|diseno-de-producto|creacion-de-mockups-y-prototipado|descubrimiento-e-investigacion)",
    destination: "/servicios/staff-augmentation/diseno-ux-ui",
    permanent: true,
    confidence: "high",
  },
  {
    source:
      "/servicios/:slug(quality-assurance|automatizacion-de-pruebas|pruebas-a-b|pruebas-funcionales|pruebas-no-funcionales|pruebas-heuristicas|pruebas-de-experiencia-de-usuario|pruebas-de-revision-de-codigo-estatico|inspeccion-de-codigo-y-pruebas-unitarias)",
    destination: "/servicios/staff-augmentation/qa-seguridad",
    permanent: true,
    confidence: "high",
  },
  {
    source: "/servicios/:slug(software-para-salud)",
    destination: "/industrias/salud",
    permanent: true,
    confidence: "high",
  },
  {
    source: "/en/services/:slug(ai-applied-to-business)",
    destination: "/en/services/artificial-intelligence",
    permanent: true,
    confidence: "high",
  },
  {
    source: "/en/services/:slug(cloud-services|cloud-services-nivelics)",
    destination: "/en/services/cloud",
    permanent: true,
    confidence: "high",
  },
  {
    source:
      "/en/services/:slug(infrastructure-architecture-and-implementation|infrastructure-management|kubernetes-container-orchestration)",
    destination: "/en/services/cloud/infrastructure",
    permanent: true,
    confidence: "high",
  },
  {
    source: "/en/services/:slug(cloud-platforms-implementation)",
    destination: "/en/services/cloud/aws-migration",
    permanent: true,
    confidence: "high",
  },
  {
    source: "/en/services/:slug(cibersecurity)",
    destination: "/en/services/cloud/security",
    permanent: true,
    confidence: "high",
  },
  {
    source: "/en/services/:slug(it-staffing)",
    destination: "/en/services/staff-augmentation",
    permanent: true,
    confidence: "high",
  },
  {
    source: "/en/services/:slug(devops|agile-implementation-ci-cd)",
    destination: "/en/services/staff-augmentation/devops-cloud",
    permanent: true,
    confidence: "high",
  },
  {
    source:
      "/en/services/:slug(ux-design|product-design|mockup-creation-and-prototyping|discovery-and-research)",
    destination: "/en/services/staff-augmentation/ux-ui-design",
    permanent: true,
    confidence: "high",
  },
  {
    source:
      "/en/services/:slug(quality-assurance|a-b-testing|functional-testing|heuristic-testing|nonfunctional-tests|test-automation|static-code-review-testing|code-inspection-and-unit-testing|user-testing)",
    destination: "/en/services/staff-augmentation/qa-security",
    permanent: true,
    confidence: "high",
  },
  {
    source: "/en/services/:slug(digital-solutions-development|technological-solutions-development)",
    destination: "/en/services/digital-development",
    permanent: true,
    confidence: "high",
  },
  {
    source:
      "/en/services/:slug(android-app-development|hybrid-app-development|i-os-app-development)",
    destination: "/en/services/digital-development/mobile-apps",
    permanent: true,
    confidence: "high",
  },
  {
    source:
      "/en/services/:slug(web-development|tailored-web-development|development-of-information-portals|progressive-web-app-development)",
    destination: "/en/services/digital-development/web-platforms",
    permanent: true,
    confidence: "high",
  },
  {
    source: "/en/services/:slug(e-commerce|shopify-website|woocommerce-website)",
    destination: "/en/services/digital-development/ecommerce",
    permanent: true,
    confidence: "high",
  },
  {
    source: "/en/services/:slug(seo|seo-audits|seo-consulting)",
    destination: "/en/services/digital-development/agentic-web",
    permanent: true,
    confidence: "medium",
  },
  {
    source: "/en/services/:slug(healthcare-software)",
    destination: "/en/industries/healthcare",
    permanent: true,
    confidence: "high",
  },
  {
    source: "/en/services/:slug(media-solutions)",
    destination: "/en/industries/media-entertainment",
    permanent: true,
    confidence: "high",
  },
  {
    source: "/aws-services",
    destination: "/servicios/cloud",
    permanent: true,
    confidence: "high",
  },
  {
    source: "/es/soluciones/paginas-web{/}?",
    destination: "/servicios/desarrollo-digital/plataformas-web",
    permanent: true,
    confidence: "high",
  },
  {
    source: "/es/soluciones/seo{/}?",
    destination: "/servicios/desarrollo-digital/sitios-web-agentic",
    permanent: true,
    confidence: "medium",
  },
  {
    source: "/es/soluciones/staff-augmentation{/}?",
    destination: "/servicios/staff-augmentation",
    permanent: true,
    confidence: "high",
  },
  {
    source: "/es/soluciones/seguridad-informatica{/}?",
    destination: "/servicios/cloud/seguridad",
    permanent: true,
    confidence: "high",
  },
  {
    source: "/blog/politica-privacidad",
    destination: "/privacidad",
    permanent: true,
    confidence: "high",
  },
  {
    source: "/blog/staff-augmentation-vs-outsourcing-diferencias-y-beneficios",
    destination: "/blog/staff-augmentation-vs-outsourcing",
    permanent: true,
    confidence: "medium",
    note: "blog slug rename (fuzzy match)",
  },
  {
    source: "/blog/staff-augmentation-vs-outsourcing-en-colombia",
    destination: "/blog/staff-augmentation-vs-outsourcing",
    permanent: true,
    confidence: "high",
    note: "blog slug rename (fuzzy match)",
  },
  {
    source: "/en/blog/staff-augmentation-vs-outsourcing-differences-and-benefits",
    destination: "/en/blog/staff-augmentation-vs-outsourcing",
    permanent: true,
    confidence: "medium",
    note: "blog slug rename (fuzzy match)",
  },
  {
    source:
      "/blog/:slug(soporte-de-drupal-que-pasa-cuando-el-soporte-a-mi-version-termina|periodismo-movil-conoce-las-ventajas-que-aplica-en-tus-plataformas|como-hacer-una-estrategia-seo-para-tu-sitio-web|como-funciona-la-actualizacion-web|politica-privacidad|migracion-continua-navegando-los-desafios-y-beneficios-de-la-transicion-empresarial|la-inteligencia-artificial-de-la-mano-con-la-ciberseguridad-mayor-seguridad-en-tus-sitios-web|mejora-tu-ecommerce-aplicando-ux-design|la-nube-como-ahorrar-dinero-y-tiempo-en-tu-negocio|desarrollo-web-desacoplado-beneficios-sobre-el-diseno-web-tradicional-o-monolitico|beneficios-5g-y-conectividad-la-revolucion-de-la-comunicacion|que-es-una-evaluacion-heuristica-y-cuando-usarla|ejemplos-de-blogs-personales-y-temas-que-puedes-usar|estrategias-digitales-empresa-sostenible-competitiva-2024|optimizacion-costos-aws-estrategias-facturacion-eficiente|que-es-la-experiencia-inmersiva-y-cuales-son-sus-ventajas|tendencias-ux-ui-2025|nivelics-en-techla-media-preparandose-para-el-mercado-internacional|innovaciones-desarrollo-software-Nivelics|monitoreo-administracion-aws-infraestructura-rendimiento-seguridad|chatbot-con-ia-tips-para-utilizar-el-chat-y-sus-beneficios|inteligencia-artificial-para-potenciar-su-estrategia-de-marketing-digital|tecnologia-y-medio-ambiente|nivelics-en-pronetwork-agencia-dedicada-al-desarrollo-digital|vulnerabilidades-criticas-2024|estrategias-de-marketing-digital-y-redes-sociales-en-campanas-politicas|que-son-servicios-cloud|la-importancia-del-diseño-web-en-la-experiencia-de-usuario|que-es-la-busqueda-semantica-y-para-que-sirve|la-nube-la-clave-para-el-exito-empresarial-en-el-siglo-XXI|transformacion-digital-sostenible|beneficios-del-desarrollo-en-multiplataforma-optimiza-el-exito-en-tus-apps|staffing-it-latinoamericano-talento-y-especializacion-a-un-mejor-costo|gestion-eficiente-google-cloud-platform-console|almacenamiento-nube-aplicaciones-web|google-bard-conoce-las-principales-diferencias-con-chat-gpt|posicionamiento-seo-para-universidades-llega-al-top-de-los-motores-de-busqueda|revoluciona-estrategia-comercial-ia|ciberseguridad-como-hacer-una-auditoria-en-tu-sitio-nivelics|ux-design-para-medios-de-comunicacion-conoce-sus-beneficios|generacion-contenido-IA|monitoreo-proactivo-aws-sistemas-optimizados-seguros|como-influye-la-ia-en-la-ciberseguridad|por-que-invertir-en-una-tienda-virtual-o-ecommerce|que-es-agil-y-como-se-implementa-los-devops-en-la-reingenieria|react-o-angular-diferencias-y-beneficios-segun-tus-necesidades|la-importancia-de-hacer-seo-en-tu-sitio-web|estrategias-de-ciberseguridad-en-aws-protegiendo-tus-activos-digitales|desarrollo-de-aplicaciones-moviles-innovacion-y-tendencias-actuales|aws-que-es-y-como-aplicarla-a-tu-agencia-digital|staff-augmentation-de-la-mano-de-la-colaboracion-global|desarrollo-agil-desafios-y-beneficios-de-aplicarlos-a-tu-web|la-importancia-del-data-science-en-tu-sitio-web|contenido-generado-por-usuarios-potencia-el-seo-de-tu-sitio-web|optimizacion-aws-experiencia-cliente|beneficios-del-machine-learning|ia-orientado-a-la-automatizacion-de-procesos-transformando-la-eficiencia-empresarial|personalizacion-de-la-experiencia-del-usuario-una-clave-para-el-exito-de-tu-web|optimizacion-en-la-nube-estrategia-esencial-futuro-empresarial|innovacion-en-desarrollo-web-creando-sitios-de-alto-impacto|diferencia-entre-mockups-web-y-wireframes|seo-para-medios-de-comunicacion|desarrollo-seguro-construyendo-aplicaciones-robustas|busqueda-visual-gana-trafico-a-tu-sitio-web-posicionando-tus-imagenes|por-que-las-soluciones-tecnologicas-son-importantes-en-la-transformacion-y-evolucion-de-las-empresas-en-colombia|beneficios-de-los-servicios-en-la-nube-para-las-empresas|soluciones-tecnologicas-a-la-medida|inteligencia-artificial-beneficios-en-medios-de-comunicacion|realidad-virtual-y-aumentada-que-es-y-aplicarlo-a-mi-empresa|soluciones-escalables-en-la-nube-creciendo-con-tu-empresa|ia-generativa-en-colombia-nivelics|maximizando-la-eficiencia-con-staff-augmentation-una-guia-completa|beneficios-del-aprendizaje-profundo-descubriendo-un-nuevo-horizonte-de-la-inteligencia-artificial|impacto-inteligencia-artificial-empresas|descubre-los-beneficios-de-la-ia-generativa-para-consejos-directivos|super-apps-revolucion-aplicaciones|empleados-de-valor-como-identificarlos-y-fortalecer|como-la-ia-esta-revolucionando-la-toma-de-decisiones|principales-cambios-de-ga4-con-google-universal-analytics|claves-para-una-exitosa-migracion-it-estrategias-y-mejores-practicas|marketing-politico-una-ficha-clave-en-el-exito-de-su-campana|ciberseguridad-era-digital-proteger-empresa|busqueda-por-voz-que-es-y-como-lograr-aparecer-en-estos-resultados|mujeres-en-la-tecnologia-que-transforman-la-historia-y-el-mundo|agilizando-proyectos-it-con-celulas-de-trabajo-eficientes|transformando-educacion-aprendizaje-google-workspace|descubre-los-beneficios-de-la-automatizacion-end-to-end|implementacion-de-scrum-un-cambio-de-mentalidad-eficiente|drupal-10-vs-drupal-9-comparacion|diferencias-de-los-cms-wordpress-drupal-y-strapi-para-medios-de-comunicacion|staff-augmentation-vs-contratacion-tradicional-diferencia-y-efecto|tendencias-tecnologicas-empresas-2024|estrategias-seo-nivelics|great-place-to-work|mejores-practicas-ciberseguridad-empresas|que-es-una-landing-page-y-cuando-usarla|garantizar-exito-proyecto-software-garantia-calidad|revoluciona-tus-aplicaciones-moviles-con-el-poder-de-las-progressive-web-apps|desarrollo-apps-conectar-digital|nivelics-soluciones-digitales-a-la-medida|blog-personal-como-aplicar-ux-y-sus-beneficios|talent-acquisition-estrategico-claves-para-el-exito-empresarial|como-saber-si-tu-desarrollo-web-es-exitoso|contenido-seo-marketing-digital-nivelics|nivelics-en-la-7-em-expansion-en-america-latina-con-startup-mexico|tips-para-mejorar-ux-en-dispositivos-moviles|ia-generativa-creacion-contenido-empresas|la-importancia-del-diseno-web-en-la-experiencia-de-usuario|la-importancia-de-optimizar-nuestros-sitios-web|razones-elegir-staff-augmentation-nivelics|talento-it-a-la-medida-como-elegir-el-it-staffing-adecuado)",
    destination: "/blog",
    permanent: true,
    confidence: "low",
    note: "blog hub catch-all ES (111 unmigrated posts)",
  },
  {
    source:
      "/en/blog/:slug(automation-operational-efficiency|enhance-your-ecommerce-by-applying-ux-design|cms-differences-word-press-drupal-and-strapi-for-media|it-retraining-tech-adaptation|the-difference-between-web-mockups-and-wireframes|benefits-of-cloud-services-for-businesses|virtual-and-augmented-reality-what-it-is-and-how-to-apply-it-to-my-business|chatbots-vs-ai-agents-customer-service|how-is-fintech-changing-the-financial-industry|discover-the-benefits-of-generative-ai-for-executive-boards|staff-augmentation-hand-in-hand-with-global-collaboration|digital-strategies-sustainable-competitive-business-2024|maximizing-efficiency-with-staff-augmentation-a-complete-guide|what-is-heuristic-evaluation-and-when-to-use-it|mobile-application-development-innovation-and-current-trends|why-invest-in-an-online-store-or-ecommerce|how-to-know-if-your-web-development-is-successful|personalizing-the-user-experience-a-key-to-your-websites-success|keys-to-a-successful-it-migration-strategies-and-best-practices|benefits-of-deep-learning-uncovering-a-new-horizon-of-artificial-intelligence-2|decoupled-web-development-benefits-over-traditional-or-monolithic-web-design|secure-development-building-robust-apps|what-is-agile-and-how-are-devops-implemented-in-reengineering|artificial-intelligence-in-tandem-with-cybersecurity-enhanced-security-for-your-websites|main-changes-of-ga4-with-google-universal-analytics|security-testing-on-websites-discover-the-benefits-identify-vulnerabilities-and-protect-your-company-and-customers-information|benefits-of-multiplatform-development-optimizing-success-in-your-apps|valuable-employees-how-to-identify-and-strengthen-them|artificial-intelligence-benefits-in-media|ux-ui-trends-2025|artificial-intelligence-to-boost-your-digital-marketing-strategy|technology-and-environment|fintech-vs-traditional-banks-which-is-the-best-option|ai-chatbot-tips-for-using-chat-and-its-benefits|the-importance-of-data-science-for-your-website|drupal-10-vs-drupal-9-comparison|strategic-talent-acquisition-keys-to-business-success|revolutionize-sales-strategy-ai|5g-benefits-and-connectivity-the-revolution-of-communication|staff-augmentation-vs-traditional-hiring-difference-and-impact|benefits-of-machine-learning|discover-the-benefits-of-end-to-end-automation|digital-marketing-strategies-and-social-media-in-political-campaigns|seo-content-digital-marketing-nivelics|aws-what-it-is-and-how-to-apply-it-to-your-digital-agency|the-cloud-the-key-to-business-buccess-in-the-21st-century|mobile-journalism-understand-the-advantages-for-your-platforms|agile-development-challenges-and-benefits-of-applying-them-to-your-website|generative-ai-in-colombia-nivelics|what-is-software-test-automation|user-generated-content-boosts-your-websites-seo|ai-content-generation|what-is-immersive-experience-and-what-are-its-advantages|innovation-in-web-development-creating-high-impact-sites|personal-blog-examples-and-themes-you-can-use|efficient-management-google-cloud-platform-console|cloud-storage-web-applications|what-are-the-most-frequent-cyber-attacks-on-websites|ai-automation-business-processes|the-best-web-hosting-in-colombia|how-aI-is-revolutionizing-decision-making|what-is-devops|what-is-staff-augmentation-and-how-can-it-help-your-company|google-bard-understand-the-main-differences-with-chat-gpt|unit-testing-with-artificial-intelligence|what-are-cloud-services|top-tech-trends-businesses-2024|why-technology-solutions-are-important-in-the-transformation-and-evolution-of-companies-in-colombia|ia-driven-process-automation-transforming-business-efficiency|critical-vulnerabilities-2024|continuous-migration-navigating-the-challenges-and-benefits-of-business-transition|ux-design-for-media-know-its-benefits|revolutionize-your-mobile-applications-with-the-power-of-progressive-web-apps|devops-automation-tools|latin-american-it-staffing-talent-and-specialization-at-a-better-cost|women-in-technology-transforming-history-and-the-world|implementation-of-scrum-an-efficient-mindset-change-1|impact-artificial-intelligence-businesses|tailored-technological-solutions|react-or-angular-differences-and-benefits-according-to-your-needs|cybersecurity-digital-age-protect-business|the-importance-of-seo-on-your-website|voice-search-what-is-it-and-how-to-appear-in-these-results|nivelics-at-la-7-em-expansion-in-latin-america-with-startup-mexico|streamlining-it-projects-with-efficient-work-cells|proactive-monitoring-aws-optimized-secure|cybersecurity-for-e-commerce|aws-cost-optimization-efficient-billing|transforming-education-learning-google-workspace|generative-ai-content-creation-businesses|visual-search-gain-traffic-to-your-website-by-positioning-your-images|the-importance-of-web-design-in-user-experience| what-is-rpa-and-Its-benefits|nivelics-on-techla-media-preparing-for-the-international-market|cybersecurity-audits-protect-your-website-from-cyberthreats|tips-to-improve-ux-on-mobile-devices|ensure-success-software-project-quality-assurance|drupal-support-what-happens-when-support-for-my-version-ends|how-does-artificial-intelligence-influence-cybersecurity|privacy-policy|complete-guide-cloud-migration|the-cloud-how-to-save-money-and-time-in-your-business|political-marketing-a-key-piece-in-the-success-of-your-campaign|sustainable-digital-transformation|great-place-to-work|how-to-create-an-seo-strategy-for-your-website|reasons-choose-staff-augmentation-nivelics|innovations-software-development-Nivelics|automated-vs-manual-testing|super-apps-market-revolution|seo-positioning-for-universities-reach-the-top-of-search-engines)",
    destination: "/en/blog",
    permanent: true,
    confidence: "low",
    note: "blog hub catch-all EN (111 unmigrated posts)",
  },
];

/**
 * Shape for Next.js `redirects()` — strips audit-only fields.
 */
export function toNextRedirects(
  rules: LegacyRedirect[] = LEGACY_REDIRECTS,
): Array<{ source: string; destination: string; permanent: true }> {
  return rules.map(({ source, destination, permanent }) => ({
    source,
    destination,
    permanent,
  }));
}
