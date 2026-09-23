import { FooterClient } from "./footer-client";
import { getNavConfigPublic } from "@/lib/cms";
import { getContactoSitio } from "@/lib/cms/contacto";
import { getAllUiLabels } from "@/lib/cms/ui-labels";
import type { FooterData } from "@/lib/admin/actions/navegacion.actions";

interface FooterProps {
  logoUrl?: string | null;
  logoAlt?: string;
  logoTitle?: string;
  logoWidth?: number | null;
  logoHeight?: number | null;
}

export async function Footer(props: FooterProps = {}) {
  // `contacto` sale de site_config (fuente única). `footer` trae los textos del pie
  // —y, por historia, un contactEmail / contactWhatsappUrl que duplicaban ese dato—;
  // la precedencia la resuelve FooterClient.
  const [config, uiLabels, contacto] = await Promise.all([
    getNavConfigPublic().catch(() => null),
    getAllUiLabels().catch(() => ({})),
    getContactoSitio(),
  ]);
  const footer = (config?.footer as FooterData | null) ?? undefined;

  return <FooterClient {...props} footer={footer} uiLabels={uiLabels} contacto={contacto} />;
}
