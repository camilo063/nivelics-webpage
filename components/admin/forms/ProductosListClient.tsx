"use client";

import Link from "next/link";
import { useState } from "react";
import { Pencil, ExternalLink, ChevronUp, ChevronDown } from "lucide-react";
import type { Producto } from "@/lib/db/schema/admin";
import { reorderProductos } from "@/lib/admin/actions/productos.actions";

const STATUS_BADGE: Record<string, { label: string; cls: string }> = {
  published: { label: "Publicado", cls: "bg-staffing/10 text-staffing" },
  draft: { label: "Borrador", cls: "bg-white/5 text-text-40" },
  scheduled: { label: "Programado", cls: "bg-finops/10 text-finops" },
  archived: { label: "Archivado", cls: "bg-red-500/10 text-red-400" },
};

const TRANSLATION_BADGE: Record<string, { label: string; cls: string }> = {
  complete: { label: "Completo", cls: "bg-staffing/10 text-staffing" },
  auto: { label: "Auto", cls: "bg-finops/10 text-finops" },
  partial: { label: "Parcial", cls: "bg-finops/10 text-finops" },
  pending: { label: "Pendiente", cls: "bg-red-500/10 text-red-400" },
};

interface Props {
  items: Producto[];
}

export function ProductosListClient({ items: initial }: Props) {
  const [items, setItems] = useState(initial);
  const [saving, setSaving] = useState(false);

  async function move(idx: number, dir: -1 | 1) {
    const target = idx + dir;
    if (target < 0 || target >= items.length) return;
    const next = [...items];
    [next[idx], next[target]] = [next[target], next[idx]];
    const withOrder = next.map((it, i) => ({ ...it, sortOrder: i + 1 }));
    setItems(withOrder);
    setSaving(true);
    try {
      await reorderProductos(withOrder.map((it) => ({ id: it.id, sortOrder: it.sortOrder })));
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="rounded-xl border border-border bg-bg-surface overflow-hidden">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-border bg-white/[0.02]">
            <th className="px-4 py-3 text-left font-medium text-text-70">Orden</th>
            <th className="px-4 py-3 text-left font-medium text-text-70">Nombre</th>
            <th className="px-4 py-3 text-left font-medium text-text-70">Categoría</th>
            <th className="px-4 py-3 text-left font-medium text-text-70">Pricing</th>
            <th className="px-4 py-3 text-left font-medium text-text-70">Estado</th>
            <th className="px-4 py-3 text-left font-medium text-text-70">Trad. EN</th>
            <th className="px-4 py-3 text-right font-medium text-text-70">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {items.map((p, idx) => {
            const st = STATUS_BADGE[p.status] ?? STATUS_BADGE.draft;
            const tr = TRANSLATION_BADGE[p.translationStatusEn] ?? TRANSLATION_BADGE.pending;
            return (
              <tr key={p.id} className="border-b border-border last:border-0 hover:bg-white/[0.02]">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      disabled={idx === 0 || saving}
                      onClick={() => move(idx, -1)}
                      className="p-1 text-text-40 hover:text-text-100 disabled:opacity-30"
                    >
                      <ChevronUp className="h-3.5 w-3.5" />
                    </button>
                    <span className="text-xs text-text-40 font-mono">{idx + 1}</span>
                    <button
                      type="button"
                      disabled={idx === items.length - 1 || saving}
                      onClick={() => move(idx, 1)}
                      className="p-1 text-text-40 hover:text-text-100 disabled:opacity-30"
                    >
                      <ChevronDown className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <div className="font-medium text-text-100">{p.name}</div>
                  <div className="text-xs text-text-40">{p.taglineEs}</div>
                </td>
                <td className="px-4 py-3 text-text-70">{p.categoryEs}</td>
                <td className="px-4 py-3 text-text-70">{p.pricingLabelEs ?? "—"}</td>
                <td className="px-4 py-3">
                  <span
                    className={`inline-flex rounded-full px-2 py-0.5 text-[11px] font-medium ${st.cls}`}
                  >
                    {st.label}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <span
                    className={`inline-flex rounded-full px-2 py-0.5 text-[11px] font-medium ${tr.cls}`}
                  >
                    {tr.label}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2 justify-end">
                    <Link
                      href={`/admin/productos/${p.id}`}
                      className="inline-flex items-center gap-1 rounded-lg px-3 py-1.5 text-xs font-medium text-primary hover:bg-primary/10"
                    >
                      <Pencil className="h-3.5 w-3.5" /> Editar
                    </Link>
                    <a
                      href={`/productos/${p.slugEs}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 rounded-lg px-3 py-1.5 text-xs font-medium text-text-40 hover:text-text-100"
                    >
                      <ExternalLink className="h-3.5 w-3.5" /> Ver
                    </a>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
