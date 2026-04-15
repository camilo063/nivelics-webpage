import { Nav, Footer } from "@/components/layout";
import { WhatsAppFAB } from "@/components/shared";
import { TranslationBanner } from "@/components/shared/translation-banner";
import { getSiteConfig } from "@/lib/admin/actions/config.actions";
import { SITE } from "@/lib/constants";
import { NAV_DEFAULTS } from "@/lib/constants/nav";

interface MarketingLayoutProps {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}

export default async function MarketingLayout({ children, params }: MarketingLayoutProps) {
  const { locale } = await params;
  const config = await getSiteConfig().catch(() => null);
  const logoUrl = config?.logoUrl ?? null;
  const logoNaturalWidth = config?.logoWidth ?? null;
  const logoNaturalHeight = config?.logoHeight ?? null;
  const logoAlt =
    (locale === "en" ? config?.logoAltEn : config?.logoAltEs) ??
    (locale === "en" ? NAV_DEFAULTS.logoAltEn : NAV_DEFAULTS.logoAltEs);
  const logoTitle =
    (locale === "en" ? config?.logoTitleEn : config?.logoTitleEs) ??
    (locale === "en" ? NAV_DEFAULTS.logoTitleEn : NAV_DEFAULTS.logoTitleEs);

  const logoSlot =
    logoUrl && logoNaturalWidth && logoNaturalHeight ? (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={logoUrl}
        alt={logoAlt}
        title={logoTitle}
        width={logoNaturalWidth}
        height={logoNaturalHeight}
        style={{ height: "80px", width: "auto", objectFit: "contain" }}
        loading="eager"
        fetchPriority="high"
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
