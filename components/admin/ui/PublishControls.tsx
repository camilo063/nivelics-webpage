"use client";

import { Save, Send, Clock, Trash2 } from "lucide-react";

interface PublishControlsProps {
  status: "draft" | "published" | "scheduled";
  onStatusChange: (status: "draft" | "published" | "scheduled") => void;
  onSave: () => void;
  onDelete?: () => void;
  saving?: boolean;
  isNew?: boolean;
}

export function PublishControls({
  status,
  onStatusChange,
  onSave,
  onDelete,
  saving = false,
  isNew = false,
}: PublishControlsProps) {
  return (
    <div className="rounded-xl border border-border bg-bg-surface p-5 space-y-4">
      <h3 className="text-sm font-semibold text-text-100">Publicación</h3>

      {/* Status selector */}
      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => onStatusChange("draft")}
          className={`flex-1 rounded-lg px-3 py-2 text-xs font-medium transition-colors ${
            status === "draft"
              ? "bg-finops/10 text-finops border border-finops/30"
              : "border border-border text-text-40 hover:text-text-70"
          }`}
        >
          Borrador
        </button>
        <button
          type="button"
          onClick={() => onStatusChange("published")}
          className={`flex-1 rounded-lg px-3 py-2 text-xs font-medium transition-colors ${
            status === "published"
              ? "bg-staffing/10 text-staffing border border-staffing/30"
              : "border border-border text-text-40 hover:text-text-70"
          }`}
        >
          Publicado
        </button>
      </div>

      {/* Action buttons */}
      <div className="space-y-2">
        <button
          type="button"
          onClick={onSave}
          disabled={saving}
          className="flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-bg-base transition-opacity hover:opacity-90 disabled:opacity-50"
        >
          {saving ? (
            <>Guardando...</>
          ) : status === "published" ? (
            <>
              <Send className="h-4 w-4" />
              {isNew ? "Publicar" : "Guardar y publicar"}
            </>
          ) : (
            <>
              <Save className="h-4 w-4" />
              {isNew ? "Crear borrador" : "Guardar"}
            </>
          )}
        </button>

        {onDelete && !isNew && (
          <button
            type="button"
            onClick={onDelete}
            className="flex w-full items-center justify-center gap-2 rounded-lg border border-red-500/20 px-4 py-2 text-sm font-medium text-red-400 hover:bg-red-500/10 transition-colors"
          >
            <Trash2 className="h-4 w-4" />
            Eliminar
          </button>
        )}
      </div>
    </div>
  );
}
