import Link from "next/link";
import { connection } from "next/server";
import { Plus } from "lucide-react";
import { listUiLabels } from "@/lib/admin/actions/ui-labels.actions";
import { UiLabelsListClient } from "@/components/admin/forms/UiLabelsListClient";

export default async function UiLabelsPage() {
  await connection();
  const rows = await listUiLabels();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Labels de UI</h1>
          <p className="text-text-70">
            Etiquetas reutilizables que aparecen en varias páginas del sitio público.
          </p>
        </div>
        <Link
          href="/admin/ui-labels/nuevo"
          className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-bg-base hover:opacity-90"
        >
          <Plus className="h-4 w-4" /> Nuevo label
        </Link>
      </div>
      <UiLabelsListClient
        initialRows={rows.map((r) => ({
          id: r.id,
          key: r.key,
          labelEs: r.labelEs,
          labelEn: r.labelEn,
          category: r.category ?? "",
          description: r.description ?? "",
        }))}
      />
    </div>
  );
}
