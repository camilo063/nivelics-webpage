"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, Trash2, Save, ChevronDown, ChevronRight } from "lucide-react";
import {
  updateMegaMenu,
  updateFooter,
  type MegaMenuSection,
  type MegaMenuColumn,
  type FooterData,
  type NavItem,
} from "@/lib/admin/actions/navegacion.actions";

const inputClass =
  "w-full rounded-lg border border-border bg-bg-elevated px-4 py-3 text-text-100 placeholder:text-text-40 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition-colors";
const smallInputClass =
  "w-full rounded-lg border border-border bg-bg-elevated px-3 py-2 text-sm text-text-100 placeholder:text-text-40 focus:border-primary focus:outline-none";
const labelClass = "mb-1 block text-xs text-text-40";

// ─── NavItem editor: labels, url, urlEn, description, aria-label, icon, badge ───

function NavItemEditor({
  item,
  onChange,
  onRemove,
}: {
  item: NavItem;
  onChange: (item: NavItem) => void;
  onRemove: () => void;
}) {
  const [showAdvanced, setShowAdvanced] = useState(false);

  return (
    <div className="space-y-2 rounded-lg border border-border/50 bg-bg-base/50 p-3">
      <div className="grid grid-cols-[1fr_1fr_1fr_auto] gap-2 items-end">
        <div>
          <label className={labelClass}>Label ES</label>
          <input
            value={item.labelEs}
            onChange={(e) => onChange({ ...item, labelEs: e.target.value })}
            className={smallInputClass}
          />
        </div>
        <div>
          <label className={labelClass}>Label EN</label>
          <input
            value={item.labelEn}
            onChange={(e) => onChange({ ...item, labelEn: e.target.value })}
            className={smallInputClass}
          />
        </div>
        <div>
          <label className={labelClass}>URL</label>
          <input
            value={item.url}
            onChange={(e) => onChange({ ...item, url: e.target.value })}
            placeholder="/servicios/..."
            className={smallInputClass}
          />
        </div>
        <button
          type="button"
          onClick={onRemove}
          className="rounded-lg p-2 text-text-40 hover:bg-red-500/10 hover:text-red-400"
          aria-label="Eliminar ítem"
        >
          <Trash2 className="h-4 w-4" />
        </button>
      </div>

      <div className="grid grid-cols-2 gap-2">
        <div>
          <label className={labelClass}>Descripción ES (opcional)</label>
          <input
            value={item.descriptionEs ?? ""}
            onChange={(e) => onChange({ ...item, descriptionEs: e.target.value })}
            placeholder="Aparece bajo el label"
            className={smallInputClass}
          />
        </div>
        <div>
          <label className={labelClass}>Descripción EN (opcional)</label>
          <input
            value={item.descriptionEn ?? ""}
            onChange={(e) => onChange({ ...item, descriptionEn: e.target.value })}
            placeholder="Shown under the label"
            className={smallInputClass}
          />
        </div>
      </div>

      <button
        type="button"
        onClick={() => setShowAdvanced((s) => !s)}
        className="flex items-center gap-1 text-xs font-medium text-text-40 hover:text-text-70"
      >
        {showAdvanced ? <ChevronDown className="h-3 w-3" /> : <ChevronRight className="h-3 w-3" />}
        Avanzado (URL EN, aria-label, icono, badge)
      </button>

      {showAdvanced && (
        <div className="space-y-2 border-t border-border/50 pt-2">
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className={labelClass}>URL EN (si slug difiere)</label>
              <input
                value={item.urlEn ?? ""}
                onChange={(e) => onChange({ ...item, urlEn: e.target.value })}
                placeholder="/en/services/..."
                className={smallInputClass}
              />
            </div>
            <div>
              <label className={labelClass}>Icono (nombre, opcional)</label>
              <input
                value={item.icon ?? ""}
                onChange={(e) => onChange({ ...item, icon: e.target.value })}
                placeholder="brain | cloud | trending-up ..."
                className={smallInputClass}
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className={labelClass}>aria-label ES (accesibilidad)</label>
              <input
                value={item.ariaLabelEs ?? ""}
                onChange={(e) => onChange({ ...item, ariaLabelEs: e.target.value })}
                className={smallInputClass}
              />
            </div>
            <div>
              <label className={labelClass}>aria-label EN</label>
              <input
                value={item.ariaLabelEn ?? ""}
                onChange={(e) => onChange({ ...item, ariaLabelEn: e.target.value })}
                className={smallInputClass}
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className={labelClass}>Badge ES (opcional, ej: &ldquo;Nuevo&rdquo;)</label>
              <input
                value={item.badgeEs ?? ""}
                onChange={(e) => onChange({ ...item, badgeEs: e.target.value })}
                className={smallInputClass}
              />
            </div>
            <div>
              <label className={labelClass}>Badge EN (optional, e.g. &ldquo;New&rdquo;)</label>
              <input
                value={item.badgeEn ?? ""}
                onChange={(e) => onChange({ ...item, badgeEn: e.target.value })}
                className={smallInputClass}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── MegaMenuColumn editor: title, url, icon, color, description, metric, items ───

function MegaMenuColumnEditor({
  column,
  onChange,
  onRemove,
}: {
  column: MegaMenuColumn;
  onChange: (column: MegaMenuColumn) => void;
  onRemove: () => void;
}) {
  return (
    <div className="rounded-lg border border-primary/20 bg-primary/5 p-4 space-y-3">
      <div className="flex items-start justify-between gap-3">
        <div className="grid grid-cols-2 gap-2 flex-1">
          <div>
            <label className={labelClass}>Título columna ES</label>
            <input
              value={column.titleEs}
              onChange={(e) => onChange({ ...column, titleEs: e.target.value })}
              className={smallInputClass}
            />
          </div>
          <div>
            <label className={labelClass}>Título columna EN</label>
            <input
              value={column.titleEn}
              onChange={(e) => onChange({ ...column, titleEn: e.target.value })}
              className={smallInputClass}
            />
          </div>
        </div>
        <button
          type="button"
          onClick={onRemove}
          className="rounded-lg p-2 text-text-40 hover:bg-red-500/10 hover:text-red-400 shrink-0"
          aria-label="Eliminar columna"
        >
          <Trash2 className="h-4 w-4" />
        </button>
      </div>

      <div className="grid grid-cols-3 gap-2">
        <div>
          <label className={labelClass}>URL</label>
          <input
            value={column.url}
            onChange={(e) => onChange({ ...column, url: e.target.value })}
            className={smallInputClass}
          />
        </div>
        <div>
          <label className={labelClass}>Icono (nombre lucide)</label>
          <input
            value={column.icon ?? ""}
            onChange={(e) => onChange({ ...column, icon: e.target.value })}
            placeholder="brain | cloud | users | code2"
            className={smallInputClass}
          />
        </div>
        <div>
          <label className={labelClass}>Color (hex)</label>
          <input
            value={column.color ?? ""}
            onChange={(e) => onChange({ ...column, color: e.target.value })}
            placeholder="#8B5CF6"
            className={`${smallInputClass} font-mono`}
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2">
        <div>
          <label className={labelClass}>Descripción ES</label>
          <input
            value={column.descriptionEs ?? ""}
            onChange={(e) => onChange({ ...column, descriptionEs: e.target.value })}
            className={smallInputClass}
          />
        </div>
        <div>
          <label className={labelClass}>Descripción EN</label>
          <input
            value={column.descriptionEn ?? ""}
            onChange={(e) => onChange({ ...column, descriptionEn: e.target.value })}
            className={smallInputClass}
          />
        </div>
      </div>

      <div className="grid grid-cols-3 gap-2">
        <div>
          <label className={labelClass}>Métrica — Valor</label>
          <input
            value={column.metricValue ?? ""}
            onChange={(e) => onChange({ ...column, metricValue: e.target.value })}
            placeholder="40%"
            className={`${smallInputClass} font-mono`}
          />
        </div>
        <div>
          <label className={labelClass}>Métrica — Label ES</label>
          <input
            value={column.metricLabelEs ?? ""}
            onChange={(e) => onChange({ ...column, metricLabelEs: e.target.value })}
            className={smallInputClass}
          />
        </div>
        <div>
          <label className={labelClass}>Métrica — Label EN</label>
          <input
            value={column.metricLabelEn ?? ""}
            onChange={(e) => onChange({ ...column, metricLabelEn: e.target.value })}
            className={smallInputClass}
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2">
        <div>
          <label className={labelClass}>Footer link ES (&ldquo;Ver todo...&rdquo;)</label>
          <input
            value={column.footerLinkEs ?? ""}
            onChange={(e) => onChange({ ...column, footerLinkEs: e.target.value })}
            className={smallInputClass}
          />
        </div>
        <div>
          <label className={labelClass}>Footer link EN</label>
          <input
            value={column.footerLinkEn ?? ""}
            onChange={(e) => onChange({ ...column, footerLinkEn: e.target.value })}
            className={smallInputClass}
          />
        </div>
      </div>

      <div className="border-t border-primary/15 pt-3 space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-text-70">Sub-ítems</span>
          <button
            type="button"
            onClick={() =>
              onChange({
                ...column,
                items: [...column.items, { labelEs: "", labelEn: "", url: "" }],
              })
            }
            className="flex items-center gap-1 text-xs font-medium text-primary hover:text-primary/80"
          >
            <Plus className="h-3 w-3" /> Agregar sub-ítem
          </button>
        </div>
        {column.items.map((item, iIdx) => (
          <NavItemEditor
            key={iIdx}
            item={item}
            onChange={(updated) => {
              const newItems = [...column.items];
              newItems[iIdx] = updated;
              onChange({ ...column, items: newItems });
            }}
            onRemove={() => {
              onChange({
                ...column,
                items: column.items.filter((_, i) => i !== iIdx),
              });
            }}
          />
        ))}
      </div>
    </div>
  );
}

// ─── MegaMenuSection header (kind, triggerUrl, headerCaption, footerLink, accentColor) ───

const SECTION_KINDS: Array<{ value: NonNullable<MegaMenuSection["kind"]>; label: string }> = [
  { value: "columns", label: "Columns (4 sub-menús con columnas)" },
  { value: "grid", label: "Grid (items en grid 3x2, ej. Industrias)" },
  { value: "products", label: "Products (3 cards, ej. Productos)" },
  { value: "nosotros", label: "Nosotros (items + credentials block)" },
  { value: "simple", label: "Simple (solo link top-level, sin panel)" },
];

function SectionHeaderEditor({
  section,
  onChange,
}: {
  section: MegaMenuSection;
  onChange: (section: MegaMenuSection) => void;
}) {
  return (
    <div className="space-y-3">
      <div className="grid grid-cols-[2fr_2fr_1fr] gap-3">
        <div>
          <label className={labelClass}>Título trigger ES</label>
          <input
            value={section.titleEs}
            onChange={(e) => onChange({ ...section, titleEs: e.target.value })}
            className={smallInputClass}
          />
        </div>
        <div>
          <label className={labelClass}>Título trigger EN</label>
          <input
            value={section.titleEn}
            onChange={(e) => onChange({ ...section, titleEn: e.target.value })}
            className={smallInputClass}
          />
        </div>
        <div>
          <label className={labelClass}>Tipo de panel</label>
          <select
            value={section.kind ?? "simple"}
            onChange={(e) =>
              onChange({
                ...section,
                kind: e.target.value as NonNullable<MegaMenuSection["kind"]>,
              })
            }
            className={smallInputClass}
          >
            {SECTION_KINDS.map((k) => (
              <option key={k.value} value={k.value}>
                {k.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className={labelClass}>URL del trigger (hub landing)</label>
          <input
            value={section.triggerUrl ?? ""}
            onChange={(e) => onChange({ ...section, triggerUrl: e.target.value })}
            placeholder="/servicios"
            className={smallInputClass}
          />
        </div>
        <div>
          <label className={labelClass}>Accent color (para grid/nosotros)</label>
          <input
            value={section.accentColor ?? ""}
            onChange={(e) => onChange({ ...section, accentColor: e.target.value })}
            placeholder="#F59E0B"
            className={`${smallInputClass} font-mono`}
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className={labelClass}>Encabezado del panel ES (opcional)</label>
          <input
            value={section.headerCaptionEs ?? ""}
            onChange={(e) => onChange({ ...section, headerCaptionEs: e.target.value })}
            placeholder="Industrias que atendemos"
            className={smallInputClass}
          />
        </div>
        <div>
          <label className={labelClass}>Panel header caption EN (optional)</label>
          <input
            value={section.headerCaptionEn ?? ""}
            onChange={(e) => onChange({ ...section, headerCaptionEn: e.target.value })}
            placeholder="Industries we serve"
            className={smallInputClass}
          />
        </div>
      </div>

      <div className="grid grid-cols-[2fr_2fr_2fr_1fr] gap-3">
        <div>
          <label className={labelClass}>Footer link ES</label>
          <input
            value={section.footerLinkEs ?? ""}
            onChange={(e) => onChange({ ...section, footerLinkEs: e.target.value })}
            placeholder="Ver todas las industrias →"
            className={smallInputClass}
          />
        </div>
        <div>
          <label className={labelClass}>Footer link EN</label>
          <input
            value={section.footerLinkEn ?? ""}
            onChange={(e) => onChange({ ...section, footerLinkEn: e.target.value })}
            placeholder="See all industries →"
            className={smallInputClass}
          />
        </div>
        <div>
          <label className={labelClass}>Footer URL</label>
          <input
            value={section.footerLinkUrl ?? ""}
            onChange={(e) => onChange({ ...section, footerLinkUrl: e.target.value })}
            className={smallInputClass}
          />
        </div>
        <div>
          <label className={labelClass}>Color</label>
          <input
            value={section.footerLinkColor ?? ""}
            onChange={(e) => onChange({ ...section, footerLinkColor: e.target.value })}
            placeholder="#F59E0B"
            className={`${smallInputClass} font-mono`}
          />
        </div>
      </div>

      {section.kind === "nosotros" && (
        <NosotrosCredentialsEditor section={section} onChange={onChange} />
      )}
    </div>
  );
}

// ─── Credentials block editor (only for kind='nosotros') ───

function NosotrosCredentialsEditor({
  section,
  onChange,
}: {
  section: MegaMenuSection;
  onChange: (section: MegaMenuSection) => void;
}) {
  const c = section.credentials ?? {};
  function updateCredentials(patch: Partial<typeof c>) {
    onChange({ ...section, credentials: { ...c, ...patch } });
  }
  return (
    <div className="rounded-lg border border-border/50 bg-bg-base/50 p-3 space-y-3">
      <h4 className="text-xs font-semibold text-text-70">Bloque de credenciales (Nosotros)</h4>

      <div className="grid grid-cols-[1fr_2fr_2fr] gap-2">
        <div>
          <label className={labelClass}>Métrica 1 — Valor</label>
          <input
            value={c.metricValue1 ?? ""}
            onChange={(e) => updateCredentials({ metricValue1: e.target.value })}
            placeholder="13"
            className={`${smallInputClass} font-mono`}
          />
        </div>
        <div>
          <label className={labelClass}>Métrica 1 — Label ES</label>
          <input
            value={c.metricLabelEs1 ?? ""}
            onChange={(e) => updateCredentials({ metricLabelEs1: e.target.value })}
            className={smallInputClass}
          />
        </div>
        <div>
          <label className={labelClass}>Métrica 1 — Label EN</label>
          <input
            value={c.metricLabelEn1 ?? ""}
            onChange={(e) => updateCredentials({ metricLabelEn1: e.target.value })}
            className={smallInputClass}
          />
        </div>
      </div>

      <div className="grid grid-cols-[1fr_2fr_2fr] gap-2">
        <div>
          <label className={labelClass}>Métrica 2 — Valor</label>
          <input
            value={c.metricValue2 ?? ""}
            onChange={(e) => updateCredentials({ metricValue2: e.target.value })}
            placeholder="7+"
            className={`${smallInputClass} font-mono`}
          />
        </div>
        <div>
          <label className={labelClass}>Métrica 2 — Label ES</label>
          <input
            value={c.metricLabelEs2 ?? ""}
            onChange={(e) => updateCredentials({ metricLabelEs2: e.target.value })}
            className={smallInputClass}
          />
        </div>
        <div>
          <label className={labelClass}>Métrica 2 — Label EN</label>
          <input
            value={c.metricLabelEn2 ?? ""}
            onChange={(e) => updateCredentials({ metricLabelEn2: e.target.value })}
            className={smallInputClass}
          />
        </div>
      </div>

      <div className="grid grid-cols-3 gap-2">
        <div>
          <label className={labelClass}>Premio (texto)</label>
          <input
            value={c.awardName ?? ""}
            onChange={(e) => updateCredentials({ awardName: e.target.value })}
            placeholder="Great Place to Work"
            className={smallInputClass}
          />
        </div>
        <div>
          <label className={labelClass}>Caption premio ES</label>
          <input
            value={c.awardCaptionEs ?? ""}
            onChange={(e) => updateCredentials({ awardCaptionEs: e.target.value })}
            placeholder="Colombia · 2022"
            className={smallInputClass}
          />
        </div>
        <div>
          <label className={labelClass}>Caption premio EN</label>
          <input
            value={c.awardCaptionEn ?? ""}
            onChange={(e) => updateCredentials({ awardCaptionEn: e.target.value })}
            className={smallInputClass}
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2">
        <div>
          <label className={labelClass}>Texto al pie ES</label>
          <input
            value={c.footerCaptionEs ?? ""}
            onChange={(e) => updateCredentials({ footerCaptionEs: e.target.value })}
            placeholder="Empresa colombiana · Sede en Miami"
            className={smallInputClass}
          />
        </div>
        <div>
          <label className={labelClass}>Texto al pie EN</label>
          <input
            value={c.footerCaptionEn ?? ""}
            onChange={(e) => updateCredentials({ footerCaptionEn: e.target.value })}
            className={smallInputClass}
          />
        </div>
      </div>

      <div className="grid grid-cols-[1fr_1fr_1fr] gap-2">
        <div>
          <label className={labelClass}>CTA texto ES</label>
          <input
            value={c.ctaTextEs ?? ""}
            onChange={(e) => updateCredentials({ ctaTextEs: e.target.value })}
            placeholder="Conoce nuestra historia →"
            className={smallInputClass}
          />
        </div>
        <div>
          <label className={labelClass}>CTA texto EN</label>
          <input
            value={c.ctaTextEn ?? ""}
            onChange={(e) => updateCredentials({ ctaTextEn: e.target.value })}
            className={smallInputClass}
          />
        </div>
        <div>
          <label className={labelClass}>CTA URL</label>
          <input
            value={c.ctaUrl ?? ""}
            onChange={(e) => updateCredentials({ ctaUrl: e.target.value })}
            className={smallInputClass}
          />
        </div>
      </div>
    </div>
  );
}

// ─── Main component ───

export default function NavegacionClient({
  initialMegaMenu,
  initialFooter,
}: {
  initialMegaMenu: MegaMenuSection[];
  initialFooter: FooterData;
}) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"megamenu" | "footer">("megamenu");
  const [megaMenu, setMegaMenu] = useState<MegaMenuSection[]>(initialMegaMenu);
  const [footer, setFooter] = useState<FooterData>(initialFooter);
  const [saving, setSaving] = useState(false);

  function updateSection(idx: number, section: MegaMenuSection) {
    setMegaMenu((prev) => prev.map((s, i) => (i === idx ? section : s)));
  }

  function addSection() {
    setMegaMenu((prev) => [
      ...prev,
      { titleEs: "Nueva sección", titleEn: "New section", kind: "simple", items: [] },
    ]);
  }

  function removeSection(idx: number) {
    setMegaMenu((prev) => prev.filter((_, i) => i !== idx));
  }

  function updateFooterColumn(idx: number, col: (typeof footer.columns)[number]) {
    setFooter((prev) => ({ ...prev, columns: prev.columns.map((c, i) => (i === idx ? col : c)) }));
  }

  function addFooterColumn() {
    setFooter((prev) => ({
      ...prev,
      columns: [...prev.columns, { titleEs: "Nueva columna", titleEn: "New column", links: [] }],
    }));
  }

  async function handleSaveMegaMenu() {
    setSaving(true);
    try {
      await updateMegaMenu(megaMenu);
      router.refresh();
    } finally {
      setSaving(false);
    }
  }

  async function handleSaveFooter() {
    setSaving(true);
    try {
      await updateFooter(footer);
      router.refresh();
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-6">
      {/* Tabs */}
      <div className="flex gap-1 rounded-lg border border-border bg-bg-elevated p-1 w-fit">
        {(["megamenu", "footer"] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`rounded-md px-4 py-2 text-sm font-medium transition-colors ${
              activeTab === tab ? "bg-primary/10 text-primary" : "text-text-70 hover:text-text-100"
            }`}
          >
            {tab === "megamenu" ? "Mega Menú" : "Footer"}
          </button>
        ))}
      </div>

      {activeTab === "megamenu" && (
        <div className="space-y-6">
          {megaMenu.map((section, sIdx) => (
            <div key={sIdx} className="rounded-xl border border-border bg-bg-surface p-6 space-y-4">
              <div className="flex items-start justify-between">
                <div className="flex-1 mr-4">
                  <SectionHeaderEditor
                    section={section}
                    onChange={(updated) => updateSection(sIdx, updated)}
                  />
                </div>
                <button
                  onClick={() => removeSection(sIdx)}
                  className="rounded-lg p-2 text-text-40 hover:bg-red-500/10 hover:text-red-400 shrink-0"
                  aria-label="Eliminar sección"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>

              {/* Columns (solo si kind='columns') */}
              {section.kind === "columns" && (
                <div className="border-t border-border pt-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-semibold text-text-100">Columnas del panel</h4>
                    <button
                      onClick={() =>
                        updateSection(sIdx, {
                          ...section,
                          columns: [
                            ...(section.columns ?? []),
                            { titleEs: "", titleEn: "", url: "", items: [] },
                          ],
                        })
                      }
                      className="flex items-center gap-1.5 text-xs font-medium text-primary hover:text-primary/80"
                    >
                      <Plus className="h-3.5 w-3.5" /> Agregar columna
                    </button>
                  </div>
                  {(section.columns ?? []).map((col, cIdx) => (
                    <MegaMenuColumnEditor
                      key={cIdx}
                      column={col}
                      onChange={(updated) => {
                        const newCols = [...(section.columns ?? [])];
                        newCols[cIdx] = updated;
                        updateSection(sIdx, { ...section, columns: newCols });
                      }}
                      onRemove={() => {
                        updateSection(sIdx, {
                          ...section,
                          columns: (section.columns ?? []).filter((_, i) => i !== cIdx),
                        });
                      }}
                    />
                  ))}
                </div>
              )}

              {/* Items flat list (para grid / products / nosotros / simple) */}
              {section.kind !== "columns" && (
                <div className="border-t border-border pt-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-semibold text-text-100">Ítems</h4>
                    <button
                      onClick={() =>
                        updateSection(sIdx, {
                          ...section,
                          items: [...section.items, { labelEs: "", labelEn: "", url: "" }],
                        })
                      }
                      className="flex items-center gap-1.5 text-xs font-medium text-primary hover:text-primary/80"
                    >
                      <Plus className="h-3.5 w-3.5" /> Agregar ítem
                    </button>
                  </div>
                  {section.items.map((item, iIdx) => (
                    <NavItemEditor
                      key={iIdx}
                      item={item}
                      onChange={(updated) => {
                        const newItems = [...section.items];
                        newItems[iIdx] = updated;
                        updateSection(sIdx, { ...section, items: newItems });
                      }}
                      onRemove={() => {
                        updateSection(sIdx, {
                          ...section,
                          items: section.items.filter((_, i) => i !== iIdx),
                        });
                      }}
                    />
                  ))}
                </div>
              )}
            </div>
          ))}

          <button
            onClick={addSection}
            className="flex items-center gap-2 rounded-lg border border-dashed border-border px-4 py-3 text-sm text-text-40 hover:border-primary hover:text-primary transition-colors w-full justify-center"
          >
            <Plus className="h-4 w-4" /> Agregar sección
          </button>

          <button
            onClick={handleSaveMegaMenu}
            disabled={saving}
            className="flex items-center gap-2 rounded-lg bg-primary px-6 py-2.5 text-sm font-semibold text-bg-base hover:opacity-90 disabled:opacity-50"
          >
            <Save className="h-4 w-4" /> {saving ? "Guardando..." : "Guardar Mega Menú"}
          </button>
        </div>
      )}

      {activeTab === "footer" && (
        <div className="space-y-6">
          {/* Brand block */}
          <div className="rounded-xl border border-border bg-bg-surface p-6 space-y-4">
            <h3 className="text-sm font-semibold text-text-100">Columna de marca (izquierda)</h3>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className={labelClass}>Tagline ES</label>
                <textarea
                  rows={2}
                  value={footer.brandTaglineEs ?? ""}
                  onChange={(e) => setFooter((p) => ({ ...p, brandTaglineEs: e.target.value }))}
                  className={inputClass}
                />
              </div>
              <div>
                <label className={labelClass}>Tagline EN</label>
                <textarea
                  rows={2}
                  value={footer.brandTaglineEn ?? ""}
                  onChange={(e) => setFooter((p) => ({ ...p, brandTaglineEn: e.target.value }))}
                  className={inputClass}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className={labelClass}>LinkedIn URL</label>
                <input
                  value={footer.socialLinkedin ?? ""}
                  onChange={(e) => setFooter((p) => ({ ...p, socialLinkedin: e.target.value }))}
                  className={smallInputClass}
                />
              </div>
              <div>
                <label className={labelClass}>Instagram URL</label>
                <input
                  value={footer.socialInstagram ?? ""}
                  onChange={(e) => setFooter((p) => ({ ...p, socialInstagram: e.target.value }))}
                  className={smallInputClass}
                />
              </div>
              <div>
                <label className={labelClass}>YouTube URL</label>
                <input
                  value={footer.socialYoutube ?? ""}
                  onChange={(e) => setFooter((p) => ({ ...p, socialYoutube: e.target.value }))}
                  className={smallInputClass}
                />
              </div>
              <div>
                <label className={labelClass}>Twitter URL</label>
                <input
                  value={footer.socialTwitter ?? ""}
                  onChange={(e) => setFooter((p) => ({ ...p, socialTwitter: e.target.value }))}
                  className={smallInputClass}
                />
              </div>
            </div>
          </div>

          {/* Contact block */}
          <div className="rounded-xl border border-border bg-bg-surface p-6 space-y-4">
            <h3 className="text-sm font-semibold text-text-100">Columna de Contacto (derecha)</h3>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className={labelClass}>Título columna ES</label>
                <input
                  value={footer.contactColumnTitleEs ?? ""}
                  onChange={(e) =>
                    setFooter((p) => ({ ...p, contactColumnTitleEs: e.target.value }))
                  }
                  placeholder="Contacto"
                  className={smallInputClass}
                />
              </div>
              <div>
                <label className={labelClass}>Título columna EN</label>
                <input
                  value={footer.contactColumnTitleEn ?? ""}
                  onChange={(e) =>
                    setFooter((p) => ({ ...p, contactColumnTitleEn: e.target.value }))
                  }
                  placeholder="Contact"
                  className={smallInputClass}
                />
              </div>
            </div>
            <div>
              <label className={labelClass}>Email</label>
              <input
                value={footer.contactEmail ?? ""}
                onChange={(e) => setFooter((p) => ({ ...p, contactEmail: e.target.value }))}
                className={smallInputClass}
              />
            </div>
            <div className="grid grid-cols-[1fr_1fr_2fr] gap-3">
              <div>
                <label className={labelClass}>Label WhatsApp ES</label>
                <input
                  value={footer.contactWhatsappLabelEs ?? ""}
                  onChange={(e) =>
                    setFooter((p) => ({ ...p, contactWhatsappLabelEs: e.target.value }))
                  }
                  placeholder="WhatsApp"
                  className={smallInputClass}
                />
              </div>
              <div>
                <label className={labelClass}>Label WhatsApp EN</label>
                <input
                  value={footer.contactWhatsappLabelEn ?? ""}
                  onChange={(e) =>
                    setFooter((p) => ({ ...p, contactWhatsappLabelEn: e.target.value }))
                  }
                  className={smallInputClass}
                />
              </div>
              <div>
                <label className={labelClass}>URL WhatsApp</label>
                <input
                  value={footer.contactWhatsappUrl ?? ""}
                  onChange={(e) => setFooter((p) => ({ ...p, contactWhatsappUrl: e.target.value }))}
                  placeholder="https://wa.me/..."
                  className={smallInputClass}
                />
              </div>
            </div>
            <div className="grid grid-cols-[1fr_1fr_2fr] gap-3">
              <div>
                <label className={labelClass}>Label Soporte ES</label>
                <input
                  value={footer.contactSupportLabelEs ?? ""}
                  onChange={(e) =>
                    setFooter((p) => ({ ...p, contactSupportLabelEs: e.target.value }))
                  }
                  placeholder="Soporte"
                  className={smallInputClass}
                />
              </div>
              <div>
                <label className={labelClass}>Label Support EN</label>
                <input
                  value={footer.contactSupportLabelEn ?? ""}
                  onChange={(e) =>
                    setFooter((p) => ({ ...p, contactSupportLabelEn: e.target.value }))
                  }
                  placeholder="Support"
                  className={smallInputClass}
                />
              </div>
              <div>
                <label className={labelClass}>URL Soporte</label>
                <input
                  value={footer.contactSupportUrl ?? ""}
                  onChange={(e) => setFooter((p) => ({ ...p, contactSupportUrl: e.target.value }))}
                  placeholder="/soporte"
                  className={smallInputClass}
                />
              </div>
            </div>
          </div>

          {/* Columnas de links */}
          {footer.columns.map((col, cIdx) => (
            <div key={cIdx} className="rounded-xl border border-border bg-bg-surface p-6 space-y-4">
              <div className="flex items-center justify-between">
                <div className="grid grid-cols-2 gap-4 flex-1 mr-4">
                  <div>
                    <label className={labelClass}>Título columna ES</label>
                    <input
                      value={col.titleEs}
                      onChange={(e) =>
                        updateFooterColumn(cIdx, { ...col, titleEs: e.target.value })
                      }
                      className={smallInputClass}
                    />
                  </div>
                  <div>
                    <label className={labelClass}>Título columna EN</label>
                    <input
                      value={col.titleEn}
                      onChange={(e) =>
                        updateFooterColumn(cIdx, { ...col, titleEn: e.target.value })
                      }
                      className={smallInputClass}
                    />
                  </div>
                </div>
                <button
                  onClick={() =>
                    setFooter((p) => ({ ...p, columns: p.columns.filter((_, i) => i !== cIdx) }))
                  }
                  className="rounded-lg p-2 text-text-40 hover:bg-red-500/10 hover:text-red-400"
                  aria-label="Eliminar columna"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>

              {col.links.map((link, lIdx) => (
                <NavItemEditor
                  key={lIdx}
                  item={link}
                  onChange={(updated) => {
                    const newLinks = [...col.links];
                    newLinks[lIdx] = updated;
                    updateFooterColumn(cIdx, { ...col, links: newLinks });
                  }}
                  onRemove={() => {
                    updateFooterColumn(cIdx, {
                      ...col,
                      links: col.links.filter((_, i) => i !== lIdx),
                    });
                  }}
                />
              ))}

              <button
                onClick={() =>
                  updateFooterColumn(cIdx, {
                    ...col,
                    links: [...col.links, { labelEs: "", labelEn: "", url: "" }],
                  })
                }
                className="flex items-center gap-1.5 text-xs font-medium text-primary hover:text-primary/80"
              >
                <Plus className="h-3.5 w-3.5" /> Agregar link
              </button>
            </div>
          ))}

          <button
            onClick={addFooterColumn}
            className="flex items-center gap-2 rounded-lg border border-dashed border-border px-4 py-3 text-sm text-text-40 hover:border-primary hover:text-primary transition-colors w-full justify-center"
          >
            <Plus className="h-4 w-4" /> Agregar columna
          </button>

          {/* Legal links + copyright */}
          <div className="rounded-xl border border-border bg-bg-surface p-6 space-y-4">
            <h3 className="text-sm font-semibold text-text-100">Links legales + Copyright</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>Copyright ES</label>
                <input
                  value={footer.copyrightEs}
                  onChange={(e) => setFooter((p) => ({ ...p, copyrightEs: e.target.value }))}
                  className={smallInputClass}
                />
              </div>
              <div>
                <label className={labelClass}>Copyright EN</label>
                <input
                  value={footer.copyrightEn}
                  onChange={(e) => setFooter((p) => ({ ...p, copyrightEn: e.target.value }))}
                  className={smallInputClass}
                />
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-text-70">Links legales</span>
                <button
                  onClick={() =>
                    setFooter((p) => ({
                      ...p,
                      legalLinks: [...p.legalLinks, { labelEs: "", labelEn: "", url: "" }],
                    }))
                  }
                  className="flex items-center gap-1 text-xs font-medium text-primary hover:text-primary/80"
                >
                  <Plus className="h-3 w-3" /> Agregar link legal
                </button>
              </div>
              {footer.legalLinks.map((link, lIdx) => (
                <NavItemEditor
                  key={lIdx}
                  item={link}
                  onChange={(updated) => {
                    const newLinks = [...footer.legalLinks];
                    newLinks[lIdx] = updated;
                    setFooter((p) => ({ ...p, legalLinks: newLinks }));
                  }}
                  onRemove={() => {
                    setFooter((p) => ({
                      ...p,
                      legalLinks: p.legalLinks.filter((_, i) => i !== lIdx),
                    }));
                  }}
                />
              ))}
            </div>
          </div>

          <button
            onClick={handleSaveFooter}
            disabled={saving}
            className="flex items-center gap-2 rounded-lg bg-primary px-6 py-2.5 text-sm font-semibold text-bg-base hover:opacity-90 disabled:opacity-50"
          >
            <Save className="h-4 w-4" /> {saving ? "Guardando..." : "Guardar Footer"}
          </button>
        </div>
      )}
    </div>
  );
}
