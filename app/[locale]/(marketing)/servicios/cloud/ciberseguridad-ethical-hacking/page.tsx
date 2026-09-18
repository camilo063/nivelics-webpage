// CMS-connected: 2026-09-15 — benefits, processSteps, metrics y CTAs leen de BD con fallback duro.
// Bilingüe con el patrón de cloud/finops (constantes _ES/_EN + isEn): la página hermana
// cloud/seguridad tiene el copy en español duro y su versión /en sale a medias.
import type { Metadata } from "next";
import { LocaleLink as Link } from "@/components/i18n/locale-link";
import { PageWrapper } from "@/components/layout";
import { SiblingServicesNav } from "@/components/navigation/sibling-services-nav";
import { CTABanner } from "@/components/shared";
import { BenefitCard } from "@/components/shared/benefit-card";
import { HeroSplit } from "@/components/sections/hero-split";
import { GeoIconBox } from "@/lib/icons/geometric";
import { MetricsBar } from "@/components/sections/metrics-bar";
import { ProcessTimeline } from "@/components/sections/process-timeline";
import { TechStackGrid } from "@/components/sections/tech-stack-grid";
import { FAQAccordion } from "@/components/sections/faq-accordion";
import { StickyMobileCta } from "@/components/ui/sticky-mobile-cta";
import {
  CmsServicioBenefits,
  CmsServicioProcess,
  resolveServicioCtas,
} from "@/components/sections/cms-servicio-sections";
import { getServiceSchema } from "@/lib/schema/service";
import { getBreadcrumbSchema } from "@/lib/schema/breadcrumb";
import { getLocale, setRequestLocale } from "next-intl/server";
import { getServicioData } from "@/lib/cms/get-servicio-data";
import { buildPageMetadata } from "@/lib/seo/page-meta";
import type { Locale } from "@/lib/cms/types";

export const revalidate = 86400;

const SLUG = "ciberseguridad-ethical-hacking";
const ACCENT = "#3B82F6";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale: __locale } = await params;
  setRequestLocale(__locale);
  const locale = (await getLocale()) as Locale;
  const isEn = locale === "en";
  const cms = await getServicioData(SLUG, locale);

  // El layout aplica la plantilla "%s | Nivelics" — nunca repetir el sufijo aquí.
  return buildPageMetadata({
    locale,
    href: "/servicios/cloud/ciberseguridad-ethical-hacking",
    title:
      cms?.seoTitle ||
      (isEn
        ? "Ethical Hacking & Cybersecurity | Real Pentesting"
        : "Ethical Hacking y Ciberseguridad | Pentesting Real"),
    description:
      cms?.seoDescription ||
      (isEn
        ? "Pentesting, red team and cybersecurity audits by certified ethical hackers. We find the vulnerabilities before a real attacker does."
        : "Pentesting, red team y auditorías de ciberseguridad con hackers éticos certificados. Encontramos las vulnerabilidades antes que un atacante real."),
  });
}

/* ── §4 Soluciones especializadas ────────────────────────────────────────── */

const SOLUTIONS_ES = [
  {
    icon: "oct-scan",
    title: "Pentesting de aplicaciones web y móviles",
    description:
      "Simulamos ataques reales contra tus aplicaciones para detectar inyecciones SQL, fallas de autenticación, exposición de datos y vulnerabilidades OWASP Top 10 antes de que lleguen a producción.",
  },
  {
    icon: "hex-nodes",
    title: "Pentesting de infraestructura y redes",
    description:
      "Evaluamos servidores, redes internas, VPN y configuraciones de firewall para identificar puntos de entrada que un atacante externo o interno podría explotar.",
  },
  {
    icon: "dia-target",
    title: "Red Team / Ethical Hacking ofensivo",
    description:
      "Simulación de ataque dirigido de punta a punta: reconocimiento, intrusión, movimiento lateral y exfiltración controlada, para medir qué tan lejos llegaría un atacante real y cuánto tardarías en detectarlo.",
  },
  {
    icon: "dia-pulse",
    title: "Auditoría de seguridad para agentes de IA y chatbots",
    description:
      "Evaluamos prompt injection, fuga de datos de entrenamiento, jailbreaks y abuso de herramientas conectadas en tus agentes de IA y chatbots — la superficie de ataque que la mayoría de las empresas todavía no está auditando.",
  },
  {
    icon: "tri-check",
    title: "Cumplimiento y normativas",
    description:
      "Preparación y acompañamiento para ISO 27001, SOC 2 y Ley 1581 de Habeas Data, con gap analysis, documentación y evidencia lista para auditoría externa.",
  },
  {
    icon: "oct-lock",
    title: "Respuesta a incidentes y hardening",
    description:
      "Si ya tuviste un incidente, contenemos, investigamos la causa raíz y endurecemos la infraestructura para que no vuelva a pasar.",
  },
];

const SOLUTIONS_EN = [
  {
    icon: "oct-scan",
    title: "Web and mobile application pentesting",
    description:
      "We simulate real attacks against your applications to find SQL injection, broken authentication, data exposure and OWASP Top 10 vulnerabilities before they reach production.",
  },
  {
    icon: "hex-nodes",
    title: "Infrastructure and network pentesting",
    description:
      "We assess servers, internal networks, VPNs and firewall configurations to identify entry points an external or internal attacker could exploit.",
  },
  {
    icon: "dia-target",
    title: "Red Team / offensive ethical hacking",
    description:
      "End-to-end targeted attack simulation: reconnaissance, intrusion, lateral movement and controlled exfiltration, to measure how far a real attacker would get and how long you would take to detect them.",
  },
  {
    icon: "dia-pulse",
    title: "Security audit for AI agents and chatbots",
    description:
      "We assess prompt injection, training-data leakage, jailbreaks and abuse of connected tools in your AI agents and chatbots — the attack surface most companies are not auditing yet.",
  },
  {
    icon: "tri-check",
    title: "Compliance and regulation",
    description:
      "Preparation and support for ISO 27001, SOC 2 and Colombia's Habeas Data Law 1581, with gap analysis, documentation and evidence ready for external audit.",
  },
  {
    icon: "oct-lock",
    title: "Incident response and hardening",
    description:
      "If you have already had an incident, we contain it, investigate the root cause and harden the infrastructure so it does not happen again.",
  },
];

/* ── Panel del hero: etiquetas cortas de las mismas 6 soluciones ─────────── */

const HERO_PANEL_ES = [
  { icon: "oct-scan", label: "Aplicaciones web y móviles" },
  { icon: "hex-nodes", label: "Infraestructura y redes" },
  { icon: "dia-target", label: "Red Team dirigido" },
  { icon: "dia-pulse", label: "Agentes de IA y chatbots" },
  { icon: "tri-check", label: "Cumplimiento ISO / SOC 2" },
  { icon: "oct-lock", label: "Respuesta a incidentes" },
];

const HERO_PANEL_EN = [
  { icon: "oct-scan", label: "Web and mobile apps" },
  { icon: "hex-nodes", label: "Infrastructure and networks" },
  { icon: "dia-target", label: "Targeted Red Team" },
  { icon: "dia-pulse", label: "AI agents and chatbots" },
  { icon: "tri-check", label: "ISO / SOC 2 compliance" },
  { icon: "oct-lock", label: "Incident response" },
];

/* ── §6 Proceso ──────────────────────────────────────────────────────────── */

const PROCESS_ES = [
  {
    number: "01",
    duration: "Semana 1",
    title: "Alcance y autorización",
    description:
      "Definimos qué sistemas se evalúan, qué técnicas están permitidas y firmamos el acuerdo de alcance (rules of engagement) que autoriza legalmente las pruebas.",
    deliverable: "Documento de alcance firmado",
  },
  {
    number: "02",
    duration: "Semanas 2-3",
    title: "Ejecución del pentest / red team",
    description:
      "Ejecutamos las pruebas ofensivas según la metodología acordada (OWASP, NIST, MITRE ATT&CK), documentando cada hallazgo con evidencia reproducible.",
    deliverable: "Bitácora de hallazgos en tiempo real",
  },
  {
    number: "03",
    duration: "Semana 4",
    title: "Reporte y priorización",
    description:
      "Entregamos reporte ejecutivo (para dirección) y reporte técnico (para el equipo de TI), con cada vulnerabilidad clasificada por severidad (CVSS) y un plan de remediación priorizado.",
    deliverable: "Reporte ejecutivo + técnico + plan de remediación",
  },
  {
    number: "04",
    duration: "Semanas 5-6",
    title: "Retest y cierre",
    description:
      "Verificamos que las vulnerabilidades críticas fueron corregidas y emitimos una carta de cierre / certificado de remediación.",
    deliverable: "Retest + carta de cierre",
  },
];

const PROCESS_EN = [
  {
    number: "01",
    duration: "Week 1",
    title: "Scope and authorization",
    description:
      "We define which systems are assessed, which techniques are allowed, and we sign the rules-of-engagement agreement that legally authorizes the testing.",
    deliverable: "Signed scope document",
  },
  {
    number: "02",
    duration: "Weeks 2-3",
    title: "Pentest / red team execution",
    description:
      "We run the offensive tests following the agreed methodology (OWASP, NIST, MITRE ATT&CK), documenting every finding with reproducible evidence.",
    deliverable: "Live findings log",
  },
  {
    number: "03",
    duration: "Week 4",
    title: "Reporting and prioritization",
    description:
      "We deliver an executive report (for leadership) and a technical report (for the IT team), with every vulnerability rated by severity (CVSS) and a prioritized remediation plan.",
    deliverable: "Executive + technical report + remediation plan",
  },
  {
    number: "04",
    duration: "Weeks 5-6",
    title: "Retest and closure",
    description:
      "We verify that the critical vulnerabilities were fixed and issue a closure letter / remediation certificate.",
    deliverable: "Retest + closure letter",
  },
];

/* ── §7 Herramientas ─────────────────────────────────────────────────────── */

const TOOLS_ES = [
  { name: "Pentesting web", items: ["Burp Suite", "OWASP ZAP", "SQLMap"] },
  { name: "Infraestructura y redes", items: ["Nmap", "Nessus", "Metasploit"] },
  { name: "Red Team", items: ["Cobalt Strike", "BloodHound", "Kali Linux"] },
  { name: "Cumplimiento", items: ["Vanta / Drata", "Checklists ISO 27001 propios"] },
];

const TOOLS_EN = [
  { name: "Web pentesting", items: ["Burp Suite", "OWASP ZAP", "SQLMap"] },
  { name: "Infrastructure and networks", items: ["Nmap", "Nessus", "Metasploit"] },
  { name: "Red Team", items: ["Cobalt Strike", "BloodHound", "Kali Linux"] },
  { name: "Compliance", items: ["Vanta / Drata", "In-house ISO 27001 checklists"] },
];

/* ── §8 FAQ ──────────────────────────────────────────────────────────────── */

const FAQ_ES = [
  {
    question: "¿Qué es el ethical hacking y en qué se diferencia de un ataque real?",
    answer:
      "El ethical hacking es un ataque simulado autorizado legalmente por el dueño del sistema, ejecutado con el único fin de encontrar vulnerabilidades antes que un atacante real. La diferencia clave es el consentimiento explícito por escrito (acuerdo de alcance) y que los hallazgos se reportan al cliente, nunca se explotan.",
  },
  {
    question: "¿Cuánto dura un pentest completo?",
    answer:
      "Entre 4 y 6 semanas desde el kickoff hasta la entrega del reporte final, dependiendo del tamaño del sistema evaluado. Un red team completo (simulación de ataque dirigido) puede tomar entre 6 y 10 semanas.",
  },
  {
    question: "¿Necesito tener certificaciones de seguridad para contratar este servicio?",
    answer:
      "No. La mayoría de nuestros clientes contratan el pentest justamente para prepararse para una certificación (ISO 27001, SOC 2) o porque un cliente propio o regulador se lo exige. Nosotros ejecutamos la auditoría y te entregamos la evidencia necesaria.",
  },
  {
    question: "¿Es legal que ustedes intenten «hackear» mi sistema?",
    answer:
      "Sí, siempre que exista un acuerdo de alcance firmado (rules of engagement) que autorice explícitamente las pruebas, los sistemas incluidos y las técnicas permitidas. Ninguna prueba se ejecuta sin esa autorización previa.",
  },
  {
    question: "¿Qué pasa si encuentran una vulnerabilidad crítica durante la prueba?",
    answer:
      "Se reporta de inmediato al equipo técnico del cliente, sin esperar al informe final, para que pueda mitigarse cuanto antes. El hallazgo también queda documentado en el reporte completo con su respectiva evidencia.",
  },
  {
    question: "¿También evalúan la seguridad de chatbots o agentes de IA?",
    answer:
      "Sí. Auditamos vulnerabilidades específicas de sistemas de IA generativa como prompt injection, fuga de datos de entrenamiento, jailbreaks y abuso de herramientas conectadas al agente — una superficie de ataque nueva que los pentests tradicionales no cubren.",
  },
];

const FAQ_EN = [
  {
    question: "What is ethical hacking and how is it different from a real attack?",
    answer:
      "Ethical hacking is a simulated attack legally authorized by the system owner, carried out for the sole purpose of finding vulnerabilities before a real attacker does. The key difference is explicit written consent (the rules-of-engagement agreement) and that findings are reported to the client, never exploited.",
  },
  {
    question: "How long does a full pentest take?",
    answer:
      "Between 4 and 6 weeks from kickoff to final report delivery, depending on the size of the system assessed. A full red team engagement (targeted attack simulation) can take between 6 and 10 weeks.",
  },
  {
    question: "Do I need security certifications to hire this service?",
    answer:
      "No. Most of our clients hire the pentest precisely to prepare for a certification (ISO 27001, SOC 2) or because one of their own clients or a regulator requires it. We run the audit and hand you the evidence you need.",
  },
  {
    question: 'Is it legal for you to try to "hack" my system?',
    answer:
      "Yes, as long as there is a signed rules-of-engagement agreement explicitly authorizing the testing, the systems in scope and the techniques allowed. No test is ever run without that prior authorization.",
  },
  {
    question: "What happens if you find a critical vulnerability during the test?",
    answer:
      "It is reported immediately to the client's technical team, without waiting for the final report, so it can be mitigated as soon as possible. The finding is also documented in the full report with its supporting evidence.",
  },
  {
    question: "Do you also assess the security of chatbots or AI agents?",
    answer:
      "Yes. We audit vulnerabilities specific to generative AI systems such as prompt injection, training-data leakage, jailbreaks and abuse of tools connected to the agent — a new attack surface that traditional pentests do not cover.",
  },
];

export default async function CiberseguridadEthicalHackingPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: __locale } = await params;
  setRequestLocale(__locale);
  const locale = (await getLocale()) as Locale;
  const isEn = locale === "en";
  const cms = await getServicioData(SLUG, locale);

  const { ctaPrimary, ctaSecondary } = resolveServicioCtas({
    primary: cms ? { text: cms.ctaPrimaryText, url: cms.ctaPrimaryUrl } : null,
    secondary: cms ? { text: cms.ctaSecondaryText, url: cms.ctaSecondaryUrl } : null,
    fallbackPrimary: {
      text: isEn ? "Request a security assessment" : "Solicitar diagnóstico de seguridad",
      url: "/contacto",
    },
    fallbackSecondary: {
      text: isEn ? "See what a pentest covers" : "Ver alcance de un pentest",
      url: "#soluciones",
    },
  });

  const solutions = isEn ? SOLUTIONS_EN : SOLUTIONS_ES;

  const serviceSchema = getServiceSchema({
    locale,
    name: isEn ? "Cybersecurity and Ethical Hacking" : "Ciberseguridad y Ethical Hacking",
    description: isEn
      ? "Pentesting, red team and cybersecurity audits by certified ethical hackers, under a signed rules-of-engagement agreement."
      : "Pentesting, red team y auditorías de ciberseguridad con hackers éticos certificados, bajo acuerdo de alcance firmado.",
    url: "/servicios/cloud/ciberseguridad-ethical-hacking",
    serviceType: "Penetration Testing and Cybersecurity Consulting",
  });

  const breadcrumb = getBreadcrumbSchema(
    locale,
    isEn
      ? [
          { name: "Home", url: "/en" },
          { name: "Services", url: "/en/services" },
          { name: "Cloud", url: "/en/services/cloud" },
          {
            name: "Cybersecurity and Ethical Hacking",
            url: "/en/services/cloud/ethical-hacking",
          },
        ]
      : [
          { name: "Inicio", url: "/" },
          { name: "Servicios", url: "/servicios" },
          { name: "Cloud", url: "/servicios/cloud" },
          {
            name: "Ciberseguridad y Ethical Hacking",
            url: "/servicios/cloud/ciberseguridad-ethical-hacking",
          },
        ],
  );

  return (
    <PageWrapper>
      <SiblingServicesNav
        parentService={{ name: "Cloud", nameEn: "Cloud", accentColor: ACCENT }}
        siblings={[
          {
            name: "FinOps",
            nameEn: "FinOps",
            url: "/servicios/cloud/finops",
            urlEn: "/en/services/cloud/finops",
          },
          {
            name: "Migración a AWS",
            nameEn: "AWS Migration",
            url: "/servicios/cloud/migracion-aws",
            urlEn: "/en/services/cloud/aws-migration",
          },
          {
            name: "Infraestructura",
            nameEn: "Infrastructure",
            url: "/servicios/cloud/infraestructura",
            urlEn: "/en/services/cloud/infrastructure",
          },
          {
            name: "Seguridad Cloud",
            nameEn: "Cloud Security",
            url: "/servicios/cloud/seguridad",
            urlEn: "/en/services/cloud/security",
          },
          {
            name: "Serverless",
            nameEn: "Serverless",
            url: "/servicios/cloud/serverless",
            urlEn: "/en/services/cloud/serverless",
          },
          {
            name: "Ciberseguridad y Ethical Hacking",
            nameEn: "Cybersecurity & Ethical Hacking",
            url: "/servicios/cloud/ciberseguridad-ethical-hacking",
            urlEn: "/en/services/cloud/ethical-hacking",
          },
        ]}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }}
      />

      <HeroSplit
        heroEffect="particles"
        badge={
          isEn
            ? "Cybersecurity · Ethical Hacking · Pentesting"
            : "Ciberseguridad · Ethical Hacking · Pentesting"
        }
        // El H1 NO sale del CMS: `titleEs` es la etiqueta de la card del hub
        // («Ciberseguridad y Ethical Hacking») y HeroSplit pinta `h1 + h1Accent`,
        // así que tomarlo de ahí producía «Ciberseguridad y Ethical Hacking que un
        // atacante real lo haga». El titular es copy de esta página, no el nombre del servicio.
        h1={isEn ? "We find your vulnerabilities before" : "Encontramos tus vulnerabilidades antes"}
        h1Accent={isEn ? "a real attacker does" : "que un atacante real lo haga"}
        subtitle={
          cms?.subtitle ||
          (isEn
            ? "Pentesting, red team and security audits run by certified ethical hackers. Actionable reports, not generic PDFs."
            : "Pentesting, red team y auditorías de seguridad ejecutadas por hackers éticos certificados. Reportes accionables, no PDFs genéricos.")
        }
        bullets={
          isEn
            ? [
                "Certified ethical hackers (OSCP / CEH / CompTIA PenTest+)",
                "Methodology aligned to OWASP, NIST and MITRE ATT&CK",
                "Executive report + technical report + prioritized remediation plan",
              ]
            : [
                "Hackers éticos certificados (OSCP / CEH / CompTIA PenTest+)",
                "Metodología alineada a OWASP, NIST y MITRE ATT&CK",
                "Reporte ejecutivo + reporte técnico + plan de remediación priorizado",
              ]
        }
        ctaPrimary={ctaPrimary}
        ctaSecondary={ctaSecondary}
        accentColor={ACCENT}
        dataSection="ethical-hacking-hero"
        ariaLabel={
          isEn
            ? "Cybersecurity and Ethical Hacking — pentesting, red team and AI agent security audits"
            : "Ciberseguridad y Ethical Hacking — pentesting, red team y auditoría de seguridad de agentes de IA"
        }
        rightPanel={
          // Panel propio en vez de <HeroSelector>: ese componente lleva su aria-label y su
          // enlace de pie en español duro, y esta página tiene que estar entera en inglés.
          <nav
            aria-label={isEn ? "What we can test" : "Qué podemos probar"}
            className="glass rounded-xl p-5"
          >
            <p className="mb-3 text-xs font-medium uppercase tracking-wider text-text-40">
              {isEn ? "What do you need tested?" : "¿Qué necesitas que probemos?"}
            </p>
            <ul className="space-y-1">
              {(isEn ? HERO_PANEL_EN : HERO_PANEL_ES).map((item) => (
                <li key={item.label}>
                  <Link
                    href="#soluciones"
                    className="flex items-center gap-3 rounded-lg border border-transparent p-2 transition-colors hover:border-white/10 hover:bg-white/[0.03]"
                  >
                    <GeoIconBox name={item.icon} size={16} color="cyan" />
                    <span className="text-sm font-medium text-text-100">{item.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
            <Link
              href="/contacto"
              className="mt-3 block text-center text-xs font-medium transition-colors hover:brightness-125"
              style={{ color: ACCENT }}
            >
              {isEn ? "Or tell us your case →" : "O cuéntanos tu caso →"}
            </Link>
          </nav>
        }
      />

      <MetricsBar
        metrics={
          cms?.metrics?.length
            ? // `servicios.metrics` no tiene columna sublabel — las filas hermanas meten
              // las dos partes en una sola cadena separadas por « — ». Se reparte aquí para
              // que la banda conserve sus dos líneas en vez de un renglón corrido.
              cms.metrics.map((m) => {
                const [label, ...rest] = m.label.split(" — ");
                return { value: m.value, label, sublabel: rest.join(" — "), unit: m.unit };
              })
            : isEn
              ? [
                  { value: "4-6", label: "Weeks", sublabel: "From kickoff to final report" },
                  {
                    value: "100%",
                    label: "Under legal agreement",
                    sublabel: "No test runs without signed authorization",
                  },
                  {
                    value: "4",
                    label: "Phases",
                    sublabel: "Scope, execution, reporting, retest",
                  },
                ]
              : [
                  {
                    value: "4-6",
                    label: "Semanas",
                    sublabel: "De kickoff a reporte final",
                  },
                  {
                    value: "100%",
                    label: "Bajo acuerdo legal",
                    sublabel: "Ninguna prueba sin autorización firmada",
                  },
                  {
                    value: "4",
                    label: "Fases",
                    sublabel: "Alcance, ejecución, reporte, retest",
                  },
                ]
        }
      />

      {/* §3 — Contexto */}
      <section className="py-16 md:py-24">
        <div className="mx-auto max-w-[1280px] px-6 md:px-20">
          <h2 className="max-w-3xl text-3xl font-bold text-text-100 md:text-4xl">
            {isEn
              ? 'Your infrastructure can be "running fine" and still be vulnerable'
              : "Tu infraestructura puede estar «funcionando bien» y aun así ser vulnerable"}
          </h2>
          <div className="mt-6 max-w-3xl space-y-4 text-text-70">
            <p className="leading-relaxed">
              {isEn
                ? "A system that has not failed is not the same as a secure system. Most security breaches are not discovered by an internal alert, but by an attacker who found the flaw first — or worse, by a customer who found out before the company did."
                : "Un sistema que no ha fallado no es lo mismo que un sistema seguro. La mayoría de las brechas de seguridad no se descubren por una alerta interna, sino por un atacante que encontró primero la falla — o peor, por un cliente que se enteró antes que la empresa."}
            </p>
            <p className="leading-relaxed">
              {isEn
                ? "Ethical hacking inverts that logic: you hire someone to try to break into your system using the same techniques a real attacker would, but under an explicit legal agreement, with the sole purpose of showing you the hole before somebody else uses it."
                : "El ethical hacking invierte esa lógica: contratas a alguien para que intente entrar a tu sistema con las mismas técnicas que usaría un atacante real, pero bajo un acuerdo legal explícito, con el único objetivo de mostrarte el hueco antes de que alguien más lo use."}
            </p>
          </div>
        </div>
      </section>

      {/* §4 — Soluciones especializadas. Sin enlace: ninguna tiene página propia todavía. */}
      <section id="soluciones" className="bg-bg-surface py-16 md:py-24">
        <div className="mx-auto max-w-[1280px] px-6 md:px-20">
          <h2 className="text-3xl font-bold text-text-100">
            {isEn ? "Specialised solutions" : "Soluciones especializadas"}
          </h2>
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {solutions.map((s) => (
              <BenefitCard
                key={s.title}
                title={s.title}
                description={s.description}
                icon={s.icon}
                accentColor={ACCENT}
              />
            ))}
          </div>
        </div>
      </section>

      <CmsServicioBenefits
        benefits={cms?.benefits}
        accentColor={ACCENT}
        titleEs="Por qué hacerlo con Nivelics"
        titleEn="Why do it with Nivelics"
        locale={locale}
      />
      <CmsServicioProcess
        steps={cms?.processSteps}
        accentColor={ACCENT}
        titleEs="Cómo lo ejecutamos"
        titleEn="How we run it"
        locale={locale}
      />

      {/* §6 — Proceso */}
      <ProcessTimeline
        title={isEn ? "How an engagement runs" : "Cómo funciona el proceso"}
        steps={isEn ? PROCESS_EN : PROCESS_ES}
        accentColor={ACCENT}
      />

      {/* §7 — Herramientas */}
      <TechStackGrid
        title={isEn ? "Tools we use" : "Herramientas que usamos"}
        categories={isEn ? TOOLS_EN : TOOLS_ES}
      />

      {/* §8 — FAQ. schemaEnabled emite el FAQPage: es la ÚNICA fuente de ese bloque. */}
      <FAQAccordion
        title={isEn ? "Frequently asked questions" : "Preguntas frecuentes"}
        faqs={isEn ? FAQ_EN : FAQ_ES}
        schemaEnabled
      />

      {/* Enlace cruzado hacia la línea hermana */}
      <section className="pb-4">
        <div className="mx-auto max-w-[1280px] px-6 md:px-20">
          <p className="max-w-3xl text-sm leading-relaxed text-text-70">
            {isEn ? (
              <>
                Looking to secure the architecture itself rather than attack it?{" "}
                <Link
                  href="/en/services/cloud/security"
                  className="font-medium text-primary underline-offset-4 hover:underline"
                >
                  See Cloud Security →
                </Link>
              </>
            ) : (
              <>
                ¿Buscas asegurar la arquitectura en vez de atacarla?{" "}
                <Link
                  href="/servicios/cloud/seguridad"
                  className="font-medium text-primary underline-offset-4 hover:underline"
                >
                  Conoce Seguridad Cloud →
                </Link>
              </>
            )}
          </p>
        </div>
      </section>

      {/* §9 — CTA final */}
      <CTABanner
        locale={locale}
        title={
          isEn
            ? "Do you know how exposed your system is?"
            : "¿Sabes qué tan expuesto está tu sistema?"
        }
        description={
          isEn
            ? "An initial assessment shows you the real level of risk before you commit to a full pentest."
            : "Un diagnóstico inicial te muestra el nivel de riesgo real antes de comprometerte a un pentest completo."
        }
        buttonText={
          isEn ? "Request a security assessment →" : "Solicitar diagnóstico de seguridad →"
        }
        buttonHref="/contacto"
        trustLine={
          isEn
            ? "Reply in under 24 hours · Under a confidentiality agreement"
            : "Respuesta en menos de 24 horas · Bajo acuerdo de confidencialidad"
        }
      />

      <StickyMobileCta
        text={isEn ? "Request a security assessment →" : "Solicitar diagnóstico de seguridad →"}
        url="/contacto"
        accentColor={ACCENT}
      />
    </PageWrapper>
  );
}
