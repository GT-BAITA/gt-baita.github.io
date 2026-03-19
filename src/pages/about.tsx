import { HeroSection } from '@/components/about/hero-section';
import { InfoSection } from '@/components/about/info-section';
import { BenefitsSection } from '@/components/about/benefits-section';
import { DemonstrationSection } from '@/components/about/demonstration-section';
import { PillarsSection } from '@/components/about/pillars-section';

export function AboutPage() {
  return (
    <div>
      <HeroSection />
      <InfoSection />
      <PillarsSection />
      <BenefitsSection />
      <DemonstrationSection />
    </div>
  );
}
