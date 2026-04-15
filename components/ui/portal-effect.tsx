"use client";

import { useEffect, useRef } from "react";

export function PortalEffect() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId = 0;
    let initTimer: ReturnType<typeof setTimeout> | null = null;
    let t = 0;

    const resize = () => {
      const w = canvas.offsetWidth || canvas.parentElement?.offsetWidth || 1200;
      const h = canvas.offsetHeight || canvas.parentElement?.offsetHeight || 400;
      if (w === 0 || h === 0) return;
      const dpr = window.devicePixelRatio || 1;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.scale(dpr, dpr);
    };

    const draw = () => {
      const W = canvas.offsetWidth;
      const H = canvas.offsetHeight;
      if (W === 0 || H === 0) {
        animId = requestAnimationFrame(draw);
        return;
      }

      // Fondo azul profundo
      ctx.fillStyle = "#080d1a";
      ctx.fillRect(0, 0, W, H);

      // Punto de fuga — lado derecho, centro vertical
      const vx = W * 0.72;
      const vy = H * 0.5;
      const speed = 0.006;
      const NUM_LINES = 16;
      const NUM_RINGS = 12;

      // Líneas radiales desde el punto de fuga
      for (let i = 0; i < NUM_LINES; i++) {
        const angle = (i / NUM_LINES) * Math.PI * 2;
        const progress = (i / NUM_LINES + t * speed * 0.3) % 1;
        const maxLen = Math.max(W, H) * 1.4;
        const endX = vx + Math.cos(angle) * maxLen;
        const endY = vy + Math.sin(angle) * maxLen;
        const alpha = 0.28 + progress * 0.18;

        ctx.beginPath();
        ctx.moveTo(vx, vy);
        ctx.lineTo(endX, endY);
        ctx.strokeStyle = `rgba(0,212,255,${alpha})`;
        ctx.lineWidth = 0.6;
        ctx.stroke();
      }

      // Anillos concéntricos avanzando hacia el espectador
      for (let i = 0; i < NUM_RINGS; i++) {
        const progress = (i / NUM_RINGS + t * speed) % 1;
        const eased = Math.pow(progress, 0.6);
        const r = eased * Math.max(W, H) * 1.1;

        const alpha =
          progress < 0.15
            ? (progress / 0.15) * 0.7
            : progress > 0.75
              ? ((1 - progress) / 0.25) * 0.7
              : 0.7;

        const scaleY = 0.55 + eased * 0.45;
        const lineW = 0.4 + eased * 0.8;

        ctx.save();
        ctx.translate(vx, vy);
        ctx.scale(1, scaleY);
        ctx.beginPath();
        ctx.arc(0, 0, r, 0, Math.PI * 2);
        ctx.restore();
        ctx.strokeStyle = `rgba(0,212,255,${alpha})`;
        ctx.lineWidth = lineW;
        ctx.stroke();
      }

      // Grid horizontal de perspectiva
      const GRID_H = 8;
      for (let i = 0; i < GRID_H; i++) {
        const progress = (i / GRID_H + t * speed * 1.2) % 1;
        const eased = Math.pow(progress, 0.5);
        const yOffset = (eased - 0.5) * H * 1.6;
        const y = vy + yOffset;
        const xLeft = vx - eased * W * 0.75;
        const alpha = Math.max(0, 0.42 - eased * 0.38);

        ctx.beginPath();
        ctx.moveTo(vx, vy);
        ctx.lineTo(xLeft, y);
        ctx.strokeStyle = `rgba(80,160,255,${alpha})`;
        ctx.lineWidth = 0.5;
        ctx.stroke();

        const y2 = vy - yOffset;
        ctx.beginPath();
        ctx.moveTo(vx, vy);
        ctx.lineTo(xLeft, y2);
        ctx.strokeStyle = `rgba(80,160,255,${alpha})`;
        ctx.lineWidth = 0.5;
        ctx.stroke();
      }

      // Glow central en el punto de fuga
      const glow = ctx.createRadialGradient(vx, vy, 0, vx, vy, 100);
      glow.addColorStop(0, "rgba(0,212,255,0.28)");
      glow.addColorStop(0.4, "rgba(0,100,200,0.10)");
      glow.addColorStop(1, "transparent");
      ctx.fillStyle = glow;
      ctx.fillRect(0, 0, W, H);

      // Viñeta
      const vignette = ctx.createRadialGradient(W / 2, H / 2, H * 0.3, W / 2, H / 2, H * 0.9);
      vignette.addColorStop(0, "transparent");
      vignette.addColorStop(1, "rgba(5,10,22,0.7)");
      ctx.fillStyle = vignette;
      ctx.fillRect(0, 0, W, H);

      // Fade izquierdo para proteger texto
      const fadeL = ctx.createLinearGradient(0, 0, W * 0.5, 0);
      fadeL.addColorStop(0, "#080d1a");
      fadeL.addColorStop(0.55, "rgba(8,13,26,0.92)");
      fadeL.addColorStop(1, "transparent");
      ctx.fillStyle = fadeL;
      ctx.fillRect(0, 0, W, H);

      t++;
      animId = requestAnimationFrame(draw);
    };

    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");

    const start = () => {
      cancelAnimationFrame(animId);
      resize();
      draw();
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
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      style={{
        position: "absolute",
        inset: 0,
        width: "100%",
        height: "100%",
        pointerEvents: "none",
        userSelect: "none",
        zIndex: 0,
      }}
    />
  );
}
