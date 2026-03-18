import { CTASection } from "@/components/about/cta-section";
import { HeroSection } from "@/components/about/hero-section";
import { HistorySection } from "@/components/about/history-section";
import { MissionSection } from "@/components/about/mission-section";
import { NumbersSection } from "@/components/about/numbers-section";
import { PillarsSection } from "@/components/about/pillars-section";
import { ValuesSection } from "@/components/about/values-section";

export function AboutPage() {
  return (
    <div>
      <HeroSection />
      <NumbersSection />
      <MissionSection />
      <PillarsSection />
      <HistorySection />
      <ValuesSection />
      <CTASection />
    </div>
  );
}