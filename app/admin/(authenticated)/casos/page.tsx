import { connection } from "next/server";
import Link from "next/link";
import { Plus } from "lucide-react";
import { getCasosExito } from "@/lib/admin/actions/casos.actions";
import { CasosListClient } from "@/components/admin/forms/CasosListClient";

export default async function AdminCasosPage() {
  await connection();
  const { casos, total } = await getCasosExito();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Casos de Éxito</h1>
          <p className="text-text-70">{total} casos en total</p>
        </div>
        <Link
          href="/admin/casos/nuevo"
          className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-bg-base hover:opacity-90 transition-opacity"
        >
          <Plus className="h-4 w-4" />
          Nuevo caso
        </Link>
      </div>

      <CasosListClient initialCasos={casos} initialTotal={total} />
    </div>
  );
}
