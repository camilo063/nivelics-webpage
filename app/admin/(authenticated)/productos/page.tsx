import { connection } from "next/server";
import { getProductosAdmin } from "@/lib/admin/actions/productos.actions";
import { ProductosListClient } from "@/components/admin/forms/ProductosListClient";

export default async function ProductosAdminPage() {
  await connection();
  const items = await getProductosAdmin();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Productos SaaS</h1>
          <p className="text-text-70">{items.length} productos propios</p>
        </div>
      </div>
      <ProductosListClient items={items} />
    </div>
  );
}
