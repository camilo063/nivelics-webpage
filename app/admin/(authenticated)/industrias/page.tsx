import { connection } from "next/server";
import Link from "next/link";
import { Info, Plus } from "lucide-react";
import { getIndustrias } from "@/lib/admin/actions/industrias.actions";
import { IndustriasListClient } from "@/components/admin/forms/IndustriasListClient";

export default async function IndustriasPage() {
  await connection();
  const industrias = await getIndustrias();

  return (
    <div className="space-y-6">
      <div className="mb-6 flex items-start gap-3 rounded-xl border border-cyan-500/20 bg-cyan-500/[0.05] p-4">
        <Info className="mt-0.5 h-4 w-4 flex-shrink-0 text-cyan-400" aria-hidden="true" />
        <div>
          <p className="mb-1 text-sm font-medium text-cyan-400">Contenido del hub /industrias</p>
          <p className="mb-2 text-xs text-white/50">
            El título y descripción de la página que lista todos los sectores se administra en Home
            → Tab &quot;Hub Industrias&quot;.
          </p>
          <Link
            href="/admin/home"
            className="text-xs text-cyan-400 underline transition-colors hover:text-cyan-300"
          >
            Ir a Admin Home →
          </Link>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Industrias</h1>
          <p className="text-text-70">{industrias.length} industrias en total</p>
        </div>
        <Link
          href="/admin/industrias/nuevo"
          className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-white hover:bg-primary/90 transition-colors"
        >
          <Plus className="h-4 w-4" />
          Nueva industria
        </Link>
      </div>

      <IndustriasListClient industrias={industrias} />
    </div>
  );
}
