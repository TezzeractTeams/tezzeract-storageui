"use client";

import { useState } from "react";

interface FolderFile {
  name: string;
  size: string;
}

interface FolderFileStackProps {
  files: FolderFile[];
}

const SKELETON_BARS = [
  ["w-full", "w-4/5", "w-full", "w-3/5"],
  ["w-3/5", "w-full", "w-full", "w-4/5"],
  ["w-full", "w-full", "w-4/5", "w-full"],
];

export default function FolderFileStack({ files }: FolderFileStackProps) {
  const [open, setOpen] = useState(false);

  // default (one sheet peeking) -> hover (flap folds down, sheets spread wide)
  const flapRotation = open ? -66 : 0;
  const mid = (files.length - 1) / 2;

  return (
    <div
      className="relative mx-auto h-[260px] w-full select-none md:h-[340px] lg:h-[480px]"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
    <div
      className="absolute inset-x-0 bottom-0 h-[260px] origin-bottom scale-[1.15] md:scale-[1.3] lg:scale-[1.9]"
      style={{ perspective: "900px" }}
    >
      {/* Back panel */}
      <div className="absolute bottom-0 left-1/2 -ml-[90px] h-[130px] w-[180px] rounded-2xl border border-white/10 bg-neutral-900/80 shadow-[0_0_40px_rgba(255,255,255,0.08)]" />

      {/* Paper sheets */}
      {files.map((file, i) => {
        const offset = i - mid;
        const translateX = open ? offset * 90 : 0;
        const translateY = open ? (offset === 0 ? -76 : -78) : 0;
        const rotate = open ? offset * 6 : 2;

        return (
          <div
            key={file.name}
            className="absolute bottom-[44px] left-1/2 -ml-[64px] flex h-[100px] w-[128px] flex-col gap-1.5 rounded-xl bg-white p-3 shadow-[0_6px_24px_-6px_rgba(0,0,0,0.7)] transition-transform duration-500 ease-out"
            style={{
              transform: `translate(${translateX}px, ${translateY}px) rotate(${rotate}deg)`,
              zIndex: open && offset === 0 ? 1 : i + 2,
              transitionDelay: `${i * 50}ms`,
            }}
          >
            <div className="flex items-center gap-2">
              <span className="h-5 w-5 shrink-0 rounded-full bg-neutral-200" />
              <div className="min-w-0">
                <p className="truncate text-[9px] font-semibold leading-tight text-neutral-700">
                  {file.name}
                </p>
                <p className="text-[8px] leading-tight text-neutral-400">{file.size}</p>
              </div>
            </div>
            {SKELETON_BARS[i % SKELETON_BARS.length].map((width, j) => (
              <span key={j} className={`h-1.5 rounded-full bg-neutral-200 ${width}`} />
            ))}
          </div>
        );
      })}

      {/* Frosted glass front flap, folds toward the viewer from its bottom edge */}
      <div
        className="absolute bottom-0 left-1/2 -ml-[90px] h-[112px] w-[180px] origin-bottom rounded-2xl border border-white/10 bg-neutral-700/45 shadow-[inset_0_1px_0_rgba(255,255,255,0.12),0_0_30px_rgba(255,255,255,0.06)] backdrop-blur-[5px] backdrop-brightness-[0.6] transition-transform duration-500 ease-out"
        style={{
          transform: `rotateX(${flapRotation}deg)`,
          zIndex: files.length + 3,
        }}
      />
    </div>
    </div>
  );
}
