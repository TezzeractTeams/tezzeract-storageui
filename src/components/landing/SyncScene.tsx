"use client";

import { motion, useTransform, type MotionValue } from "motion/react";
import {
  SYNC_DEVICES,
  beamAmount,
  beamPath,
  devicePosition,
  deviceUnit,
  type SyncDevice,
} from "@/components/landing/heroSceneMath";

// "Sync across devices" scene: three devices, each showing the folder, line up
// under the docked folder and beams of light connect them. Rendered inside the
// hero's pinned stage (see HeroNew).

interface SceneProps {
  /** Sync-scene progress, 0 to 1. */
  syncP: MotionValue<number>;
  stageW: MotionValue<number>;
  stageH: MotionValue<number>;
}

/** Small copy of the folder with one file peeking out, shown on each device screen. */
function MiniFolder({ className = "" }: { className?: string }) {
  return (
    <span className={`relative block h-[34px] w-[44px] ${className}`}>
      <span className="absolute inset-x-0 bottom-0 h-[30px] rounded-md bg-neutral-900" />
      <span className="absolute bottom-[10px] left-1/2 flex h-[24px] w-[32px] -translate-x-1/2 flex-col gap-[2px] rounded-[4px] bg-white p-[3px] shadow-sm">
        <span className="h-[3px] w-3/5 rounded-full bg-neutral-300" />
        <span className="h-[2px] w-full rounded-full bg-neutral-200" />
      </span>
      <span className="absolute inset-x-0 bottom-0 h-[25px] rounded-md border border-white/10 bg-neutral-800" />
    </span>
  );
}

const SCREEN = "flex items-center justify-center bg-[linear-gradient(180deg,#f4f4f5_0%,#e9e9eb_100%)]";

function Laptop() {
  return (
    <span className="flex h-[110px] w-[200px] flex-col items-center">
      <span className={`h-[101px] w-[176px] rounded-t-[10px] border-[4px] border-b-[5px] border-neutral-700 ${SCREEN}`}>
        <MiniFolder />
      </span>
      <span className="relative h-[9px] w-full rounded-b-[10px] rounded-t-[2px] bg-neutral-700">
        <span className="absolute left-1/2 top-0 h-[3px] w-9 -translate-x-1/2 rounded-b bg-neutral-500" />
      </span>
    </span>
  );
}

function Tablet() {
  return (
    <span className={`relative h-[124px] w-[180px] rounded-[16px] border-[6px] border-neutral-700 ${SCREEN}`}>
      <span className="absolute -top-[8px] right-7 h-[2px] w-5 rounded-full bg-neutral-600" />
      <MiniFolder />
    </span>
  );
}

function Phone() {
  return (
    <span className={`relative h-[170px] w-[96px] rounded-[22px] border-[6px] border-neutral-700 ${SCREEN}`}>
      <span className="absolute -right-[8px] top-12 h-7 w-[2px] rounded-full bg-neutral-600" />
      <MiniFolder className="scale-[1.25]" />
      <span className="absolute bottom-[5px] left-1/2 h-[3px] w-8 -translate-x-1/2 rounded-full bg-neutral-400" />
    </span>
  );
}

const MOCKUPS = { laptop: Laptop, tablet: Tablet, phone: Phone };

function Device({ device, syncP, stageW, stageH }: SceneProps & { device: SyncDevice }) {
  const Mockup = MOCKUPS[device.id];
  const position = () => devicePosition(syncP.get(), device, stageW.get(), stageH.get());
  const x = useTransform(() => position().x);
  const y = useTransform(() => position().y);
  const scale = useTransform(() => deviceUnit(stageW.get()));

  return (
    <motion.div aria-hidden className="absolute left-0 top-0 z-[22] h-0 w-0" style={{ x, y, scale }}>
      <span className="absolute left-0 top-0 flex -translate-x-1/2 -translate-y-1/2 drop-shadow-[0_18px_30px_rgba(0,0,0,0.55)]">
        <Mockup />
      </span>
    </motion.div>
  );
}

export function SyncDevices(props: SceneProps) {
  return (
    <>
      {SYNC_DEVICES.map((device) => (
        <Device key={device.id} device={device} {...props} />
      ))}
    </>
  );
}

// The travelling light is a stack of dashes centred on the same point: long and
// faint on the outside, short and bright in the middle. Together they read as a
// streak that fades in from nothing, peaks, and fades out again, and they follow
// the beam around its corners. Lengths are shares of the beam.
const STREAK = [
  { length: 0.26, opacity: 0.22, color: "#2f8fff", width: 1 },
  { length: 0.17, opacity: 0.3, color: "#3b9dff", width: 1 },
  { length: 0.1, opacity: 0.5, color: "#6cb8ff", width: 1.25 },
  { length: 0.045, opacity: 0.9, color: "#bfe6ff", width: 1.5 },
];
const STREAK_SPAN = STREAK[0].length;
const LOOP_MS = 1900;

function StreakLayer({
  d,
  layer,
  centre,
  core,
}: {
  d: MotionValue<string>;
  layer: (typeof STREAK)[number];
  centre: MotionValue<number>;
  core: boolean;
}) {
  // A dash of this length starts at -offset along the path, so this keeps it centred on `centre`.
  const offset = useTransform(() => layer.length / 2 - centre.get());
  return (
    <motion.path
      d={d}
      pathLength={1}
      fill="none"
      stroke={layer.color}
      strokeWidth={layer.width}
      strokeLinecap="butt"
      strokeOpacity={layer.opacity}
      strokeDasharray={`${layer.length} 3`}
      filter={core ? "url(#tz-beam-glow)" : undefined}
      style={{ strokeDashoffset: offset }}
    />
  );
}

function Beam({
  device,
  index,
  syncP,
  time,
  stageW,
  stageH,
}: SceneProps & { device: SyncDevice; index: number; time: MotionValue<number> }) {
  const d = useTransform(() => beamPath(device, stageW.get(), stageH.get()));
  // The faint track draws in from the folder end as the beam amount goes 0 to 1.
  const lineOffset = useTransform(() => 1 - beamAmount(syncP.get()));
  const lineOpacity = useTransform(() => (beamAmount(syncP.get()) > 0.001 ? 1 : 0));
  // Centre of the streak, looping from just before the folder end to just past the device end.
  const centre = useTransform(() => {
    const cycle = (time.get() / LOOP_MS + index * 0.31) % 1;
    return cycle * (1 + STREAK_SPAN) - STREAK_SPAN / 2;
  });
  const streakOpacity = useTransform(() => seg01(beamAmount(syncP.get())));

  return (
    <>
      <motion.path
        d={d}
        pathLength={1}
        fill="none"
        stroke="#1A5AFF"
        strokeOpacity={0.28}
        strokeWidth={1}
        strokeLinecap="round"
        strokeDasharray="1 1"
        style={{ strokeDashoffset: lineOffset, opacity: lineOpacity }}
      />
      <motion.g style={{ opacity: streakOpacity }}>
        {STREAK.map((layer, i) => (
          <StreakLayer key={i} d={d} layer={layer} centre={centre} core={i === STREAK.length - 1} />
        ))}
      </motion.g>
    </>
  );
}

/** The streak only shows once the beam is (almost) fully drawn. */
const seg01 = (amount: number) => Math.min(1, Math.max(0, (amount - 0.9) / 0.1));

export function SyncBeams({ time, ...props }: SceneProps & { time: MotionValue<number> }) {
  return (
    <svg aria-hidden className="pointer-events-none absolute inset-0 z-[21] h-full w-full overflow-visible">
      <defs>
        {/* userSpaceOnUse: a straight vertical beam has a zero-width bounding box, which would
            collapse an objectBoundingBox filter region and hide the streak entirely. */}
        <filter id="tz-beam-glow" filterUnits="userSpaceOnUse" x="0" y="0" width="100%" height="100%">
          <feGaussianBlur stdDeviation="1" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
      {SYNC_DEVICES.map((device, i) => (
        <Beam key={device.id} device={device} index={i} time={time} {...props} />
      ))}
    </svg>
  );
}
