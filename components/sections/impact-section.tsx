"use client";

import { useEffect, useRef, useState } from "react";
import { useInView } from "framer-motion";
import { Calendar, Globe, TrendingDown, Zap } from "lucide-react";
import { cn } from "@/lib/utils";

const IMPACT_METRICS = [
  {
    value: 13,
    suffix: "+",
    label: "Años",
    sublabel: "Fundados en 2012",
    icon: Calendar,
  },
  {
    value: 7,
    suffix: "+",
    label: "Países",
    sublabel: "Colombia, USA, México y más",
    icon: Globe,
  },
  {
    value: 40,
    suffix: "%",
    label: "Ahorro",
    sublabel: "vs. contratar en USA o Europa",
    icon: TrendingDown,
  },
  {
    value: 6,
    suffix: "",
    label: "Días",
    sublabel: "para tener tu primer perfil activo",
    icon: Zap,
  },
];

const COUNTRIES = [
  { name: "Colombia", cx: 222, cy: 285, delay: 0 },
  { name: "USA", cx: 185, cy: 135, delay: 0.3 },
  { name: "México", cx: 140, cy: 210, delay: 0.6 },
  { name: "El Salvador", cx: 155, cy: 248, delay: 0.9 },
  { name: "Panamá", cx: 190, cy: 272, delay: 1.2 },
  { name: "Ecuador", cx: 195, cy: 320, delay: 1.5 },
  { name: "Perú", cx: 200, cy: 355, delay: 1.8 },
  { name: "Argentina", cx: 230, cy: 490, delay: 2.1 },
];

function AnimatedNumber({ value, suffix }: { value: number; suffix: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!isInView) return;
    const duration = 1500;
    const steps = 50;
    const increment = value / steps;
    let current = 0;
    const timer = setInterval(() => {
      current += increment;
      if (current >= value) {
        setCount(value);
        clearInterval(timer);
      } else {
        setCount(Math.floor(current));
      }
    }, duration / steps);
    return () => clearInterval(timer);
  }, [isInView, value]);

  return (
    <span ref={ref} className="font-mono text-5xl font-bold text-primary">
      {count}
      {suffix}
    </span>
  );
}

export function ImpactSection() {
  return (
    <section
      className="bg-bg-surface py-16 md:py-24"
      data-section="presencia-geografica"
      data-countries="Colombia,USA,México,El Salvador,Panamá,Ecuador,Perú,Argentina"
      aria-label="Nivelics tiene proyectos en 7 países: Colombia, USA, México, El Salvador, Panamá, Ecuador, Perú y Argentina"
    >
      <div className="mx-auto max-w-[1280px] px-6 md:px-20">
        <div className="grid gap-12 lg:grid-cols-2 items-center">
          {/* Map */}
          <div className="relative flex items-center justify-center">
            <svg
              viewBox="0 0 400 600"
              className="h-auto w-full max-w-sm"
              role="img"
              aria-label="Mapa de América con presencia de Nivelics en 8 países"
            >
              <defs>
                <style>{`
                  @keyframes pulse-ring {
                    0% { r: 4; opacity: 0.6; }
                    70% { r: 12; opacity: 0; }
                    100% { r: 4; opacity: 0; }
                  }
                `}</style>
              </defs>

              {/* North America */}
              <path
                d="M120,60 L200,55 Q240,58 260,80 L270,100 Q260,120 240,130 L220,125 Q200,135 195,150 L200,170 Q210,180 200,195 L180,200 Q170,195 155,200 L140,215 Q130,220 120,215 L110,200 Q100,180 95,160 L90,140 Q95,120 105,100 L110,80 Z"
                fill="rgba(255,255,255,0.03)"
                stroke="rgba(255,255,255,0.08)"
                strokeWidth="0.5"
              />
              {/* Central America */}
              <path
                d="M140,215 L155,220 Q165,230 160,240 L155,250 Q160,255 165,260 L175,265 Q180,270 185,275 L190,280 Q195,278 200,275 L205,270 Q200,260 190,255 L180,240 Q170,225 160,220 Z"
                fill="rgba(255,255,255,0.03)"
                stroke="rgba(255,255,255,0.08)"
                strokeWidth="0.5"
              />
              {/* South America */}
              <path
                d="M190,280 L210,275 Q230,278 240,290 L250,310 Q255,330 250,350 L245,370 Q240,390 230,410 L225,430 Q230,450 235,470 L240,490 Q235,510 225,520 L215,530 Q205,525 200,510 L205,490 Q210,470 205,450 L195,430 Q185,410 180,390 L175,370 Q170,350 172,330 L178,310 Q185,295 190,280 Z"
                fill="rgba(255,255,255,0.03)"
                stroke="rgba(255,255,255,0.08)"
                strokeWidth="0.5"
              />

              {/* Country dots */}
              {COUNTRIES.map((c) => (
                <g key={c.name}>
                  {/* Pulse ring */}
                  <circle
                    cx={c.cx}
                    cy={c.cy}
                    r="4"
                    fill="none"
                    stroke="#00D4FF"
                    strokeWidth="1"
                    opacity="0.6"
                    style={{
                      animation: `pulse-ring 2s ease-out infinite`,
                      animationDelay: `${c.delay}s`,
                      transformOrigin: `${c.cx}px ${c.cy}px`,
                    }}
                  />
                  {/* Center dot */}
                  <circle cx={c.cx} cy={c.cy} r="4" fill="#00D4FF" opacity="0.9" />
                  {/* Label */}
                  <text
                    x={c.cx + 10}
                    y={c.cy + 4}
                    fill="rgba(255,255,255,0.7)"
                    fontSize="11"
                    fontFamily="var(--font-inter), system-ui, sans-serif"
                  >
                    {c.name}
                  </text>
                </g>
              ))}
            </svg>
          </div>

          {/* Stats */}
          <div>
            <h2 className="text-3xl font-bold text-text-100 md:text-4xl">
              13 años. 7 países. Un solo aliado.
            </h2>
            <p className="mt-3 text-base" style={{ color: "var(--text-55)" }}>
              Proyectos activos en Colombia, USA, México, El Salvador, Panamá, Ecuador, Perú y
              Argentina.
            </p>

            <div className="mt-8 grid grid-cols-2 gap-4">
              {IMPACT_METRICS.map((m) => {
                const Icon = m.icon;
                return (
                  <div
                    key={m.label}
                    className={cn(
                      "glass rounded-xl p-6 transition-all duration-200 cursor-default",
                      "border-primary/15 hover:border-primary/40 hover:bg-primary/[0.05]",
                    )}
                  >
                    <Icon size={16} className="text-primary mb-3" aria-hidden="true" />
                    <AnimatedNumber value={m.value} suffix={m.suffix} />
                    <p className="mt-2 text-sm font-medium uppercase tracking-[0.08em] text-text-70">
                      {m.label}
                    </p>
                    <p className="mt-1 text-xs text-text-40">{m.sublabel}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
