// CMS-connected: 2026-05-07 — no CMS table available for metodologia content; arrays serve as authoritative fallback. Migrate to a `pages_general` row with pageType='metodologia' to enable admin editing.
import type { Metadata } from "next";
import { PageWrapper } from "@/components/layout";
import { GeoIconBox } from "@/lib/icons/geometric";
import { CTABanner } from "@/components/shared";
import { getBreadcrumbSchema } from "@/lib/schema/breadcrumb";
import { buildPageMetadata } from "@/lib/seo/page-meta";
import { setRequestLocale } from "next-intl/server";

export const revalidate = 86400;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const isEn = locale === "en";
  return buildPageMetadata({
    locale: isEn ? "en" : "es",
    href: "/nosotros/metodologia",
    title: isEn
      ? "Agile Methodology | Scrum Framework for Digital Products"
      : "Metodología Ágil | Framework Scrum para Productos Digitales",
    description: isEn
      ? "The Nivelics Agile Framework, based on Scrum. A Delivery Manager on every project, 2-week sprints, continuous delivery."
      : "Framework Ágil Nivelics basado en Scrum. Delivery Manager en cada proyecto, sprints de 2 semanas, entrega continua.",
  });
}

const FALLBACK_ROLES = [
  {
    icon: "target",
    title: "Product Owner",
    description:
      "Representa la voz del cliente y del negocio. Define prioridades del backlog y asegura que cada sprint entregue el máximo valor.",
  },
  {
    icon: "users",
    title: "Scrum Master / Delivery Manager",
    description:
      "Facilita las ceremonias, remueve impedimentos y garantiza que el equipo mantenga el foco. En Nivelics, este rol evoluciona a Delivery Manager con responsabilidad end-to-end.",
  },
  {
    icon: "git-branch",
    title: "Equipo de Desarrollo",
    description:
      "Ingenieros multidisciplinarios (frontend, backend, QA, DevOps) que se auto-organizan para cumplir los objetivos del sprint.",
  },
];

const FALLBACK_EVENTS = [
  {
    icon: "calendar",
    title: "Sprint Planning",
    description:
      "Al inicio de cada sprint (2 semanas), el equipo selecciona las historias de usuario prioritarias y define el alcance del sprint.",
  },
  {
    icon: "refresh-cw",
    title: "Daily Scrum",
    description:
      "Reunión diaria de 15 minutos donde cada miembro comparte avances, bloqueos y plan del día. Transparencia total con el cliente.",
  },
  {
    icon: "check-circle",
    title: "Sprint Review",
    description:
      "Demo al final del sprint donde presentamos el incremento funcional al cliente. Feedback en tiempo real para ajustar dirección.",
  },
  {
    icon: "target",
    title: "Sprint Retrospective",
    description:
      "El equipo reflexiona sobre el proceso: qué funcionó, qué mejorar y qué acciones tomar. Mejora continua garantizada.",
  },
];

export default async function MetodologiaPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: __locale } = await params;
  setRequestLocale(__locale);
  const breadcrumb = getBreadcrumbSchema([
    { name: "Inicio", url: "/" },
    { name: "Nosotros", url: "/nosotros" },
    { name: "Metodología", url: "/nosotros/metodologia" },
  ]);

  // HowTo: las ceremonias del sprint son pasos secuenciales reales que la página
  // ya muestra en la sección "Eventos". Derivado de FALLBACK_EVENTS para que el
  // schema nunca se desincronice del contenido renderizado.
  const howTo = {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name: "Metodología Ágil Nivelics",
    description:
      "Framework basado en Scrum con sprints de 2 semanas, entrega continua y un Delivery Manager dedicado en cada proyecto.",
    step: FALLBACK_EVENTS.map((event, index) => ({
      "@type": "HowToStep",
      position: index + 1,
      name: event.title,
      text: event.description,
    })),
  };

  return (
    <PageWrapper>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(howTo) }}
      />

      {/* Hero */}
      <section className="py-16 md:py-24">
        <div className="mx-auto max-w-[1280px] px-6 md:px-20">
          <h1 className="max-w-3xl text-4xl font-bold text-text-100 md:text-5xl">
            Metodología Ágil Nivelics
          </h1>
          <p className="mt-6 max-w-2xl text-lg text-text-70">
            Nuestro framework está basado en Scrum con adaptaciones propias que hemos refinado
            durante más de una década de proyectos B2B. Trabajamos en sprints de 2 semanas con
            entrega continua, visibilidad total y un Delivery Manager dedicado en cada proyecto.
          </p>
        </div>
      </section>

      {/* Roles */}
      <section className="bg-bg-surface py-16 md:py-24">
        <div className="mx-auto max-w-[1280px] px-6 md:px-20">
          <h2 className="text-3xl font-bold text-text-100">Roles</h2>
          <p className="mt-4 max-w-2xl text-text-70">
            Cada proyecto cuenta con roles claramente definidos para asegurar responsabilidad y
            agilidad.
          </p>
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {FALLBACK_ROLES.map((role) => (
              <div key={role.title} className="glass glow-hover rounded-xl p-6">
                <div className="mb-4">
                  <GeoIconBox name={role.icon} size={22} color="cyan" />
                </div>
                <h3 className="text-lg font-semibold text-text-100">{role.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-text-70">{role.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Eventos */}
      <section className="py-16 md:py-24">
        <div className="mx-auto max-w-[1280px] px-6 md:px-20">
          <h2 className="text-3xl font-bold text-text-100">Eventos</h2>
          <p className="mt-4 max-w-2xl text-text-70">
            Las ceremonias Scrum que ejecutamos en cada sprint para mantener ritmo, alineación y
            mejora continua.
          </p>
          <div className="mt-12 grid gap-6 md:grid-cols-2">
            {FALLBACK_EVENTS.map((event) => (
              <div key={event.title} className="glass glow-hover rounded-xl p-6">
                <div className="mb-4">
                  <GeoIconBox name={event.icon} size={22} color="cyan" />
                </div>
                <h3 className="text-lg font-semibold text-text-100">{event.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-text-70">{event.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Diferenciador */}
      <section className="bg-bg-surface py-16 md:py-24">
        <div className="mx-auto max-w-[1280px] px-6 md:px-20">
          <h2 className="text-3xl font-bold text-text-100">Nuestro diferenciador</h2>
          <div className="mt-8 glass rounded-xl p-8 md:p-12">
            <div className="flex items-start gap-4">
              <div className="shrink-0">
                <GeoIconBox name="tri-check" size={22} color="green" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-text-100">
                  Delivery Manager en cada proyecto
                </h3>
                <p className="mt-3 text-text-70 leading-relaxed">
                  A diferencia del Scrum Master tradicional, nuestro Delivery Manager tiene
                  responsabilidad end-to-end sobre el resultado del proyecto. No solo facilita
                  ceremonias: gestiona riesgos, coordina dependencias entre equipos, se asegura de
                  la calidad del entregable y es el punto de contacto principal del cliente. Esto
                  significa que cada proyecto tiene un líder que responde por la entrega, no solo
                  por el proceso.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <CTABanner
        title="¿Quieres ver nuestra metodología en acción?"
        description="Agenda una reunión y te mostramos cómo trabajamos con un caso real."
      />
    </PageWrapper>
  );
}
