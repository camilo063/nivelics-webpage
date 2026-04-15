import { GeoIconBox, ICON_MAP, type IconColor } from "@/lib/icons/geometric";

const COLOR_TOKENS: Array<{ name: string; hex: string; bg: string }> = [
  { name: "Cian — Cloud / Infra", hex: "#00D4FF", bg: "rgba(0,212,255,0.12)" },
  { name: "Violeta — IA / Analytics", hex: "#a78bfa", bg: "rgba(139,92,246,0.12)" },
  { name: "Verde — Staffing", hex: "#4ade80", bg: "rgba(34,197,94,0.12)" },
  { name: "Ámbar — Dev / Seguridad", hex: "#fbbf24", bg: "rgba(251,191,36,0.12)" },
  { name: "Rojo — Live / Medios", hex: "#f87171", bg: "rgba(239,68,68,0.12)" },
];

const FAMILY_COLORS: Record<string, IconColor> = {
  hex: "cyan",
  dia: "violet",
  tri: "green",
  oct: "amber",
  arc: "red",
};

export default function DesignSystemPage() {
  return (
    <div className="p-8 max-w-5xl">
      <h1 className="text-2xl font-bold mb-2">Guía de Estilos — Nivelics</h1>
      <p className="text-white/50 mb-10 text-sm">
        Sistema de diseño oficial. Usar estos tokens en todo el sitio.
      </p>

      <section className="mb-12">
        <h2 className="text-base font-semibold mb-4 text-white/60 uppercase tracking-widest text-xs">
          Paleta de colores
        </h2>
        <div className="grid grid-cols-5 gap-3">
          {COLOR_TOKENS.map((c) => (
            <div key={c.hex} className="p-3 rounded-xl border border-white/10 bg-white/[0.02]">
              <div
                className="w-full h-10 rounded-lg mb-2"
                style={{ background: c.bg, border: `1px solid ${c.hex}40` }}
              />
              <div className="text-xs font-mono" style={{ color: c.hex }}>
                {c.hex}
              </div>
              <div className="text-xs text-white/40 mt-1">{c.name}</div>
            </div>
          ))}
        </div>
      </section>

      <section className="mb-12">
        <h2 className="text-base font-semibold mb-4 text-white/60 uppercase tracking-widest text-xs">
          Sistema de íconos geométricos
        </h2>
        {(["hex", "dia", "tri", "oct", "arc"] as const).map((family) => {
          const familyIcons = Object.keys(ICON_MAP).filter((k) => k.startsWith(family));
          const color = FAMILY_COLORS[family];
          return (
            <div key={family} className="mb-6">
              <div className="text-xs text-white/40 uppercase tracking-wider mb-3">{family}</div>
              <div className="flex flex-wrap gap-3">
                {familyIcons.map((name) => (
                  <div key={name} className="flex flex-col items-center gap-2">
                    <GeoIconBox name={name} size={20} color={color} />
                    <span className="text-[10px] text-white/30 font-mono">{name}</span>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </section>

      <section className="mb-12">
        <h2 className="text-base font-semibold mb-4 text-white/60 uppercase tracking-widest text-xs">
          Botones
        </h2>
        <div className="flex gap-4 flex-wrap items-center">
          <span className="px-6 py-3 rounded-full bg-cyan-400 text-black font-semibold text-sm">
            Primario cian →
          </span>
          <span className="px-6 py-3 rounded-full border border-white/20 text-white text-sm">
            Secundario outline
          </span>
          <span className="px-6 py-3 rounded-full bg-white/[0.06] border border-white/10 text-white/70 text-sm">
            Ghost
          </span>
        </div>
      </section>

      <section>
        <h2 className="text-base font-semibold mb-4 text-white/60 uppercase tracking-widest text-xs">
          Cards
        </h2>
        <div className="grid grid-cols-3 gap-4">
          <div className="p-5 rounded-xl border border-white/[0.07] bg-white/[0.02] hover:border-cyan-400/25 transition-colors">
            <GeoIconBox name="hex-cloud" size={18} color="cyan" />
            <h3 className="text-sm font-semibold mt-3 mb-1">Card estándar</h3>
            <p className="text-xs text-white/50">Borde sutil, hover con acento del hub.</p>
          </div>
          <div className="p-5 rounded-xl border border-cyan-400/25 bg-cyan-400/[0.04]">
            <GeoIconBox name="dia-pulse" size={18} color="violet" />
            <h3 className="text-sm font-semibold mt-3 mb-1">Card activa</h3>
            <p className="text-xs text-white/50">Borde de acento, fondo tintado.</p>
          </div>
          <div className="p-5 rounded-xl border border-white/[0.07] bg-white/[0.02]">
            <div className="text-3xl font-bold text-cyan-400 tabular-nums">40%</div>
            <div className="text-xs text-white/40 mt-1">Métrica destacada</div>
          </div>
        </div>
      </section>
    </div>
  );
}
