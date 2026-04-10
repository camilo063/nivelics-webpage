"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Save, Loader2 } from "lucide-react";
import { createIndustria } from "@/lib/admin/actions/industrias.actions";
import { useToast } from "@/components/admin/ui/Toast";

const inputClass =
  "w-full rounded-lg border border-border bg-bg-elevated px-4 py-3 text-text-100 placeholder:text-text-40 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition-colors";

const selectClass =
  "w-full rounded-lg border border-border bg-bg-elevated px-4 py-3 text-text-100 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition-colors";

function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export default function NuevaIndustriaPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [saving, setSaving] = useState(false);
  const [nameEs, setNameEs] = useState("");
  const [nameEn, setNameEn] = useState("");
  const [slugEs, setSlugEs] = useState("");
  const [icon, setIcon] = useState("");
  const [accentColor, setAccentColor] = useState<"ia" | "cloud" | "staffing" | "finops" | "dev">(
    "dev",
  );
  const [autoSlug, setAutoSlug] = useState(true);

  function handleNameChange(value: string) {
    setNameEs(value);
    if (autoSlug) {
      setSlugEs(slugify(value));
    }
  }

  function handleSlugChange(value: string) {
    setAutoSlug(false);
    setSlugEs(value);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!nameEs.trim() || !slugEs.trim()) return;

    setSaving(true);
    try {
      await createIndustria({
        slugEs,
        nameEs: nameEs.trim(),
        nameEn: nameEn.trim() || undefined,
        icon: icon.trim() || undefined,
        accentColor,
      });
      toast("Industria creada correctamente", "success");
      router.push(`/admin/industrias/${slugEs}`);
    } catch (err) {
      toast(err instanceof Error ? err.message : "Error al crear industria", "error");
      setSaving(false);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link
          href="/admin/industrias"
          className="rounded-lg p-2 hover:bg-bg-elevated transition-colors"
        >
          <ArrowLeft className="h-5 w-5 text-text-70" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold">Nueva industria</h1>
          <p className="text-text-70">Crear una nueva industria</p>
        </div>
      </div>

      <form
        onSubmit={handleSubmit}
        className="rounded-xl border border-border bg-bg-surface p-6 space-y-6 max-w-2xl"
      >
        {/* Name ES */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-text-70">
            Nombre (ES) <span className="text-red-400">*</span>
          </label>
          <input
            type="text"
            value={nameEs}
            onChange={(e) => handleNameChange(e.target.value)}
            placeholder="Ej: Salud"
            className={inputClass}
            required
          />
        </div>

        {/* Name EN */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-text-70">Nombre (EN)</label>
          <input
            type="text"
            value={nameEn}
            onChange={(e) => setNameEn(e.target.value)}
            placeholder="Ej: Healthcare"
            className={inputClass}
          />
        </div>

        {/* Slug ES */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-text-70">
            Slug (ES) <span className="text-red-400">*</span>
          </label>
          <input
            type="text"
            value={slugEs}
            onChange={(e) => handleSlugChange(e.target.value)}
            placeholder="salud"
            className={inputClass}
            required
          />
          <p className="text-xs text-text-40">Se genera automaticamente del nombre</p>
        </div>

        {/* Icon */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-text-70">Icono (emoji)</label>
          <input
            type="text"
            value={icon}
            onChange={(e) => setIcon(e.target.value)}
            placeholder="Ej: 🏥"
            className={inputClass}
          />
        </div>

        {/* Accent Color */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-text-70">Color de acento</label>
          <select
            value={accentColor}
            onChange={(e) =>
              setAccentColor(e.target.value as "ia" | "cloud" | "staffing" | "finops" | "dev")
            }
            className={selectClass}
          >
            <option value="ia">IA</option>
            <option value="cloud">Cloud</option>
            <option value="staffing">Staffing</option>
            <option value="finops">FinOps</option>
            <option value="dev">Dev</option>
          </select>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3 pt-4 border-t border-border">
          <button
            type="submit"
            disabled={saving || !nameEs.trim() || !slugEs.trim()}
            className="inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-2.5 text-sm font-semibold text-white hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
            Crear industria
          </button>
          <Link
            href="/admin/industrias"
            className="rounded-xl px-6 py-2.5 text-sm font-medium text-text-70 hover:bg-bg-elevated transition-colors"
          >
            Cancelar
          </Link>
        </div>
      </form>
    </div>
  );
}
