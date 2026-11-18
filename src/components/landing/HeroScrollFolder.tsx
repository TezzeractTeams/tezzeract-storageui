"use client";

import { motion, type MotionValue } from "motion/react";

// Same folder as FolderFileStack, split into its back panel and glass flap so
// file cards can be layered between them. Position, size and flap angle are
// driven by motion values instead of hover.

interface FolderPartProps {
  y: MotionValue<number>;
  scale: MotionValue<number>;
}

export function FolderBack({ y, scale }: FolderPartProps) {
  return (
    <motion.div
      aria-hidden
      className="absolute bottom-0 left-1/2 z-0 -ml-[90px] h-[130px] w-[180px] origin-bottom rounded-2xl border border-white/10 bg-neutral-900/80 shadow-[0_0_40px_rgba(255,255,255,0.08)]"
      style={{ y, scale }}
    />
  );
}

export function FolderFlap({
  y,
  scale,
  rotateX,
}: FolderPartProps & { rotateX: MotionValue<number> }) {
  return (
    <motion.div
      aria-hidden
      className="absolute bottom-0 left-1/2 z-20 -ml-[90px] h-[112px] w-[180px] origin-bottom rounded-2xl border border-white/10 bg-neutral-700/45 shadow-[inset_0_1px_0_rgba(255,255,255,0.12),0_0_30px_rgba(255,255,255,0.06)] backdrop-blur-[5px] backdrop-brightness-[0.6]"
      style={{ y, scale, rotateX, transformPerspective: 900 }}
    />
  );
}
