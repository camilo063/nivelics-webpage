import type { ReactNode } from "react";
import { NavClient } from "./nav-client";
import { getNavConfigPublic } from "@/lib/cms";
import { getAllUiLabels } from "@/lib/cms/ui-labels";
import type { MegaMenuSection } from "@/lib/admin/actions/navegacion.actions";

interface NavProps {
  logoUrl?: string | null;
  logoAlt?: string;
  logoTitle?: string;
  logo?: ReactNode;
}

export async function Nav(props: NavProps = {}) {
  const [config, uiLabels] = await Promise.all([
    getNavConfigPublic().catch(() => null),
    getAllUiLabels().catch(() => ({})),
  ]);
  const megaMenu = (config?.megaMenu as MegaMenuSection[] | null) ?? [];

  return <NavClient {...props} megaMenu={megaMenu} uiLabels={uiLabels} />;
}
