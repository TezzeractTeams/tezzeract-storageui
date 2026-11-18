"use client";

import { useEffect, useRef } from "react";

// Animated aurora glow in brand blues. Soft radial blobs orbit slowly around the
// centre of a canvas, and two brighter glows are screened on top where they meet.
// It replaces the static top glow behind the pinned hero scenes.

type Stops = [string, string, string];

// Brand blues only: #00A9EE, #00378A and #1A5AFF.
const PALETTE: Stops[] = [
  ["rgba(0, 169, 238, 0.35)", "rgba(0, 55, 138, 0.25)", "rgba(0, 0, 0, 0)"],
  ["rgba(26, 90, 255, 0.25)", "rgba(0, 0, 0, 0)", "rgba(0, 0, 0, 0)"],
];

const BLOBS = 5;
/** Canvas pixels per CSS pixel. The glow is soft, so half resolution looks the same and costs a quarter. */
const RESOLUTION = 0.5;

function draw(ctx: CanvasRenderingContext2D, w: number, h: number, t: number) {
  ctx.clearRect(0, 0, w, h);
  const big = Math.max(w, h);

  for (let i = 0; i < BLOBS; i++) {
    const [inner, middle, outer] = PALETTE[i % PALETTE.length];
    const angle = (i / BLOBS) * Math.PI * 2 + t;
    const x = w / 2 + Math.sin(angle) * w * 0.2 + Math.cos(t * 0.5) * w * 0.1;
    const y = h / 2 + Math.cos(angle * 0.7) * h * 0.2 + Math.sin(t * 0.3) * h * 0.1;
    const g = ctx.createRadialGradient(x, y, 0, x, y, big * 0.4);
    g.addColorStop(0, inner);
    g.addColorStop(0.5, middle);
    g.addColorStop(1, outer);
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, w, h);
  }

  // Brighter cores where the blobs overlap.
  ctx.globalCompositeOperation = "screen";
  for (let i = 0; i < PALETTE.length; i++) {
    const angle = (i / 2) * Math.PI + t * 0.8;
    const x = w / 2 + Math.sin(angle * 1.2) * w * 0.15;
    const y = h / 2 + Math.cos(angle * 0.9) * h * 0.15;
    const g = ctx.createRadialGradient(x, y, 0, x, y, big * 0.35);
    g.addColorStop(0, PALETTE[i][0]);
    g.addColorStop(1, "rgba(0, 0, 0, 0)");
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, w, h);
  }
  ctx.globalCompositeOperation = "source-over";
}

export default function AuroraBackground({
  speed = 0.5,
  className = "",
}: {
  /** 1 matches the reference; lower is calmer. */
  speed?: number;
  className?: string;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    const still = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let time = 0;
    let frame = 0;
    let onScreen = true;

    const resize = () => {
      canvas.width = Math.max(1, Math.round(canvas.offsetWidth * RESOLUTION));
      canvas.height = Math.max(1, Math.round(canvas.offsetHeight * RESOLUTION));
      draw(ctx, canvas.width, canvas.height, time);
    };

    const tick = () => {
      time += 0.01 * speed;
      draw(ctx, canvas.width, canvas.height, time);
      frame = requestAnimationFrame(tick);
    };
    const start = () => {
      if (still || frame || !onScreen || document.hidden) return;
      frame = requestAnimationFrame(tick);
    };
    const stop = () => {
      cancelAnimationFrame(frame);
      frame = 0;
    };

    resize();
    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(canvas);

    // Only animate while the glow is on screen and the tab is visible.
    const visibility = new IntersectionObserver(([entry]) => {
      onScreen = entry.isIntersecting;
      if (onScreen) start();
      else stop();
    });
    visibility.observe(canvas);
    const onVisibilityChange = () => (document.hidden ? stop() : start());
    document.addEventListener("visibilitychange", onVisibilityChange);

    start();
    return () => {
      stop();
      resizeObserver.disconnect();
      visibility.disconnect();
      document.removeEventListener("visibilitychange", onVisibilityChange);
    };
  }, [speed]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      className={`pointer-events-none absolute inset-0 -z-10 h-full w-full ${className}`}
    />
  );
}
