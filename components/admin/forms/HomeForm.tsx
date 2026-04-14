"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { BilingualField } from "@/components/admin/ui/BilingualEditor";
import { ImageUploader } from "@/components/admin/ui/ImageUploader";
import { updateHomeContent } from "@/lib/admin/actions/home.actions";
import { Save, Plus, Trash2 } from "lucide-react";

interface MetricItem {
  value: string;
  unit: string;
  labelEs: string;
  labelEn: string;
}

interface FaqItem {
  questionEs: string;
  questionEn: string;
  answerEs: string;
  answerEn: string;
}

interface HomeData {
  heroBadgeEs: string;
  heroBadgeEn: string;
  heroTitleEs: string;
  heroTitleEn: string;
  heroSubtitleEs: string;
  heroSubtitleEn: string;
  heroCtaPrimaryEs: string;
  heroCtaPrimaryEn: string;
  heroCtaSecondaryEs: string;
  heroCtaSecondaryEn: string;
  heroImage: string;
  metrics: MetricItem[];
  trustBarLogos: string[];
  servicesSectionTitleEs: string;
  servicesSectionTitleEn: string;
  casesSectionTitleEs: string;
  casesSectionTitleEn: string;
  faqs: FaqItem[];
  finalCtaTitleEs: string;
  finalCtaTitleEn: string;
  finalCtaCopyEs: string;
  finalCtaCopyEn: string;
}

const defaultHome: HomeData = {
  heroBadgeEs: "",
  heroBadgeEn: "",
  heroTitleEs: "",
  heroTitleEn: "",
  heroSubtitleEs: "",
  heroSubtitleEn: "",
  heroCtaPrimaryEs: "",
  heroCtaPrimaryEn: "",
  heroCtaSecondaryEs: "",
  heroCtaSecondaryEn: "",
  heroImage: "",
  metrics: [],
  trustBarLogos: [],
  servicesSectionTitleEs: "",
  servicesSectionTitleEn: "",
  casesSectionTitleEs: "",
  casesSectionTitleEn: "",
  faqs: [],
  finalCtaTitleEs: "",
  finalCtaTitleEn: "",
  finalCtaCopyEs: "",
  finalCtaCopyEn: "",
};

type TabKey = "hero" | "metricas" | "trust" | "secciones" | "faqs" | "cta";

const tabs: Array<{ key: TabKey; label: string }> = [
  { key: "hero", label: "Hero" },
  { key: "metricas", label: "Métricas" },
  { key: "trust", label: "Trust Bar" },
  { key: "secciones", label: "Secciones" },
  { key: "faqs", label: "FAQs" },
  { key: "cta", label: "CTA Final" },
];

const inputClass =
  "w-full rounded-lg border border-border bg-bg-elevated px-4 py-3 text-text-100 placeholder:text-text-40 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition-colors";

interface HomeFormProps {
  initialData?: HomeData;
}

export default function HomeForm({ initialData }: HomeFormProps) {
  const router = useRouter();
  const [data, setData] = useState<HomeData>({ ...defaultHome, ...initialData });
  const [activeTab, setActiveTab] = useState<TabKey>("hero");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  function update<K extends keyof HomeData>(key: K, value: HomeData[K]) {
    setData((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSave() {
    setSaving(true);
    setError("");
    try {
      await updateHomeContent(data);
      router.refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Error al guardar");
    } finally {
      setSaving(false);
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
          <div className="rounded-xl border border-border bg-bg-surface p-6 space-y-4">
            <h3 className="text-sm font-semibold text-text-100">Hero Section</h3>

            <BilingualField
              labelEs="Badge ES"
              labelEn="Badge EN"
              valueEs={data.heroBadgeEs}
              valueEn={data.heroBadgeEn}
              onChangeEs={(v) => update("heroBadgeEs", v)}
              onChangeEn={(v) => update("heroBadgeEn", v)}
            />

            <BilingualField
              labelEs="Título ES"
              labelEn="Title EN"
              valueEs={data.heroTitleEs}
              valueEn={data.heroTitleEn}
              onChangeEs={(v) => update("heroTitleEs", v)}
              onChangeEn={(v) => update("heroTitleEn", v)}
              multiline
              rows={3}
            />

            <BilingualField
              labelEs="Subtítulo ES"
              labelEn="Subtitle EN"
              valueEs={data.heroSubtitleEs}
              valueEn={data.heroSubtitleEn}
              onChangeEs={(v) => update("heroSubtitleEs", v)}
              onChangeEn={(v) => update("heroSubtitleEn", v)}
              multiline
              rows={3}
            />

            <BilingualField
              labelEs="CTA Primario ES"
              labelEn="Primary CTA EN"
              valueEs={data.heroCtaPrimaryEs}
              valueEn={data.heroCtaPrimaryEn}
              onChangeEs={(v) => update("heroCtaPrimaryEs", v)}
              onChangeEn={(v) => update("heroCtaPrimaryEn", v)}
            />

            <BilingualField
              labelEs="CTA Secundario ES"
              labelEn="Secondary CTA EN"
              valueEs={data.heroCtaSecondaryEs}
              valueEn={data.heroCtaSecondaryEn}
              onChangeEs={(v) => update("heroCtaSecondaryEs", v)}
              onChangeEn={(v) => update("heroCtaSecondaryEn", v)}
            />

            <div>
              <ImageUploader
                value={data.heroImage}
                onChange={(url) => update("heroImage", url)}
                folder="home"
                label="Imagen del Hero"
                aspectRatio="16/9"
              />
            </div>
          </div>
        )}

        {/* Tab: Métricas */}
        {activeTab === "metricas" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-text-100">Métricas (max 5)</h3>
              {data.metrics.length < 5 && (
                <button
                  type="button"
                  onClick={() =>
                    update("metrics", [
                      ...data.metrics,
                      { value: "", unit: "", labelEs: "", labelEn: "" },
                    ])
                  }
                  className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium text-primary hover:bg-primary/10 transition-colors"
                >
                  <Plus className="h-4 w-4" />
                  Agregar
                </button>
              )}
            </div>

            {data.metrics.map((metric, idx) => (
              <div
                key={idx}
                className="rounded-xl border border-border bg-bg-surface p-6 space-y-4"
              >
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-text-40">Métrica {idx + 1}</span>
                  <button
                    type="button"
                    onClick={() =>
                      update(
                        "metrics",
                        data.metrics.filter((_, i) => i !== idx),
                      )
                    }
                    className="text-red-400 hover:text-red-300 transition-colors"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label className="mb-2 block text-sm font-medium text-text-70">Valor</label>
                    <input
                      type="text"
                      value={metric.value}
                      onChange={(e) => {
                        const updated = [...data.metrics];
                        updated[idx] = { ...updated[idx], value: e.target.value };
                        update("metrics", updated);
                      }}
                      placeholder="150+"
                      className={`${inputClass} font-mono`}
                    />
                  </div>
                  <div>
                    <label className="mb-2 block text-sm font-medium text-text-70">Unidad</label>
                    <input
                      type="text"
                      value={metric.unit}
                      onChange={(e) => {
                        const updated = [...data.metrics];
                        updated[idx] = { ...updated[idx], unit: e.target.value };
                        update("metrics", updated);
                      }}
                      placeholder="%"
                      className={inputClass}
                    />
                  </div>
                </div>

                <BilingualField
                  labelEs="Label ES"
                  labelEn="Label EN"
                  valueEs={metric.labelEs}
                  valueEn={metric.labelEn}
                  onChangeEs={(v) => {
                    const updated = [...data.metrics];
                    updated[idx] = { ...updated[idx], labelEs: v };
                    update("metrics", updated);
                  }}
                  onChangeEn={(v) => {
                    const updated = [...data.metrics];
                    updated[idx] = { ...updated[idx], labelEn: v };
                    update("metrics", updated);
                  }}
                />
              </div>
            ))}

            {data.metrics.length === 0 && (
              <div className="rounded-xl border border-border bg-bg-surface p-8 text-center">
                <p className="text-text-40">No hay métricas configuradas</p>
              </div>
            )}
          </div>
        )}

        {/* Tab: Trust Bar */}
        {activeTab === "trust" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-text-100">Trust Bar Logos (max 8)</h3>
              {data.trustBarLogos.length < 8 && (
                <button
                  type="button"
                  onClick={() => update("trustBarLogos", [...data.trustBarLogos, ""])}
                  className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium text-primary hover:bg-primary/10 transition-colors"
                >
                  <Plus className="h-4 w-4" />
                  Agregar
                </button>
              )}
            </div>

            {data.trustBarLogos.map((logo, idx) => (
              <div key={idx} className="flex items-start gap-3">
                <span className="text-xs text-text-40 w-6 mt-2">{idx + 1}</span>
                <div className="flex-1">
                  <ImageUploader
                    value={logo}
                    onChange={(url) => {
                      const updated = [...data.trustBarLogos];
                      updated[idx] = url;
                      update("trustBarLogos", updated);
                    }}
                    folder="home"
                    aspectRatio="auto"
                  />
                </div>
                <button
                  type="button"
                  onClick={() =>
                    update(
                      "trustBarLogos",
                      data.trustBarLogos.filter((_, i) => i !== idx),
                    )
                  }
                  className="text-red-400 hover:text-red-300 transition-colors mt-2"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ))}

            {data.trustBarLogos.length === 0 && (
              <div className="rounded-xl border border-border bg-bg-surface p-8 text-center">
                <p className="text-text-40">No hay logos configurados</p>
              </div>
            )}
          </div>
        )}

        {/* Tab: Secciones */}
        {activeTab === "secciones" && (
          <div className="rounded-xl border border-border bg-bg-surface p-6 space-y-4">
            <h3 className="text-sm font-semibold text-text-100">Títulos de secciones</h3>

            <BilingualField
              labelEs="Título sección servicios ES"
              labelEn="Services section title EN"
              valueEs={data.servicesSectionTitleEs}
              valueEn={data.servicesSectionTitleEn}
              onChangeEs={(v) => update("servicesSectionTitleEs", v)}
              onChangeEn={(v) => update("servicesSectionTitleEn", v)}
            />

            <BilingualField
              labelEs="Título sección casos ES"
              labelEn="Cases section title EN"
              valueEs={data.casesSectionTitleEs}
              valueEn={data.casesSectionTitleEn}
              onChangeEs={(v) => update("casesSectionTitleEs", v)}
              onChangeEn={(v) => update("casesSectionTitleEn", v)}
            />
          </div>
        )}

        {/* Tab: FAQs */}
        {activeTab === "faqs" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-text-100">FAQs (max 5)</h3>
              {data.faqs.length < 5 && (
                <button
                  type="button"
                  onClick={() =>
                    update("faqs", [
                      ...data.faqs,
                      { questionEs: "", questionEn: "", answerEs: "", answerEn: "" },
                    ])
                  }
                  className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium text-primary hover:bg-primary/10 transition-colors"
                >
                  <Plus className="h-4 w-4" />
                  Agregar
                </button>
              )}
            </div>

            {data.faqs.map((faq, idx) => (
              <div
                key={idx}
                className="rounded-xl border border-border bg-bg-surface p-6 space-y-4"
              >
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-text-40">FAQ {idx + 1}</span>
                  <button
                    type="button"
                    onClick={() =>
                      update(
                        "faqs",
                        data.faqs.filter((_, i) => i !== idx),
                      )
                    }
                    className="text-red-400 hover:text-red-300 transition-colors"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>

                <BilingualField
                  labelEs="Pregunta ES"
                  labelEn="Question EN"
                  valueEs={faq.questionEs}
                  valueEn={faq.questionEn}
                  onChangeEs={(v) => {
                    const updated = [...data.faqs];
                    updated[idx] = { ...updated[idx], questionEs: v };
                    update("faqs", updated);
                  }}
                  onChangeEn={(v) => {
                    const updated = [...data.faqs];
                    updated[idx] = { ...updated[idx], questionEn: v };
                    update("faqs", updated);
                  }}
                />

                <BilingualField
                  labelEs="Respuesta ES"
                  labelEn="Answer EN"
                  valueEs={faq.answerEs}
                  valueEn={faq.answerEn}
                  onChangeEs={(v) => {
                    const updated = [...data.faqs];
                    updated[idx] = { ...updated[idx], answerEs: v };
                    update("faqs", updated);
                  }}
                  onChangeEn={(v) => {
                    const updated = [...data.faqs];
                    updated[idx] = { ...updated[idx], answerEn: v };
                    update("faqs", updated);
                  }}
                  multiline
                  rows={3}
                />
              </div>
            ))}

            {data.faqs.length === 0 && (
              <div className="rounded-xl border border-border bg-bg-surface p-8 text-center">
                <p className="text-text-40">No hay FAQs configuradas</p>
              </div>
            )}
          </div>
        )}

        {/* Tab: CTA Final */}
        {activeTab === "cta" && (
          <div className="rounded-xl border border-border bg-bg-surface p-6 space-y-4">
            <h3 className="text-sm font-semibold text-text-100">CTA Final</h3>

            <BilingualField
              labelEs="Título CTA ES"
              labelEn="CTA Title EN"
              valueEs={data.finalCtaTitleEs}
              valueEn={data.finalCtaTitleEn}
              onChangeEs={(v) => update("finalCtaTitleEs", v)}
              onChangeEn={(v) => update("finalCtaTitleEn", v)}
            />

            <BilingualField
              labelEs="Copy CTA ES"
              labelEn="CTA Copy EN"
              valueEs={data.finalCtaCopyEs}
              valueEn={data.finalCtaCopyEn}
              onChangeEs={(v) => update("finalCtaCopyEs", v)}
              onChangeEn={(v) => update("finalCtaCopyEn", v)}
              multiline
              rows={3}
            />
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
      </div>
    </div>
  );
}
