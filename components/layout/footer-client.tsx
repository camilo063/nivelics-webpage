"use client";

import { useLocale } from "next-intl";
import Link from "next/link";
import { SITE } from "@/lib/constants";
import { pickLocale } from "@/lib/cms/bilingual";
import { uiLabel, type UiLabelMap } from "@/lib/cms/ui-labels-helper";
import type { FooterData } from "@/lib/admin/actions/navegacion.actions";
import type { Locale } from "@/lib/cms";

interface FooterClientProps {
  logoUrl?: string | null;
  logoAlt?: string;
  logoTitle?: string;
  logoWidth?: number | null;
  logoHeight?: number | null;
  footer?: FooterData;
  uiLabels?: UiLabelMap;
}

function SocialIcon({ href, label, svg }: { href: string; label: string; svg: React.ReactNode }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      className="flex h-9 w-9 items-center justify-center rounded-lg border border-border text-text-40 transition-colors hover:border-primary hover:text-primary"
    >
      {svg}
    </a>
  );
}

export function FooterClient({
  logoUrl = null,
  logoAlt = "Nivelics",
  logoTitle = "Nivelics",
  logoWidth = null,
  logoHeight = null,
  footer,
  uiLabels = {},
}: FooterClientProps) {
  const rawLocale = useLocale();
  const locale: Locale = rawLocale === "en" ? "en" : "es";

  // Values come from navConfig.footer first; fall back to ui_labels if the
  // footer row has not been seeded yet.
  const brandTagline = footer?.brandTaglineEs
    ? pickLocale(locale, footer.brandTaglineEs, footer.brandTaglineEn)
    : uiLabel(uiLabels, "footer.default_brand_tagline", locale);

  const copyright = footer?.copyrightEs
    ? pickLocale(locale, footer.copyrightEs, footer.copyrightEn)
    : uiLabel(uiLabels, "footer.default_copyright", locale);

  const contactColumnTitle =
    footer?.contactColumnTitleEs || footer?.contactColumnTitleEn
      ? pickLocale(locale, footer?.contactColumnTitleEs ?? "", footer?.contactColumnTitleEn ?? "")
      : uiLabel(uiLabels, "footer.default_contact_title", locale);

  const contactWhatsappLabel = footer?.contactWhatsappLabelEs
    ? pickLocale(locale, footer.contactWhatsappLabelEs, footer.contactWhatsappLabelEn)
    : "WhatsApp";

  const contactSupportLabel = footer?.contactSupportLabelEs
    ? pickLocale(locale, footer.contactSupportLabelEs, footer.contactSupportLabelEn)
    : uiLabel(uiLabels, "footer.default_support", locale);

  const contactEmail = footer?.contactEmail || SITE.email;
  const contactWhatsappUrl =
    footer?.contactWhatsappUrl || `https://wa.me/${SITE.whatsapp.replace("+", "")}`;
  const contactSupportUrl = footer?.contactSupportUrl || "/soporte";

  const columns = footer?.columns ?? [];
  const legalLinks = footer?.legalLinks ?? [];
  const socialLinkedin = footer?.socialLinkedin || "https://www.linkedin.com/company/nivelics";
  const socialInstagram = footer?.socialInstagram || "https://www.instagram.com/nivelics";

  return (
    <footer className="border-t border-border bg-bg-surface">
      <div className="mx-auto max-w-[1280px] px-6 py-16 md:px-20">
        <div className="grid gap-12 sm:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div className="space-y-4">
            <Link
              href={locale === "en" ? "/en" : "/"}
              className="flex items-center text-xl font-bold text-text-100 tracking-tight"
              aria-label={logoAlt}
              title={logoTitle}
            >
              {logoUrl && logoWidth && logoHeight ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={logoUrl}
                  alt={logoAlt}
                  title={logoTitle}
                  width={logoWidth}
                  height={logoHeight}
                  style={{
                    height: "28px",
                    width: "auto",
                    objectFit: "contain",
                  }}
                  loading="lazy"
                />
              ) : (
                SITE.name
              )}
            </Link>
            <p className="text-sm leading-relaxed text-text-70 whitespace-pre-line">
              {brandTagline}
            </p>
            <div className="flex flex-col gap-1 text-sm text-text-40">
              {SITE.locations.map((loc) => (
                <span key={loc}>{loc}</span>
              ))}
            </div>
            <div className="flex gap-3 pt-2">
              <SocialIcon
                href={socialLinkedin}
                label="Nivelics LinkedIn"
                svg={
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    aria-hidden="true"
                  >
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                  </svg>
                }
              />
              <SocialIcon
                href={socialInstagram}
                label="Nivelics Instagram"
                svg={
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    aria-hidden="true"
                  >
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
                  </svg>
                }
              />
            </div>
          </div>

          {/* Dynamic DB columns (Services, Products, Industries, Company) */}
          {columns[0] ? (
            <div className="space-y-4">
              <p className="text-sm font-semibold uppercase tracking-wider text-text-40">
                {pickLocale(locale, columns[0].titleEs, columns[0].titleEn)}
              </p>
              <ul className="space-y-3">
                {columns[0].links.map((l) => (
                  <li key={l.url + l.labelEs}>
                    <Link
                      href={l.url}
                      className="text-sm text-text-70 transition-colors hover:text-primary"
                    >
                      {pickLocale(locale, l.labelEs, l.labelEn)}
                    </Link>
                  </li>
                ))}
              </ul>

              {columns[1] ? (
                <>
                  <p className="mt-6 text-sm font-semibold uppercase tracking-wider text-text-40">
                    {pickLocale(locale, columns[1].titleEs, columns[1].titleEn)}
                  </p>
                  <ul className="space-y-3">
                    {columns[1].links.map((l) => (
                      <li key={l.url + l.labelEs}>
                        <Link
                          href={l.url}
                          className="text-sm text-text-70 transition-colors hover:text-primary"
                        >
                          {pickLocale(locale, l.labelEs, l.labelEn)}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </>
              ) : null}
            </div>
          ) : null}

          {columns[2] ? (
            <div className="space-y-4">
              <p className="text-sm font-semibold uppercase tracking-wider text-text-40">
                {pickLocale(locale, columns[2].titleEs, columns[2].titleEn)}
              </p>
              <ul className="space-y-3">
                {columns[2].links.map((l) => (
                  <li key={l.url + l.labelEs}>
                    <Link
                      href={l.url}
                      className="text-sm text-text-70 transition-colors hover:text-primary"
                    >
                      {pickLocale(locale, l.labelEs, l.labelEn)}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}

          {/* Company column + Contact block */}
          <div className="space-y-6">
            {columns[3] ? (
              <div className="space-y-4">
                <p className="text-sm font-semibold uppercase tracking-wider text-text-40">
                  {pickLocale(locale, columns[3].titleEs, columns[3].titleEn)}
                </p>
                <ul className="space-y-3">
                  {columns[3].links.map((l) => (
                    <li key={l.url + l.labelEs}>
                      <Link
                        href={l.url}
                        className="text-sm text-text-70 transition-colors hover:text-primary"
                      >
                        {pickLocale(locale, l.labelEs, l.labelEn)}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}

            <div className="space-y-4">
              <p className="text-sm font-semibold uppercase tracking-wider text-text-40">
                {contactColumnTitle}
              </p>
              <ul className="space-y-3 text-sm text-text-70">
                <li>
                  <a
                    href={`mailto:${contactEmail}`}
                    className="transition-colors hover:text-primary"
                    aria-label="Email Nivelics"
                  >
                    {contactEmail}
                  </a>
                </li>
                <li>
                  <a
                    href={contactWhatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="transition-colors hover:text-primary"
                    aria-label="WhatsApp Nivelics"
                  >
                    {contactWhatsappLabel}
                  </a>
                </li>
                <li>
                  <Link href={contactSupportUrl} className="transition-colors hover:text-primary">
                    {contactSupportLabel}
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-12 border-t border-border pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-text-40">
          <span>
            &copy; {new Date().getFullYear()} {SITE.name}. {copyright}
          </span>
          <div className="flex gap-6">
            {legalLinks.map((l) => (
              <Link key={l.url} href={l.url} className="transition-colors hover:text-primary">
                {pickLocale(locale, l.labelEs, l.labelEn)}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
