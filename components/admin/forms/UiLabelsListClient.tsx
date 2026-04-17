"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Pencil, Search, Trash2 } from "lucide-react";
import { deleteUiLabel } from "@/lib/admin/actions/ui-labels.actions";

interface UiLabelRow {
  id: string;
  key: string;
  labelEs: string;
  labelEn: string;
  category: string;
  description: string;
}

const CATEGORY_LABELS: Record<string, string> = {
  caso: "Casos",
  nav: "Nav",
  footer: "Footer",
  seo: "SEO",
  servicio: "Servicio",
  ui_generic: "UI genérico",
  blog: "Blog",
  form: "Formularios",
};

const categoryBadgeClass =
  "rounded-full px-2 py-0.5 text-[10px] uppercase tracking-wider bg-bg-elevated text-text-70";

const inputClass =
  "w-full rounded-lg border border-border bg-bg-elevated px-4 py-2 text-sm text-text-100 placeholder:text-text-40 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition-colors";

export function UiLabelsListClient({ initialRows }: { initialRows: UiLabelRow[] }) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<string>("all");

  const categories = useMemo(() => {
    const set = new Set<string>();
    for (const r of initialRows) if (r.category) set.add(r.category);
    return Array.from(set).sort();
  }, [initialRows]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return initialRows.filter((r) => {
      if (activeCategory !== "all" && r.category !== activeCategory) return false;
      if (!q) return true;
      return (
        r.key.toLowerCase().includes(q) ||
        r.labelEs.toLowerCase().includes(q) ||
        r.labelEn.toLowerCase().includes(q) ||
        r.description.toLowerCase().includes(q)
      );
    });
  }, [initialRows, query, activeCategory]);

  async function handleDelete(id: string, key: string) {
    if (
      !confirm(`¿Eliminar el label "${key}"? El texto desaparecerá de cualquier página que lo use.`)
    )
      return;
    await deleteUiLabel(id);
    router.refresh();
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-1 rounded-lg border border-border bg-bg-elevated p-1">
          <button
            type="button"
            onClick={() => setActiveCategory("all")}
            className={`rounded-md px-3 py-1 text-xs font-medium transition-colors ${
              activeCategory === "all" ? "bg-primary/10 text-primary" : "text-text-70"
            }`}
          >
            Todas ({initialRows.length})
          </button>
          {categories.map((c) => {
            const count = initialRows.filter((r) => r.category === c).length;
            return (
              <button
                key={c}
                type="button"
                onClick={() => setActiveCategory(c)}
                className={`rounded-md px-3 py-1 text-xs font-medium transition-colors ${
                  activeCategory === c ? "bg-primary/10 text-primary" : "text-text-70"
                }`}
              >
                {CATEGORY_LABELS[c] ?? c} ({count})
              </button>
            );
          })}
        </div>
        <div className="relative flex-1 min-w-[240px]">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-40" />
          <input
            type="text"
            placeholder="Buscar por key, label o descripción…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className={`${inputClass} pl-9`}
          />
        </div>
      </div>

      <div className="rounded-xl border border-border bg-bg-surface overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-bg-elevated border-b border-border">
            <tr className="text-left text-xs uppercase tracking-wider text-text-40">
              <th className="px-4 py-3 font-medium">Key</th>
              <th className="px-4 py-3 font-medium">Label ES</th>
              <th className="px-4 py-3 font-medium">Label EN</th>
              <th className="px-4 py-3 font-medium">Categoría</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-text-40">
                  Sin resultados.
                </td>
              </tr>
            ) : (
              filtered.map((r) => (
                <tr
                  key={r.id}
                  className="border-b border-border last:border-0 hover:bg-bg-elevated/50"
                >
                  <td className="px-4 py-3 font-mono text-xs text-text-70">{r.key}</td>
                  <td className="px-4 py-3 text-text-100 truncate max-w-[260px]" title={r.labelEs}>
                    {r.labelEs}
                  </td>
                  <td className="px-4 py-3 text-text-100 truncate max-w-[260px]" title={r.labelEn}>
                    {r.labelEn}
                  </td>
                  <td className="px-4 py-3">
                    <span className={categoryBadgeClass}>
                      {CATEGORY_LABELS[r.category] ?? r.category}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="inline-flex items-center gap-1">
                      <Link
                        href={`/admin/ui-labels/${r.id}`}
                        className="rounded-lg p-2 text-text-40 hover:bg-primary/10 hover:text-primary"
                        aria-label="Editar"
                      >
                        <Pencil className="h-4 w-4" />
                      </Link>
                      <button
                        type="button"
                        onClick={() => handleDelete(r.id, r.key)}
                        className="rounded-lg p-2 text-text-40 hover:bg-red-500/10 hover:text-red-400"
                        aria-label="Eliminar"
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
    </div>
  );
}
