import type { Metadata } from "next";
import { GitBranch, Users, Target, RefreshCw, CheckCircle, Calendar } from "lucide-react";
import { PageWrapper } from "@/components/layout";
import { CTABanner } from "@/components/shared";
import { getBreadcrumbSchema } from "@/lib/schema/breadcrumb";

export const revalidate = 86400;

export const metadata: Metadata = {
  title: "Metodología Ágil | Framework Scrum para Productos Digitales",
  description:
    "Framework Ágil Nivelics basado en Scrum. Delivery Manager en cada proyecto, sprints de 2 semanas, entrega continua.",
  alternates: {
    canonical: "https://www.nivelics.com/nosotros/metodologia",
    languages: {
      es: "https://www.nivelics.com/nosotros/metodologia",
      en: "https://www.nivelics.com/en/about/methodology",
      "x-default": "https://www.nivelics.com/nosotros/metodologia",
    },
  },
};

const ROLES = [
  {
    icon: Target,
    title: "Product Owner",
    description:
      "Representa la voz del cliente y del negocio. Define prioridades del backlog y asegura que cada sprint entregue el máximo valor.",
  },
  {
    icon: Users,
    title: "Scrum Master / Delivery Manager",
    description:
      "Facilita las ceremonias, remueve impedimentos y garantiza que el equipo mantenga el foco. En Nivelics, este rol evoluciona a Delivery Manager con responsabilidad end-to-end.",
  },
  {
    icon: GitBranch,
    title: "Equipo de Desarrollo",
    description:
      "Ingenieros multidisciplinarios (frontend, backend, QA, DevOps) que se auto-organizan para cumplir los objetivos del sprint.",
  },
];

const EVENTS = [
  {
    icon: Calendar,
    title: "Sprint Planning",
    description:
      "Al inicio de cada sprint (2 semanas), el equipo selecciona las historias de usuario prioritarias y define el alcance del sprint.",
  },
  {
    icon: RefreshCw,
    title: "Daily Scrum",
    description:
      "Reunión diaria de 15 minutos donde cada miembro comparte avances, bloqueos y plan del día. Transparencia total con el cliente.",
  },
  {
    icon: CheckCircle,
    title: "Sprint Review",
    description:
      "Demo al final del sprint donde presentamos el incremento funcional al cliente. Feedback en tiempo real para ajustar dirección.",
  },
  {
    icon: Target,
    title: "Sprint Retrospective",
    description:
      "El equipo reflexiona sobre el proceso: qué funcionó, qué mejorar y qué acciones tomar. Mejora continua garantizada.",
  },
];

export default function MetodologiaPage() {
  const breadcrumb = getBreadcrumbSchema([
    { name: "Inicio", url: "/" },
    { name: "Nosotros", url: "/nosotros" },
    { name: "Metodología", url: "/nosotros/metodologia" },
  ]);

  return (
    <PageWrapper>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }}
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
            {ROLES.map((role) => {
              const Icon = role.icon;
              return (
                <div key={role.title} className="glass glow-hover rounded-xl p-6">
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                    <Icon size={24} className="text-primary" aria-hidden="true" />
                  </div>
                  <h3 className="text-lg font-semibold text-text-100">{role.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-text-70">{role.description}</p>
                </div>
              );
            })}
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
            {EVENTS.map((event) => {
              const Icon = event.icon;
              return (
                <div key={event.title} className="glass glow-hover rounded-xl p-6">
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                    <Icon size={24} className="text-primary" aria-hidden="true" />
                  </div>
                  <h3 className="text-lg font-semibold text-text-100">{event.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-text-70">{event.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Diferenciador */}
      <section className="bg-bg-surface py-16 md:py-24">
        <div className="mx-auto max-w-[1280px] px-6 md:px-20">
          <h2 className="text-3xl font-bold text-text-100">Nuestro diferenciador</h2>
          <div className="mt-8 glass rounded-xl p-8 md:p-12">
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                <CheckCircle size={24} className="text-primary" aria-hidden="true" />
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
