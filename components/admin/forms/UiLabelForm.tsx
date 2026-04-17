"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Save, Sparkles, Trash2 } from "lucide-react";
import { BilingualField } from "@/components/admin/ui/BilingualEditor";
import {
  createUiLabel,
  deleteUiLabel,
  translateUiLabel,
  updateUiLabel,
} from "@/lib/admin/actions/ui-labels.actions";
import { UI_LABEL_CATEGORIES, type UiLabelInput } from "@/lib/admin/validations/ui-labels.schema";

const inputClass =
  "w-full rounded-lg border border-border bg-bg-elevated px-4 py-3 text-text-100 placeholder:text-text-40 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition-colors";

const CATEGORY_OPTIONS: Array<{ value: (typeof UI_LABEL_CATEGORIES)[number]; label: string }> = [
  { value: "caso", label: "Casos de éxito" },
  { value: "nav", label: "Navegación" },
  { value: "footer", label: "Footer" },
  { value: "seo", label: "SEO" },
  { value: "servicio", label: "Servicios" },
  { value: "ui_generic", label: "UI genérico" },
  { value: "blog", label: "Blog" },
  { value: "form", label: "Formularios" },
];

interface Props {
  id?: string;
  initialData?: {
    key: string;
    labelEs: string;
    labelEn: string;
    category: UiLabelInput["category"];
    description: string;
  };
}

const DEFAULT_STATE: {
  key: string;
  labelEs: string;
  labelEn: string;
  category: UiLabelInput["category"];
  description: string;
} = {
  key: "",
  labelEs: "",
  labelEn: "",
  category: "ui_generic",
  description: "",
};

export default function UiLabelForm({ id, initialData }: Props) {
  const router = useRouter();
  const [data, setData] = useState({ ...DEFAULT_STATE, ...initialData });
  const [saving, setSaving] = useState(false);
  const [translating, setTranslating] = useState<null | "es" | "en">(null);
  const [error, setError] = useState("");
  const isEdit = Boolean(id);

  function update<K extends keyof typeof data>(key: K, value: (typeof data)[K]) {
    setData((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSave() {
    setSaving(true);
    setError("");
    try {
      if (isEdit && id) {
        await updateUiLabel(id, {
          labelEs: data.labelEs,
          labelEn: data.labelEn,
          category: data.category,
          description: data.description,
        });
      } else {
        await createUiLabel({
          key: data.key,
          labelEs: data.labelEs,
          labelEn: data.labelEn,
          category: data.category,
          description: data.description,
        });
        router.push("/admin/ui-labels");
        return;
      }
      router.refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Error al guardar");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    if (!id) return;
    if (!confirm(`¿Eliminar el label "${data.key}"?`)) return;
    setSaving(true);
    try {
      await deleteUiLabel(id);
      router.push("/admin/ui-labels");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Error al eliminar");
    } finally {
      setSaving(false);
    }
  }

  async function handleTranslate(direction: "es_to_en" | "en_to_es") {
    const source = direction === "es_to_en" ? data.labelEs : data.labelEn;
    if (!source.trim()) {
      setError("Agrega texto en el idioma de origen antes de traducir.");
      return;
    }
    setTranslating(direction === "es_to_en" ? "en" : "es");
    setError("");
    try {
      const translated = await translateUiLabel(source, direction === "es_to_en" ? "es" : "en");
      if (direction === "es_to_en") update("labelEn", translated);
      else update("labelEs", translated);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Error de traducción");
    } finally {
      setTranslating(null);
    }
  }

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_320px]">
      <div className="space-y-6">
        {error && (
          <div className="rounded-lg bg-red-500/10 border border-red-500/20 px-4 py-3 text-sm text-red-400">
            {error}
          </div>
        )}

        <div className="rounded-xl border border-border bg-bg-surface p-6 space-y-4">
          <div>
            <label className="mb-2 block text-sm font-medium text-text-70">Key</label>
            <input
              type="text"
              value={data.key}
              onChange={(e) => update("key", e.target.value)}
              disabled={isEdit}
              placeholder="caso.challenge_label"
              className={`${inputClass} font-mono ${isEdit ? "opacity-60" : ""}`}
            />
            <p className="mt-1 text-xs text-text-40">
              Identificador estable. Solo minúsculas, dígitos, &apos;.&apos;, &apos;_&apos;,
              &apos;-&apos;. No se puede cambiar una vez creado.
            </p>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-text-70">Categoría</label>
            <select
              value={data.category}
              onChange={(e) => update("category", e.target.value as UiLabelInput["category"])}
              className={inputClass}
            >
              {CATEGORY_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
          </div>

          <BilingualField
            labelEs="Label ES"
            labelEn="Label EN"
            valueEs={data.labelEs}
            valueEn={data.labelEn}
            onChangeEs={(v) => update("labelEs", v)}
            onChangeEn={(v) => update("labelEn", v)}
          />

          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => handleTranslate("es_to_en")}
              disabled={translating !== null}
              className="inline-flex items-center gap-2 rounded-lg border border-primary/30 bg-primary/10 px-3 py-1.5 text-xs font-medium text-primary hover:bg-primary/20 disabled:opacity-50"
            >
              {translating === "en" ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
              ) : (
                <Sparkles className="h-3.5 w-3.5" />
              )}
              Auto-traducir ES → EN
            </button>
            <button
              type="button"
              onClick={() => handleTranslate("en_to_es")}
              disabled={translating !== null}
              className="inline-flex items-center gap-2 rounded-lg border border-primary/30 bg-primary/10 px-3 py-1.5 text-xs font-medium text-primary hover:bg-primary/20 disabled:opacity-50"
            >
              {translating === "es" ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
              ) : (
                <Sparkles className="h-3.5 w-3.5" />
              )}
              Auto-traducir EN → ES
            </button>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-text-70">
              Descripción (ayuda para el admin)
            </label>
            <textarea
              rows={2}
              value={data.description}
              onChange={(e) => update("description", e.target.value)}
              placeholder="Dónde aparece este label (p.ej. encabezado de la sección 'El Reto' en páginas de casos de éxito)."
              className={inputClass}
            />
          </div>
        </div>
      </div>

      <div className="space-y-6">
        <div className="rounded-xl border border-border bg-bg-surface p-5 space-y-4">
          <h3 className="text-sm font-semibold text-text-100">Guardar</h3>
          <button
            type="button"
            onClick={handleSave}
            disabled={saving}
            className="flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-bg-base transition-opacity hover:opacity-90 disabled:opacity-50"
          >
            <Save className="h-4 w-4" />
            {saving ? "Guardando..." : isEdit ? "Guardar cambios" : "Crear label"}
          </button>
          {isEdit && (
            <button
              type="button"
              onClick={handleDelete}
              disabled={saving}
              className="flex w-full items-center justify-center gap-2 rounded-lg border border-red-500/30 px-4 py-2.5 text-sm font-medium text-red-400 hover:bg-red-500/10 disabled:opacity-50"
            >
              <Trash2 className="h-4 w-4" /> Eliminar
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
