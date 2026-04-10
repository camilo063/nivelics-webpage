"use client";

import { Fragment } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Pencil, ChevronRight, Trash2 } from "lucide-react";
import { TranslationBadge } from "@/components/admin/ui/BilingualEditor";
import { deleteServicio } from "@/lib/admin/actions/servicios.actions";
import { useToast } from "@/components/admin/ui/Toast";

interface ServicioItem {
  id: string;
  slugEs: string;
  titleEs: string;
  serviceType: string;
  accentColor: string;
  status: string;
  translationStatusEn: string;
}

interface ServicioHub extends ServicioItem {
  children: ServicioItem[];
}

const accentColors: Record<string, { label: string; bg: string; text: string }> = {
  ia: { label: "IA", bg: "bg-purple-500/10", text: "text-purple-400" },
  cloud: { label: "Cloud", bg: "bg-blue-500/10", text: "text-blue-400" },
  staffing: { label: "Staffing", bg: "bg-green-500/10", text: "text-green-400" },
  finops: { label: "FinOps", bg: "bg-amber-500/10", text: "text-amber-400" },
  dev: { label: "Dev", bg: "bg-cyan-500/10", text: "text-cyan-400" },
};

const statusLabels: Record<string, { label: string; className: string }> = {
  published: { label: "Publicado", className: "bg-staffing/10 text-staffing" },
  draft: { label: "Borrador", className: "bg-text-40/10 text-text-40" },
  scheduled: { label: "Programado", className: "bg-ia/10 text-ia" },
  archived: { label: "Archivado", className: "bg-red-400/10 text-red-400" },
};

function ServiceRow({
  servicio,
  indent = false,
  onDelete,
}: {
  servicio: ServicioItem;
  indent?: boolean;
  onDelete: (slugEs: string, title: string) => void;
}) {
  const accent = accentColors[servicio.accentColor] || accentColors.dev;
  const statusInfo = statusLabels[servicio.status] || statusLabels.draft;

  return (
    <tr className="border-b border-border last:border-b-0 hover:bg-bg-elevated/50 transition-colors">
      <td className="px-4 py-4 overflow-hidden">
        <div className={`flex items-center gap-2 ${indent ? "pl-8" : ""}`}>
          {indent && <ChevronRight className="h-3.5 w-3.5 shrink-0 text-text-40" />}
          <span className="truncate font-medium text-text-100">{servicio.titleEs}</span>
        </div>
      </td>
      <td className="px-4 py-4">
        <span
          className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
            servicio.serviceType === "hub"
              ? "bg-primary/10 text-primary"
              : "bg-text-40/10 text-text-70"
          }`}
        >
          {servicio.serviceType === "hub" ? "Hub" : "Sub"}
        </span>
      </td>
      <td className="px-4 py-4">
        <span
          className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${accent.bg} ${accent.text}`}
        >
          {accent.label}
        </span>
      </td>
      <td className="px-4 py-4">
        <span
          className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${statusInfo.className}`}
        >
          {statusInfo.label}
        </span>
      </td>
      <td className="px-4 py-4">
        <TranslationBadge
          status={servicio.translationStatusEn as "complete" | "partial" | "pending" | "auto"}
        />
      </td>
      <td className="px-4 py-4">
        <div className="flex items-center gap-2">
          <Link
            href={`/admin/servicios/${servicio.slugEs}`}
            className="inline-flex items-center gap-1.5 rounded-lg bg-bg-elevated px-3 py-1.5 text-xs font-medium text-text-70 hover:text-primary hover:bg-primary/5 transition-colors"
          >
            <Pencil className="h-3.5 w-3.5" />
            Editar
          </Link>
          <button
            onClick={() => onDelete(servicio.slugEs, servicio.titleEs)}
            className="inline-flex items-center gap-1.5 rounded-lg px-2 py-1.5 text-xs font-medium text-red-400 hover:bg-red-500/10 transition-colors"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </button>
        </div>
      </td>
    </tr>
  );
}

export function ServiciosListClient({ servicios }: { servicios: ServicioHub[] }) {
  const router = useRouter();
  const { toast } = useToast();

  async function handleDelete(slugEs: string, title: string) {
    if (!confirm(`Eliminar "${title}"? Esta accion no se puede deshacer.`)) return;
    try {
      await deleteServicio(slugEs);
      toast("Servicio eliminado correctamente", "success");
      router.refresh();
    } catch (e) {
      toast(e instanceof Error ? e.message : "Error al eliminar", "error");
    }
  }

  if (servicios.length === 0) {
    return (
      <div className="rounded-xl border border-border bg-bg-surface p-12 text-center">
        <p className="text-text-40">No hay servicios configurados en la base de datos.</p>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-border bg-bg-surface overflow-hidden">
      <table className="w-full table-fixed text-sm">
        <thead>
          <tr className="border-b border-border bg-bg-elevated/50">
            <th className="w-[30%] px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-text-40">
              Nombre ES
            </th>
            <th className="w-[10%] px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-text-40">
              Tipo
            </th>
            <th className="w-[12%] px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-text-40">
              Acento
            </th>
            <th className="w-[14%] px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-text-40">
              Estado
            </th>
            <th className="w-[18%] px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-text-40">
              Trad. EN
            </th>
            <th className="w-[16%] px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-text-40">
              Acciones
            </th>
          </tr>
        </thead>
        <tbody>
          {servicios.map((hub) => (
            <Fragment key={hub.id}>
              <ServiceRow servicio={hub} onDelete={handleDelete} />
              {hub.children.map((sub) => (
                <ServiceRow key={sub.id} servicio={sub} indent onDelete={handleDelete} />
              ))}
            </Fragment>
          ))}
        </tbody>
      </table>
    </div>
  );
}
