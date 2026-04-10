"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, UserCog, Trash2, Save } from "lucide-react";
import {
  createUsuario,
  updateUsuario,
  deactivateUsuario,
} from "@/lib/admin/actions/usuarios.actions";

const inputClass =
  "w-full rounded-lg border border-border bg-bg-elevated px-4 py-3 text-text-100 placeholder:text-text-40 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition-colors";

interface User {
  id: string;
  email: string;
  name: string;
  role: "admin" | "editor";
  isActive: boolean;
  lastLogin: Date | null;
  createdAt: Date;
}

export default function UsuariosClient({ initialUsers }: { initialUsers: User[] }) {
  const router = useRouter();
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState({
    email: "",
    name: "",
    role: "editor" as "admin" | "editor",
    password: "",
  });
  const [saving, setSaving] = useState(false);

  async function handleCreate() {
    if (!form.email || !form.name || !form.password) return;
    setSaving(true);
    try {
      await createUsuario(form);
      setShowForm(false);
      setForm({ email: "", name: "", role: "editor", password: "" });
      router.refresh();
    } finally {
      setSaving(false);
    }
  }

  async function handleToggleActive(id: string, isActive: boolean) {
    if (isActive) {
      if (!confirm("¿Desactivar este usuario?")) return;
      await deactivateUsuario(id);
    } else {
      await updateUsuario(id, { isActive: true });
    }
    router.refresh();
  }

  async function handleUpdateRole(id: string, role: "admin" | "editor") {
    await updateUsuario(id, { role });
    router.refresh();
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Usuarios</h1>
          <p className="text-text-70">{initialUsers.length} usuarios registrados</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-bg-base hover:opacity-90"
        >
          <Plus className="h-4 w-4" />
          Nuevo usuario
        </button>
      </div>

      {showForm && (
        <div className="rounded-xl border border-primary/20 bg-bg-surface p-6 space-y-4">
          <h3 className="text-sm font-semibold">Crear usuario</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-2 block text-sm font-medium text-text-70">Nombre</label>
              <input
                value={form.name}
                onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
                className={inputClass}
              />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-text-70">Email</label>
              <input
                type="email"
                value={form.email}
                onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))}
                className={inputClass}
              />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-text-70">Contraseña</label>
              <input
                type="password"
                value={form.password}
                onChange={(e) => setForm((p) => ({ ...p, password: e.target.value }))}
                className={inputClass}
              />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-text-70">Rol</label>
              <select
                value={form.role}
                onChange={(e) =>
                  setForm((p) => ({ ...p, role: e.target.value as "admin" | "editor" }))
                }
                className={inputClass}
              >
                <option value="editor">Editor</option>
                <option value="admin">Admin</option>
              </select>
            </div>
          </div>
          <div className="flex gap-3">
            <button
              onClick={handleCreate}
              disabled={saving}
              className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-bg-base hover:opacity-90 disabled:opacity-50"
            >
              <Save className="h-4 w-4" /> {saving ? "Creando..." : "Crear"}
            </button>
            <button
              onClick={() => setShowForm(false)}
              className="rounded-lg border border-border px-4 py-2 text-sm text-text-70 hover:text-text-100"
            >
              Cancelar
            </button>
          </div>
        </div>
      )}

      <div className="rounded-xl border border-border bg-bg-surface overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border text-left">
              <th className="px-6 py-3 text-xs font-semibold uppercase tracking-wider text-text-40">
                Nombre
              </th>
              <th className="px-6 py-3 text-xs font-semibold uppercase tracking-wider text-text-40">
                Email
              </th>
              <th className="px-6 py-3 text-xs font-semibold uppercase tracking-wider text-text-40">
                Rol
              </th>
              <th className="px-6 py-3 text-xs font-semibold uppercase tracking-wider text-text-40">
                Estado
              </th>
              <th className="px-6 py-3 text-xs font-semibold uppercase tracking-wider text-text-40">
                Último acceso
              </th>
              <th className="px-6 py-3 text-xs font-semibold uppercase tracking-wider text-text-40">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {initialUsers.map((user) => (
              <tr key={user.id} className="hover:bg-bg-elevated/50">
                <td className="px-6 py-4 font-medium text-text-100">{user.name}</td>
                <td className="px-6 py-4 text-text-70 text-sm">{user.email}</td>
                <td className="px-6 py-4">
                  <select
                    value={user.role}
                    onChange={(e) =>
                      handleUpdateRole(user.id, e.target.value as "admin" | "editor")
                    }
                    className="rounded-lg border border-border bg-bg-elevated px-2 py-1 text-xs text-text-70"
                  >
                    <option value="editor">Editor</option>
                    <option value="admin">Admin</option>
                  </select>
                </td>
                <td className="px-6 py-4">
                  <span
                    className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${user.isActive ? "bg-staffing/10 text-staffing" : "bg-red-400/10 text-red-400"}`}
                  >
                    {user.isActive ? "Activo" : "Inactivo"}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-text-40">
                  {user.lastLogin
                    ? new Date(user.lastLogin).toLocaleDateString("es-CO", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })
                    : "Nunca"}
                </td>
                <td className="px-6 py-4">
                  <button
                    onClick={() => handleToggleActive(user.id, user.isActive)}
                    className={`rounded-lg p-2 text-text-40 transition-colors ${user.isActive ? "hover:bg-red-500/10 hover:text-red-400" : "hover:bg-staffing/10 hover:text-staffing"}`}
                    title={user.isActive ? "Desactivar" : "Activar"}
                  >
                    {user.isActive ? (
                      <Trash2 className="h-4 w-4" />
                    ) : (
                      <UserCog className="h-4 w-4" />
                    )}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
