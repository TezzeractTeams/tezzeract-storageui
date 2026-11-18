"use client";

import { useLayoutEffect, useRef, useState } from "react";
import {
  motion,
  useMotionValue,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useTime,
  useTransform,
  type MotionValue,
} from "motion/react";
import { TezzeractButton } from "@/components/ui/TezzeractButton";
import { TezzeractButtonLight } from "@/components/ui/TezzeractButtonLight";
import { TezzeractH1 } from "@/components/ui/TezzeractH1";
import { TezzeractText } from "@/components/ui/TezzeractText";
import { FolderBack, FolderFlap } from "@/components/landing/HeroScrollFolder";
import { FeatureCopy, SharingCursors, FeaturesStatic } from "@/components/landing/FeaturesNew";
import { SyncBeams, SyncDevices } from "@/components/landing/SyncScene";
import SlidingNumber from "@/components/landing/SlidingNumber";
import AuroraBackground from "@/components/landing/AuroraBackground";
import { TIERS } from "@/components/landing/CostCalculator";
import { SecurityBackdrop, SecurityFront } from "@/components/landing/SecurityScene";
import {
  CARD_FIT,
  descriptionTop,
  headingTop,
  isMobile,
  CARD_REST,
  GRABS,
  HERO_END,
  SHARE_END,
  SYNC_END,
  SECURE_END,
  syncTimeline,
  MOBILE_MAX,
  ease,
  folderFullY,
  folderRestScale,
  folderRestY,
  folderScale,
  folderTarget,
  grabMotion,
  lerp,
  seg,
  type Grab,
} from "@/components/landing/heroSceneMath";

interface FloatingFile {
  name: string;
  size: string;
  /** Start position on desktop, as a fraction of the stage (card centre). */
  at: [number, number];
  /** Start position on phones; null hides the card there. */
  mobileAt: [number, number] | null;
  scale: number;
  tilt: number;
}

// Order is also the order the cards fly into the folder.
const FILES: FloatingFile[] = [
  { name: "notes.docx", size: "84 KB", at: [0.417, 0.08], mobileAt: [0.5, 0.04], scale: 0.6, tilt: -5 },
  { name: "brief.pdf", size: "2.1 MB", at: [0.145, 0.14], mobileAt: [0.15, 0.05], scale: 1.25, tilt: -8 },
  { name: "clip.mp4", size: "1.2 GB", at: [0.712, 0.09], mobileAt: [0.85, 0.05], scale: 0.95, tilt: 6 },
  { name: "song.mp3", size: "7.4 MB", at: [0.85, 0.205], mobileAt: null, scale: 0.75, tilt: -4 },
  { name: "photos/", size: "8.4 GB", at: [0.11, 0.42], mobileAt: null, scale: 0.95, tilt: 5 },
  { name: "backup.zip", size: "16.7 GB", at: [0.884, 0.585], mobileAt: [0.87, 0.8], scale: 1.3, tilt: 7 },
  { name: "logo.fig", size: "12 MB", at: [0.14, 0.68], mobileAt: [0.13, 0.81], scale: 1.15, tilt: -6 },
  { name: "data.csv", size: "640 KB", at: [0.29, 0.76], mobileAt: [0.32, 0.125], scale: 0.6, tilt: 4 },
  { name: "site.html", size: "18 KB", at: [0.77, 0.77], mobileAt: [0.68, 0.125], scale: 0.9, tilt: -5 },
];

/** When card `index` flies into the folder, as a window of the hero progress. */
const flightWindow = (index: number) => {
  const start = 0.2 + index * 0.045;
  return [start, start + 0.27] as const;
};

const SIZE_UNITS: Record<string, number> = { KB: 1e-6, MB: 1e-3, GB: 1 };
/** "16.7 GB" -> 16.7, "84 KB" -> 0.000084 */
const sizeToGb = (size: string) => {
  const [amount, unit] = size.split(" ");
  return Number(amount) * (SIZE_UNITS[unit] ?? 0);
};

// Monthly rate for the "sometimes" access tier, the same one the calculator starts on.
const READOUT_RATE = TIERS.find((t) => t.id === "sometimes")!.rate;

const SKELETON_BARS = [
  ["w-full", "w-4/5", "w-full", "w-3/5"],
  ["w-3/5", "w-full", "w-full", "w-4/5"],
  ["w-full", "w-full", "w-4/5", "w-full"],
];

/** Fade-up entrance: each block fades in while rising 24px, staggered by `order`. */
function Reveal({
  order,
  animate,
  children,
}: {
  order: number;
  animate: boolean;
  children: React.ReactNode;
}) {
  if (!animate) return <div className="w-full">{children}</div>;
  return (
    <motion.div
      className="w-full"
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, delay: 0.1 + order * 0.12, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}

function HeroCopy({ animate = false }: { animate?: boolean }) {
  return (
    <>
      <Reveal order={0} animate={animate}>
        <span className="inline-flex items-center gap-2 rounded-full border border-white/15 px-3 py-1 text-xs font-medium opacity-80">
          Pay-as-you-go · No subscription
        </span>
      </Reveal>

      <Reveal order={1} animate={animate}>
        <TezzeractH1
          className="mt-6 md:text-center lg:text-[clamp(40px,5vw,64px)] lg:leading-[1.1]"
          style={{ backgroundImage: "linear-gradient(60deg, #FFFFFF 0%, #B6E6FA 100%)" }}
        >
          Your files, stored simply.
          <br />
          Pay only for what you use.
        </TezzeractH1>
      </Reveal>

      <Reveal order={2} animate={animate}>
        <TezzeractText as="p" className="mx-auto mt-6 max-w-xl text-lg opacity-70">
          No subscriptions. No tiers you don&apos;t need. Tezzeract Storage
          charges you for the space you actually fill — nothing more.
        </TezzeractText>
      </Reveal>

      <Reveal order={3} animate={animate}>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
          <a href="#get-started">
            <TezzeractButton>Get started free</TezzeractButton>
          </a>
          <a href="#calculator">
            <TezzeractButtonLight>Calculate cost</TezzeractButtonLight>
          </a>
        </div>
      </Reveal>

      <Reveal order={4} animate={animate}>
        <TezzeractText as="p" className="mt-6 text-sm opacity-50">
          No credit card required · Cancel anytime, there&apos;s nothing to cancel
        </TezzeractText>
      </Reveal>
    </>
  );
}

// Animated brand-blue aurora, faded out toward the bottom and sides so it sits where the old
// static glow was: strongest around the top centre of the stage.
const GLOW_MASK = "radial-gradient(ellipse 70% 65% at 50% 22%, #000 30%, transparent 100%)";

function Glow() {
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[85%] opacity-80"
      style={{ maskImage: GLOW_MASK, WebkitMaskImage: GLOW_MASK }}
    >
      <AuroraBackground />
    </div>
  );
}

function FileCard({
  file,
  index,
  progress,
  shareP,
  syncP,
  secureP,
  exitP,
  grab,
  time,
  stageW,
  stageH,
}: {
  file: FloatingFile;
  index: number;
  /** Hero progress: the card flying into the folder. */
  progress: MotionValue<number>;
  /** Sharing progress: the card being taken back out, if someone grabs it. */
  shareP: MotionValue<number>;
  /** Sync progress: the folder (and the cards in it) shrinking to dock under the heading. */
  syncP: MotionValue<number>;
  /** Security progress: the folder shrinking into the shield. */
  secureP: MotionValue<number>;
  /** Exit progress: the folder coming down to the next section. */
  exitP: MotionValue<number>;
  grab?: Grab;
  time: MotionValue<number>;
  stageW: MotionValue<number>;
  stageH: MotionValue<number>;
}) {
  const [flightStart, flightEnd] = flightWindow(index);
  const endTilt = ((index % 3) - 1) * 2;

  const startOf = (w: number) => {
    const mobile = w < MOBILE_MAX;
    return {
      at: mobile ? file.mobileAt : file.at,
      scale: mobile ? 0.55 : file.scale,
    };
  };

  const local = () => seg(progress.get(), flightStart, flightEnd);
  const grabbed = () =>
    grab ? grabMotion(shareP.get(), grab, stageW.get(), stageH.get()) : null;

  const x = useTransform(() => {
    const w = stageW.get();
    const t = local();
    const dx = grabbed()?.dx ?? 0;
    const { at } = startOf(w);
    if (!at) return 0;
    return (at[0] - 0.5) * w * (1 - ease(seg(t, 0, 0.7))) + dx;
  });

  const y = useTransform(() => {
    const w = stageW.get();
    const h = stageH.get();
    const t = local();
    // Read every input before any early return: the value only re-runs for the
    // motion values it read on its first run (when the stage is still unmeasured).
    const now = time.get();
    const folder = folderTarget(w, h, syncP.get(), secureP.get(), exitP.get());
    const g = grabbed();
    const start = startOf(w);
    if (!start.at) return 0;
    const s = folderScale(w);
    const bob = Math.sin(now / 900 + index * 1.7) * 6 * (1 - seg(t, 0, 0.15));
    const startY = start.at[1] * h + 50 * start.scale - h + bob;
    const endY = folder.y - CARD_REST * folder.scale;
    const aboveY = endY - 72 * s;
    const flight =
      t < 0.65
        ? lerp(startY, aboveY, ease(t / 0.65))
        : lerp(aboveY, endY, ease((t - 0.65) / 0.35));
    return g ? flight - g.lift + g.dy : flight;
  });

  const scale = useTransform(() => {
    const w = stageW.get();
    const folder = folderTarget(w, stageH.get(), syncP.get(), secureP.get(), exitP.get());
    const stored = lerp(startOf(w).scale, folder.scale * CARD_FIT, ease(seg(local(), 0, 0.65)));
    return stored * lerp(1, 0.82, grabbed()?.dragged ?? 0);
  });

  const rotate = useTransform(
    () =>
      lerp(file.tilt, endTilt, ease(seg(local(), 0, 0.65))) +
      (grab ? grab.tilt * (grabbed()?.dragged ?? 0) : 0),
  );
  // Stored cards sit behind the glass flap; a card someone is holding comes in front of it.
  const zIndex = useTransform(() => (grab && shareP.get() >= grab.drag[0] ? 25 : 10));

  // In the resting hero the cards are frosted glass; as soon as the scroll scene starts they
  // cross-fade to the solid white cards used in the rest of the scenes.
  const solid = useTransform(() => ease(seg(progress.get(), 0.02, 0.16)));
  const glass = useTransform(() => 1 - solid.get());

  return (
    <motion.div
      aria-hidden
      className={`absolute bottom-0 left-1/2 -ml-[64px] h-[100px] w-[128px] origin-bottom ${
        file.mobileAt ? "block" : "hidden md:block"
      }`}
      style={{ x, y, scale, rotate, zIndex }}
    >
      <motion.div
        className="absolute inset-0 rounded-xl bg-white shadow-[0_6px_24px_-6px_rgba(0,0,0,0.7)]"
        style={{ opacity: solid }}
      >
        <CardFace name={file.name} size={file.size} index={index} />
      </motion.div>
      <motion.div
        className="absolute inset-0 rounded-xl border border-white/15 bg-[linear-gradient(60deg,rgba(0,169,238,0.16)_0%,rgba(255,255,255,0.06)_100%)] shadow-[inset_0_1px_0_rgba(255,255,255,0.18)] backdrop-blur-md"
        style={{ opacity: glass }}
      >
        <CardFace name={file.name} size={file.size} index={index} glass />
      </motion.div>
    </motion.div>
  );
}

/** Contents of a file card: icon, name, size and placeholder lines. */
function CardFace({
  name,
  size,
  index,
  glass = false,
}: {
  name: string;
  size: string;
  index: number;
  glass?: boolean;
}) {
  return (
    <div className="flex h-full flex-col gap-1.5 p-3">
      <div className="flex items-center gap-2">
        <span className={`h-5 w-5 shrink-0 rounded-full ${glass ? "bg-white/20" : "bg-neutral-200"}`} />
        <div className="min-w-0">
          <p
            className={`truncate text-[9px] font-semibold leading-tight ${
              glass ? "text-white/90" : "text-neutral-700"
            }`}
          >
            {name}
          </p>
          <p className={`text-[8px] leading-tight ${glass ? "text-white/50" : "text-neutral-400"}`}>
            {size}
          </p>
        </div>
      </div>
      {SKELETON_BARS[index % SKELETON_BARS.length].map((width, j) => (
        <span
          key={j}
          className={`h-1.5 rounded-full ${glass ? "bg-white/15" : "bg-neutral-200"} ${width}`}
        />
      ))}
    </div>
  );
}

/** Running cost of everything stored so far, shown under the folder while the files go in. */
function CostReadout({
  progress,
  stageW,
  stageH,
}: {
  progress: MotionValue<number>;
  stageW: MotionValue<number>;
  stageH: MotionValue<number>;
}) {
  const [text, setText] = useState({ price: "0.00", gb: "0.0" });

  const stored = () => {
    const mobile = stageW.get() < MOBILE_MAX;
    return FILES.reduce((total, file, i) => {
      if (mobile && !file.mobileAt) return total; // not shown on phones, so not counted
      const [start, end] = flightWindow(i);
      return total + sizeToGb(file.size) * ease(seg(progress.get(), start + 0.5 * (end - start), end));
    }, 0);
  };
  useMotionValueEvent(progress, "change", () => {
    const gb = stored();
    const next = { price: (gb * READOUT_RATE).toFixed(2), gb: gb.toFixed(1) };
    setText((prev) => (prev.price === next.price && prev.gb === next.gb ? prev : next));
  });

  // Fades up in as the files start to fly, and fades up out as the last one lands.
  const shown = () => ease(seg(progress.get(), 0.2, 0.32)) * (1 - ease(seg(progress.get(), 0.9, 0.99)));
  const opacity = useTransform(shown);
  const y = useTransform(
    () =>
      descriptionTop(stageW.get(), stageH.get()) -
      4 +
      24 * (1 - ease(seg(progress.get(), 0.2, 0.32))) -
      24 * ease(seg(progress.get(), 0.9, 0.99)),
  );

  return (
    <motion.div
      aria-hidden
      className="pointer-events-none absolute inset-x-0 top-0 z-30 px-6 text-center"
      style={{ opacity, y }}
    >
      <p className="flex items-baseline justify-center gap-1 text-5xl font-light tracking-tight">
        <span>$</span>
        <SlidingNumber value={text.price} />
      </p>
      <p className="mt-1 text-xs opacity-50">a month</p>
      <p className="mt-3 inline-flex items-baseline gap-1 font-mono text-xs opacity-60">
        <SlidingNumber value={text.gb} /> GB stored · ${READOUT_RATE.toFixed(3)} / GB
      </p>
    </motion.div>
  );
}

const COST_HEADING = "Pay only for the space you fill";

/**
 * Heading for the files-into-folder scene. It fades up in as the files start to fly, glides down
 * from a higher spot to the usual heading spot as the folder grows, then fades up out together
 * with the cost readout.
 */
function CostHeading({
  progress,
  stageW,
  stageH,
}: {
  progress: MotionValue<number>;
  stageW: MotionValue<number>;
  stageH: MotionValue<number>;
}) {
  const opacity = useTransform(
    () => ease(seg(progress.get(), 0.2, 0.32)) * (1 - ease(seg(progress.get(), 0.9, 0.99))),
  );
  const y = useTransform(() => {
    const w = stageW.get();
    const h = stageH.get();
    const p = progress.get();
    const end = headingTop(w, h);
    const start = Math.max(16, end - (isMobile(w) ? 70 : 120));
    return (
      lerp(start, end, ease(seg(p, 0.2, 0.85))) +
      24 * (1 - ease(seg(p, 0.2, 0.32))) -
      24 * ease(seg(p, 0.9, 0.99))
    );
  });

  return (
    <motion.h2
      className="tz-heading pointer-events-none absolute inset-x-0 top-0 z-30 px-6 text-center text-3xl md:text-[40px] md:leading-[1.15]"
      style={{ opacity, y, fontFamily: "var(--font-manrope)" }}
    >
      {COST_HEADING}
    </motion.h2>
  );
}

export default function HeroNew({ withSharing = true }: { withSharing?: boolean }) {
  const reduceMotion = useReducedMotion();
  const trackRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const [measured, setMeasured] = useState(false);
  const stageW = useMotionValue(0);
  const stageH = useMotionValue(0);
  const time = useTime();

  const { scrollYProgress } = useScroll({
    target: trackRef,
    offset: ["start start", "end end"],
  });
  // The track is split in two: the hero plays first, then the sharing scene.
  const heroEnd = withSharing ? HERO_END : 1;
  const progress = useTransform(() => seg(scrollYProgress.get(), 0, heroEnd));
  const shareP = useTransform(() =>
    withSharing ? seg(scrollYProgress.get(), heroEnd, SHARE_END) : 0,
  );
  // After the sharing scene the next feature's text takes over, then the sync scene plays (devices and beams).
  const syncP = useTransform(() => (withSharing ? syncTimeline(seg(scrollYProgress.get(), SHARE_END, SYNC_END)) : 0));

  // Last: the security scene (text swap, then the circle, ring and shield).
  const secureP = useTransform(() => (withSharing ? seg(scrollYProgress.get(), SYNC_END, SECURE_END) : 0));

  // Finally the exit: the security text fades up and out and the folder comes down.
  const exitP = useTransform(() => (withSharing ? seg(scrollYProgress.get(), SECURE_END, 1) : 0));

  useLayoutEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;
    const measure = () => {
      stageW.set(stage.clientWidth);
      stageH.set(stage.clientHeight);
      setMeasured(true);
    };
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(stage);
    return () => observer.disconnect();
  }, [stageW, stageH, reduceMotion]);

  const folderY = useTransform(() => {
    const w = stageW.get();
    return lerp(
      folderRestY(folderRestScale(w)),
      folderTarget(w, stageH.get(), syncP.get(), secureP.get(), exitP.get()).y,
      ease(seg(progress.get(), 0, 0.3)),
    );
  });
  const folderSize = useTransform(() => {
    const w = stageW.get();
    return lerp(
      folderRestScale(w),
      folderTarget(w, stageH.get(), syncP.get(), secureP.get(), exitP.get()).scale,
      ease(seg(progress.get(), 0, 0.3)),
    );
  });
  const flapAngle = useTransform(() => {
    const p = progress.get();
    const q = shareP.get();
    const storing = ease(seg(p, 0.08, 0.28)) * (1 - ease(seg(p, 0.86, 1)));
    const sharing = ease(seg(q, 0.1, 0.22)) * (1 - ease(seg(q, 0.87, 1)));
    return -50 * Math.max(storing, sharing);
  });

  const copyOpacity = useTransform(() => 1 - ease(seg(progress.get(), 0.02, 0.24)));
  const copyY = useTransform(() => -70 * ease(seg(progress.get(), 0.02, 0.3)));
  const copyPointerEvents = useTransform(() => (progress.get() > 0.15 ? "none" : "auto"));

  if (reduceMotion) {
    return (
      <>
      <section className="relative flex min-h-[calc(100svh-68px)] items-center justify-center overflow-hidden px-6 py-20">
        <Glow />
        <div className="mx-auto flex max-w-3xl flex-col items-center text-center">
          <HeroCopy />
        </div>
      </section>
      {withSharing && <FeaturesStatic />}
      </>
    );
  }

  return (
    <section
      ref={trackRef}
      className={`relative ${withSharing ? "mb-[calc(180px-50svh)] h-[885vh] md:mb-[calc(222px-50svh)] md:h-[1200vh]" : "h-[200vh] md:h-[240vh]"}`}
    >
      <div ref={stageRef} className="pointer-events-none sticky top-0 h-[100svh] overflow-hidden">
        <Glow />

        <motion.div
          className="relative z-30 mx-auto flex h-full max-w-3xl flex-col items-center justify-center px-6 pb-[68px] text-center"
          style={{ opacity: copyOpacity, y: copyY, pointerEvents: copyPointerEvents }}
        >
          <HeroCopy animate />
        </motion.div>

        <div
          className={`absolute inset-0 transition-opacity duration-700 ${
            measured ? "opacity-100" : "opacity-0"
          }`}
        >
          {withSharing && <SecurityBackdrop secureP={secureP} stageW={stageW} stageH={stageH} />}
          <FolderBack y={folderY} scale={folderSize} />
          {FILES.map((file, i) => (
            <FileCard
              key={file.name}
              file={file}
              index={i}
              progress={progress}
              shareP={shareP}
              syncP={syncP}
              secureP={secureP}
              exitP={exitP}
              grab={GRABS.find((g) => g.file === file.name)}
              time={time}
              stageW={stageW}
              stageH={stageH}
            />
          ))}
          <FolderFlap y={folderY} scale={folderSize} rotateX={flapAngle} />
          {withSharing && <CostReadout progress={progress} stageW={stageW} stageH={stageH} />}
          {withSharing && <CostHeading progress={progress} stageW={stageW} stageH={stageH} />}
          {withSharing && (
            <>
              <FeatureCopy
                shareP={shareP}
                syncP={syncP}
                secureP={secureP}
                exitP={exitP}
                stageW={stageW}
                stageH={stageH}
              />
              <SharingCursors shareP={shareP} stageW={stageW} stageH={stageH} />
              <SyncBeams syncP={syncP} time={time} stageW={stageW} stageH={stageH} />
              <SyncDevices syncP={syncP} stageW={stageW} stageH={stageH} />
              <SecurityFront secureP={secureP} stageW={stageW} stageH={stageH} />
            </>
          )}
        </div>
      </div>
    </section>
  );
}
