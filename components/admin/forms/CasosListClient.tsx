"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Pencil, Trash2, Star } from "lucide-react";
import { TranslationBadge } from "@/components/admin/ui/BilingualEditor";
import { deleteCasoExito } from "@/lib/admin/actions/casos.actions";

interface CasoExito {
  id: string;
  slug: string;
  clientName: string;
  titleEs: string;
  status: "draft" | "published" | "scheduled" | "archived";
  translationStatusEn: "complete" | "partial" | "pending" | "auto";
  featured: boolean;
  createdAt: Date;
}

const statusLabels: Record<string, { label: string; class: string }> = {
  draft: { label: "Borrador", class: "bg-finops/10 text-finops" },
  published: { label: "Publicado", class: "bg-staffing/10 text-staffing" },
};

export function CasosListClient({
  initialCasos,
  initialTotal,
}: {
  initialCasos: CasoExito[];
  initialTotal: number;
}) {
  const router = useRouter();

  async function handleDelete(id: string) {
    if (!confirm("¿Estás seguro de eliminar este caso?")) return;
    await deleteCasoExito(id);
    router.refresh();
  }

  return (
    <div className="rounded-xl border border-border bg-bg-surface overflow-hidden">
      <table className="w-full table-fixed">
        <thead>
          <tr className="border-b border-border text-left">
            <th className="w-[44%] px-4 py-3 text-xs font-semibold uppercase tracking-wider text-text-40">
              Cliente / Título
            </th>
            <th className="w-[16%] px-4 py-3 text-xs font-semibold uppercase tracking-wider text-text-40">
              Estado
            </th>
            <th className="w-[20%] px-4 py-3 text-xs font-semibold uppercase tracking-wider text-text-40">
              Trad. EN
            </th>
            <th className="w-[20%] px-4 py-3 text-xs font-semibold uppercase tracking-wider text-text-40">
              Acciones
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {initialCasos.length === 0 ? (
            <tr>
              <td colSpan={4} className="px-4 py-12 text-center text-text-40">
                No hay casos de éxito aún.{" "}
                <Link href="/admin/casos/nuevo" className="text-primary hover:underline">
                  Crear el primero
                </Link>
              </td>
            </tr>
          ) : (
            initialCasos.map((caso) => {
              const statusInfo = statusLabels[caso.status] || statusLabels.draft;
              return (
                <tr key={caso.id} className="hover:bg-bg-elevated/50 transition-colors">
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-2">
                      {caso.featured && <Star className="h-4 w-4 text-finops fill-finops" />}
                      <div>
                        <Link
                          href={`/admin/casos/${caso.id}`}
                          className="font-medium text-text-100 hover:text-primary transition-colors"
                        >
                          {caso.titleEs}
                        </Link>
                        <p className="text-xs text-text-40">{caso.clientName}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <span
                      className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${statusInfo.class}`}
                    >
                      {statusInfo.label}
                    </span>
                  </td>
                  <td className="px-4 py-4">
                    <TranslationBadge status={caso.translationStatusEn} />
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-2">
                      <Link
                        href={`/admin/casos/${caso.id}`}
                        className="rounded-lg p-2 text-text-40 hover:bg-bg-elevated hover:text-primary transition-colors"
                      >
                        <Pencil className="h-4 w-4" />
                      </Link>
                      <button
                        onClick={() => handleDelete(caso.id)}
                        className="rounded-lg p-2 text-text-40 hover:bg-red-500/10 hover:text-red-400 transition-colors"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })
          )}
        </tbody>
      </table>
    </div>
  );
}
