"use client";

import { useRef, useState } from "react";
import { Upload, X, ImageIcon, Loader2 } from "lucide-react";

interface ImageUploaderProps {
  value: string | null | undefined;
  onChange: (url: string) => void;
  folder: string;
  label?: string;
  aspectRatio?: "16/9" | "1/1" | "4/3" | "3/4" | "auto";
  maxSizeMB?: number;
  accept?: string;
}

const ACCEPT_DEFAULT = "image/jpeg,image/png,image/webp,image/gif,image/avif,image/svg+xml";

export function ImageUploader({
  value,
  onChange,
  folder,
  label,
  aspectRatio = "16/9",
  maxSizeMB = 10,
  accept = ACCEPT_DEFAULT,
}: ImageUploaderProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  const aspectClass =
    aspectRatio === "16/9"
      ? "aspect-video"
      : aspectRatio === "1/1"
        ? "aspect-square"
        : aspectRatio === "4/3"
          ? "aspect-[4/3]"
          : aspectRatio === "3/4"
            ? "aspect-[3/4]"
            : "";

  async function handleFile(file: File) {
    setError(null);

    if (file.size > maxSizeMB * 1024 * 1024) {
      setError(`Archivo muy grande. Máximo ${maxSizeMB}MB.`);
      return;
    }

    const localPreview = URL.createObjectURL(file);
    setPreview(localPreview);
    setUploading(true);

    try {
      // Single multipart upload — endpoint decides S3 (prod) vs local (dev)
      const formData = new FormData();
      formData.append("file", file);
      formData.append("folder", folder);

      const res = await fetch("/api/admin/upload", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Error al subir");
      }

      const { url } = await res.json();
      onChange(url);
      setPreview(null);
      URL.revokeObjectURL(localPreview);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Error al subir");
      setPreview(null);
      URL.revokeObjectURL(localPreview);
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) void handleFile(file);
  }

  function handleDrop(e: React.DragEvent<HTMLDivElement>) {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith("image/")) void handleFile(file);
  }

  function handleRemove() {
    onChange("");
    setError(null);
  }

  const displayUrl = preview || value || "";

  return (
    <div className="space-y-2">
      {label && <label className="block text-sm font-medium text-text-70">{label}</label>}

      <input
        ref={inputRef}
        type="file"
        accept={accept}
        onChange={handleInputChange}
        className="hidden"
      />

      {displayUrl ? (
        <div className="relative group">
          <div
            className={`relative overflow-hidden rounded-lg border border-border bg-bg-elevated ${aspectClass}`}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={displayUrl} alt="Preview" className="h-full w-full object-cover" />
            {uploading && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/60">
                <Loader2 className="h-8 w-8 text-primary animate-spin" />
              </div>
            )}
          </div>
          {!uploading && (
            <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <button
                type="button"
                onClick={() => inputRef.current?.click()}
                className="rounded-lg bg-bg-surface/90 backdrop-blur-sm px-3 py-1.5 text-xs font-medium text-text-100 hover:bg-bg-elevated"
              >
                Reemplazar
              </button>
              <button
                type="button"
                onClick={handleRemove}
                className="rounded-lg bg-red-500/90 backdrop-blur-sm p-1.5 text-white hover:bg-red-600"
                title="Eliminar"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>
          )}
        </div>
      ) : (
        <div
          onClick={() => inputRef.current?.click()}
          onDrop={handleDrop}
          onDragOver={(e) => e.preventDefault()}
          className={`flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-border bg-bg-elevated/50 transition-colors hover:border-primary hover:bg-bg-elevated ${aspectClass || "py-8"}`}
        >
          {uploading ? (
            <>
              <Loader2 className="h-8 w-8 text-primary animate-spin" />
              <p className="mt-2 text-sm text-text-70">Subiendo...</p>
            </>
          ) : (
            <>
              <div className="flex items-center gap-2 text-text-40">
                <ImageIcon className="h-6 w-6" />
                <Upload className="h-5 w-5" />
              </div>
              <p className="mt-2 text-sm font-medium text-text-70">
                Haz clic o arrastra una imagen
              </p>
              <p className="mt-1 text-xs text-text-40">JPG, PNG, WebP, GIF · máx {maxSizeMB}MB</p>
            </>
          )}
        </div>
      )}

      {error && <p className="text-xs text-red-400">{error}</p>}

      {value && !uploading && (
        <p className="text-[10px] text-text-40 font-mono truncate">{value}</p>
      )}
    </div>
  );
}

export default ImageUploader;
