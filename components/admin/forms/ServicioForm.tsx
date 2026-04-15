"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { BilingualField } from "@/components/admin/ui/BilingualEditor";
import { GeoIconPicker } from "@/components/admin/ui/GeoIconPicker";
import { ImageUploader } from "@/components/admin/ui/ImageUploader";
import { updateServicio } from "@/lib/admin/actions/servicios.actions";
import type { IconColor } from "@/lib/icons/geometric";
import { Plus, X, ChevronUp, ChevronDown, Search, Trash2 } from "lucide-react";

const SERVICIO_ACCENT_TO_ICON_COLOR: Record<ServicioData["accentColor"], IconColor> = {
  ia: "violet",
  cloud: "cyan",
  staffing: "green",
  finops: "amber",
  dev: "amber",
};

// ─── Types ───────────────────────────────────────────────

interface Benefit {
  icon: string;
  titleEs: string;
  titleEn: string;
  copyEs: string;
  copyEn: string;
}

interface ProcessStep {
  number: number;
  titleEs: string;
  titleEn: string;
  descEs: string;
  descEn: string;
  duration: string;
}

interface Metric {
  value: string;
  unit: string;
  labelEs: string;
  labelEn: string;
}

interface FAQ {
  questionEs: string;
  questionEn: string;
  answerEs: string;
  answerEn: string;
}

interface HubMetric {
  value: string;
  labelEs: string;
  labelEn: string;
}

interface FrameworkPillar {
  letter: string;
  colorClass: string;
  borderClass: string;
  titleEs: string;
  titleEn: string;
  descEs: string;
  descEn: string;
}

interface Sector {
  slug: string;
  icon: string;
  labelEs: string;
  labelEn: string;
}

interface ServicioData {
  slugEs: string;
  titleEs: string;
  titleEn: string;
  subtitleEs: string;
  subtitleEn: string;
  descriptionEs: string;
  descriptionEn: string;
  coverImage: string;
  accentColor: "ia" | "cloud" | "staffing" | "finops" | "dev";
  icon: string;
  benefits: Benefit[];
  processSteps: ProcessStep[];
  metrics: Metric[];
  faqs: FAQ[];
  ctaPrimaryTextEs: string;
  ctaPrimaryTextEn: string;
  ctaPrimaryUrl: string;
  ctaSecondaryTextEs: string;
  ctaSecondaryTextEn: string;
  ctaSecondaryUrl: string;
  seoTitleEs: string;
  seoTitleEn: string;
  seoDescriptionEs: string;
  seoDescriptionEn: string;
  translationStatusEn: "complete" | "partial" | "pending" | "auto";
  status: "draft" | "published" | "scheduled" | "archived";
  serviceType: "hub" | "sub";
  hubMetrics: HubMetric[];
  frameworkTitleEs: string;
  frameworkTitleEn: string;
  frameworkSubtitleEs: string;
  frameworkSubtitleEn: string;
  frameworkPillars: FrameworkPillar[];
  sectorsTitleEs: string;
  sectorsTitleEn: string;
  sectors: Sector[];
}

const defaultServicio: ServicioData = {
  slugEs: "",
  titleEs: "",
  titleEn: "",
  subtitleEs: "",
  subtitleEn: "",
  descriptionEs: "",
  descriptionEn: "",
  coverImage: "",
  accentColor: "dev",
  icon: "",
  benefits: [],
  processSteps: [],
  metrics: [],
  faqs: [],
  ctaPrimaryTextEs: "",
  ctaPrimaryTextEn: "",
  ctaPrimaryUrl: "",
  ctaSecondaryTextEs: "",
  ctaSecondaryTextEn: "",
  ctaSecondaryUrl: "",
  seoTitleEs: "",
  seoTitleEn: "",
  seoDescriptionEs: "",
  seoDescriptionEn: "",
  translationStatusEn: "pending",
  status: "published",
  serviceType: "sub",
  hubMetrics: [],
  frameworkTitleEs: "",
  frameworkTitleEn: "",
  frameworkSubtitleEs: "",
  frameworkSubtitleEn: "",
  frameworkPillars: [],
  sectorsTitleEs: "",
  sectorsTitleEn: "",
  sectors: [],
};

// ─── Constants ───────────────────────────────────────────

const BASE_TABS = [
  { key: "contenido", label: "Contenido" },
  { key: "beneficios", label: "Beneficios" },
  { key: "proceso", label: "Proceso" },
  { key: "metricas", label: "Métricas" },
  { key: "faqs", label: "FAQs" },
  { key: "ctas-seo", label: "CTAs y SEO" },
] as const;

const HUB_TAB = { key: "hub", label: "Hub: I+C+S" } as const;

type TabKey = "contenido" | "beneficios" | "proceso" | "metricas" | "faqs" | "ctas-seo" | "hub";

const accentOptions = [
  { value: "ia", label: "IA", color: "bg-purple-500" },
  { value: "cloud", label: "Cloud", color: "bg-blue-500" },
  { value: "staffing", label: "Staffing", color: "bg-green-500" },
  { value: "finops", label: "FinOps", color: "bg-amber-500" },
  { value: "dev", label: "Dev", color: "bg-cyan-500" },
] as const;

const inputClass =
  "w-full rounded-lg border border-border bg-bg-elevated px-4 py-3 text-text-100 placeholder:text-text-40 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition-colors";

const translationStatusConfig = {
  complete: { label: "Completo" },
  partial: { label: "Parcial" },
  pending: { label: "Pendiente" },
  auto: { label: "Auto-traducido" },
};

// ─── Component ───────────────────────────────────────────

interface ServicioFormProps {
  initialData: Partial<ServicioData> & { slugEs: string };
}

export default function ServicioForm({ initialData }: ServicioFormProps) {
  const router = useRouter();
  const [servicio, setServicio] = useState<ServicioData>({
    ...defaultServicio,
    ...initialData,
  });
  const [activeTab, setActiveTab] = useState<TabKey>("contenido");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  function update<K extends keyof ServicioData>(key: K, value: ServicioData[K]) {
    setServicio((prev) => ({ ...prev, [key]: value }));
    setSuccess(false);
  }

  async function handleSave() {
    setSaving(true);
    setError("");
    setSuccess(false);

    try {
      const { slugEs, ...data } = servicio;
      await updateServicio(initialData.slugEs, data);
      setSuccess(true);
      router.refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Error al guardar");
    } finally {
      setSaving(false);
    }
  }

  // ─── Array helpers ─────────────────────────────────────

  function addBenefit() {
    if (servicio.benefits.length >= 6) return;
    update("benefits", [
      ...servicio.benefits,
      { icon: "", titleEs: "", titleEn: "", copyEs: "", copyEn: "" },
    ]);
  }

  function removeBenefit(index: number) {
    update(
      "benefits",
      servicio.benefits.filter((_, i) => i !== index),
    );
  }

  function moveBenefit(index: number, direction: -1 | 1) {
    const newIndex = index + direction;
    if (newIndex < 0 || newIndex >= servicio.benefits.length) return;
    const arr = [...servicio.benefits];
    [arr[index], arr[newIndex]] = [arr[newIndex], arr[index]];
    update("benefits", arr);
  }

  function updateBenefit(index: number, field: keyof Benefit, value: string) {
    const arr = [...servicio.benefits];
    arr[index] = { ...arr[index], [field]: value };
    update("benefits", arr);
  }

  function addStep() {
    if (servicio.processSteps.length >= 8) return;
    update("processSteps", [
      ...servicio.processSteps,
      {
        number: servicio.processSteps.length + 1,
        titleEs: "",
        titleEn: "",
        descEs: "",
        descEn: "",
        duration: "",
      },
    ]);
  }

  function removeStep(index: number) {
    const arr = servicio.processSteps
      .filter((_, i) => i !== index)
      .map((step, i) => ({ ...step, number: i + 1 }));
    update("processSteps", arr);
  }

  function moveStep(index: number, direction: -1 | 1) {
    const newIndex = index + direction;
    if (newIndex < 0 || newIndex >= servicio.processSteps.length) return;
    const arr = [...servicio.processSteps];
    [arr[index], arr[newIndex]] = [arr[newIndex], arr[index]];
    update(
      "processSteps",
      arr.map((step, i) => ({ ...step, number: i + 1 })),
    );
  }

  function updateStep(index: number, field: keyof ProcessStep, value: string | number) {
    const arr = [...servicio.processSteps];
    arr[index] = { ...arr[index], [field]: value };
    update("processSteps", arr);
  }

  function addMetric() {
    if (servicio.metrics.length >= 4) return;
    update("metrics", [...servicio.metrics, { value: "", unit: "", labelEs: "", labelEn: "" }]);
  }

  function removeMetric(index: number) {
    update(
      "metrics",
      servicio.metrics.filter((_, i) => i !== index),
    );
  }

  function updateMetric(index: number, field: keyof Metric, value: string) {
    const arr = [...servicio.metrics];
    arr[index] = { ...arr[index], [field]: value };
    update("metrics", arr);
  }

  function addFaq() {
    if (servicio.faqs.length >= 8) return;
    update("faqs", [
      ...servicio.faqs,
      { questionEs: "", questionEn: "", answerEs: "", answerEn: "" },
    ]);
  }

  function removeFaq(index: number) {
    update(
      "faqs",
      servicio.faqs.filter((_, i) => i !== index),
    );
  }

  function moveFaq(index: number, direction: -1 | 1) {
    const newIndex = index + direction;
    if (newIndex < 0 || newIndex >= servicio.faqs.length) return;
    const arr = [...servicio.faqs];
    [arr[index], arr[newIndex]] = [arr[newIndex], arr[index]];
    update("faqs", arr);
  }

  function updateFaq(index: number, field: keyof FAQ, value: string) {
    const arr = [...servicio.faqs];
    arr[index] = { ...arr[index], [field]: value };
    update("faqs", arr);
  }

  // ─── Render ────────────────────────────────────────────

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_320px]">
      {/* Main content area */}
      <div className="space-y-6">
        {error && (
          <div className="rounded-lg bg-red-500/10 border border-red-500/20 px-4 py-3 text-sm text-red-400">
            {error}
          </div>
        )}
        {success && (
          <div className="rounded-lg bg-staffing/10 border border-staffing/20 px-4 py-3 text-sm text-staffing">
            Servicio guardado correctamente.
          </div>
        )}

        {/* Tab bar */}
        <div className="flex gap-1 rounded-lg border border-border bg-bg-elevated p-1 overflow-x-auto">
          {(() => {
            const isRootHub = servicio.slugEs === "servicios";
            const tabs = servicio.serviceType === "hub" ? [...BASE_TABS, HUB_TAB] : BASE_TABS;
            const visible = isRootHub
              ? tabs.filter((t) => !["beneficios", "proceso", "faqs"].includes(t.key))
              : tabs;
            return visible;
          })().map((tab) => (
            <button
              key={tab.key}
              type="button"
              onClick={() => setActiveTab(tab.key)}
              className={`whitespace-nowrap rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
                activeTab === tab.key
                  ? "bg-primary/10 text-primary"
                  : "text-text-70 hover:text-text-100"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab content */}
        <div className="rounded-xl border border-border bg-bg-surface p-6">
          {/* ─── Contenido ─────────────────────────────── */}
          {activeTab === "contenido" && (
            <div className="space-y-6">
              <BilingualField
                labelEs="Título *"
                labelEn="Title"
                valueEs={servicio.titleEs}
                valueEn={servicio.titleEn}
                onChangeEs={(v) => update("titleEs", v)}
                onChangeEn={(v) => update("titleEn", v)}
                placeholder="Título del servicio"
              />

              <BilingualField
                labelEs="Subtítulo"
                labelEn="Subtitle"
                valueEs={servicio.subtitleEs}
                valueEn={servicio.subtitleEn}
                onChangeEs={(v) => update("subtitleEs", v)}
                onChangeEn={(v) => update("subtitleEn", v)}
                multiline
                rows={3}
                placeholder="Subtítulo del servicio"
              />

              <BilingualField
                labelEs="Descripción"
                labelEn="Description"
                valueEs={servicio.descriptionEs}
                valueEn={servicio.descriptionEn}
                onChangeEs={(v) => update("descriptionEs", v)}
                onChangeEn={(v) => update("descriptionEn", v)}
                multiline
                rows={8}
                placeholder="Descripción completa del servicio"
              />

              <div>
                <ImageUploader
                  value={servicio.coverImage}
                  onChange={(url) => update("coverImage", url)}
                  folder="servicios"
                  label="Imagen de portada"
                  aspectRatio="16/9"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-text-70">
                  Color de acento
                </label>
                <select
                  value={servicio.accentColor}
                  onChange={(e) =>
                    update("accentColor", e.target.value as ServicioData["accentColor"])
                  }
                  className={inputClass}
                >
                  {accentOptions.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
                <div className="mt-2 flex items-center gap-2">
                  <div
                    className={`h-4 w-4 rounded-full ${
                      accentOptions.find((o) => o.value === servicio.accentColor)?.color ||
                      "bg-cyan-500"
                    }`}
                  />
                  <span className="text-xs text-text-40">
                    {accentOptions.find((o) => o.value === servicio.accentColor)?.label}
                  </span>
                </div>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-text-70">Icono</label>
                <GeoIconPicker
                  value={servicio.icon ?? ""}
                  onChange={(name) => update("icon", name)}
                  color={SERVICIO_ACCENT_TO_ICON_COLOR[servicio.accentColor]}
                />
              </div>
            </div>
          )}

          {/* ─── Beneficios ────────────────────────────── */}
          {activeTab === "beneficios" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold text-text-100">
                  Beneficios ({servicio.benefits.length}/6)
                </h3>
                <button
                  type="button"
                  onClick={addBenefit}
                  disabled={servicio.benefits.length >= 6}
                  className="flex items-center gap-1.5 rounded-lg bg-primary/10 px-3 py-1.5 text-xs font-medium text-primary hover:bg-primary/20 transition-colors disabled:opacity-50"
                >
                  <Plus className="h-3.5 w-3.5" />
                  Agregar beneficio
                </button>
              </div>

              {servicio.benefits.length === 0 && (
                <p className="text-sm text-text-40 text-center py-8">
                  No hay beneficios configurados. Agrega uno para comenzar.
                </p>
              )}

              {servicio.benefits.map((benefit, index) => (
                <div
                  key={index}
                  className="rounded-lg border border-border bg-bg-elevated p-4 space-y-4"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-text-40 uppercase tracking-wider">
                      Beneficio {index + 1}
                    </span>
                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => moveBenefit(index, -1)}
                        disabled={index === 0}
                        className="rounded p-1 text-text-40 hover:text-text-100 disabled:opacity-30"
                      >
                        <ChevronUp className="h-4 w-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => moveBenefit(index, 1)}
                        disabled={index === servicio.benefits.length - 1}
                        className="rounded p-1 text-text-40 hover:text-text-100 disabled:opacity-30"
                      >
                        <ChevronDown className="h-4 w-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => removeBenefit(index)}
                        className="rounded p-1 text-red-400 hover:text-red-300"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                  <div>
                    <label className="mb-1 block text-xs font-medium text-text-70">Icono</label>
                    <GeoIconPicker
                      value={benefit.icon ?? ""}
                      onChange={(name) => updateBenefit(index, "icon", name)}
                      color={SERVICIO_ACCENT_TO_ICON_COLOR[servicio.accentColor]}
                    />
                  </div>
                  <BilingualField
                    labelEs="Título"
                    labelEn="Title"
                    valueEs={benefit.titleEs}
                    valueEn={benefit.titleEn}
                    onChangeEs={(v) => updateBenefit(index, "titleEs", v)}
                    onChangeEn={(v) => updateBenefit(index, "titleEn", v)}
                  />
                  <BilingualField
                    labelEs="Descripción"
                    labelEn="Copy"
                    valueEs={benefit.copyEs}
                    valueEn={benefit.copyEn}
                    onChangeEs={(v) => updateBenefit(index, "copyEs", v)}
                    onChangeEn={(v) => updateBenefit(index, "copyEn", v)}
                    multiline
                    rows={3}
                  />
                </div>
              ))}
            </div>
          )}

          {/* ─── Proceso ───────────────────────────────── */}
          {activeTab === "proceso" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold text-text-100">
                  Pasos del proceso ({servicio.processSteps.length}/8)
                </h3>
                <button
                  type="button"
                  onClick={addStep}
                  disabled={servicio.processSteps.length >= 8}
                  className="flex items-center gap-1.5 rounded-lg bg-primary/10 px-3 py-1.5 text-xs font-medium text-primary hover:bg-primary/20 transition-colors disabled:opacity-50"
                >
                  <Plus className="h-3.5 w-3.5" />
                  Agregar paso
                </button>
              </div>

              {servicio.processSteps.length === 0 && (
                <p className="text-sm text-text-40 text-center py-8">
                  No hay pasos configurados. Agrega uno para comenzar.
                </p>
              )}

              {servicio.processSteps.map((step, index) => (
                <div
                  key={index}
                  className="rounded-lg border border-border bg-bg-elevated p-4 space-y-4"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-text-40 uppercase tracking-wider">
                      Paso {step.number}
                    </span>
                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => moveStep(index, -1)}
                        disabled={index === 0}
                        className="rounded p-1 text-text-40 hover:text-text-100 disabled:opacity-30"
                      >
                        <ChevronUp className="h-4 w-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => moveStep(index, 1)}
                        disabled={index === servicio.processSteps.length - 1}
                        className="rounded p-1 text-text-40 hover:text-text-100 disabled:opacity-30"
                      >
                        <ChevronDown className="h-4 w-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => removeStep(index)}
                        className="rounded p-1 text-red-400 hover:text-red-300"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                  <BilingualField
                    labelEs="Título"
                    labelEn="Title"
                    valueEs={step.titleEs}
                    valueEn={step.titleEn}
                    onChangeEs={(v) => updateStep(index, "titleEs", v)}
                    onChangeEn={(v) => updateStep(index, "titleEn", v)}
                  />
                  <BilingualField
                    labelEs="Descripción"
                    labelEn="Description"
                    valueEs={step.descEs}
                    valueEn={step.descEn}
                    onChangeEs={(v) => updateStep(index, "descEs", v)}
                    onChangeEn={(v) => updateStep(index, "descEn", v)}
                    multiline
                    rows={3}
                  />
                  <div>
                    <label className="mb-1 block text-xs font-medium text-text-70">Duración</label>
                    <input
                      type="text"
                      value={step.duration}
                      onChange={(e) => updateStep(index, "duration", e.target.value)}
                      className={inputClass}
                      placeholder="ej: 2 semanas"
                    />
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* ─── Métricas ──────────────────────────────── */}
          {activeTab === "metricas" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold text-text-100">
                  Métricas ({servicio.metrics.length}/4)
                </h3>
                <button
                  type="button"
                  onClick={addMetric}
                  disabled={servicio.metrics.length >= 4}
                  className="flex items-center gap-1.5 rounded-lg bg-primary/10 px-3 py-1.5 text-xs font-medium text-primary hover:bg-primary/20 transition-colors disabled:opacity-50"
                >
                  <Plus className="h-3.5 w-3.5" />
                  Agregar métrica
                </button>
              </div>

              {servicio.metrics.length === 0 && (
                <p className="text-sm text-text-40 text-center py-8">
                  No hay métricas configuradas. Agrega una para comenzar.
                </p>
              )}

              {servicio.metrics.map((metric, index) => (
                <div
                  key={index}
                  className="rounded-lg border border-border bg-bg-elevated p-4 space-y-4"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-text-40 uppercase tracking-wider">
                      Métrica {index + 1}
                    </span>
                    <button
                      type="button"
                      onClick={() => removeMetric(index)}
                      className="rounded p-1 text-red-400 hover:text-red-300"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                  <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                    <div>
                      <label className="mb-1 block text-xs font-medium text-text-70">Valor</label>
                      <input
                        type="text"
                        value={metric.value}
                        onChange={(e) => updateMetric(index, "value", e.target.value)}
                        className={`${inputClass} font-mono`}
                        placeholder="99.9%"
                      />
                    </div>
                    <div>
                      <label className="mb-1 block text-xs font-medium text-text-70">Unidad</label>
                      <input
                        type="text"
                        value={metric.unit}
                        onChange={(e) => updateMetric(index, "unit", e.target.value)}
                        className={inputClass}
                        placeholder="%, hrs, x"
                      />
                    </div>
                  </div>
                  <BilingualField
                    labelEs="Etiqueta"
                    labelEn="Label"
                    valueEs={metric.labelEs}
                    valueEn={metric.labelEn}
                    onChangeEs={(v) => updateMetric(index, "labelEs", v)}
                    onChangeEn={(v) => updateMetric(index, "labelEn", v)}
                  />
                </div>
              ))}
            </div>
          )}

          {/* ─── FAQs ──────────────────────────────────── */}
          {activeTab === "faqs" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold text-text-100">
                  FAQs ({servicio.faqs.length}/8)
                </h3>
                <button
                  type="button"
                  onClick={addFaq}
                  disabled={servicio.faqs.length >= 8}
                  className="flex items-center gap-1.5 rounded-lg bg-primary/10 px-3 py-1.5 text-xs font-medium text-primary hover:bg-primary/20 transition-colors disabled:opacity-50"
                >
                  <Plus className="h-3.5 w-3.5" />
                  Agregar FAQ
                </button>
              </div>

              {servicio.faqs.length === 0 && (
                <p className="text-sm text-text-40 text-center py-8">
                  No hay FAQs configuradas. Agrega una para comenzar.
                </p>
              )}

              {servicio.faqs.map((faq, index) => (
                <div
                  key={index}
                  className="rounded-lg border border-border bg-bg-elevated p-4 space-y-4"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-text-40 uppercase tracking-wider">
                      FAQ {index + 1}
                    </span>
                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => moveFaq(index, -1)}
                        disabled={index === 0}
                        className="rounded p-1 text-text-40 hover:text-text-100 disabled:opacity-30"
                      >
                        <ChevronUp className="h-4 w-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => moveFaq(index, 1)}
                        disabled={index === servicio.faqs.length - 1}
                        className="rounded p-1 text-text-40 hover:text-text-100 disabled:opacity-30"
                      >
                        <ChevronDown className="h-4 w-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => removeFaq(index)}
                        className="rounded p-1 text-red-400 hover:text-red-300"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                  <BilingualField
                    labelEs="Pregunta"
                    labelEn="Question"
                    valueEs={faq.questionEs}
                    valueEn={faq.questionEn}
                    onChangeEs={(v) => updateFaq(index, "questionEs", v)}
                    onChangeEn={(v) => updateFaq(index, "questionEn", v)}
                  />
                  <BilingualField
                    labelEs="Respuesta"
                    labelEn="Answer"
                    valueEs={faq.answerEs}
                    valueEn={faq.answerEn}
                    onChangeEs={(v) => updateFaq(index, "answerEs", v)}
                    onChangeEn={(v) => updateFaq(index, "answerEn", v)}
                    multiline
                    rows={4}
                  />
                </div>
              ))}
            </div>
          )}

          {/* ─── CTAs y SEO ────────────────────────────── */}
          {activeTab === "ctas-seo" && (
            <div className="space-y-8">
              {/* CTAs */}
              <div className="space-y-6">
                <h3 className="text-sm font-semibold text-text-100">CTA Primario</h3>
                <BilingualField
                  labelEs="Texto CTA primario"
                  labelEn="Primary CTA text"
                  valueEs={servicio.ctaPrimaryTextEs}
                  valueEn={servicio.ctaPrimaryTextEn}
                  onChangeEs={(v) => update("ctaPrimaryTextEs", v)}
                  onChangeEn={(v) => update("ctaPrimaryTextEn", v)}
                />
                <div>
                  <label className="mb-2 block text-sm font-medium text-text-70">
                    URL CTA primario
                  </label>
                  <input
                    type="text"
                    value={servicio.ctaPrimaryUrl}
                    onChange={(e) => update("ctaPrimaryUrl", e.target.value)}
                    className={inputClass}
                    placeholder="/contacto"
                  />
                </div>
              </div>

              <div className="border-t border-border pt-6 space-y-6">
                <h3 className="text-sm font-semibold text-text-100">CTA Secundario</h3>
                <BilingualField
                  labelEs="Texto CTA secundario"
                  labelEn="Secondary CTA text"
                  valueEs={servicio.ctaSecondaryTextEs}
                  valueEn={servicio.ctaSecondaryTextEn}
                  onChangeEs={(v) => update("ctaSecondaryTextEs", v)}
                  onChangeEn={(v) => update("ctaSecondaryTextEn", v)}
                />
                <div>
                  <label className="mb-2 block text-sm font-medium text-text-70">
                    URL CTA secundario
                  </label>
                  <input
                    type="text"
                    value={servicio.ctaSecondaryUrl}
                    onChange={(e) => update("ctaSecondaryUrl", e.target.value)}
                    className={inputClass}
                    placeholder="/casos-de-exito"
                  />
                </div>
              </div>

              {/* SEO */}
              <div className="border-t border-border pt-6 space-y-6">
                <h3 className="text-sm font-semibold text-text-100">SEO</h3>

                <div className="space-y-4">
                  <BilingualField
                    labelEs="SEO Título"
                    labelEn="SEO Title"
                    valueEs={servicio.seoTitleEs}
                    valueEn={servicio.seoTitleEn}
                    onChangeEs={(v) => update("seoTitleEs", v)}
                    onChangeEn={(v) => update("seoTitleEn", v)}
                  />
                  <div className="flex gap-4">
                    <span
                      className={`text-xs ${
                        servicio.seoTitleEs.length > 60 ? "text-red-400" : "text-text-40"
                      }`}
                    >
                      ES: {servicio.seoTitleEs.length}/60
                    </span>
                    <span
                      className={`text-xs ${
                        servicio.seoTitleEn.length > 60 ? "text-red-400" : "text-text-40"
                      }`}
                    >
                      EN: {servicio.seoTitleEn.length}/60
                    </span>
                  </div>
                </div>

                <div className="space-y-4">
                  <BilingualField
                    labelEs="SEO Descripción"
                    labelEn="SEO Description"
                    valueEs={servicio.seoDescriptionEs}
                    valueEn={servicio.seoDescriptionEn}
                    onChangeEs={(v) => update("seoDescriptionEs", v)}
                    onChangeEn={(v) => update("seoDescriptionEn", v)}
                    multiline
                    rows={3}
                  />
                  <div className="flex gap-4">
                    <span
                      className={`text-xs ${
                        servicio.seoDescriptionEs.length > 155 ? "text-red-400" : "text-text-40"
                      }`}
                    >
                      ES: {servicio.seoDescriptionEs.length}/155
                    </span>
                    <span
                      className={`text-xs ${
                        servicio.seoDescriptionEn.length > 155 ? "text-red-400" : "text-text-40"
                      }`}
                    >
                      EN: {servicio.seoDescriptionEn.length}/155
                    </span>
                  </div>
                </div>

                {/* SEO Preview */}
                <div className="rounded-lg border border-border bg-bg-elevated p-4 space-y-2">
                  <div className="flex items-center gap-2 text-xs text-text-40">
                    <Search className="h-3.5 w-3.5" />
                    Vista previa en Google
                  </div>
                  <div className="space-y-1">
                    <p className="text-lg text-blue-400 leading-tight truncate">
                      {servicio.seoTitleEs || servicio.titleEs || "Título del servicio"}
                    </p>
                    <p className="text-xs text-green-400 truncate">
                      nivelics.com/servicios/{servicio.slugEs}
                    </p>
                    <p className="text-sm text-text-70 line-clamp-2">
                      {servicio.seoDescriptionEs ||
                        servicio.descriptionEs?.slice(0, 155) ||
                        "Descripción del servicio..."}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ─── Hub: I+C+S (only visible for service_type='hub') ─── */}
          {activeTab === "hub" && servicio.serviceType === "hub" && (
            <div className="space-y-8">
              <div className="space-y-4">
                <h3 className="text-sm font-semibold text-text-100">
                  Métricas del portafolio (max 4)
                </h3>
                {servicio.hubMetrics.map((m, idx) => (
                  <div
                    key={idx}
                    className="grid grid-cols-[120px_1fr_auto] gap-3 items-start border-b border-border pb-4 last:border-0"
                  >
                    <div>
                      <label className="mb-1 block text-xs text-text-40">Valor</label>
                      <input
                        value={m.value}
                        onChange={(e) => {
                          const arr = [...servicio.hubMetrics];
                          arr[idx] = { ...arr[idx], value: e.target.value };
                          update("hubMetrics", arr);
                        }}
                        placeholder="19+"
                        className={inputClass}
                      />
                    </div>
                    <BilingualField
                      labelEs="Etiqueta ES"
                      labelEn="Label EN"
                      valueEs={m.labelEs}
                      valueEn={m.labelEn}
                      onChangeEs={(v) => {
                        const arr = [...servicio.hubMetrics];
                        arr[idx] = { ...arr[idx], labelEs: v };
                        update("hubMetrics", arr);
                      }}
                      onChangeEn={(v) => {
                        const arr = [...servicio.hubMetrics];
                        arr[idx] = { ...arr[idx], labelEn: v };
                        update("hubMetrics", arr);
                      }}
                    />
                    <button
                      type="button"
                      onClick={() =>
                        update(
                          "hubMetrics",
                          servicio.hubMetrics.filter((_, i) => i !== idx),
                        )
                      }
                      className="mt-7 text-red-400 hover:text-red-300"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                ))}
                {servicio.hubMetrics.length < 4 && (
                  <button
                    type="button"
                    onClick={() =>
                      update("hubMetrics", [
                        ...servicio.hubMetrics,
                        { value: "", labelEs: "", labelEn: "" },
                      ])
                    }
                    className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium text-primary hover:bg-primary/10"
                  >
                    <Plus className="h-4 w-4" /> Agregar métrica
                  </button>
                )}
              </div>

              <div className="border-t border-border pt-6 space-y-4">
                <h3 className="text-sm font-semibold text-text-100">Sección marco I+C+S</h3>
                <BilingualField
                  labelEs="Título"
                  labelEn="Title"
                  valueEs={servicio.frameworkTitleEs}
                  valueEn={servicio.frameworkTitleEn}
                  onChangeEs={(v) => update("frameworkTitleEs", v)}
                  onChangeEn={(v) => update("frameworkTitleEn", v)}
                />
                <BilingualField
                  labelEs="Subtítulo"
                  labelEn="Subtitle"
                  valueEs={servicio.frameworkSubtitleEs}
                  valueEn={servicio.frameworkSubtitleEn}
                  onChangeEs={(v) => update("frameworkSubtitleEs", v)}
                  onChangeEn={(v) => update("frameworkSubtitleEn", v)}
                  multiline
                  rows={2}
                />
              </div>

              <div className="border-t border-border pt-6 space-y-4">
                <h3 className="text-sm font-semibold text-text-100">
                  Pilares I · C · S (editables pero no se agregan/eliminan)
                </h3>
                {servicio.frameworkPillars.map((p, idx) => (
                  <div
                    key={idx}
                    className="rounded-xl border border-border bg-bg-elevated p-5 space-y-3"
                  >
                    <div className="flex items-center gap-3">
                      <span
                        className={`flex h-9 w-9 items-center justify-center rounded-full border border-primary/40 text-lg font-bold text-primary`}
                      >
                        {p.letter || "?"}
                      </span>
                      <span className="text-xs text-text-40">Pilar {idx + 1}</span>
                    </div>
                    <BilingualField
                      labelEs="Título"
                      labelEn="Title"
                      valueEs={p.titleEs}
                      valueEn={p.titleEn}
                      onChangeEs={(v) => {
                        const arr = [...servicio.frameworkPillars];
                        arr[idx] = { ...arr[idx], titleEs: v };
                        update("frameworkPillars", arr);
                      }}
                      onChangeEn={(v) => {
                        const arr = [...servicio.frameworkPillars];
                        arr[idx] = { ...arr[idx], titleEn: v };
                        update("frameworkPillars", arr);
                      }}
                    />
                    <BilingualField
                      labelEs="Descripción"
                      labelEn="Description"
                      valueEs={p.descEs}
                      valueEn={p.descEn}
                      onChangeEs={(v) => {
                        const arr = [...servicio.frameworkPillars];
                        arr[idx] = { ...arr[idx], descEs: v };
                        update("frameworkPillars", arr);
                      }}
                      onChangeEn={(v) => {
                        const arr = [...servicio.frameworkPillars];
                        arr[idx] = { ...arr[idx], descEn: v };
                        update("frameworkPillars", arr);
                      }}
                      multiline
                      rows={3}
                    />
                  </div>
                ))}
                {servicio.frameworkPillars.length === 0 && (
                  <p className="text-sm text-text-40">
                    No hay pilares. Corre el seed (scripts/seed-servicios-hub.ts) para crearlos.
                  </p>
                )}
              </div>

              <div className="border-t border-border pt-6 space-y-4">
                <h3 className="text-sm font-semibold text-text-100">Sectores (chips)</h3>
                <BilingualField
                  labelEs="Título de sección"
                  labelEn="Section title"
                  valueEs={servicio.sectorsTitleEs}
                  valueEn={servicio.sectorsTitleEn}
                  onChangeEs={(v) => update("sectorsTitleEs", v)}
                  onChangeEn={(v) => update("sectorsTitleEn", v)}
                />
                {servicio.sectors.map((s, idx) => (
                  <div
                    key={idx}
                    className="grid grid-cols-[100px_60px_1fr_auto] gap-3 items-start border-b border-border pb-3 last:border-0"
                  >
                    <div>
                      <label className="mb-1 block text-xs text-text-40">Slug</label>
                      <input
                        value={s.slug}
                        onChange={(e) => {
                          const arr = [...servicio.sectors];
                          arr[idx] = { ...arr[idx], slug: e.target.value };
                          update("sectors", arr);
                        }}
                        className={inputClass}
                      />
                    </div>
                    <div>
                      <label className="mb-1 block text-xs text-text-40">Icono</label>
                      <GeoIconPicker
                        value={s.icon ?? ""}
                        onChange={(name) => {
                          const arr = [...servicio.sectors];
                          arr[idx] = { ...arr[idx], icon: name };
                          update("sectors", arr);
                        }}
                        color={SERVICIO_ACCENT_TO_ICON_COLOR[servicio.accentColor]}
                      />
                    </div>
                    <BilingualField
                      labelEs="Label ES"
                      labelEn="Label EN"
                      valueEs={s.labelEs}
                      valueEn={s.labelEn}
                      onChangeEs={(v) => {
                        const arr = [...servicio.sectors];
                        arr[idx] = { ...arr[idx], labelEs: v };
                        update("sectors", arr);
                      }}
                      onChangeEn={(v) => {
                        const arr = [...servicio.sectors];
                        arr[idx] = { ...arr[idx], labelEn: v };
                        update("sectors", arr);
                      }}
                    />
                    <button
                      type="button"
                      onClick={() =>
                        update(
                          "sectors",
                          servicio.sectors.filter((_, i) => i !== idx),
                        )
                      }
                      className="mt-7 text-red-400 hover:text-red-300"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() =>
                    update("sectors", [
                      ...servicio.sectors,
                      { slug: "", icon: "", labelEs: "", labelEn: "" },
                    ])
                  }
                  className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium text-primary hover:bg-primary/10"
                >
                  <Plus className="h-4 w-4" /> Agregar sector
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Sidebar */}
      <div className="space-y-6">
        {/* Save panel */}
        <div className="rounded-xl border border-border bg-bg-surface p-5 space-y-4">
          <h3 className="text-sm font-semibold text-text-100">Guardar</h3>

          <div>
            <label className="mb-1 block text-xs font-medium text-text-70">
              Estado de traducción EN
            </label>
            <select
              value={servicio.translationStatusEn}
              onChange={(e) =>
                update("translationStatusEn", e.target.value as ServicioData["translationStatusEn"])
              }
              className="w-full rounded-lg border border-border bg-bg-elevated px-3 py-2 text-sm text-text-100 focus:border-primary focus:outline-none"
            >
              {Object.entries(translationStatusConfig).map(([value, config]) => (
                <option key={value} value={value}>
                  {config.label}
                </option>
              ))}
            </select>
          </div>

          <button
            type="button"
            onClick={handleSave}
            disabled={saving}
            className="w-full rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-bg-base hover:opacity-90 transition-opacity disabled:opacity-50"
          >
            {saving ? "Guardando..." : "Guardar cambios"}
          </button>
        </div>

        {/* Quick info */}
        <div className="rounded-xl border border-border bg-bg-surface p-5 space-y-3">
          <h3 className="text-sm font-semibold text-text-100">Información</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-text-40">Slug</span>
              <span className="text-text-70 font-mono text-xs">{servicio.slugEs}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-text-40">Color</span>
              <div className="flex items-center gap-1.5">
                <div
                  className={`h-3 w-3 rounded-full ${
                    accentOptions.find((o) => o.value === servicio.accentColor)?.color ||
                    "bg-cyan-500"
                  }`}
                />
                <span className="text-text-70 text-xs">
                  {accentOptions.find((o) => o.value === servicio.accentColor)?.label}
                </span>
              </div>
            </div>
            <div className="flex justify-between">
              <span className="text-text-40">Icono</span>
              <span className="text-text-70 text-xs">{servicio.icon || "—"}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
