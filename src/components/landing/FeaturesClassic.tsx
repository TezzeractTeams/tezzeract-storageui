"use client";

import { useRef } from "react";
import { Check, Laptop, Link2, RefreshCw, ShieldCheck, Smartphone } from "lucide-react";
import { TezzeractText } from "@/components/ui/TezzeractText";

function Tile({
  className,
  title,
  description,
  children,
}: {
  className?: string;
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  const ref = useRef<HTMLDivElement>(null);

  return (
    <div
      ref={ref}
      onMouseMove={(e) => {
        const el = ref.current;
        if (!el) return;
        const rect = el.getBoundingClientRect();
        el.style.setProperty("--x", `${e.clientX - rect.left}px`);
        el.style.setProperty("--y", `${e.clientY - rect.top}px`);
      }}
      className={`group relative overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] ${className ?? ""}`}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{
          background:
            "radial-gradient(320px circle at var(--x, 50%) var(--y, 50%), rgba(0,155,233,0.16), transparent 70%)",
        }}
      />
      <div className="relative flex h-full flex-col">
        <div className="flex h-[190px] items-center justify-center px-6 pt-6">{children}</div>
        <div className="px-6 pb-7 pt-4 text-center">
          <h3 className="font-medium">{title}</h3>
          <TezzeractText as="p" className="mx-auto mt-2 max-w-sm text-sm opacity-70">
            {description}
          </TezzeractText>
        </div>
      </div>
    </div>
  );
}

function PricingArt() {
  const bars = [22, 34, 30, 48, 62, 78];
  return (
    <div className="relative w-full max-w-[280px]">
      <div className="flex h-[130px] items-end justify-between gap-2">
        {bars.map((h, i) => (
          <span
            key={i}
            className="w-full origin-bottom rounded-t-md bg-[linear-gradient(180deg,#009BE9_0%,#00378A_100%)] opacity-80 transition-transform duration-500 ease-out group-hover:scale-y-110"
            style={{ height: `${h}%`, transitionDelay: `${i * 40}ms` }}
          />
        ))}
      </div>
      <span className="absolute -top-1 right-0 rounded-full border border-white/15 bg-[#0d0d0d] px-3 py-1 text-xs">
        $3.81 this month
      </span>
    </div>
  );
}

function SharingArt() {
  return (
    <div className="flex flex-col items-center gap-4">
      <div className="flex items-center gap-3 rounded-xl border border-white/15 bg-[#0d0d0d] px-4 py-3 text-sm">
        <Link2 className="h-4 w-4 text-[#009BE9]" />
        <span className="opacity-80">Share link</span>
        <span className="rounded-md bg-[#009BE9]/15 px-2 py-0.5 text-xs text-[#58c4f5]">Can view</span>
      </div>
      <div className="flex -space-x-3">
        {["#009BE9", "#1C75BC", "#27AAE1", "#00378A"].map((c, i) => (
          <span
            key={c}
            className="h-9 w-9 rounded-full border-2 border-[#0a0a0a] transition-transform duration-300 group-hover:translate-x-1"
            style={{ background: c, transitionDelay: `${i * 40}ms` }}
          />
        ))}
      </div>
    </div>
  );
}

function SyncArt() {
  return (
    <div className="flex items-center gap-5">
      <div className="flex h-20 w-28 items-center justify-center rounded-lg border border-white/15 bg-[#0d0d0d]">
        <Laptop className="h-8 w-8 opacity-70" />
      </div>
      <RefreshCw
        className="h-6 w-6 text-[#009BE9] group-hover:animate-spin"
        style={{ animationDuration: "2.5s" }}
      />
      <div className="flex h-24 w-14 items-center justify-center rounded-lg border border-white/15 bg-[#0d0d0d]">
        <Smartphone className="h-7 w-7 opacity-70" />
      </div>
    </div>
  );
}

function SecurityArt() {
  return (
    <div className="flex flex-col items-center gap-4">
      <span className="flex h-16 w-16 items-center justify-center rounded-full border border-[#009BE9]/40 bg-[#009BE9]/10 shadow-[0_0_30px_rgba(0,155,233,0.35)]">
        <ShieldCheck className="h-8 w-8 text-[#58c4f5]" />
      </span>
      <div className="flex gap-2 text-xs">
        {["In transit", "At rest"].map((label) => (
          <span
            key={label}
            className="inline-flex items-center gap-1 rounded-full border border-white/15 bg-[#0d0d0d] px-3 py-1"
          >
            <Check className="h-3 w-3 text-[#58c4f5]" />
            {label}
          </span>
        ))}
      </div>
    </div>
  );
}

export default function FeaturesClassic() {
  return (
    <section id="features" className="px-6 py-16">
      <div className="mx-auto max-w-5xl text-center">
        <span className="inline-flex rounded-full border border-white/15 px-3 py-1 text-xs font-medium opacity-80">
          Why Tezzeract Storage
        </span>
        <h2 className="mt-4 text-2xl font-semibold">Everything you need, nothing you don&apos;t</h2>
        <TezzeractText as="p" className="mx-auto mt-3 max-w-md opacity-70">
          Simple storage that stays out of your way and only charges for what you use.
        </TezzeractText>
      </div>

      <div className="mx-auto mt-10 grid max-w-5xl gap-4 md:grid-cols-12">
        <Tile
          className="md:col-span-7"
          title="Pay-as-you-go pricing"
          description="No monthly plans to pick between. You're billed for exactly the storage you use, down to the gigabyte."
        >
          <PricingArt />
        </Tile>
        <Tile
          className="md:col-span-5"
          title="Effortless sharing"
          description="Send a link, set permissions, done. Share a single file or a whole folder with anyone, instantly."
        >
          <SharingArt />
        </Tile>
        <Tile
          className="md:col-span-5"
          title="Sync across devices"
          description="Your files stay up to date on every device automatically, so you're never searching for the latest version."
        >
          <SyncArt />
        </Tile>
        <Tile
          className="md:col-span-7"
          title="Built-in security"
          description="Every file is encrypted in transit and at rest. You control who sees what, and can revoke access anytime."
        >
          <SecurityArt />
        </Tile>
      </div>
    </section>
  );
}
