import { Cta } from "@/components/landing/cta";
import { Features } from "@/components/landing/features";
import { Hero } from "@/components/landing/hero";
import { Pricing } from "@/components/landing/pricing";

export default function LandingPage() {
  return (
    <>
      <Hero />
      <Features />
      <Pricing />
      <Cta />
    </>
  );
}
