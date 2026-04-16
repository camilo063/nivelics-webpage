"use client";

import { useState, useRef, useEffect } from "react";
import type React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTranslations, useLocale } from "next-intl";
import { motion, AnimatePresence } from "framer-motion";
import {
  Menu,
  X,
  ChevronDown,
  Brain,
  Cloud,
  Users,
  Code2,
  TrendingUp,
  PlayCircle,
  HeartPulse,
  ShoppingBag,
  Truck,
  Factory,
  Clock,
  GitBranch,
  Award,
  type LucideIcon,
} from "lucide-react";
import { SITE } from "@/lib/constants";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

/* ── Mega Menu Data ── */

const SERVICES_COLUMNS = [
  {
    title: "Inteligencia Artificial",
    href: "/servicios/inteligencia-artificial",
    icon: Brain,
    color: "#8B5CF6",
    description: "Agentes, automatización y RAG aplicado al negocio",
    metric: { value: "50%", context: "reducción de costos operativos" },
    items: [
      {
        label: "Agentes IA",
        desc: "LLMs que ejecutan tareas reales",
        href: "/servicios/inteligencia-artificial/agentes-ia",
        ariaLabel:
          "Agentes IA — agentes autónomos con LLMs para automatización de ventas, soporte y operaciones",
      },
      {
        label: "Agentes Comerciales",
        desc: "Automatiza tu proceso de ventas",
        href: "/servicios/inteligencia-artificial/agentes-comerciales",
        ariaLabel: "Agentes Comerciales — IA que califica leads y escala oportunidades de venta",
      },
      {
        label: "Automatización de Procesos",
        desc: "Elimina trabajo manual repetitivo",
        href: "/servicios/inteligencia-artificial/automatizacion-procesos",
        ariaLabel:
          "Automatización de Procesos — RPA e IA para eliminar trabajo manual en finanzas, RRHH y logística",
      },
      {
        label: "Gestión de Contenido",
        desc: "SEO y contenido a escala con IA",
        href: "/servicios/inteligencia-artificial/gestion-contenido",
        ariaLabel:
          "Gestión de Contenido — generación y optimización de contenido SEO a escala con IA",
      },
      {
        label: "Marketing y CRM",
        desc: "Prospectos calificados automáticamente",
        href: "/servicios/inteligencia-artificial/marketing-crm",
        ariaLabel:
          "Marketing y CRM — segmentación inteligente y personalización de campañas integrada con tu CRM",
      },
    ],
  },
  {
    title: "Cloud",
    href: "/servicios/cloud",
    icon: Cloud,
    color: "#3B82F6",
    description: "AWS, GCP, Azure con gobierno y FinOps real",
    metric: { value: "40%", context: "reducción gasto cloud promedio" },
    items: [
      {
        label: "FinOps",
        desc: "Gobierno y optimización financiera cloud",
        href: "/servicios/cloud/finops",
        ariaLabel: "FinOps — optimización y gobernanza financiera cloud en AWS, GCP y Azure",
      },
      {
        label: "Migración a AWS",
        desc: "Zero downtime, rollback garantizado",
        href: "/servicios/cloud/migracion-aws",
        ariaLabel: "Migración a AWS — migración cloud con zero downtime y rollback garantizado",
      },
      {
        label: "Infraestructura",
        desc: "Multi-cloud con IaC y observabilidad",
        href: "/servicios/cloud/infraestructura",
        ariaLabel:
          "Infraestructura Cloud — arquitectura multi-cloud con Terraform, CDK y observabilidad",
      },
      {
        label: "Seguridad Cloud",
        desc: "SOC2, ISO27001 y hardening real",
        href: "/servicios/cloud/seguridad",
        ariaLabel: "Seguridad Cloud — compliance SOC2, ISO27001, IAM y cifrado end-to-end",
      },
      {
        label: "Serverless",
        desc: "Pay-per-use, escala automática",
        href: "/servicios/cloud/serverless",
        ariaLabel: "Serverless — arquitecturas event-driven con Lambda y Cloud Functions",
      },
    ],
  },
  {
    title: "Staff Augmentation",
    href: "/servicios/staff-augmentation",
    icon: Users,
    color: "#10B981",
    description: "Talento tech colombiano validado para tu equipo",
    metric: { value: "40%", context: "ahorro vs. contratar en USA o Europa" },
    items: [
      {
        label: "Desarrollo de Software",
        desc: "Backend, frontend, mobile, full-stack",
        href: "/servicios/staff-augmentation/desarrollo-software",
        ariaLabel: "Desarrollo de Software — ingenieros senior React, Node.js, Python, Java, Go",
      },
      {
        label: "Datos e IA",
        desc: "Data engineers, scientists y ML experts",
        href: "/servicios/staff-augmentation/datos-ia",
        ariaLabel: "Datos e IA — Data Scientists, Data Engineers y ML Engineers",
      },
      {
        label: "DevOps & Cloud",
        desc: "SRE, cloud architects, infraestructura",
        href: "/servicios/staff-augmentation/devops-cloud",
        ariaLabel:
          "DevOps y Cloud — Cloud Architects y DevOps Engineers certificados AWS, GCP, Azure",
      },
      {
        label: "Diseño UX/UI",
        desc: "Product designers y UX researchers",
        href: "/servicios/staff-augmentation/diseno-ux-ui",
        ariaLabel: "Diseño UX/UI — Product Designers senior con experiencia en design systems",
      },
      {
        label: "QA & Seguridad",
        desc: "Testers, pentesters y analistas",
        href: "/servicios/staff-augmentation/qa-seguridad",
        ariaLabel: "QA y Seguridad — QA Engineers, SDET y especialistas en ciberseguridad",
      },
    ],
  },
  {
    title: "Desarrollo Digital",
    href: "/servicios/desarrollo-digital",
    icon: Code2,
    color: "#06B6D4",
    description: "Del concepto a producción. Sprints medibles",
    metric: { value: "13", context: "años de proyectos en LATAM y USA" },
    items: [
      {
        label: "Sitios Web Agentic-First",
        desc: "Sitios navegables por IA, agentes y LLMs",
        href: "/servicios/desarrollo-digital/sitios-web-agentic",
        ariaLabel:
          "Sitios Web Agentic-First — sitios optimizados para indexación por LLMs, agentes IA y Google SGE",
      },
      {
        label: "Apps Móviles",
        desc: "iOS, Android, Flutter, React Native",
        href: "/servicios/desarrollo-digital/apps-moviles",
        ariaLabel: "Apps Móviles — desarrollo nativo y cross-platform con React Native y Flutter",
      },
      {
        label: "E-commerce",
        desc: "Plataformas propias sin comisiones",
        href: "/servicios/desarrollo-digital/ecommerce",
        ariaLabel: "E-commerce — plataformas B2B y B2C a medida sin comisiones por transacción",
      },
      {
        label: "Plataformas Web",
        desc: "Arquitectura escalable desde el día 1",
        href: "/servicios/desarrollo-digital/plataformas-web",
        ariaLabel:
          "Sitios Web Agentic-First — sitios optimizados para indexación por LLMs, agentes IA y Google SGE",
      },
    ],
  },
];

const INDUSTRIES_ITEMS: {
  label: string;
  desc: string;
  href: string;
  ariaLabel: string;
  icon: LucideIcon;
  industry: string;
}[] = [
  {
    label: "Fintech",
    desc: "Banca digital, pagos y regulación tech",
    href: "/industrias/fintech",
    ariaLabel: "Fintech — soluciones de IA, Cloud y talento tech para banca digital y pagos",
    icon: TrendingUp,
    industry: "fintech",
  },
  {
    label: "Medios & Entretenimiento",
    desc: "Plataformas de contenido y streaming digital",
    href: "/industrias/medios-entretenimiento",
    ariaLabel:
      "Medios y Entretenimiento — tecnología para plataformas digitales, streaming y contenido",
    icon: PlayCircle,
    industry: "medios-entretenimiento",
  },
  {
    label: "Salud",
    desc: "HealthTech con cumplimiento regulatorio",
    href: "/industrias/salud",
    ariaLabel:
      "Salud — soluciones tech para healthtech con cumplimiento regulatorio HIPAA y locales",
    icon: HeartPulse,
    industry: "salud",
  },
  {
    label: "Retail y E-commerce",
    desc: "Omnicanalidad y última milla digital",
    href: "/industrias/retail-ecommerce",
    ariaLabel:
      "Retail y E-commerce — tecnología para omnicanalidad, experiencia de compra y logística",
    icon: ShoppingBag,
    industry: "retail-ecommerce",
  },
  {
    label: "Logística",
    desc: "Supply chain y trazabilidad en tiempo real",
    href: "/industrias/logistica",
    ariaLabel:
      "Logística — tecnología para supply chain, trazabilidad y automatización de operaciones",
    icon: Truck,
    industry: "logistica",
  },
  {
    label: "Manufactura",
    desc: "Industria 4.0 y automatización de planta",
    href: "/industrias/manufactura",
    ariaLabel:
      "Manufactura — soluciones de Industria 4.0, automatización de procesos y digitalización de planta",
    icon: Factory,
    industry: "manufactura",
  },
];

const NOSOTROS_ITEMS: {
  label: string;
  desc: string;
  href: string;
  ariaLabel: string;
  icon: LucideIcon;
  section: string;
}[] = [
  {
    label: "Historia",
    desc: "13 años construyendo tecnología en LATAM",
    href: "/nosotros/historia",
    ariaLabel: "Historia de Nivelics — fundada en 2012, proyectos en 7 países",
    icon: Clock,
    section: "historia",
  },
  {
    label: "Equipo",
    desc: "CEO, CTO y el equipo detrás de los proyectos",
    href: "/nosotros/equipo",
    ariaLabel: "Equipo directivo de Nivelics — Camilo Villanueva, Jonathan Olarte y líderes",
    icon: Users,
    section: "equipo",
  },
  {
    label: "Metodología",
    desc: "Cómo trabajamos: sprints, entregas y gobierno",
    href: "/nosotros/metodologia",
    ariaLabel: "Metodología de trabajo de Nivelics — agile, sprints, delivery manager",
    icon: GitBranch,
    section: "metodologia",
  },
  {
    label: "Certificaciones",
    desc: "Great Place to Work 2022 · ANDI · AWS Partner",
    href: "/nosotros/certificaciones",
    ariaLabel: "Certificaciones de Nivelics — Great Place to Work Colombia 2022, ANDI, AWS",
    icon: Award,
    section: "certificaciones",
  },
];

const PLAIN_LINKS = [
  { label: "Casos de Éxito", href: "/casos-de-exito" },
  { label: "Blog", href: "/blog" },
] as const;

// Productos SaaS (3 fijos — coinciden con DB: PAYWL, Niveleads, Hirely)
const PRODUCTOS_ITEMS = [
  {
    slug: "paywl",
    name: "PAYWL",
    category: "Medios · LATAM",
    tagline: "Motor de paywall para medios digitales",
    pricingEs: "Desde $450/mes",
    pricingEn: "From $450/month",
    accent: "#00D4FF",
  },
  {
    slug: "niveleads",
    name: "Niveleads",
    category: "Ventas B2B · IA",
    tagline: "Lead scoring con IA. Setup en 24h.",
    pricingEs: "Desde $99/mes",
    pricingEn: "From $99/month",
    accent: "#1D9E75",
  },
  {
    slug: "hirely",
    name: "Hirely",
    category: "RRHH · IA",
    tagline: "ATS con Claude AI, voz, firma digital",
    pricingEs: "Demo gratis",
    pricingEn: "Free demo",
    accent: "#a78bfa",
  },
] as const;

/* ── Hover panel logic ── */

function useHoverPanel() {
  const [open, setOpen] = useState(false);
  const timeout = useRef<ReturnType<typeof setTimeout>>(null);

  function enter() {
    if (timeout.current) clearTimeout(timeout.current);
    setOpen(true);
  }
  function leave() {
    timeout.current = setTimeout(() => setOpen(false), 150);
  }

  useEffect(
    () => () => {
      if (timeout.current) clearTimeout(timeout.current);
    },
    [],
  );

  return { open, setOpen, enter, leave };
}

/* ── Mobile accordion ── */

function MobileAccordion({ title, children }: { title: string; children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  return (
    <div>
      <button
        type="button"
        onClick={() => setOpen(!open)}
        aria-expanded={open}
        className="flex w-full items-center justify-between rounded-lg px-3 py-3 text-base font-medium text-text-100"
      >
        {title}
        <ChevronDown
          size={16}
          className={cn("text-text-40 transition-transform", open && "rotate-180")}
        />
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="pb-2 pl-2">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ── Language switch helpers ── */

function getEsUrl(path: string): string {
  return path || "/";
}

function getEnUrl(path: string): string {
  return path === "/" ? "/en" : "/en" + path;
}

/* ── Nav ── */

interface NavProps {
  logoUrl?: string | null;
  logoAlt?: string;
  logoTitle?: string;
  logo?: React.ReactNode;
}

export function Nav({
  logoUrl = null,
  logoAlt = "Nivelics",
  logoTitle = "Nivelics",
  logo,
}: NavProps = {}) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 10);
    handler();
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);
  const locale = useLocale();
  const t = useTranslations("nav");
  const tIa = useTranslations("navServicesIa");
  const tCloud = useTranslations("navServicesCloud");
  const tStaff = useTranslations("navServicesStaff");
  const tDev = useTranslations("navServicesDev");
  const tInd = useTranslations("navIndustries");
  const tAbout = useTranslations("navAbout");
  const serviciosPanel = useHoverPanel();
  const industriasPanel = useHoverPanel();
  const nosotrosPanel = useHoverPanel();
  const productosPanel = useHoverPanel();

  // Close all panels (on link click)
  const closeAll = () => {
    serviciosPanel.setOpen(false);
    industriasPanel.setOpen(false);
    nosotrosPanel.setOpen(false);
    productosPanel.setOpen(false);
  };

  // Event delegation: close panels when any link inside is clicked
  const handlePanelClick = (e: React.MouseEvent) => {
    const target = e.target as HTMLElement;
    if (target.closest("a")) {
      closeAll();
    }
  };

  // Mutual exclusion: close other panels when one opens
  const serviciosEnter = () => {
    industriasPanel.setOpen(false);
    nosotrosPanel.setOpen(false);
    productosPanel.setOpen(false);
    serviciosPanel.enter();
  };
  const industriasEnter = () => {
    serviciosPanel.setOpen(false);
    nosotrosPanel.setOpen(false);
    productosPanel.setOpen(false);
    industriasPanel.enter();
  };
  const nosotrosEnter = () => {
    serviciosPanel.setOpen(false);
    industriasPanel.setOpen(false);
    productosPanel.setOpen(false);
    nosotrosPanel.enter();
  };
  const productosEnter = () => {
    serviciosPanel.setOpen(false);
    industriasPanel.setOpen(false);
    nosotrosPanel.setOpen(false);
    productosPanel.enter();
  };

  // Close all panels on route change
  useEffect(() => {
    closeAll();
    setMobileOpen(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  function isActive(href: string) {
    return pathname === href || pathname.startsWith(href + "/");
  }

  function close() {
    setMobileOpen(false);
  }

  return (
    <header
      suppressHydrationWarning
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-colors duration-200",
        scrolled || mobileOpen ? "bg-[#0A0A0F] border-b border-white/[0.06]" : "bg-transparent",
      )}
    >
      <nav
        className="mx-auto flex h-16 max-w-[1280px] items-center justify-between px-6 md:px-20"
        aria-label="Navegación principal"
        itemScope
        itemType="https://schema.org/SiteNavigationElement"
      >
        <Link
          href={locale === "en" ? "/en" : "/"}
          className="flex items-center text-xl font-bold text-text-100 tracking-tight"
          itemProp="url"
          aria-label={logoAlt}
          title={logoTitle}
        >
          {logo ??
            (logoUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={logoUrl}
                alt={logoAlt}
                title={logoTitle}
                height={80}
                style={{
                  height: "80px",
                  width: "auto",
                  objectFit: "contain",
                }}
                loading="eager"
                fetchPriority="high"
                itemProp="name"
              />
            ) : (
              <span itemProp="name">{SITE.name}</span>
            ))}
        </Link>

        {/* ── Desktop ── */}
        <div className="flex items-center gap-7 max-lg:hidden">
          {/* Servicios */}
          <div
            className="relative"
            onMouseEnter={serviciosEnter}
            onMouseLeave={serviciosPanel.leave}
          >
            <Link
              href="/servicios"
              aria-haspopup="true"
              aria-expanded={serviciosPanel.open}
              data-nav-category="servicios"
              data-nav-level="hub"
              className={cn(
                "inline-flex items-center gap-1 text-sm font-medium transition-colors",
                isActive("/servicios") ? "text-primary" : "text-text-70 hover:text-text-100",
              )}
            >
              Servicios
              <ChevronDown
                size={14}
                className={cn("transition-transform", serviciosPanel.open && "rotate-180")}
              />
            </Link>
          </div>

          {/* Productos */}
          <div
            className="relative"
            onMouseEnter={productosEnter}
            onMouseLeave={productosPanel.leave}
          >
            <Link
              href="/productos"
              aria-haspopup="true"
              aria-expanded={productosPanel.open}
              data-nav-category="productos"
              data-nav-level="hub"
              className={cn(
                "inline-flex items-center gap-1 text-sm font-medium transition-colors",
                isActive("/productos") ? "text-primary" : "text-text-70 hover:text-text-100",
              )}
            >
              {locale === "en" ? "Products" : "Productos"}
              <ChevronDown
                size={14}
                className={cn("transition-transform", productosPanel.open && "rotate-180")}
              />
            </Link>
          </div>

          {/* Industrias */}
          <div
            className="relative"
            onMouseEnter={industriasEnter}
            onMouseLeave={industriasPanel.leave}
          >
            <Link
              href="/industrias/fintech"
              aria-haspopup="true"
              aria-expanded={industriasPanel.open}
              data-nav-category="industrias"
              data-nav-level="hub"
              className={cn(
                "inline-flex items-center gap-1 text-sm font-medium transition-colors",
                isActive("/industrias") ? "text-primary" : "text-text-70 hover:text-text-100",
              )}
            >
              Industrias
              <ChevronDown
                size={14}
                className={cn("transition-transform", industriasPanel.open && "rotate-180")}
              />
            </Link>
          </div>

          {/* Nosotros */}
          <div className="relative" onMouseEnter={nosotrosEnter} onMouseLeave={nosotrosPanel.leave}>
            <Link
              href="/nosotros"
              aria-haspopup="true"
              aria-expanded={nosotrosPanel.open}
              className={cn(
                "inline-flex items-center gap-1 text-sm font-medium transition-colors",
                isActive("/nosotros") ? "text-primary" : "text-text-70 hover:text-text-100",
              )}
            >
              Nosotros
              <ChevronDown
                size={14}
                className={cn("transition-transform", nosotrosPanel.open && "rotate-180")}
              />
            </Link>
          </div>

          {/* Plain links */}
          {PLAIN_LINKS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              itemProp="url"
              className={cn(
                "text-sm font-medium transition-colors",
                isActive(item.href) ? "text-primary" : "text-text-70 hover:text-text-100",
              )}
            >
              <span itemProp="name">{item.label}</span>
            </Link>
          ))}

          {/* Language switch */}
          <div className="flex items-center gap-1 text-sm">
            <a
              href={getEsUrl(pathname)}
              className={cn(
                "font-medium transition-colors",
                locale === "es" ? "text-text-100" : "text-text-40 hover:text-text-70",
              )}
            >
              ES
            </a>
            <span className="text-text-40/50">|</span>
            <a
              href={getEnUrl(pathname)}
              className={cn(
                "font-medium transition-colors",
                locale === "en" ? "text-text-100" : "text-text-40 hover:text-text-70",
              )}
            >
              EN
            </a>
          </div>

          <Button asChild variant="cta" size="sm">
            <Link href="/contacto">{t("talkToUs")}</Link>
          </Button>
        </div>

        {/* Mobile toggle */}
        <button
          type="button"
          className="text-text-100 lg:!hidden"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label={mobileOpen ? "Cerrar menú" : "Abrir menú"}
        >
          {mobileOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </nav>

      {/* ── Desktop: Servicios Mega Panel ── */}
      <AnimatePresence>
        {serviciosPanel.open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="absolute left-0 right-0 top-16 z-40 max-lg:hidden"
            onMouseEnter={serviciosEnter}
            onMouseLeave={serviciosPanel.leave}
            onClick={handlePanelClick}
          >
            <div
              className="relative border-y border-white/[0.06]"
              style={{ background: "rgba(10,10,15,0.97)", backdropFilter: "blur(20px)" }}
            >
              {/* Puente invisible para cubrir gap entre nav y panel */}
              <div
                aria-hidden="true"
                className="absolute left-0 right-0"
                style={{ top: "-8px", height: "8px" }}
              />
              <div className="mx-auto max-w-[1200px] grid grid-cols-4 gap-6 px-6 py-7">
                {SERVICES_COLUMNS.map((col) => {
                  const Icon = col.icon;
                  const colActive = isActive(col.href);
                  return (
                    <div
                      key={col.href}
                      className="rounded-lg p-3.5"
                      style={{
                        background: `${col.color}08`,
                        borderLeft: `2px solid ${col.color}`,
                      }}
                      data-nav-category="servicios"
                      data-nav-service={col.href.split("/").pop()}
                      data-nav-metric={`${col.metric.value} ${col.metric.context}`}
                    >
                      {/* Column header */}
                      <Link
                        href={col.href}
                        className="flex items-center gap-2 group"
                        aria-label={`${col.title} — ${col.description}`}
                        data-nav-level="hub"
                      >
                        <Icon
                          size={20}
                          style={{ color: col.color }}
                          strokeWidth={1.5}
                          aria-hidden="true"
                        />
                        <span
                          className="text-sm font-semibold transition-colors group-hover:brightness-125"
                          style={{ color: col.color }}
                        >
                          {col.title}
                        </span>
                      </Link>
                      <p className="mt-1 text-[11px] leading-tight text-text-40">
                        {col.description}
                      </p>
                      <p className="mt-2 flex items-baseline gap-1.5">
                        <span className="font-mono text-lg font-bold" style={{ color: col.color }}>
                          {col.metric.value}
                        </span>
                        <span className="text-[10px] text-text-40">{col.metric.context}</span>
                      </p>

                      {/* Sub-items */}
                      <ul className="mt-3 space-y-0.5">
                        {col.items.map((item) => (
                          <li key={item.href}>
                            <Link
                              href={item.href}
                              aria-label={item.ariaLabel}
                              data-nav-category="servicios"
                              data-nav-service={col.href.split("/").pop()}
                              data-nav-level="sub-service"
                              className={cn(
                                "block rounded-md px-2 py-1.5 transition-colors duration-150",
                                pathname === item.href
                                  ? "bg-white/[0.06] text-text-100"
                                  : "hover:bg-white/[0.04]",
                              )}
                            >
                              <span className="block text-[13px] font-medium text-text-100">
                                {item.label}
                              </span>
                              <span className="block text-[11px] text-text-40">{item.desc}</span>
                            </Link>
                          </li>
                        ))}
                      </ul>

                      {/* Footer link */}
                      <div className="mt-2 border-t border-white/[0.06] pt-2">
                        <Link
                          href={col.href}
                          className="text-xs font-medium transition-colors hover:brightness-125"
                          style={{ color: col.color }}
                        >
                          Ver todo {col.title} →
                        </Link>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Desktop: Industrias Panel ── */}
      <AnimatePresence>
        {industriasPanel.open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="absolute left-0 right-0 top-16 z-40 max-lg:hidden"
            onMouseEnter={industriasEnter}
            onMouseLeave={industriasPanel.leave}
            onClick={handlePanelClick}
          >
            <div
              className="relative border-y border-white/[0.06]"
              style={{ background: "rgba(10,10,15,0.97)", backdropFilter: "blur(20px)" }}
            >
              {/* Puente invisible para cubrir gap entre nav y panel */}
              <div
                aria-hidden="true"
                className="absolute left-0 right-0"
                style={{ top: "-8px", height: "8px" }}
              />
              <nav
                className="mx-auto max-w-[720px] px-6 py-7"
                aria-label="Navegación por industrias"
                itemScope
                itemType="https://schema.org/SiteNavigationElement"
              >
                <p
                  className="mb-4 text-[11px] font-medium uppercase tracking-[0.08em]"
                  style={{ color: "rgba(245,158,11,0.7)" }}
                >
                  Industrias que atendemos
                </p>
                <ul className="grid grid-cols-3 gap-3">
                  {INDUSTRIES_ITEMS.map((item) => {
                    const Icon = item.icon;
                    return (
                      <li key={item.href}>
                        <Link
                          href={item.href}
                          aria-label={item.ariaLabel}
                          itemProp="url"
                          data-nav-category="industrias"
                          data-nav-industry={item.industry}
                          className={cn(
                            "flex items-start gap-3 rounded-lg p-3.5 transition-all duration-150 cursor-pointer",
                            pathname === item.href
                              ? "bg-[rgba(245,158,11,0.12)] border border-[rgba(245,158,11,0.3)]"
                              : "bg-[rgba(245,158,11,0.05)] border border-[rgba(245,158,11,0.15)] hover:bg-[rgba(245,158,11,0.10)] hover:border-[rgba(245,158,11,0.3)]",
                          )}
                        >
                          <Icon
                            size={20}
                            className="shrink-0 mt-0.5"
                            style={{ color: "#F59E0B" }}
                            strokeWidth={1.5}
                            aria-hidden="true"
                          />
                          <div>
                            <span
                              className="block text-[13px] font-semibold text-white"
                              itemProp="name"
                            >
                              {item.label}
                            </span>
                            <span
                              className="block text-[11px] leading-snug"
                              style={{ color: "rgba(255,255,255,0.45)" }}
                            >
                              {item.desc}
                            </span>
                          </div>
                        </Link>
                      </li>
                    );
                  })}
                </ul>
                <div className="mt-4 border-t border-white/[0.06] pt-3 text-right">
                  <Link
                    href="/industrias/fintech"
                    className="text-xs font-medium transition-colors hover:brightness-125"
                    style={{ color: "#F59E0B" }}
                  >
                    Ver todas las industrias →
                  </Link>
                </div>
              </nav>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Desktop: Productos Panel ── */}
      <AnimatePresence>
        {productosPanel.open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="absolute left-0 right-0 top-16 z-40 max-lg:hidden"
            onMouseEnter={productosEnter}
            onMouseLeave={productosPanel.leave}
            onClick={handlePanelClick}
          >
            <div
              className="relative border-y border-white/[0.06]"
              style={{ background: "rgba(10,10,15,0.97)", backdropFilter: "blur(20px)" }}
            >
              <div
                aria-hidden="true"
                className="absolute left-0 right-0"
                style={{ top: "-8px", height: "8px" }}
              />
              <nav
                className="mx-auto max-w-[720px] px-6 py-7"
                aria-label={locale === "en" ? "Products navigation" : "Navegación por productos"}
                itemScope
                itemType="https://schema.org/SiteNavigationElement"
              >
                <p
                  className="mb-4 text-[11px] font-medium uppercase tracking-[0.08em]"
                  style={{ color: "rgba(0,212,255,0.75)" }}
                >
                  {locale === "en"
                    ? "Nivelics proprietary software"
                    : "Software propio de Nivelics"}
                </p>
                <ul className="grid grid-cols-3 gap-3">
                  {PRODUCTOS_ITEMS.map((p) => {
                    const href = `/productos/${p.slug}`;
                    const pricing = locale === "en" ? p.pricingEn : p.pricingEs;
                    return (
                      <li key={p.slug}>
                        <Link
                          href={href}
                          itemProp="url"
                          data-nav-category="productos"
                          data-nav-product={p.slug}
                          className="flex flex-col gap-1.5 rounded-lg p-3.5 transition-all duration-150 cursor-pointer bg-white/[0.02] hover:bg-white/[0.06]"
                          style={{
                            borderTop: `2px solid ${p.accent}`,
                            border: `1px solid rgba(255,255,255,0.07)`,
                            borderTopColor: p.accent,
                            borderTopWidth: "2px",
                          }}
                        >
                          <div className="flex items-center gap-2">
                            <div className="w-4 h-4 flex-shrink-0" aria-hidden="true">
                              {p.name === "PAYWL" && (
                                <svg viewBox="0 0 24 24" fill="none" className="w-4 h-4">
                                  <rect
                                    x="3"
                                    y="11"
                                    width="18"
                                    height="11"
                                    rx="2"
                                    stroke={p.accent}
                                    strokeWidth="1.5"
                                  />
                                  <path
                                    d="M7 11V7a5 5 0 0 1 10 0v4"
                                    stroke={p.accent}
                                    strokeWidth="1.5"
                                    strokeLinecap="round"
                                  />
                                </svg>
                              )}
                              {p.name === "Niveleads" && (
                                <svg viewBox="0 0 24 24" fill="none" className="w-4 h-4">
                                  <path
                                    d="M3 3h18v4H3z"
                                    stroke={p.accent}
                                    strokeWidth="1.5"
                                    strokeLinejoin="round"
                                  />
                                  <path
                                    d="M3 10h11v4H3z"
                                    stroke={p.accent}
                                    strokeWidth="1.5"
                                    strokeLinejoin="round"
                                  />
                                  <circle
                                    cx="18"
                                    cy="17"
                                    r="4"
                                    stroke={p.accent}
                                    strokeWidth="1.5"
                                  />
                                  <path
                                    d="M16 17l1.5 1.5L20 15"
                                    stroke={p.accent}
                                    strokeWidth="1.5"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                  />
                                </svg>
                              )}
                              {p.name === "Hirely" && (
                                <svg viewBox="0 0 24 24" fill="none" className="w-4 h-4">
                                  <circle cx="9" cy="7" r="4" stroke={p.accent} strokeWidth="1.5" />
                                  <path
                                    d="M3 21v-2a4 4 0 0 1 4-4h4"
                                    stroke={p.accent}
                                    strokeWidth="1.5"
                                    strokeLinecap="round"
                                  />
                                  <path
                                    d="M16 11l2 2 4-4"
                                    stroke={p.accent}
                                    strokeWidth="1.5"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                  />
                                </svg>
                              )}
                            </div>
                            <span className="text-[13px] font-semibold text-white" itemProp="name">
                              {p.name}
                            </span>
                          </div>
                          <span
                            className="text-[10px] uppercase font-semibold tracking-wider"
                            style={{ color: p.accent, opacity: 0.9 }}
                          >
                            {p.category}
                          </span>
                          <span
                            className="text-[11px] leading-snug"
                            style={{ color: "rgba(255,255,255,0.45)" }}
                          >
                            {p.tagline}
                          </span>
                          <span
                            className="mt-auto text-[11px] font-medium"
                            style={{ color: p.accent }}
                          >
                            {pricing}
                          </span>
                        </Link>
                      </li>
                    );
                  })}
                </ul>
                <div className="mt-4 border-t border-white/[0.06] pt-3 text-right">
                  <Link
                    href="/productos"
                    className="text-xs font-medium transition-colors hover:brightness-125"
                    style={{ color: "#00D4FF" }}
                  >
                    {locale === "en" ? "See all products →" : "Ver todos los productos →"}
                  </Link>
                </div>
              </nav>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Desktop: Nosotros Panel ── */}
      <AnimatePresence>
        {nosotrosPanel.open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="absolute left-0 right-0 top-16 z-40 max-lg:hidden"
            onMouseEnter={nosotrosEnter}
            onMouseLeave={nosotrosPanel.leave}
            onClick={handlePanelClick}
          >
            <div
              className="relative border-y border-white/[0.06]"
              style={{ background: "rgba(10,10,15,0.97)", backdropFilter: "blur(20px)" }}
            >
              {/* Puente invisible para cubrir gap entre nav y panel */}
              <div
                aria-hidden="true"
                className="absolute left-0 right-0"
                style={{ top: "-8px", height: "8px" }}
              />
              <nav
                className="mx-auto max-w-[640px] px-6 py-7"
                aria-label="Navegación sección Nosotros"
                itemScope
                itemType="https://schema.org/SiteNavigationElement"
              >
                <p
                  className="mb-4 text-[11px] font-medium uppercase tracking-[0.08em]"
                  style={{ color: "rgba(99,102,241,0.7)" }}
                >
                  La empresa detrás de los proyectos
                </p>
                <div className="grid grid-cols-[1fr_0.7fr] gap-5">
                  {/* Left: nav items */}
                  <ul className="space-y-2">
                    {NOSOTROS_ITEMS.map((item) => {
                      const Icon = item.icon;
                      return (
                        <li key={item.href}>
                          <Link
                            href={item.href}
                            aria-label={item.ariaLabel}
                            itemProp="url"
                            data-nav-category="nosotros"
                            data-nav-section={item.section}
                            className={cn(
                              "flex items-start gap-3 rounded-lg p-3 transition-all duration-150 cursor-pointer",
                              pathname === item.href
                                ? "bg-[rgba(99,102,241,0.12)] border border-[rgba(99,102,241,0.3)]"
                                : "bg-[rgba(99,102,241,0.05)] border border-[rgba(99,102,241,0.15)] hover:bg-[rgba(99,102,241,0.10)] hover:border-[rgba(99,102,241,0.3)]",
                            )}
                          >
                            <Icon
                              size={20}
                              className="shrink-0 mt-0.5"
                              style={{ color: "#6366F1" }}
                              strokeWidth={1.5}
                              aria-hidden="true"
                            />
                            <div>
                              <span
                                className="block text-[13px] font-semibold text-white"
                                itemProp="name"
                              >
                                {item.label}
                              </span>
                              <span
                                className="block text-[11px] leading-snug"
                                style={{ color: "rgba(255,255,255,0.45)" }}
                              >
                                {item.desc}
                              </span>
                            </div>
                          </Link>
                        </li>
                      );
                    })}
                  </ul>

                  {/* Right: credentials block */}
                  <div
                    className="rounded-lg p-4 flex flex-col justify-between"
                    style={{
                      background: "rgba(99,102,241,0.05)",
                      border: "0.5px solid rgba(99,102,241,0.15)",
                    }}
                  >
                    <div className="space-y-3">
                      <div>
                        <span
                          className="block font-mono text-2xl font-bold"
                          style={{ color: "#6366F1" }}
                        >
                          13
                        </span>
                        <span
                          className="block text-[11px]"
                          style={{ color: "rgba(255,255,255,0.45)" }}
                        >
                          años de experiencia
                        </span>
                      </div>
                      <div>
                        <span
                          className="block font-mono text-2xl font-bold"
                          style={{ color: "#6366F1" }}
                        >
                          7+
                        </span>
                        <span
                          className="block text-[11px]"
                          style={{ color: "rgba(255,255,255,0.45)" }}
                        >
                          países con proyectos activos
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Award
                          size={18}
                          style={{ color: "#6366F1" }}
                          strokeWidth={1.5}
                          aria-hidden="true"
                        />
                        <div>
                          <span className="block text-[13px] font-semibold text-white">
                            Great Place to Work
                          </span>
                          <span
                            className="block text-[11px]"
                            style={{ color: "rgba(255,255,255,0.45)" }}
                          >
                            Colombia · 2022
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="mt-4 border-t border-white/[0.06] pt-3">
                      <p className="text-[11px]" style={{ color: "rgba(255,255,255,0.4)" }}>
                        Empresa colombiana · Sede en Miami
                      </p>
                      <Link
                        href="/nosotros"
                        className="mt-2 block text-xs font-medium"
                        style={{ color: "#6366F1" }}
                      >
                        Conoce nuestra historia →
                      </Link>
                    </div>
                  </div>
                </div>
              </nav>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Mobile drawer ── */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, x: "100%" }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: "100%" }}
            transition={{ type: "tween", duration: 0.25 }}
            className="fixed inset-0 top-16 z-40 bg-bg-base/95 backdrop-blur-md overflow-y-auto lg:!hidden"
          >
            <div className="flex flex-col gap-1 px-4 py-6">
              {/* Servicios */}
              <MobileAccordion title="Servicios">
                <Link
                  href="/servicios"
                  onClick={close}
                  className="block rounded-lg px-3 py-2 text-sm font-medium text-primary"
                >
                  Ver todos los servicios
                </Link>
                {SERVICES_COLUMNS.map((col) => {
                  const Icon = col.icon;
                  return (
                    <MobileAccordion key={col.href} title={col.title}>
                      <Link
                        href={col.href}
                        onClick={close}
                        className="block rounded-lg px-3 py-1.5 text-xs font-medium"
                        style={{ color: col.color }}
                      >
                        Ver todo {col.title} →
                      </Link>
                      {col.items.map((item) => (
                        <Link
                          key={item.href}
                          href={item.href}
                          onClick={close}
                          aria-label={item.ariaLabel}
                          data-nav-category="servicios"
                          data-nav-level="sub-service"
                          className={cn(
                            "block rounded-lg px-3 py-2",
                            pathname === item.href ? "text-primary" : "text-text-70",
                          )}
                        >
                          <span className="block text-sm">{item.label}</span>
                          <span className="block text-[11px] text-text-40">{item.desc}</span>
                        </Link>
                      ))}
                    </MobileAccordion>
                  );
                })}
              </MobileAccordion>

              {/* Productos */}
              <MobileAccordion title={locale === "en" ? "Products" : "Productos"}>
                <Link
                  href="/productos"
                  onClick={close}
                  className="block rounded-lg px-3 py-2 text-sm font-medium text-primary"
                >
                  {locale === "en" ? "All products" : "Todos los productos"}
                </Link>
                {PRODUCTOS_ITEMS.map((p) => (
                  <Link
                    key={p.slug}
                    href={`/productos/${p.slug}`}
                    onClick={close}
                    className="flex items-start gap-3 rounded-lg px-3 py-2.5 text-text-70"
                    style={{ borderLeft: `2px solid ${p.accent}` }}
                  >
                    <div>
                      <span className="block text-sm font-medium text-text-100">{p.name}</span>
                      <span className="block text-[11px] text-text-40">{p.category}</span>
                    </div>
                  </Link>
                ))}
              </MobileAccordion>

              {/* Industrias */}
              <MobileAccordion title="Industrias">
                {INDUSTRIES_ITEMS.map((item) => {
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={close}
                      aria-label={item.ariaLabel}
                      data-nav-category="industrias"
                      data-nav-industry={item.industry}
                      className={cn(
                        "flex items-start gap-3 rounded-lg px-3 py-2.5",
                        pathname === item.href ? "text-primary" : "text-text-70",
                      )}
                    >
                      <Icon
                        size={18}
                        className="shrink-0 mt-0.5"
                        style={{ color: "#F59E0B" }}
                        strokeWidth={1.5}
                        aria-hidden="true"
                      />
                      <div>
                        <span className="block text-sm font-medium">{item.label}</span>
                        <span className="block text-[11px] text-text-40">{item.desc}</span>
                      </div>
                    </Link>
                  );
                })}
              </MobileAccordion>

              {/* Nosotros */}
              <MobileAccordion title="Nosotros">
                <Link
                  href="/nosotros"
                  onClick={close}
                  className="block rounded-lg px-3 py-2 text-sm font-medium text-primary"
                >
                  Sobre Nivelics
                </Link>
                {NOSOTROS_ITEMS.map((item) => {
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={close}
                      aria-label={item.ariaLabel}
                      data-nav-category="nosotros"
                      data-nav-section={item.section}
                      className={cn(
                        "flex items-start gap-3 rounded-lg px-3 py-2.5",
                        pathname === item.href ? "text-primary" : "text-text-70",
                      )}
                    >
                      <Icon
                        size={18}
                        className="shrink-0 mt-0.5"
                        style={{ color: "#6366F1" }}
                        strokeWidth={1.5}
                        aria-hidden="true"
                      />
                      <div>
                        <span className="block text-sm font-medium">{item.label}</span>
                        <span className="block text-[11px] text-text-40">{item.desc}</span>
                      </div>
                    </Link>
                  );
                })}
              </MobileAccordion>

              <div className="border-t border-border mt-3 pt-3">
                {PLAIN_LINKS.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={close}
                    className={cn(
                      "block rounded-lg px-3 py-3 text-base font-medium",
                      isActive(item.href) ? "text-primary" : "text-text-70",
                    )}
                  >
                    {item.label}
                  </Link>
                ))}
              </div>

              {/* Mobile language switch */}
              <div className="flex items-center justify-center gap-2 mt-4 mx-3 text-sm">
                <a
                  href={getEsUrl(pathname)}
                  onClick={close}
                  className={cn(
                    "font-medium px-3 py-1.5 rounded-lg transition-colors",
                    locale === "es" ? "text-text-100 bg-bg-elevated" : "text-text-40",
                  )}
                >
                  ES
                </a>
                <a
                  href={getEnUrl(pathname)}
                  onClick={close}
                  className={cn(
                    "font-medium px-3 py-1.5 rounded-lg transition-colors",
                    locale === "en" ? "text-text-100 bg-bg-elevated" : "text-text-40",
                  )}
                >
                  EN
                </a>
              </div>

              <Button asChild variant="cta" className="mt-4 mx-3">
                <Link href="/contacto" onClick={close}>
                  {t("talkToUs")}
                </Link>
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
