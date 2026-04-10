"use client";

import { useCallback } from "react";

function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

interface SlugInputProps {
  value: string;
  onChange: (value: string) => void;
  sourceText?: string;
  prefix?: string;
}

export function SlugInput({ value, onChange, sourceText, prefix }: SlugInputProps) {
  const autoGenerate = useCallback(() => {
    if (sourceText) {
      onChange(generateSlug(sourceText));
    }
  }, [sourceText, onChange]);

  return (
    <div>
      <div className="mb-2 flex items-center justify-between">
        <label className="text-sm font-medium text-text-70">Slug</label>
        {sourceText && (
          <button
            type="button"
            onClick={autoGenerate}
            className="text-xs text-primary hover:underline"
          >
            Auto-generar
          </button>
        )}
      </div>
      <div className="flex items-center rounded-lg border border-border bg-bg-elevated">
        {prefix && <span className="px-3 text-sm text-text-40 font-mono">{prefix}</span>}
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ""))}
          className="w-full rounded-lg bg-transparent px-4 py-3 font-mono text-sm text-text-100 placeholder:text-text-40 focus:outline-none"
          placeholder="mi-articulo"
        />
      </div>
    </div>
  );
}
