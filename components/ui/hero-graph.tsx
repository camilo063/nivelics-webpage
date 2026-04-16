"use client";

import { useEffect, useRef, useState } from "react";

interface Node {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  opacity: number;
}

export function HeroGraph() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  // Mount gated to idle time so the canvas never competes with LCP on mobile.
  const [ready, setReady] = useState(false);

  useEffect(() => {
    // Defer mount until the browser is idle — the canvas is purely decorative
    // (aria-hidden) so delaying it by a few hundred ms has no UX cost and
    // protects LCP on slower devices.
    const w = window as Window & {
      requestIdleCallback?: (cb: () => void, opts?: { timeout?: number }) => number;
      cancelIdleCallback?: (id: number) => void;
    };
    let idleId: number | null = null;
    let fallbackTimer: ReturnType<typeof setTimeout> | null = null;
    if (typeof w.requestIdleCallback === "function") {
      idleId = w.requestIdleCallback(() => setReady(true), { timeout: 2000 });
    } else {
      fallbackTimer = setTimeout(() => setReady(true), 800);
    }
    return () => {
      if (idleId != null && typeof w.cancelIdleCallback === "function") {
        w.cancelIdleCallback(idleId);
      }
      if (fallbackTimer) clearTimeout(fallbackTimer);
    };
  }, []);

  useEffect(() => {
    if (!ready) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationId = 0;
    let nodes: Node[] = [];
    // Fewer nodes on mobile — O(n²) per frame so 16 ≈ 120 pair checks vs 32 ≈ 496.
    const isMobile = window.matchMedia("(max-width: 767px)").matches;
    const NODE_COUNT = isMobile ? 16 : 32;
    const MAX_DISTANCE = 140;
    const ACCENT = { r: 0, g: 212, b: 255 };

    const initNodes = (w: number, h: number) => {
      nodes = Array.from({ length: NODE_COUNT }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        radius: Math.random() * 2 + 1.5,
        opacity: Math.random() * 0.5 + 0.4,
      }));
    };

    const resize = () => {
      const w = canvas.offsetWidth || canvas.parentElement?.offsetWidth || 800;
      const h = canvas.offsetHeight || canvas.parentElement?.offsetHeight || 500;
      if (w === 0 || h === 0) return;
      const dpr = window.devicePixelRatio || 1;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.scale(dpr, dpr);
      initNodes(w, h);
    };

    const drawStatic = () => {
      const w = canvas.offsetWidth;
      const h = canvas.offsetHeight;
      ctx.clearRect(0, 0, w, h);
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const dx = nodes[i].x - nodes[j].x;
          const dy = nodes[i].y - nodes[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < MAX_DISTANCE) {
            const alpha = (1 - dist / MAX_DISTANCE) * 0.3;
            ctx.beginPath();
            ctx.strokeStyle = `rgba(${ACCENT.r},${ACCENT.g},${ACCENT.b},${alpha})`;
            ctx.lineWidth = 0.9;
            ctx.moveTo(nodes[i].x, nodes[i].y);
            ctx.lineTo(nodes[j].x, nodes[j].y);
            ctx.stroke();
          }
        }
      }
      nodes.forEach((node) => {
        ctx.beginPath();
        ctx.arc(node.x, node.y, node.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${ACCENT.r},${ACCENT.g},${ACCENT.b},${node.opacity})`;
        ctx.fill();
      });
    };

    const draw = () => {
      const w = canvas.offsetWidth;
      const h = canvas.offsetHeight;
      ctx.clearRect(0, 0, w, h);

      nodes.forEach((node) => {
        node.x += node.vx;
        node.y += node.vy;
        if (node.x < 0 || node.x > w) node.vx *= -1;
        if (node.y < 0 || node.y > h) node.vy *= -1;
      });

      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const dx = nodes[i].x - nodes[j].x;
          const dy = nodes[i].y - nodes[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < MAX_DISTANCE) {
            const alpha = (1 - dist / MAX_DISTANCE) * 0.3;
            ctx.beginPath();
            ctx.strokeStyle = `rgba(${ACCENT.r},${ACCENT.g},${ACCENT.b},${alpha})`;
            ctx.lineWidth = 0.9;
            ctx.moveTo(nodes[i].x, nodes[i].y);
            ctx.lineTo(nodes[j].x, nodes[j].y);
            ctx.stroke();
          }
        }
      }

      nodes.forEach((node) => {
        ctx.beginPath();
        ctx.arc(node.x, node.y, node.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${ACCENT.r},${ACCENT.g},${ACCENT.b},${node.opacity})`;
        ctx.fill();
      });

      animationId = requestAnimationFrame(draw);
    };

    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    // On mobile OR with reduced-motion: single static draw, no rAF loop.
    // Saves the O(n²) per-frame work that would otherwise hog the main thread.
    const shouldAnimate = !motionQuery.matches && !isMobile;

    const start = () => {
      cancelAnimationFrame(animationId);
      resize();
      if (shouldAnimate) {
        draw();
      } else {
        drawStatic();
      }
    };

    start();

    const resizeObserver = new ResizeObserver(() => start());
    resizeObserver.observe(canvas);

    const onMotionChange = () => start();
    motionQuery.addEventListener("change", onMotionChange);

    // Pause animation when the canvas leaves the viewport.
    let io: IntersectionObserver | null = null;
    if (shouldAnimate && typeof IntersectionObserver !== "undefined") {
      io = new IntersectionObserver(
        (entries) => {
          for (const entry of entries) {
            if (entry.isIntersecting) {
              if (!animationId) draw();
            } else {
              cancelAnimationFrame(animationId);
              animationId = 0;
            }
          }
        },
        { threshold: 0 },
      );
      io.observe(canvas);
    }

    return () => {
      cancelAnimationFrame(animationId);
      resizeObserver.disconnect();
      motionQuery.removeEventListener("change", onMotionChange);
      if (io) io.disconnect();
    };
  }, [ready]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="hero-graph-canvas"
      style={{
        position: "absolute",
        inset: 0,
        width: "100%",
        height: "100%",
        opacity: ready ? 0.55 : 0,
        transition: "opacity 300ms ease-out",
        pointerEvents: "none",
        userSelect: "none",
        zIndex: 1,
        contentVisibility: "auto",
      }}
    />
  );
}
