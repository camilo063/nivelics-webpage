import { connection } from "next/server";
import UiLabelForm from "@/components/admin/forms/UiLabelForm";

export default async function NuevoUiLabelPage() {
  await connection();
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Nuevo label</h1>
        <p className="text-text-70">Define una etiqueta reutilizable para el sitio público.</p>
      </div>
      <UiLabelForm />
    </div>
  );
}
