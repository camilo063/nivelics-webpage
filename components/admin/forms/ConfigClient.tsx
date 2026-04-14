"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Save } from "lucide-react";
import { updateSiteConfig } from "@/lib/admin/actions/config.actions";
import { ImageUploader } from "@/components/admin/ui/ImageUploader";

const inputClass =
  "w-full rounded-lg border border-border bg-bg-elevated px-4 py-3 text-text-100 placeholder:text-text-40 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition-colors";

interface ConfigData {
  siteNameEs: string;
  siteNameEn: string;
  taglineEs: string;
  taglineEn: string;
  defaultOgImage: string;
  phoneWhatsapp: string;
  emailContact: string;
  addressBogota: string;
  addressMiami: string;
  linkedinUrl: string;
  googleAnalyticsId: string;
  googleTagManagerId: string;
  llmsTxtContent: string;
  llmsFullTxtContent: string;
}

const defaultConfig: ConfigData = {
  siteNameEs: "Nivelics",
  siteNameEn: "Nivelics",
  taglineEs: "",
  taglineEn: "",
  defaultOgImage: "",
  phoneWhatsapp: "+573103926621",
  emailContact: "contacto@nivelics.com",
  addressBogota: "",
  addressMiami: "",
  linkedinUrl: "",
  googleAnalyticsId: "",
  googleTagManagerId: "",
  llmsTxtContent: "",
  llmsFullTxtContent: "",
};

export default function ConfigClient({ initialData }: { initialData: Partial<ConfigData> | null }) {
  const router = useRouter();
  const [config, setConfig] = useState<ConfigData>({ ...defaultConfig, ...initialData });
  const [activeTab, setActiveTab] = useState<
    "sitio" | "contacto" | "integraciones" | "llms" | "revalidacion"
  >("sitio");
  const [saving, setSaving] = useState(false);

  function update<K extends keyof ConfigData>(key: K, value: ConfigData[K]) {
    setConfig((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSave() {
    setSaving(true);
    try {
      await updateSiteConfig(config);
      router.refresh();
    } finally {
      setSaving(false);
    }
  }

  async function handleRevalidate(scope: string) {
    await fetch("/api/admin/revalidate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-revalidation-secret": "dev-revalidation-secret-change-in-production",
      },
      body: JSON.stringify({ path: scope === "all" ? "/" : `/${scope}` }),
    });
    alert(`Revalidado: ${scope}`);
  }

  const tabs = [
    { key: "sitio" as const, label: "Sitio" },
    { key: "contacto" as const, label: "Contacto" },
    { key: "integraciones" as const, label: "Integraciones" },
    { key: "llms" as const, label: "llms.txt" },
    { key: "revalidacion" as const, label: "Revalidación" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex gap-1 rounded-lg border border-border bg-bg-elevated p-1 w-fit">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`rounded-md px-4 py-2 text-sm font-medium transition-colors ${
              activeTab === tab.key
                ? "bg-primary/10 text-primary"
                : "text-text-70 hover:text-text-100"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="rounded-xl border border-border bg-bg-surface p-6 space-y-6">
        {activeTab === "sitio" && (
          <>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="mb-2 block text-sm font-medium text-text-70">
                  Nombre del sitio ES
                </label>
                <input
                  value={config.siteNameEs}
                  onChange={(e) => update("siteNameEs", e.target.value)}
                  className={inputClass}
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-text-70">
                  Nombre del sitio EN
                </label>
                <input
                  value={config.siteNameEn}
                  onChange={(e) => update("siteNameEn", e.target.value)}
                  className={inputClass}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="mb-2 block text-sm font-medium text-text-70">Tagline ES</label>
                <input
                  value={config.taglineEs}
                  onChange={(e) => update("taglineEs", e.target.value)}
                  className={inputClass}
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-text-70">Tagline EN</label>
                <input
                  value={config.taglineEn}
                  onChange={(e) => update("taglineEn", e.target.value)}
                  className={inputClass}
                />
              </div>
            </div>
            <div>
              <ImageUploader
                value={config.defaultOgImage}
                onChange={(url) => update("defaultOgImage", url)}
                folder="og"
                label="OG Image por defecto"
                aspectRatio="16/9"
              />
            </div>
          </>
        )}

        {activeTab === "contacto" && (
          <>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="mb-2 block text-sm font-medium text-text-70">WhatsApp</label>
                <input
                  value={config.phoneWhatsapp}
                  onChange={(e) => update("phoneWhatsapp", e.target.value)}
                  className={inputClass}
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-text-70">Email</label>
                <input
                  value={config.emailContact}
                  onChange={(e) => update("emailContact", e.target.value)}
                  className={inputClass}
                />
              </div>
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-text-70">
                Dirección Bogotá
              </label>
              <textarea
                value={config.addressBogota}
                onChange={(e) => update("addressBogota", e.target.value)}
                rows={2}
                className={inputClass + " resize-none"}
              />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-text-70">Dirección Miami</label>
              <textarea
                value={config.addressMiami}
                onChange={(e) => update("addressMiami", e.target.value)}
                rows={2}
                className={inputClass + " resize-none"}
              />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-text-70">LinkedIn URL</label>
              <input
                value={config.linkedinUrl}
                onChange={(e) => update("linkedinUrl", e.target.value)}
                className={inputClass}
              />
            </div>
          </>
        )}

        {activeTab === "integraciones" && (
          <>
            <div>
              <label className="mb-2 block text-sm font-medium text-text-70">
                Google Analytics ID
              </label>
              <input
                value={config.googleAnalyticsId}
                onChange={(e) => update("googleAnalyticsId", e.target.value)}
                className={inputClass}
                placeholder="G-XXXXXXXXXX"
              />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-text-70">
                Google Tag Manager ID
              </label>
              <input
                value={config.googleTagManagerId}
                onChange={(e) => update("googleTagManagerId", e.target.value)}
                className={inputClass}
                placeholder="GTM-XXXXXXX"
              />
            </div>
          </>
        )}

        {activeTab === "llms" && (
          <>
            <div>
              <label className="mb-2 block text-sm font-medium text-text-70">llms.txt</label>
              <textarea
                value={config.llmsTxtContent}
                onChange={(e) => update("llmsTxtContent", e.target.value)}
                rows={12}
                className={inputClass + " resize-none font-mono text-sm"}
                placeholder="# Nivelics&#10;&#10;> Transformación digital B2B..."
              />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-text-70">llms-full.txt</label>
              <textarea
                value={config.llmsFullTxtContent}
                onChange={(e) => update("llmsFullTxtContent", e.target.value)}
                rows={16}
                className={inputClass + " resize-none font-mono text-sm"}
              />
            </div>
            <p className="text-xs text-text-40">
              Al guardar, se actualizan los archivos /llms.txt y /llms-full.txt del sitio.
            </p>
          </>
        )}

        {activeTab === "revalidacion" && (
          <div className="space-y-4">
            <p className="text-sm text-text-70">
              Forzar la regeneración del caché de las páginas públicas.
            </p>
            <div className="flex flex-wrap gap-3">
              {["all", "blog", "servicios", "industrias", "casos-de-exito"].map((scope) => (
                <button
                  key={scope}
                  onClick={() => handleRevalidate(scope)}
                  className="rounded-lg border border-border px-4 py-2.5 text-sm font-medium text-text-70 hover:border-primary hover:text-primary transition-colors"
                >
                  Revalidar {scope === "all" ? "TODO el sitio" : scope}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {activeTab !== "revalidacion" && (
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 rounded-lg bg-primary px-6 py-2.5 text-sm font-semibold text-bg-base hover:opacity-90 disabled:opacity-50"
        >
          <Save className="h-4 w-4" /> {saving ? "Guardando..." : "Guardar configuración"}
        </button>
      )}
    </div>
  );
}
