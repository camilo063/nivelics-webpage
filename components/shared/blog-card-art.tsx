/**
 * Arte generativo para cards de blog sin cover image (Fase 1.5).
 *
 * Estilo inspirado en el blog de Anthropic: fondo tintado suave + una
 * composición geométrica bold con mucho aire. Adaptado al design system
 * Nivelics: familias GeoIcon (hexágono / rombo / arco / triángulo) sobre
 * el dark theme, con la paleta semántica por categoría.
 *
 * Determinístico: mismo post → siempre el mismo arte (hash del seed elige
 * composición, rotación y offsets). SVG puro renderizado en servidor:
 * cero peso de red, siempre nítido.
 */

interface BlogCardArtProps {
  /** Slug de la categoría (mapea a la paleta semántica; fallback cyan) */
  categorySlug?: string | null;
  /** Color hex opcional de la categoría en DB (tiene prioridad) */
  categoryColor?: string | null;
  /** Semilla de variación — usar el slug del post */
  seed: string;
  className?: string;
}

const PALETTES: Record<string, { main: string; soft: string }> = {
  ia: { main: "#8b5cf6", soft: "rgba(139,92,246,0.14)" },
  "inteligencia-artificial": { main: "#8b5cf6", soft: "rgba(139,92,246,0.14)" },
  cloud: { main: "#38bdf8", soft: "rgba(56,189,248,0.13)" },
  finops: { main: "#f59e0b", soft: "rgba(245,158,11,0.12)" },
  staffing: { main: "#00e5a0", soft: "rgba(0,229,160,0.12)" },
  "staff-augmentation": { main: "#00e5a0", soft: "rgba(0,229,160,0.12)" },
  desarrollo: { main: "#00d4ff", soft: "rgba(0,212,255,0.12)" },
  "desarrollo-digital": { main: "#00d4ff", soft: "rgba(0,212,255,0.12)" },
  negocio: { main: "#ff8a5c", soft: "rgba(255,138,92,0.12)" },
  industria: { main: "#f59e0b", soft: "rgba(245,158,11,0.12)" },
};

const DEFAULT_PALETTE = { main: "#00d4ff", soft: "rgba(0,212,255,0.12)" };

function hashSeed(seed: string): number {
  let h = 0;
  for (let i = 0; i < seed.length; i++) h = (Math.imul(31, h) + seed.charCodeAt(i)) | 0;
  return Math.abs(h);
}

function resolvePalette(categorySlug?: string | null, categoryColor?: string | null) {
  if (categoryColor && /^#[0-9a-fA-F]{6}$/.test(categoryColor)) {
    const r = parseInt(categoryColor.slice(1, 3), 16);
    const g = parseInt(categoryColor.slice(3, 5), 16);
    const b = parseInt(categoryColor.slice(5, 7), 16);
    return { main: categoryColor, soft: `rgba(${r},${g},${b},0.13)` };
  }
  if (!categorySlug) return DEFAULT_PALETTE;
  const key = categorySlug.toLowerCase();
  if (PALETTES[key]) return PALETTES[key];
  // match parcial: "ia-generativa" → ia, "cloud-aws" → cloud…
  const partial = Object.keys(PALETTES).find((k) => key.includes(k));
  return partial ? PALETTES[partial] : DEFAULT_PALETTE;
}

/* Composiciones — 4 variantes geométricas, elegidas por hash */

function HexComposition({ main }: { main: string }) {
  const hex = "42,4 76,23 76,61 42,80 8,61 8,23";
  return (
    <g>
      <g transform="translate(148,50) scale(1.35)">
        <polygon points={hex} fill="none" stroke={main} strokeWidth="2.5" opacity="0.9" />
        <polygon points={hex} fill={main} opacity="0.16" transform="translate(14,12) scale(0.82)" />
        <polygon
          points={hex}
          fill="none"
          stroke={main}
          strokeWidth="1"
          opacity="0.35"
          transform="translate(-26,-16) scale(0.5)"
        />
      </g>
      <circle cx="86" cy="150" r="3.5" fill={main} opacity="0.8" />
      <circle cx="308" cy="52" r="2.5" fill={main} opacity="0.5" />
      <line x1="60" y1="46" x2="112" y2="46" stroke={main} strokeWidth="1" opacity="0.3" />
    </g>
  );
}

function DiamondComposition({ main }: { main: string }) {
  return (
    <g>
      <g transform="translate(190,96)">
        <rect
          x="-44"
          y="-44"
          width="88"
          height="88"
          transform="rotate(45)"
          fill="none"
          stroke={main}
          strokeWidth="2.5"
          opacity="0.9"
        />
        <rect
          x="-28"
          y="-28"
          width="56"
          height="56"
          transform="rotate(45) translate(16,16)"
          fill={main}
          opacity="0.15"
        />
        <rect
          x="-14"
          y="-14"
          width="28"
          height="28"
          transform="rotate(45) translate(-38,-30)"
          fill="none"
          stroke={main}
          strokeWidth="1"
          opacity="0.4"
        />
      </g>
      <circle cx="70" cy="60" r="3" fill={main} opacity="0.7" />
      <line x1="272" y1="152" x2="318" y2="152" stroke={main} strokeWidth="1" opacity="0.3" />
    </g>
  );
}

function ArcComposition({ main }: { main: string }) {
  return (
    <g>
      <g transform="translate(196,102)">
        <circle r="58" fill="none" stroke={main} strokeWidth="2.5" opacity="0.85" />
        <path
          d="M -58 0 A 58 58 0 0 1 0 -58"
          fill="none"
          stroke={main}
          strokeWidth="7"
          opacity="0.9"
          strokeLinecap="round"
        />
        <circle r="34" fill={main} opacity="0.13" />
        <circle r="12" fill="none" stroke={main} strokeWidth="1.5" opacity="0.5" />
      </g>
      <circle cx="88" cy="46" r="2.5" fill={main} opacity="0.6" />
      <circle cx="316" cy="160" r="3.5" fill={main} opacity="0.8" />
    </g>
  );
}

function TriComposition({ main }: { main: string }) {
  return (
    <g>
      <g transform="translate(178,60)">
        <polygon
          points="52,6 100,90 4,90"
          fill="none"
          stroke={main}
          strokeWidth="2.5"
          opacity="0.9"
        />
        <polygon points="52,34 80,84 24,84" fill={main} opacity="0.16" />
        <polygon
          points="52,6 100,90 4,90"
          fill="none"
          stroke={main}
          strokeWidth="1"
          opacity="0.3"
          transform="translate(-38,28) scale(0.45)"
        />
      </g>
      <line x1="66" y1="150" x2="118" y2="150" stroke={main} strokeWidth="1" opacity="0.35" />
      <circle cx="310" cy="58" r="3" fill={main} opacity="0.7" />
    </g>
  );
}

const COMPOSITIONS = [HexComposition, DiamondComposition, ArcComposition, TriComposition];

export function BlogCardArt({ categorySlug, categoryColor, seed, className }: BlogCardArtProps) {
  const palette = resolvePalette(categorySlug, categoryColor);
  const h = hashSeed(seed);
  const Composition = COMPOSITIONS[h % COMPOSITIONS.length];
  // variación sutil por post: desplazamiento y espejado
  const flip = (h >> 3) % 2 === 1;
  const dx = ((h >> 5) % 30) - 15;

  return (
    <svg
      viewBox="0 0 400 210"
      preserveAspectRatio="xMidYMid slice"
      className={className}
      aria-hidden="true"
      role="presentation"
    >
      {/* Fondo tintado por categoría sobre el dark base */}
      <rect width="400" height="210" fill="#12121a" />
      <rect width="400" height="210" fill={palette.soft} />
      <radialGradient id={`glow-${h % 9973}`} cx="0.7" cy="0.35" r="0.8">
        <stop offset="0%" stopColor={palette.main} stopOpacity="0.14" />
        <stop offset="100%" stopColor={palette.main} stopOpacity="0" />
      </radialGradient>
      <rect width="400" height="210" fill={`url(#glow-${h % 9973})`} />
      {/* Puntos de retícula sutiles */}
      <g fill="rgba(255,255,255,0.10)">
        <circle cx="28" cy="28" r="1" />
        <circle cx="28" cy="182" r="1" />
        <circle cx="372" cy="28" r="1" />
        <circle cx="372" cy="182" r="1" />
      </g>
      <g transform={`translate(${dx},0) ${flip ? "scale(-1,1) translate(-400,0)" : ""}`}>
        <Composition main={palette.main} />
      </g>
    </svg>
  );
}
