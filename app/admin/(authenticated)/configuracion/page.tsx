import { connection } from "next/server";
import { getSiteConfig } from "@/lib/admin/actions/config.actions";
import ConfigClient from "@/components/admin/forms/ConfigClient";

export default async function ConfiguracionPage() {
  await connection();
  const config = await getSiteConfig();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Configuración</h1>
        <p className="text-text-70">Configuración global del sitio nivelics.com</p>
      </div>
      <ConfigClient
        initialData={
          config
            ? {
                siteNameEs: config.siteNameEs || "",
                siteNameEn: config.siteNameEn || "",
                taglineEs: config.taglineEs || "",
                taglineEn: config.taglineEn || "",
                logoUrl: config.logoUrl || "",
                logoWidth: config.logoWidth ?? null,
                logoHeight: config.logoHeight ?? null,
                logoAltEs: config.logoAltEs || "Nivelics",
                logoAltEn: config.logoAltEn || "Nivelics",
                logoTitleEs: config.logoTitleEs || "",
                logoTitleEn: config.logoTitleEn || "",
                faviconUrl: config.faviconUrl || "",
                defaultOgImage: config.defaultOgImage || "",
                phoneWhatsapp: config.phoneWhatsapp || "",
                emailContact: config.emailContact || "",
                addressBogota: config.addressBogota || "",
                addressMiami: config.addressMiami || "",
                linkedinUrl: config.linkedinUrl || "",
                googleAnalyticsId: config.googleAnalyticsId || "",
                googleTagManagerId: config.googleTagManagerId || "",
                llmsTxtContent: config.llmsTxtContent || "",
                llmsFullTxtContent: config.llmsFullTxtContent || "",
              }
            : null
        }
      />
    </div>
  );
}
