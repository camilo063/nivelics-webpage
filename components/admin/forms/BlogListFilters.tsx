"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Search, X } from "lucide-react";

interface Category {
  id: string;
  slug: string;
  nameEs: string;
}

interface Props {
  categories: Category[];
  initialSearch: string;
  initialCategory: string;
  initialStatus: string;
}

const STATUS_OPTIONS: Array<{ value: string; label: string }> = [
  { value: "all", label: "Todos los estados" },
  { value: "published", label: "Publicado" },
  { value: "draft", label: "Borrador" },
  { value: "scheduled", label: "Programado" },
  { value: "archived", label: "Archivado" },
];

const DEBOUNCE_MS = 300;

export function BlogListFilters({
  categories,
  initialSearch,
  initialCategory,
  initialStatus,
}: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [searchTerm, setSearchTerm] = useState(initialSearch);
  const isFirstRender = useRef(true);

  // Push a new URL with the passed patch. Any filter change resets `page` to 1.
  function pushWith(patch: Record<string, string | null>) {
    const next = new URLSearchParams(searchParams.toString());
    for (const [key, value] of Object.entries(patch)) {
      if (value === null || value === "" || value === "all") next.delete(key);
      else next.set(key, value);
    }
    next.delete("page");
    const qs = next.toString();
    router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
  }

  // Debounced search — skip the initial render so typing into a prefilled
  // field doesn't re-push the same URL.
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    const handle = setTimeout(() => {
      pushWith({ q: searchTerm.trim() || null });
    }, DEBOUNCE_MS);
    return () => clearTimeout(handle);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchTerm]);

  const hasActiveFilters =
    (initialSearch && initialSearch.length > 0) ||
    (initialCategory && initialCategory !== "all") ||
    (initialStatus && initialStatus !== "all");

  function clearAll() {
    setSearchTerm("");
    router.replace(pathname, { scroll: false });
  }

  return (
    <div className="flex flex-col md:flex-row gap-3 mb-6">
      <div className="relative md:w-80">
        <Search
          className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/30"
          aria-hidden="true"
        />
        <input
          type="search"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Buscar por título o slug..."
          aria-label="Buscar"
          className="w-full rounded-lg border border-white/10 bg-white/[0.05] pl-10 pr-3 py-2 text-sm text-white placeholder:text-white/30 focus:border-[var(--primary)] focus:outline-none focus:ring-0"
        />
      </div>

      <select
        value={initialCategory || "all"}
        onChange={(e) => pushWith({ cat: e.target.value === "all" ? null : e.target.value })}
        aria-label="Filtrar por categoría"
        className="rounded-lg border border-white/10 bg-white/[0.05] px-3 py-2 text-sm text-white focus:border-[var(--primary)] focus:outline-none"
      >
        <option value="all">Todas las categorías</option>
        {categories.map((c) => (
          <option key={c.id} value={c.id}>
            {c.nameEs}
          </option>
        ))}
      </select>

      <select
        value={initialStatus || "all"}
        onChange={(e) => pushWith({ status: e.target.value === "all" ? null : e.target.value })}
        aria-label="Filtrar por estado"
        className="rounded-lg border border-white/10 bg-white/[0.05] px-3 py-2 text-sm text-white focus:border-[var(--primary)] focus:outline-none"
      >
        {STATUS_OPTIONS.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>

      {hasActiveFilters ? (
        <button
          type="button"
          onClick={clearAll}
          className="inline-flex items-center gap-1.5 rounded-lg border border-white/10 px-3 py-2 text-sm text-white/60 hover:bg-white/[0.05] hover:text-white/90 transition-colors"
        >
          <X className="h-3.5 w-3.5" />
          Limpiar filtros
        </button>
      ) : null}
    </div>
  );
}
