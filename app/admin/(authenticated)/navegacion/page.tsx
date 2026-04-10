import { connection } from "next/server";
import { getNavConfig } from "@/lib/admin/actions/navegacion.actions";
import NavegacionClient from "@/components/admin/forms/NavegacionClient";

export default async function NavegacionPage() {
  await connection();
  const { megaMenu, footer } = await getNavConfig();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Navegación</h1>
        <p className="text-text-70">Edita el mega menú y el footer del sitio</p>
      </div>
      <NavegacionClient initialMegaMenu={megaMenu} initialFooter={footer} />
    </div>
  );
}
