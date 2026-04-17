"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { BilingualField } from "@/components/admin/ui/BilingualEditor";
import { ImageUploader } from "@/components/admin/ui/ImageUploader";
import { updateHomeContent } from "@/lib/admin/actions/home.actions";
import { Save, Plus, Trash2 } from "lucide-react";
import { GeoIconPicker } from "@/components/admin/ui/GeoIconPicker";

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

interface IndustriasSectionMetricItem {
  value: string;
  labelEs: string;
  labelEn: string;
}

interface ProcessStepItem {
  number: string;
  icon: string;
  titleEs: string;
  titleEn: string;
  descEs: string;
  descEn: string;
  durationEs: string;
  durationEn: string;
}

interface MapMetricItem {
  value: string;
  labelEs: string;
  labelEn: string;
  sublabelEs: string;
  sublabelEn: string;
}

interface WhyUsItem {
  icon: string;
  color: string;
  titleEs: string;
  titleEn: string;
  copyEs: string;
  copyEn: string;
}

interface FinalCtaBulletItem {
  textEs: string;
  textEn: string;
}

interface HomeData {
  // Hero
  heroBadgeEs: string;
  heroBadgeEn: string;
  heroTitleEs: string;
  heroTitleEn: string;
  heroSubtitleEs: string;
  heroSubtitleEn: string;
  heroCtaPrimaryEs: string;
  heroCtaPrimaryEn: string;
  heroCtaPrimaryUrl: string;
  heroCtaSecondaryEs: string;
  heroCtaSecondaryEn: string;
  heroCtaSecondaryUrl: string;
  heroImage: string;
  // Metrics + trust
  metrics: MetricItem[];
  trustBarLogos: string[];
  trustBarTitleEs: string;
  trustBarTitleEn: string;
  // Pillars
  servicesSectionTitleEs: string;
  servicesSectionTitleEn: string;
  pillarsSubtitleEs: string;
  pillarsSubtitleEn: string;
  // Cases
  casesSectionTitleEs: string;
  casesSectionTitleEn: string;
  casesSectionSubtitleEs: string;
  casesSectionSubtitleEn: string;
  casesSectionFooterEs: string;
  casesSectionFooterEn: string;
  casesSectionCtaEs: string;
  casesSectionCtaEn: string;
  // Products strip
  productsStripTitleEs: string;
  productsStripTitleEn: string;
  productsStripCtaEs: string;
  productsStripCtaEn: string;
  // Map
  mapTitleEs: string;
  mapTitleEn: string;
  mapSubtitleEs: string;
  mapSubtitleEn: string;
  mapMetrics: MapMetricItem[];
  // Why Us
  whyUsTitleEs: string;
  whyUsTitleEn: string;
  whyUsSubtitleEs: string;
  whyUsSubtitleEn: string;
  whyUsItems: WhyUsItem[];
  // FAQs
  faqsTitleEs: string;
  faqsTitleEn: string;
  faqs: FaqItem[];
  // Final CTA
  finalCtaTitleEs: string;
  finalCtaTitleEn: string;
  finalCtaCopyEs: string;
  finalCtaCopyEn: string;
  finalCtaBullets: FinalCtaBulletItem[];
  finalCtaPrimaryEs: string;
  finalCtaPrimaryEn: string;
  finalCtaPrimaryUrl: string;
  finalCtaSecondaryEs: string;
  finalCtaSecondaryEn: string;
  finalCtaSecondaryUrl: string;
  finalCtaFinePrintEs: string;
  finalCtaFinePrintEn: string;
  // Process
  processSectionTitleEs: string;
  processSectionTitleEn: string;
  processSectionSubtitleEs: string;
  processSectionSubtitleEn: string;
  processSteps: ProcessStepItem[];
  // Hub Industrias
  industriasHubTitleEs: string;
  industriasHubTitleEn: string;
  industriasHubSubtitleEs: string;
  industriasHubSubtitleEn: string;
  industriasHubStatEs: string;
  industriasHubStatEn: string;
  industriasSectionTitleEs: string;
  industriasSectionTitleEn: string;
  industriasSectionSubtitleEs: string;
  industriasSectionSubtitleEn: string;
  industriasSectionMetrics: IndustriasSectionMetricItem[];
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
  heroCtaPrimaryUrl: "",
  heroCtaSecondaryEs: "",
  heroCtaSecondaryEn: "",
  heroCtaSecondaryUrl: "",
  heroImage: "",
  metrics: [],
  trustBarLogos: [],
  trustBarTitleEs: "",
  trustBarTitleEn: "",
  servicesSectionTitleEs: "",
  servicesSectionTitleEn: "",
  pillarsSubtitleEs: "",
  pillarsSubtitleEn: "",
  casesSectionTitleEs: "",
  casesSectionTitleEn: "",
  casesSectionSubtitleEs: "",
  casesSectionSubtitleEn: "",
  casesSectionFooterEs: "",
  casesSectionFooterEn: "",
  casesSectionCtaEs: "",
  casesSectionCtaEn: "",
  productsStripTitleEs: "",
  productsStripTitleEn: "",
  productsStripCtaEs: "",
  productsStripCtaEn: "",
  mapTitleEs: "",
  mapTitleEn: "",
  mapSubtitleEs: "",
  mapSubtitleEn: "",
  mapMetrics: [],
  whyUsTitleEs: "",
  whyUsTitleEn: "",
  whyUsSubtitleEs: "",
  whyUsSubtitleEn: "",
  whyUsItems: [],
  faqsTitleEs: "",
  faqsTitleEn: "",
  faqs: [],
  finalCtaTitleEs: "",
  finalCtaTitleEn: "",
  finalCtaCopyEs: "",
  finalCtaCopyEn: "",
  finalCtaBullets: [],
  finalCtaPrimaryEs: "",
  finalCtaPrimaryEn: "",
  finalCtaPrimaryUrl: "",
  finalCtaSecondaryEs: "",
  finalCtaSecondaryEn: "",
  finalCtaSecondaryUrl: "",
  finalCtaFinePrintEs: "",
  finalCtaFinePrintEn: "",
  processSectionTitleEs: "",
  processSectionTitleEn: "",
  processSectionSubtitleEs: "",
  processSectionSubtitleEn: "",
  processSteps: [],
  industriasHubTitleEs: "",
  industriasHubTitleEn: "",
  industriasHubSubtitleEs: "",
  industriasHubSubtitleEn: "",
  industriasHubStatEs: "",
  industriasHubStatEn: "",
  industriasSectionTitleEs: "",
  industriasSectionTitleEn: "",
  industriasSectionSubtitleEs: "",
  industriasSectionSubtitleEn: "",
  industriasSectionMetrics: [],
};

type TabKey =
  | "hero"
  | "metricas"
  | "trust"
  | "secciones"
  | "mapa"
  | "why-us"
  | "proceso"
  | "faqs"
  | "cta"
  | "industrias-hub";

const tabs: Array<{ key: TabKey; label: string }> = [
  { key: "hero", label: "Hero" },
  { key: "metricas", label: "Métricas" },
  { key: "trust", label: "Trust Bar" },
  { key: "secciones", label: "Secciones" },
  { key: "mapa", label: "Mapa" },
  { key: "why-us", label: "¿Por qué?" },
  { key: "proceso", label: "Proceso" },
  { key: "faqs", label: "FAQs" },
  { key: "cta", label: "CTA Final" },
  { key: "industrias-hub", label: "Hub Industrias" },
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

            <div>
              <label className="mb-2 block text-sm font-medium text-text-70">
                URL del CTA Primario
              </label>
              <input
                type="text"
                value={data.heroCtaPrimaryUrl}
                onChange={(e) => update("heroCtaPrimaryUrl", e.target.value)}
                placeholder="/contacto"
                className={inputClass}
              />
            </div>

            <BilingualField
              labelEs="CTA Secundario ES"
              labelEn="Secondary CTA EN"
              valueEs={data.heroCtaSecondaryEs}
              valueEn={data.heroCtaSecondaryEn}
              onChangeEs={(v) => update("heroCtaSecondaryEs", v)}
              onChangeEn={(v) => update("heroCtaSecondaryEn", v)}
            />

            <div>
              <label className="mb-2 block text-sm font-medium text-text-70">
                URL del CTA Secundario
              </label>
              <input
                type="text"
                value={data.heroCtaSecondaryUrl}
                onChange={(e) => update("heroCtaSecondaryUrl", e.target.value)}
                placeholder="https://wa.me/..."
                className={inputClass}
              />
            </div>

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
            <div className="rounded-xl border border-border bg-bg-surface p-6 space-y-4">
              <h3 className="text-sm font-semibold text-text-100">Encabezado Trust Bar</h3>
              <BilingualField
                labelEs="Título ES"
                labelEn="Title EN"
                valueEs={data.trustBarTitleEs}
                valueEn={data.trustBarTitleEn}
                onChangeEs={(v) => update("trustBarTitleEs", v)}
                onChangeEn={(v) => update("trustBarTitleEn", v)}
                placeholder="Empresas en LATAM y USA que ya transformaron con Nivelics"
              />
            </div>

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
          <div className="space-y-4">
            <div className="rounded-xl border border-border bg-bg-surface p-6 space-y-4">
              <h3 className="text-sm font-semibold text-text-100">
                Pillars (IA + Cloud + Staffing)
              </h3>
              <BilingualField
                labelEs="Título pillars ES"
                labelEn="Pillars title EN"
                valueEs={data.servicesSectionTitleEs}
                valueEn={data.servicesSectionTitleEn}
                onChangeEs={(v) => update("servicesSectionTitleEs", v)}
                onChangeEn={(v) => update("servicesSectionTitleEn", v)}
              />
              <BilingualField
                labelEs="Subtítulo pillars ES"
                labelEn="Pillars subtitle EN"
                valueEs={data.pillarsSubtitleEs}
                valueEn={data.pillarsSubtitleEn}
                onChangeEs={(v) => update("pillarsSubtitleEs", v)}
                onChangeEn={(v) => update("pillarsSubtitleEn", v)}
                multiline
                rows={2}
              />
            </div>

            <div className="rounded-xl border border-border bg-bg-surface p-6 space-y-4">
              <h3 className="text-sm font-semibold text-text-100">Sección Casos de Éxito</h3>
              <BilingualField
                labelEs="Título casos ES"
                labelEn="Cases title EN"
                valueEs={data.casesSectionTitleEs}
                valueEn={data.casesSectionTitleEn}
                onChangeEs={(v) => update("casesSectionTitleEs", v)}
                onChangeEn={(v) => update("casesSectionTitleEn", v)}
              />
              <BilingualField
                labelEs="Subtítulo casos ES"
                labelEn="Cases subtitle EN"
                valueEs={data.casesSectionSubtitleEs}
                valueEn={data.casesSectionSubtitleEn}
                onChangeEs={(v) => update("casesSectionSubtitleEs", v)}
                onChangeEn={(v) => update("casesSectionSubtitleEn", v)}
                multiline
                rows={2}
              />
              <BilingualField
                labelEs="Pie (texto bajo grid) ES"
                labelEn="Footer (below grid) EN"
                valueEs={data.casesSectionFooterEs}
                valueEn={data.casesSectionFooterEn}
                onChangeEs={(v) => update("casesSectionFooterEs", v)}
                onChangeEn={(v) => update("casesSectionFooterEn", v)}
                placeholder="7 empresas. Resultados reales."
              />
              <BilingualField
                labelEs="CTA 'Ver todos' ES"
                labelEn="'See all' CTA EN"
                valueEs={data.casesSectionCtaEs}
                valueEn={data.casesSectionCtaEn}
                onChangeEs={(v) => update("casesSectionCtaEs", v)}
                onChangeEn={(v) => update("casesSectionCtaEn", v)}
                placeholder="Ver todos los casos"
              />
            </div>

            <div className="rounded-xl border border-border bg-bg-surface p-6 space-y-4">
              <h3 className="text-sm font-semibold text-text-100">Strip de Productos SaaS</h3>
              <BilingualField
                labelEs="Título strip ES"
                labelEn="Strip title EN"
                valueEs={data.productsStripTitleEs}
                valueEn={data.productsStripTitleEn}
                onChangeEs={(v) => update("productsStripTitleEs", v)}
                onChangeEn={(v) => update("productsStripTitleEn", v)}
                placeholder="Software propio de Nivelics"
              />
              <BilingualField
                labelEs="CTA strip ES"
                labelEn="Strip CTA EN"
                valueEs={data.productsStripCtaEs}
                valueEn={data.productsStripCtaEn}
                onChangeEs={(v) => update("productsStripCtaEs", v)}
                onChangeEn={(v) => update("productsStripCtaEn", v)}
                placeholder="Ver todos los productos →"
              />
            </div>
          </div>
        )}

        {/* Tab: Mapa */}
        {activeTab === "mapa" && (
          <div className="space-y-4">
            <div className="rounded-xl border border-border bg-bg-surface p-6 space-y-4">
              <h3 className="text-sm font-semibold text-text-100">
                Sección Mapa (&ldquo;13 años. 7 países.&rdquo;)
              </h3>
              <BilingualField
                labelEs="Título ES"
                labelEn="Title EN"
                valueEs={data.mapTitleEs}
                valueEn={data.mapTitleEn}
                onChangeEs={(v) => update("mapTitleEs", v)}
                onChangeEn={(v) => update("mapTitleEn", v)}
              />
              <BilingualField
                labelEs="Subtítulo ES"
                labelEn="Subtitle EN"
                valueEs={data.mapSubtitleEs}
                valueEn={data.mapSubtitleEn}
                onChangeEs={(v) => update("mapSubtitleEs", v)}
                onChangeEn={(v) => update("mapSubtitleEn", v)}
                multiline
                rows={3}
              />
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold text-text-100">Métricas del mapa (max 2)</h3>
                {data.mapMetrics.length < 2 && (
                  <button
                    type="button"
                    onClick={() =>
                      update("mapMetrics", [
                        ...data.mapMetrics,
                        { value: "", labelEs: "", labelEn: "", sublabelEs: "", sublabelEn: "" },
                      ])
                    }
                    className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium text-primary hover:bg-primary/10"
                  >
                    <Plus className="h-4 w-4" /> Agregar
                  </button>
                )}
              </div>

              {data.mapMetrics.map((m, idx) => (
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
                          "mapMetrics",
                          data.mapMetrics.filter((_, i) => i !== idx),
                        )
                      }
                      className="text-red-400 hover:text-red-300"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                  <div>
                    <label className="mb-2 block text-sm font-medium text-text-70">Valor</label>
                    <input
                      value={m.value}
                      onChange={(e) => {
                        const arr = [...data.mapMetrics];
                        arr[idx] = { ...arr[idx], value: e.target.value };
                        update("mapMetrics", arr);
                      }}
                      placeholder="13+"
                      className={`${inputClass} font-mono`}
                    />
                  </div>
                  <BilingualField
                    labelEs="Etiqueta ES"
                    labelEn="Label EN"
                    valueEs={m.labelEs}
                    valueEn={m.labelEn}
                    onChangeEs={(v) => {
                      const arr = [...data.mapMetrics];
                      arr[idx] = { ...arr[idx], labelEs: v };
                      update("mapMetrics", arr);
                    }}
                    onChangeEn={(v) => {
                      const arr = [...data.mapMetrics];
                      arr[idx] = { ...arr[idx], labelEn: v };
                      update("mapMetrics", arr);
                    }}
                  />
                  <BilingualField
                    labelEs="Sub-etiqueta ES (opcional)"
                    labelEn="Sublabel EN (optional)"
                    valueEs={m.sublabelEs}
                    valueEn={m.sublabelEn}
                    onChangeEs={(v) => {
                      const arr = [...data.mapMetrics];
                      arr[idx] = { ...arr[idx], sublabelEs: v };
                      update("mapMetrics", arr);
                    }}
                    onChangeEn={(v) => {
                      const arr = [...data.mapMetrics];
                      arr[idx] = { ...arr[idx], sublabelEn: v };
                      update("mapMetrics", arr);
                    }}
                  />
                </div>
              ))}

              {data.mapMetrics.length === 0 && (
                <div className="rounded-xl border border-border bg-bg-surface p-8 text-center">
                  <p className="text-text-40">No hay métricas configuradas</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Tab: Why Us */}
        {activeTab === "why-us" && (
          <div className="space-y-4">
            <div className="rounded-xl border border-border bg-bg-surface p-6 space-y-4">
              <h3 className="text-sm font-semibold text-text-100">
                ¿Por qué Nivelics? — Encabezado
              </h3>
              <BilingualField
                labelEs="Título ES"
                labelEn="Title EN"
                valueEs={data.whyUsTitleEs}
                valueEn={data.whyUsTitleEn}
                onChangeEs={(v) => update("whyUsTitleEs", v)}
                onChangeEn={(v) => update("whyUsTitleEn", v)}
              />
              <BilingualField
                labelEs="Subtítulo ES (opcional)"
                labelEn="Subtitle EN (optional)"
                valueEs={data.whyUsSubtitleEs}
                valueEn={data.whyUsSubtitleEn}
                onChangeEs={(v) => update("whyUsSubtitleEs", v)}
                onChangeEn={(v) => update("whyUsSubtitleEn", v)}
                multiline
                rows={2}
              />
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold text-text-100">
                  Diferenciadores (recomendado: 4, max 6)
                </h3>
                {data.whyUsItems.length < 6 && (
                  <button
                    type="button"
                    onClick={() =>
                      update("whyUsItems", [
                        ...data.whyUsItems,
                        {
                          icon: "layers",
                          color: "#06B6D4",
                          titleEs: "",
                          titleEn: "",
                          copyEs: "",
                          copyEn: "",
                        },
                      ])
                    }
                    className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium text-primary hover:bg-primary/10"
                  >
                    <Plus className="h-4 w-4" /> Agregar diferenciador
                  </button>
                )}
              </div>

              {data.whyUsItems.map((item, idx) => (
                <div
                  key={idx}
                  className="rounded-xl border border-border bg-bg-surface p-6 space-y-4"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-text-40">
                      Diferenciador {idx + 1}
                    </span>
                    <button
                      type="button"
                      onClick={() =>
                        update(
                          "whyUsItems",
                          data.whyUsItems.filter((_, i) => i !== idx),
                        )
                      }
                      className="text-red-400 hover:text-red-300"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="mb-2 block text-sm font-medium text-text-70">Icono</label>
                      <GeoIconPicker
                        value={item.icon}
                        onChange={(name) => {
                          const arr = [...data.whyUsItems];
                          arr[idx] = { ...arr[idx], icon: name };
                          update("whyUsItems", arr);
                        }}
                        color="cyan"
                      />
                    </div>
                    <div>
                      <label className="mb-2 block text-sm font-medium text-text-70">
                        Color (hex)
                      </label>
                      <input
                        type="text"
                        value={item.color}
                        onChange={(e) => {
                          const arr = [...data.whyUsItems];
                          arr[idx] = { ...arr[idx], color: e.target.value };
                          update("whyUsItems", arr);
                        }}
                        placeholder="#06B6D4"
                        className={`${inputClass} font-mono`}
                      />
                    </div>
                  </div>

                  <BilingualField
                    labelEs="Título ES"
                    labelEn="Title EN"
                    valueEs={item.titleEs}
                    valueEn={item.titleEn}
                    onChangeEs={(v) => {
                      const arr = [...data.whyUsItems];
                      arr[idx] = { ...arr[idx], titleEs: v };
                      update("whyUsItems", arr);
                    }}
                    onChangeEn={(v) => {
                      const arr = [...data.whyUsItems];
                      arr[idx] = { ...arr[idx], titleEn: v };
                      update("whyUsItems", arr);
                    }}
                  />

                  <BilingualField
                    labelEs="Copy ES"
                    labelEn="Copy EN"
                    valueEs={item.copyEs}
                    valueEn={item.copyEn}
                    onChangeEs={(v) => {
                      const arr = [...data.whyUsItems];
                      arr[idx] = { ...arr[idx], copyEs: v };
                      update("whyUsItems", arr);
                    }}
                    onChangeEn={(v) => {
                      const arr = [...data.whyUsItems];
                      arr[idx] = { ...arr[idx], copyEn: v };
                      update("whyUsItems", arr);
                    }}
                    multiline
                    rows={3}
                  />
                </div>
              ))}

              {data.whyUsItems.length === 0 && (
                <div className="rounded-xl border border-border bg-bg-surface p-8 text-center">
                  <p className="text-text-40">No hay diferenciadores configurados</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Tab: FAQs */}
        {activeTab === "faqs" && (
          <div className="space-y-4">
            <div className="rounded-xl border border-border bg-bg-surface p-6 space-y-4">
              <h3 className="text-sm font-semibold text-text-100">Título de sección FAQs</h3>
              <BilingualField
                labelEs="Título ES"
                labelEn="Title EN"
                valueEs={data.faqsTitleEs}
                valueEn={data.faqsTitleEn}
                onChangeEs={(v) => update("faqsTitleEs", v)}
                onChangeEn={(v) => update("faqsTitleEn", v)}
                placeholder="Preguntas frecuentes"
              />
            </div>

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

        {/* Tab: Proceso (3 pasos) */}
        {activeTab === "proceso" && (
          <div className="space-y-6">
            <div className="rounded-xl border border-border bg-bg-surface p-6 space-y-4">
              <h3 className="text-sm font-semibold text-text-100">
                Sección &quot;Cómo trabajamos&quot;
              </h3>
              <BilingualField
                labelEs="Título de sección"
                labelEn="Section title"
                valueEs={data.processSectionTitleEs}
                valueEn={data.processSectionTitleEn}
                onChangeEs={(v) => update("processSectionTitleEs", v)}
                onChangeEn={(v) => update("processSectionTitleEn", v)}
              />
              <BilingualField
                labelEs="Subtítulo"
                labelEn="Subtitle"
                valueEs={data.processSectionSubtitleEs}
                valueEn={data.processSectionSubtitleEn}
                onChangeEs={(v) => update("processSectionSubtitleEs", v)}
                onChangeEn={(v) => update("processSectionSubtitleEn", v)}
                multiline
                rows={2}
              />
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold text-text-100">
                  Pasos del proceso (recomendado: 3)
                </h3>
                {data.processSteps.length < 6 && (
                  <button
                    type="button"
                    onClick={() =>
                      update("processSteps", [
                        ...data.processSteps,
                        {
                          number: String(data.processSteps.length + 1).padStart(2, "0"),
                          icon: "calendar",
                          titleEs: "",
                          titleEn: "",
                          descEs: "",
                          descEn: "",
                          durationEs: "",
                          durationEn: "",
                        },
                      ])
                    }
                    className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium text-primary hover:bg-primary/10"
                  >
                    <Plus className="h-4 w-4" /> Agregar paso
                  </button>
                )}
              </div>

              {data.processSteps.map((step, idx) => (
                <div
                  key={idx}
                  className="rounded-xl border border-border bg-bg-surface p-6 space-y-4"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-text-40">
                      Paso {step.number || idx + 1}
                    </span>
                    <button
                      type="button"
                      onClick={() =>
                        update(
                          "processSteps",
                          data.processSteps.filter((_, i) => i !== idx),
                        )
                      }
                      className="text-red-400 hover:text-red-300"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="mb-2 block text-sm font-medium text-text-70">Número</label>
                      <input
                        value={step.number}
                        onChange={(e) => {
                          const arr = [...data.processSteps];
                          arr[idx] = { ...arr[idx], number: e.target.value };
                          update("processSteps", arr);
                        }}
                        placeholder="01"
                        className={inputClass}
                      />
                    </div>
                    <div>
                      <label className="mb-2 block text-sm font-medium text-text-70">Icono</label>
                      <GeoIconPicker
                        value={step.icon ?? ""}
                        onChange={(name) => {
                          const arr = [...data.processSteps];
                          arr[idx] = { ...arr[idx], icon: name };
                          update("processSteps", arr);
                        }}
                        color="cyan"
                      />
                    </div>
                  </div>

                  <BilingualField
                    labelEs="Título"
                    labelEn="Title"
                    valueEs={step.titleEs}
                    valueEn={step.titleEn}
                    onChangeEs={(v) => {
                      const arr = [...data.processSteps];
                      arr[idx] = { ...arr[idx], titleEs: v };
                      update("processSteps", arr);
                    }}
                    onChangeEn={(v) => {
                      const arr = [...data.processSteps];
                      arr[idx] = { ...arr[idx], titleEn: v };
                      update("processSteps", arr);
                    }}
                  />

                  <BilingualField
                    labelEs="Descripción"
                    labelEn="Description"
                    valueEs={step.descEs}
                    valueEn={step.descEn}
                    onChangeEs={(v) => {
                      const arr = [...data.processSteps];
                      arr[idx] = { ...arr[idx], descEs: v };
                      update("processSteps", arr);
                    }}
                    onChangeEn={(v) => {
                      const arr = [...data.processSteps];
                      arr[idx] = { ...arr[idx], descEn: v };
                      update("processSteps", arr);
                    }}
                    multiline
                    rows={3}
                  />

                  <BilingualField
                    labelEs="Duración ES"
                    labelEn="Duration EN"
                    placeholder="30 min / 2 semanas / 30 min / 2 weeks"
                    valueEs={step.durationEs}
                    valueEn={step.durationEn}
                    onChangeEs={(v) => {
                      const arr = [...data.processSteps];
                      arr[idx] = { ...arr[idx], durationEs: v };
                      update("processSteps", arr);
                    }}
                    onChangeEn={(v) => {
                      const arr = [...data.processSteps];
                      arr[idx] = { ...arr[idx], durationEn: v };
                      update("processSteps", arr);
                    }}
                  />
                </div>
              ))}

              {data.processSteps.length === 0 && (
                <div className="rounded-xl border border-border bg-bg-surface p-8 text-center">
                  <p className="text-text-40">
                    No hay pasos. Corre scripts/seed-home-process.ts para crearlos.
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Tab: Hub Industrias */}
        {activeTab === "industrias-hub" && (
          <div className="rounded-xl border border-border bg-bg-surface p-6 space-y-4">
            <div>
              <h3 className="text-sm font-semibold text-text-100">
                Página /industrias — Contenido del hero
              </h3>
              <p className="mt-1 text-xs text-text-40">
                Este contenido aparece en el encabezado de la página que lista todos los sectores.
              </p>
            </div>

            <BilingualField
              labelEs="Título principal ES"
              labelEn="Main title EN"
              valueEs={data.industriasHubTitleEs}
              valueEn={data.industriasHubTitleEn}
              onChangeEs={(v) => update("industriasHubTitleEs", v)}
              onChangeEn={(v) => update("industriasHubTitleEn", v)}
            />

            <BilingualField
              labelEs="Subtítulo ES"
              labelEn="Subtitle EN"
              valueEs={data.industriasHubSubtitleEs}
              valueEn={data.industriasHubSubtitleEn}
              onChangeEs={(v) => update("industriasHubSubtitleEs", v)}
              onChangeEn={(v) => update("industriasHubSubtitleEn", v)}
              multiline
              rows={4}
            />

            <BilingualField
              labelEs="Frase de credibilidad ES"
              labelEn="Credibility line EN"
              valueEs={data.industriasHubStatEs}
              valueEn={data.industriasHubStatEn}
              onChangeEs={(v) => update("industriasHubStatEs", v)}
              onChangeEn={(v) => update("industriasHubStatEn", v)}
              multiline
              rows={2}
            />

            <div className="border-t border-border pt-6 mt-2">
              <div className="mb-4">
                <h4 className="text-sm font-semibold text-text-100">
                  Sección &quot;Años de experiencia&quot; (debajo de las cards)
                </h4>
                <p className="mt-1 text-xs text-text-40">
                  Título, subtítulo y 3 métricas que aparecen al final de la página /industrias.
                </p>
              </div>

              <BilingualField
                labelEs="Título de la sección ES"
                labelEn="Section title EN"
                valueEs={data.industriasSectionTitleEs}
                valueEn={data.industriasSectionTitleEn}
                onChangeEs={(v) => update("industriasSectionTitleEs", v)}
                onChangeEn={(v) => update("industriasSectionTitleEn", v)}
              />

              <div className="mt-4">
                <BilingualField
                  labelEs="Subtítulo ES"
                  labelEn="Subtitle EN"
                  valueEs={data.industriasSectionSubtitleEs}
                  valueEn={data.industriasSectionSubtitleEn}
                  onChangeEs={(v) => update("industriasSectionSubtitleEs", v)}
                  onChangeEn={(v) => update("industriasSectionSubtitleEn", v)}
                  multiline
                  rows={3}
                />
              </div>

              <div className="mt-6">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm font-medium text-text-70">Métricas</span>
                  {data.industriasSectionMetrics.length < 4 && (
                    <button
                      type="button"
                      onClick={() =>
                        update("industriasSectionMetrics", [
                          ...data.industriasSectionMetrics,
                          { value: "", labelEs: "", labelEn: "" },
                        ])
                      }
                      className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium text-primary hover:bg-primary/10"
                    >
                      <Plus className="h-4 w-4" /> Agregar
                    </button>
                  )}
                </div>

                {data.industriasSectionMetrics.map((m, idx) => (
                  <div
                    key={idx}
                    className="grid grid-cols-[1fr_2fr_2fr_auto] gap-3 mb-3 p-3 rounded-lg border border-border bg-bg-elevated"
                  >
                    <div>
                      <label className="mb-1 block text-xs text-text-40">Valor</label>
                      <input
                        value={m.value}
                        onChange={(e) => {
                          const arr = [...data.industriasSectionMetrics];
                          arr[idx] = { ...arr[idx], value: e.target.value };
                          update("industriasSectionMetrics", arr);
                        }}
                        placeholder="40%"
                        className={`${inputClass} font-mono text-sm`}
                      />
                    </div>
                    <div>
                      <label className="mb-1 block text-xs text-text-40">Etiqueta ES</label>
                      <input
                        value={m.labelEs}
                        onChange={(e) => {
                          const arr = [...data.industriasSectionMetrics];
                          arr[idx] = { ...arr[idx], labelEs: e.target.value };
                          update("industriasSectionMetrics", arr);
                        }}
                        className={`${inputClass} text-sm`}
                      />
                    </div>
                    <div>
                      <label className="mb-1 block text-xs text-text-40">Etiqueta EN</label>
                      <input
                        value={m.labelEn}
                        onChange={(e) => {
                          const arr = [...data.industriasSectionMetrics];
                          arr[idx] = { ...arr[idx], labelEn: e.target.value };
                          update("industriasSectionMetrics", arr);
                        }}
                        className={`${inputClass} text-sm`}
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() =>
                        update(
                          "industriasSectionMetrics",
                          data.industriasSectionMetrics.filter((_, i) => i !== idx),
                        )
                      }
                      className="self-end text-red-400 hover:text-red-300 px-2 pb-3"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Tab: CTA Final */}
        {activeTab === "cta" && (
          <div className="space-y-4">
            <div className="rounded-xl border border-border bg-bg-surface p-6 space-y-4">
              <h3 className="text-sm font-semibold text-text-100">CTA Final — Encabezado</h3>

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

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold text-text-100">Bullets del CTA (max 5)</h3>
                {data.finalCtaBullets.length < 5 && (
                  <button
                    type="button"
                    onClick={() =>
                      update("finalCtaBullets", [
                        ...data.finalCtaBullets,
                        { textEs: "", textEn: "" },
                      ])
                    }
                    className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium text-primary hover:bg-primary/10"
                  >
                    <Plus className="h-4 w-4" /> Agregar bullet
                  </button>
                )}
              </div>

              {data.finalCtaBullets.map((b, idx) => (
                <div
                  key={idx}
                  className="grid grid-cols-[1fr_1fr_auto] gap-3 p-3 rounded-lg border border-border bg-bg-elevated"
                >
                  <div>
                    <label className="mb-1 block text-xs text-text-40">Texto ES</label>
                    <input
                      value={b.textEs}
                      onChange={(e) => {
                        const arr = [...data.finalCtaBullets];
                        arr[idx] = { ...arr[idx], textEs: e.target.value };
                        update("finalCtaBullets", arr);
                      }}
                      className={`${inputClass} text-sm`}
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-xs text-text-40">Texto EN</label>
                    <input
                      value={b.textEn}
                      onChange={(e) => {
                        const arr = [...data.finalCtaBullets];
                        arr[idx] = { ...arr[idx], textEn: e.target.value };
                        update("finalCtaBullets", arr);
                      }}
                      className={`${inputClass} text-sm`}
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() =>
                      update(
                        "finalCtaBullets",
                        data.finalCtaBullets.filter((_, i) => i !== idx),
                      )
                    }
                    className="self-end text-red-400 hover:text-red-300 px-2 pb-3"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>

            <div className="rounded-xl border border-border bg-bg-surface p-6 space-y-4">
              <h3 className="text-sm font-semibold text-text-100">Botón Primario</h3>
              <BilingualField
                labelEs="Label primario ES"
                labelEn="Primary label EN"
                valueEs={data.finalCtaPrimaryEs}
                valueEn={data.finalCtaPrimaryEn}
                onChangeEs={(v) => update("finalCtaPrimaryEs", v)}
                onChangeEn={(v) => update("finalCtaPrimaryEn", v)}
              />
              <div>
                <label className="mb-2 block text-sm font-medium text-text-70">URL primaria</label>
                <input
                  value={data.finalCtaPrimaryUrl}
                  onChange={(e) => update("finalCtaPrimaryUrl", e.target.value)}
                  placeholder="/contacto"
                  className={inputClass}
                />
              </div>
            </div>

            <div className="rounded-xl border border-border bg-bg-surface p-6 space-y-4">
              <h3 className="text-sm font-semibold text-text-100">Botón Secundario</h3>
              <BilingualField
                labelEs="Label secundario ES"
                labelEn="Secondary label EN"
                valueEs={data.finalCtaSecondaryEs}
                valueEn={data.finalCtaSecondaryEn}
                onChangeEs={(v) => update("finalCtaSecondaryEs", v)}
                onChangeEn={(v) => update("finalCtaSecondaryEn", v)}
              />
              <div>
                <label className="mb-2 block text-sm font-medium text-text-70">
                  URL secundaria
                </label>
                <input
                  value={data.finalCtaSecondaryUrl}
                  onChange={(e) => update("finalCtaSecondaryUrl", e.target.value)}
                  placeholder="https://wa.me/..."
                  className={inputClass}
                />
              </div>
            </div>

            <div className="rounded-xl border border-border bg-bg-surface p-6 space-y-4">
              <h3 className="text-sm font-semibold text-text-100">Texto al pie (fine print)</h3>
              <BilingualField
                labelEs="Fine print ES"
                labelEn="Fine print EN"
                valueEs={data.finalCtaFinePrintEs}
                valueEn={data.finalCtaFinePrintEn}
                onChangeEs={(v) => update("finalCtaFinePrintEs", v)}
                onChangeEn={(v) => update("finalCtaFinePrintEn", v)}
                multiline
                rows={2}
              />
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
      </div>
    </div>
  );
}
