import { TezzeractText } from "@/components/ui/TezzeractText";

const LINKS = [
  { label: "Features", href: "#features" },
  { label: "Pricing", href: "#pricing" },
  { label: "Calculator", href: "#calculator" },
];

export default function Footer() {
  return (
    <footer className="relative overflow-hidden border-t border-white/10">
      <div className="mx-auto flex max-w-5xl flex-col items-center gap-5 px-6 pt-10 text-center md:flex-row md:justify-between md:text-left">
        <TezzeractText as="span" className="font-semibold">
          Tezzeract Storage
        </TezzeractText>

        <nav aria-label="Footer" className="flex items-center gap-6 text-sm">
          {LINKS.map((link) => (
            <TezzeractText
              key={link.href}
              as="span"
              className="opacity-70 transition-opacity hover:opacity-100"
            >
              <a href={link.href}>{link.label}</a>
            </TezzeractText>
          ))}
        </nav>

        <TezzeractText as="p" className="text-sm opacity-50">
          © {new Date().getFullYear()} Tezzeract. All rights reserved.
        </TezzeractText>
      </div>

      <div className="relative mt-10 md:mt-14">
        <div
          aria-hidden
          className="pointer-events-none absolute bottom-0 left-1/2 h-[60%] w-[70%] -translate-x-1/2 translate-y-1/2 rounded-full bg-[radial-gradient(circle,#00A9EE_0%,#00378A_60%,transparent_85%)] opacity-30 blur-3xl"
        />
        <p
          aria-hidden
          className="relative -mb-[0.24em] select-none whitespace-nowrap bg-[linear-gradient(180deg,rgba(255,255,255,0.22)_0%,rgba(255,255,255,0.03)_85%)] bg-clip-text text-center text-[20vw] font-semibold leading-none tracking-tight text-transparent"
          style={{ fontFamily: "var(--font-manrope)" }}
        >
          Tezzeract
        </p>
      </div>
    </footer>
  );
}
