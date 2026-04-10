"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Pencil, Trash2 } from "lucide-react";
import { TranslationBadge } from "@/components/admin/ui/BilingualEditor";
import { deleteIndustria } from "@/lib/admin/actions/industrias.actions";
import { useToast } from "@/components/admin/ui/Toast";

interface IndustriaItem {
  id: string;
  slugEs: string;
  nameEs: string;
  nameEn: string | null;
  icon: string | null;
  accentColor: string;
  translationStatusEn: string;
}

const colorMap: Record<string, string> = {
  ia: "bg-ia",
  cloud: "bg-cloud",
  staffing: "bg-staffing",
  finops: "bg-finops",
  dev: "bg-dev",
};

export function IndustriasListClient({ industrias }: { industrias: IndustriaItem[] }) {
  const router = useRouter();
  const { toast } = useToast();

  async function handleDelete(slugEs: string, name: string) {
    if (!confirm(`Eliminar "${name}"? Esta accion no se puede deshacer.`)) return;
    try {
      await deleteIndustria(slugEs);
      toast("Industria eliminada correctamente", "success");
      router.refresh();
    } catch (e) {
      toast(e instanceof Error ? e.message : "Error al eliminar", "error");
    }
  }

  if (industrias.length === 0) {
    return (
      <div className="rounded-xl border border-border bg-bg-surface p-12 text-center">
        <p className="text-text-40">No hay industrias configuradas en la base de datos.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {industrias.map((industria) => (
        <div
          key={industria.id}
          className="relative rounded-xl border border-border bg-bg-surface overflow-hidden transition-colors hover:border-primary/30"
        >
          {/* Accent color bar */}
          <div className={`h-1.5 ${colorMap[industria.accentColor] || "bg-dev"}`} />

          <div className="p-5 space-y-3">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                {industria.icon && <span className="text-2xl">{industria.icon}</span>}
                <div>
                  <h3 className="font-semibold text-text-100">{industria.nameEs}</h3>
                  {industria.nameEn && <p className="text-xs text-text-40">{industria.nameEn}</p>}
                </div>
              </div>
              <TranslationBadge
                status={
                  industria.translationStatusEn as "complete" | "partial" | "pending" | "auto"
                }
              />
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-border">
              <span className="inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium bg-bg-elevated text-text-40">
                {industria.accentColor}
              </span>
              <div className="flex items-center gap-2">
                <Link
                  href={`/admin/industrias/${industria.slugEs}`}
                  className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium text-primary hover:bg-primary/10 transition-colors"
                >
                  <Pencil className="h-3.5 w-3.5" />
                  Editar
                </Link>
                <button
                  onClick={() => handleDelete(industria.slugEs, industria.nameEs)}
                  className="flex items-center rounded-lg px-2 py-1.5 text-sm font-medium text-red-400 hover:bg-red-500/10 transition-colors"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
