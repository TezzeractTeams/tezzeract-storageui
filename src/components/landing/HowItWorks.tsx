"use client";

import { useEffect, useRef, useState } from "react";
import {
  motion,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useTransform,
  type MotionValue,
} from "motion/react";
import { File, FileArchive, Folder, Mail, Upload } from "lucide-react";
import { TezzeractButton } from "@/components/ui/TezzeractButton";
import { TezzeractText } from "@/components/ui/TezzeractText";

const cardClass =
  "w-full max-w-sm rounded-2xl border border-white/10 bg-white/[0.03] p-4 text-xs backdrop-blur md:justify-self-end";
const chipClass =
  "inline-flex items-center gap-1.5 rounded-lg border border-white/15 bg-[#161616] px-2.5 py-1.5";

function SignUpArt() {
  return (
    <div className={cardClass}>
      <div className={`${chipClass} w-full`}>
        <Mail className="h-3.5 w-3.5 opacity-50" />
        <span className="opacity-50">name@company.com</span>
      </div>
      <div className="mt-3">
        <TezzeractButton fullWidth tabIndex={-1}>
          Create account
        </TezzeractButton>
      </div>
    </div>
  );
}

function UploadArt() {
  return (
    <div className={cardClass}>
      <div className="rounded-xl border border-dashed border-[#00A9EE]/60 p-4 text-center">
        <Upload className="mx-auto h-5 w-5 text-[#00A9EE]" />
        <p className="mb-3 mt-1 opacity-60">Drop files here</p>
        <div className="flex flex-wrap justify-center gap-1.5">
          <span className={chipClass}>
            <File className="h-3.5 w-3.5" />
            brief.pdf
          </span>
          <span className={chipClass}>
            <Folder className="h-3.5 w-3.5" />
            photos
          </span>
          <span className={chipClass}>
            <FileArchive className="h-3.5 w-3.5" />
            backup.zip
          </span>
        </div>
      </div>
    </div>
  );
}

function BillArt() {
  return (
    <div className={`${cardClass} font-mono`}>
      <div className="flex justify-between">
        <span className="opacity-60">Storage</span>
        <span>110 GB</span>
      </div>
      <div className="mt-1.5 flex justify-between">
        <span className="opacity-60">Rate</span>
        <span>$0.012 / GB</span>
      </div>
      <div className="mt-3 flex items-baseline justify-between border-t border-dashed border-white/20 pt-3">
        <span className="opacity-60">This month</span>
        <span className="font-sans text-2xl font-light text-[#00A9EE]">$1.32</span>
      </div>
    </div>
  );
}

const steps = [
  {
    title: "Sign up in seconds",
    description: "No credit card required to start. Create an account and you're in.",
    art: <SignUpArt />,
  },
  {
    title: "Upload your files",
    description: "Drag and drop from your browser, desktop app, or mobile device.",
    art: <UploadArt />,
  },
  {
    title: "Pay for what you use",
    description: "We track your usage and bill you only for the storage you fill, each month.",
    art: <BillArt />,
  },
];

const clamp01 = (v: number) => Math.min(1, Math.max(0, v));
const ease = (t: number) => t * t * (3 - 2 * t);

/** True from the md breakpoint up (the desktop layout). */
function useIsDesktop() {
  const [desktop, setDesktop] = useState(false);
  useEffect(() => {
    const query = window.matchMedia("(min-width: 768px)");
    const update = () => setDesktop(query.matches);
    update();
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);
  return desktop;
}

function Step({
  index,
  active,
  progress,
}: {
  index: number;
  active: boolean;
  progress: MotionValue<number>;
}) {
  const step = steps[index];
  const last = index === steps.length - 1;

  // Each step slides in as it scrolls into view: on desktop the visual comes from the
  // left and the text from the right; on phones both come from the right. It is tied
  // to the scroll position, so scrolling back slides them out again.
  const rootRef = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();
  const desktop = useIsDesktop();
  const { scrollYProgress: enter } = useScroll({
    target: rootRef,
    offset: ["start 92%", "start 62%"],
  });
  const artReveal = useTransform(enter, (p) => ease(clamp01(p)));
  const textReveal = useTransform(enter, (p) => ease(clamp01((p - 0.12) / 0.88)));
  const artX = useTransform(artReveal, (e) => (reduceMotion ? 0 : (desktop ? -72 : 56) * (1 - e)));
  const textX = useTransform(textReveal, (e) => (reduceMotion ? 0 : (desktop ? 72 : 56) * (1 - e)));
  const artOpacity = useTransform(artReveal, (e) => (reduceMotion ? 1 : e));
  const textOpacity = useTransform(textReveal, (e) => (reduceMotion ? 1 : e));
  const fill = useTransform(
    progress,
    [index / (steps.length - 1), (index + 1) / (steps.length - 1)],
    [0, 1],
    { clamp: true },
  );

  return (
    <div
      ref={rootRef}
      className="grid grid-cols-[36px_minmax(0,1fr)] gap-x-4 md:grid-cols-[minmax(0,1fr)_44px_minmax(0,1fr)] md:gap-x-8"
    >
      <div className="col-start-1 row-span-2 row-start-1 flex flex-col items-center md:col-start-2 md:row-span-1">
        <span
          className={`flex h-9 w-9 flex-none items-center justify-center rounded-full border text-sm font-medium transition-colors duration-300 ${
            active
              ? "border-[#00A9EE] bg-[#00A9EE]/20 text-white shadow-[0_0_16px_rgba(0,155,233,0.5)]"
              : "border-white/20 bg-[#111111] text-white/50"
          }`}
        >
          {index + 1}
        </span>
        {!last && (
          <div className="relative my-1.5 w-px flex-1 bg-white/10">
            <motion.div
              className="absolute inset-0 origin-top bg-[#00A9EE]"
              style={{ scaleY: fill }}
            />
          </div>
        )}
      </div>

      <motion.div
        className="col-start-2 row-start-1 pt-1 md:col-start-3"
        style={{ x: textX, opacity: textOpacity }}
      >
        <h3 className="font-medium">{step.title}</h3>
        <TezzeractText as="p" className="mt-2 max-w-sm text-sm opacity-70">
          {step.description}
        </TezzeractText>
      </motion.div>

      <motion.div
        className={`col-start-2 row-start-2 mt-4 md:col-start-1 md:row-start-1 md:mt-0 ${
          last ? "" : "pb-12"
        }`}
        style={{ x: artX, opacity: artOpacity }}
      >
        {step.art}
      </motion.div>
    </div>
  );
}

export default function HowItWorks() {
  const ref = useRef<HTMLDivElement>(null);
  const [activeCount, setActiveCount] = useState(1);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 70%", "end 55%"],
  });

  useMotionValueEvent(scrollYProgress, "change", (p) => {
    const next = 1 + steps.slice(1).filter((_, i) => p >= (i + 1) / (steps.length - 1) - 0.02).length;
    setActiveCount((prev) => (prev === next ? prev : next));
  });

  return (
    <section className="overflow-x-clip px-6 py-16">
      <div className="mx-auto max-w-5xl text-center">
        <span className="inline-flex rounded-full border border-white/15 px-3 py-1 text-xs font-medium opacity-80">
          How it works
        </span>
        <h2 className="tz-heading mt-4 text-3xl md:text-[40px] md:leading-[1.15]">Up and running in three steps</h2>
      </div>

      <div ref={ref} className="mx-auto mt-12 max-w-md md:max-w-4xl">
        {steps.map((_, i) => (
          <Step key={i} index={i} active={i < activeCount} progress={scrollYProgress} />
        ))}
      </div>
    </section>
  );
}
