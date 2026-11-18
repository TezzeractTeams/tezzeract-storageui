import { TezzeractButton } from "@/components/ui/TezzeractButton";
import { TezzeractButtonLight } from "@/components/ui/TezzeractButtonLight";
import { TezzeractH1 } from "@/components/ui/TezzeractH1";
import { TezzeractText } from "@/components/ui/TezzeractText";
import FolderFileStack from "@/components/landing/FolderFileStack";

export default function Hero() {
  return (
    <section className="relative flex min-h-[calc(100svh-68px)] items-center overflow-hidden px-6 pt-20 pb-24 sm:pt-28 lg:py-12">
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-0 -z-10 h-[600px] w-[900px] -translate-x-1/2 -translate-y-1/3 rounded-full bg-[radial-gradient(circle,#009BE9_0%,#00378A_60%,transparent_85%)] opacity-25 blur-3xl"
      />

      <div className="mx-auto grid w-full max-w-6xl items-center gap-10 md:grid-cols-2 md:gap-16">
        <div className="order-2 text-center md:order-1 md:text-left">
          <span className="inline-flex items-center gap-2 rounded-full border border-white/15 px-3 py-1 text-xs font-medium opacity-80">
            Pay-as-you-go · No subscription
          </span>

          <TezzeractH1 className="mt-6 lg:whitespace-nowrap lg:text-[clamp(30px,3.3vw,46px)] lg:leading-[1.2]">
            Your files, stored simply.
            <br />
            Pay only for what you use.
          </TezzeractH1>

          <TezzeractText as="p" className="mx-auto mt-5 max-w-lg text-lg opacity-70 md:mx-0">
            No subscriptions. No tiers you don&apos;t need. Tezzeract Storage
            charges you for the space you actually fill — nothing more.
          </TezzeractText>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-4 md:justify-start">
            <a href="#get-started">
              <TezzeractButton>Get started free</TezzeractButton>
            </a>
            <a href="#calculator">
              <TezzeractButtonLight>Calculate cost</TezzeractButtonLight>
            </a>
          </div>

          <TezzeractText as="p" className="mt-6 text-sm opacity-50">
            No credit card required · Cancel anytime, there&apos;s nothing to cancel
          </TezzeractText>
        </div>

        <div className="relative order-1 mx-auto w-full max-w-sm md:order-2 md:max-w-none lg:translate-y-8">
          <FolderFileStack
            files={[
              { name: "Project-brief.pdf", size: "2.1 MB" },
              { name: "Team-photos/", size: "8.4 GB" },
              { name: "backup-2024.zip", size: "16.7 GB" },
            ]}
          />
        </div>
      </div>
    </section>
  );
}
