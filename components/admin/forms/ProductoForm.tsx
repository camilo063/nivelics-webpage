"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Save, Plus, Trash2, Check } from "lucide-react";
import type { Producto } from "@/lib/db/schema/admin";
import { updateProducto, type ProductoInput } from "@/lib/admin/actions/productos.actions";
import { BilingualField } from "@/components/admin/ui/BilingualEditor";
import { GeoIconPicker } from "@/components/admin/ui/GeoIconPicker";
import { ImageUploader } from "@/components/admin/ui/ImageUploader";

type TabKey = "contenido" | "features" | "comparativa" | "faqs" | "visual" | "publicacion";

const tabs: Array<{ key: TabKey; label: string }> = [
  { key: "contenido", label: "Contenido" },
  { key: "features", label: "Features" },
  { key: "comparativa", label: "Comparativa" },
  { key: "faqs", label: "FAQs" },
  { key: "visual", label: "Visual y SEO" },
  { key: "publicacion", label: "Publicación" },
];

const inputClass =
  "w-full rounded-lg border border-border bg-bg-elevated px-4 py-3 text-text-100 placeholder:text-text-40 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition-colors";

interface Props {
  initialData: Producto;
}

type FormState = Producto;

export default function ProductoForm({ initialData }: Props) {
  const router = useRouter();
  const [data, setData] = useState<FormState>(initialData);
  const [tab, setTab] = useState<TabKey>("contenido");
  const [saving, setSaving] = useState(false);
  const [translating, setTranslating] = useState(false);
  const [error, setError] = useState("");
  const [toast, setToast] = useState("");

  function up<K extends keyof FormState>(key: K, value: FormState[K]) {
    setData((p) => ({ ...p, [key]: value }));
  }

  async function handleSave() {
    setSaving(true);
    setError("");
    try {
      const payload: ProductoInput = {
        slugEs: data.slugEs,
        slugEn: data.slugEn,
        name: data.name,
        taglineEs: data.taglineEs,
        taglineEn: data.taglineEn,
        descriptionEs: data.descriptionEs,
        descriptionEn: data.descriptionEn,
        externalUrl: data.externalUrl,
        externalCtaEs: data.externalCtaEs,
        externalCtaEn: data.externalCtaEn,
        icpEs: data.icpEs,
        icpEn: data.icpEn,
        categoryEs: data.categoryEs,
        categoryEn: data.categoryEn,
        pricingFrom: data.pricingFrom,
        pricingCurrency: data.pricingCurrency ?? "USD",
        pricingLabelEs: data.pricingLabelEs ?? "",
        pricingLabelEn: data.pricingLabelEn ?? "",
        pricingNoteEs: data.pricingNoteEs ?? "",
        pricingNoteEn: data.pricingNoteEn ?? "",
        metrics: data.metrics ?? [],
        features: data.features ?? [],
        comparisonTable: data.comparisonTable,
        faqs: data.faqs ?? [],
        accentColor: data.accentColor,
        heroEffect: data.heroEffect,
        ogImage: data.ogImage,
        seoTitleEs: data.seoTitleEs,
        seoTitleEn: data.seoTitleEn,
        seoDescriptionEs: data.seoDescriptionEs,
        seoDescriptionEn: data.seoDescriptionEn,
        schemaCategory: data.schemaCategory ?? "BusinessApplication",
        status: data.status,
        translationStatusEn: data.translationStatusEn,
        sortOrder: data.sortOrder,
      };
      await updateProducto(data.id, payload);
      setToast("✓ Guardado");
      setTimeout(() => setToast(""), 2500);
      router.refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Error al guardar");
    } finally {
      setSaving(false);
    }
  }

  async function translateOne(text: string): Promise<string> {
    if (!text) return "";
    const res = await fetch("/api/admin/translate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text, sourceLang: "es", targetLang: "en" }),
    });
    const json = await res.json();
    return json.translatedText ?? json.translation ?? text;
  }

  async function handleTranslate() {
    setTranslating(true);
    try {
      const [
        taglineEn,
        descriptionEn,
        externalCtaEn,
        icpEn,
        categoryEn,
        pricingLabelEn,
        pricingNoteEn,
        seoTitleEn,
        seoDescriptionEn,
      ] = await Promise.all([
        translateOne(data.taglineEs),
        translateOne(data.descriptionEs),
        translateOne(data.externalCtaEs),
        translateOne(data.icpEs),
        translateOne(data.categoryEs),
        data.pricingLabelEs ? translateOne(data.pricingLabelEs) : Promise.resolve(""),
        data.pricingNoteEs ? translateOne(data.pricingNoteEs) : Promise.resolve(""),
        translateOne(data.seoTitleEs),
        translateOne(data.seoDescriptionEs),
      ]);

      const metrics = await Promise.all(
        (data.metrics ?? []).map(async (m) => ({
          ...m,
          labelEn: await translateOne(m.labelEs),
        })),
      );
      const features = await Promise.all(
        (data.features ?? []).map(async (f) => ({
          ...f,
          titleEn: await translateOne(f.titleEs),
          descriptionEn: await translateOne(f.descriptionEs),
        })),
      );
      const faqs = await Promise.all(
        (data.faqs ?? []).map(async (f) => ({
          ...f,
          questionEn: await translateOne(f.questionEs),
          answerEn: await translateOne(f.answerEs),
        })),
      );

      setData((p) => ({
        ...p,
        taglineEn,
        descriptionEn,
        externalCtaEn,
        icpEn,
        categoryEn,
        pricingLabelEn: pricingLabelEn || p.pricingLabelEn,
        pricingNoteEn: pricingNoteEn || p.pricingNoteEn,
        seoTitleEn,
        seoDescriptionEn,
        metrics,
        features,
        faqs,
        translationStatusEn: "auto",
      }));
      setToast("✓ Traducción completada — revisa y ajusta si es necesario");
      setTimeout(() => setToast(""), 3500);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Error en traducción");
    } finally {
      setTranslating(false);
    }
  }

  const metrics = data.metrics ?? [];
  const features = data.features ?? [];
  const faqs = data.faqs ?? [];

  return (
    <div className="space-y-6">
      {/* Header actions */}
      <div className="flex items-center justify-between rounded-xl border border-border bg-bg-surface p-4">
        <div className="flex items-center gap-3">
          <span className="text-sm text-text-70">Estado:</span>
          <span
            className={`rounded-full px-3 py-1 text-xs font-semibold ${
              data.status === "published"
                ? "bg-staffing/10 text-staffing"
                : "bg-white/5 text-text-40"
            }`}
          >
            {data.status === "published" ? "Publicado" : "Borrador"}
          </span>
        </div>
        <div className="flex items-center gap-2">
          {toast && <span className="text-sm text-staffing">{toast}</span>}
          {error && <span className="text-sm text-red-400">{error}</span>}
          <button
            type="button"
            onClick={handleSave}
            disabled={saving}
            className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-white hover:bg-primary/90 disabled:opacity-50"
          >
            <Save className="h-4 w-4" />
            {saving ? "Guardando…" : "Guardar"}
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 rounded-lg border border-border bg-bg-elevated p-1 overflow-x-auto">
        {tabs.map((t) => (
          <button
            key={t.key}
            type="button"
            onClick={() => setTab(t.key)}
            className={`whitespace-nowrap rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
              tab === t.key ? "bg-primary/10 text-primary" : "text-text-70 hover:text-text-100"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* TAB: Contenido */}
      {tab === "contenido" && (
        <div className="space-y-6">
          <div className="rounded-xl border border-border bg-bg-surface p-6 space-y-4">
            <h3 className="text-sm font-semibold">Identidad</h3>
            <div>
              <label className="mb-2 block text-sm font-medium text-text-70">Nombre</label>
              <input
                value={data.name}
                onChange={(e) => up("name", e.target.value)}
                className={inputClass}
              />
            </div>
            <BilingualField
              labelEs="Tagline ES"
              labelEn="Tagline EN"
              valueEs={data.taglineEs}
              valueEn={data.taglineEn}
              onChangeEs={(v) => up("taglineEs", v)}
              onChangeEn={(v) => up("taglineEn", v)}
            />
            <BilingualField
              labelEs="Descripción ES"
              labelEn="Description EN"
              valueEs={data.descriptionEs}
              valueEn={data.descriptionEn}
              onChangeEs={(v) => up("descriptionEs", v)}
              onChangeEn={(v) => up("descriptionEn", v)}
              multiline
              rows={4}
            />
            <div>
              <label className="mb-2 block text-sm font-medium text-text-70">URL externa</label>
              <input
                value={data.externalUrl}
                onChange={(e) => up("externalUrl", e.target.value)}
                className={inputClass}
                placeholder="https://paywl.io"
              />
            </div>
            <BilingualField
              labelEs="CTA externa ES"
              labelEn="External CTA EN"
              valueEs={data.externalCtaEs}
              valueEn={data.externalCtaEn}
              onChangeEs={(v) => up("externalCtaEs", v)}
              onChangeEn={(v) => up("externalCtaEn", v)}
            />
            <BilingualField
              labelEs="ICP (Perfil de cliente) ES"
              labelEn="ICP EN"
              valueEs={data.icpEs}
              valueEn={data.icpEn}
              onChangeEs={(v) => up("icpEs", v)}
              onChangeEn={(v) => up("icpEn", v)}
            />
            <BilingualField
              labelEs="Categoría ES"
              labelEn="Category EN"
              valueEs={data.categoryEs}
              valueEn={data.categoryEn}
              onChangeEs={(v) => up("categoryEs", v)}
              onChangeEn={(v) => up("categoryEn", v)}
            />
          </div>

          <div className="rounded-xl border border-border bg-bg-surface p-6 space-y-4">
            <h3 className="text-sm font-semibold">Pricing</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="mb-2 block text-sm font-medium text-text-70">Desde (valor)</label>
                <input
                  type="number"
                  value={data.pricingFrom ?? ""}
                  onChange={(e) =>
                    up("pricingFrom", e.target.value ? Number(e.target.value) : null)
                  }
                  className={inputClass}
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-text-70">Moneda</label>
                <select
                  value={data.pricingCurrency ?? "USD"}
                  onChange={(e) => up("pricingCurrency", e.target.value)}
                  className={inputClass}
                >
                  <option value="USD">USD</option>
                  <option value="COP">COP</option>
                  <option value="EUR">EUR</option>
                </select>
              </div>
            </div>
            <BilingualField
              labelEs="Label pricing ES"
              labelEn="Label pricing EN"
              valueEs={data.pricingLabelEs ?? ""}
              valueEn={data.pricingLabelEn ?? ""}
              onChangeEs={(v) => up("pricingLabelEs", v)}
              onChangeEn={(v) => up("pricingLabelEn", v)}
            />
            <BilingualField
              labelEs="Nota pricing ES"
              labelEn="Note pricing EN"
              valueEs={data.pricingNoteEs ?? ""}
              valueEn={data.pricingNoteEn ?? ""}
              onChangeEs={(v) => up("pricingNoteEs", v)}
              onChangeEn={(v) => up("pricingNoteEn", v)}
            />
          </div>

          <div className="rounded-xl border border-border bg-bg-surface p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold">Métricas (máx 4)</h3>
              {metrics.length < 4 && (
                <button
                  type="button"
                  onClick={() =>
                    up("metrics", [...metrics, { value: "", labelEs: "", labelEn: "" }])
                  }
                  className="inline-flex items-center gap-1 rounded-lg px-2 py-1 text-xs text-primary hover:bg-primary/10"
                >
                  <Plus className="h-3.5 w-3.5" /> Agregar
                </button>
              )}
            </div>
            {metrics.map((m, idx) => (
              <div
                key={idx}
                className="rounded-lg border border-border bg-bg-elevated p-3 space-y-3"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs text-text-40">Métrica {idx + 1}</span>
                  <button
                    type="button"
                    onClick={() =>
                      up(
                        "metrics",
                        metrics.filter((_, i) => i !== idx),
                      )
                    }
                    className="text-red-400 hover:text-red-300"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
                <input
                  value={m.value}
                  onChange={(e) => {
                    const arr = [...metrics];
                    arr[idx] = { ...arr[idx], value: e.target.value };
                    up("metrics", arr);
                  }}
                  placeholder="$450"
                  className={inputClass}
                />
                <BilingualField
                  labelEs="Label ES"
                  labelEn="Label EN"
                  valueEs={m.labelEs}
                  valueEn={m.labelEn}
                  onChangeEs={(v) => {
                    const arr = [...metrics];
                    arr[idx] = { ...arr[idx], labelEs: v };
                    up("metrics", arr);
                  }}
                  onChangeEn={(v) => {
                    const arr = [...metrics];
                    arr[idx] = { ...arr[idx], labelEn: v };
                    up("metrics", arr);
                  }}
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB: Features */}
      {tab === "features" && (
        <div className="rounded-xl border border-border bg-bg-surface p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold">Features (máx 8)</h3>
            {features.length < 8 && (
              <button
                type="button"
                onClick={() =>
                  up("features", [
                    ...features,
                    {
                      icon: "hex-plus",
                      titleEs: "",
                      titleEn: "",
                      descriptionEs: "",
                      descriptionEn: "",
                    },
                  ])
                }
                className="inline-flex items-center gap-1 rounded-lg px-3 py-1.5 text-sm text-primary hover:bg-primary/10"
              >
                <Plus className="h-4 w-4" /> Agregar feature
              </button>
            )}
          </div>
          {features.map((f, idx) => (
            <div key={idx} className="rounded-lg border border-border bg-bg-elevated p-4 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Feature {idx + 1}</span>
                <button
                  type="button"
                  onClick={() =>
                    up(
                      "features",
                      features.filter((_, i) => i !== idx),
                    )
                  }
                  className="text-red-400 hover:text-red-300"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-text-70">Ícono</label>
                <GeoIconPicker
                  value={f.icon ?? ""}
                  onChange={(name) => {
                    const arr = [...features];
                    arr[idx] = { ...arr[idx], icon: name };
                    up("features", arr);
                  }}
                  accentColor={data.accentColor as "cyan" | "teal" | "violet"}
                />
              </div>
              <BilingualField
                labelEs="Título ES"
                labelEn="Title EN"
                valueEs={f.titleEs}
                valueEn={f.titleEn}
                onChangeEs={(v) => {
                  const arr = [...features];
                  arr[idx] = { ...arr[idx], titleEs: v };
                  up("features", arr);
                }}
                onChangeEn={(v) => {
                  const arr = [...features];
                  arr[idx] = { ...arr[idx], titleEn: v };
                  up("features", arr);
                }}
              />
              <BilingualField
                labelEs="Descripción ES"
                labelEn="Description EN"
                valueEs={f.descriptionEs}
                valueEn={f.descriptionEn}
                onChangeEs={(v) => {
                  const arr = [...features];
                  arr[idx] = { ...arr[idx], descriptionEs: v };
                  up("features", arr);
                }}
                onChangeEn={(v) => {
                  const arr = [...features];
                  arr[idx] = { ...arr[idx], descriptionEn: v };
                  up("features", arr);
                }}
                multiline
                rows={3}
              />
            </div>
          ))}
        </div>
      )}

      {/* TAB: Comparativa */}
      {tab === "comparativa" && (
        <div className="rounded-xl border border-border bg-bg-surface p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold">Tabla comparativa</h3>
            {data.comparisonTable ? (
              <button
                type="button"
                onClick={() => up("comparisonTable", null)}
                className="text-xs text-red-400 hover:text-red-300"
              >
                Eliminar tabla
              </button>
            ) : (
              <button
                type="button"
                onClick={() =>
                  up("comparisonTable", {
                    headersEs: ["Proveedor", "Precio"],
                    headersEn: ["Provider", "Price"],
                    rows: [],
                  })
                }
                className="inline-flex items-center gap-1 text-xs text-primary hover:bg-primary/10 rounded-lg px-2 py-1"
              >
                <Plus className="h-3.5 w-3.5" /> Crear tabla
              </button>
            )}
          </div>
          {data.comparisonTable && (
            <ComparisonEditor
              table={data.comparisonTable}
              onChange={(t) => up("comparisonTable", t)}
            />
          )}
        </div>
      )}

      {/* TAB: FAQs */}
      {tab === "faqs" && (
        <div className="rounded-xl border border-border bg-bg-surface p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold">Preguntas frecuentes</h3>
            <button
              type="button"
              onClick={() =>
                up("faqs", [
                  ...faqs,
                  { questionEs: "", questionEn: "", answerEs: "", answerEn: "" },
                ])
              }
              className="inline-flex items-center gap-1 rounded-lg px-3 py-1.5 text-sm text-primary hover:bg-primary/10"
            >
              <Plus className="h-4 w-4" /> Agregar FAQ
            </button>
          </div>
          {faqs.map((q, idx) => (
            <div key={idx} className="rounded-lg border border-border bg-bg-elevated p-4 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">FAQ {idx + 1}</span>
                <button
                  type="button"
                  onClick={() =>
                    up(
                      "faqs",
                      faqs.filter((_, i) => i !== idx),
                    )
                  }
                  className="text-red-400 hover:text-red-300"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
              <BilingualField
                labelEs="Pregunta ES"
                labelEn="Question EN"
                valueEs={q.questionEs}
                valueEn={q.questionEn}
                onChangeEs={(v) => {
                  const arr = [...faqs];
                  arr[idx] = { ...arr[idx], questionEs: v };
                  up("faqs", arr);
                }}
                onChangeEn={(v) => {
                  const arr = [...faqs];
                  arr[idx] = { ...arr[idx], questionEn: v };
                  up("faqs", arr);
                }}
              />
              <BilingualField
                labelEs="Respuesta ES"
                labelEn="Answer EN"
                valueEs={q.answerEs}
                valueEn={q.answerEn}
                onChangeEs={(v) => {
                  const arr = [...faqs];
                  arr[idx] = { ...arr[idx], answerEs: v };
                  up("faqs", arr);
                }}
                onChangeEn={(v) => {
                  const arr = [...faqs];
                  arr[idx] = { ...arr[idx], answerEn: v };
                  up("faqs", arr);
                }}
                multiline
                rows={4}
              />
            </div>
          ))}
        </div>
      )}

      {/* TAB: Visual y SEO */}
      {tab === "visual" && (
        <div className="space-y-6">
          <div className="rounded-xl border border-border bg-bg-surface p-6 space-y-4">
            <h3 className="text-sm font-semibold">Visual</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="mb-2 block text-sm font-medium text-text-70">Accent color</label>
                <select
                  value={data.accentColor}
                  onChange={(e) => up("accentColor", e.target.value)}
                  className={inputClass}
                >
                  <option value="cyan">Cyan</option>
                  <option value="teal">Teal</option>
                  <option value="violet">Violet</option>
                </select>
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-text-70">Hero effect</label>
                <select
                  value={data.heroEffect}
                  onChange={(e) => up("heroEffect", e.target.value)}
                  className={inputClass}
                >
                  <option value="particles">Particles</option>
                  <option value="hex">Hex</option>
                  <option value="grid">Grid</option>
                  <option value="diagonal">Diagonal</option>
                  <option value="radar">Radar</option>
                </select>
              </div>
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-text-70">OG Image</label>
              <ImageUploader
                value={data.ogImage ?? ""}
                onChange={(url) => up("ogImage", url)}
                folder="productos"
                aspectRatio="16/9"
              />
            </div>
          </div>

          <div className="rounded-xl border border-border bg-bg-surface p-6 space-y-4">
            <h3 className="text-sm font-semibold">SEO</h3>
            <BilingualField
              labelEs="SEO title ES"
              labelEn="SEO title EN"
              valueEs={data.seoTitleEs}
              valueEn={data.seoTitleEn}
              onChangeEs={(v) => up("seoTitleEs", v)}
              onChangeEn={(v) => up("seoTitleEn", v)}
            />
            <BilingualField
              labelEs="SEO description ES"
              labelEn="SEO description EN"
              valueEs={data.seoDescriptionEs}
              valueEn={data.seoDescriptionEn}
              onChangeEs={(v) => up("seoDescriptionEs", v)}
              onChangeEn={(v) => up("seoDescriptionEn", v)}
              multiline
              rows={3}
            />
            <div>
              <label className="mb-2 block text-sm font-medium text-text-70">Schema category</label>
              <select
                value={data.schemaCategory ?? "BusinessApplication"}
                onChange={(e) => up("schemaCategory", e.target.value)}
                className={inputClass}
              >
                <option value="BusinessApplication">BusinessApplication</option>
                <option value="WebApplication">WebApplication</option>
                <option value="MobileApplication">MobileApplication</option>
              </select>
            </div>
          </div>
        </div>
      )}

      {/* TAB: Publicación */}
      {tab === "publicacion" && (
        <div className="rounded-xl border border-border bg-bg-surface p-6 space-y-4">
          <h3 className="text-sm font-semibold">Publicación y traducción</h3>
          <div>
            <label className="mb-2 block text-sm font-medium text-text-70">Estado</label>
            <select
              value={data.status}
              onChange={(e) => up("status", e.target.value as FormState["status"])}
              className={inputClass}
            >
              <option value="draft">Borrador</option>
              <option value="published">Publicado</option>
              <option value="scheduled">Programado</option>
              <option value="archived">Archivado</option>
            </select>
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium text-text-70">
              Estado de traducción EN
            </label>
            <select
              value={data.translationStatusEn}
              onChange={(e) =>
                up("translationStatusEn", e.target.value as FormState["translationStatusEn"])
              }
              className={inputClass}
            >
              <option value="pending">Pendiente</option>
              <option value="auto">Auto-traducido</option>
              <option value="partial">Parcial</option>
              <option value="complete">Completo</option>
            </select>
          </div>
          <button
            type="button"
            onClick={handleTranslate}
            disabled={translating}
            className="inline-flex items-center gap-2 rounded-xl border border-primary/30 bg-primary/10 px-4 py-2.5 text-sm font-semibold text-primary hover:bg-primary/20 disabled:opacity-50"
          >
            <Check className="h-4 w-4" />
            {translating ? "Traduciendo…" : "Traducir al inglés automáticamente"}
          </button>
        </div>
      )}
    </div>
  );
}

function ComparisonEditor({
  table,
  onChange,
}: {
  table: NonNullable<Producto["comparisonTable"]>;
  onChange: (t: NonNullable<Producto["comparisonTable"]>) => void;
}) {
  function updateHeaders(lang: "es" | "en", headers: string[]) {
    onChange({ ...table, [lang === "es" ? "headersEs" : "headersEn"]: headers });
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="mb-2 block text-xs font-medium text-text-70">Headers ES</label>
          {table.headersEs.map((h, i) => (
            <input
              key={i}
              value={h}
              onChange={(e) => {
                const arr = [...table.headersEs];
                arr[i] = e.target.value;
                updateHeaders("es", arr);
              }}
              className={`${inputClass} mb-2`}
            />
          ))}
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => updateHeaders("es", [...table.headersEs, ""])}
              className="text-xs text-primary hover:underline"
            >
              + Col
            </button>
            {table.headersEs.length > 1 && (
              <button
                type="button"
                onClick={() => updateHeaders("es", table.headersEs.slice(0, -1))}
                className="text-xs text-red-400 hover:underline"
              >
                – Col
              </button>
            )}
          </div>
        </div>
        <div>
          <label className="mb-2 block text-xs font-medium text-text-70">Headers EN</label>
          {table.headersEn.map((h, i) => (
            <input
              key={i}
              value={h}
              onChange={(e) => {
                const arr = [...table.headersEn];
                arr[i] = e.target.value;
                updateHeaders("en", arr);
              }}
              className={`${inputClass} mb-2`}
            />
          ))}
        </div>
      </div>

      <div className="space-y-3">
        {table.rows.map((row, ri) => (
          <div key={ri} className="rounded-lg border border-border bg-bg-elevated p-3 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium">Fila {ri + 1}</span>
              <div className="flex items-center gap-2">
                <label className="inline-flex items-center gap-1 text-xs text-text-70">
                  <input
                    type="checkbox"
                    checked={row.isNivelicsProduct}
                    onChange={(e) => {
                      const arr = [...table.rows];
                      arr[ri] = { ...arr[ri], isNivelicsProduct: e.target.checked };
                      onChange({ ...table, rows: arr });
                    }}
                  />
                  Producto Nivelics
                </label>
                <button
                  type="button"
                  onClick={() =>
                    onChange({ ...table, rows: table.rows.filter((_, i) => i !== ri) })
                  }
                  className="text-red-400 hover:text-red-300"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <input
                value={row.featureEs}
                onChange={(e) => {
                  const arr = [...table.rows];
                  arr[ri] = { ...arr[ri], featureEs: e.target.value };
                  onChange({ ...table, rows: arr });
                }}
                placeholder="Feature ES"
                className={inputClass}
              />
              <input
                value={row.featureEn}
                onChange={(e) => {
                  const arr = [...table.rows];
                  arr[ri] = { ...arr[ri], featureEn: e.target.value };
                  onChange({ ...table, rows: arr });
                }}
                placeholder="Feature EN"
                className={inputClass}
              />
            </div>
            <div className="grid grid-cols-1 gap-2">
              {table.headersEs.slice(1).map((h, vi) => (
                <input
                  key={vi}
                  value={row.values[vi] ?? ""}
                  onChange={(e) => {
                    const arr = [...table.rows];
                    const vals = [...(arr[ri].values ?? [])];
                    vals[vi] = e.target.value;
                    arr[ri] = { ...arr[ri], values: vals };
                    onChange({ ...table, rows: arr });
                  }}
                  placeholder={h}
                  className={inputClass}
                />
              ))}
            </div>
          </div>
        ))}
        <button
          type="button"
          onClick={() =>
            onChange({
              ...table,
              rows: [
                ...table.rows,
                {
                  featureEs: "",
                  featureEn: "",
                  isNivelicsProduct: false,
                  values: Array(Math.max(0, table.headersEs.length - 1)).fill(""),
                },
              ],
            })
          }
          className="inline-flex items-center gap-1 rounded-lg px-3 py-1.5 text-sm text-primary hover:bg-primary/10"
        >
          <Plus className="h-4 w-4" /> Agregar fila
        </button>
      </div>
    </div>
  );
}
