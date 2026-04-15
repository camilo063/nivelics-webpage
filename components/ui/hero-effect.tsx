"use client";

import { useEffect, useRef } from "react";

export type HeroEffectKind = "diagonal" | "particles" | "hex" | "grid" | "radar" | "none";

interface Props {
  kind: HeroEffectKind;
  opacity?: number;
}

export function HeroEffect({ kind, opacity = 1 }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (kind === "none") return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId = 0;
    let initTimer: ReturnType<typeof setTimeout> | null = null;
    const CYAN = { r: 0, g: 212, b: 255 };
    const BG = "#0A0A0F";

    // ── state shared across resizes ──
    interface Particle {
      x: number;
      y: number;
      vy: number;
      r: number;
      alpha: number;
      pulse: number;
    }
    let particles: Particle[] = [];

    interface DiagonalLine {
      offset: number;
      speed: number;
      alpha: number;
    }
    let diagonalLines: DiagonalLine[] = [];

    let hexOffsetY = 0;
    let gridOffset = 0;
    const radarRings = [
      { r: 0, alpha: 0.8, speed: 0.8 },
      { r: 80, alpha: 0.6, speed: 0.8 },
      { r: 160, alpha: 0.4, speed: 0.8 },
      { r: 240, alpha: 0.2, speed: 0.8 },
      { r: 320, alpha: 0.1, speed: 0.8 },
    ];
    const RADAR_MAX_R = 500;

    const initParticles = (w: number, h: number) => {
      particles = Array.from({ length: 50 }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        vy: -(0.15 + Math.random() * 0.25),
        r: Math.random() < 0.3 ? 1.8 : 1.1,
        alpha: 0.2 + Math.random() * 0.4,
        pulse: Math.random() * Math.PI * 2,
      }));
    };

    const initDiagonal = () => {
      diagonalLines = Array.from({ length: 12 }, (_, i) => ({
        offset: (i / 12) * 1200,
        speed: 0.3 + Math.random() * 0.2,
        alpha: 0.08 + Math.random() * 0.12,
      }));
    };

    const resize = () => {
      const w = canvas.offsetWidth || canvas.parentElement?.offsetWidth || 1200;
      const h = canvas.offsetHeight || canvas.parentElement?.offsetHeight || 600;
      if (w === 0 || h === 0) return;
      const dpr = window.devicePixelRatio || 1;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.scale(dpr, dpr);
      if (kind === "particles") initParticles(w, h);
      if (kind === "diagonal") initDiagonal();
    };

    // ── variantes ──

    const drawDiagonal = () => {
      const w = canvas.offsetWidth;
      const h = canvas.offsetHeight;
      ctx.clearRect(0, 0, w, h);
      diagonalLines.forEach((line) => {
        line.offset = (line.offset + line.speed) % 1400;
        const x0 = line.offset - 400;
        const x1 = line.offset + 600;
        ctx.beginPath();
        ctx.moveTo(x0, 0);
        ctx.lineTo(x1, h);
        ctx.strokeStyle = `rgba(${CYAN.r},${CYAN.g},${CYAN.b},${line.alpha})`;
        ctx.lineWidth = 0.8;
        ctx.stroke();
      });
      const fadeL = ctx.createLinearGradient(0, 0, w * 0.3, 0);
      fadeL.addColorStop(0, BG);
      fadeL.addColorStop(1, "transparent");
      ctx.fillStyle = fadeL;
      ctx.fillRect(0, 0, w * 0.3, h);
      const fadeR = ctx.createLinearGradient(w * 0.7, 0, w, 0);
      fadeR.addColorStop(0, "transparent");
      fadeR.addColorStop(1, BG);
      ctx.fillStyle = fadeR;
      ctx.fillRect(w * 0.7, 0, w * 0.3, h);
      animId = requestAnimationFrame(drawDiagonal);
    };

    const drawParticles = () => {
      const w = canvas.offsetWidth;
      const h = canvas.offsetHeight;
      ctx.clearRect(0, 0, w, h);
      particles.forEach((p) => {
        p.y += p.vy;
        p.pulse += 0.02;
        if (p.y < -10) {
          p.y = h + 10;
          p.x = Math.random() * w;
        }
        const a = p.alpha * (0.7 + 0.3 * Math.sin(p.pulse));
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${CYAN.r},${CYAN.g},${CYAN.b},${a})`;
        ctx.fill();
      });
      const fadeL = ctx.createLinearGradient(0, 0, w * 0.25, 0);
      fadeL.addColorStop(0, BG);
      fadeL.addColorStop(1, "transparent");
      ctx.fillStyle = fadeL;
      ctx.fillRect(0, 0, w * 0.25, h);
      animId = requestAnimationFrame(drawParticles);
    };

    const drawHex = () => {
      const w = canvas.offsetWidth;
      const h = canvas.offsetHeight;
      ctx.clearRect(0, 0, w, h);
      hexOffsetY = (hexOffsetY + 0.25) % 52;

      const hexW = 60;
      const hexH = 52;
      const cols = Math.ceil(w / hexW) + 2;
      const rows = Math.ceil(h / hexH) + 2;

      ctx.strokeStyle = `rgba(${CYAN.r},${CYAN.g},${CYAN.b},0.18)`;
      ctx.lineWidth = 0.6;

      for (let row = -1; row < rows; row++) {
        for (let col = -1; col < cols; col++) {
          const x = col * hexW + (row % 2 === 0 ? 0 : hexW / 2);
          const y = row * hexH - hexOffsetY;
          const cx = x + hexW / 2;
          const cy = y + hexH / 2;
          const r = hexH / 2 - 2;
          ctx.beginPath();
          for (let i = 0; i < 6; i++) {
            const angle = (Math.PI / 3) * i - Math.PI / 6;
            const px = cx + r * Math.cos(angle);
            const py = cy + r * Math.sin(angle);
            if (i === 0) ctx.moveTo(px, py);
            else ctx.lineTo(px, py);
          }
          ctx.closePath();
          ctx.stroke();
        }
      }

      const fade = ctx.createRadialGradient(w * 0.1, h * 0.5, 0, w * 0.1, h * 0.5, w * 0.7);
      fade.addColorStop(0, "rgba(10,10,15,0.85)");
      fade.addColorStop(0.5, "rgba(10,10,15,0)");
      fade.addColorStop(1, "rgba(10,10,15,0.6)");
      ctx.fillStyle = fade;
      ctx.fillRect(0, 0, w, h);
      animId = requestAnimationFrame(drawHex);
    };

    const drawGrid = () => {
      const w = canvas.offsetWidth;
      const h = canvas.offsetHeight;
      ctx.clearRect(0, 0, w, h);
      gridOffset = (gridOffset + 0.4) % 80;

      ctx.strokeStyle = `rgba(${CYAN.r},${CYAN.g},${CYAN.b},0.14)`;
      ctx.lineWidth = 0.5;

      const step = 80;
      const cols = Math.ceil(w / step) + 2;
      for (let i = -1; i < cols; i++) {
        const x = i * step + (gridOffset % step);
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, h);
        ctx.stroke();
      }
      const rows = Math.ceil(h / step) + 2;
      for (let i = -1; i < rows; i++) {
        const y = i * step + (gridOffset % step);
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(w, y);
        ctx.stroke();
      }

      const fade = ctx.createLinearGradient(0, h * 0.3, 0, h);
      fade.addColorStop(0, "transparent");
      fade.addColorStop(1, BG);
      ctx.fillStyle = fade;
      ctx.fillRect(0, 0, w, h);
      animId = requestAnimationFrame(drawGrid);
    };

    const drawRadar = () => {
      const w = canvas.offsetWidth;
      const h = canvas.offsetHeight;
      ctx.clearRect(0, 0, w, h);
      const ox = w * 1.05;
      const oy = h * 0.5;
      radarRings.forEach((ring) => {
        ring.r = (ring.r + ring.speed) % RADAR_MAX_R;
        const a = (1 - ring.r / RADAR_MAX_R) * 0.5;
        ctx.beginPath();
        ctx.arc(ox, oy, ring.r, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(${CYAN.r},${CYAN.g},${CYAN.b},${a})`;
        ctx.lineWidth = 1;
        ctx.stroke();
      });

      const fade = ctx.createLinearGradient(0, 0, w * 0.5, 0);
      fade.addColorStop(0, BG);
      fade.addColorStop(0.6, "rgba(10,10,15,0)");
      ctx.fillStyle = fade;
      ctx.fillRect(0, 0, w, h);
      animId = requestAnimationFrame(drawRadar);
    };

    const drawFor = (k: HeroEffectKind) => {
      if (k === "diagonal") drawDiagonal();
      else if (k === "particles") drawParticles();
      else if (k === "hex") drawHex();
      else if (k === "grid") drawGrid();
      else if (k === "radar") drawRadar();
    };

    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");

    const start = () => {
      cancelAnimationFrame(animId);
      resize();
      drawFor(kind);
      if (motionQuery.matches) cancelAnimationFrame(animId);
    };

    initTimer = setTimeout(start, 50);

    const ro = new ResizeObserver(() => start());
    ro.observe(canvas);

    const onMotionChange = () => start();
    motionQuery.addEventListener("change", onMotionChange);

    return () => {
      if (initTimer) clearTimeout(initTimer);
      cancelAnimationFrame(animId);
      ro.disconnect();
      motionQuery.removeEventListener("change", onMotionChange);
    };
  }, [kind]);

  if (kind === "none") return null;

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      style={{
        position: "absolute",
        inset: 0,
        width: "100%",
        height: "100%",
        opacity,
        pointerEvents: "none",
        userSelect: "none",
        zIndex: 0,
      }}
    />
  );
}
