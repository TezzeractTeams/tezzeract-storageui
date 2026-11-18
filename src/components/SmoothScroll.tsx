"use client";

import { useEffect } from "react";
import Lenis from "lenis";

/**
 * Inertial smooth scrolling for the whole page. Lenis still scrolls the real
 * window, so position: sticky and motion's useScroll keep working unchanged.
 */
export default function SmoothScroll() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const lenis = new Lenis({
      anchors: true,
      lerp: 0.05, // glide strength: lower = smoother and floatier, higher = snappier
      wheelMultiplier: 0.9, // distance per mouse-wheel tick
    });
    let frame = requestAnimationFrame(function raf(time) {
      lenis.raf(time);
      frame = requestAnimationFrame(raf);
    });

    return () => {
      cancelAnimationFrame(frame);
      lenis.destroy();
    };
  }, []);

  return null;
}
