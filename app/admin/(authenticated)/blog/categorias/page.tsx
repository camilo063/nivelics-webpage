"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { ArrowLeft, Plus, Pencil, Trash2, Save, X, Loader2 } from "lucide-react";
import {
  getBlogCategories,
  createBlogCategory,
  updateBlogCategory,
  deleteBlogCategory,
} from "@/lib/admin/actions/blog.actions";
import { useToast } from "@/components/admin/ui/Toast";

const inputClass =
  "w-full rounded-lg border border-border bg-bg-elevated px-4 py-3 text-text-100 placeholder:text-text-40 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition-colors";

interface BlogCategory {
  id: string;
  slug: string;
  nameEs: string;
  nameEn: string | null;
  color: string | null;
  icon: string | null;
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export default function BlogCategoriasPage() {
  const { toast } = useToast();
  const [categories, setCategories] = useState<BlogCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  // Form state
  const [formSlug, setFormSlug] = useState("");
  const [formNameEs, setFormNameEs] = useState("");
  const [formNameEn, setFormNameEn] = useState("");
  const [formColor, setFormColor] = useState("");
  const [formIcon, setFormIcon] = useState("");
  const [autoSlug, setAutoSlug] = useState(true);

  const loadCategories = useCallback(async () => {
    const result = await getBlogCategories();
    setCategories(result as BlogCategory[]);
    setLoading(false);
  }, []);

  useEffect(() => {
    loadCategories();
  }, [loadCategories]);

  function resetForm() {
    setFormSlug("");
    setFormNameEs("");
    setFormNameEn("");
    setFormColor("");
    setFormIcon("");
    setAutoSlug(true);
    setShowForm(false);
    setEditingId(null);
  }

  function handleNameEsChange(value: string) {
    setFormNameEs(value);
    if (autoSlug) {
      setFormSlug(slugify(value));
    }
  }

  function startEdit(cat: BlogCategory) {
    setEditingId(cat.id);
    setFormSlug(cat.slug);
    setFormNameEs(cat.nameEs);
    setFormNameEn(cat.nameEn || "");
    setFormColor(cat.color || "");
    setFormIcon(cat.icon || "");
    setAutoSlug(false);
    setShowForm(true);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!formNameEs.trim() || !formSlug.trim()) return;

    setSaving(true);
    try {
      if (editingId) {
        await updateBlogCategory(editingId, {
          slug: formSlug,
          nameEs: formNameEs.trim(),
          nameEn: formNameEn.trim() || undefined,
          color: formColor.trim() || undefined,
          icon: formIcon.trim() || undefined,
        });
        toast("Categoria actualizada", "success");
      } else {
        await createBlogCategory({
          slug: formSlug,
          nameEs: formNameEs.trim(),
          nameEn: formNameEn.trim() || undefined,
          color: formColor.trim() || undefined,
          icon: formIcon.trim() || undefined,
        });
        toast("Categoria creada", "success");
      }
      resetForm();
      await loadCategories();
    } catch (err) {
      toast(err instanceof Error ? err.message : "Error al guardar", "error");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: string, name: string) {
    if (!confirm(`Eliminar la categoria "${name}"? Los posts asociados perderan su categoria.`))
      return;
    try {
      await deleteBlogCategory(id);
      toast("Categoria eliminada", "success");
      await loadCategories();
    } catch (err) {
      toast(err instanceof Error ? err.message : "Error al eliminar", "error");
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/admin/blog" className="rounded-lg p-2 hover:bg-bg-elevated transition-colors">
          <ArrowLeft className="h-5 w-5 text-text-70" />
        </Link>
        <div className="flex-1">
          <h1 className="text-2xl font-bold">Categorias del Blog</h1>
          <p className="text-text-70">{categories.length} categorias</p>
        </div>
        {!showForm && (
          <button
            onClick={() => {
              resetForm();
              setShowForm(true);
            }}
            className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-white hover:bg-primary/90 transition-colors"
          >
            <Plus className="h-4 w-4" />
            Nueva categoria
          </button>
        )}
      </div>

      {/* Inline form */}
      {showForm && (
        <form
          onSubmit={handleSubmit}
          className="rounded-xl border border-border bg-bg-surface p-6 space-y-4"
        >
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">
              {editingId ? "Editar categoria" : "Nueva categoria"}
            </h2>
            <button
              type="button"
              onClick={resetForm}
              className="rounded-lg p-1.5 hover:bg-bg-elevated transition-colors"
            >
              <X className="h-4 w-4 text-text-40" />
            </button>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-text-70">
                Nombre (ES) <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                value={formNameEs}
                onChange={(e) => handleNameEsChange(e.target.value)}
                placeholder="Ej: Tecnologia"
                className={inputClass}
                required
              />
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-medium text-text-70">Nombre (EN)</label>
              <input
                type="text"
                value={formNameEn}
                onChange={(e) => setFormNameEn(e.target.value)}
                placeholder="Ej: Technology"
                className={inputClass}
              />
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-medium text-text-70">
                Slug <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                value={formSlug}
                onChange={(e) => {
                  setAutoSlug(false);
                  setFormSlug(e.target.value);
                }}
                placeholder="tecnologia"
                className={inputClass}
                required
              />
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-medium text-text-70">Color</label>
              <input
                type="text"
                value={formColor}
                onChange={(e) => setFormColor(e.target.value)}
                placeholder="Ej: #6366f1"
                className={inputClass}
              />
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-medium text-text-70">Icono</label>
              <input
                type="text"
                value={formIcon}
                onChange={(e) => setFormIcon(e.target.value)}
                placeholder="Ej: technology"
                className={inputClass}
              />
            </div>
          </div>

          <div className="flex items-center gap-3 pt-2">
            <button
              type="submit"
              disabled={saving || !formNameEs.trim() || !formSlug.trim()}
              className="inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-2.5 text-sm font-semibold text-white hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
              {editingId ? "Guardar cambios" : "Crear categoria"}
            </button>
            <button
              type="button"
              onClick={resetForm}
              className="rounded-xl px-6 py-2.5 text-sm font-medium text-text-70 hover:bg-bg-elevated transition-colors"
            >
              Cancelar
            </button>
          </div>
        </form>
      )}

      {/* Categories table */}
      {loading ? (
        <div className="rounded-xl border border-border bg-bg-surface p-12 text-center">
          <Loader2 className="h-6 w-6 animate-spin mx-auto text-text-40" />
        </div>
      ) : categories.length === 0 ? (
        <div className="rounded-xl border border-border bg-bg-surface p-12 text-center">
          <p className="text-text-40">No hay categorias. Crea la primera.</p>
        </div>
      ) : (
        <div className="rounded-xl border border-border bg-bg-surface overflow-hidden">
          <table className="w-full table-fixed text-sm">
            <thead>
              <tr className="border-b border-border bg-bg-elevated/50">
                <th className="w-[25%] px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-text-40">
                  Nombre ES
                </th>
                <th className="w-[20%] px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-text-40">
                  Nombre EN
                </th>
                <th className="w-[15%] px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-text-40">
                  Color
                </th>
                <th className="w-[20%] px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-text-40">
                  Slug
                </th>
                <th className="w-[20%] px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-text-40">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody>
              {categories.map((cat) => (
                <tr
                  key={cat.id}
                  className="border-b border-border last:border-b-0 hover:bg-bg-elevated/50 transition-colors"
                >
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-2">
                      {cat.icon && <span>{cat.icon}</span>}
                      <span className="font-medium text-text-100">{cat.nameEs}</span>
                    </div>
                  </td>
                  <td className="px-4 py-4 text-text-70">{cat.nameEn || "—"}</td>
                  <td className="px-4 py-4">
                    {cat.color ? (
                      <div className="flex items-center gap-2">
                        <div
                          className="h-4 w-4 rounded-full border border-border"
                          style={{ backgroundColor: cat.color }}
                        />
                        <span className="text-xs text-text-40">{cat.color}</span>
                      </div>
                    ) : (
                      <span className="text-text-40">—</span>
                    )}
                  </td>
                  <td className="px-4 py-4">
                    <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium bg-bg-elevated text-text-40">
                      {cat.slug}
                    </span>
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => startEdit(cat)}
                        className="inline-flex items-center gap-1.5 rounded-lg bg-bg-elevated px-3 py-1.5 text-xs font-medium text-text-70 hover:text-primary hover:bg-primary/5 transition-colors"
                      >
                        <Pencil className="h-3.5 w-3.5" />
                        Editar
                      </button>
                      <button
                        onClick={() => handleDelete(cat.id, cat.nameEs)}
                        className="inline-flex items-center rounded-lg px-2 py-1.5 text-xs font-medium text-red-400 hover:bg-red-500/10 transition-colors"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
