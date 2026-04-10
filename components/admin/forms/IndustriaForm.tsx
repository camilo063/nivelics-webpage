"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { BilingualField } from "@/components/admin/ui/BilingualEditor";
import { updateIndustria } from "@/lib/admin/actions/industrias.actions";
import { Save, Plus, Trash2, Check, AlertCircle } from "lucide-react";

interface PainPointItem {
  icon: string;
  titleEs: string;
  titleEn: string;
  descEs: string;
  descEn: string;
}

interface SolutionItem {
  icon: string;
  titleEs: string;
  titleEn: string;
  descEs: string;
  descEn: string;
}

interface DifferentiatorItem {
  titleEs: string;
  titleEn: string;
  descEs: string;
  descEn: string;
}

interface IndustriaData {
  slugEs: string;
  nameEs: string;
  nameEn: string;
  heroTitleEs: string;
  heroTitleEn: string;
  heroSubtitleEs: string;
  heroSubtitleEn: string;
  painPoints: PainPointItem[];
  solutions: SolutionItem[];
  casoDestacadoId: string;
  differentiators: DifferentiatorItem[];
  ctaTextEs: string;
  ctaTextEn: string;
  seoTitleEs: string;
  seoTitleEn: string;
  seoDescriptionEs: string;
  seoDescriptionEn: string;
  accentColor: "ia" | "cloud" | "staffing" | "finops" | "dev";
  icon: string;
  translationStatusEn: "complete" | "partial" | "pending" | "auto";
  status: "draft" | "published" | "scheduled" | "archived";
}

type TabKey = "hero" | "painpoints" | "soluciones" | "caso" | "diferenciadores" | "seo";

const tabs: Array<{ key: TabKey; label: string }> = [
  { key: "hero", label: "Hero" },
  { key: "painpoints", label: "Pain Points" },
  { key: "soluciones", label: "Soluciones" },
  { key: "caso", label: "Caso Destacado" },
  { key: "diferenciadores", label: "Diferenciadores" },
  { key: "seo", label: "SEO" },
];

const inputClass =
  "w-full rounded-lg border border-border bg-bg-elevated px-4 py-3 text-text-100 placeholder:text-text-40 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition-colors";

const statusConfig = {
  complete: { label: "Completo", color: "text-staffing", bg: "bg-staffing/10" },
  partial: { label: "Parcial", color: "text-finops", bg: "bg-finops/10" },
  pending: { label: "Pendiente", color: "text-red-400", bg: "bg-red-400/10" },
  auto: { label: "Auto-traducido", color: "text-ia", bg: "bg-ia/10" },
};

interface IndustriaFormProps {
  initialData: IndustriaData;
}

export default function IndustriaForm({ initialData }: IndustriaFormProps) {
  const router = useRouter();
  const [data, setData] = useState<IndustriaData>(initialData);
  const [activeTab, setActiveTab] = useState<TabKey>("hero");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  function update<K extends keyof IndustriaData>(key: K, value: IndustriaData[K]) {
    setData((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSave() {
    setSaving(true);
    setError("");
    try {
      await updateIndustria(data.slugEs, {
        nameEs: data.nameEs,
        nameEn: data.nameEn,
        heroTitleEs: data.heroTitleEs,
        heroTitleEn: data.heroTitleEn,
        heroSubtitleEs: data.heroSubtitleEs,
        heroSubtitleEn: data.heroSubtitleEn,
        painPoints: data.painPoints,
        solutions: data.solutions,
        casoDestacadoId: data.casoDestacadoId || null,
        differentiators: data.differentiators,
        ctaTextEs: data.ctaTextEs,
        ctaTextEn: data.ctaTextEn,
        seoTitleEs: data.seoTitleEs,
        seoTitleEn: data.seoTitleEn,
        seoDescriptionEs: data.seoDescriptionEs,
        seoDescriptionEn: data.seoDescriptionEn,
        accentColor: data.accentColor,
        icon: data.icon,
        translationStatusEn: data.translationStatusEn,
        status: data.status,
      });
      router.refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Error al guardar");
    } finally {
      setSaving(false);
    }
  }

  const status = statusConfig[data.translationStatusEn];

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_320px]">
      <div className="space-y-6">
        {error && (
          <div className="rounded-lg bg-red-500/10 border border-red-500/20 px-4 py-3 text-sm text-red-400">
            {error}
          </div>
        )}

        {/* Tabs */}
        <div className="flex gap-1 rounded-lg border border-border bg-bg-elevated p-1 overflow-x-auto">
          {tabs.map((tab) => (
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

        {/* Tab: Hero */}
        {activeTab === "hero" && (
          <div className="space-y-6">
            <div className="rounded-xl border border-border bg-bg-surface p-6 space-y-4">
              <h3 className="text-sm font-semibold text-text-100">Información básica</h3>

              <BilingualField
                labelEs="Nombre *"
                labelEn="Name"
                valueEs={data.nameEs}
                valueEn={data.nameEn}
                onChangeEs={(v) => update("nameEs", v)}
                onChangeEn={(v) => update("nameEn", v)}
              />

              <BilingualField
                labelEs="Título Hero"
                labelEn="Hero Title"
                valueEs={data.heroTitleEs}
                valueEn={data.heroTitleEn}
                onChangeEs={(v) => update("heroTitleEs", v)}
                onChangeEn={(v) => update("heroTitleEn", v)}
              />

              <BilingualField
                labelEs="Subtítulo Hero"
                labelEn="Hero Subtitle"
                valueEs={data.heroSubtitleEs}
                valueEn={data.heroSubtitleEn}
                onChangeEs={(v) => update("heroSubtitleEs", v)}
                onChangeEn={(v) => update("heroSubtitleEn", v)}
                multiline
                rows={3}
              />

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-medium text-text-70">
                    Color de acento
                  </label>
                  <select
                    value={data.accentColor}
                    onChange={(e) =>
                      update("accentColor", e.target.value as IndustriaData["accentColor"])
                    }
                    className={inputClass}
                  >
                    <option value="ia">IA</option>
                    <option value="cloud">Cloud</option>
                    <option value="staffing">Staffing</option>
                    <option value="finops">FinOps</option>
                    <option value="dev">Dev</option>
                  </select>
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium text-text-70">Icono</label>
                  <input
                    type="text"
                    value={data.icon}
                    onChange={(e) => update("icon", e.target.value)}
                    placeholder="Emoji o nombre de icono"
                    className={inputClass}
                  />
                </div>
              </div>

              <BilingualField
                labelEs="Texto CTA"
                labelEn="CTA Text"
                valueEs={data.ctaTextEs}
                valueEn={data.ctaTextEn}
                onChangeEs={(v) => update("ctaTextEs", v)}
                onChangeEn={(v) => update("ctaTextEn", v)}
              />
            </div>
          </div>
        )}

        {/* Tab: Pain Points */}
        {activeTab === "painpoints" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-text-100">Pain Points (max 3)</h3>
              {data.painPoints.length < 3 && (
                <button
                  type="button"
                  onClick={() =>
                    update("painPoints", [
                      ...data.painPoints,
                      { icon: "", titleEs: "", titleEn: "", descEs: "", descEn: "" },
                    ])
                  }
                  className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium text-primary hover:bg-primary/10 transition-colors"
                >
                  <Plus className="h-4 w-4" />
                  Agregar
                </button>
              )}
            </div>

            {data.painPoints.map((pp, idx) => (
              <div
                key={idx}
                className="rounded-xl border border-border bg-bg-surface p-6 space-y-4"
              >
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-text-40">Pain Point {idx + 1}</span>
                  <button
                    type="button"
                    onClick={() =>
                      update(
                        "painPoints",
                        data.painPoints.filter((_, i) => i !== idx),
                      )
                    }
                    className="text-red-400 hover:text-red-300 transition-colors"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-text-70">Icono</label>
                  <input
                    type="text"
                    value={pp.icon}
                    onChange={(e) => {
                      const updated = [...data.painPoints];
                      updated[idx] = { ...updated[idx], icon: e.target.value };
                      update("painPoints", updated);
                    }}
                    className={inputClass}
                  />
                </div>

                <BilingualField
                  labelEs="Título"
                  labelEn="Title"
                  valueEs={pp.titleEs}
                  valueEn={pp.titleEn}
                  onChangeEs={(v) => {
                    const updated = [...data.painPoints];
                    updated[idx] = { ...updated[idx], titleEs: v };
                    update("painPoints", updated);
                  }}
                  onChangeEn={(v) => {
                    const updated = [...data.painPoints];
                    updated[idx] = { ...updated[idx], titleEn: v };
                    update("painPoints", updated);
                  }}
                />

                <BilingualField
                  labelEs="Descripción"
                  labelEn="Description"
                  valueEs={pp.descEs}
                  valueEn={pp.descEn}
                  onChangeEs={(v) => {
                    const updated = [...data.painPoints];
                    updated[idx] = { ...updated[idx], descEs: v };
                    update("painPoints", updated);
                  }}
                  onChangeEn={(v) => {
                    const updated = [...data.painPoints];
                    updated[idx] = { ...updated[idx], descEn: v };
                    update("painPoints", updated);
                  }}
                  multiline
                  rows={3}
                />
              </div>
            ))}

            {data.painPoints.length === 0 && (
              <div className="rounded-xl border border-border bg-bg-surface p-8 text-center">
                <p className="text-text-40">No hay pain points configurados</p>
              </div>
            )}
          </div>
        )}

        {/* Tab: Soluciones */}
        {activeTab === "soluciones" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-text-100">Soluciones (max 4)</h3>
              {data.solutions.length < 4 && (
                <button
                  type="button"
                  onClick={() =>
                    update("solutions", [
                      ...data.solutions,
                      { icon: "", titleEs: "", titleEn: "", descEs: "", descEn: "" },
                    ])
                  }
                  className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium text-primary hover:bg-primary/10 transition-colors"
                >
                  <Plus className="h-4 w-4" />
                  Agregar
                </button>
              )}
            </div>

            {data.solutions.map((sol, idx) => (
              <div
                key={idx}
                className="rounded-xl border border-border bg-bg-surface p-6 space-y-4"
              >
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-text-40">Solución {idx + 1}</span>
                  <button
                    type="button"
                    onClick={() =>
                      update(
                        "solutions",
                        data.solutions.filter((_, i) => i !== idx),
                      )
                    }
                    className="text-red-400 hover:text-red-300 transition-colors"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-text-70">Icono</label>
                  <input
                    type="text"
                    value={sol.icon}
                    onChange={(e) => {
                      const updated = [...data.solutions];
                      updated[idx] = { ...updated[idx], icon: e.target.value };
                      update("solutions", updated);
                    }}
                    className={inputClass}
                  />
                </div>

                <BilingualField
                  labelEs="Título"
                  labelEn="Title"
                  valueEs={sol.titleEs}
                  valueEn={sol.titleEn}
                  onChangeEs={(v) => {
                    const updated = [...data.solutions];
                    updated[idx] = { ...updated[idx], titleEs: v };
                    update("solutions", updated);
                  }}
                  onChangeEn={(v) => {
                    const updated = [...data.solutions];
                    updated[idx] = { ...updated[idx], titleEn: v };
                    update("solutions", updated);
                  }}
                />

                <BilingualField
                  labelEs="Descripción"
                  labelEn="Description"
                  valueEs={sol.descEs}
                  valueEn={sol.descEn}
                  onChangeEs={(v) => {
                    const updated = [...data.solutions];
                    updated[idx] = { ...updated[idx], descEs: v };
                    update("solutions", updated);
                  }}
                  onChangeEn={(v) => {
                    const updated = [...data.solutions];
                    updated[idx] = { ...updated[idx], descEn: v };
                    update("solutions", updated);
                  }}
                  multiline
                  rows={3}
                />
              </div>
            ))}

            {data.solutions.length === 0 && (
              <div className="rounded-xl border border-border bg-bg-surface p-8 text-center">
                <p className="text-text-40">No hay soluciones configuradas</p>
              </div>
            )}
          </div>
        )}

        {/* Tab: Caso Destacado */}
        {activeTab === "caso" && (
          <div className="rounded-xl border border-border bg-bg-surface p-6 space-y-4">
            <h3 className="text-sm font-semibold text-text-100">Caso de éxito destacado</h3>
            <div>
              <label className="mb-2 block text-sm font-medium text-text-70">
                ID del caso (UUID)
              </label>
              <input
                type="text"
                value={data.casoDestacadoId}
                onChange={(e) => update("casoDestacadoId", e.target.value)}
                placeholder="xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
                className={inputClass}
              />
              <p className="mt-1 text-xs text-text-40">
                Ingresa el UUID del caso de éxito que deseas destacar en esta industria.
              </p>
            </div>
          </div>
        )}

        {/* Tab: Diferenciadores */}
        {activeTab === "diferenciadores" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-text-100">Diferenciadores (max 4)</h3>
              {data.differentiators.length < 4 && (
                <button
                  type="button"
                  onClick={() =>
                    update("differentiators", [
                      ...data.differentiators,
                      { titleEs: "", titleEn: "", descEs: "", descEn: "" },
                    ])
                  }
                  className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium text-primary hover:bg-primary/10 transition-colors"
                >
                  <Plus className="h-4 w-4" />
                  Agregar
                </button>
              )}
            </div>

            {data.differentiators.map((diff, idx) => (
              <div
                key={idx}
                className="rounded-xl border border-border bg-bg-surface p-6 space-y-4"
              >
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-text-40">Diferenciador {idx + 1}</span>
                  <button
                    type="button"
                    onClick={() =>
                      update(
                        "differentiators",
                        data.differentiators.filter((_, i) => i !== idx),
                      )
                    }
                    className="text-red-400 hover:text-red-300 transition-colors"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>

                <BilingualField
                  labelEs="Título"
                  labelEn="Title"
                  valueEs={diff.titleEs}
                  valueEn={diff.titleEn}
                  onChangeEs={(v) => {
                    const updated = [...data.differentiators];
                    updated[idx] = { ...updated[idx], titleEs: v };
                    update("differentiators", updated);
                  }}
                  onChangeEn={(v) => {
                    const updated = [...data.differentiators];
                    updated[idx] = { ...updated[idx], titleEn: v };
                    update("differentiators", updated);
                  }}
                />

                <BilingualField
                  labelEs="Descripción"
                  labelEn="Description"
                  valueEs={diff.descEs}
                  valueEn={diff.descEn}
                  onChangeEs={(v) => {
                    const updated = [...data.differentiators];
                    updated[idx] = { ...updated[idx], descEs: v };
                    update("differentiators", updated);
                  }}
                  onChangeEn={(v) => {
                    const updated = [...data.differentiators];
                    updated[idx] = { ...updated[idx], descEn: v };
                    update("differentiators", updated);
                  }}
                  multiline
                  rows={3}
                />
              </div>
            ))}

            {data.differentiators.length === 0 && (
              <div className="rounded-xl border border-border bg-bg-surface p-8 text-center">
                <p className="text-text-40">No hay diferenciadores configurados</p>
              </div>
            )}
          </div>
        )}

        {/* Tab: SEO */}
        {activeTab === "seo" && (
          <div className="rounded-xl border border-border bg-bg-surface p-6 space-y-4">
            <h3 className="text-sm font-semibold text-text-100">SEO</h3>

            <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
              <div>
                <div className="mb-2 flex items-center justify-between">
                  <label className="text-sm font-medium text-text-70">SEO Título ES</label>
                  <span className="text-xs text-text-40">{data.seoTitleEs.length}/60</span>
                </div>
                <input
                  type="text"
                  value={data.seoTitleEs}
                  onChange={(e) => update("seoTitleEs", e.target.value)}
                  className={inputClass}
                />
              </div>
              <div>
                <div className="mb-2 flex items-center justify-between">
                  <label className="text-sm font-medium text-text-70">SEO Title EN</label>
                  <span className="text-xs text-text-40">{data.seoTitleEn.length}/60</span>
                </div>
                <input
                  type="text"
                  value={data.seoTitleEn}
                  onChange={(e) => update("seoTitleEn", e.target.value)}
                  className={inputClass}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
              <div>
                <div className="mb-2 flex items-center justify-between">
                  <label className="text-sm font-medium text-text-70">SEO Descripción ES</label>
                  <span className="text-xs text-text-40">{data.seoDescriptionEs.length}/160</span>
                </div>
                <textarea
                  value={data.seoDescriptionEs}
                  onChange={(e) => update("seoDescriptionEs", e.target.value)}
                  rows={3}
                  className={`${inputClass} resize-none`}
                />
              </div>
              <div>
                <div className="mb-2 flex items-center justify-between">
                  <label className="text-sm font-medium text-text-70">SEO Description EN</label>
                  <span className="text-xs text-text-40">{data.seoDescriptionEn.length}/160</span>
                </div>
                <textarea
                  value={data.seoDescriptionEn}
                  onChange={(e) => update("seoDescriptionEn", e.target.value)}
                  rows={3}
                  className={`${inputClass} resize-none`}
                />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Sidebar */}
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
            {saving ? "Guardando..." : "Guardar cambios"}
          </button>
        </div>

        {/* Translation status */}
        <div className="rounded-xl border border-border bg-bg-surface p-5 space-y-3">
          <h3 className="text-sm font-semibold text-text-100">Estado de traducción</h3>
          <span
            className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium ${status.bg} ${status.color}`}
          >
            {data.translationStatusEn === "complete" ? (
              <Check className="h-3 w-3" />
            ) : (
              <AlertCircle className="h-3 w-3" />
            )}
            {status.label}
          </span>
          <select
            value={data.translationStatusEn}
            onChange={(e) =>
              update("translationStatusEn", e.target.value as IndustriaData["translationStatusEn"])
            }
            className="w-full rounded-lg border border-border bg-bg-elevated px-3 py-2 text-sm text-text-70 focus:border-primary focus:outline-none"
          >
            <option value="pending">Pendiente</option>
            <option value="partial">Parcial</option>
            <option value="complete">Completo</option>
            <option value="auto">Auto-traducido</option>
          </select>
        </div>
      </div>
    </div>
  );
}
