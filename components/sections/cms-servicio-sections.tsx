// CMS-connected: 2026-05-07 — bridges MappedServicio.benefits / processSteps / CTAs
// to the existing UI primitives so admin edits in /admin/servicios reach the public site.
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { GeoIconBox } from "@/lib/icons/geometric";
import { ProcessTimeline } from "@/components/sections/process-timeline";
import type { MappedServicio, Locale } from "@/lib/cms/types";

interface BenefitsProps {
  benefits: MappedServicio["benefits"] | undefined;
  accentColor: string;
  titleEs?: string;
  titleEn?: string;
  locale: Locale;
}

export function CmsServicioBenefits({
  benefits,
  accentColor,
  titleEs = "Beneficios clave",
  titleEn = "Key benefits",
  locale,
}: BenefitsProps) {
  if (!benefits?.length) return null;
  const isEn = locale === "en";
  const title = isEn ? titleEn : titleEs;
  return (
    <section className="py-12 md:py-16" data-section="cms-benefits">
      <div className="mx-auto max-w-[1280px] px-6 md:px-20">
        <h2 className="text-3xl font-bold text-text-100 md:text-4xl">{title}</h2>
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {benefits.map((b) => (
            <div
              key={b.title}
              className="glass glow-hover rounded-xl p-6"
              style={{ borderTop: `2px solid ${accentColor}` }}
            >
              <GeoIconBox name={b.icon} size={20} color="cyan" />
              <h3 className="mt-3 text-lg font-semibold text-text-100">{b.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-text-70">{b.copy}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

interface ProcessProps {
  steps: MappedServicio["processSteps"] | undefined;
  accentColor: string;
  titleEs?: string;
  titleEn?: string;
  locale: Locale;
}

export function CmsServicioProcess({
  steps,
  accentColor,
  titleEs = "Cómo lo implementamos",
  titleEn = "How we deliver",
  locale,
}: ProcessProps) {
  if (!steps?.length) return null;
  const isEn = locale === "en";
  const title = isEn ? titleEn : titleEs;
  return (
    <ProcessTimeline
      title={title}
      accentColor={accentColor}
      steps={steps.map((s) => ({
        number: String(s.number).padStart(2, "0"),
        title: s.title,
        description: s.desc,
        duration: s.duration,
      }))}
    />
  );
}

interface CtaProps {
  primary: { text: string; url: string | null } | null;
  secondary?: { text: string; url: string | null } | null;
  fallbackPrimary: { text: string; url: string };
  fallbackSecondary?: { text: string; url: string };
}

/**
 * Resolves the CTAs for a HeroSplit-like component, preferring CMS values
 * when present, falling back to hardcoded defaults otherwise.
 */
export function resolveServicioCtas({
  primary,
  secondary,
  fallbackPrimary,
  fallbackSecondary,
}: CtaProps) {
  const ctaPrimary = {
    text: primary?.text?.trim() || fallbackPrimary.text,
    url: primary?.url?.trim() || fallbackPrimary.url,
  };
  const ctaSecondary = fallbackSecondary
    ? {
        text: secondary?.text?.trim() || fallbackSecondary.text,
        url: secondary?.url?.trim() || fallbackSecondary.url,
      }
    : undefined;
  return { ctaPrimary, ctaSecondary };
}

/**
 * Renders a hub-style sub-services grid pulled from CMS sub-services.
 * Falls back to the hardcoded array when the CMS list is empty.
 */
interface SubServiceCard {
  icon: string | null;
  title: string;
  description: string;
  href: string;
}

interface SubServicesProps {
  cmsItems: Array<{ slug: string; title: string; subtitle: string; icon: string | null }>;
  fallback: SubServiceCard[];
  parentSlug: string;
  titleEs?: string;
  titleEn?: string;
  locale: Locale;
  iconColor?: "cyan" | "violet" | "green" | "amber" | "red";
}

export function CmsSubServicesGrid({
  cmsItems,
  fallback,
  parentSlug,
  titleEs = "Soluciones especializadas",
  titleEn = "Specialised solutions",
  locale,
  iconColor = "cyan",
}: SubServicesProps) {
  const isEn = locale === "en";
  const items: SubServiceCard[] = cmsItems.length
    ? cmsItems.map((s) => ({
        icon: s.icon,
        title: s.title,
        description: s.subtitle,
        href: `/servicios/${parentSlug}/${s.slug}`,
      }))
    : fallback;
  if (!items.length) return null;
  const title = isEn ? titleEn : titleEs;
  return (
    <section id="sub-services" className="bg-bg-surface py-16 md:py-24">
      <div className="mx-auto max-w-[1280px] px-6 md:px-20">
        <h2 className="text-3xl font-bold text-text-100">{title}</h2>
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((s) => (
            <Link
              key={s.href}
              href={s.href}
              className="glass glow-hover rounded-xl p-6 block group cursor-pointer"
            >
              <GeoIconBox name={s.icon ?? undefined} size={20} color={iconColor} />
              <h3 className="text-lg font-semibold text-text-100 group-hover:text-primary transition-colors">
                {s.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-text-70">{s.description}</p>
              <span className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-primary">
                {isEn ? "Learn more" : "Conocer más"} <ArrowRight size={14} />
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

/**
 * Buttons-only CTA strip that consumes the CMS ctaPrimary and ctaSecondary
 * fields, with hardcoded fallbacks. Used at the bottom of subservice pages
 * that don't already render CTAs through HeroSplit/CTABanner.
 */
interface CtaStripProps {
  primary: { text: string; url: string | null } | null;
  secondary?: { text: string; url: string | null } | null;
  fallbackPrimary: { text: string; url: string };
  fallbackSecondary?: { text: string; url: string };
}

export function CmsServicioCtaStrip(props: CtaStripProps) {
  const { ctaPrimary, ctaSecondary } = resolveServicioCtas(props);
  if (!ctaPrimary.text) return null;
  return (
    <section className="py-10 md:py-14" data-section="cms-cta-strip">
      <div className="mx-auto max-w-[1280px] px-6 md:px-20">
        <div className="flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
          <Button asChild variant="cta" size="lg">
            <Link href={ctaPrimary.url || "/contacto"}>
              {ctaPrimary.text} <ArrowRight size={18} />
            </Link>
          </Button>
          {ctaSecondary?.text ? (
            <Button asChild variant="outline" size="lg">
              <Link href={ctaSecondary.url || "/contacto"}>{ctaSecondary.text}</Link>
            </Button>
          ) : null}
        </div>
      </div>
    </section>
  );
}
