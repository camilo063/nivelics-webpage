import { connection } from "next/server";
import Link from "next/link";
import { Plus } from "lucide-react";
import { getServicios } from "@/lib/admin/actions/servicios.actions";
import { ServiciosListClient } from "@/components/admin/forms/ServiciosListClient";

export default async function ServiciosPage() {
  await connection();
  const servicios = await getServicios();

  const totalCount = servicios.reduce((acc, hub) => acc + 1 + (hub.children?.length || 0), 0);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Servicios</h1>
          <p className="text-text-70">{totalCount} servicios en total</p>
        </div>
        <Link
          href="/admin/servicios/nuevo"
          className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-white hover:bg-primary/90 transition-colors"
        >
          <Plus className="h-4 w-4" />
          Nuevo servicio
        </Link>
      </div>

      <ServiciosListClient servicios={servicios} />
    </div>
  );
}
