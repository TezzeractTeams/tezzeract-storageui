import Hero from "@/components/landing/HeroNew";
import Features from "@/components/landing/FeaturesNew";
import HowItWorks from "@/components/landing/HowItWorks";
import Pricing from "@/components/landing/Pricing";
import CostCalculator from "@/components/landing/CostCalculator";
import Cta from "@/components/landing/Cta";
import Footer from "@/components/landing/Footer";
import Navbar from "@/components/landing/Navbar";

export default function Home() {
  return (
    <main>
      <Navbar />
      <Hero />
      <Features />
      <CostCalculator />
      <HowItWorks />
      <Pricing />
      <Cta />
      <Footer />
    </main>
  );
}
