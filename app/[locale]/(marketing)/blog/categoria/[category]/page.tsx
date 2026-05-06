import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PageWrapper } from "@/components/layout";
import { ServiceBadge } from "@/components/shared";
import { getBreadcrumbSchema } from "@/lib/schema/breadcrumb";
import { setRequestLocale } from "next-intl/server";

export const revalidate = 3600;

const CATEGORIES: Record<string, { label: string; badge: string }> = {
  "inteligencia-artificial": { label: "Inteligencia Artificial", badge: "ia" },
  cloud: { label: "Cloud", badge: "cloud" },
  "staff-augmentation": { label: "Staff Augmentation", badge: "staffing" },
  finops: { label: "FinOps", badge: "finops" },
  "transformacion-digital": { label: "Transformación Digital", badge: "dev" },
};

const ALL_POSTS = [
  {
    slug: "como-implementar-ia-generativa-en-tu-empresa",
    title: "Cómo implementar IA generativa en tu empresa: guía práctica 2026",
    excerpt:
      "Una guía paso a paso para adoptar LLMs y agentes de IA en procesos empresariales reales.",
    category: "inteligencia-artificial",
    date: "2026-03-15",
    readTime: "8 min",
  },
  {
    slug: "finops-guia-completa",
    title: "FinOps: la guía completa para optimizar tu inversión cloud",
    excerpt: "Todo lo que necesitas saber sobre FinOps.",
    category: "finops",
    date: "2026-02-28",
    readTime: "12 min",
  },
  {
    slug: "staff-augmentation-vs-outsourcing",
    title: "Staff Augmentation vs Outsourcing: ¿cuál es mejor?",
    excerpt: "Análisis comparativo de modelos de contratación.",
    category: "staff-augmentation",
    date: "2026-02-10",
    readTime: "6 min",
  },
  {
    slug: "migracion-cloud-errores-comunes",
    title: "5 errores comunes en migraciones cloud",
    excerpt: "Lecciones aprendidas de +50 migraciones.",
    category: "cloud",
    date: "2026-01-20",
    readTime: "7 min",
  },
];

export function generateStaticParams() {
  return Object.keys(CATEGORIES).map((category) => ({ category }));
}

// Use async params per Next.js 16
interface Props {
  params: Promise<{ category: string; locale: string }>;
}

export async function generateMetadata(props: Props): Promise<Metadata> {
  const { category, locale: __locale } = await props.params;
  setRequestLocale(__locale);
  const cat = CATEGORIES[category];
  if (!cat) return { title: "Categoría no encontrada" };
  return {
    title: `Blog ${cat.label} | Artículos y Guías`,
    description: `Artículos sobre ${cat.label.toLowerCase()} para empresas B2B.`,
    alternates: { canonical: `https://www.nivelics.com/blog/categoria/${category}` },
  };
}

export default async function BlogCategoryPage(props: Props) {
  const { category, locale: __locale } = await props.params;
  setRequestLocale(__locale);
  const cat = CATEGORIES[category];
  if (!cat) notFound();

  const breadcrumb = getBreadcrumbSchema([
    { name: "Inicio", url: "/" },
    { name: "Blog", url: "/blog" },
    { name: cat.label, url: `/blog/categoria/${category}` },
  ]);

  const filteredPosts = ALL_POSTS.filter((p) => p.category === category);

  return (
    <PageWrapper>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }}
      />

      <section className="py-16 md:py-24">
        <div className="mx-auto max-w-[1280px] px-6 md:px-20">
          <ServiceBadge variant={cat.badge as "ia" | "cloud" | "staffing" | "finops" | "dev"}>
            {cat.label}
          </ServiceBadge>
          <h1 className="mt-6 text-4xl font-bold text-text-100 md:text-5xl">Blog: {cat.label}</h1>
          <p className="mt-4 max-w-2xl text-lg text-text-70">
            Artículos, guías y tendencias sobre {cat.label.toLowerCase()}.
          </p>
        </div>
      </section>

      <section className="bg-bg-surface py-16 md:py-24">
        <div className="mx-auto max-w-[1280px] px-6 md:px-20">
          {filteredPosts.length > 0 ? (
            <div className="grid gap-6 md:grid-cols-2">
              {filteredPosts.map((post) => (
                <Link
                  key={post.slug}
                  href={`/blog/${post.slug}`}
                  className="group glass glow-hover rounded-xl p-6 block"
                >
                  <h2 className="text-xl font-semibold text-text-100 group-hover:text-primary transition-colors">
                    {post.title}
                  </h2>
                  <p className="mt-2 text-sm text-text-70">{post.excerpt}</p>
                  <div className="mt-4 flex items-center gap-3 text-xs text-text-40">
                    <time>
                      {new Date(post.date).toLocaleDateString("es-CO", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </time>
                    <span>·</span>
                    <span>{post.readTime}</span>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <p className="text-center text-text-70">
              No hay artículos en esta categoría aún. Pronto publicaremos contenido sobre{" "}
              {cat.label.toLowerCase()}.
            </p>
          )}
        </div>
      </section>
    </PageWrapper>
  );
}
