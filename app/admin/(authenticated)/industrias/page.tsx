import { connection } from "next/server";
import Link from "next/link";
import { Plus } from "lucide-react";
import { getIndustrias } from "@/lib/admin/actions/industrias.actions";
import { IndustriasListClient } from "@/components/admin/forms/IndustriasListClient";

export default async function IndustriasPage() {
  await connection();
  const industrias = await getIndustrias();

  return (
    <div className="space-y-6">
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
