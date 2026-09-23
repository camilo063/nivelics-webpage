// CMS-connected: 2026-05-07 — no CMS table available for metodologia content; arrays serve as authoritative fallback. Migrate to a `pages_general` row with pageType='metodologia' to enable admin editing.
// Bilingüe con el patrón del repo (constantes _ES/_EN + isEn): el cuerpo entero,
// incluidos los pasos del HowTo, sale en el idioma servido.
import type { Metadata } from "next";
import { PageWrapper } from "@/components/layout";
import { GeoIconBox } from "@/lib/icons/geometric";
import { CTABanner } from "@/components/shared";
import { buildPageMetadata } from "@/lib/seo/page-meta";
import { absoluteUrl, inLanguageOf, webPageId } from "@/lib/schema/webpage";
import { getLocale, setRequestLocale } from "next-intl/server";

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
    // La plantilla del layout añade « | Nivelics»: el título completo debe quedar bajo 65.
    title: isEn
      ? "Agile Scrum Methodology for Digital Products"
      : "Metodología Ágil Scrum para Productos Digitales",
    description: isEn
      ? "The Nivelics Agile Framework, based on Scrum. A Delivery Manager on every project, 2-week sprints, continuous delivery."
      : "Framework Ágil Nivelics basado en Scrum. Delivery Manager en cada proyecto, sprints de 2 semanas, entrega continua.",
  });
}

const FALLBACK_ROLES_ES = [
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

const FALLBACK_ROLES_EN = [
  {
    icon: "target",
    title: "Product Owner",
    description:
      "Represents the voice of the client and the business. Sets backlog priorities and makes sure every sprint delivers the highest value.",
  },
  {
    icon: "users",
    title: "Scrum Master / Delivery Manager",
    description:
      "Facilitates the ceremonies, removes impediments and keeps the team focused. At Nivelics this role grows into a Delivery Manager with end-to-end responsibility.",
  },
  {
    icon: "git-branch",
    title: "Development Team",
    description:
      "Cross-functional engineers (frontend, backend, QA, DevOps) who self-organize to meet the sprint goals.",
  },
];

const FALLBACK_EVENTS_ES = [
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

const FALLBACK_EVENTS_EN = [
  {
    icon: "calendar",
    title: "Sprint Planning",
    description:
      "At the start of every sprint (2 weeks), the team picks the top-priority user stories and defines the scope of the sprint.",
  },
  {
    icon: "refresh-cw",
    title: "Daily Scrum",
    description:
      "A 15-minute daily meeting where every member shares progress, blockers and the plan for the day. Full transparency with the client.",
  },
  {
    icon: "check-circle",
    title: "Sprint Review",
    description:
      "A demo at the end of the sprint where we show the working increment to the client. Real-time feedback to adjust direction.",
  },
  {
    icon: "target",
    title: "Sprint Retrospective",
    description:
      "The team reflects on the process: what worked, what to improve and which actions to take. Continuous improvement, guaranteed.",
  },
];

const LABELS = {
  es: {
    h1: "Metodología Ágil Nivelics",
    intro:
      "Nuestro framework está basado en Scrum con adaptaciones propias que hemos refinado durante más de una década de proyectos B2B. Trabajamos en sprints de 2 semanas con entrega continua, visibilidad total y un Delivery Manager dedicado en cada proyecto.",
    rolesTitle: "Roles",
    rolesIntro:
      "Cada proyecto cuenta con roles claramente definidos para asegurar responsabilidad y agilidad.",
    eventsTitle: "Eventos",
    eventsIntro:
      "Las ceremonias Scrum que ejecutamos en cada sprint para mantener ritmo, alineación y mejora continua.",
    differentiatorTitle: "Nuestro diferenciador",
    differentiatorCardTitle: "Delivery Manager en cada proyecto",
    differentiatorBody:
      "A diferencia del Scrum Master tradicional, nuestro Delivery Manager tiene responsabilidad end-to-end sobre el resultado del proyecto. No solo facilita ceremonias: gestiona riesgos, coordina dependencias entre equipos, se asegura de la calidad del entregable y es el punto de contacto principal del cliente. Esto significa que cada proyecto tiene un líder que responde por la entrega, no solo por el proceso.",
    howToName: "Metodología Ágil Nivelics",
    howToDescription:
      "Framework basado en Scrum con sprints de 2 semanas, entrega continua y un Delivery Manager dedicado en cada proyecto.",
    ctaTitle: "¿Quieres ver nuestra metodología en acción?",
    ctaDescription: "Agenda una reunión y te mostramos cómo trabajamos con un caso real.",
  },
  en: {
    h1: "The Nivelics Agile Methodology",
    intro:
      "Our framework is based on Scrum with our own adaptations, refined over more than a decade of B2B projects. We work in 2-week sprints with continuous delivery, full visibility and a dedicated Delivery Manager on every project.",
    rolesTitle: "Roles",
    rolesIntro: "Every project has clearly defined roles to guarantee accountability and agility.",
    eventsTitle: "Events",
    eventsIntro:
      "The Scrum ceremonies we run in every sprint to keep cadence, alignment and continuous improvement.",
    differentiatorTitle: "What makes us different",
    differentiatorCardTitle: "A Delivery Manager on every project",
    differentiatorBody:
      "Unlike the traditional Scrum Master, our Delivery Manager has end-to-end responsibility for the outcome of the project. They do not just facilitate ceremonies: they manage risks, coordinate dependencies across teams, safeguard the quality of the deliverable and act as the client's main point of contact. That means every project has a leader who answers for the delivery, not only for the process.",
    howToName: "The Nivelics Agile Methodology",
    howToDescription:
      "A Scrum-based framework with 2-week sprints, continuous delivery and a dedicated Delivery Manager on every project.",
    ctaTitle: "Want to see our methodology in action?",
    ctaDescription: "Book a meeting and we will walk you through a real project.",
  },
} as const;

export default async function MetodologiaPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: __locale } = await params;
  setRequestLocale(__locale);
  const locale = await getLocale();
  const isEn = locale === "en";
  const t = LABELS[isEn ? "en" : "es"];
  const roles = isEn ? FALLBACK_ROLES_EN : FALLBACK_ROLES_ES;
  const events = isEn ? FALLBACK_EVENTS_EN : FALLBACK_EVENTS_ES;

  // HowTo: las ceremonias del sprint son pasos secuenciales reales que la página
  // ya muestra en la sección "Eventos". Derivado del array del idioma servido para
  // que el schema nunca se desincronice del contenido renderizado.
  const canonical = absoluteUrl("/nosotros/metodologia", locale);
  const howTo = {
    "@context": "https://schema.org",
    "@type": "HowTo",
    "@id": `${canonical}#howto`,
    name: t.howToName,
    description: t.howToDescription,
    url: canonical,
    inLanguage: inLanguageOf(locale),
    mainEntityOfPage: { "@id": webPageId("/nosotros/metodologia", locale) },
    step: events.map((event, index) => ({
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
        dangerouslySetInnerHTML={{ __html: JSON.stringify(howTo) }}
      />

      {/* Hero */}
      <section className="py-16 md:py-24">
        <div className="mx-auto max-w-[1280px] px-6 md:px-20">
          <h1 className="max-w-3xl text-4xl font-bold text-text-100 md:text-5xl">{t.h1}</h1>
          <p className="mt-6 max-w-2xl text-lg text-text-70">{t.intro}</p>
        </div>
      </section>

      {/* Roles */}
      <section className="bg-bg-surface py-16 md:py-24">
        <div className="mx-auto max-w-[1280px] px-6 md:px-20">
          <h2 className="text-3xl font-bold text-text-100">{t.rolesTitle}</h2>
          <p className="mt-4 max-w-2xl text-text-70">{t.rolesIntro}</p>
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {roles.map((role) => (
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
          <h2 className="text-3xl font-bold text-text-100">{t.eventsTitle}</h2>
          <p className="mt-4 max-w-2xl text-text-70">{t.eventsIntro}</p>
          <div className="mt-12 grid gap-6 md:grid-cols-2">
            {events.map((event) => (
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
          <h2 className="text-3xl font-bold text-text-100">{t.differentiatorTitle}</h2>
          <div className="mt-8 glass rounded-xl p-8 md:p-12">
            <div className="flex items-start gap-4">
              <div className="shrink-0">
                <GeoIconBox name="tri-check" size={22} color="green" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-text-100">{t.differentiatorCardTitle}</h3>
                <p className="mt-3 text-text-70 leading-relaxed">{t.differentiatorBody}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <CTABanner title={t.ctaTitle} description={t.ctaDescription} />
    </PageWrapper>
  );
}
