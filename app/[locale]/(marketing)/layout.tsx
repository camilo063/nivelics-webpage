import Image from "next/image";
import { setRequestLocale } from "next-intl/server";
import { Nav } from "@/components/layout/nav";
import { Footer } from "@/components/layout/footer";
import { DaptaWidget } from "@/components/shared";
import { TranslationBanner } from "@/components/shared/translation-banner";
import { ScrollBeam } from "@/components/effects/scroll-beam";
import { WhatsAppFab } from "@/components/shared/whatsapp-fab";
import { GlobalMobileCta } from "@/components/shared/global-mobile-cta";
import { ProactiveChatInvite } from "@/components/shared/proactive-chat-invite";
import { ScrollDepthTracker } from "@/components/shared/scroll-depth-tracker";
import { getSiteConfigPublic } from "@/lib/cms/queries";
import { pickLocale } from "@/lib/cms/bilingual";
import type { Locale } from "@/lib/cms/types";
import { SITE } from "@/lib/constants";
import { NAV_DEFAULTS } from "@/lib/constants/nav";

export const revalidate = 86400;

interface MarketingLayoutProps {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}

export default async function MarketingLayout({ children, params }: MarketingLayoutProps) {
  const { locale: rawLocale } = await params;
  setRequestLocale(rawLocale);
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
      {/* Skip-link (a11y): primer focusable — salta la navegación de ~60 ítems */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:rounded-lg focus:bg-primary focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-bg-base"
      >
        {locale === "es" ? "Ir al contenido principal" : "Skip to main content"}
      </a>
      <Nav logoUrl={logoUrl} logoAlt={logoAlt} logoTitle={logoTitle} logo={logoSlot} />
      <TranslationBanner />
      {/* Línea de navegación 3D — progreso de scroll + invitación a contactar (todas las páginas públicas) */}
      <ScrollBeam
        ctaLabel={locale === "es" ? "¿Hablamos?" : "Let's talk"}
        chatLabel={locale === "es" ? "Abrir chat con nuestro agente" : "Open chat with our agent"}
      />
      {/* flex flex-col + flex-1: preserva la cadena flex del body para que
          PageWrapper (flex-1) siga empujando el footer al fondo */}
      <main id="main-content" className="flex flex-1 flex-col">
        {children}
      </main>
      <Footer
        logoUrl={logoUrl}
        logoAlt={logoAlt}
        logoTitle={logoTitle}
        logoWidth={logoNaturalWidth}
        logoHeight={logoNaturalHeight}
      />
      <DaptaWidget />
      {/* ── Touchpoints CRO globales (docs/mejoras/conversion-cro-engagement.md) ── */}
      <WhatsAppFab
        message={
          locale === "es"
            ? "Hola, quiero más información sobre Nivelics"
            : "Hi, I'd like more information about Nivelics"
        }
        ariaLabel={locale === "es" ? "Chatear por WhatsApp" : "Chat on WhatsApp"}
        closeLabel={locale === "es" ? "Ocultar botón de WhatsApp" : "Hide WhatsApp button"}
      />
      <GlobalMobileCta text={locale === "es" ? "Hablemos de tu proyecto" : "Let's talk"} />
      <ProactiveChatInvite
        text={
          locale === "es"
            ? "¿Dudas sobre tu proyecto? Nuestro agente te responde al instante."
            : "Questions about your project? Our agent replies instantly."
        }
        ctaLabel={locale === "es" ? "Abrir chat" : "Open chat"}
        closeLabel={locale === "es" ? "Cerrar invitación" : "Dismiss"}
      />
      <ScrollDepthTracker />
    </>
  );
}
