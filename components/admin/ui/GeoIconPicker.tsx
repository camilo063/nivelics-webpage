"use client";

import { useMemo, useState } from "react";
import { GeoIcon, ICON_MAP, type IconColor } from "@/lib/icons/geometric";

const FAMILIAS: Record<string, string> = {
  hex: "Hexágono",
  dia: "Diamante",
  tri: "Triángulo",
  oct: "Octágono",
  arc: "Círculo",
};

type Accent = "cyan" | "teal" | "violet";

interface GeoIconPickerProps {
  value: string;
  onChange: (icon: string) => void;
  /** Accent del producto — se usa para previsualizar el ícono con su color real */
  accentColor?: Accent;
  /** Variante legacy — compatibilidad con llamadas existentes que pasan color directo */
  color?: IconColor;
}

const ACCENT_TO_ICON: Record<Accent, IconColor> = {
  cyan: "cyan",
  teal: "green",
  violet: "violet",
};

export function GeoIconPicker({ value, onChange, accentColor, color }: GeoIconPickerProps) {
  const [search, setSearch] = useState("");

  const iconColor: IconColor = color ?? (accentColor ? ACCENT_TO_ICON[accentColor] : "cyan");

  const allIcons = useMemo(() => Object.keys(ICON_MAP), []);

  const filtered = useMemo(
    () => allIcons.filter((name) => name.toLowerCase().includes(search.toLowerCase())),
    [allIcons, search],
  );

  const grouped = useMemo(() => {
    const groups: Record<string, string[]> = {};
    for (const name of filtered) {
      const familia = name.split("-")[0];
      if (!groups[familia]) groups[familia] = [];
      groups[familia].push(name);
    }
    return groups;
  }, [filtered]);

  return (
    <div className="flex flex-col gap-3">
      <input
        type="text"
        placeholder="Buscar ícono..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full rounded-md border border-white/10 bg-white/[0.04] px-3 py-2 text-sm text-gray-300 placeholder-gray-600 outline-none focus:border-cyan-500/40"
      />

      <div className="max-h-72 overflow-y-auto pr-1 flex flex-col gap-4">
        {Object.entries(grouped).map(([familia, iconos]) => (
          <div key={familia}>
            <div className="text-[10px] font-medium text-gray-500 uppercase tracking-wider mb-2">
              {FAMILIAS[familia] ?? familia}
            </div>
            <div className="grid grid-cols-5 gap-2 sm:grid-cols-6 md:grid-cols-7">
              {iconos.map((iconName) => {
                const selected = value === iconName;
                return (
                  <button
                    key={iconName}
                    type="button"
                    onClick={() => onChange(iconName)}
                    title={iconName}
                    className={[
                      "flex flex-col items-center gap-1.5 p-2 rounded-lg border transition-all cursor-pointer",
                      selected
                        ? "bg-cyan-500/10 border-cyan-500/40 ring-1 ring-cyan-500/30"
                        : "bg-white/[0.02] border-white/[0.06] hover:bg-white/[0.06] hover:border-white/[0.14]",
                    ].join(" ")}
                  >
                    <div className="w-7 h-7 flex items-center justify-center">
                      <GeoIcon name={iconName} size={22} color={iconColor} />
                    </div>
                    <span className="text-[8px] text-gray-500 text-center leading-tight line-clamp-2 w-full">
                      {iconName.replace(`${familia}-`, "")}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        ))}

        {filtered.length === 0 && (
          <div className="text-sm text-gray-600 text-center py-6">
            Sin resultados para &quot;{search}&quot;
          </div>
        )}
      </div>

      {value && (
        <div className="flex items-center gap-3 px-3 py-2 rounded-lg bg-cyan-500/[0.06] border border-cyan-500/20">
          <GeoIcon name={value} size={20} color={iconColor} />
          <div>
            <div className="text-xs font-medium text-cyan-400">{value}</div>
            <div className="text-[10px] text-gray-500">ícono seleccionado</div>
          </div>
        </div>
      )}
    </div>
  );
}
