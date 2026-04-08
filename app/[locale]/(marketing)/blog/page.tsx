import type { Metadata } from "next";
import Link from "next/link";
import { PageWrapper } from "@/components/layout";
import { ServiceBadge } from "@/components/shared";
import { getBreadcrumbSchema } from "@/lib/schema/breadcrumb";

export const metadata: Metadata = {
  title: "Blog de Transformación Digital | IA, Cloud y Nearshoring",
  description: "Artículos sobre inteligencia artificial, cloud, staffing y transformación digital.",
  alternates: {
    canonical: "https://www.nivelics.com/blog",
    languages: {
      es: "https://www.nivelics.com/blog",
      en: "https://www.nivelics.com/en/blog",
      "x-default": "https://www.nivelics.com/blog",
    },
  },
};

const POSTS = [
  {
    slug: "como-implementar-ia-generativa-en-tu-empresa",
    title: "Cómo implementar IA generativa en tu empresa: guía práctica 2026",
    excerpt:
      "Una guía paso a paso para adoptar LLMs y agentes de IA en procesos empresariales reales.",
    badge: "ia" as const,
    date: "2026-03-15",
    readTime: "8 min",
  },
  {
    slug: "finops-guia-completa",
    title: "FinOps: la guía completa para optimizar tu inversión cloud",
    excerpt:
      "Todo lo que necesitas saber sobre FinOps, desde los fundamentos hasta la implementación.",
    badge: "finops" as const,
    date: "2026-02-28",
    readTime: "12 min",
  },
  {
    slug: "staff-augmentation-vs-outsourcing",
    title: "Staff Augmentation vs Outsourcing: ¿cuál es mejor para tu proyecto?",
    excerpt: "Análisis comparativo de modelos de contratación de talento tech con pros y contras.",
    badge: "staffing" as const,
    date: "2026-02-10",
    readTime: "6 min",
  },
  {
    slug: "migracion-cloud-errores-comunes",
    title: "5 errores comunes en migraciones cloud (y cómo evitarlos)",
    excerpt: "Lecciones aprendidas de +50 migraciones cloud exitosas en empresas B2B.",
    badge: "cloud" as const,
    date: "2026-01-20",
    readTime: "7 min",
  },
];

export default function BlogPage() {
  const breadcrumb = getBreadcrumbSchema([
    { name: "Inicio", url: "/" },
    { name: "Blog", url: "/blog" },
  ]);

  return (
    <PageWrapper>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }}
      />

      <section className="py-16 md:py-24">
        <div className="mx-auto max-w-[1280px] px-6 md:px-20">
          <h1 className="text-4xl font-bold text-text-100 md:text-5xl">Blog</h1>
          <p className="mt-4 max-w-2xl text-lg text-text-70">
            Insights, guías y tendencias sobre transformación digital, IA, cloud y talento tech.
          </p>
        </div>
      </section>

      <section className="bg-bg-surface py-16 md:py-24">
        <div className="mx-auto max-w-[1280px] px-6 md:px-20">
          <div className="grid gap-6 md:grid-cols-2">
            {POSTS.map((post) => (
              <Link
                key={post.slug}
                href={`/blog/${post.slug}`}
                className="group glass glow-hover rounded-xl p-6 block"
              >
                <div className="flex items-center gap-3 mb-3">
                  <ServiceBadge variant={post.badge}>
                    {post.badge === "ia"
                      ? "IA"
                      : post.badge.charAt(0).toUpperCase() + post.badge.slice(1)}
                  </ServiceBadge>
                  <span className="text-xs text-text-40">{post.readTime}</span>
                </div>
                <h2 className="text-xl font-semibold text-text-100 group-hover:text-primary transition-colors">
                  {post.title}
                </h2>
                <p className="mt-2 text-sm text-text-70">{post.excerpt}</p>
                <time className="mt-4 block text-xs text-text-40">
                  {new Date(post.date).toLocaleDateString("es-CO", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </time>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </PageWrapper>
  );
}
