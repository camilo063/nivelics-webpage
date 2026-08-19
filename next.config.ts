import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";
import { LEGACY_REDIRECTS } from "./lib/seo/legacy-redirects";

const withNextIntl = createNextIntlPlugin("./lib/i18n/request.ts");

const nextConfig: NextConfig = {
  compress: true,
  poweredByHeader: false,

  images: {
    formats: ["image/avif", "image/webp"],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    minimumCacheTTL: 31536000,
    remotePatterns: [
      {
        protocol: "https",
        hostname: `${process.env.AWS_S3_BUCKET || process.env.S3_BUCKET_NAME || "nivelics-media"}.s3.${process.env.AWS_REGION || "us-east-1"}.amazonaws.com`,
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: `${process.env.AWS_S3_BUCKET || process.env.S3_BUCKET_NAME || "nivelics-media"}.s3.amazonaws.com`,
        pathname: "/**",
      },
    ],
  },

  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "X-Frame-Options", value: "DENY" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=()",
          },
          {
            key: "Strict-Transport-Security",
            value: "max-age=63072000; includeSubDomains; preload",
          },
          {
            key: "Content-Security-Policy",
            value:
              // *.clarity.ms: GTM inyecta Microsoft Clarity — sin él, error CSP en consola en cada página
              "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://*.googletagmanager.com https://*.dapta.ai https://*.clarity.ms; script-src-elem 'self' 'unsafe-inline' https://*.googletagmanager.com https://*.dapta.ai https://*.clarity.ms; style-src 'self' 'unsafe-inline'; img-src 'self' data: https: https://*.google-analytics.com https://*.googletagmanager.com https://*.g.doubleclick.net; font-src 'self' data:; connect-src 'self' https: wss: https://*.google-analytics.com https://*.analytics.google.com https://*.googletagmanager.com https://*.g.doubleclick.net https://*.dapta.ai wss://*.dapta.ai https://*.clarity.ms; frame-src 'self' https://www.googletagmanager.com https://*.dapta.ai; frame-ancestors 'none';",
          },
        ],
      },
      {
        source: "/_next/static/(.*)",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
      {
        source: "/fonts/(.*)",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
    ];
  },

  async redirects() {
    return [
      { source: "/quienes-somos", destination: "/nosotros", permanent: true },
      { source: "/linea-del-tiempo", destination: "/nosotros/historia", permanent: true },
      { source: "/como-trabajamos", destination: "/nosotros/metodologia", permanent: true },
      {
        source: "/servicios/inteligencia-artificial/agentes",
        destination: "/servicios/inteligencia-artificial",
        permanent: true,
      },
      {
        source: "/servicios/ia-aplicada-a-negocios",
        destination: "/servicios/inteligencia-artificial",
        permanent: true,
      },
      {
        source: "/servicios/servicios-cloud-nivelics",
        destination: "/servicios/cloud",
        permanent: true,
      },
      { source: "/servicios/servicios-cloud", destination: "/servicios/cloud", permanent: true },
      {
        source: "/servicios/desarrollo-de-soluciones-digitales",
        destination: "/servicios/desarrollo-digital",
        permanent: true,
      },
      {
        source: "/servicios/desarrollo-de-soluciones-tecnologicas",
        destination: "/servicios/desarrollo-digital",
        permanent: true,
      },
      { source: "/aws-services", destination: "/servicios/cloud", permanent: true },
      {
        source: "/servicios/gestion-de-contenido-con-ia-optimiza-tiempo-y-alcanza-mas-audiencia",
        destination: "/servicios/inteligencia-artificial/gestion-contenido",
        permanent: true,
      },
      {
        source: "/servicios/revoluciona-ventas-agentes-comerciales-inteligentes",
        destination: "/servicios/inteligencia-artificial/agentes-comerciales",
        permanent: true,
      },
      {
        source: "/servicios/revoluciona-marketing-inteligencia-artificial",
        destination: "/servicios/inteligencia-artificial/marketing-crm",
        permanent: true,
      },
      {
        source: "/servicios/mejora-cadena-valor-inteligencia-artificial",
        destination: "/servicios/inteligencia-artificial/automatizacion-procesos",
        permanent: true,
      },
      {
        source: "/servicios/administracion-de-infraestructura",
        destination: "/servicios/cloud/infraestructura",
        permanent: true,
      },
      {
        source: "/servicios/arquitectura-e-implementacion-de-infraestructura",
        destination: "/servicios/cloud/infraestructura",
        permanent: true,
      },
      {
        source: "/servicios/implementacion-de-plataformas-en-la-nube",
        destination: "/servicios/cloud/infraestructura",
        permanent: true,
      },
      {
        source: "/servicios/soluciones-serverless",
        destination: "/servicios/cloud/serverless",
        permanent: true,
      },
      { source: "/blog/politica-privacidad", destination: "/privacidad", permanent: true },
      { source: "/en/about-us", destination: "/en/about", permanent: true },
      { source: "/en/how-do-we-work", destination: "/en/about/methodology", permanent: true },
      { source: "/en/timeline", destination: "/en/about/history", permanent: true },
      // El hub /industrias ganó ruta EN localizada (/en/industries) en lib/i18n/routing.ts
      { source: "/en/industrias", destination: "/en/industries", permanent: true },
      // Legacy GSC → sitio nuevo (generado por scripts/build-legacy-redirects.ts)
      ...LEGACY_REDIRECTS,
    ];
  },
};

export default withNextIntl(nextConfig);
