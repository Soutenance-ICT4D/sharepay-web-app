import { HeroSection } from "@/components/sections/hero-section";
import { LogosSection } from "@/components/sections/logos-section";
import { FeaturesSection } from "@/components/sections/features-section";
import { StatsSection } from "@/components/sections/stats-section";
import { CtaSection } from "@/components/sections/cta-section";

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* 1. Le Hero (Déjà fait, assure-toi qu'il est beau) */}
      <HeroSection />

      {/* 2. Les Partenaires */}
      <LogosSection />

      {/* 3. Les Fonctionnalités */}
      <FeaturesSection />

      {/* 4. Les Chiffres (Fond sombre) */}
      <StatsSection />

      {/* 5. L'appel à l'action final */}
      <CtaSection />
    </div>
  );
}