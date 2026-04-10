"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { Upload, Copy, Trash2, Image as ImageIcon } from "lucide-react";
import {
  createMediaItem,
  deleteMediaItem,
  updateMediaItem,
} from "@/lib/admin/actions/media.actions";

interface MediaItem {
  id: string;
  filename: string;
  originalName: string;
  url: string;
  altEs: string | null;
  altEn: string | null;
  sizeBytes: number | null;
  mimeType: string | null;
  width: number | null;
  height: number | null;
  createdAt: Date;
}

export default function MediaClient({
  initialItems,
  initialTotal,
}: {
  initialItems: MediaItem[];
  initialTotal: number;
}) {
  const router = useRouter();
  const [uploading, setUploading] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editAltEs, setEditAltEs] = useState("");
  const [editAltEn, setEditAltEn] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);
    try {
      for (const file of Array.from(files)) {
        // Save to /public/uploads/ for local dev
        const filename = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, "_")}`;
        const url = `/uploads/${filename}`;

        await createMediaItem({
          filename,
          originalName: file.name,
          url,
          sizeBytes: file.size,
          mimeType: file.type,
        });
      }
      router.refresh();
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("¿Eliminar esta imagen?")) return;
    await deleteMediaItem(id);
    router.refresh();
  }

  function copyUrl(url: string) {
    navigator.clipboard.writeText(url);
  }

  async function handleSaveAlt(id: string) {
    await updateMediaItem(id, { altEs: editAltEs, altEn: editAltEn });
    setEditingId(null);
    router.refresh();
  }

  function formatSize(bytes: number | null) {
    if (!bytes) return "-";
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Media</h1>
          <p className="text-text-70">{initialTotal} archivos</p>
        </div>
        <div>
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept="image/*"
            onChange={handleUpload}
            className="hidden"
            id="media-upload"
          />
          <label
            htmlFor="media-upload"
            className="flex cursor-pointer items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-bg-base hover:opacity-90"
          >
            <Upload className="h-4 w-4" />
            {uploading ? "Subiendo..." : "Subir imagen(es)"}
          </label>
        </div>
      </div>

      {initialItems.length === 0 ? (
        <div className="rounded-xl border border-dashed border-border bg-bg-surface p-12 text-center">
          <ImageIcon className="mx-auto h-12 w-12 text-text-40" />
          <p className="mt-4 text-text-40">No hay imágenes. Sube la primera.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
          {initialItems.map((item) => (
            <div
              key={item.id}
              className="group rounded-xl border border-border bg-bg-surface overflow-hidden"
            >
              <div className="aspect-video bg-bg-elevated flex items-center justify-center">
                {item.mimeType?.startsWith("image/") ? (
                  <img
                    src={item.url}
                    alt={item.altEs || item.originalName}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <ImageIcon className="h-8 w-8 text-text-40" />
                )}
              </div>
              <div className="p-3 space-y-2">
                <p className="text-sm font-medium text-text-100 truncate">{item.originalName}</p>
                <p className="text-xs text-text-40">
                  {formatSize(item.sizeBytes)}
                  {item.width && item.height ? ` - ${item.width}x${item.height}` : ""}
                </p>

                {editingId === item.id ? (
                  <div className="space-y-2">
                    <input
                      value={editAltEs}
                      onChange={(e) => setEditAltEs(e.target.value)}
                      placeholder="Alt text ES"
                      className="w-full rounded border border-border bg-bg-elevated px-2 py-1 text-xs"
                    />
                    <input
                      value={editAltEn}
                      onChange={(e) => setEditAltEn(e.target.value)}
                      placeholder="Alt text EN"
                      className="w-full rounded border border-border bg-bg-elevated px-2 py-1 text-xs"
                    />
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleSaveAlt(item.id)}
                        className="text-xs text-primary hover:underline"
                      >
                        Guardar
                      </button>
                      <button
                        onClick={() => setEditingId(null)}
                        className="text-xs text-text-40 hover:underline"
                      >
                        Cancelar
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => copyUrl(item.url)}
                      className="rounded p-1.5 text-text-40 hover:bg-bg-elevated hover:text-primary"
                      title="Copiar URL"
                    >
                      <Copy className="h-3.5 w-3.5" />
                    </button>
                    <button
                      onClick={() => {
                        setEditingId(item.id);
                        setEditAltEs(item.altEs || "");
                        setEditAltEn(item.altEn || "");
                      }}
                      className="rounded p-1.5 text-text-40 hover:bg-bg-elevated hover:text-primary"
                      title="Editar alt"
                    >
                      <ImageIcon className="h-3.5 w-3.5" />
                    </button>
                    <button
                      onClick={() => handleDelete(item.id)}
                      className="rounded p-1.5 text-text-40 hover:bg-red-500/10 hover:text-red-400"
                      title="Eliminar"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
