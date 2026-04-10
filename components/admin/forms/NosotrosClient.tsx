"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  createTeamMember,
  updateTeamMember,
  deleteTeamMember,
  createHistoriaItem,
  updateHistoriaItem,
  deleteHistoriaItem,
  createCertificacion,
  updateCertificacion,
  deleteCertificacion,
} from "@/lib/admin/actions/nosotros.actions";
import { Plus, Pencil, Trash2, Star, Save, X } from "lucide-react";

// ─── Types ──────────────────────────────────────────────

interface TeamMemberData {
  id: string;
  name: string;
  roleEs: string;
  roleEn: string;
  bioEs: string;
  bioEn: string;
  photo: string;
  linkedinUrl: string;
  isFounder: boolean;
  isFeatured: boolean;
  sortOrder: number;
  status: "draft" | "published" | "scheduled" | "archived";
}

interface HistoriaData {
  id: string;
  year: number;
  month?: number;
  titleEs: string;
  titleEn: string;
  descriptionEs: string;
  descriptionEn: string;
  icon: string;
  image: string;
  milestoneType: "founding" | "growth" | "award" | "expansion" | "product";
  sortOrder: number;
}

interface CertData {
  id: string;
  nameEs: string;
  nameEn: string;
  issuer: string;
  year?: number;
  logo: string;
  certificateUrl: string;
  descriptionEs: string;
  descriptionEn: string;
  sortOrder: number;
}

type MainTab = "equipo" | "historia" | "certificaciones";

const inputClass =
  "w-full rounded-lg border border-border bg-bg-elevated px-4 py-3 text-text-100 placeholder:text-text-40 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition-colors";

const milestoneTypes = [
  { value: "founding", label: "Fundación" },
  { value: "growth", label: "Crecimiento" },
  { value: "award", label: "Premio" },
  { value: "expansion", label: "Expansión" },
  { value: "product", label: "Producto" },
] as const;

const milestoneColors: Record<string, string> = {
  founding: "bg-ia/10 text-ia",
  growth: "bg-staffing/10 text-staffing",
  award: "bg-finops/10 text-finops",
  expansion: "bg-cloud/10 text-cloud",
  product: "bg-dev/10 text-dev",
};

interface NosotrosClientProps {
  initialMembers: TeamMemberData[];
  initialHistoria: HistoriaData[];
  initialCerts: CertData[];
}

export default function NosotrosClient({
  initialMembers,
  initialHistoria,
  initialCerts,
}: NosotrosClientProps) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<MainTab>("equipo");
  const [members, setMembers] = useState(initialMembers);
  const [historia, setHistoria] = useState(initialHistoria);
  const [certs, setCerts] = useState(initialCerts);

  // ─── Equipo state ───
  const [editingMemberId, setEditingMemberId] = useState<string | null>(null);
  const [memberForm, setMemberForm] = useState<Omit<TeamMemberData, "id">>({
    name: "",
    roleEs: "",
    roleEn: "",
    bioEs: "",
    bioEn: "",
    photo: "",
    linkedinUrl: "",
    isFounder: false,
    isFeatured: false,
    sortOrder: 0,
    status: "draft",
  });
  const [isNewMember, setIsNewMember] = useState(false);
  const [savingMember, setSavingMember] = useState(false);

  // ─── Historia state ───
  const [editingHistoriaId, setEditingHistoriaId] = useState<string | null>(null);
  const [historiaForm, setHistoriaForm] = useState<Omit<HistoriaData, "id">>({
    year: new Date().getFullYear(),
    titleEs: "",
    titleEn: "",
    descriptionEs: "",
    descriptionEn: "",
    icon: "",
    image: "",
    milestoneType: "growth",
    sortOrder: 0,
  });
  const [isNewHistoria, setIsNewHistoria] = useState(false);
  const [savingHistoria, setSavingHistoria] = useState(false);

  // ─── Certs state ───
  const [editingCertId, setEditingCertId] = useState<string | null>(null);
  const [certForm, setCertForm] = useState<Omit<CertData, "id">>({
    nameEs: "",
    nameEn: "",
    issuer: "",
    logo: "",
    certificateUrl: "",
    descriptionEs: "",
    descriptionEn: "",
    sortOrder: 0,
  });
  const [isNewCert, setIsNewCert] = useState(false);
  const [savingCert, setSavingCert] = useState(false);

  const [error, setError] = useState("");

  // ─── Equipo handlers ───

  function startEditMember(member: TeamMemberData) {
    setEditingMemberId(member.id);
    setIsNewMember(false);
    setMemberForm({
      name: member.name,
      roleEs: member.roleEs,
      roleEn: member.roleEn,
      bioEs: member.bioEs,
      bioEn: member.bioEn,
      photo: member.photo,
      linkedinUrl: member.linkedinUrl,
      isFounder: member.isFounder,
      isFeatured: member.isFeatured,
      sortOrder: member.sortOrder,
      status: member.status,
    });
  }

  function startNewMember() {
    setEditingMemberId("new");
    setIsNewMember(true);
    setMemberForm({
      name: "",
      roleEs: "",
      roleEn: "",
      bioEs: "",
      bioEn: "",
      photo: "",
      linkedinUrl: "",
      isFounder: false,
      isFeatured: false,
      sortOrder: 0,
      status: "draft",
    });
  }

  async function saveMember() {
    setSavingMember(true);
    setError("");
    try {
      if (isNewMember) {
        const created = await createTeamMember(memberForm);
        setMembers((prev) => [...prev, { ...memberForm, id: created.id }]);
      } else if (editingMemberId) {
        await updateTeamMember(editingMemberId, memberForm);
        setMembers((prev) =>
          prev.map((m) => (m.id === editingMemberId ? { ...memberForm, id: m.id } : m)),
        );
      }
      setEditingMemberId(null);
      router.refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Error al guardar");
    } finally {
      setSavingMember(false);
    }
  }

  async function removeMember(id: string) {
    if (!confirm("¿Archivar este miembro del equipo?")) return;
    try {
      await deleteTeamMember(id);
      setMembers((prev) => prev.filter((m) => m.id !== id));
      router.refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Error al eliminar");
    }
  }

  // ─── Historia handlers ───

  function startEditHistoria(item: HistoriaData) {
    setEditingHistoriaId(item.id);
    setIsNewHistoria(false);
    setHistoriaForm({
      year: item.year,
      month: item.month,
      titleEs: item.titleEs,
      titleEn: item.titleEn,
      descriptionEs: item.descriptionEs,
      descriptionEn: item.descriptionEn,
      icon: item.icon,
      image: item.image,
      milestoneType: item.milestoneType,
      sortOrder: item.sortOrder,
    });
  }

  function startNewHistoria() {
    setEditingHistoriaId("new");
    setIsNewHistoria(true);
    setHistoriaForm({
      year: new Date().getFullYear(),
      titleEs: "",
      titleEn: "",
      descriptionEs: "",
      descriptionEn: "",
      icon: "",
      image: "",
      milestoneType: "growth",
      sortOrder: 0,
    });
  }

  async function saveHistoria() {
    setSavingHistoria(true);
    setError("");
    try {
      if (isNewHistoria) {
        const created = await createHistoriaItem({
          ...historiaForm,
          month: historiaForm.month ?? null,
        });
        setHistoria((prev) => [...prev, { ...historiaForm, id: created.id }]);
      } else if (editingHistoriaId) {
        await updateHistoriaItem(editingHistoriaId, {
          ...historiaForm,
          month: historiaForm.month ?? null,
        });
        setHistoria((prev) =>
          prev.map((h) => (h.id === editingHistoriaId ? { ...historiaForm, id: h.id } : h)),
        );
      }
      setEditingHistoriaId(null);
      router.refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Error al guardar");
    } finally {
      setSavingHistoria(false);
    }
  }

  async function removeHistoria(id: string) {
    if (!confirm("¿Eliminar este hito?")) return;
    try {
      await deleteHistoriaItem(id);
      setHistoria((prev) => prev.filter((h) => h.id !== id));
      router.refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Error al eliminar");
    }
  }

  // ─── Certs handlers ───

  function startEditCert(cert: CertData) {
    setEditingCertId(cert.id);
    setIsNewCert(false);
    setCertForm({
      nameEs: cert.nameEs,
      nameEn: cert.nameEn,
      issuer: cert.issuer,
      year: cert.year,
      logo: cert.logo,
      certificateUrl: cert.certificateUrl,
      descriptionEs: cert.descriptionEs,
      descriptionEn: cert.descriptionEn,
      sortOrder: cert.sortOrder,
    });
  }

  function startNewCert() {
    setEditingCertId("new");
    setIsNewCert(true);
    setCertForm({
      nameEs: "",
      nameEn: "",
      issuer: "",
      logo: "",
      certificateUrl: "",
      descriptionEs: "",
      descriptionEn: "",
      sortOrder: 0,
    });
  }

  async function saveCert() {
    setSavingCert(true);
    setError("");
    try {
      if (isNewCert) {
        const created = await createCertificacion({
          ...certForm,
          year: certForm.year ?? null,
        });
        setCerts((prev) => [...prev, { ...certForm, id: created.id }]);
      } else if (editingCertId) {
        await updateCertificacion(editingCertId, {
          ...certForm,
          year: certForm.year ?? null,
        });
        setCerts((prev) =>
          prev.map((c) => (c.id === editingCertId ? { ...certForm, id: c.id } : c)),
        );
      }
      setEditingCertId(null);
      router.refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Error al guardar");
    } finally {
      setSavingCert(false);
    }
  }

  async function removeCert(id: string) {
    if (!confirm("¿Eliminar esta certificación?")) return;
    try {
      await deleteCertificacion(id);
      setCerts((prev) => prev.filter((c) => c.id !== id));
      router.refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Error al eliminar");
    }
  }

  const mainTabs: Array<{ key: MainTab; label: string }> = [
    { key: "equipo", label: "Equipo" },
    { key: "historia", label: "Historia" },
    { key: "certificaciones", label: "Certificaciones" },
  ];

  return (
    <div className="space-y-6">
      {error && (
        <div className="rounded-lg bg-red-500/10 border border-red-500/20 px-4 py-3 text-sm text-red-400">
          {error}
        </div>
      )}

      {/* Tabs */}
      <div className="flex gap-1 rounded-lg border border-border bg-bg-elevated p-1">
        {mainTabs.map((tab) => (
          <button
            key={tab.key}
            type="button"
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

      {/* ─── TAB: EQUIPO ─── */}
      {activeTab === "equipo" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-text-100">Miembros del equipo</h3>
            <button
              type="button"
              onClick={startNewMember}
              className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium text-primary hover:bg-primary/10 transition-colors"
            >
              <Plus className="h-4 w-4" />
              Agregar miembro
            </button>
          </div>

          {/* Table */}
          <div className="overflow-x-auto rounded-xl border border-border">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-bg-elevated">
                  <th className="px-4 py-3 text-left font-medium text-text-70">Nombre</th>
                  <th className="px-4 py-3 text-left font-medium text-text-70">Rol ES</th>
                  <th className="px-4 py-3 text-center font-medium text-text-70">Fundador</th>
                  <th className="px-4 py-3 text-center font-medium text-text-70">Orden</th>
                  <th className="px-4 py-3 text-right font-medium text-text-70">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {members.map((member) => (
                  <tr
                    key={member.id}
                    className="border-b border-border last:border-0 hover:bg-bg-elevated/50"
                  >
                    <td className="px-4 py-3 text-text-100">{member.name}</td>
                    <td className="px-4 py-3 text-text-70">{member.roleEs}</td>
                    <td className="px-4 py-3 text-center">
                      {member.isFounder && <Star className="mx-auto h-4 w-4 text-finops" />}
                    </td>
                    <td className="px-4 py-3 text-center text-text-40">{member.sortOrder}</td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => startEditMember(member)}
                          className="rounded-md p-1.5 text-text-40 hover:text-primary hover:bg-primary/10 transition-colors"
                        >
                          <Pencil className="h-4 w-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => removeMember(member.id)}
                          className="rounded-md p-1.5 text-text-40 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {members.length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-4 py-8 text-center text-text-40">
                      No hay miembros del equipo
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Inline form */}
          {editingMemberId && (
            <div className="rounded-xl border border-primary/30 bg-bg-surface p-6 space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-semibold text-text-100">
                  {isNewMember ? "Nuevo miembro" : "Editar miembro"}
                </h4>
                <button
                  type="button"
                  onClick={() => setEditingMemberId(null)}
                  className="text-text-40 hover:text-text-100 transition-colors"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-medium text-text-70">Nombre *</label>
                  <input
                    type="text"
                    value={memberForm.name}
                    onChange={(e) => setMemberForm((p) => ({ ...p, name: e.target.value }))}
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium text-text-70">Rol ES</label>
                  <input
                    type="text"
                    value={memberForm.roleEs}
                    onChange={(e) => setMemberForm((p) => ({ ...p, roleEs: e.target.value }))}
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium text-text-70">Rol EN</label>
                  <input
                    type="text"
                    value={memberForm.roleEn}
                    onChange={(e) => setMemberForm((p) => ({ ...p, roleEn: e.target.value }))}
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium text-text-70">Foto URL</label>
                  <input
                    type="text"
                    value={memberForm.photo}
                    onChange={(e) => setMemberForm((p) => ({ ...p, photo: e.target.value }))}
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium text-text-70">
                    LinkedIn URL
                  </label>
                  <input
                    type="text"
                    value={memberForm.linkedinUrl}
                    onChange={(e) => setMemberForm((p) => ({ ...p, linkedinUrl: e.target.value }))}
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium text-text-70">Orden</label>
                  <input
                    type="number"
                    value={memberForm.sortOrder}
                    onChange={(e) =>
                      setMemberForm((p) => ({ ...p, sortOrder: parseInt(e.target.value) || 0 }))
                    }
                    className={inputClass}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-medium text-text-70">Bio ES</label>
                  <textarea
                    value={memberForm.bioEs}
                    onChange={(e) => setMemberForm((p) => ({ ...p, bioEs: e.target.value }))}
                    rows={3}
                    className={`${inputClass} resize-none`}
                  />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium text-text-70">Bio EN</label>
                  <textarea
                    value={memberForm.bioEn}
                    onChange={(e) => setMemberForm((p) => ({ ...p, bioEn: e.target.value }))}
                    rows={3}
                    className={`${inputClass} resize-none`}
                  />
                </div>
              </div>

              <div className="flex items-center gap-6">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={memberForm.isFounder}
                    onChange={(e) => setMemberForm((p) => ({ ...p, isFounder: e.target.checked }))}
                    className="h-4 w-4 rounded border-border text-primary focus:ring-primary"
                  />
                  <span className="text-sm text-text-70">Fundador</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={memberForm.isFeatured}
                    onChange={(e) => setMemberForm((p) => ({ ...p, isFeatured: e.target.checked }))}
                    className="h-4 w-4 rounded border-border text-primary focus:ring-primary"
                  />
                  <span className="text-sm text-text-70">Destacado</span>
                </label>
              </div>

              <div className="flex items-center gap-3 pt-2 border-t border-border">
                <button
                  type="button"
                  onClick={saveMember}
                  disabled={savingMember}
                  className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-bg-base transition-opacity hover:opacity-90 disabled:opacity-50"
                >
                  <Save className="h-4 w-4" />
                  {savingMember ? "Guardando..." : "Guardar"}
                </button>
                <button
                  type="button"
                  onClick={() => setEditingMemberId(null)}
                  className="rounded-lg border border-border px-4 py-2 text-sm font-medium text-text-70 hover:text-text-100 transition-colors"
                >
                  Cancelar
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ─── TAB: HISTORIA ─── */}
      {activeTab === "historia" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-text-100">Hitos de la historia</h3>
            <button
              type="button"
              onClick={startNewHistoria}
              className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium text-primary hover:bg-primary/10 transition-colors"
            >
              <Plus className="h-4 w-4" />
              Agregar hito
            </button>
          </div>

          <div className="overflow-x-auto rounded-xl border border-border">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-bg-elevated">
                  <th className="px-4 py-3 text-left font-medium text-text-70">Año</th>
                  <th className="px-4 py-3 text-left font-medium text-text-70">Mes</th>
                  <th className="px-4 py-3 text-left font-medium text-text-70">Título ES</th>
                  <th className="px-4 py-3 text-left font-medium text-text-70">Tipo</th>
                  <th className="px-4 py-3 text-right font-medium text-text-70">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {historia.map((item) => (
                  <tr
                    key={item.id}
                    className="border-b border-border last:border-0 hover:bg-bg-elevated/50"
                  >
                    <td className="px-4 py-3 text-text-100 font-mono">{item.year}</td>
                    <td className="px-4 py-3 text-text-40">{item.month || "-"}</td>
                    <td className="px-4 py-3 text-text-100">{item.titleEs}</td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${milestoneColors[item.milestoneType] || ""}`}
                      >
                        {milestoneTypes.find((t) => t.value === item.milestoneType)?.label ||
                          item.milestoneType}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => startEditHistoria(item)}
                          className="rounded-md p-1.5 text-text-40 hover:text-primary hover:bg-primary/10 transition-colors"
                        >
                          <Pencil className="h-4 w-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => removeHistoria(item.id)}
                          className="rounded-md p-1.5 text-text-40 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {historia.length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-4 py-8 text-center text-text-40">
                      No hay hitos de historia
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {editingHistoriaId && (
            <div className="rounded-xl border border-primary/30 bg-bg-surface p-6 space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-semibold text-text-100">
                  {isNewHistoria ? "Nuevo hito" : "Editar hito"}
                </h4>
                <button
                  type="button"
                  onClick={() => setEditingHistoriaId(null)}
                  className="text-text-40 hover:text-text-100 transition-colors"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <div>
                  <label className="mb-2 block text-sm font-medium text-text-70">Año *</label>
                  <input
                    type="number"
                    value={historiaForm.year}
                    onChange={(e) =>
                      setHistoriaForm((p) => ({ ...p, year: parseInt(e.target.value) || 0 }))
                    }
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium text-text-70">Mes</label>
                  <input
                    type="number"
                    value={historiaForm.month || ""}
                    onChange={(e) =>
                      setHistoriaForm((p) => ({
                        ...p,
                        month: e.target.value ? parseInt(e.target.value) : undefined,
                      }))
                    }
                    min={1}
                    max={12}
                    placeholder="1-12"
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium text-text-70">Tipo</label>
                  <select
                    value={historiaForm.milestoneType}
                    onChange={(e) =>
                      setHistoriaForm((p) => ({
                        ...p,
                        milestoneType: e.target.value as HistoriaData["milestoneType"],
                      }))
                    }
                    className={inputClass}
                  >
                    {milestoneTypes.map((t) => (
                      <option key={t.value} value={t.value}>
                        {t.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-medium text-text-70">Título ES *</label>
                  <input
                    type="text"
                    value={historiaForm.titleEs}
                    onChange={(e) => setHistoriaForm((p) => ({ ...p, titleEs: e.target.value }))}
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium text-text-70">Title EN</label>
                  <input
                    type="text"
                    value={historiaForm.titleEn}
                    onChange={(e) => setHistoriaForm((p) => ({ ...p, titleEn: e.target.value }))}
                    className={inputClass}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-medium text-text-70">
                    Descripción ES
                  </label>
                  <textarea
                    value={historiaForm.descriptionEs}
                    onChange={(e) =>
                      setHistoriaForm((p) => ({ ...p, descriptionEs: e.target.value }))
                    }
                    rows={3}
                    className={`${inputClass} resize-none`}
                  />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium text-text-70">
                    Description EN
                  </label>
                  <textarea
                    value={historiaForm.descriptionEn}
                    onChange={(e) =>
                      setHistoriaForm((p) => ({ ...p, descriptionEn: e.target.value }))
                    }
                    rows={3}
                    className={`${inputClass} resize-none`}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <div>
                  <label className="mb-2 block text-sm font-medium text-text-70">Icono</label>
                  <input
                    type="text"
                    value={historiaForm.icon}
                    onChange={(e) => setHistoriaForm((p) => ({ ...p, icon: e.target.value }))}
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium text-text-70">Imagen URL</label>
                  <input
                    type="text"
                    value={historiaForm.image}
                    onChange={(e) => setHistoriaForm((p) => ({ ...p, image: e.target.value }))}
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium text-text-70">Orden</label>
                  <input
                    type="number"
                    value={historiaForm.sortOrder}
                    onChange={(e) =>
                      setHistoriaForm((p) => ({ ...p, sortOrder: parseInt(e.target.value) || 0 }))
                    }
                    className={inputClass}
                  />
                </div>
              </div>

              <div className="flex items-center gap-3 pt-2 border-t border-border">
                <button
                  type="button"
                  onClick={saveHistoria}
                  disabled={savingHistoria}
                  className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-bg-base transition-opacity hover:opacity-90 disabled:opacity-50"
                >
                  <Save className="h-4 w-4" />
                  {savingHistoria ? "Guardando..." : "Guardar"}
                </button>
                <button
                  type="button"
                  onClick={() => setEditingHistoriaId(null)}
                  className="rounded-lg border border-border px-4 py-2 text-sm font-medium text-text-70 hover:text-text-100 transition-colors"
                >
                  Cancelar
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ─── TAB: CERTIFICACIONES ─── */}
      {activeTab === "certificaciones" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-text-100">Certificaciones</h3>
            <button
              type="button"
              onClick={startNewCert}
              className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium text-primary hover:bg-primary/10 transition-colors"
            >
              <Plus className="h-4 w-4" />
              Agregar certificación
            </button>
          </div>

          <div className="overflow-x-auto rounded-xl border border-border">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-bg-elevated">
                  <th className="px-4 py-3 text-left font-medium text-text-70">Nombre</th>
                  <th className="px-4 py-3 text-left font-medium text-text-70">Emisor</th>
                  <th className="px-4 py-3 text-left font-medium text-text-70">Año</th>
                  <th className="px-4 py-3 text-right font-medium text-text-70">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {certs.map((cert) => (
                  <tr
                    key={cert.id}
                    className="border-b border-border last:border-0 hover:bg-bg-elevated/50"
                  >
                    <td className="px-4 py-3 text-text-100">{cert.nameEs}</td>
                    <td className="px-4 py-3 text-text-70">{cert.issuer || "-"}</td>
                    <td className="px-4 py-3 text-text-40 font-mono">{cert.year || "-"}</td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => startEditCert(cert)}
                          className="rounded-md p-1.5 text-text-40 hover:text-primary hover:bg-primary/10 transition-colors"
                        >
                          <Pencil className="h-4 w-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => removeCert(cert.id)}
                          className="rounded-md p-1.5 text-text-40 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {certs.length === 0 && (
                  <tr>
                    <td colSpan={4} className="px-4 py-8 text-center text-text-40">
                      No hay certificaciones
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {editingCertId && (
            <div className="rounded-xl border border-primary/30 bg-bg-surface p-6 space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-semibold text-text-100">
                  {isNewCert ? "Nueva certificación" : "Editar certificación"}
                </h4>
                <button
                  type="button"
                  onClick={() => setEditingCertId(null)}
                  className="text-text-40 hover:text-text-100 transition-colors"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-medium text-text-70">Nombre ES *</label>
                  <input
                    type="text"
                    value={certForm.nameEs}
                    onChange={(e) => setCertForm((p) => ({ ...p, nameEs: e.target.value }))}
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium text-text-70">Name EN</label>
                  <input
                    type="text"
                    value={certForm.nameEn}
                    onChange={(e) => setCertForm((p) => ({ ...p, nameEn: e.target.value }))}
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium text-text-70">Emisor</label>
                  <input
                    type="text"
                    value={certForm.issuer}
                    onChange={(e) => setCertForm((p) => ({ ...p, issuer: e.target.value }))}
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium text-text-70">Año</label>
                  <input
                    type="number"
                    value={certForm.year || ""}
                    onChange={(e) =>
                      setCertForm((p) => ({
                        ...p,
                        year: e.target.value ? parseInt(e.target.value) : undefined,
                      }))
                    }
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium text-text-70">Logo URL</label>
                  <input
                    type="text"
                    value={certForm.logo}
                    onChange={(e) => setCertForm((p) => ({ ...p, logo: e.target.value }))}
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium text-text-70">
                    URL certificado
                  </label>
                  <input
                    type="text"
                    value={certForm.certificateUrl}
                    onChange={(e) => setCertForm((p) => ({ ...p, certificateUrl: e.target.value }))}
                    className={inputClass}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-medium text-text-70">
                    Descripción ES
                  </label>
                  <textarea
                    value={certForm.descriptionEs}
                    onChange={(e) => setCertForm((p) => ({ ...p, descriptionEs: e.target.value }))}
                    rows={3}
                    className={`${inputClass} resize-none`}
                  />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium text-text-70">
                    Description EN
                  </label>
                  <textarea
                    value={certForm.descriptionEn}
                    onChange={(e) => setCertForm((p) => ({ ...p, descriptionEn: e.target.value }))}
                    rows={3}
                    className={`${inputClass} resize-none`}
                  />
                </div>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-text-70">Orden</label>
                <input
                  type="number"
                  value={certForm.sortOrder}
                  onChange={(e) =>
                    setCertForm((p) => ({ ...p, sortOrder: parseInt(e.target.value) || 0 }))
                  }
                  className={`w-32 ${inputClass}`}
                />
              </div>

              <div className="flex items-center gap-3 pt-2 border-t border-border">
                <button
                  type="button"
                  onClick={saveCert}
                  disabled={savingCert}
                  className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-bg-base transition-opacity hover:opacity-90 disabled:opacity-50"
                >
                  <Save className="h-4 w-4" />
                  {savingCert ? "Guardando..." : "Guardar"}
                </button>
                <button
                  type="button"
                  onClick={() => setEditingCertId(null)}
                  className="rounded-lg border border-border px-4 py-2 text-sm font-medium text-text-70 hover:text-text-100 transition-colors"
                >
                  Cancelar
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
