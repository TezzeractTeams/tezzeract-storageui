import type { Metadata } from "next";
import "./globals.css";
import { Figtree } from "next/font/google";
import { cn } from "@/lib/utils";
import SmoothScroll from "@/components/SmoothScroll";

// Brand primary typeface. It also backs --font-manrope (see globals.css), which the
// component-library headings and a few scenes still reference by that name.
const figtree = Figtree({ subsets: ["latin"], variable: "--font-sans" });

export const metadata: Metadata = {
  title: "Tezzeract Storage — Pay-as-you-go file storage",
  description:
    "Store and share your files with Tezzeract Storage. No subscriptions, no tiers — just pay for the space you actually use.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={cn("dark font-sans", figtree.variable)}>
      <body>
        <SmoothScroll />
        {children}
      </body>
    </html>
  );
}
