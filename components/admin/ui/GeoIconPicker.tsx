"use client";
import { useState } from "react";
import { ICON_MAP, GeoIcon, type IconColor } from "@/lib/icons/geometric";

interface Props {
  value: string;
  onChange: (name: string) => void;
  color?: IconColor;
}

const FAMILIES = [
  { prefix: "hex", label: "Hexágono", desc: "Cloud · Infra · Datos", color: "cyan" as IconColor },
  { prefix: "dia", label: "Diamante", desc: "IA · Analytics · SEO", color: "violet" as IconColor },
  {
    prefix: "tri",
    label: "Triángulo",
    desc: "Staffing · Deploy · Growth",
    color: "green" as IconColor,
  },
  {
    prefix: "oct",
    label: "Octágono",
    desc: "Seguridad · Dev · Compliance",
    color: "amber" as IconColor,
  },
  { prefix: "arc", label: "Arco", desc: "Streaming · Live · Real-time", color: "red" as IconColor },
];

export function GeoIconPicker({ value, onChange, color }: Props) {
  const [activeFamily, setActiveFamily] = useState(
    FAMILIES.find((f) => value?.startsWith(f.prefix))?.prefix ?? "hex",
  );

  const visibleIcons = Object.keys(ICON_MAP).filter((k) => k.startsWith(activeFamily));
  const currentFamily = FAMILIES.find((f) => f.prefix === activeFamily)!;

  return (
    <div className="border border-white/10 rounded-xl p-4 bg-white/[0.02]">
      <div className="flex gap-2 mb-4 flex-wrap">
        {FAMILIES.map((f) => (
          <button
            key={f.prefix}
            type="button"
            onClick={() => setActiveFamily(f.prefix)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              activeFamily === f.prefix
                ? "bg-white/10 text-white"
                : "text-white/40 hover:text-white/70"
            }`}
          >
            {f.label}
            <span className="ml-1 text-white/30">{f.desc}</span>
          </button>
        ))}
      </div>

      <div className="grid grid-cols-6 gap-2">
        {visibleIcons.map((iconName) => (
          <button
            key={iconName}
            type="button"
            title={iconName}
            onClick={() => onChange(iconName)}
            className={`flex flex-col items-center gap-1.5 p-2 rounded-lg transition-all ${
              value === iconName ? "bg-white/10 ring-1 ring-cyan-400/40" : "hover:bg-white/[0.05]"
            }`}
          >
            <GeoIcon name={iconName} size={22} color={color ?? currentFamily.color} />
            <span className="text-[9px] text-white/30 text-center leading-tight">
              {iconName.split("-")[1]}
            </span>
          </button>
        ))}
      </div>

      {value && (
        <div className="mt-3 pt-3 border-t border-white/10 flex items-center gap-2">
          <GeoIcon name={value} size={18} color={color ?? currentFamily.color} />
          <span className="text-xs text-white/40 font-mono">{value}</span>
        </div>
      )}
    </div>
  );
}
