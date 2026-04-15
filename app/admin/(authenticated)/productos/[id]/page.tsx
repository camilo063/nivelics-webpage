import { connection } from "next/server";
import { notFound } from "next/navigation";
import { getProductoById } from "@/lib/admin/actions/productos.actions";
import ProductoForm from "@/components/admin/forms/ProductoForm";

export default async function ProductoEditPage({ params }: { params: Promise<{ id: string }> }) {
  await connection();
  const { id } = await params;
  const producto = await getProductoById(id);
  if (!producto) notFound();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Editar producto: {producto.name}</h1>
        <p className="text-text-70">Edición bilingüe ES | EN</p>
      </div>
      <ProductoForm initialData={producto} />
    </div>
  );
}
