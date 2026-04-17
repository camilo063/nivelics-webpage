import Image from "next/image";
import { Nav } from "@/components/layout/nav";
import { Footer } from "@/components/layout/footer";
import { WhatsAppFAB } from "@/components/shared";
import { TranslationBanner } from "@/components/shared/translation-banner";
import { getSiteConfigPublic } from "@/lib/cms/queries";
import { pickLocale } from "@/lib/cms/bilingual";
import type { Locale } from "@/lib/cms/types";
import { SITE } from "@/lib/constants";
import { NAV_DEFAULTS } from "@/lib/constants/nav";

interface MarketingLayoutProps {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}

export default async function MarketingLayout({ children, params }: MarketingLayoutProps) {
  const { locale: rawLocale } = await params;
  const locale: Locale = rawLocale === "en" ? "en" : "es";
  const config = await getSiteConfigPublic().catch(() => null);
  const logoUrl = config?.logoUrl ?? null;
  const logoNaturalWidth = config?.logoWidth ?? null;
  const logoNaturalHeight = config?.logoHeight ?? null;
  const logoAlt =
    pickLocale(locale, config?.logoAltEs, config?.logoAltEn) ||
    pickLocale(locale, NAV_DEFAULTS.logoAltEs, NAV_DEFAULTS.logoAltEn);
  const logoTitle =
    pickLocale(locale, config?.logoTitleEs, config?.logoTitleEn) ||
    pickLocale(locale, NAV_DEFAULTS.logoTitleEs, NAV_DEFAULTS.logoTitleEn);

  const logoSlot =
    logoUrl && logoNaturalWidth && logoNaturalHeight ? (
      <Image
        src={logoUrl}
        alt={logoAlt}
        title={logoTitle}
        width={logoNaturalWidth}
        height={logoNaturalHeight}
        style={{ height: "80px", width: "auto", objectFit: "contain" }}
        priority
        sizes="(max-width: 768px) 160px, 240px"
        itemProp="name"
      />
    ) : (
      <span title={logoTitle} itemProp="name">
        {SITE.name}
      </span>
    );

  return (
    <>
      <Nav logoUrl={logoUrl} logoAlt={logoAlt} logoTitle={logoTitle} logo={logoSlot} />
      <TranslationBanner />
      {children}
      <Footer
        logoUrl={logoUrl}
        logoAlt={logoAlt}
        logoTitle={logoTitle}
        logoWidth={logoNaturalWidth}
        logoHeight={logoNaturalHeight}
      />
      <WhatsAppFAB />
    </>
  );
}
