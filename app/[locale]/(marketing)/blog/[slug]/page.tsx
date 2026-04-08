import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { PageWrapper } from "@/components/layout";
import { CTABanner } from "@/components/shared";
import { Button } from "@/components/ui/button";
import { getBreadcrumbSchema } from "@/lib/schema/breadcrumb";

export const revalidate = 3600;

const POSTS: Record<string, { title: string; content: string; date: string; readTime: string }> = {
  "como-implementar-ia-generativa-en-tu-empresa": {
    title: "Cómo implementar IA generativa en tu empresa: guía práctica 2026",
    date: "2026-03-15",
    readTime: "8 min",
    content: `La inteligencia artificial generativa ha dejado de ser una promesa futurista para convertirse en una herramienta operativa que las empresas más competitivas ya están usando. En esta guía te mostramos cómo iniciar tu adopción de IA de forma práctica y segura.

## 1. Identifica casos de uso con ROI claro

Antes de implementar cualquier modelo, mapea los procesos donde la IA puede generar valor inmediato: atención al cliente, generación de contenido, análisis de documentos, o automatización de reportes.

## 2. Elige el modelo correcto

No todo requiere GPT-4 o Claude. Evalúa modelos open-source para tareas específicas y reserva los modelos premium para casos que requieran razonamiento complejo.

## 3. Construye con guardrails

Implementa validación de outputs, monitoreo de alucinaciones y feedback loops desde el día uno. La IA sin controles es un riesgo, no una ventaja.

## 4. Mide y optimiza

Define KPIs claros: tiempo ahorrado, errores reducidos, satisfacción del usuario. Si no lo puedes medir, no sabes si funciona.`,
  },
  "finops-guia-completa": {
    title: "FinOps: la guía completa para optimizar tu inversión cloud",
    date: "2026-02-28",
    readTime: "12 min",
    content: `FinOps es la práctica de gestionar y optimizar el gasto en cloud para maximizar el valor de negocio. No se trata solo de reducir costos, sino de gastar de forma inteligente.

## ¿Qué es FinOps?

FinOps combina finanzas, tecnología y negocio para tomar decisiones informadas sobre el uso de cloud. Es una disciplina cultural, no solo técnica.

## Los tres pilares

**Informar**: Visibilidad total del gasto por equipo, proyecto y ambiente.
**Optimizar**: Rightsizing, reserved instances, spot instances y eliminación de waste.
**Operar**: Governance, budgets, alertas y cultura de eficiencia.

## Primeros pasos

1. Implementa una estrategia de tagging consistente
2. Configura dashboards de costo en tiempo real
3. Identifica quick wins (recursos idle, oversized)
4. Establece un equipo FinOps cross-funcional`,
  },
  "staff-augmentation-vs-outsourcing": {
    title: "Staff Augmentation vs Outsourcing: ¿cuál es mejor para tu proyecto?",
    date: "2026-02-10",
    readTime: "6 min",
    content: `Elegir entre staff augmentation y outsourcing puede definir el éxito de tu proyecto. Ambos modelos tienen ventajas, pero sirven para situaciones diferentes.

## Staff Augmentation

Integras profesionales externos a tu equipo existente. Tú mantienes el control del proyecto, la metodología y los procesos. Ideal cuando necesitas skills específicos o escalar rápido manteniendo la cultura del equipo.

## Outsourcing

Delegas un proyecto completo a un equipo externo. Ellos manejan el delivery end-to-end. Funciona bien para proyectos con scope definido y cuando no tienes capacidad interna de gestión.

## ¿Cuándo elegir cada uno?

- **Staff Augmentation**: proyecto core, equipo existente, necesitas control, largo plazo
- **Outsourcing**: proyecto no-core, scope cerrado, capacidad de gestión limitada`,
  },
  "migracion-cloud-errores-comunes": {
    title: "5 errores comunes en migraciones cloud (y cómo evitarlos)",
    date: "2026-01-20",
    readTime: "7 min",
    content: `Después de +50 migraciones cloud, hemos identificado los errores más frecuentes que cometen las empresas. Aquí te contamos cuáles son y cómo evitarlos.

## 1. Migrar sin estrategia (lift & shift a ciegas)

No todo debe ir a la nube, y no todo debe ir igual. Evalúa cada workload: rehost, replatform, refactor o retire.

## 2. Ignorar los costos desde el inicio

La nube no es mágica. Sin governance, tus costos pueden dispararse. Implementa FinOps desde el día uno.

## 3. No planificar el rollback

Toda migración necesita un plan B. Define criterios de rollback y prueba que funciona antes de migrar producción.

## 4. Subestimar la seguridad

Cloud no es inseguro, pero requiere un modelo de seguridad diferente. Shared responsibility, IAM, encryption, network segmentation.

## 5. No capacitar al equipo

La nube requiere habilidades nuevas. Invierte en capacitación antes y durante la migración.`,
  },
};

interface BlogPostPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return Object.keys(POSTS).map((slug) => ({ slug }));
}

export async function generateMetadata(props: BlogPostPageProps): Promise<Metadata> {
  const { slug } = await props.params;
  const post = POSTS[slug];
  if (!post) return { title: "Post no encontrado" };
  return {
    title: post.title,
    description: post.content.slice(0, 160),
    alternates: { canonical: `https://www.nivelics.com/blog/${slug}` },
  };
}

export default async function BlogPostPage(props: BlogPostPageProps) {
  const { slug } = await props.params;
  const post = POSTS[slug];

  if (!post) {
    return (
      <PageWrapper>
        <div className="mx-auto max-w-[1280px] px-6 py-24 text-center md:px-20">
          <h1 className="text-3xl font-bold text-text-100">Post no encontrado</h1>
          <Button asChild variant="outline" className="mt-8">
            <Link href="/blog">Volver al blog</Link>
          </Button>
        </div>
      </PageWrapper>
    );
  }

  const breadcrumb = getBreadcrumbSchema([
    { name: "Inicio", url: "/" },
    { name: "Blog", url: "/blog" },
    { name: post.title, url: `/blog/${slug}` },
  ]);

  return (
    <PageWrapper>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }}
      />
      <article className="py-16 md:py-24">
        <div className="mx-auto max-w-3xl px-6 md:px-20">
          <Button asChild variant="ghost" size="sm" className="mb-8">
            <Link href="/blog">
              <ArrowLeft size={14} />
              Volver al blog
            </Link>
          </Button>

          <div className="flex items-center gap-3 text-sm text-text-40">
            <time>
              {new Date(post.date).toLocaleDateString("es-CO", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </time>
            <span>·</span>
            <span>{post.readTime} de lectura</span>
          </div>

          <h1 className="mt-4 text-3xl font-bold text-text-100 md:text-4xl">{post.title}</h1>

          <div className="prose-invert mt-12 max-w-none">
            {post.content.split("\n\n").map((paragraph, i) => {
              if (paragraph.startsWith("## ")) {
                return (
                  <h2 key={i} className="mt-8 mb-4 text-xl font-bold text-text-100">
                    {paragraph.replace("## ", "")}
                  </h2>
                );
              }
              if (paragraph.startsWith("**") && paragraph.includes("**:")) {
                return (
                  <p key={i} className="mb-4 text-text-70 leading-relaxed">
                    {paragraph}
                  </p>
                );
              }
              return (
                <p key={i} className="mb-4 text-text-70 leading-relaxed">
                  {paragraph}
                </p>
              );
            })}
          </div>
        </div>
      </article>

      <CTABanner
        title="¿Te interesa este tema?"
        description="Conversemos sobre cómo aplicar estas ideas en tu empresa."
      />
    </PageWrapper>
  );
}
