"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { BilingualField } from "@/components/admin/ui/BilingualEditor";
import { GeoIconPicker } from "@/components/admin/ui/GeoIconPicker";
import { updateIndustria } from "@/lib/admin/actions/industrias.actions";
import type { IconColor } from "@/lib/icons/geometric";
import { Save, Plus, Trash2, Check, AlertCircle } from "lucide-react";

const ACCENT_TO_ICON_COLOR: Record<IndustriaData["accentColor"], IconColor> = {
  ia: "violet",
  cloud: "cyan",
  staffing: "green",
  finops: "amber",
  dev: "amber",
};

interface PainPointItem {
  icon: string;
  titleEs: string;
  titleEn: string;
  descEs: string;
  descEn: string;
  statEs?: string;
  statEn?: string;
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

interface MetricItem {
  value: string;
  labelEs: string;
  labelEn: string;
}

interface StatHighlightItem {
  value: string;
  labelEs: string;
  labelEn: string;
  source?: string;
}

interface RegulationItem {
  code: string;
  nameEs: string;
  nameEn: string;
  descEs?: string;
  descEn?: string;
}

interface UseCaseItem {
  icon: string;
  titleEs: string;
  titleEn: string;
  descEs: string;
  descEn: string;
  outcomeEs?: string;
  outcomeEn?: string;
}

interface PlaybookItem {
  number: string;
  titleEs: string;
  titleEn: string;
  descEs: string;
  descEn: string;
}

interface IndustryFaqItem {
  questionEs: string;
  questionEn: string;
  answerEs: string;
  answerEn: string;
}

type TechCategory = "cloud" | "data" | "ai" | "frontend" | "backend" | "security" | "other";

interface TechTagItem {
  label: string;
  category: TechCategory;
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
  // Rich fields
  metrics: MetricItem[];
  statHighlights: StatHighlightItem[];
  regulations: RegulationItem[];
  useCases: UseCaseItem[];
  playbook: PlaybookItem[];
  industryFaqs: IndustryFaqItem[];
  techStack: TechTagItem[];
  servicesHighlight: string[];
  relatedCaseSlugs: string[];
  ctaTitleEs: string;
  ctaTitleEn: string;
  ctaPrimaryTextEs: string;
  ctaPrimaryTextEn: string;
  ctaPrimaryUrl: string;
  hubIntroTitleEs: string;
  hubIntroTitleEn: string;
  hubIntroSubtitleEs: string;
  hubIntroSubtitleEn: string;
}

type TabKey =
  | "hero"
  | "painpoints"
  | "soluciones"
  | "metricas"
  | "regulaciones"
  | "usecases"
  | "playbook"
  | "techstack"
  | "faqs"
  | "cta-hub"
  | "caso"
  | "diferenciadores"
  | "seo";

const tabs: Array<{ key: TabKey; label: string }> = [
  { key: "hero", label: "Hero" },
  { key: "painpoints", label: "Pain Points" },
  { key: "metricas", label: "Métricas" },
  { key: "regulaciones", label: "Regulaciones" },
  { key: "usecases", label: "Casos de Uso" },
  { key: "playbook", label: "Playbook" },
  { key: "techstack", label: "Tech Stack" },
  { key: "faqs", label: "FAQ sectorial" },
  { key: "soluciones", label: "Soluciones" },
  { key: "diferenciadores", label: "Diferenciadores" },
  { key: "cta-hub", label: "CTA + Hub Intro" },
  { key: "caso", label: "Caso Destacado" },
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

async function translateText(text: string): Promise<string> {
  if (!text.trim()) return "";
  const res = await fetch("/api/admin/translate", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text, sourceField: "industria" }),
  });
  if (!res.ok) throw new Error("translate failed");
  const { translation } = await res.json();
  return typeof translation === "string" ? translation : "";
}

export default function IndustriaForm({ initialData }: IndustriaFormProps) {
  const router = useRouter();
  const [data, setData] = useState<IndustriaData>(initialData);
  const [activeTab, setActiveTab] = useState<TabKey>("hero");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [translatingKey, setTranslatingKey] = useState<string | null>(null);

  function update<K extends keyof IndustriaData>(key: K, value: IndustriaData[K]) {
    setData((prev) => ({ ...prev, [key]: value }));
  }

  async function doTranslate(esText: string, setter: (en: string) => void, key: string) {
    if (!esText.trim()) return;
    setTranslatingKey(key);
    try {
      const en = await translateText(esText);
      setter(en);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Error al traducir");
    } finally {
      setTranslatingKey(null);
    }
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
        metrics: data.metrics,
        statHighlights: data.statHighlights,
        regulations: data.regulations,
        useCases: data.useCases,
        playbook: data.playbook,
        industryFaqs: data.industryFaqs,
        techStack: data.techStack,
        servicesHighlight: data.servicesHighlight,
        relatedCaseSlugs: data.relatedCaseSlugs,
        ctaTitleEs: data.ctaTitleEs,
        ctaTitleEn: data.ctaTitleEn,
        ctaPrimaryTextEs: data.ctaPrimaryTextEs,
        ctaPrimaryTextEn: data.ctaPrimaryTextEn,
        ctaPrimaryUrl: data.ctaPrimaryUrl,
        hubIntroTitleEs: data.hubIntroTitleEs,
        hubIntroTitleEn: data.hubIntroTitleEn,
        hubIntroSubtitleEs: data.hubIntroSubtitleEs,
        hubIntroSubtitleEn: data.hubIntroSubtitleEn,
      });
      router.refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Error al guardar");
    } finally {
      setSaving(false);
    }
  }

  const status = statusConfig[data.translationStatusEn];

  function updateArrayItem<T>(key: keyof IndustriaData, idx: number, item: T) {
    const arr = [...(data[key] as unknown as T[])];
    arr[idx] = item;
    update(key, arr as unknown as IndustriaData[typeof key]);
  }

  function removeArrayItem(key: keyof IndustriaData, idx: number) {
    const arr = (data[key] as unknown as unknown[]).filter((_, i) => i !== idx);
    update(key, arr as unknown as IndustriaData[typeof key]);
  }

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
                onTranslate={() => doTranslate(data.nameEs, (en) => update("nameEn", en), "nameEn")}
                translating={translatingKey === "nameEn"}
              />

              <BilingualField
                labelEs="Título Hero"
                labelEn="Hero Title"
                valueEs={data.heroTitleEs}
                valueEn={data.heroTitleEn}
                onChangeEs={(v) => update("heroTitleEs", v)}
                onChangeEn={(v) => update("heroTitleEn", v)}
                onTranslate={() =>
                  doTranslate(data.heroTitleEs, (en) => update("heroTitleEn", en), "heroTitleEn")
                }
                translating={translatingKey === "heroTitleEn"}
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
                onTranslate={() =>
                  doTranslate(
                    data.heroSubtitleEs,
                    (en) => update("heroSubtitleEn", en),
                    "heroSubtitleEn",
                  )
                }
                translating={translatingKey === "heroSubtitleEn"}
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
                  <GeoIconPicker
                    value={data.icon ?? ""}
                    onChange={(name) => update("icon", name)}
                    color={ACCENT_TO_ICON_COLOR[data.accentColor]}
                  />
                </div>
              </div>

              <BilingualField
                labelEs="Texto CTA (genérico)"
                labelEn="CTA Text (generic)"
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
              <h3 className="text-sm font-semibold text-text-100">Pain Points (max 6)</h3>
              {data.painPoints.length < 6 && (
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
                    onClick={() => removeArrayItem("painPoints", idx)}
                    className="text-red-400 hover:text-red-300 transition-colors"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-text-70">Icono</label>
                  <GeoIconPicker
                    value={pp.icon ?? ""}
                    onChange={(name) =>
                      updateArrayItem<PainPointItem>("painPoints", idx, {
                        ...pp,
                        icon: name,
                      })
                    }
                    color={ACCENT_TO_ICON_COLOR[data.accentColor]}
                  />
                </div>

                <BilingualField
                  labelEs="Título"
                  labelEn="Title"
                  valueEs={pp.titleEs}
                  valueEn={pp.titleEn}
                  onChangeEs={(v) =>
                    updateArrayItem<PainPointItem>("painPoints", idx, { ...pp, titleEs: v })
                  }
                  onChangeEn={(v) =>
                    updateArrayItem<PainPointItem>("painPoints", idx, { ...pp, titleEn: v })
                  }
                  onTranslate={() =>
                    doTranslate(
                      pp.titleEs,
                      (en) =>
                        updateArrayItem<PainPointItem>("painPoints", idx, { ...pp, titleEn: en }),
                      `painPoint-${idx}-title`,
                    )
                  }
                  translating={translatingKey === `painPoint-${idx}-title`}
                />

                <BilingualField
                  labelEs="Descripción"
                  labelEn="Description"
                  valueEs={pp.descEs}
                  valueEn={pp.descEn}
                  onChangeEs={(v) =>
                    updateArrayItem<PainPointItem>("painPoints", idx, { ...pp, descEs: v })
                  }
                  onChangeEn={(v) =>
                    updateArrayItem<PainPointItem>("painPoints", idx, { ...pp, descEn: v })
                  }
                  multiline
                  rows={3}
                  onTranslate={() =>
                    doTranslate(
                      pp.descEs,
                      (en) =>
                        updateArrayItem<PainPointItem>("painPoints", idx, { ...pp, descEn: en }),
                      `painPoint-${idx}-desc`,
                    )
                  }
                  translating={translatingKey === `painPoint-${idx}-desc`}
                />

                <BilingualField
                  labelEs="Estadística (opcional)"
                  labelEn="Statistic (optional)"
                  placeholder="Ej: 73% de fintechs cita compliance como su freno #1"
                  valueEs={pp.statEs ?? ""}
                  valueEn={pp.statEn ?? ""}
                  onChangeEs={(v) =>
                    updateArrayItem<PainPointItem>("painPoints", idx, { ...pp, statEs: v })
                  }
                  onChangeEn={(v) =>
                    updateArrayItem<PainPointItem>("painPoints", idx, { ...pp, statEn: v })
                  }
                  onTranslate={() =>
                    doTranslate(
                      pp.statEs ?? "",
                      (en) =>
                        updateArrayItem<PainPointItem>("painPoints", idx, { ...pp, statEn: en }),
                      `painPoint-${idx}-stat`,
                    )
                  }
                  translating={translatingKey === `painPoint-${idx}-stat`}
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

        {/* Tab: Métricas */}
        {activeTab === "metricas" && (
          <div className="space-y-6">
            <div className="rounded-xl border border-border bg-bg-surface p-6 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold text-text-100">
                  Métricas de la industria (max 4)
                </h3>
                {data.metrics.length < 4 && (
                  <button
                    type="button"
                    onClick={() =>
                      update("metrics", [...data.metrics, { value: "", labelEs: "", labelEn: "" }])
                    }
                    className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium text-primary hover:bg-primary/10 transition-colors"
                  >
                    <Plus className="h-4 w-4" /> Agregar
                  </button>
                )}
              </div>

              {data.metrics.map((m, idx) => (
                <div
                  key={idx}
                  className="grid grid-cols-[120px_1fr_auto] gap-3 items-start border-b border-border pb-4 last:border-0"
                >
                  <div>
                    <label className="mb-1 block text-xs text-text-40">Valor</label>
                    <input
                      value={m.value}
                      onChange={(e) =>
                        updateArrayItem<MetricItem>("metrics", idx, { ...m, value: e.target.value })
                      }
                      placeholder="99.9%"
                      className={inputClass}
                    />
                  </div>
                  <BilingualField
                    labelEs="Etiqueta ES"
                    labelEn="Label EN"
                    valueEs={m.labelEs}
                    valueEn={m.labelEn}
                    onChangeEs={(v) =>
                      updateArrayItem<MetricItem>("metrics", idx, { ...m, labelEs: v })
                    }
                    onChangeEn={(v) =>
                      updateArrayItem<MetricItem>("metrics", idx, { ...m, labelEn: v })
                    }
                    onTranslate={() =>
                      doTranslate(
                        m.labelEs,
                        (en) => updateArrayItem<MetricItem>("metrics", idx, { ...m, labelEn: en }),
                        `metric-${idx}`,
                      )
                    }
                    translating={translatingKey === `metric-${idx}`}
                  />
                  <button
                    type="button"
                    onClick={() => removeArrayItem("metrics", idx)}
                    className="mt-7 text-red-400 hover:text-red-300"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>

            <div className="rounded-xl border border-border bg-bg-surface p-6 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold text-text-100">
                  Stat highlights del sector (max 6)
                </h3>
                {data.statHighlights.length < 6 && (
                  <button
                    type="button"
                    onClick={() =>
                      update("statHighlights", [
                        ...data.statHighlights,
                        { value: "", labelEs: "", labelEn: "", source: "" },
                      ])
                    }
                    className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium text-primary hover:bg-primary/10 transition-colors"
                  >
                    <Plus className="h-4 w-4" /> Agregar
                  </button>
                )}
              </div>

              {data.statHighlights.map((s, idx) => (
                <div key={idx} className="space-y-3 border-b border-border pb-4 last:border-0">
                  <div className="grid grid-cols-[120px_1fr_auto] gap-3 items-start">
                    <div>
                      <label className="mb-1 block text-xs text-text-40">Valor</label>
                      <input
                        value={s.value}
                        onChange={(e) =>
                          updateArrayItem<StatHighlightItem>("statHighlights", idx, {
                            ...s,
                            value: e.target.value,
                          })
                        }
                        placeholder="US$156B"
                        className={inputClass}
                      />
                    </div>
                    <div>
                      <label className="mb-1 block text-xs text-text-40">Fuente (opcional)</label>
                      <input
                        value={s.source ?? ""}
                        onChange={(e) =>
                          updateArrayItem<StatHighlightItem>("statHighlights", idx, {
                            ...s,
                            source: e.target.value,
                          })
                        }
                        placeholder="Dataxis 2024"
                        className={inputClass}
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => removeArrayItem("statHighlights", idx)}
                      className="mt-7 text-red-400 hover:text-red-300"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                  <BilingualField
                    labelEs="Etiqueta ES"
                    labelEn="Label EN"
                    valueEs={s.labelEs}
                    valueEn={s.labelEn}
                    onChangeEs={(v) =>
                      updateArrayItem<StatHighlightItem>("statHighlights", idx, {
                        ...s,
                        labelEs: v,
                      })
                    }
                    onChangeEn={(v) =>
                      updateArrayItem<StatHighlightItem>("statHighlights", idx, {
                        ...s,
                        labelEn: v,
                      })
                    }
                    onTranslate={() =>
                      doTranslate(
                        s.labelEs,
                        (en) =>
                          updateArrayItem<StatHighlightItem>("statHighlights", idx, {
                            ...s,
                            labelEn: en,
                          }),
                        `stat-${idx}`,
                      )
                    }
                    translating={translatingKey === `stat-${idx}`}
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab: Regulaciones */}
        {activeTab === "regulaciones" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-text-100">Marco regulatorio (max 8)</h3>
              {data.regulations.length < 8 && (
                <button
                  type="button"
                  onClick={() =>
                    update("regulations", [
                      ...data.regulations,
                      { code: "", nameEs: "", nameEn: "", descEs: "", descEn: "" },
                    ])
                  }
                  className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium text-primary hover:bg-primary/10 transition-colors"
                >
                  <Plus className="h-4 w-4" /> Agregar
                </button>
              )}
            </div>

            {data.regulations.map((r, idx) => (
              <div
                key={idx}
                className="rounded-xl border border-border bg-bg-surface p-6 space-y-4"
              >
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-text-40">Regulación {idx + 1}</span>
                  <button
                    type="button"
                    onClick={() => removeArrayItem("regulations", idx)}
                    className="text-red-400 hover:text-red-300"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium text-text-70">Código</label>
                  <input
                    value={r.code}
                    onChange={(e) =>
                      updateArrayItem<RegulationItem>("regulations", idx, {
                        ...r,
                        code: e.target.value,
                      })
                    }
                    placeholder="PCI-DSS, HIPAA, SARLAFT..."
                    className={inputClass}
                  />
                </div>
                <BilingualField
                  labelEs="Nombre ES"
                  labelEn="Name EN"
                  valueEs={r.nameEs}
                  valueEn={r.nameEn}
                  onChangeEs={(v) =>
                    updateArrayItem<RegulationItem>("regulations", idx, { ...r, nameEs: v })
                  }
                  onChangeEn={(v) =>
                    updateArrayItem<RegulationItem>("regulations", idx, { ...r, nameEn: v })
                  }
                  onTranslate={() =>
                    doTranslate(
                      r.nameEs,
                      (en) =>
                        updateArrayItem<RegulationItem>("regulations", idx, { ...r, nameEn: en }),
                      `reg-${idx}-name`,
                    )
                  }
                  translating={translatingKey === `reg-${idx}-name`}
                />
                <BilingualField
                  labelEs="Descripción ES (opcional)"
                  labelEn="Description EN (optional)"
                  valueEs={r.descEs ?? ""}
                  valueEn={r.descEn ?? ""}
                  onChangeEs={(v) =>
                    updateArrayItem<RegulationItem>("regulations", idx, { ...r, descEs: v })
                  }
                  onChangeEn={(v) =>
                    updateArrayItem<RegulationItem>("regulations", idx, { ...r, descEn: v })
                  }
                  multiline
                  rows={2}
                  onTranslate={() =>
                    doTranslate(
                      r.descEs ?? "",
                      (en) =>
                        updateArrayItem<RegulationItem>("regulations", idx, { ...r, descEn: en }),
                      `reg-${idx}-desc`,
                    )
                  }
                  translating={translatingKey === `reg-${idx}-desc`}
                />
              </div>
            ))}
          </div>
        )}

        {/* Tab: Casos de Uso */}
        {activeTab === "usecases" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-text-100">Casos de uso (max 6)</h3>
              {data.useCases.length < 6 && (
                <button
                  type="button"
                  onClick={() =>
                    update("useCases", [
                      ...data.useCases,
                      { icon: "", titleEs: "", titleEn: "", descEs: "", descEn: "" },
                    ])
                  }
                  className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium text-primary hover:bg-primary/10 transition-colors"
                >
                  <Plus className="h-4 w-4" /> Agregar
                </button>
              )}
            </div>
            {data.useCases.map((u, idx) => (
              <div
                key={idx}
                className="rounded-xl border border-border bg-bg-surface p-6 space-y-4"
              >
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-text-40">Caso de uso {idx + 1}</span>
                  <button
                    type="button"
                    onClick={() => removeArrayItem("useCases", idx)}
                    className="text-red-400 hover:text-red-300"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium text-text-70">Icono</label>
                  <GeoIconPicker
                    value={u.icon ?? ""}
                    onChange={(name) =>
                      updateArrayItem<UseCaseItem>("useCases", idx, {
                        ...u,
                        icon: name,
                      })
                    }
                    color={ACCENT_TO_ICON_COLOR[data.accentColor]}
                  />
                </div>
                <BilingualField
                  labelEs="Título"
                  labelEn="Title"
                  valueEs={u.titleEs}
                  valueEn={u.titleEn}
                  onChangeEs={(v) =>
                    updateArrayItem<UseCaseItem>("useCases", idx, { ...u, titleEs: v })
                  }
                  onChangeEn={(v) =>
                    updateArrayItem<UseCaseItem>("useCases", idx, { ...u, titleEn: v })
                  }
                  onTranslate={() =>
                    doTranslate(
                      u.titleEs,
                      (en) => updateArrayItem<UseCaseItem>("useCases", idx, { ...u, titleEn: en }),
                      `uc-${idx}-title`,
                    )
                  }
                  translating={translatingKey === `uc-${idx}-title`}
                />
                <BilingualField
                  labelEs="Descripción"
                  labelEn="Description"
                  valueEs={u.descEs}
                  valueEn={u.descEn}
                  onChangeEs={(v) =>
                    updateArrayItem<UseCaseItem>("useCases", idx, { ...u, descEs: v })
                  }
                  onChangeEn={(v) =>
                    updateArrayItem<UseCaseItem>("useCases", idx, { ...u, descEn: v })
                  }
                  multiline
                  rows={3}
                  onTranslate={() =>
                    doTranslate(
                      u.descEs,
                      (en) => updateArrayItem<UseCaseItem>("useCases", idx, { ...u, descEn: en }),
                      `uc-${idx}-desc`,
                    )
                  }
                  translating={translatingKey === `uc-${idx}-desc`}
                />
                <BilingualField
                  labelEs="Resultado / Outcome (opcional)"
                  labelEn="Outcome (optional)"
                  valueEs={u.outcomeEs ?? ""}
                  valueEn={u.outcomeEn ?? ""}
                  onChangeEs={(v) =>
                    updateArrayItem<UseCaseItem>("useCases", idx, { ...u, outcomeEs: v })
                  }
                  onChangeEn={(v) =>
                    updateArrayItem<UseCaseItem>("useCases", idx, { ...u, outcomeEn: v })
                  }
                  multiline
                  rows={2}
                  onTranslate={() =>
                    doTranslate(
                      u.outcomeEs ?? "",
                      (en) =>
                        updateArrayItem<UseCaseItem>("useCases", idx, { ...u, outcomeEn: en }),
                      `uc-${idx}-outcome`,
                    )
                  }
                  translating={translatingKey === `uc-${idx}-outcome`}
                />
              </div>
            ))}
          </div>
        )}

        {/* Tab: Playbook */}
        {activeTab === "playbook" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-text-100">Playbook (max 6 pasos)</h3>
              {data.playbook.length < 6 && (
                <button
                  type="button"
                  onClick={() =>
                    update("playbook", [
                      ...data.playbook,
                      {
                        number: String(data.playbook.length + 1).padStart(2, "0"),
                        titleEs: "",
                        titleEn: "",
                        descEs: "",
                        descEn: "",
                      },
                    ])
                  }
                  className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium text-primary hover:bg-primary/10 transition-colors"
                >
                  <Plus className="h-4 w-4" /> Agregar
                </button>
              )}
            </div>
            {data.playbook.map((p, idx) => (
              <div
                key={idx}
                className="rounded-xl border border-border bg-bg-surface p-6 space-y-4"
              >
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-text-40">
                    Paso {p.number || idx + 1}
                  </span>
                  <button
                    type="button"
                    onClick={() => removeArrayItem("playbook", idx)}
                    className="text-red-400 hover:text-red-300"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium text-text-70">Número</label>
                  <input
                    value={p.number}
                    onChange={(e) =>
                      updateArrayItem<PlaybookItem>("playbook", idx, {
                        ...p,
                        number: e.target.value,
                      })
                    }
                    placeholder="01"
                    className={inputClass}
                  />
                </div>
                <BilingualField
                  labelEs="Título"
                  labelEn="Title"
                  valueEs={p.titleEs}
                  valueEn={p.titleEn}
                  onChangeEs={(v) =>
                    updateArrayItem<PlaybookItem>("playbook", idx, { ...p, titleEs: v })
                  }
                  onChangeEn={(v) =>
                    updateArrayItem<PlaybookItem>("playbook", idx, { ...p, titleEn: v })
                  }
                  onTranslate={() =>
                    doTranslate(
                      p.titleEs,
                      (en) => updateArrayItem<PlaybookItem>("playbook", idx, { ...p, titleEn: en }),
                      `pb-${idx}-title`,
                    )
                  }
                  translating={translatingKey === `pb-${idx}-title`}
                />
                <BilingualField
                  labelEs="Descripción"
                  labelEn="Description"
                  valueEs={p.descEs}
                  valueEn={p.descEn}
                  onChangeEs={(v) =>
                    updateArrayItem<PlaybookItem>("playbook", idx, { ...p, descEs: v })
                  }
                  onChangeEn={(v) =>
                    updateArrayItem<PlaybookItem>("playbook", idx, { ...p, descEn: v })
                  }
                  multiline
                  rows={3}
                  onTranslate={() =>
                    doTranslate(
                      p.descEs,
                      (en) => updateArrayItem<PlaybookItem>("playbook", idx, { ...p, descEn: en }),
                      `pb-${idx}-desc`,
                    )
                  }
                  translating={translatingKey === `pb-${idx}-desc`}
                />
              </div>
            ))}
          </div>
        )}

        {/* Tab: Tech Stack */}
        {activeTab === "techstack" && (
          <div className="rounded-xl border border-border bg-bg-surface p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-text-100">Stack tecnológico (max 20)</h3>
              {data.techStack.length < 20 && (
                <button
                  type="button"
                  onClick={() =>
                    update("techStack", [...data.techStack, { label: "", category: "other" }])
                  }
                  className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium text-primary hover:bg-primary/10 transition-colors"
                >
                  <Plus className="h-4 w-4" /> Agregar
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {data.techStack.map((t, idx) => (
                <div key={idx} className="grid grid-cols-[1fr_140px_auto] gap-2 items-center">
                  <input
                    value={t.label}
                    onChange={(e) =>
                      updateArrayItem<TechTagItem>("techStack", idx, {
                        ...t,
                        label: e.target.value,
                      })
                    }
                    placeholder="AWS"
                    className={inputClass}
                  />
                  <select
                    value={t.category}
                    onChange={(e) =>
                      updateArrayItem<TechTagItem>("techStack", idx, {
                        ...t,
                        category: e.target.value as TechCategory,
                      })
                    }
                    className={inputClass}
                  >
                    <option value="cloud">cloud</option>
                    <option value="data">data</option>
                    <option value="ai">ai</option>
                    <option value="frontend">frontend</option>
                    <option value="backend">backend</option>
                    <option value="security">security</option>
                    <option value="other">other</option>
                  </select>
                  <button
                    type="button"
                    onClick={() => removeArrayItem("techStack", idx)}
                    className="text-red-400 hover:text-red-300"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>

            {data.techStack.length > 0 && (
              <div className="mt-4 border-t border-border pt-4">
                <p className="mb-2 text-xs uppercase tracking-wider text-text-40">Preview</p>
                <div className="flex flex-wrap gap-2">
                  {data.techStack
                    .filter((t) => t.label.trim())
                    .map((t, i) => (
                      <span
                        key={i}
                        className="rounded-md border border-white/10 bg-white/[0.03] px-3 py-1.5 font-mono text-xs text-white/60"
                      >
                        {t.label}
                      </span>
                    ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Tab: FAQ sectorial */}
        {activeTab === "faqs" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-text-100">
                Preguntas frecuentes del sector (max 10)
              </h3>
              {data.industryFaqs.length < 10 && (
                <button
                  type="button"
                  onClick={() =>
                    update("industryFaqs", [
                      ...data.industryFaqs,
                      { questionEs: "", questionEn: "", answerEs: "", answerEn: "" },
                    ])
                  }
                  className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium text-primary hover:bg-primary/10 transition-colors"
                >
                  <Plus className="h-4 w-4" /> Agregar
                </button>
              )}
            </div>
            {data.industryFaqs.map((f, idx) => (
              <div
                key={idx}
                className="rounded-xl border border-border bg-bg-surface p-6 space-y-4"
              >
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-text-40">FAQ {idx + 1}</span>
                  <button
                    type="button"
                    onClick={() => removeArrayItem("industryFaqs", idx)}
                    className="text-red-400 hover:text-red-300"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
                <BilingualField
                  labelEs="Pregunta"
                  labelEn="Question"
                  valueEs={f.questionEs}
                  valueEn={f.questionEn}
                  onChangeEs={(v) =>
                    updateArrayItem<IndustryFaqItem>("industryFaqs", idx, { ...f, questionEs: v })
                  }
                  onChangeEn={(v) =>
                    updateArrayItem<IndustryFaqItem>("industryFaqs", idx, { ...f, questionEn: v })
                  }
                  onTranslate={() =>
                    doTranslate(
                      f.questionEs,
                      (en) =>
                        updateArrayItem<IndustryFaqItem>("industryFaqs", idx, {
                          ...f,
                          questionEn: en,
                        }),
                      `faq-${idx}-q`,
                    )
                  }
                  translating={translatingKey === `faq-${idx}-q`}
                />
                <BilingualField
                  labelEs="Respuesta"
                  labelEn="Answer"
                  valueEs={f.answerEs}
                  valueEn={f.answerEn}
                  onChangeEs={(v) =>
                    updateArrayItem<IndustryFaqItem>("industryFaqs", idx, { ...f, answerEs: v })
                  }
                  onChangeEn={(v) =>
                    updateArrayItem<IndustryFaqItem>("industryFaqs", idx, { ...f, answerEn: v })
                  }
                  multiline
                  rows={4}
                  onTranslate={() =>
                    doTranslate(
                      f.answerEs,
                      (en) =>
                        updateArrayItem<IndustryFaqItem>("industryFaqs", idx, {
                          ...f,
                          answerEn: en,
                        }),
                      `faq-${idx}-a`,
                    )
                  }
                  translating={translatingKey === `faq-${idx}-a`}
                />
              </div>
            ))}
          </div>
        )}

        {/* Tab: Soluciones (legacy) */}
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
                  <Plus className="h-4 w-4" /> Agregar
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
                    onClick={() => removeArrayItem("solutions", idx)}
                    className="text-red-400 hover:text-red-300"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium text-text-70">Icono</label>
                  <GeoIconPicker
                    value={sol.icon ?? ""}
                    onChange={(name) =>
                      updateArrayItem<SolutionItem>("solutions", idx, {
                        ...sol,
                        icon: name,
                      })
                    }
                    color={ACCENT_TO_ICON_COLOR[data.accentColor]}
                  />
                </div>
                <BilingualField
                  labelEs="Título"
                  labelEn="Title"
                  valueEs={sol.titleEs}
                  valueEn={sol.titleEn}
                  onChangeEs={(v) =>
                    updateArrayItem<SolutionItem>("solutions", idx, { ...sol, titleEs: v })
                  }
                  onChangeEn={(v) =>
                    updateArrayItem<SolutionItem>("solutions", idx, { ...sol, titleEn: v })
                  }
                />
                <BilingualField
                  labelEs="Descripción"
                  labelEn="Description"
                  valueEs={sol.descEs}
                  valueEn={sol.descEn}
                  onChangeEs={(v) =>
                    updateArrayItem<SolutionItem>("solutions", idx, { ...sol, descEs: v })
                  }
                  onChangeEn={(v) =>
                    updateArrayItem<SolutionItem>("solutions", idx, { ...sol, descEn: v })
                  }
                  multiline
                  rows={3}
                />
              </div>
            ))}
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
                  <Plus className="h-4 w-4" /> Agregar
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
                    onClick={() => removeArrayItem("differentiators", idx)}
                    className="text-red-400 hover:text-red-300"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
                <BilingualField
                  labelEs="Título"
                  labelEn="Title"
                  valueEs={diff.titleEs}
                  valueEn={diff.titleEn}
                  onChangeEs={(v) =>
                    updateArrayItem<DifferentiatorItem>("differentiators", idx, {
                      ...diff,
                      titleEs: v,
                    })
                  }
                  onChangeEn={(v) =>
                    updateArrayItem<DifferentiatorItem>("differentiators", idx, {
                      ...diff,
                      titleEn: v,
                    })
                  }
                />
                <BilingualField
                  labelEs="Descripción"
                  labelEn="Description"
                  valueEs={diff.descEs}
                  valueEn={diff.descEn}
                  onChangeEs={(v) =>
                    updateArrayItem<DifferentiatorItem>("differentiators", idx, {
                      ...diff,
                      descEs: v,
                    })
                  }
                  onChangeEn={(v) =>
                    updateArrayItem<DifferentiatorItem>("differentiators", idx, {
                      ...diff,
                      descEn: v,
                    })
                  }
                  multiline
                  rows={3}
                />
              </div>
            ))}
          </div>
        )}

        {/* Tab: CTA + Hub Intro */}
        {activeTab === "cta-hub" && (
          <div className="space-y-6">
            <div className="rounded-xl border border-border bg-bg-surface p-6 space-y-4">
              <h3 className="text-sm font-semibold text-text-100">CTA específico del sector</h3>
              <BilingualField
                labelEs="Título del CTA"
                labelEn="CTA Title"
                valueEs={data.ctaTitleEs}
                valueEn={data.ctaTitleEn}
                onChangeEs={(v) => update("ctaTitleEs", v)}
                onChangeEn={(v) => update("ctaTitleEn", v)}
                multiline
                rows={2}
                onTranslate={() =>
                  doTranslate(data.ctaTitleEs, (en) => update("ctaTitleEn", en), "ctaTitle")
                }
                translating={translatingKey === "ctaTitle"}
              />
              <BilingualField
                labelEs="Texto del botón"
                labelEn="Button Text"
                valueEs={data.ctaPrimaryTextEs}
                valueEn={data.ctaPrimaryTextEn}
                onChangeEs={(v) => update("ctaPrimaryTextEs", v)}
                onChangeEn={(v) => update("ctaPrimaryTextEn", v)}
                onTranslate={() =>
                  doTranslate(
                    data.ctaPrimaryTextEs,
                    (en) => update("ctaPrimaryTextEn", en),
                    "ctaBtn",
                  )
                }
                translating={translatingKey === "ctaBtn"}
              />
              <div>
                <label className="mb-2 block text-sm font-medium text-text-70">URL del CTA</label>
                <input
                  value={data.ctaPrimaryUrl}
                  onChange={(e) => update("ctaPrimaryUrl", e.target.value)}
                  placeholder="/contacto?industria=fintech"
                  className={inputClass}
                />
              </div>
            </div>

            <div className="rounded-xl border border-border bg-bg-surface p-6 space-y-4">
              <h3 className="text-sm font-semibold text-text-100">
                Intro del hub /industrias (usado cuando aparece como card)
              </h3>
              <BilingualField
                labelEs="Título del hub"
                labelEn="Hub Title"
                valueEs={data.hubIntroTitleEs}
                valueEn={data.hubIntroTitleEn}
                onChangeEs={(v) => update("hubIntroTitleEs", v)}
                onChangeEn={(v) => update("hubIntroTitleEn", v)}
                onTranslate={() =>
                  doTranslate(
                    data.hubIntroTitleEs,
                    (en) => update("hubIntroTitleEn", en),
                    "hubTitle",
                  )
                }
                translating={translatingKey === "hubTitle"}
              />
              <BilingualField
                labelEs="Subtítulo del hub"
                labelEn="Hub Subtitle"
                valueEs={data.hubIntroSubtitleEs}
                valueEn={data.hubIntroSubtitleEn}
                onChangeEs={(v) => update("hubIntroSubtitleEs", v)}
                onChangeEn={(v) => update("hubIntroSubtitleEn", v)}
                multiline
                rows={2}
                onTranslate={() =>
                  doTranslate(
                    data.hubIntroSubtitleEs,
                    (en) => update("hubIntroSubtitleEn", en),
                    "hubSubtitle",
                  )
                }
                translating={translatingKey === "hubSubtitle"}
              />
            </div>
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
            </div>
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
