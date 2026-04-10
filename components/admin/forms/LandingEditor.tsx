"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Plus,
  Trash2,
  ChevronUp,
  ChevronDown,
  Pencil,
  Save,
  ChevronRight,
  GripVertical,
} from "lucide-react";
import { BLOCK_TYPES, type BlockTypeKey } from "@/lib/admin/landing-blocks";

// ─── Types ──────────────────────────────────────────────

interface BlockItem {
  type: string;
  order: number;
  data: Record<string, unknown>;
}

interface LandingData {
  id: string;
  slug: string;
  campaignName: string;
  serviceType: string | null;
  accentColor: string;
  noindex: boolean;
  metaTitle: string | null;
  metaDescription: string | null;
  ogImage: string | null;
  blocks: BlockItem[] | null;
  formDestination: string | null;
  formWebhookUrl: string | null;
  whatsappMessage: string | null;
  utmCampaign: string | null;
  utmSource: string | null;
  utmMedium: string | null;
  pixelFacebook: boolean;
  googleAdsTag: string | null;
  status: string;
}

interface LandingEditorProps {
  landing: LandingData;
}

const inputClass =
  "w-full rounded-lg border border-border bg-bg-elevated px-4 py-3 text-text-100 placeholder:text-text-40 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition-colors";

const smallInputClass =
  "w-full rounded-lg border border-border bg-bg-elevated px-3 py-2 text-sm text-text-100 placeholder:text-text-40 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition-colors";

// ─── Component ──────────────────────────────────────────

export function LandingEditor({ landing }: LandingEditorProps) {
  const router = useRouter();
  const [blocks, setBlocks] = useState<BlockItem[]>(
    (landing.blocks || []).map((b, i) => ({ ...b, order: i })),
  );
  const [selectedBlockIndex, setSelectedBlockIndex] = useState<number | null>(null);
  const [configOpen, setConfigOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState("");

  // Config fields
  const [config, setConfig] = useState({
    campaignName: landing.campaignName,
    slug: landing.slug,
    serviceType: landing.serviceType || "",
    accentColor: landing.accentColor || "dev",
    metaTitle: landing.metaTitle || "",
    metaDescription: landing.metaDescription || "",
    ogImage: landing.ogImage || "",
    noindex: landing.noindex,
    formDestination: landing.formDestination || "",
    formWebhookUrl: landing.formWebhookUrl || "",
    whatsappMessage: landing.whatsappMessage || "",
    utmCampaign: landing.utmCampaign || "",
    utmSource: landing.utmSource || "",
    utmMedium: landing.utmMedium || "",
    pixelFacebook: landing.pixelFacebook,
    googleAdsTag: landing.googleAdsTag || "",
    status: landing.status,
  });

  // ─── Block operations ───────────────────────────────────

  const addBlock = useCallback(
    (type: BlockTypeKey) => {
      const blockDef = BLOCK_TYPES[type];
      const newBlock: BlockItem = {
        type,
        order: blocks.length,
        data: { ...blockDef.defaultData } as Record<string, unknown>,
      };
      const updated = [...blocks, newBlock];
      setBlocks(updated);
      setSelectedBlockIndex(updated.length - 1);
    },
    [blocks],
  );

  const removeBlock = useCallback(
    (index: number) => {
      const updated = blocks.filter((_, i) => i !== index).map((b, i) => ({ ...b, order: i }));
      setBlocks(updated);
      if (selectedBlockIndex === index) setSelectedBlockIndex(null);
      else if (selectedBlockIndex !== null && selectedBlockIndex > index) {
        setSelectedBlockIndex(selectedBlockIndex - 1);
      }
    },
    [blocks, selectedBlockIndex],
  );

  const moveBlock = useCallback(
    (index: number, direction: "up" | "down") => {
      const newIndex = direction === "up" ? index - 1 : index + 1;
      if (newIndex < 0 || newIndex >= blocks.length) return;
      const updated = [...blocks];
      const temp = updated[index];
      updated[index] = updated[newIndex];
      updated[newIndex] = temp;
      const reordered = updated.map((b, i) => ({ ...b, order: i }));
      setBlocks(reordered);
      if (selectedBlockIndex === index) setSelectedBlockIndex(newIndex);
      else if (selectedBlockIndex === newIndex) setSelectedBlockIndex(index);
    },
    [blocks, selectedBlockIndex],
  );

  const updateBlockData = useCallback((index: number, key: string, value: unknown) => {
    setBlocks((prev) =>
      prev.map((b, i) => (i === index ? { ...b, data: { ...b.data, [key]: value } } : b)),
    );
  }, []);

  // ─── Save ───────────────────────────────────────────────

  const handleSave = async () => {
    setSaving(true);
    setSaveMessage("");
    try {
      const res = await fetch(`/api/admin/landings/${landing.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...config,
          serviceType: config.serviceType || null,
          blocks,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Error al guardar");
      }

      setSaveMessage("Guardado correctamente");
      setTimeout(() => setSaveMessage(""), 3000);
    } catch (err) {
      setSaveMessage(err instanceof Error ? err.message : "Error al guardar");
    } finally {
      setSaving(false);
    }
  };

  const selectedBlock = selectedBlockIndex !== null ? blocks[selectedBlockIndex] : null;

  return (
    <div className="flex h-[calc(100vh-80px)] flex-col">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-border px-4 py-3">
        <div className="flex items-center gap-3">
          <Link
            href="/admin/landing-pages"
            className="flex items-center gap-1 text-text-40 hover:text-text-100 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <h1 className="text-lg font-bold">{config.campaignName}</h1>
          <span className="text-xs text-text-40">/lp/{config.slug}</span>
        </div>
        <div className="flex items-center gap-3">
          {saveMessage && (
            <span
              className={`text-sm ${saveMessage.includes("Error") ? "text-red-400" : "text-staffing"}`}
            >
              {saveMessage}
            </span>
          )}
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-bg-base hover:opacity-90 transition-opacity disabled:opacity-50"
          >
            <Save className="h-4 w-4" />
            {saving ? "Guardando..." : "Guardar"}
          </button>
        </div>
      </div>

      {/* Three columns */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left: Block Catalog */}
        <div className="w-[200px] shrink-0 overflow-y-auto border-r border-border bg-bg-base p-3">
          <h3 className="mb-3 text-xs font-semibold uppercase text-text-40">Bloques</h3>
          <div className="space-y-1">
            {(Object.keys(BLOCK_TYPES) as BlockTypeKey[]).map((key) => {
              const block = BLOCK_TYPES[key];
              return (
                <button
                  key={key}
                  onClick={() => addBlock(key)}
                  className="flex w-full items-center gap-2 rounded-lg px-2.5 py-2 text-left text-sm text-text-70 transition-colors hover:bg-bg-elevated hover:text-text-100"
                >
                  <Plus className="h-3 w-3 shrink-0 text-text-40" />
                  <span className="text-xs font-medium text-primary">{key}</span>
                  <span className="truncate text-xs">{block.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Center: Current Blocks */}
        <div className="flex-1 overflow-y-auto bg-bg-base p-4">
          <h3 className="mb-3 text-xs font-semibold uppercase text-text-40">
            Bloques de la landing ({blocks.length})
          </h3>
          {blocks.length === 0 ? (
            <div className="rounded-xl border border-dashed border-border p-8 text-center">
              <p className="text-sm text-text-40">
                No hay bloques. Usa el panel izquierdo para agregar bloques.
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              {blocks.map((block, index) => {
                const typeDef = BLOCK_TYPES[block.type as BlockTypeKey] || null;
                const isSelected = selectedBlockIndex === index;
                return (
                  <div
                    key={`${block.type}-${index}`}
                    className={`flex items-center gap-2 rounded-lg border p-3 transition-colors ${
                      isSelected
                        ? "border-primary bg-primary/5"
                        : "border-border bg-bg-surface hover:border-border"
                    }`}
                  >
                    <GripVertical className="h-4 w-4 shrink-0 text-text-40" />
                    <span className="w-6 text-center text-xs font-bold text-text-40">
                      {index + 1}
                    </span>
                    <span className="text-xs font-semibold text-primary">{block.type}</span>
                    <span className="flex-1 truncate text-sm text-text-70">
                      {typeDef?.label || block.type}
                    </span>

                    <div className="flex items-center gap-0.5">
                      <button
                        onClick={() => setSelectedBlockIndex(index)}
                        className="rounded p-1 text-text-40 hover:bg-bg-elevated hover:text-primary transition-colors"
                        title="Editar"
                      >
                        <Pencil className="h-3.5 w-3.5" />
                      </button>
                      <button
                        onClick={() => moveBlock(index, "up")}
                        disabled={index === 0}
                        className="rounded p-1 text-text-40 hover:bg-bg-elevated hover:text-text-100 disabled:opacity-30 transition-colors"
                        title="Subir"
                      >
                        <ChevronUp className="h-3.5 w-3.5" />
                      </button>
                      <button
                        onClick={() => moveBlock(index, "down")}
                        disabled={index === blocks.length - 1}
                        className="rounded p-1 text-text-40 hover:bg-bg-elevated hover:text-text-100 disabled:opacity-30 transition-colors"
                        title="Bajar"
                      >
                        <ChevronDown className="h-3.5 w-3.5" />
                      </button>
                      <button
                        onClick={() => removeBlock(index)}
                        className="rounded p-1 text-text-40 hover:bg-bg-elevated hover:text-red-400 transition-colors"
                        title="Eliminar"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Right: Block Editor + Config */}
        <div className="w-[360px] shrink-0 overflow-y-auto border-l border-border bg-bg-surface p-4">
          {/* Block editor */}
          {selectedBlock ? (
            <div className="mb-6">
              <h3 className="mb-3 text-sm font-semibold text-text-100">
                {BLOCK_TYPES[selectedBlock.type as BlockTypeKey]?.label || selectedBlock.type}{" "}
                <span className="text-text-40">#{(selectedBlockIndex ?? 0) + 1}</span>
              </h3>
              <BlockFieldEditor
                blockType={selectedBlock.type}
                data={selectedBlock.data}
                onChange={(key, value) => updateBlockData(selectedBlockIndex!, key, value)}
              />
            </div>
          ) : (
            <div className="mb-6 rounded-lg border border-dashed border-border p-4 text-center">
              <p className="text-xs text-text-40">Selecciona un bloque para editarlo</p>
            </div>
          )}

          {/* Config section (collapsible) */}
          <div className="border-t border-border pt-4">
            <button
              onClick={() => setConfigOpen(!configOpen)}
              className="flex w-full items-center justify-between py-2 text-sm font-semibold text-text-100"
            >
              Configuracion de la landing
              <ChevronRight
                className={`h-4 w-4 text-text-40 transition-transform ${configOpen ? "rotate-90" : ""}`}
              />
            </button>

            {configOpen && (
              <div className="mt-3 space-y-4">
                {/* Campaign Name */}
                <div>
                  <label className="mb-1 block text-xs font-medium text-text-70">
                    Nombre de campana
                  </label>
                  <input
                    type="text"
                    value={config.campaignName}
                    onChange={(e) =>
                      setConfig((p) => ({
                        ...p,
                        campaignName: e.target.value,
                      }))
                    }
                    className={smallInputClass}
                  />
                </div>

                {/* Slug */}
                <div>
                  <label className="mb-1 block text-xs font-medium text-text-70">Slug</label>
                  <input
                    type="text"
                    value={config.slug}
                    onChange={(e) => setConfig((p) => ({ ...p, slug: e.target.value }))}
                    className={smallInputClass}
                  />
                </div>

                {/* Service Type */}
                <div>
                  <label className="mb-1 block text-xs font-medium text-text-70">
                    Tipo de servicio
                  </label>
                  <select
                    value={config.serviceType}
                    onChange={(e) =>
                      setConfig((p) => ({
                        ...p,
                        serviceType: e.target.value,
                      }))
                    }
                    className={smallInputClass}
                  >
                    <option value="">Sin tipo</option>
                    <option value="ia">IA</option>
                    <option value="cloud">Cloud</option>
                    <option value="staffing">Staffing</option>
                    <option value="finops">FinOps</option>
                    <option value="dev">Desarrollo</option>
                  </select>
                </div>

                {/* Accent Color */}
                <div>
                  <label className="mb-1 block text-xs font-medium text-text-70">
                    Color de acento
                  </label>
                  <select
                    value={config.accentColor}
                    onChange={(e) =>
                      setConfig((p) => ({
                        ...p,
                        accentColor: e.target.value,
                      }))
                    }
                    className={smallInputClass}
                  >
                    <option value="ia">IA</option>
                    <option value="cloud">Cloud</option>
                    <option value="staffing">Staffing</option>
                    <option value="finops">FinOps</option>
                    <option value="dev">Desarrollo</option>
                  </select>
                </div>

                {/* Meta Title */}
                <div>
                  <label className="mb-1 flex items-center justify-between text-xs font-medium text-text-70">
                    Meta title
                    <span className="text-text-40">{config.metaTitle.length}/60</span>
                  </label>
                  <input
                    type="text"
                    value={config.metaTitle}
                    onChange={(e) =>
                      setConfig((p) => ({
                        ...p,
                        metaTitle: e.target.value,
                      }))
                    }
                    className={smallInputClass}
                    placeholder="Titulo para SEO"
                  />
                </div>

                {/* Meta Description */}
                <div>
                  <label className="mb-1 flex items-center justify-between text-xs font-medium text-text-70">
                    Meta description
                    <span className="text-text-40">{config.metaDescription.length}/160</span>
                  </label>
                  <textarea
                    value={config.metaDescription}
                    onChange={(e) =>
                      setConfig((p) => ({
                        ...p,
                        metaDescription: e.target.value,
                      }))
                    }
                    className={smallInputClass + " resize-none"}
                    rows={3}
                    placeholder="Descripcion para SEO"
                  />
                </div>

                {/* OG Image */}
                <div>
                  <label className="mb-1 block text-xs font-medium text-text-70">
                    OG Image URL
                  </label>
                  <input
                    type="text"
                    value={config.ogImage}
                    onChange={(e) => setConfig((p) => ({ ...p, ogImage: e.target.value }))}
                    className={smallInputClass}
                    placeholder="https://..."
                  />
                </div>

                {/* Noindex */}
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={config.noindex}
                    onChange={(e) =>
                      setConfig((p) => ({
                        ...p,
                        noindex: e.target.checked,
                      }))
                    }
                    className="rounded border-border"
                  />
                  <span className="text-xs text-text-70">noindex</span>
                </label>

                {/* Form Destination */}
                <div>
                  <label className="mb-1 block text-xs font-medium text-text-70">
                    Destino del formulario
                  </label>
                  <select
                    value={config.formDestination}
                    onChange={(e) =>
                      setConfig((p) => ({
                        ...p,
                        formDestination: e.target.value,
                      }))
                    }
                    className={smallInputClass}
                  >
                    <option value="">Sin destino</option>
                    <option value="webhook">Webhook</option>
                    <option value="email">Email</option>
                    <option value="hubspot">HubSpot</option>
                  </select>
                </div>

                {/* Webhook URL (conditional) */}
                {config.formDestination === "webhook" && (
                  <div>
                    <label className="mb-1 block text-xs font-medium text-text-70">
                      Webhook URL
                    </label>
                    <input
                      type="text"
                      value={config.formWebhookUrl}
                      onChange={(e) =>
                        setConfig((p) => ({
                          ...p,
                          formWebhookUrl: e.target.value,
                        }))
                      }
                      className={smallInputClass}
                      placeholder="https://..."
                    />
                  </div>
                )}

                {/* WhatsApp Message */}
                <div>
                  <label className="mb-1 block text-xs font-medium text-text-70">
                    Mensaje WhatsApp
                  </label>
                  <input
                    type="text"
                    value={config.whatsappMessage}
                    onChange={(e) =>
                      setConfig((p) => ({
                        ...p,
                        whatsappMessage: e.target.value,
                      }))
                    }
                    className={smallInputClass}
                    placeholder="Hola, me interesa..."
                  />
                </div>

                {/* UTMs */}
                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <label className="mb-1 block text-xs font-medium text-text-70">
                      UTM Campaign
                    </label>
                    <input
                      type="text"
                      value={config.utmCampaign}
                      onChange={(e) =>
                        setConfig((p) => ({
                          ...p,
                          utmCampaign: e.target.value,
                        }))
                      }
                      className={smallInputClass}
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-xs font-medium text-text-70">
                      UTM Source
                    </label>
                    <input
                      type="text"
                      value={config.utmSource}
                      onChange={(e) =>
                        setConfig((p) => ({
                          ...p,
                          utmSource: e.target.value,
                        }))
                      }
                      className={smallInputClass}
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-xs font-medium text-text-70">
                      UTM Medium
                    </label>
                    <input
                      type="text"
                      value={config.utmMedium}
                      onChange={(e) =>
                        setConfig((p) => ({
                          ...p,
                          utmMedium: e.target.value,
                        }))
                      }
                      className={smallInputClass}
                    />
                  </div>
                </div>

                {/* Pixel Facebook */}
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={config.pixelFacebook}
                    onChange={(e) =>
                      setConfig((p) => ({
                        ...p,
                        pixelFacebook: e.target.checked,
                      }))
                    }
                    className="rounded border-border"
                  />
                  <span className="text-xs text-text-70">Pixel Facebook</span>
                </label>

                {/* Google Ads Tag */}
                <div>
                  <label className="mb-1 block text-xs font-medium text-text-70">
                    Google Ads Tag
                  </label>
                  <input
                    type="text"
                    value={config.googleAdsTag}
                    onChange={(e) =>
                      setConfig((p) => ({
                        ...p,
                        googleAdsTag: e.target.value,
                      }))
                    }
                    className={smallInputClass}
                    placeholder="AW-XXXXXXXXX"
                  />
                </div>

                {/* Status */}
                <div>
                  <label className="mb-1 block text-xs font-medium text-text-70">Estado</label>
                  <select
                    value={config.status}
                    onChange={(e) => setConfig((p) => ({ ...p, status: e.target.value }))}
                    className={smallInputClass}
                  >
                    <option value="draft">Borrador</option>
                    <option value="published">Publicado</option>
                    <option value="archived">Archivado</option>
                  </select>
                </div>

                {/* Save button inside config */}
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="mt-2 w-full rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-bg-base hover:opacity-90 transition-opacity disabled:opacity-50"
                >
                  {saving ? "Guardando..." : "Guardar todo"}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Block Field Editor ─────────────────────────────────

interface BlockFieldEditorProps {
  blockType: string;
  data: Record<string, unknown>;
  onChange: (key: string, value: unknown) => void;
}

function BlockFieldEditor({ blockType, data, onChange }: BlockFieldEditorProps) {
  const smallInput =
    "w-full rounded-lg border border-border bg-bg-elevated px-3 py-2 text-sm text-text-100 placeholder:text-text-40 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition-colors";

  const renderTextField = (key: string, label: string, placeholder?: string) => (
    <div key={key}>
      <label className="mb-1 block text-xs font-medium text-text-70">{label}</label>
      <input
        type="text"
        value={(data[key] as string) || ""}
        onChange={(e) => onChange(key, e.target.value)}
        className={smallInput}
        placeholder={placeholder}
      />
    </div>
  );

  const renderTextArea = (key: string, label: string, rows?: number) => (
    <div key={key}>
      <label className="mb-1 block text-xs font-medium text-text-70">{label}</label>
      <textarea
        value={(data[key] as string) || ""}
        onChange={(e) => onChange(key, e.target.value)}
        className={smallInput + " resize-none"}
        rows={rows || 3}
      />
    </div>
  );

  const renderJsonField = (key: string, label: string) => (
    <div key={key}>
      <label className="mb-1 block text-xs font-medium text-text-70">{label} (JSON)</label>
      <textarea
        value={
          typeof data[key] === "string"
            ? (data[key] as string)
            : JSON.stringify(data[key] || [], null, 2)
        }
        onChange={(e) => {
          try {
            const parsed = JSON.parse(e.target.value);
            onChange(key, parsed);
          } catch {
            // Keep raw text while typing
            onChange(key, e.target.value);
          }
        }}
        className={smallInput + " resize-none font-mono text-xs"}
        rows={5}
      />
    </div>
  );

  const renderBooleanField = (key: string, label: string) => (
    <label key={key} className="flex items-center gap-2">
      <input
        type="checkbox"
        checked={!!data[key]}
        onChange={(e) => onChange(key, e.target.checked)}
        className="rounded border-border"
      />
      <span className="text-xs text-text-70">{label}</span>
    </label>
  );

  switch (blockType) {
    case "B01":
      return (
        <div className="space-y-3">
          {renderTextField("badge_text", "Badge text")}
          {renderTextField("h1", "Titulo H1")}
          {renderTextArea("subtitulo", "Subtitulo")}
          {renderTextField("cta_primario_texto", "CTA primario texto")}
          {renderTextField("cta_primario_url", "CTA primario URL")}
          {renderTextField("cta_secundario_texto", "CTA secundario texto")}
          {renderTextField("imagen_hero", "Imagen hero URL")}
        </div>
      );

    case "B02":
      return (
        <div className="space-y-3">
          {renderTextField("h1", "Titulo H1")}
          {renderTextArea("subtitulo", "Subtitulo")}
          {renderJsonField("campos_formulario", "Campos del formulario")}
          {renderTextField("cta_texto", "CTA texto")}
        </div>
      );

    case "B03":
      return (
        <div className="space-y-3">
          {renderTextField("titulo", "Titulo")}
          {renderJsonField("logos", "Logos (array de URLs)")}
        </div>
      );

    case "B04":
      return <div className="space-y-3">{renderJsonField("metricas", "Metricas")}</div>;

    case "B05":
      return (
        <div className="space-y-3">
          {renderTextField("titulo", "Titulo")}
          {renderJsonField("items", "Items de valor")}
        </div>
      );

    case "B06":
      return (
        <div className="space-y-3">
          {renderTextField("badge", "Badge")}
          {renderTextField("h2", "Titulo H2")}
          {renderTextArea("parrafo", "Parrafo")}
          {renderJsonField("bullets", "Bullets (array de strings)")}
          {renderTextField("imagen", "Imagen URL")}
          {renderTextField("cta_texto", "CTA texto")}
          {renderTextField("cta_url", "CTA URL")}
        </div>
      );

    case "B07":
      return (
        <div className="space-y-3">
          {renderTextField("titulo", "Titulo")}
          {renderJsonField("pasos", "Pasos")}
        </div>
      );

    case "B08":
      return (
        <div className="space-y-3">
          {renderTextField("caso_id", "ID del caso de exito")}
          <div>
            <label className="mb-1 block text-xs font-medium text-text-70">Modo</label>
            <select
              value={(data.modo as string) || "referencia"}
              onChange={(e) => onChange("modo", e.target.value)}
              className={smallInput}
            >
              <option value="referencia">Referencia</option>
              <option value="inline">Inline</option>
            </select>
          </div>
        </div>
      );

    case "B09":
      return (
        <div className="space-y-3">
          {renderTextArea("quote", "Cita")}
          {renderTextField("autor_nombre", "Nombre del autor")}
          {renderTextField("autor_cargo", "Cargo")}
          {renderTextField("autor_empresa", "Empresa")}
          {renderTextField("autor_foto", "Foto URL")}
        </div>
      );

    case "B10":
      return <div className="space-y-3">{renderJsonField("preguntas", "Preguntas FAQ")}</div>;

    case "B11":
      return (
        <div className="space-y-3">
          {renderTextArea("copy", "Copy")}
          {renderTextField("boton_texto", "Texto del boton")}
          {renderTextField("boton_url", "URL del boton")}
        </div>
      );

    case "B12":
      return (
        <div className="space-y-3">
          {renderTextField("titulo", "Titulo")}
          {renderTextArea("subtitulo", "Subtitulo")}
          {renderJsonField("campos", "Campos del formulario")}
          {renderTextField("cta_texto", "CTA texto")}
          {renderJsonField("trust_signals", "Trust signals")}
          <div>
            <label className="mb-1 block text-xs font-medium text-text-70">Destino</label>
            <select
              value={(data.form_destination as string) || "webhook"}
              onChange={(e) => onChange("form_destination", e.target.value)}
              className={smallInput}
            >
              <option value="webhook">Webhook</option>
              <option value="email">Email</option>
              <option value="hubspot">HubSpot</option>
            </select>
          </div>
          {renderTextField("webhook_url", "Webhook URL")}
        </div>
      );

    case "B13":
      return (
        <div className="space-y-3">
          {renderTextField("titulo", "Titulo")}
          {renderTextField("columna_nivelics_label", "Label Nivelics")}
          {renderTextField("columna_alternativa_label", "Label alternativa")}
          {renderJsonField("filas", "Filas de comparacion")}
        </div>
      );

    case "B14":
      return (
        <div className="space-y-3">
          {renderTextField("nicho_nombre", "Nombre del nicho")}
          {renderTextArea("copy_es", "Copy (ES)")}
          {renderTextField("icono_nicho", "Icono del nicho")}
        </div>
      );

    case "B15":
      return (
        <div className="space-y-3">
          {renderTextField("texto_antes", "Texto antes")}
          {renderTextField("texto_despues", "Texto despues")}
          {renderTextField("fecha_fin", "Fecha fin (ISO)")}
          {renderTextField("cta_texto", "CTA texto")}
          {renderTextField("cta_url", "CTA URL")}
        </div>
      );

    case "B16":
      return (
        <div className="space-y-3">
          {renderTextField("video_url", "URL del video")}
          {renderTextField("thumbnail", "Thumbnail URL")}
          {renderTextField("caption", "Caption")}
        </div>
      );

    case "B17":
      return (
        <div className="space-y-3">
          {renderTextField("titulo", "Titulo")}
          {renderJsonField("beneficios", "Beneficios")}
        </div>
      );

    case "B18":
      return (
        <div className="space-y-3">
          {renderBooleanField("mostrar_whatsapp", "Mostrar WhatsApp")}
          {renderTextField("whatsapp_numero", "Numero WhatsApp")}
          {renderTextField("whatsapp_mensaje", "Mensaje WhatsApp")}
        </div>
      );

    default:
      return (
        <div className="space-y-3">
          <p className="text-xs text-text-40">Tipo de bloque desconocido: {blockType}</p>
          {renderJsonField("_raw", "Datos (JSON)")}
        </div>
      );
  }
}
