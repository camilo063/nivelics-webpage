"use client";

import { useState, useRef, useEffect, useId } from "react";
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
  Radio,
  ClipboardList,
  type LucideIcon,
} from "lucide-react";
import { SITE } from "@/lib/constants";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { pickLocale } from "@/lib/cms/bilingual";
import { uiLabel, type UiLabelMap } from "@/lib/cms/ui-labels-helper";
import type { Locale } from "@/lib/cms/types";
import type {
  MegaMenuSection,
  MegaMenuColumn,
  NavItem,
} from "@/lib/admin/actions/navegacion.actions";

/* ── Icon resolution ── */

const ICON_MAP: Record<string, LucideIcon> = {
  brain: Brain,
  cloud: Cloud,
  users: Users,
  code2: Code2,
  "trending-up": TrendingUp,
  "play-circle": PlayCircle,
  "heart-pulse": HeartPulse,
  "shopping-bag": ShoppingBag,
  truck: Truck,
  factory: Factory,
  clock: Clock,
  "git-branch": GitBranch,
  award: Award,
  radio: Radio,
  "clipboard-list": ClipboardList,
};

function resolveIcon(name: string | undefined, fallback: LucideIcon): LucideIcon {
  if (!name) return fallback;
  return ICON_MAP[name] ?? fallback;
}

function lastSegment(url: string | undefined): string {
  if (!url) return "";
  const parts = url.split("/").filter(Boolean);
  return parts[parts.length - 1] ?? "";
}

/* ── Derived view-model types (locale-resolved) ── */

interface ServiceSubItem {
  label: string;
  desc: string;
  href: string;
  ariaLabel: string;
}

interface ServiceColumnVM {
  title: string;
  href: string;
  icon: LucideIcon;
  color: string;
  description: string;
  metric: { value: string; context: string };
  items: ServiceSubItem[];
  footerLink: string;
}

interface IndustryItemVM {
  label: string;
  desc: string;
  href: string;
  ariaLabel: string;
  icon: LucideIcon;
  industry: string;
}

interface NosotrosItemVM {
  label: string;
  desc: string;
  href: string;
  ariaLabel: string;
  icon: LucideIcon;
  section: string;
}

interface ProductItemVM {
  slug: string;
  name: string;
  category: string;
  tagline: string;
  pricingEs: string;
  pricingEn: string;
  accent: string;
}

interface PlainLinkVM {
  label: string;
  href: string;
}

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

/* ── Keyboard helpers (a11y): abrir panel con ArrowDown enfoca el primer
   item; Escape dentro del panel devuelve el foco al trigger. ── */
function focusFirstInPanel(panelId: string) {
  window.setTimeout(() => {
    document.getElementById(panelId)?.querySelector<HTMLElement>("a, button")?.focus();
  }, 60);
}

function triggerKeyDown(
  panel: { enter: () => void; setOpen: (v: boolean) => void },
  panelId: string,
) {
  return (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      panel.enter();
      focusFirstInPanel(panelId);
    } else if (e.key === "Escape") {
      panel.setOpen(false);
    }
  };
}

function panelKeyDown(panel: { setOpen: (v: boolean) => void }, triggerId: string) {
  return (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      e.stopPropagation();
      panel.setOpen(false);
      document.getElementById(triggerId)?.focus();
    }
  };
}

/* ── Mobile accordion ── */

function MobileAccordion({ title, children }: { title: string; children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const panelId = useId();
  return (
    <div
      onKeyDown={(e) => {
        if (e.key === "Escape" && open) {
          e.stopPropagation();
          setOpen(false);
        }
      }}
    >
      <button
        type="button"
        onClick={() => setOpen(!open)}
        aria-expanded={open}
        aria-controls={panelId}
        className="flex w-full items-center justify-between rounded-lg px-3 py-3 text-base font-medium text-text-100"
      >
        {title}
        <ChevronDown
          size={16}
          aria-hidden="true"
          className={cn("text-text-40 transition-transform", open && "rotate-180")}
        />
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            id={panelId}
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
  const stripped = path.replace(/^\/en(\/|$)/, "/");
  return stripped || "/";
}

function getEnUrl(path: string): string {
  if (path.startsWith("/en")) return path;
  return path === "/" ? "/en" : "/en" + path;
}

/* ── Nav ── */

interface NavProps {
  logoUrl?: string | null;
  logoAlt?: string;
  logoTitle?: string;
  logo?: React.ReactNode;
  megaMenu?: MegaMenuSection[];
  uiLabels?: UiLabelMap;
}

export function NavClient({
  logoUrl = null,
  logoAlt = "Nivelics",
  logoTitle = "Nivelics",
  logo,
  megaMenu = [],
  uiLabels = {},
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
  const rawLocale = useLocale();
  const locale: Locale = rawLocale === "en" ? "en" : "es";

  // ── DB-driven, locale-resolved view models ──
  const serviciosSection = megaMenu.find((s) => s.kind === "columns");
  const productosSection = megaMenu.find((s) => s.kind === "products");
  const industriasSection = megaMenu.find((s) => s.kind === "grid");
  const nosotrosSection = megaMenu.find((s) => s.kind === "nosotros");

  const plainLinks: PlainLinkVM[] = megaMenu
    .filter((s) => s.kind === "simple")
    .map((s) => ({
      label: pickLocale(locale, s.titleEs, s.titleEn),
      href: s.triggerUrl ?? "/",
    }));

  const serviciosColumns: ServiceColumnVM[] = (serviciosSection?.columns ?? []).map(
    (col: MegaMenuColumn) => ({
      title: pickLocale(locale, col.titleEs, col.titleEn),
      href: col.url,
      icon: resolveIcon(col.icon, Brain),
      color: col.color ?? "#06B6D4",
      description: pickLocale(locale, col.descriptionEs, col.descriptionEn),
      metric: {
        value: col.metricValue ?? "",
        context: pickLocale(locale, col.metricLabelEs, col.metricLabelEn),
      },
      items: (col.items ?? []).map((item: NavItem) => ({
        label: pickLocale(locale, item.labelEs, item.labelEn),
        desc: pickLocale(locale, item.descriptionEs, item.descriptionEn),
        href: item.url,
        ariaLabel: pickLocale(locale, item.ariaLabelEs, item.ariaLabelEn),
      })),
      footerLink: pickLocale(locale, col.footerLinkEs, col.footerLinkEn),
    }),
  );

  const industriesItems: IndustryItemVM[] = (industriasSection?.items ?? []).map(
    (item: NavItem) => ({
      label: pickLocale(locale, item.labelEs, item.labelEn),
      desc: pickLocale(locale, item.descriptionEs, item.descriptionEn),
      href: item.url,
      ariaLabel: pickLocale(locale, item.ariaLabelEs, item.ariaLabelEn),
      icon: resolveIcon(item.icon, TrendingUp),
      industry: lastSegment(item.url),
    }),
  );

  const nosotrosItems: NosotrosItemVM[] = (nosotrosSection?.items ?? []).map((item: NavItem) => ({
    label: pickLocale(locale, item.labelEs, item.labelEn),
    desc: pickLocale(locale, item.descriptionEs, item.descriptionEn),
    href: item.url,
    ariaLabel: pickLocale(locale, item.ariaLabelEs, item.ariaLabelEn),
    icon: resolveIcon(item.icon, Clock),
    section: lastSegment(item.url),
  }));

  const productAccents = ["#00D4FF", "#1D9E75", "#a78bfa"];
  const productosItems: ProductItemVM[] = (productosSection?.items ?? []).map(
    (item: NavItem, idx: number) => ({
      slug: lastSegment(item.url),
      name: pickLocale(locale, item.labelEs, item.labelEn),
      category: pickLocale(locale, item.badgeEs, item.badgeEn),
      tagline: pickLocale(locale, item.descriptionEs, item.descriptionEn),
      pricingEs: "",
      pricingEn: "",
      accent: productAccents[idx] ?? "#00D4FF",
    }),
  );

  // Localized trigger labels
  const serviciosLabel = pickLocale(
    locale,
    serviciosSection?.titleEs ?? "Servicios",
    serviciosSection?.titleEn ?? "Services",
  );
  const productosLabel = pickLocale(
    locale,
    productosSection?.titleEs ?? "Productos",
    productosSection?.titleEn ?? "Products",
  );
  const industriasLabel = pickLocale(
    locale,
    industriasSection?.titleEs ?? "Industrias",
    industriasSection?.titleEn ?? "Industries",
  );
  const nosotrosLabel = pickLocale(
    locale,
    nosotrosSection?.titleEs ?? "Nosotros",
    nosotrosSection?.titleEn ?? "About",
  );

  const serviciosHref = serviciosSection?.triggerUrl ?? "/servicios";
  const productosHref = productosSection?.triggerUrl ?? "/productos";
  const industriasHref = industriasSection?.triggerUrl ?? "/industrias/fintech";
  const nosotrosHref = nosotrosSection?.triggerUrl ?? "/nosotros";

  // Industrias panel copy
  const industriasCaption = pickLocale(
    locale,
    industriasSection?.headerCaptionEs,
    industriasSection?.headerCaptionEn,
  );
  const industriasFooterLinkLabel = pickLocale(
    locale,
    industriasSection?.footerLinkEs,
    industriasSection?.footerLinkEn,
  );
  const industriasFooterLinkHref = industriasSection?.footerLinkUrl ?? industriasHref;

  // Productos panel copy
  const productosCaption = pickLocale(
    locale,
    productosSection?.headerCaptionEs,
    productosSection?.headerCaptionEn,
  );
  const productosFooterLinkLabel = pickLocale(
    locale,
    productosSection?.footerLinkEs,
    productosSection?.footerLinkEn,
  );
  const productosFooterLinkHref = productosSection?.footerLinkUrl ?? "/productos";

  // Nosotros panel copy
  const nosotrosCaption = pickLocale(
    locale,
    nosotrosSection?.headerCaptionEs,
    nosotrosSection?.headerCaptionEn,
  );
  const credentials = nosotrosSection?.credentials;
  const credMetricValue1 = credentials?.metricValue1 ?? "";
  const credMetricLabel1 = pickLocale(
    locale,
    credentials?.metricLabelEs1,
    credentials?.metricLabelEn1,
  );
  const credMetricValue2 = credentials?.metricValue2 ?? "";
  const credMetricLabel2 = pickLocale(
    locale,
    credentials?.metricLabelEs2,
    credentials?.metricLabelEn2,
  );
  const credAwardName = credentials?.awardName ?? "Great Place to Work";
  const credAwardCaption = pickLocale(
    locale,
    credentials?.awardCaptionEs,
    credentials?.awardCaptionEn,
  );
  const credFooterCaption = pickLocale(
    locale,
    credentials?.footerCaptionEs,
    credentials?.footerCaptionEn,
  );
  const credCtaText = pickLocale(locale, credentials?.ctaTextEs, credentials?.ctaTextEn);
  const credCtaUrl = credentials?.ctaUrl ?? "/nosotros";

  // UI labels come from the `ui_labels` table (editable from /admin/ui-labels).
  const allServicesLabel = uiLabel(uiLabels, "nav.all_services", locale);
  const allProductsLabel = uiLabel(uiLabels, "nav.all_products", locale);
  const aboutNivelicsLabel = uiLabel(uiLabels, "nav.about_nivelics", locale);
  const mainNavAria = uiLabel(uiLabels, "nav.aria_main", locale);
  const industriesNavAria = uiLabel(uiLabels, "nav.aria_industries", locale);
  const productsNavAria = uiLabel(uiLabels, "nav.aria_products", locale);
  const aboutNavAria = uiLabel(uiLabels, "nav.aria_about", locale);
  const closeMenuAria = uiLabel(uiLabels, "nav.aria_close_menu", locale);
  const openMenuAria = uiLabel(uiLabels, "nav.aria_open_menu", locale);

  const t = useTranslations("nav");
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
        aria-label={mainNavAria}
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
              href={serviciosHref}
              id="nav-trigger-servicios"
              aria-haspopup="true"
              aria-expanded={serviciosPanel.open}
              aria-controls="nav-panel-servicios"
              onKeyDown={triggerKeyDown(serviciosPanel, "nav-panel-servicios")}
              data-nav-category="servicios"
              data-nav-level="hub"
              className={cn(
                "inline-flex items-center gap-1 text-sm font-medium transition-colors",
                isActive("/servicios") ? "text-primary" : "text-text-70 hover:text-text-100",
              )}
            >
              {serviciosLabel}
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
              href={productosHref}
              id="nav-trigger-productos"
              aria-haspopup="true"
              aria-expanded={productosPanel.open}
              aria-controls="nav-panel-productos"
              onKeyDown={triggerKeyDown(productosPanel, "nav-panel-productos")}
              data-nav-category="productos"
              data-nav-level="hub"
              className={cn(
                "inline-flex items-center gap-1 text-sm font-medium transition-colors",
                isActive("/productos") ? "text-primary" : "text-text-70 hover:text-text-100",
              )}
            >
              {productosLabel}
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
              href={industriasHref}
              id="nav-trigger-industrias"
              aria-haspopup="true"
              aria-expanded={industriasPanel.open}
              aria-controls="nav-panel-industrias"
              onKeyDown={triggerKeyDown(industriasPanel, "nav-panel-industrias")}
              data-nav-category="industrias"
              data-nav-level="hub"
              className={cn(
                "inline-flex items-center gap-1 text-sm font-medium transition-colors",
                isActive("/industrias") ? "text-primary" : "text-text-70 hover:text-text-100",
              )}
            >
              {industriasLabel}
              <ChevronDown
                size={14}
                className={cn("transition-transform", industriasPanel.open && "rotate-180")}
              />
            </Link>
          </div>

          {/* Nosotros */}
          <div className="relative" onMouseEnter={nosotrosEnter} onMouseLeave={nosotrosPanel.leave}>
            <Link
              href={nosotrosHref}
              id="nav-trigger-nosotros"
              aria-haspopup="true"
              aria-expanded={nosotrosPanel.open}
              aria-controls="nav-panel-nosotros"
              onKeyDown={triggerKeyDown(nosotrosPanel, "nav-panel-nosotros")}
              className={cn(
                "inline-flex items-center gap-1 text-sm font-medium transition-colors",
                isActive("/nosotros") ? "text-primary" : "text-text-70 hover:text-text-100",
              )}
            >
              {nosotrosLabel}
              <ChevronDown
                size={14}
                className={cn("transition-transform", nosotrosPanel.open && "rotate-180")}
              />
            </Link>
          </div>

          {/* Plain links */}
          {plainLinks.map((item) => (
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
              aria-current={locale === "es" ? "page" : undefined}
              className={cn(
                "font-medium transition-colors",
                locale === "es" ? "text-text-100" : "text-text-40 hover:text-text-70",
              )}
            >
              ES
            </a>
            <span aria-hidden="true" className="text-text-40">
              |
            </span>
            <a
              href={getEnUrl(pathname)}
              aria-current={locale === "en" ? "page" : undefined}
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
          aria-label={mobileOpen ? closeMenuAria : openMenuAria}
          aria-expanded={mobileOpen}
          aria-controls="mobile-nav-drawer"
        >
          {mobileOpen ? <X size={24} aria-hidden="true" /> : <Menu size={24} aria-hidden="true" />}
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
            id="nav-panel-servicios"
            role="region"
            aria-label={serviciosLabel}
            className="absolute left-0 right-0 top-16 z-40 max-lg:hidden"
            onMouseEnter={serviciosEnter}
            onMouseLeave={serviciosPanel.leave}
            onClick={handlePanelClick}
            onKeyDown={panelKeyDown(serviciosPanel, "nav-trigger-servicios")}
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
                {serviciosColumns.map((col) => {
                  const Icon = col.icon;
                  return (
                    <div
                      key={col.href}
                      className="rounded-lg p-3.5"
                      style={{
                        background: `${col.color}08`,
                        borderLeft: `2px solid ${col.color}`,
                      }}
                      data-nav-category="servicios"
                      data-nav-service={lastSegment(col.href)}
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
                        <span className="text-xs text-text-40">{col.metric.context}</span>
                      </p>

                      {/* Sub-items */}
                      <ul className="mt-3 space-y-0.5">
                        {col.items.map((item) => (
                          <li key={item.href}>
                            <Link
                              href={item.href}
                              aria-label={item.ariaLabel}
                              data-nav-category="servicios"
                              data-nav-service={lastSegment(col.href)}
                              data-nav-level="sub-service"
                              className={cn(
                                "block rounded-md px-2 py-1.5 transition-colors duration-150",
                                pathname === item.href
                                  ? "bg-white/[0.06] text-text-100"
                                  : "hover:bg-white/[0.04]",
                              )}
                            >
                              <span className="block text-sm font-medium text-text-100">
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
                          {col.footerLink}
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
            id="nav-panel-industrias"
            role="region"
            aria-label={industriasLabel}
            className="absolute left-0 right-0 top-16 z-40 max-lg:hidden"
            onMouseEnter={industriasEnter}
            onMouseLeave={industriasPanel.leave}
            onClick={handlePanelClick}
            onKeyDown={panelKeyDown(industriasPanel, "nav-trigger-industrias")}
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
                aria-label={industriesNavAria}
                itemScope
                itemType="https://schema.org/SiteNavigationElement"
              >
                <p
                  className="mb-4 text-[11px] font-medium uppercase tracking-[0.08em]"
                  style={{ color: "rgba(245,158,11,0.7)" }}
                >
                  {industriasCaption}
                </p>
                <ul className="grid grid-cols-3 gap-3">
                  {industriesItems.map((item) => {
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
                              className="block text-sm font-semibold text-white"
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
                    href={industriasFooterLinkHref}
                    className="text-xs font-medium transition-colors hover:brightness-125"
                    style={{ color: "#F59E0B" }}
                  >
                    {industriasFooterLinkLabel}
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
            id="nav-panel-productos"
            role="region"
            aria-label={productosLabel}
            className="absolute left-0 right-0 top-16 z-40 max-lg:hidden"
            onMouseEnter={productosEnter}
            onMouseLeave={productosPanel.leave}
            onClick={handlePanelClick}
            onKeyDown={panelKeyDown(productosPanel, "nav-trigger-productos")}
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
                aria-label={productsNavAria}
                itemScope
                itemType="https://schema.org/SiteNavigationElement"
              >
                <p
                  className="mb-4 text-[11px] font-medium uppercase tracking-[0.08em]"
                  style={{ color: "rgba(0,212,255,0.75)" }}
                >
                  {productosCaption}
                </p>
                <ul className="grid grid-cols-3 gap-3">
                  {productosItems.map((p) => {
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
                            <span className="text-sm font-semibold text-white" itemProp="name">
                              {p.name}
                            </span>
                          </div>
                          <span
                            className="text-[11px] uppercase font-semibold tracking-wider"
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
                    href={productosFooterLinkHref}
                    className="text-xs font-medium transition-colors hover:brightness-125"
                    style={{ color: "#00D4FF" }}
                  >
                    {productosFooterLinkLabel}
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
            id="nav-panel-nosotros"
            role="region"
            aria-label={nosotrosLabel}
            className="absolute left-0 right-0 top-16 z-40 max-lg:hidden"
            onMouseEnter={nosotrosEnter}
            onMouseLeave={nosotrosPanel.leave}
            onClick={handlePanelClick}
            onKeyDown={panelKeyDown(nosotrosPanel, "nav-trigger-nosotros")}
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
                aria-label={aboutNavAria}
                itemScope
                itemType="https://schema.org/SiteNavigationElement"
              >
                <p
                  className="mb-4 text-[11px] font-medium uppercase tracking-[0.08em]"
                  style={{ color: "rgba(99,102,241,0.7)" }}
                >
                  {nosotrosCaption}
                </p>
                <div className="grid grid-cols-[1fr_0.7fr] gap-5">
                  {/* Left: nav items */}
                  <ul className="space-y-2">
                    {nosotrosItems.map((item) => {
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
                                className="block text-sm font-semibold text-white"
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
                          {credMetricValue1}
                        </span>
                        <span
                          className="block text-[11px]"
                          style={{ color: "rgba(255,255,255,0.45)" }}
                        >
                          {credMetricLabel1}
                        </span>
                      </div>
                      <div>
                        <span
                          className="block font-mono text-2xl font-bold"
                          style={{ color: "#6366F1" }}
                        >
                          {credMetricValue2}
                        </span>
                        <span
                          className="block text-[11px]"
                          style={{ color: "rgba(255,255,255,0.45)" }}
                        >
                          {credMetricLabel2}
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
                          <span className="block text-sm font-semibold text-white">
                            {credAwardName}
                          </span>
                          <span
                            className="block text-[11px]"
                            style={{ color: "rgba(255,255,255,0.45)" }}
                          >
                            {credAwardCaption}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="mt-4 border-t border-white/[0.06] pt-3">
                      <p className="text-[11px]" style={{ color: "rgba(255,255,255,0.4)" }}>
                        {credFooterCaption}
                      </p>
                      <Link
                        href={credCtaUrl}
                        className="mt-2 block text-xs font-medium"
                        style={{ color: "#6366F1" }}
                      >
                        {credCtaText}
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
            id="mobile-nav-drawer"
            initial={{ opacity: 0, x: "100%" }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: "100%" }}
            transition={{ type: "tween", duration: 0.25 }}
            className="fixed inset-0 top-16 z-40 bg-bg-base/95 backdrop-blur-md overflow-y-auto lg:!hidden"
          >
            <div className="flex flex-col gap-1 px-4 py-6">
              {/* Servicios */}
              <MobileAccordion title={serviciosLabel}>
                <Link
                  href={serviciosHref}
                  onClick={close}
                  className="block rounded-lg px-3 py-2 text-sm font-medium text-primary"
                >
                  {allServicesLabel}
                </Link>
                {serviciosColumns.map((col) => {
                  return (
                    <MobileAccordion key={col.href} title={col.title}>
                      <Link
                        href={col.href}
                        onClick={close}
                        className="block rounded-lg px-3 py-1.5 text-xs font-medium"
                        style={{ color: col.color }}
                      >
                        {col.footerLink}
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
              <MobileAccordion title={productosLabel}>
                <Link
                  href={productosHref}
                  onClick={close}
                  className="block rounded-lg px-3 py-2 text-sm font-medium text-primary"
                >
                  {allProductsLabel}
                </Link>
                {productosItems.map((p) => (
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
              <MobileAccordion title={industriasLabel}>
                {industriesItems.map((item) => {
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
              <MobileAccordion title={nosotrosLabel}>
                <Link
                  href={nosotrosHref}
                  onClick={close}
                  className="block rounded-lg px-3 py-2 text-sm font-medium text-primary"
                >
                  {aboutNivelicsLabel}
                </Link>
                {nosotrosItems.map((item) => {
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
                {plainLinks.map((item) => (
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
