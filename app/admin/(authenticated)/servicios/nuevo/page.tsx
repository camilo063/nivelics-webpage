"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Save, Loader2 } from "lucide-react";
import { createServicio } from "@/lib/admin/actions/servicios.actions";
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

export default function NuevoServicioPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [saving, setSaving] = useState(false);
  const [titleEs, setTitleEs] = useState("");
  const [slugEs, setSlugEs] = useState("");
  const [serviceType, setServiceType] = useState<"hub" | "sub">("sub");
  const [accentColor, setAccentColor] = useState<"ia" | "cloud" | "staffing" | "finops" | "dev">(
    "dev",
  );
  const [autoSlug, setAutoSlug] = useState(true);

  function handleTitleChange(value: string) {
    setTitleEs(value);
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
    if (!titleEs.trim() || !slugEs.trim()) return;

    setSaving(true);
    try {
      await createServicio({
        slugEs,
        serviceType,
        accentColor,
        titleEs: titleEs.trim(),
      });
      toast("Servicio creado correctamente", "success");
      router.push(`/admin/servicios/${slugEs}`);
    } catch (err) {
      toast(err instanceof Error ? err.message : "Error al crear servicio", "error");
      setSaving(false);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link
          href="/admin/servicios"
          className="rounded-lg p-2 hover:bg-bg-elevated transition-colors"
        >
          <ArrowLeft className="h-5 w-5 text-text-70" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold">Nuevo servicio</h1>
          <p className="text-text-70">Crear un nuevo servicio</p>
        </div>
      </div>

      <form
        onSubmit={handleSubmit}
        className="rounded-xl border border-border bg-bg-surface p-6 space-y-6 max-w-2xl"
      >
        {/* Title ES */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-text-70">
            Titulo (ES) <span className="text-red-400">*</span>
          </label>
          <input
            type="text"
            value={titleEs}
            onChange={(e) => handleTitleChange(e.target.value)}
            placeholder="Ej: Desarrollo de Software"
            className={inputClass}
            required
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
            placeholder="desarrollo-de-software"
            className={inputClass}
            required
          />
          <p className="text-xs text-text-40">Se genera automaticamente del titulo</p>
        </div>

        {/* Service Type */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-text-70">Tipo de servicio</label>
          <select
            value={serviceType}
            onChange={(e) => setServiceType(e.target.value as "hub" | "sub")}
            className={selectClass}
          >
            <option value="hub">Hub (servicio principal)</option>
            <option value="sub">Sub (sub-servicio)</option>
          </select>
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
            disabled={saving || !titleEs.trim() || !slugEs.trim()}
            className="inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-2.5 text-sm font-semibold text-white hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
            Crear servicio
          </button>
          <Link
            href="/admin/servicios"
            className="rounded-xl px-6 py-2.5 text-sm font-medium text-text-70 hover:bg-bg-elevated transition-colors"
          >
            Cancelar
          </Link>
        </div>
      </form>
    </div>
  );
}
