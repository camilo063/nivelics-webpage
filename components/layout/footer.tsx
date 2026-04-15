"use client";

import { useTranslations } from "next-intl";
import Link from "next/link";
import { SITE } from "@/lib/constants";

interface FooterProps {
  logoUrl?: string | null;
  logoAlt?: string;
  logoTitle?: string;
  logoWidth?: number | null;
  logoHeight?: number | null;
}

export function Footer({
  logoUrl = null,
  logoAlt = "Nivelics",
  logoTitle = "Nivelics",
  logoWidth = null,
  logoHeight = null,
}: FooterProps = {}) {
  const t = useTranslations("footer");

  return (
    <footer className="border-t border-border bg-bg-surface">
      <div className="mx-auto max-w-[1280px] px-6 py-16 md:px-20">
        <div className="grid gap-12 sm:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div className="space-y-4">
            <Link
              href="/"
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
              {t("tagline")}
            </p>
            <div className="flex flex-col gap-1 text-sm text-text-40">
              {SITE.locations.map((loc) => (
                <span key={loc}>{loc}</span>
              ))}
            </div>
            <div className="flex gap-3 pt-2">
              <a
                href="https://www.linkedin.com/company/nivelics"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Nivelics LinkedIn"
                className="flex h-9 w-9 items-center justify-center rounded-lg border border-border text-text-40 transition-colors hover:border-primary hover:text-primary"
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                </svg>
              </a>
              <a
                href="https://www.instagram.com/nivelics"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Nivelics Instagram"
                className="flex h-9 w-9 items-center justify-center rounded-lg border border-border text-text-40 transition-colors hover:border-primary hover:text-primary"
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
                </svg>
              </a>
            </div>
          </div>

          {/* Services */}
          <div className="space-y-4">
            <p className="text-sm font-semibold uppercase tracking-wider text-text-40">
              {t("services")}
            </p>
            <ul className="space-y-3">
              <li>
                <Link
                  href="/servicios/inteligencia-artificial"
                  className="text-sm text-text-70 transition-colors hover:text-primary"
                >
                  {t("ia")}
                </Link>
              </li>
              <li>
                <Link
                  href="/servicios/cloud"
                  className="text-sm text-text-70 transition-colors hover:text-primary"
                >
                  {t("cloud")}
                </Link>
              </li>
              <li>
                <Link
                  href="/servicios/staff-augmentation"
                  className="text-sm text-text-70 transition-colors hover:text-primary"
                >
                  {t("staffAugmentation")}
                </Link>
              </li>
              <li>
                <Link
                  href="/servicios/desarrollo-digital"
                  className="text-sm text-text-70 transition-colors hover:text-primary"
                >
                  {t("digitalDevelopment")}
                </Link>
              </li>
            </ul>

            <p className="mt-6 text-sm font-semibold uppercase tracking-wider text-text-40">
              Productos
            </p>
            <ul className="space-y-3">
              <li>
                <Link
                  href="/productos"
                  className="text-sm text-text-70 transition-colors hover:text-primary"
                >
                  Todos los productos
                </Link>
              </li>
              <li>
                <Link
                  href="/productos/paywl"
                  className="text-sm text-text-70 transition-colors hover:text-primary"
                >
                  PAYWL
                </Link>
              </li>
              <li>
                <Link
                  href="/productos/niveleads"
                  className="text-sm text-text-70 transition-colors hover:text-primary"
                >
                  Niveleads
                </Link>
              </li>
              <li>
                <Link
                  href="/productos/hirely"
                  className="text-sm text-text-70 transition-colors hover:text-primary"
                >
                  Hirely
                </Link>
              </li>
            </ul>
          </div>

          {/* Industries */}
          <div className="space-y-4">
            <p className="text-sm font-semibold uppercase tracking-wider text-text-40">
              {t("industries")}
            </p>
            <ul className="space-y-3">
              <li>
                <Link
                  href="/industrias/fintech"
                  className="text-sm text-text-70 transition-colors hover:text-primary"
                >
                  {t("fintech")}
                </Link>
              </li>
              <li>
                <Link
                  href="/industrias/medios-entretenimiento"
                  className="text-sm text-text-70 transition-colors hover:text-primary"
                >
                  {t("mediaEntertainment")}
                </Link>
              </li>
              <li>
                <Link
                  href="/industrias/salud"
                  className="text-sm text-text-70 transition-colors hover:text-primary"
                >
                  {t("healthcare")}
                </Link>
              </li>
              <li>
                <Link
                  href="/industrias/retail-ecommerce"
                  className="text-sm text-text-70 transition-colors hover:text-primary"
                >
                  {t("retailEcommerce")}
                </Link>
              </li>
              <li>
                <Link
                  href="/industrias/logistica"
                  className="text-sm text-text-70 transition-colors hover:text-primary"
                >
                  {t("logistics")}
                </Link>
              </li>
              <li>
                <Link
                  href="/industrias/manufactura"
                  className="text-sm text-text-70 transition-colors hover:text-primary"
                >
                  {t("manufacturing")}
                </Link>
              </li>
            </ul>
          </div>

          {/* Company + Contact */}
          <div className="space-y-6">
            <div className="space-y-4">
              <p className="text-sm font-semibold uppercase tracking-wider text-text-40">
                {t("company")}
              </p>
              <ul className="space-y-3">
                <li>
                  <Link
                    href="/nosotros"
                    className="text-sm text-text-70 transition-colors hover:text-primary"
                  >
                    {t("about")}
                  </Link>
                </li>
                <li>
                  <Link
                    href="/casos-de-exito"
                    className="text-sm text-text-70 transition-colors hover:text-primary"
                  >
                    {t("successStories")}
                  </Link>
                </li>
                <li>
                  <Link
                    href="/blog"
                    className="text-sm text-text-70 transition-colors hover:text-primary"
                  >
                    {t("blog")}
                  </Link>
                </li>
                <li>
                  <Link
                    href="/trabaja-con-nosotros"
                    className="text-sm text-text-70 transition-colors hover:text-primary"
                  >
                    {t("careers")}
                  </Link>
                </li>
              </ul>
            </div>
            <div className="space-y-4">
              <p className="text-sm font-semibold uppercase tracking-wider text-text-40">
                {t("contact")}
              </p>
              <ul className="space-y-3 text-sm text-text-70">
                <li>
                  <a
                    href={`mailto:${SITE.email}`}
                    className="transition-colors hover:text-primary"
                    aria-label="Email Nivelics"
                  >
                    {SITE.email}
                  </a>
                </li>
                <li>
                  <a
                    href={`https://wa.me/${SITE.whatsapp.replace("+", "")}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="transition-colors hover:text-primary"
                    aria-label="WhatsApp Nivelics"
                  >
                    WhatsApp
                  </a>
                </li>
                <li>
                  <Link href="/soporte" className="transition-colors hover:text-primary">
                    {t("support")}
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-12 border-t border-border pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-text-40">
          <span>
            &copy; {new Date().getFullYear()} {SITE.name}. {t("rights")}
          </span>
          <div className="flex gap-6">
            <Link href="/privacidad" className="transition-colors hover:text-primary">
              {t("privacy")}
            </Link>
            <Link href="/soporte" className="transition-colors hover:text-primary">
              {t("support")}
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
