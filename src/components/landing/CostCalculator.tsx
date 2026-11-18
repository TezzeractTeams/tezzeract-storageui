"use client";

import { useState } from "react";
import { TezzeractButton } from "@/components/ui/TezzeractButton";
import { TezzeractText } from "@/components/ui/TezzeractText";
import SlidingNumber from "@/components/landing/SlidingNumber";

// Placeholder per-GB monthly rates until real pricing is confirmed.
export const TIERS = [
  { id: "rarely", label: "Rarely", hint: "Backups and archives", rate: 0.005 },
  { id: "sometimes", label: "Sometimes", hint: "Everyday documents", rate: 0.012 },
  { id: "often", label: "Often", hint: "Active project files", rate: 0.02 },
] as const;

const MIN_GB = 10;
const MAX_GB = 10000;

function sliderToGb(t: number) {
  const raw = MIN_GB * Math.pow(MAX_GB / MIN_GB, t / 100);
  const step = raw < 100 ? 5 : raw < 1000 ? 10 : 100;
  return Math.min(MAX_GB, Math.max(MIN_GB, Math.round(raw / step) * step));
}

function formatGb(gb: number) {
  return gb >= 1000 ? `${(gb / 1000).toFixed(gb % 1000 === 0 ? 0 : 1)} TB` : `${gb} GB`;
}

export default function CostCalculator() {
  const [position, setPosition] = useState(35);
  const [tierId, setTierId] = useState<(typeof TIERS)[number]["id"]>("sometimes");

  const gb = sliderToGb(position);
  const tier = TIERS.find((t) => t.id === tierId)!;
  const total = gb * tier.rate;
  const totalText = total.toFixed(2);

  return (
    <section id="calculator" className="px-6 py-16">
      <div className="mx-auto max-w-4xl text-center">
        <h2 className="tz-heading text-3xl md:text-[40px] md:leading-[1.15]">Estimate your monthly cost</h2>
        <TezzeractText as="p" className="mx-auto mt-3 max-w-md opacity-70">
          Slide to the space you need and tell us how often you open your files.
        </TezzeractText>
      </div>

      <div className="mx-auto mt-10 grid max-w-4xl gap-px overflow-hidden rounded-2xl border border-white/10 bg-white/10 md:grid-cols-[1.2fr_1fr]">
        <div className="bg-[#161616] p-6 sm:p-8">
          <div className="flex items-baseline justify-between">
            <label htmlFor="storage-size" className="text-sm font-medium opacity-80">
              Storage needed
            </label>
            <span className="text-3xl font-light tracking-tight">{formatGb(gb)}</span>
          </div>
          <input
            id="storage-size"
            type="range"
            min={0}
            max={100}
            step="any"
            value={position}
            onChange={(e) => setPosition(Number(e.target.value))}
            className="tz-range mt-5 w-full"
            style={{ ["--fill" as string]: `${position}%` }}
            aria-valuetext={formatGb(gb)}
          />
          <div className="mt-2 flex justify-between text-xs opacity-40">
            <span>10 GB</span>
            <span>10 TB</span>
          </div>

          <fieldset className="mt-8">
            <legend className="text-sm font-medium opacity-80">How often do you access your files?</legend>
            <div className="mt-3 grid gap-3 sm:grid-cols-3">
              {TIERS.map((t) => (
                <label
                  key={t.id}
                  className={`cursor-pointer rounded-xl border px-4 py-3 text-left transition-colors duration-300 has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-[#00A9EE] ${
                    tierId === t.id
                      ? "border-[#00A9EE] bg-[#00A9EE]/10"
                      : "border-white/15 hover:border-white/30"
                  }`}
                >
                  <input
                    type="radio"
                    name="access-frequency"
                    value={t.id}
                    checked={tierId === t.id}
                    onChange={() => setTierId(t.id)}
                    className="sr-only"
                  />
                  <span className="block text-sm font-medium">{t.label}</span>
                  <span className="mt-1 block text-xs opacity-50">{t.hint}</span>
                </label>
              ))}
            </div>
          </fieldset>
        </div>

        <div className="flex flex-col bg-[#161616] p-6 font-mono text-sm sm:p-8">
          <p className="text-xs uppercase tracking-widest opacity-40">Estimate</p>
          <dl className="mt-5 space-y-3">
            <div className="flex justify-between gap-4">
              <dt className="opacity-60">Storage</dt>
              <dd>{formatGb(gb)}</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="opacity-60">Access</dt>
              <dd>{tier.label}</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="opacity-60">Rate</dt>
              <dd>${tier.rate.toFixed(3)} / GB</dd>
            </div>
          </dl>

          <div className="mt-6 border-t border-dashed border-white/15 pt-6">
            <p className="flex items-baseline gap-1 font-sans text-5xl font-light tracking-tight">
              <span>$</span>
              <SlidingNumber value={totalText} />
            </p>
            <p className="mt-1 font-sans text-xs opacity-50">a month</p>
            <span className="sr-only" aria-live="polite">
              {`Estimated cost: $${totalText} a month for ${formatGb(gb)}, accessed ${tier.label.toLowerCase()}.`}
            </span>
          </div>

          <a href="#get-started" className="mt-6 inline-block font-sans">
            <TezzeractButton>Start storing {formatGb(gb)}</TezzeractButton>
          </a>
        </div>
      </div>
    </section>
  );
}
