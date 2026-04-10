"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

const inputClass =
  "w-full rounded-lg border border-border bg-bg-elevated px-4 py-3 text-text-100 placeholder:text-text-40 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition-colors";

export default function NuevaLandingPagePage() {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    campaignName: "",
    slug: "",
    serviceType: "" as string,
    accentColor: "dev" as string,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError("");

    try {
      const res = await fetch("/api/admin/landings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          campaignName: form.campaignName,
          slug: form.slug,
          serviceType: form.serviceType || null,
          accentColor: form.accentColor || "dev",
          blocks: [],
          status: "draft",
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Error al crear landing");
      }

      const landing = await res.json();
      router.push(`/admin/landing-pages/${landing.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error desconocido");
      setSaving(false);
    }
  };

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .replace(/^-|-$/g, "");
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link
          href="/admin/landing-pages"
          className="flex items-center gap-1 text-text-70 hover:text-text-100 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Volver
        </Link>
        <h1 className="text-2xl font-bold">Nueva Landing Page</h1>
      </div>

      <form
        onSubmit={handleSubmit}
        className="max-w-xl space-y-6 rounded-xl border border-border bg-bg-surface p-6"
      >
        {error && (
          <div className="rounded-lg border border-red-500/20 bg-red-500/10 p-3 text-sm text-red-400">
            {error}
          </div>
        )}

        <div>
          <label className="mb-2 block text-sm font-medium text-text-70">Nombre de campana *</label>
          <input
            type="text"
            value={form.campaignName}
            onChange={(e) => {
              const name = e.target.value;
              setForm((prev) => ({
                ...prev,
                campaignName: name,
                slug: prev.slug || generateSlug(name),
              }));
            }}
            className={inputClass}
            placeholder="Ej: Black Friday IA 2026"
            required
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-text-70">Slug *</label>
          <div className="flex items-center gap-2">
            <span className="text-sm text-text-40">/lp/</span>
            <input
              type="text"
              value={form.slug}
              onChange={(e) => setForm((prev) => ({ ...prev, slug: e.target.value }))}
              className={inputClass}
              placeholder="black-friday-ia-2026"
              required
            />
          </div>
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-text-70">Tipo de servicio</label>
          <select
            value={form.serviceType}
            onChange={(e) => setForm((prev) => ({ ...prev, serviceType: e.target.value }))}
            className={inputClass}
          >
            <option value="">Sin tipo</option>
            <option value="ia">IA</option>
            <option value="cloud">Cloud</option>
            <option value="staffing">Staffing</option>
            <option value="finops">FinOps</option>
            <option value="dev">Desarrollo</option>
          </select>
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-text-70">Color de acento</label>
          <select
            value={form.accentColor}
            onChange={(e) => setForm((prev) => ({ ...prev, accentColor: e.target.value }))}
            className={inputClass}
          >
            <option value="ia">IA</option>
            <option value="cloud">Cloud</option>
            <option value="staffing">Staffing</option>
            <option value="finops">FinOps</option>
            <option value="dev">Desarrollo</option>
          </select>
        </div>

        <button
          type="submit"
          disabled={saving || !form.campaignName || !form.slug}
          className="rounded-lg bg-primary px-6 py-2.5 text-sm font-semibold text-bg-base hover:opacity-90 transition-opacity disabled:opacity-50"
        >
          {saving ? "Creando..." : "Crear y editar"}
        </button>
      </form>
    </div>
  );
}
