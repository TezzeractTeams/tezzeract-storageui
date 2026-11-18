"use client";

import { useRef } from "react";
import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
  type MotionValue,
} from "motion/react";
import { TezzeractText } from "@/components/ui/TezzeractText";

// Comparison section: a tidy cloud of Tezzeract pills next to a messy, faded cloud of what
// typical subscription storage brings. Positions are percentages of the card (pill centre),
// so the layout scales from phones to desktop. No competitor or price is named.

type Variant = "light" | "dark" | "blue";

interface Pill {
  label: string;
  x: number;
  y: number;
  rotate: number;
  variant?: Variant;
  /** Where it flies in from, in px relative to its final spot. */
  from: [number, number];
}

const OURS: Pill[] = [
  { label: "Pay per GB", x: 50, y: 11, rotate: -4, variant: "light", from: [-90, -60] },
  { label: "No subscription", x: 30, y: 25, rotate: 3, variant: "dark", from: [-120, 30] },
  { label: "Cancel anytime", x: 70, y: 29, rotate: -6, variant: "blue", from: [110, -40] },
  { label: "No minimums", x: 34, y: 42, rotate: 2, variant: "light", from: [-100, 70] },
  { label: "Only what you store", x: 64, y: 50, rotate: 4, variant: "dark", from: [120, 30] },
  { label: "Scale up or down", x: 30, y: 62, rotate: -3, variant: "blue", from: [-110, 60] },
  { label: "Pay for what you use", x: 68, y: 71, rotate: 2, variant: "light", from: [100, 90] },
  { label: "Delete files, pay less", x: 46, y: 85, rotate: -2, variant: "dark", from: [10, 110] },
];

const THEIRS: Pill[] = [
  { label: "Fixed monthly tier", x: 46, y: 11, rotate: 4, from: [60, -50] },
  { label: "Paying for unused space", x: 58, y: 26, rotate: -3, from: [-70, -20] },
  { label: "Overage fees", x: 30, y: 40, rotate: 5, from: [50, 40] },
  { label: "Forced upgrades", x: 66, y: 51, rotate: -5, from: [-60, 50] },
  { label: "Annual lock-in", x: 34, y: 63, rotate: 3, from: [70, 70] },
  { label: "Cancellation hassle", x: 62, y: 73, rotate: -4, from: [-50, 90] },
  { label: "Minimum commitment", x: 46, y: 86, rotate: 2, from: [40, 100] },
];

const VARIANTS: Record<Variant | "muted", string> = {
  light: "bg-white text-neutral-800 shadow-[0_8px_20px_-6px_rgba(0,0,0,0.5)]",
  dark: "border border-white/10 bg-[#0b1f33] text-white shadow-[0_8px_20px_-6px_rgba(0,0,0,0.6)]",
  blue: "bg-[#1A5AFF] text-white shadow-[0_8px_24px_-6px_rgba(31,125,255,0.6)]",
  muted: "border border-white/10 bg-white/[0.05] text-white/35",
};

function FlyingPill({
  pill,
  index,
  progress,
  muted,
}: {
  pill: Pill;
  index: number;
  progress: MotionValue<number>;
  muted?: boolean;
}) {
  const reduceMotion = useReducedMotion();
  // Each pill settles slightly after the one before it.
  const reveal = useTransform(progress, (p) => {
    const t = Math.min(1, Math.max(0, (p - index * 0.05) / 0.55));
    return t * t * (3 - 2 * t);
  });
  const x = useTransform(reveal, (e) => (reduceMotion ? 0 : pill.from[0] * (1 - e)));
  const y = useTransform(reveal, (e) => (reduceMotion ? 0 : pill.from[1] * (1 - e)));
  const rotate = useTransform(reveal, (e) =>
    reduceMotion ? pill.rotate : pill.rotate + (muted ? -1 : 1) * 14 * (1 - e),
  );
  const opacity = useTransform(reveal, (e) => (reduceMotion ? 1 : e));

  return (
    <div
      className="absolute -translate-x-1/2 -translate-y-1/2"
      style={{ left: `${pill.x}%`, top: `${pill.y}%` }}
    >
      <motion.div style={{ x, y, rotate, opacity }}>
        {/* The faded pills keep drifting a little, like clutter that never settles. */}
        <motion.span
          className={`block whitespace-nowrap rounded-full px-4 py-2 text-xs font-medium sm:text-sm ${
            VARIANTS[muted ? "muted" : (pill.variant ?? "light")]
          }`}
          animate={muted && !reduceMotion ? { y: [0, -4, 0, 3, 0] } : undefined}
          transition={
            muted
              ? { duration: 5 + (index % 3), repeat: Infinity, ease: "easeInOut", delay: index * 0.4 }
              : undefined
          }
        >
          {pill.label}
        </motion.span>
      </motion.div>
    </div>
  );
}

function PillCard({
  pills,
  muted,
  className,
}: {
  pills: Pill[];
  muted?: boolean;
  className: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 92%", "start 40%"] });

  return (
    <div ref={ref} className={`relative h-[360px] overflow-hidden rounded-3xl sm:h-[400px] ${className}`}>
      {pills.map((pill, i) => (
        <FlyingPill key={pill.label} pill={pill} index={i} progress={scrollYProgress} muted={muted} />
      ))}
    </div>
  );
}

export default function Pricing() {
  return (
    <section id="pricing" className="overflow-x-clip px-6 py-20 text-center">
      <span className="inline-flex rounded-full border border-white/15 px-3 py-1 text-xs font-medium opacity-80">
        Why pay-as-you-go
      </span>
      <h2 className="tz-heading mt-4 text-3xl md:text-[40px] md:leading-[1.15]">A bill that follows your files</h2>
      <TezzeractText as="p" className="mx-auto mt-3 max-w-md opacity-70">
        No plan to outgrow, no space you pay for and never use. Just the storage you actually fill,
        billed monthly.
      </TezzeractText>

      <div className="mx-auto mt-12 grid max-w-3xl gap-8 md:grid-cols-2 md:gap-6">
        <div>
          <span className="inline-flex rounded-full border border-[#00A9EE]/40 bg-[#00A9EE]/10 px-4 py-1.5 text-sm">
            The <strong className="mx-1 font-semibold">Tezzeract</strong> way
          </span>
          <PillCard
            pills={OURS}
            className="mt-4 border border-[#1A5AFF]/30 bg-[linear-gradient(180deg,#123f73_0%,#0b2a4d_100%)] shadow-[0_0_60px_-20px_rgba(31,125,255,0.6)]"
          />
        </div>
        <div>
          <span className="inline-flex rounded-full border border-white/10 px-4 py-1.5 text-sm opacity-60">
            Typical subscription storage
          </span>
          <PillCard pills={THEIRS} muted className="mt-4 border border-white/10 bg-white/[0.03]" />
        </div>
      </div>

      <TezzeractText as="p" className="mx-auto mt-10 max-w-md text-sm opacity-60">
        No minimums. No subscription. Cancel anytime — there&apos;s nothing to cancel.
      </TezzeractText>
    </section>
  );
}
