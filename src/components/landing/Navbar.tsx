import { TezzeractButton } from "@/components/ui/TezzeractButton";
import { TezzeractText } from "@/components/ui/TezzeractText";

export default function Navbar() {
  return (
    <nav className="flex items-center justify-between px-6 py-4">
      <TezzeractText as="span" className="font-semibold">
        Tezzeract Storage
      </TezzeractText>
      <div className="flex items-center gap-6 text-sm">
        <TezzeractText as="span" className="opacity-80 transition-opacity hover:opacity-100">
          <a href="#features">Features</a>
        </TezzeractText>
        <TezzeractText as="span" className="opacity-80 transition-opacity hover:opacity-100">
          <a href="#pricing">Pricing</a>
        </TezzeractText>
        <a href="#get-started">
          <TezzeractButton className="h-9 max-h-9 px-4 py-2 text-[13px]">
            Get started
          </TezzeractButton>
        </a>
      </div>
    </nav>
  );
}
