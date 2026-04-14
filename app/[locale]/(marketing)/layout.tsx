import { Nav, Footer } from "@/components/layout";
import { WhatsAppFAB } from "@/components/shared";
import { TranslationBanner } from "@/components/shared/translation-banner";

export default function MarketingLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Nav />
      <TranslationBanner />
      {children}
      <Footer />
      <WhatsAppFAB />
    </>
  );
}
