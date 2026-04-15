"use client";

import { useEffect, useRef } from "react";

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

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationId = 0;
    let initTimer: ReturnType<typeof setTimeout> | null = null;
    let nodes: Node[] = [];
    const NODE_COUNT = 32;
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
    const start = () => {
      cancelAnimationFrame(animationId);
      resize();
      if (motionQuery.matches) {
        drawStatic();
      } else {
        draw();
      }
    };

    initTimer = setTimeout(start, 50);

    const resizeObserver = new ResizeObserver(() => start());
    resizeObserver.observe(canvas);

    const onMotionChange = () => start();
    motionQuery.addEventListener("change", onMotionChange);

    return () => {
      if (initTimer) clearTimeout(initTimer);
      cancelAnimationFrame(animationId);
      resizeObserver.disconnect();
      motionQuery.removeEventListener("change", onMotionChange);
    };
  }, []);

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
        opacity: 0.55,
        pointerEvents: "none",
        userSelect: "none",
        zIndex: 1,
      }}
    />
  );
}
