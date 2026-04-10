"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Plus, Pencil, Copy, Trash2, LayoutTemplate, ExternalLink } from "lucide-react";

interface LandingRow {
  id: string;
  slug: string;
  campaignName: string;
  serviceType: string | null;
  status: string;
  createdAt: string | Date;
}

interface LandingListClientProps {
  initialLandings: LandingRow[];
  initialTotal: number;
}

const STATUS_COLORS: Record<string, string> = {
  draft: "bg-finops/10 text-finops",
  published: "bg-staffing/10 text-staffing",
  archived: "bg-text-40/10 text-text-40",
};

const SERVICE_LABELS: Record<string, string> = {
  ia: "IA",
  cloud: "Cloud",
  staffing: "Staffing",
  finops: "FinOps",
  dev: "Dev",
};

const TEMPLATE_DESCRIPTIONS: Record<string, string> = {
  A: "Hero + Metricas + Valor + Pasos + Caso + Form + Footer",
  B: "Hero+Form + Logos + Metricas + Card + FAQ + Form + Footer",
  C: "Hero + Nicho + Metricas + Caso + Valor + Form + Footer",
  D: "Hero + Comparativa + Metricas + Caso + Testimonial + Form + Footer",
  E: "Hero+Form + Metricas + Valor + Video + Testimonial + Form + Footer",
};

export function LandingListClient({ initialLandings, initialTotal }: LandingListClientProps) {
  const router = useRouter();
  const [landings, setLandings] = useState(initialLandings);
  const [total, setTotal] = useState(initialTotal);
  const [statusFilter, setStatusFilter] = useState("all");
  const [loading, setLoading] = useState(false);
  const [templateLoading, setTemplateLoading] = useState<string | null>(null);

  const inputClass =
    "w-full rounded-lg border border-border bg-bg-elevated px-4 py-3 text-text-100 placeholder:text-text-40 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition-colors";

  const fetchLandings = async (status: string) => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (status !== "all") params.set("status", status);
      const res = await fetch(`/api/admin/landings?${params.toString()}`);
      if (res.ok) {
        const data = await res.json();
        setLandings(data.landings);
        setTotal(data.total);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = (status: string) => {
    setStatusFilter(status);
    fetchLandings(status);
  };

  const handleCreateFromTemplate = async (template: string) => {
    setTemplateLoading(template);
    try {
      const { createFromTemplate } = await import("@/lib/admin/actions/landings.actions");
      const landing = await createFromTemplate(template as "A" | "B" | "C" | "D" | "E");
      router.push(`/admin/landing-pages/${landing.id}`);
    } catch (err) {
      console.error("Error creating from template:", err);
    } finally {
      setTemplateLoading(null);
    }
  };

  const handleDuplicate = async (id: string) => {
    if (!confirm("Duplicar esta landing?")) return;
    try {
      const { duplicateLandingPage } = await import("@/lib/admin/actions/landings.actions");
      await duplicateLandingPage(id);
      fetchLandings(statusFilter);
    } catch (err) {
      console.error("Error duplicating:", err);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Eliminar esta landing? Esta accion no se puede deshacer.")) return;
    try {
      const res = await fetch(`/api/admin/landings/${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        fetchLandings(statusFilter);
      }
    } catch (err) {
      console.error("Error deleting:", err);
    }
  };

  return (
    <div className="space-y-6">
      {/* Templates */}
      <div className="rounded-xl border border-border bg-bg-surface p-4">
        <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold text-text-70">
          <LayoutTemplate className="h-4 w-4" />
          Crear desde plantilla
        </h3>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-5">
          {(["A", "B", "C", "D", "E"] as const).map((t) => (
            <button
              key={t}
              onClick={() => handleCreateFromTemplate(t)}
              disabled={templateLoading !== null}
              className="rounded-lg border border-border bg-bg-elevated p-3 text-left transition-colors hover:border-primary/50 hover:bg-primary/5 disabled:opacity-50"
            >
              <span className="text-sm font-bold text-primary">Plantilla {t}</span>
              <p className="mt-1 text-xs text-text-40">{TEMPLATE_DESCRIPTIONS[t]}</p>
              {templateLoading === t && <p className="mt-1 text-xs text-ia">Creando...</p>}
            </button>
          ))}
        </div>
      </div>

      {/* Actions bar */}
      <div className="flex items-center justify-between gap-4">
        <select
          value={statusFilter}
          onChange={(e) => handleStatusChange(e.target.value)}
          className={inputClass + " max-w-[180px]"}
        >
          <option value="all">Todos los estados</option>
          <option value="draft">Borrador</option>
          <option value="published">Publicado</option>
          <option value="archived">Archivado</option>
        </select>

        <Link
          href="/admin/landing-pages/nueva"
          className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-bg-base hover:opacity-90 transition-opacity"
        >
          <Plus className="h-4 w-4" />
          Nueva landing
        </Link>
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-xl border border-border bg-bg-surface">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border text-left text-sm text-text-40">
              <th className="px-4 py-3 font-medium">Campana</th>
              <th className="px-4 py-3 font-medium">Slug</th>
              <th className="px-4 py-3 font-medium">Servicio</th>
              <th className="px-4 py-3 font-medium">Estado</th>
              <th className="px-4 py-3 font-medium text-right">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-text-40">
                  Cargando...
                </td>
              </tr>
            ) : landings.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-text-40">
                  No hay landing pages. Crea una nueva o usa una plantilla.
                </td>
              </tr>
            ) : (
              landings.map((landing) => (
                <tr
                  key={landing.id}
                  className="border-b border-border/50 transition-colors hover:bg-bg-elevated/50"
                >
                  <td className="px-4 py-3">
                    <span className="font-medium text-text-100">{landing.campaignName}</span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="flex items-center gap-1 text-sm text-text-70">
                      /lp/{landing.slug}
                      <ExternalLink className="h-3 w-3 text-text-40" />
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    {landing.serviceType ? (
                      <span
                        className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-medium bg-${landing.serviceType}/10 text-${landing.serviceType}`}
                      >
                        {SERVICE_LABELS[landing.serviceType] || landing.serviceType}
                      </span>
                    ) : (
                      <span className="text-xs text-text-40">--</span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-medium ${STATUS_COLORS[landing.status] || ""}`}
                    >
                      {landing.status === "draft"
                        ? "Borrador"
                        : landing.status === "published"
                          ? "Publicado"
                          : "Archivado"}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Link
                        href={`/admin/landing-pages/${landing.id}`}
                        className="rounded-md p-2 text-text-40 hover:bg-bg-elevated hover:text-primary transition-colors"
                        title="Editar"
                      >
                        <Pencil className="h-4 w-4" />
                      </Link>
                      <button
                        onClick={() => handleDuplicate(landing.id)}
                        className="rounded-md p-2 text-text-40 hover:bg-bg-elevated hover:text-ia transition-colors"
                        title="Duplicar"
                      >
                        <Copy className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(landing.id)}
                        className="rounded-md p-2 text-text-40 hover:bg-bg-elevated hover:text-red-400 transition-colors"
                        title="Eliminar"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {total > 0 && (
        <p className="text-sm text-text-40">
          Mostrando {landings.length} de {total} landing pages
        </p>
      )}
    </div>
  );
}
