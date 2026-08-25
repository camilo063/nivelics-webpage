import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  locales: ["es", "en"],
  defaultLocale: "es",
  localePrefix: {
    mode: "as-needed",
  },
  localeDetection: false,
  pathnames: {
    "/": "/",
    "/servicios": { es: "/servicios", en: "/services" },
    "/servicios/inteligencia-artificial": {
      es: "/servicios/inteligencia-artificial",
      en: "/services/artificial-intelligence",
    },
    "/servicios/inteligencia-artificial/agentes-ia": {
      es: "/servicios/inteligencia-artificial/agentes-ia",
      en: "/services/artificial-intelligence/ai-agents",
    },
    "/servicios/inteligencia-artificial/agentes-comerciales": {
      es: "/servicios/inteligencia-artificial/agentes-comerciales",
      en: "/services/artificial-intelligence/sales-agents",
    },
    "/servicios/inteligencia-artificial/automatizacion-procesos": {
      es: "/servicios/inteligencia-artificial/automatizacion-procesos",
      en: "/services/artificial-intelligence/process-automation",
    },
    "/servicios/inteligencia-artificial/gestion-contenido": {
      es: "/servicios/inteligencia-artificial/gestion-contenido",
      en: "/services/artificial-intelligence/content-management",
    },
    "/servicios/inteligencia-artificial/marketing-crm": {
      es: "/servicios/inteligencia-artificial/marketing-crm",
      en: "/services/artificial-intelligence/marketing-crm",
    },
    "/servicios/cloud": { es: "/servicios/cloud", en: "/services/cloud" },
    "/servicios/cloud/finops": { es: "/servicios/cloud/finops", en: "/services/cloud/finops" },
    "/servicios/cloud/migracion-aws": {
      es: "/servicios/cloud/migracion-aws",
      en: "/services/cloud/aws-migration",
    },
    "/servicios/cloud/infraestructura": {
      es: "/servicios/cloud/infraestructura",
      en: "/services/cloud/infrastructure",
    },
    "/servicios/cloud/seguridad": {
      es: "/servicios/cloud/seguridad",
      en: "/services/cloud/security",
    },
    "/servicios/cloud/serverless": {
      es: "/servicios/cloud/serverless",
      en: "/services/cloud/serverless",
    },
    "/servicios/staff-augmentation": {
      es: "/servicios/staff-augmentation",
      en: "/services/staff-augmentation",
    },
    "/servicios/staff-augmentation/desarrollo-software": {
      es: "/servicios/staff-augmentation/desarrollo-software",
      en: "/services/staff-augmentation/software-development",
    },
    "/servicios/staff-augmentation/datos-ia": {
      es: "/servicios/staff-augmentation/datos-ia",
      en: "/services/staff-augmentation/data-ai",
    },
    "/servicios/staff-augmentation/devops-cloud": {
      es: "/servicios/staff-augmentation/devops-cloud",
      en: "/services/staff-augmentation/devops-cloud",
    },
    "/servicios/staff-augmentation/diseno-ux-ui": {
      es: "/servicios/staff-augmentation/diseno-ux-ui",
      en: "/services/staff-augmentation/ux-ui-design",
    },
    "/servicios/staff-augmentation/qa-seguridad": {
      es: "/servicios/staff-augmentation/qa-seguridad",
      en: "/services/staff-augmentation/qa-security",
    },
    "/servicios/desarrollo-digital": {
      es: "/servicios/desarrollo-digital",
      en: "/services/digital-development",
    },
    "/servicios/desarrollo-digital/apps-moviles": {
      es: "/servicios/desarrollo-digital/apps-moviles",
      en: "/services/digital-development/mobile-apps",
    },
    "/servicios/desarrollo-digital/ecommerce": {
      es: "/servicios/desarrollo-digital/ecommerce",
      en: "/services/digital-development/ecommerce",
    },
    "/servicios/desarrollo-digital/plataformas-web": {
      es: "/servicios/desarrollo-digital/plataformas-web",
      en: "/services/digital-development/web-platforms",
    },
    "/servicios/desarrollo-digital/sitios-web-agentic": {
      es: "/servicios/desarrollo-digital/sitios-web-agentic",
      en: "/services/digital-development/agentic-web",
    },
    "/industrias": { es: "/industrias", en: "/industries" },
    "/industrias/fintech": { es: "/industrias/fintech", en: "/industries/fintech" },
    "/industrias/medios-entretenimiento": {
      es: "/industrias/medios-entretenimiento",
      en: "/industries/media-entertainment",
    },
    "/industrias/salud": { es: "/industrias/salud", en: "/industries/healthcare" },
    "/industrias/retail-ecommerce": {
      es: "/industrias/retail-ecommerce",
      en: "/industries/retail-ecommerce",
    },
    "/industrias/logistica": { es: "/industrias/logistica", en: "/industries/logistics" },
    "/industrias/manufactura": { es: "/industrias/manufactura", en: "/industries/manufacturing" },
    "/industrias/medicion-de-audiencias": {
      es: "/industrias/medicion-de-audiencias",
      en: "/industries/audience-measurement",
    },
    "/industrias/investigacion-de-mercados": {
      es: "/industrias/investigacion-de-mercados",
      en: "/industries/market-research",
    },
    "/productos": { es: "/productos", en: "/products" },
    "/productos/[slug]": { es: "/productos/[slug]", en: "/products/[slug]" },
    "/nosotros": { es: "/nosotros", en: "/about" },
    "/nosotros/historia": { es: "/nosotros/historia", en: "/about/history" },
    "/nosotros/equipo": { es: "/nosotros/equipo", en: "/about/team" },
    "/nosotros/metodologia": { es: "/nosotros/metodologia", en: "/about/methodology" },
    "/nosotros/certificaciones": { es: "/nosotros/certificaciones", en: "/about/certifications" },
    "/casos-de-exito": { es: "/casos-de-exito", en: "/success-stories" },
    "/casos-de-exito/televisa": { es: "/casos-de-exito/televisa", en: "/success-stories/televisa" },
    "/casos-de-exito/grupo-bolivar": {
      es: "/casos-de-exito/grupo-bolivar",
      en: "/success-stories/grupo-bolivar",
    },
    "/casos-de-exito/two-maids": {
      es: "/casos-de-exito/two-maids",
      en: "/success-stories/two-maids",
    },
    "/casos-de-exito/ab-inbev": { es: "/casos-de-exito/ab-inbev", en: "/success-stories/ab-inbev" },
    "/casos-de-exito/cronica": { es: "/casos-de-exito/cronica", en: "/success-stories/cronica" },
    "/casos-de-exito/pulzo": { es: "/casos-de-exito/pulzo", en: "/success-stories/pulzo" },
    "/casos-de-exito/univision": {
      es: "/casos-de-exito/univision",
      en: "/success-stories/univision",
    },
    "/blog": { es: "/blog", en: "/blog" },
    "/precios": { es: "/precios", en: "/pricing" },
    "/contacto": { es: "/contacto", en: "/contact" },
    "/trabaja-con-nosotros": { es: "/trabaja-con-nosotros", en: "/careers" },
    "/privacidad": { es: "/privacidad", en: "/privacy" },
    "/soporte": { es: "/soporte", en: "/support" },
  },
});

export type Locale = (typeof routing.locales)[number];
export type Pathnames = keyof typeof routing.pathnames;
