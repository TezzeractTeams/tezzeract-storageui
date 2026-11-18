"use client";

import { useState } from "react";
import { MousePointer2 } from "lucide-react";
import { motion, useMotionValueEvent, useTransform, type MotionValue } from "motion/react";
import { TezzeractText } from "@/components/ui/TezzeractText";
import {
  GRABS,
  cursorPosition,
  descriptionTop,
  ease,
  exitText,
  headingTop,
  SECURE_TEXT_LIFT,
  secureLift,
  seg,
  type Grab,
} from "@/components/landing/heroSceneMath";

// "Effortless sharing" scene. It plays on the hero's pinned folder, so these
// layers are rendered inside the hero stage (see HeroNew) rather than as a
// section of their own.

const FEATURES = [
  {
    heading: "Effortless sharing",
    description:
      "Send a link, set permissions, done. Share a single file or a whole folder with anyone, instantly.",
  },
  {
    heading: "Sync across devices",
    description:
      "Your files stay up to date on every device automatically, so you're never searching for the latest version.",
  },
  {
    heading: "Built-in security",
    description:
      "Every file is encrypted in transit and at rest. You control who sees what, and can revoke access anytime.",
  },
];

interface SceneProps {
  /** Sharing-scene progress, 0 to 1. */
  shareP: MotionValue<number>;
  /** Progress of the sync scene, 0 to 1 (the text swap happens at its start). */
  syncP: MotionValue<number>;
  /** Progress of the security scene, 0 to 1 (the text swap happens at its start). */
  secureP: MotionValue<number>;
  /** Progress of the exit, 0 to 1 (the security text fades up and out at its start). */
  exitP: MotionValue<number>;
  stageW: MotionValue<number>;
  stageH: MotionValue<number>;
}

const RISE = 24;

/** How visible feature `i` is (0 to 1). Each one fades up in, and the previous one fades up out. */
function visibility(i: number, q: number, s: number, c: number, e: number) {
  if (i === 0) return ease(seg(q, 0, 0.1)) * (1 - ease(seg(s, 0, 0.1)));
  if (i === 1) return ease(seg(s, 0.07, 0.17)) * (1 - ease(seg(c, 0, 0.09)));
  return ease(seg(c, 0.06, 0.15)) * (1 - exitText(e));
}

/** Vertical drift in px: rises in from below, then leaves upward. */
function drift(i: number, q: number, s: number, c: number, e: number) {
  if (i === 0) return RISE * (1 - ease(seg(q, 0, 0.12))) - RISE * ease(seg(s, 0, 0.1));
  if (i === 1) return RISE * (1 - ease(seg(s, 0.07, 0.17))) - RISE * ease(seg(c, 0, 0.09));
  // The security text also lifts a little while its circle is on screen.
  return RISE * (1 - ease(seg(c, 0.06, 0.15))) - SECURE_TEXT_LIFT * secureLift(c) - RISE * exitText(e);
}

function FeatureText({
  index,
  shareP,
  syncP,
  secureP,
  exitP,
  stageW,
  stageH,
}: SceneProps & { index: number }) {
  const feature = FEATURES[index];
  const opacity = useTransform(() =>
    visibility(index, shareP.get(), syncP.get(), secureP.get(), exitP.get()),
  );
  const shift = () => drift(index, shareP.get(), syncP.get(), secureP.get(), exitP.get());

  const headingY = useTransform(() => headingTop(stageW.get(), stageH.get()) + shift());
  const descriptionY = useTransform(() => descriptionTop(stageW.get(), stageH.get()) + shift());

  return (
    <>
      <motion.h2
        className="tz-heading pointer-events-none absolute inset-x-0 top-0 z-30 px-6 text-center text-3xl md:text-[40px] md:leading-[1.15]"
        style={{ opacity, y: headingY, fontFamily: "var(--font-manrope)" }}
      >
        {feature.heading}
      </motion.h2>
      <motion.div
        className="pointer-events-none absolute inset-x-0 top-0 z-30 px-6"
        style={{ opacity, y: descriptionY }}
      >
        <TezzeractText as="p" className="mx-auto max-w-md text-center text-sm opacity-60 md:text-base">
          {feature.description}
        </TezzeractText>
      </motion.div>
    </>
  );
}

/** Heading and description of each feature, swapping as the scene progresses. */
export function FeatureCopy(props: SceneProps) {
  return (
    <>
      {FEATURES.map((_, i) => (
        <FeatureText key={i} index={i} {...props} />
      ))}
    </>
  );
}

type CursorSceneProps = Omit<SceneProps, "syncP" | "secureP" | "exitP">;

function Cursor({ grab, shareP, stageW, stageH }: CursorSceneProps & { grab: Grab }) {
  const [held, setHeld] = useState(false);
  useMotionValueEvent(shareP, "change", (q) => {
    const next = q >= grab.lift[1];
    setHeld((prev) => (prev === next ? prev : next));
  });

  const x = useTransform(() => cursorPosition(shareP.get(), grab, stageW.get(), stageH.get()).x);
  const y = useTransform(() => cursorPosition(shareP.get(), grab, stageW.get(), stageH.get()).y);
  const mirrored = grab.pill === "left";

  return (
    <motion.div aria-hidden className="absolute left-0 top-0 z-40 h-0 w-0" style={{ x, y }}>
      <MousePointer2
        className={`absolute h-5 w-5 text-white transition-[fill] duration-200 ${
          mirrored ? "right-0 -scale-x-100" : "left-0"
        }`}
        fill={held ? "#111111" : "transparent"}
        strokeWidth={1.5}
      />
      <span
        className={`absolute top-4 flex origin-top items-center gap-2 whitespace-nowrap rounded-full bg-[#1A5AFF] py-1.5 text-sm font-medium text-white shadow-[0_6px_18px_rgba(0,90,200,0.45)] max-md:scale-[0.82] ${
          mirrored
            ? "right-3 flex-row-reverse rounded-tr-md pl-4 pr-1.5 max-md:origin-top-right"
            : "left-3 rounded-tl-md pl-1.5 pr-4 max-md:origin-top-left"
        }`}
      >
        <span
          className="flex h-7 w-7 items-center justify-center rounded-full text-xs font-semibold ring-2 ring-white/70"
          style={{ background: grab.avatarColor }}
        >
          {grab.initials}
        </span>
        {grab.name}
      </span>
    </motion.div>
  );
}

export function SharingCursors(props: CursorSceneProps) {
  return (
    <>
      {GRABS.map((grab) => (
        <Cursor key={grab.name} grab={grab} {...props} />
      ))}
    </>
  );
}

/** Non-animated version, used when the visitor prefers reduced motion. */
export function FeaturesStatic() {
  return (
    <section id="features" className="space-y-14 px-6 py-16 text-center">
      {FEATURES.map((feature) => (
        <div key={feature.heading}>
          <h2
            className="tz-heading text-3xl md:text-[40px]"
            style={{ fontFamily: "var(--font-manrope)" }}
          >
            {feature.heading}
          </h2>
          <TezzeractText as="p" className="mx-auto mt-4 max-w-md text-sm opacity-60 md:text-base">
            {feature.description}
          </TezzeractText>
        </div>
      ))}
    </section>
  );
}

// The sharing scene lives inside the hero stage, so there is nothing to render
// at this point in the page yet. Scenes for the other features will go here.
export default function FeaturesNew() {
  return null;
}
