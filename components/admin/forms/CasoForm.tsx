"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { BilingualEditor, BilingualField } from "@/components/admin/ui/BilingualEditor";
import { SlugInput } from "@/components/admin/ui/SlugInput";
import { PublishControls } from "@/components/admin/ui/PublishControls";
import { ImageUploader } from "@/components/admin/ui/ImageUploader";
import {
  createCasoExito,
  updateCasoExito,
  deleteCasoExito,
} from "@/lib/admin/actions/casos.actions";

interface CasoData {
  id?: string;
  slug: string;
  clientName: string;
  clientLogo: string;
  clientCountry: string;
  clientSector: string;
  titleEs: string;
  titleEn: string;
  challengeEs: string;
  challengeEn: string;
  solutionEs: string;
  solutionEn: string;
  resultsEs: string;
  resultsEn: string;
  metric1Value: string;
  metric1LabelEs: string;
  metric1LabelEn: string;
  metric2Value: string;
  metric2LabelEs: string;
  metric2LabelEn: string;
  metric3Value: string;
  metric3LabelEs: string;
  metric3LabelEn: string;
  testimonialQuoteEs: string;
  testimonialQuoteEn: string;
  testimonialAuthor: string;
  testimonialRole: string;
  coverImage: string;
  gallery: string[];
  servicesUsed: string[];
  featured: boolean;
  seoTitleEs: string;
  seoTitleEn: string;
  seoDescriptionEs: string;
  seoDescriptionEn: string;
  status: "draft" | "published" | "scheduled";
  translationStatusEn: "complete" | "partial" | "pending" | "auto";
}

const defaultCaso: CasoData = {
  slug: "",
  clientName: "",
  clientLogo: "",
  clientCountry: "",
  clientSector: "",
  titleEs: "",
  titleEn: "",
  challengeEs: "",
  challengeEn: "",
  solutionEs: "",
  solutionEn: "",
  resultsEs: "",
  resultsEn: "",
  metric1Value: "",
  metric1LabelEs: "",
  metric1LabelEn: "",
  metric2Value: "",
  metric2LabelEs: "",
  metric2LabelEn: "",
  metric3Value: "",
  metric3LabelEs: "",
  metric3LabelEn: "",
  testimonialQuoteEs: "",
  testimonialQuoteEn: "",
  testimonialAuthor: "",
  testimonialRole: "",
  coverImage: "",
  gallery: [],
  servicesUsed: [],
  featured: false,
  seoTitleEs: "",
  seoTitleEn: "",
  seoDescriptionEs: "",
  seoDescriptionEn: "",
  status: "draft",
  translationStatusEn: "pending",
};

interface CasoFormProps {
  initialData?: Partial<CasoData> & { id?: string };
  isNew?: boolean;
}

export default function CasoForm({ initialData, isNew = true }: CasoFormProps) {
  const router = useRouter();
  const [caso, setCaso] = useState<CasoData>({ ...defaultCaso, ...initialData } as CasoData);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [translatingField, setTranslatingField] = useState<string | null>(null);

  function update<K extends keyof CasoData>(key: K, value: CasoData[K]) {
    setCaso((prev) => ({ ...prev, [key]: value }));
  }

  async function translateField(fieldEs: keyof CasoData, fieldEn: keyof CasoData) {
    const textEs = caso[fieldEs];
    if (!textEs || typeof textEs !== "string") return;

    setTranslatingField(fieldEs as string);
    try {
      const res = await fetch("/api/admin/translate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: textEs, sourceField: fieldEs, contentType: "caso" }),
      });
      const data = await res.json();
      if (data.translation) {
        update(fieldEn, data.translation as CasoData[typeof fieldEn]);
      }
    } catch {
      // silent
    } finally {
      setTranslatingField(null);
    }
  }

  async function handleSave() {
    setSaving(true);
    setError("");
    try {
      if (isNew) {
        const result = await createCasoExito(caso);
        router.push(`/admin/casos/${result.id}`);
      } else if (initialData?.id) {
        await updateCasoExito(initialData.id, caso);
      }
      router.refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Error al guardar");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    if (!initialData?.id) return;
    if (!confirm("¿Estás seguro de eliminar este caso?")) return;
    await deleteCasoExito(initialData.id);
    router.push("/admin/casos");
  }

  const serviceOptions = ["ia", "cloud", "staffing", "finops", "dev"];

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_320px]">
      <div className="space-y-6">
        {error && (
          <div className="rounded-lg bg-red-500/10 border border-red-500/20 px-4 py-3 text-sm text-red-400">
            {error}
          </div>
        )}

        {/* Client info */}
        <div className="rounded-xl border border-border bg-bg-surface p-6 space-y-4">
          <h3 className="text-sm font-semibold text-text-100">Datos del cliente</h3>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-medium text-text-70">
                Nombre del cliente *
              </label>
              <input
                type="text"
                value={caso.clientName}
                onChange={(e) => update("clientName", e.target.value)}
                className="w-full rounded-lg border border-border bg-bg-elevated px-4 py-3 text-text-100 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-text-70">País</label>
              <input
                type="text"
                value={caso.clientCountry}
                onChange={(e) => update("clientCountry", e.target.value)}
                className="w-full rounded-lg border border-border bg-bg-elevated px-4 py-3 text-text-100 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-text-70">Sector</label>
              <input
                type="text"
                value={caso.clientSector}
                onChange={(e) => update("clientSector", e.target.value)}
                className="w-full rounded-lg border border-border bg-bg-elevated px-4 py-3 text-text-100 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-text-70">
                Logo del cliente
              </label>
              <ImageUploader
                value={caso.clientLogo}
                onChange={(url) => update("clientLogo", url)}
                folder="casos"
                aspectRatio="1/1"
              />
            </div>
          </div>
        </div>

        <BilingualEditor
          translationStatus={caso.translationStatusEn}
          onTranslationStatusChange={(s) => update("translationStatusEn", s)}
        >
          {({ activeTab }) => (
            <div className="space-y-6">
              {/* Title */}
              {activeTab === "side-by-side" ? (
                <BilingualField
                  labelEs="Título *"
                  labelEn="Title"
                  valueEs={caso.titleEs}
                  valueEn={caso.titleEn}
                  onChangeEs={(v) => update("titleEs", v)}
                  onChangeEn={(v) => update("titleEn", v)}
                  onTranslate={() => translateField("titleEs", "titleEn")}
                  translating={translatingField === "titleEs"}
                />
              ) : (
                <div>
                  <label className="mb-2 block text-sm font-medium text-text-70">
                    {activeTab === "es" ? "Título *" : "Title"}
                  </label>
                  <input
                    type="text"
                    value={activeTab === "es" ? caso.titleEs : caso.titleEn}
                    onChange={(e) =>
                      update(activeTab === "es" ? "titleEs" : "titleEn", e.target.value)
                    }
                    className="w-full rounded-lg border border-border bg-bg-elevated px-4 py-3 text-text-100 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                </div>
              )}

              <SlugInput
                value={caso.slug}
                onChange={(v) => update("slug", v)}
                sourceText={caso.clientName}
                prefix="/casos-de-exito/"
              />

              {/* Challenge */}
              {activeTab === "side-by-side" ? (
                <BilingualField
                  labelEs="El reto"
                  labelEn="The Challenge"
                  valueEs={caso.challengeEs}
                  valueEn={caso.challengeEn}
                  onChangeEs={(v) => update("challengeEs", v)}
                  onChangeEn={(v) => update("challengeEn", v)}
                  multiline
                  rows={4}
                  onTranslate={() => translateField("challengeEs", "challengeEn")}
                  translating={translatingField === "challengeEs"}
                />
              ) : (
                <div>
                  <label className="mb-2 block text-sm font-medium text-text-70">
                    {activeTab === "es" ? "El reto" : "The Challenge"}
                  </label>
                  <textarea
                    value={activeTab === "es" ? caso.challengeEs : caso.challengeEn}
                    onChange={(e) =>
                      update(activeTab === "es" ? "challengeEs" : "challengeEn", e.target.value)
                    }
                    rows={4}
                    className="w-full rounded-lg border border-border bg-bg-elevated px-4 py-3 text-text-100 focus:border-primary focus:outline-none resize-none"
                  />
                </div>
              )}

              {/* Solution */}
              {activeTab === "side-by-side" ? (
                <BilingualField
                  labelEs="La solución"
                  labelEn="The Solution"
                  valueEs={caso.solutionEs}
                  valueEn={caso.solutionEn}
                  onChangeEs={(v) => update("solutionEs", v)}
                  onChangeEn={(v) => update("solutionEn", v)}
                  multiline
                  rows={4}
                  onTranslate={() => translateField("solutionEs", "solutionEn")}
                  translating={translatingField === "solutionEs"}
                />
              ) : (
                <div>
                  <label className="mb-2 block text-sm font-medium text-text-70">
                    {activeTab === "es" ? "La solución" : "The Solution"}
                  </label>
                  <textarea
                    value={activeTab === "es" ? caso.solutionEs : caso.solutionEn}
                    onChange={(e) =>
                      update(activeTab === "es" ? "solutionEs" : "solutionEn", e.target.value)
                    }
                    rows={4}
                    className="w-full rounded-lg border border-border bg-bg-elevated px-4 py-3 text-text-100 focus:border-primary focus:outline-none resize-none"
                  />
                </div>
              )}

              {/* Results */}
              {activeTab === "side-by-side" ? (
                <BilingualField
                  labelEs="Resultados"
                  labelEn="Results"
                  valueEs={caso.resultsEs}
                  valueEn={caso.resultsEn}
                  onChangeEs={(v) => update("resultsEs", v)}
                  onChangeEn={(v) => update("resultsEn", v)}
                  multiline
                  rows={4}
                  onTranslate={() => translateField("resultsEs", "resultsEn")}
                  translating={translatingField === "resultsEs"}
                />
              ) : (
                <div>
                  <label className="mb-2 block text-sm font-medium text-text-70">
                    {activeTab === "es" ? "Resultados" : "Results"}
                  </label>
                  <textarea
                    value={activeTab === "es" ? caso.resultsEs : caso.resultsEn}
                    onChange={(e) =>
                      update(activeTab === "es" ? "resultsEs" : "resultsEn", e.target.value)
                    }
                    rows={4}
                    className="w-full rounded-lg border border-border bg-bg-elevated px-4 py-3 text-text-100 focus:border-primary focus:outline-none resize-none"
                  />
                </div>
              )}

              {/* Metrics */}
              <div className="rounded-xl border border-border bg-bg-surface p-6 space-y-4">
                <h3 className="text-sm font-semibold text-text-100">Métricas clave</h3>
                {(
                  [
                    {
                      n: 1,
                      valKey: "metric1Value",
                      esKey: "metric1LabelEs",
                      enKey: "metric1LabelEn",
                    },
                    {
                      n: 2,
                      valKey: "metric2Value",
                      esKey: "metric2LabelEs",
                      enKey: "metric2LabelEn",
                    },
                    {
                      n: 3,
                      valKey: "metric3Value",
                      esKey: "metric3LabelEs",
                      enKey: "metric3LabelEn",
                    },
                  ] as const
                ).map(({ n, valKey, esKey, enKey }) => (
                  <div key={n} className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                    <div>
                      <label className="mb-1 block text-xs text-text-40">Valor {n}</label>
                      <input
                        type="text"
                        value={caso[valKey]}
                        onChange={(e) => update(valKey, e.target.value)}
                        placeholder="95%"
                        className="w-full rounded-lg border border-border bg-bg-elevated px-3 py-2 text-sm text-text-100 focus:border-primary focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="mb-1 block text-xs text-text-40">Label ES</label>
                      <input
                        type="text"
                        value={caso[esKey]}
                        onChange={(e) => update(esKey, e.target.value)}
                        className="w-full rounded-lg border border-border bg-bg-elevated px-3 py-2 text-sm text-text-100 focus:border-primary focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="mb-1 block text-xs text-text-40">Label EN</label>
                      <input
                        type="text"
                        value={caso[enKey]}
                        onChange={(e) => update(enKey, e.target.value)}
                        className="w-full rounded-lg border border-border bg-bg-elevated px-3 py-2 text-sm text-text-100 focus:border-primary focus:outline-none"
                      />
                    </div>
                  </div>
                ))}
              </div>

              {/* Testimonial */}
              <div className="rounded-xl border border-border bg-bg-surface p-6 space-y-4">
                <h3 className="text-sm font-semibold text-text-100">Testimonio</h3>
                {activeTab === "side-by-side" ? (
                  <BilingualField
                    labelEs="Cita"
                    labelEn="Quote"
                    valueEs={caso.testimonialQuoteEs}
                    valueEn={caso.testimonialQuoteEn}
                    onChangeEs={(v) => update("testimonialQuoteEs", v)}
                    onChangeEn={(v) => update("testimonialQuoteEn", v)}
                    multiline
                    rows={3}
                    onTranslate={() => translateField("testimonialQuoteEs", "testimonialQuoteEn")}
                    translating={translatingField === "testimonialQuoteEs"}
                  />
                ) : (
                  <div>
                    <label className="mb-2 block text-sm font-medium text-text-70">
                      {activeTab === "es" ? "Cita" : "Quote"}
                    </label>
                    <textarea
                      value={activeTab === "es" ? caso.testimonialQuoteEs : caso.testimonialQuoteEn}
                      onChange={(e) =>
                        update(
                          activeTab === "es" ? "testimonialQuoteEs" : "testimonialQuoteEn",
                          e.target.value,
                        )
                      }
                      rows={3}
                      className="w-full rounded-lg border border-border bg-bg-elevated px-4 py-3 text-text-100 focus:border-primary focus:outline-none resize-none"
                    />
                  </div>
                )}
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label className="mb-2 block text-sm font-medium text-text-70">Autor</label>
                    <input
                      type="text"
                      value={caso.testimonialAuthor}
                      onChange={(e) => update("testimonialAuthor", e.target.value)}
                      className="w-full rounded-lg border border-border bg-bg-elevated px-4 py-3 text-text-100 focus:border-primary focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="mb-2 block text-sm font-medium text-text-70">Cargo</label>
                    <input
                      type="text"
                      value={caso.testimonialRole}
                      onChange={(e) => update("testimonialRole", e.target.value)}
                      className="w-full rounded-lg border border-border bg-bg-elevated px-4 py-3 text-text-100 focus:border-primary focus:outline-none"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}
        </BilingualEditor>
      </div>

      {/* Sidebar */}
      <div className="space-y-6">
        <PublishControls
          status={caso.status}
          onStatusChange={(s) => update("status", s)}
          onSave={handleSave}
          onDelete={isNew ? undefined : handleDelete}
          saving={saving}
          isNew={isNew}
        />

        {/* Cover image */}
        <div className="rounded-xl border border-border bg-bg-surface p-5 space-y-3">
          <h3 className="text-sm font-semibold text-text-100">Imagen de portada</h3>
          <ImageUploader
            value={caso.coverImage}
            onChange={(url) => update("coverImage", url)}
            folder="casos"
            aspectRatio="16/9"
          />
        </div>

        {/* Services used */}
        <div className="rounded-xl border border-border bg-bg-surface p-5 space-y-3">
          <h3 className="text-sm font-semibold text-text-100">Servicios utilizados</h3>
          <div className="flex flex-wrap gap-2">
            {serviceOptions.map((svc) => (
              <button
                key={svc}
                type="button"
                onClick={() => {
                  const current = caso.servicesUsed;
                  update(
                    "servicesUsed",
                    current.includes(svc) ? current.filter((s) => s !== svc) : [...current, svc],
                  );
                }}
                className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
                  caso.servicesUsed.includes(svc)
                    ? `bg-${svc}/10 text-${svc} border border-${svc}/30`
                    : "border border-border text-text-40 hover:text-text-70"
                }`}
              >
                {svc.toUpperCase()}
              </button>
            ))}
          </div>
        </div>

        {/* Featured */}
        <div className="rounded-xl border border-border bg-bg-surface p-5">
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={caso.featured}
              onChange={(e) => update("featured", e.target.checked)}
              className="h-4 w-4 rounded border-border text-primary focus:ring-primary"
            />
            <span className="text-sm font-medium text-text-100">Caso destacado</span>
          </label>
        </div>
      </div>
    </div>
  );
}
