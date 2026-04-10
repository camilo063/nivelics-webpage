"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, Trash2, ChevronDown, ChevronUp, Save } from "lucide-react";
import {
  updateMegaMenu,
  updateFooter,
  type MegaMenuSection,
  type FooterData,
  type NavItem,
} from "@/lib/admin/actions/navegacion.actions";

const inputClass =
  "w-full rounded-lg border border-border bg-bg-elevated px-4 py-3 text-text-100 placeholder:text-text-40 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition-colors";
const smallInputClass =
  "w-full rounded-lg border border-border bg-bg-elevated px-3 py-2 text-sm text-text-100 placeholder:text-text-40 focus:border-primary focus:outline-none";

function NavItemEditor({
  item,
  onChange,
  onRemove,
}: {
  item: NavItem;
  onChange: (item: NavItem) => void;
  onRemove: () => void;
}) {
  return (
    <div className="grid grid-cols-[1fr_1fr_1fr_auto] gap-2 items-end">
      <div>
        <label className="mb-1 block text-xs text-text-40">Label ES</label>
        <input
          value={item.labelEs}
          onChange={(e) => onChange({ ...item, labelEs: e.target.value })}
          className={smallInputClass}
        />
      </div>
      <div>
        <label className="mb-1 block text-xs text-text-40">Label EN</label>
        <input
          value={item.labelEn}
          onChange={(e) => onChange({ ...item, labelEn: e.target.value })}
          className={smallInputClass}
        />
      </div>
      <div>
        <label className="mb-1 block text-xs text-text-40">URL</label>
        <input
          value={item.url}
          onChange={(e) => onChange({ ...item, url: e.target.value })}
          className={smallInputClass}
        />
      </div>
      <button
        type="button"
        onClick={onRemove}
        className="rounded-lg p-2 text-text-40 hover:bg-red-500/10 hover:text-red-400"
      >
        <Trash2 className="h-4 w-4" />
      </button>
    </div>
  );
}

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
      { titleEs: "Nueva sección", titleEn: "New section", items: [] },
    ]);
  }

  function removeSection(idx: number) {
    setMegaMenu((prev) => prev.filter((_, i) => i !== idx));
  }

  function addItemToSection(sectionIdx: number) {
    setMegaMenu((prev) =>
      prev.map((s, i) =>
        i === sectionIdx ? { ...s, items: [...s.items, { labelEs: "", labelEn: "", url: "" }] } : s,
      ),
    );
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
              <div className="flex items-center justify-between">
                <div className="grid grid-cols-2 gap-4 flex-1 mr-4">
                  <div>
                    <label className="mb-1 block text-xs text-text-40">Título ES</label>
                    <input
                      value={section.titleEs}
                      onChange={(e) => updateSection(sIdx, { ...section, titleEs: e.target.value })}
                      className={smallInputClass}
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-xs text-text-40">Título EN</label>
                    <input
                      value={section.titleEn}
                      onChange={(e) => updateSection(sIdx, { ...section, titleEn: e.target.value })}
                      className={smallInputClass}
                    />
                  </div>
                </div>
                <button
                  onClick={() => removeSection(sIdx)}
                  className="rounded-lg p-2 text-text-40 hover:bg-red-500/10 hover:text-red-400"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>

              <div className="space-y-2">
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

              <button
                onClick={() => addItemToSection(sIdx)}
                className="flex items-center gap-1.5 text-xs font-medium text-primary hover:text-primary/80"
              >
                <Plus className="h-3.5 w-3.5" /> Agregar item
              </button>
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
          {footer.columns.map((col, cIdx) => (
            <div key={cIdx} className="rounded-xl border border-border bg-bg-surface p-6 space-y-4">
              <div className="flex items-center justify-between">
                <div className="grid grid-cols-2 gap-4 flex-1 mr-4">
                  <div>
                    <label className="mb-1 block text-xs text-text-40">Título ES</label>
                    <input
                      value={col.titleEs}
                      onChange={(e) =>
                        updateFooterColumn(cIdx, { ...col, titleEs: e.target.value })
                      }
                      className={smallInputClass}
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-xs text-text-40">Título EN</label>
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

          <div className="rounded-xl border border-border bg-bg-surface p-6 space-y-4">
            <h3 className="text-sm font-semibold">Copyright</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="mb-1 block text-xs text-text-40">Copyright ES</label>
                <input
                  value={footer.copyrightEs}
                  onChange={(e) => setFooter((p) => ({ ...p, copyrightEs: e.target.value }))}
                  className={smallInputClass}
                />
              </div>
              <div>
                <label className="mb-1 block text-xs text-text-40">Copyright EN</label>
                <input
                  value={footer.copyrightEn}
                  onChange={(e) => setFooter((p) => ({ ...p, copyrightEn: e.target.value }))}
                  className={smallInputClass}
                />
              </div>
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
