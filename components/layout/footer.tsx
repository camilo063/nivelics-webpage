import { FooterClient } from "./footer-client";
import { getNavConfigPublic } from "@/lib/cms";
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
  const [config, uiLabels] = await Promise.all([
    getNavConfigPublic().catch(() => null),
    getAllUiLabels().catch(() => ({})),
  ]);
  const footer = (config?.footer as FooterData | null) ?? undefined;

  return <FooterClient {...props} footer={footer} uiLabels={uiLabels} />;
}
