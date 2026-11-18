import { TezzeractButton } from "@/components/ui/TezzeractButton";
import { TezzeractButtonLight } from "@/components/ui/TezzeractButtonLight";
import { TezzeractText } from "@/components/ui/TezzeractText";

const FILE_TYPES = [
  "Photos",
  "Videos",
  "Documents",
  "Backups",
  "Project files",
  "Archives",
  "Design files",
  "Music",
];

export default function Cta() {
  return (
    <section id="get-started" className="px-6 py-20">
      <div className="mx-auto grid max-w-5xl items-center gap-10 md:grid-cols-2 md:gap-16">
        <div className="order-2 text-center md:text-left">
          <h2
            className="tz-heading text-4xl leading-[1.15] md:mx-0 lg:text-5xl lg:leading-[1.15]"
            style={{ fontFamily: "var(--font-manrope)" }}
          >
            Stop paying for storage you don&apos;t use
          </h2>
          <TezzeractText as="p" className="mx-auto mt-4 max-w-md opacity-70 md:mx-0">
            Create your free Tezzeract Storage account and only pay for the
            space you fill.
          </TezzeractText>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4 md:justify-start">
            <a href="#">
              <TezzeractButton>Get started free</TezzeractButton>
            </a>
            <a href="#calculator">
              <TezzeractButtonLight>Calculate cost</TezzeractButtonLight>
            </a>
          </div>
        </div>

        <div
          aria-hidden
          className="tz-marquee-mask h-[260px] overflow-hidden order-1 text-center md:h-[360px] md:text-left"
        >
          <div className="tz-marquee-track flex flex-col">
            {[...FILE_TYPES, ...FILE_TYPES].map((label, i) => (
              <span
                key={i}
                className="whitespace-nowrap pb-6 text-4xl font-light tracking-tight md:pb-8 md:text-5xl"
              >
                {label}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
