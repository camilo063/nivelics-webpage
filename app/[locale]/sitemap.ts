import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://www.nivelics.com";
  const now = new Date("2026-04-01");

  return [
    // HOME
    {
      url: baseUrl,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 1.0,
      alternates: { languages: { es: baseUrl, en: `${baseUrl}/en` } },
    },

    // SERVICIOS principales (prioridad 0.9)
    { url: `${baseUrl}/servicios`, lastModified: now, changeFrequency: "monthly", priority: 0.9 },
    {
      url: `${baseUrl}/servicios/inteligencia-artificial`,
      lastModified: now,
      priority: 0.9,
      changeFrequency: "monthly",
      alternates: {
        languages: {
          es: `${baseUrl}/servicios/inteligencia-artificial`,
          en: `${baseUrl}/en/services/artificial-intelligence`,
        },
      },
    },
    {
      url: `${baseUrl}/servicios/cloud`,
      lastModified: now,
      priority: 0.9,
      changeFrequency: "monthly",
    },
    {
      url: `${baseUrl}/servicios/staff-augmentation`,
      lastModified: now,
      priority: 0.9,
      changeFrequency: "monthly",
      alternates: {
        languages: {
          es: `${baseUrl}/servicios/staff-augmentation`,
          en: `${baseUrl}/en/services/staff-augmentation`,
        },
      },
    },
    {
      url: `${baseUrl}/servicios/desarrollo-digital`,
      lastModified: now,
      priority: 0.9,
      changeFrequency: "monthly",
    },

    // SUBSERVICIOS (prioridad 0.85)
    {
      url: `${baseUrl}/servicios/cloud/finops`,
      lastModified: now,
      priority: 0.85,
      changeFrequency: "monthly",
    },

    // CASOS DE ÉXITO (prioridad 0.8)
    {
      url: `${baseUrl}/casos-de-exito`,
      lastModified: now,
      priority: 0.8,
      changeFrequency: "monthly",
    },

    // EMPRESA (prioridad 0.7)
    {
      url: `${baseUrl}/nosotros`,
      lastModified: now,
      priority: 0.7,
      changeFrequency: "monthly",
    },
    {
      url: `${baseUrl}/nosotros/historia`,
      lastModified: now,
      priority: 0.7,
      changeFrequency: "yearly",
    },

    // CONTACTO Y BLOG
    {
      url: `${baseUrl}/contacto`,
      lastModified: now,
      priority: 0.8,
      changeFrequency: "monthly",
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: now,
      priority: 0.6,
      changeFrequency: "weekly",
    },

    // BLOG POSTS
    {
      url: `${baseUrl}/blog/como-implementar-ia-generativa-en-tu-empresa`,
      lastModified: new Date("2026-03-15"),
      priority: 0.5,
      changeFrequency: "monthly",
    },
    {
      url: `${baseUrl}/blog/finops-guia-completa`,
      lastModified: new Date("2026-02-28"),
      priority: 0.5,
      changeFrequency: "monthly",
    },
    {
      url: `${baseUrl}/blog/staff-augmentation-vs-outsourcing`,
      lastModified: new Date("2026-02-10"),
      priority: 0.5,
      changeFrequency: "monthly",
    },
    {
      url: `${baseUrl}/blog/migracion-cloud-errores-comunes`,
      lastModified: new Date("2026-01-20"),
      priority: 0.5,
      changeFrequency: "monthly",
    },
  ];
}
