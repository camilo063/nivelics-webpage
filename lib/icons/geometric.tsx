import React from "react";

export type IconColor = "cyan" | "violet" | "green" | "amber" | "red";

const COLORS: Record<IconColor, { stroke: string; fill: string; border: string }> = {
  cyan: { stroke: "#00D4FF", fill: "rgba(0,212,255,0.12)", border: "rgba(0,212,255,0.22)" },
  violet: { stroke: "#a78bfa", fill: "rgba(139,92,246,0.10)", border: "rgba(139,92,246,0.22)" },
  green: { stroke: "#4ade80", fill: "rgba(34,197,94,0.10)", border: "rgba(34,197,94,0.22)" },
  amber: { stroke: "#fbbf24", fill: "rgba(251,191,36,0.10)", border: "rgba(251,191,36,0.22)" },
  red: { stroke: "#f87171", fill: "rgba(239,68,68,0.10)", border: "rgba(239,68,68,0.22)" },
};

const HEX: React.FC<{ c: IconColor }> = ({ c }) => {
  const { stroke, fill } = COLORS[c];
  return (
    <polygon
      points="12,2 20.7,7 20.7,17 12,22 3.3,17 3.3,7"
      fill={fill}
      stroke={stroke}
      strokeWidth=".8"
      strokeOpacity=".55"
    />
  );
};
const DIA: React.FC<{ c: IconColor }> = ({ c }) => {
  const { stroke, fill } = COLORS[c];
  return (
    <path
      d="M12 3L21 12L12 21L3 12Z"
      fill={fill}
      stroke={stroke}
      strokeWidth=".8"
      strokeOpacity=".55"
    />
  );
};
const TRI: React.FC<{ c: IconColor }> = ({ c }) => {
  const { stroke, fill } = COLORS[c];
  return (
    <path
      d="M12 4L20 18H4L12 4Z"
      fill={fill}
      stroke={stroke}
      strokeWidth=".8"
      strokeOpacity=".55"
    />
  );
};
const OCT: React.FC<{ c: IconColor }> = ({ c }) => {
  const { stroke, fill } = COLORS[c];
  return (
    <polygon
      points="9,3 15,3 21,9 21,15 15,21 9,21 3,15 3,9"
      fill={fill}
      stroke={stroke}
      strokeWidth=".8"
      strokeOpacity=".55"
    />
  );
};
const ARC: React.FC<{ c: IconColor }> = ({ c }) => {
  const { stroke, fill } = COLORS[c];
  return (
    <circle
      cx="12"
      cy="12"
      r="8.5"
      fill={fill}
      stroke={stroke}
      strokeWidth=".8"
      strokeOpacity=".45"
    />
  );
};

type IconProps = { size?: number; color?: IconColor };

function icon(
  shape: "hex" | "dia" | "tri" | "oct" | "arc",
  defaultColor: IconColor,
  Symbol: React.FC<{ s: string }>,
) {
  return function Icon({ size = 24, color }: IconProps) {
    const c = color ?? defaultColor;
    const s = COLORS[c].stroke;
    const ShapeComp =
      shape === "hex"
        ? HEX
        : shape === "dia"
          ? DIA
          : shape === "tri"
            ? TRI
            : shape === "oct"
              ? OCT
              : ARC;
    return (
      <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        aria-hidden="true"
        style={{ display: "block" }}
      >
        <ShapeComp c={c} />
        <Symbol s={s} />
      </svg>
    );
  };
}

export const IconHexCheck = icon("hex", "cyan", ({ s }) => (
  <path
    d="M7.5 12l3 3 5-5"
    stroke={s}
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  />
));
export const IconHexPlus = icon("hex", "cyan", ({ s }) => (
  <path d="M8 12h8M12 8v8" stroke={s} strokeWidth="1.4" strokeLinecap="round" />
));
export const IconHexCloud = icon("hex", "cyan", ({ s }) => (
  <>
    <path
      d="M8.5 14c0-1.9 1.6-3.5 3.5-3.5s3.5 1.6 3.5 3.5"
      stroke={s}
      strokeWidth="1.4"
      strokeLinecap="round"
      fill="none"
    />
    <circle cx="12" cy="10" r="1.2" fill={s} />
  </>
));
export const IconHexData = icon("hex", "cyan", ({ s }) => (
  <path d="M8 9h8M8 12h5M8 15h6" stroke={s} strokeWidth="1.3" strokeLinecap="round" />
));
export const IconHexNodes = icon("hex", "cyan", ({ s }) => (
  <>
    <circle cx="12" cy="12" r="1.5" fill={s} />
    <circle cx="8" cy="10" r="1" fill={s} fillOpacity=".5" />
    <circle cx="16" cy="10" r="1" fill={s} fillOpacity=".5" />
    <circle cx="8" cy="14" r="1" fill={s} fillOpacity=".5" />
    <circle cx="16" cy="14" r="1" fill={s} fillOpacity=".5" />
    <line x1="9" y1="10.5" x2="11" y2="11.5" stroke={s} strokeWidth=".7" strokeOpacity=".5" />
    <line x1="13" y1="12.5" x2="15" y2="13.5" stroke={s} strokeWidth=".7" strokeOpacity=".5" />
  </>
));
export const IconHexChart = icon("hex", "cyan", ({ s }) => (
  <path
    d="M8.5 15l2-4 2 2 2-5"
    stroke={s}
    strokeWidth="1.3"
    strokeLinecap="round"
    strokeLinejoin="round"
    fill="none"
  />
));
export const IconHexTime = icon("hex", "cyan", ({ s }) => (
  <>
    <circle cx="12" cy="12" r="4.5" stroke={s} strokeWidth=".9" fill="none" strokeOpacity=".4" />
    <path
      d="M12 9v3l2 2"
      stroke={s}
      strokeWidth="1.4"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </>
));
export const IconHexCycle = icon("hex", "cyan", ({ s }) => (
  <path
    d="M8 12a4 4 0 0 1 4-4 4 4 0 0 1 4 4 4 4 0 0 1-4 4"
    stroke={s}
    strokeWidth="1.4"
    strokeLinecap="round"
    fill="none"
    strokeDasharray="2.5 1.8"
  />
));
export const IconHexMigrate = icon("hex", "cyan", ({ s }) => (
  <path
    d="M9 12h7M13 9l3 3-3 3"
    stroke={s}
    strokeWidth="1.4"
    strokeLinecap="round"
    strokeLinejoin="round"
  />
));

export const IconDiaCheck = icon("dia", "violet", ({ s }) => (
  <path
    d="M7.5 12l3 3 5-5"
    stroke={s}
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  />
));
export const IconDiaPulse = icon("dia", "violet", ({ s }) => (
  <>
    <circle cx="12" cy="12" r="2.5" fill={s} fillOpacity=".6" />
    <line x1="12" y1="6.5" x2="12" y2="9.5" stroke={s} strokeWidth="1.3" strokeLinecap="round" />
    <line x1="17.5" y1="12" x2="14.5" y2="12" stroke={s} strokeWidth="1.3" strokeLinecap="round" />
    <line x1="6.5" y1="12" x2="9.5" y2="12" stroke={s} strokeWidth="1.3" strokeLinecap="round" />
  </>
));
export const IconDiaFlow = icon("dia", "violet", ({ s }) => (
  <>
    <path d="M8 12h8" stroke={s} strokeWidth="1.3" strokeLinecap="round" />
    <path
      d="M8 9.5l4 5 4-5"
      stroke={s}
      strokeWidth="1"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeOpacity=".6"
    />
  </>
));
export const IconDiaSearch = icon("dia", "violet", ({ s }) => (
  <>
    <circle cx="10.5" cy="11" r="2.8" stroke={s} strokeWidth="1.3" fill="none" />
    <line
      x1="12.8"
      y1="13.3"
      x2="15.5"
      y2="16"
      stroke={s}
      strokeWidth="1.5"
      strokeLinecap="round"
    />
  </>
));
export const IconDiaTrend = icon("dia", "violet", ({ s }) => (
  <path
    d="M8 15l2-4.5 2 2.5 2-4.5 2 2"
    stroke={s}
    strokeWidth="1.3"
    strokeLinecap="round"
    strokeLinejoin="round"
    fill="none"
  />
));
export const IconDiaLight = icon("dia", "violet", ({ s }) => (
  <>
    <path
      d="M10 14.5c0-1.1.9-2 2-2s2 .9 2 2"
      stroke={s}
      strokeWidth="1.3"
      strokeLinecap="round"
      fill="none"
    />
    <line x1="12" y1="7.5" x2="12" y2="12.5" stroke={s} strokeWidth="1.3" strokeLinecap="round" />
  </>
));
export const IconDiaTarget = icon("dia", "violet", ({ s }) => (
  <>
    <circle cx="12" cy="12" r="3" stroke={s} strokeWidth="1.1" fill="none" />
    <circle cx="12" cy="12" r="1.2" fill={s} fillOpacity=".7" />
  </>
));

export const IconTriPerson = icon("tri", "green", ({ s }) => (
  <>
    <circle cx="12" cy="10.5" r="2" stroke={s} strokeWidth="1.2" fill={s} fillOpacity=".2" />
    <path
      d="M8.5 16.5c0-1.9 1.6-3.5 3.5-3.5s3.5 1.6 3.5 3.5"
      stroke={s}
      strokeWidth="1.2"
      strokeLinecap="round"
      fill="none"
    />
  </>
));
export const IconTriDeploy = icon("tri", "green", ({ s }) => (
  <>
    <path d="M12 8v7" stroke={s} strokeWidth="1.5" strokeLinecap="round" />
    <path
      d="M9 13l3 3 3-3"
      stroke={s}
      strokeWidth="1.4"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </>
));
export const IconTriGrowth = icon("tri", "green", ({ s }) => (
  <path
    d="M8.5 15.5l2-5 2.5 3 2-5"
    stroke={s}
    strokeWidth="1.3"
    strokeLinecap="round"
    strokeLinejoin="round"
    fill="none"
  />
));
export const IconTriAlert = icon("tri", "green", ({ s }) => (
  <>
    <line x1="12" y1="9" x2="12" y2="14" stroke={s} strokeWidth="1.6" strokeLinecap="round" />
    <circle cx="12" cy="16.5" r=".9" fill={s} />
  </>
));
export const IconTriCheck = icon("tri", "green", ({ s }) => (
  <path
    d="M8.5 13l2.5 2.5 5-5"
    stroke={s}
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  />
));
export const IconTriRocket = icon("tri", "green", ({ s }) => (
  <>
    <path d="M12 8l2 4H10l2-4z" fill={s} fillOpacity=".3" stroke={s} strokeWidth=".8" />
    <line x1="12" y1="12" x2="12" y2="16" stroke={s} strokeWidth="1.5" strokeLinecap="round" />
  </>
));

export const IconOctShield = icon("oct", "amber", ({ s }) => (
  <path
    d="M12 8.5c-1.7 0-3 1.3-3 3v3h6v-3c0-1.7-1.3-3-3-3z"
    stroke={s}
    strokeWidth="1.1"
    fill={s}
    fillOpacity=".15"
    strokeLinejoin="round"
  />
));
export const IconOctLock = icon("oct", "amber", ({ s }) => (
  <>
    <rect
      x="8.5"
      y="11"
      width="7"
      height="5"
      rx="1"
      stroke={s}
      strokeWidth="1.1"
      fill={s}
      fillOpacity=".12"
    />
    <path d="M10 11V9.5a2 2 0 0 1 4 0V11" stroke={s} strokeWidth="1.1" strokeLinecap="round" />
  </>
));
export const IconOctMonitor = icon("oct", "amber", ({ s }) => (
  <path
    d="M8 13.5h1.5l1.5-3.5 2 7 1.5-4.5H17"
    stroke={s}
    strokeWidth="1.3"
    strokeLinecap="round"
    strokeLinejoin="round"
    fill="none"
  />
));
export const IconOctScan = icon("oct", "amber", ({ s }) => (
  <>
    <circle cx="11" cy="11.5" r="2.8" stroke={s} strokeWidth="1.2" fill="none" />
    <line x1="13.5" y1="14" x2="15.5" y2="16" stroke={s} strokeWidth="1.5" strokeLinecap="round" />
  </>
));
export const IconOctCube = icon("oct", "amber", ({ s }) => (
  <>
    <path
      d="M12 8l4 2v4l-4 2-4-2v-4l4-2z"
      stroke={s}
      strokeWidth="1.1"
      fill={s}
      fillOpacity=".12"
      strokeLinejoin="round"
    />
    <line x1="12" y1="8" x2="12" y2="16" stroke={s} strokeWidth=".8" strokeOpacity=".4" />
  </>
));
export const IconOctCode = icon("oct", "amber", ({ s }) => (
  <>
    <path
      d="M9.5 9.5L7 12l2.5 2.5M14.5 9.5L17 12l-2.5 2.5"
      stroke={s}
      strokeWidth="1.3"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <line
      x1="13"
      y1="9"
      x2="11"
      y2="15"
      stroke={s}
      strokeWidth="1.1"
      strokeLinecap="round"
      strokeOpacity=".6"
    />
  </>
));

export const IconArcLive = icon("arc", "red", ({ s }) => (
  <>
    <path
      d="M12 4 A8 8 0 0 1 20 12"
      stroke={s}
      strokeWidth="1.6"
      strokeLinecap="round"
      fill="none"
    />
    <circle cx="12" cy="12" r="2.2" fill={s} fillOpacity=".55" />
  </>
));
export const IconArcPlay = icon("arc", "red", ({ s }) => (
  <path
    d="M10 8.5l6 3.5-6 3.5V8.5z"
    fill={s}
    fillOpacity=".7"
    stroke={s}
    strokeWidth=".5"
    strokeLinejoin="round"
  />
));
export const IconArcWave = icon("arc", "red", ({ s }) => (
  <path
    d="M7.5 12h1.5l1.5-3.5 2.5 7 1.5-4.5H17"
    stroke={s}
    strokeWidth="1.4"
    strokeLinecap="round"
    strokeLinejoin="round"
    fill="none"
  />
));
export const IconArcPerson = icon("arc", "red", ({ s }) => (
  <>
    <circle cx="12" cy="10" r="2.2" stroke={s} strokeWidth="1.2" fill={s} fillOpacity=".18" />
    <path
      d="M8 17.5c0-2.2 1.8-4 4-4s4 1.8 4 4"
      stroke={s}
      strokeWidth="1.2"
      strokeLinecap="round"
      fill="none"
    />
  </>
));
export const IconArcDoc = icon("arc", "red", ({ s }) => (
  <path d="M8 9.5h8M8 12.5h5.5M8 15.5h7" stroke={s} strokeWidth="1.3" strokeLinecap="round" />
));
export const IconArcBroadcast = icon("arc", "red", ({ s }) => (
  <>
    <path
      d="M9 9a4.2 4.2 0 0 0 0 6M15 9a4.2 4.2 0 0 1 0 6"
      stroke={s}
      strokeWidth="1.3"
      strokeLinecap="round"
      fill="none"
      strokeOpacity=".6"
    />
    <circle cx="12" cy="12" r="1.5" fill={s} />
  </>
));

export const ICON_MAP: Record<string, React.FC<IconProps>> = {
  "hex-check": IconHexCheck,
  "hex-plus": IconHexPlus,
  "hex-cloud": IconHexCloud,
  "hex-data": IconHexData,
  "hex-nodes": IconHexNodes,
  "hex-chart": IconHexChart,
  "hex-time": IconHexTime,
  "hex-cycle": IconHexCycle,
  "hex-migrate": IconHexMigrate,
  "dia-check": IconDiaCheck,
  "dia-pulse": IconDiaPulse,
  "dia-flow": IconDiaFlow,
  "dia-search": IconDiaSearch,
  "dia-trend": IconDiaTrend,
  "dia-light": IconDiaLight,
  "dia-target": IconDiaTarget,
  "tri-person": IconTriPerson,
  "tri-deploy": IconTriDeploy,
  "tri-growth": IconTriGrowth,
  "tri-alert": IconTriAlert,
  "tri-check": IconTriCheck,
  "tri-rocket": IconTriRocket,
  "oct-shield": IconOctShield,
  "oct-lock": IconOctLock,
  "oct-monitor": IconOctMonitor,
  "oct-scan": IconOctScan,
  "oct-cube": IconOctCube,
  "oct-code": IconOctCode,
  "arc-live": IconArcLive,
  "arc-play": IconArcPlay,
  "arc-wave": IconArcWave,
  "arc-person": IconArcPerson,
  "arc-doc": IconArcDoc,
  "arc-broadcast": IconArcBroadcast,
};

export const LUCIDE_TO_GEO: Record<string, string> = {
  bot: "dia-pulse",
  zap: "tri-rocket",
  brain: "dia-pulse",
  target: "dia-target",
  "file-text": "arc-doc",
  settings: "dia-flow",
  sparkles: "dia-light",
  server: "hex-migrate",
  cloud: "hex-cloud",
  layers: "hex-nodes",
  "dollar-sign": "hex-chart",
  shield: "oct-shield",
  "shield-check": "tri-check",
  "shield-alert": "oct-scan",
  gauge: "hex-chart",
  "clipboard-check": "hex-check",
  "file-code": "oct-code",
  code: "oct-code",
  "git-merge": "tri-deploy",
  "test-tube": "tri-check",
  users: "tri-person",
  "user-check": "tri-person",
  "pen-tool": "dia-search",
  database: "dia-trend",
  lock: "oct-lock",
  activity: "oct-monitor",
  "trending-up": "tri-growth",
  search: "dia-search",
  globe: "hex-nodes",
  smartphone: "tri-rocket",
  "shopping-cart": "hex-plus",
  layout: "oct-cube",
  monitor: "oct-cube",
};

export function resolveIcon(name?: string | null, fallback = "hex-plus"): string {
  if (!name) return fallback;
  if (ICON_MAP[name]) return name;
  if (LUCIDE_TO_GEO[name]) return LUCIDE_TO_GEO[name];
  return fallback;
}

export function GeoIcon({
  name,
  size = 24,
  color,
  fallback = "hex-plus",
}: {
  name?: string | null;
  size?: number;
  color?: IconColor;
  fallback?: string;
}) {
  const resolved = resolveIcon(name, fallback);
  const Icon = ICON_MAP[resolved] ?? ICON_MAP[fallback]!;
  return <Icon size={size} color={color} />;
}

export function GeoIconBox({
  name,
  size = 24,
  color,
}: {
  name?: string | null;
  size?: number;
  color?: IconColor;
}) {
  const c = color ?? "cyan";
  const { border, fill } = COLORS[c];
  return (
    <div
      style={{
        width: size + 16,
        height: size + 16,
        borderRadius: Math.round((size + 16) * 0.27) + "px",
        background: fill,
        border: `1px solid ${border}`,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexShrink: 0,
      }}
    >
      <GeoIcon name={name} size={size} color={color} />
    </div>
  );
}
