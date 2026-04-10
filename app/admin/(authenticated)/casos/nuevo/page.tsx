import CasoForm from "@/components/admin/forms/CasoForm";

export default function NuevoCasoPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Nuevo caso de éxito</h1>
      <CasoForm isNew />
    </div>
  );
}
