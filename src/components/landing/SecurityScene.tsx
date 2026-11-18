"use client";

import { motion, useTransform, type MotionValue } from "motion/react";
import {
  secureCircle,
  secureCircleGeometry,
  secureRing,
  secureShieldFill,
  secureShieldOutline,
} from "@/components/landing/heroSceneMath";

// "Built-in security" scene: the folder shrinks inside a blue glass circle while
// a white ring draws around it, then a shield forms over the folder. Rendered
// inside the hero's pinned stage (see HeroNew), in two layers: a backdrop under
// the folder and a front layer over it.

interface SceneProps {
  /** Security-scene progress, 0 to 1. */
  secureP: MotionValue<number>;
  stageW: MotionValue<number>;
  stageH: MotionValue<number>;
}

const LAYER = "pointer-events-none absolute inset-0 h-full w-full overflow-visible";

function useCircle({ stageW, stageH }: Pick<SceneProps, "stageW" | "stageH">) {
  const geometry = () => secureCircleGeometry(stageW.get(), stageH.get());
  return {
    cx: useTransform(() => geometry().cx),
    cy: useTransform(() => geometry().cy),
    r: useTransform(() => geometry().r),
  };
}

/** The blue circle behind the folder. */
export function SecurityBackdrop({ secureP, stageW, stageH }: SceneProps) {
  const { cx, cy, r } = useCircle({ stageW, stageH });
  const opacity = useTransform(() => secureCircle(secureP.get()));

  return (
    <svg aria-hidden className={LAYER}>
      <defs>
        {/* Brand gradient, #00378A to #00A9EE at 60 degrees, kept deep so the scene stays calm. */}
        <linearGradient id="tz-secure-disc" x1="0.067" y1="0.75" x2="0.933" y2="0.25">
          <stop offset="0" stopColor="#00378A" stopOpacity="0.85" />
          <stop offset="1" stopColor="#00A9EE" stopOpacity="0.55" />
        </linearGradient>
      </defs>
      <motion.circle cx={cx} cy={cy} r={r} fill="url(#tz-secure-disc)" style={{ opacity }} />
    </svg>
  );
}

// Shield outline in a 100 x 124 box, centred on the origin.
const SHIELD_W = 100;
const SHIELD_H = 124;
function shieldPath(cx: number, cy: number, width: number) {
  const k = width / SHIELD_W;
  const x = (v: number) => (cx + (v - SHIELD_W / 2) * k).toFixed(2);
  const y = (v: number) => (cy + (v - SHIELD_H / 2) * k).toFixed(2);
  return (
    `M ${x(50)} ${y(0)} L ${x(100)} ${y(13)} V ${y(62)} ` +
    `C ${x(100)} ${y(92)} ${x(79)} ${y(112)} ${x(50)} ${y(124)} ` +
    `C ${x(21)} ${y(112)} ${x(0)} ${y(92)} ${x(0)} ${y(62)} V ${y(13)} Z`
  );
}

/** Blue tint, the ring and the shield, all drawn over the folder. */
export function SecurityFront({ secureP, stageW, stageH }: SceneProps) {
  const { cx, cy, r } = useCircle({ stageW, stageH });
  const geometry = () => secureCircleGeometry(stageW.get(), stageH.get());

  const tintOpacity = useTransform(() => 0.32 * secureCircle(secureP.get()));

  // Full circle as a path that starts at the top and runs clockwise, so the ring can be
  // trimmed from either end: it draws in clockwise, then erases clockwise from the top.
  const ringPath = useTransform(() => {
    const g = geometry();
    return `M ${g.cx} ${g.cy - g.r} A ${g.r} ${g.r} 0 1 1 ${g.cx - 0.01} ${g.cy - g.r}`;
  });
  const ringDash = useTransform(() => {
    const { start, end } = secureRing(secureP.get());
    return `0 ${start} ${Math.max(0, end - start)} 1`;
  });
  const ringOpacity = useTransform(() => {
    const { start, end } = secureRing(secureP.get());
    return end - start > 0.002 ? 1 : 0;
  });

  const shield = useTransform(() => {
    const g = geometry();
    return shieldPath(g.cx, g.cy, g.r * 0.72);
  });
  const shieldInner = useTransform(() => {
    const g = geometry();
    return shieldPath(g.cx, g.cy + g.r * 0.01, g.r * 0.72 * 0.86);
  });
  const outlineOpacity = useTransform(() => secureShieldOutline(secureP.get()));
  const fillOpacity = useTransform(() => secureShieldFill(secureP.get()));

  return (
    <svg aria-hidden className={`${LAYER} z-[23]`}>
      <defs>
        {/* Shield face: white, ice blue (#B6E6FA) and brand light blue, three stops at 60 degrees. */}
        <linearGradient id="tz-secure-shield" x1="0.067" y1="0.75" x2="0.933" y2="0.25">
          <stop offset="0.15" stopColor="#FFFFFF" />
          <stop offset="0.55" stopColor="#B6E6FA" />
          <stop offset="1" stopColor="#00A9EE" />
        </linearGradient>
        {/* Shield rim: the brand gradient, #00378A to #00A9EE at 60 degrees. */}
        <linearGradient id="tz-secure-shield-rim" x1="0.067" y1="0.75" x2="0.933" y2="0.25">
          <stop offset="0" stopColor="#00378A" />
          <stop offset="1" stopColor="#00A9EE" />
        </linearGradient>
      </defs>

      <motion.circle cx={cx} cy={cy} r={r} fill="#00378A" style={{ opacity: tintOpacity }} />

      <motion.path
        d={ringPath}
        pathLength={1}
        fill="none"
        stroke="#ffffff"
        strokeWidth={2}
        strokeLinecap="round"
        style={{ strokeDasharray: ringDash, opacity: ringOpacity }}
      />

      {/* Faint glass shield around the folder */}
      <motion.path
        d={shield}
        fill="rgba(182,230,250,0.14)"
        stroke="rgba(255,255,255,0.14)"
        strokeWidth={1}
        style={{ opacity: outlineOpacity }}
      />
      {/* Solid shield that covers the folder */}
      <motion.g style={{ opacity: fillOpacity }}>
        <motion.path d={shield} fill="url(#tz-secure-shield-rim)" />
        <motion.path d={shieldInner} fill="url(#tz-secure-shield)" />
      </motion.g>
    </svg>
  );
}
