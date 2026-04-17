import { connection } from "next/server";
import { notFound } from "next/navigation";
import UiLabelForm from "@/components/admin/forms/UiLabelForm";
import { getUiLabelById } from "@/lib/admin/actions/ui-labels.actions";
import type { UiLabelInput } from "@/lib/admin/validations/ui-labels.schema";
import { UI_LABEL_CATEGORIES } from "@/lib/admin/validations/ui-labels.schema";

export default async function EditUiLabelPage({ params }: { params: Promise<{ id: string }> }) {
  await connection();
  const { id } = await params;
  const row = await getUiLabelById(id);
  if (!row) notFound();

  const category = (UI_LABEL_CATEGORIES as readonly string[]).includes(row.category ?? "")
    ? (row.category as UiLabelInput["category"])
    : "ui_generic";

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Editar label</h1>
        <p className="text-text-70 font-mono text-xs">{row.key}</p>
      </div>
      <UiLabelForm
        id={row.id}
        initialData={{
          key: row.key,
          labelEs: row.labelEs,
          labelEn: row.labelEn,
          category,
          description: row.description ?? "",
        }}
      />
    </div>
  );
}
