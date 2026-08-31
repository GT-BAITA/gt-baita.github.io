import { AboutSection } from "@/components/home/about-section";
import { BenefitsSection } from "@/components/home/benefits-section";
import { InitSection } from "@/components/home/init-section";
import { SolutionsSection } from "@/components/home/solutions-section";
import { UseCasesSection } from "@/components/home/use-cases-section";

/**
 * The page is being reworked from scratch against the Figma master
 * (file DRQsUf0HedIdSMsLCt8PcX, frame `/home`, node 1058:35737), so
 * everything between the hero and the footer is parked here.
 *
 * Nothing was deleted: every section component still lives in
 * src/components/home/, so bringing one back is uncommenting its
 * import and its line in the tree below.
 *
 * The footer is not listed here — it is rendered by Layout, and the
 * newsletter form lives inside it, so both stayed up automatically.
 *
 * Parked sections, in their original order:
 *
 *   import { FeaturesSection } from "@/components/home/features-section";
 *   import { RoadmapSection } from "@/components/home/roadmap-section";
 *   import { EarlyAdoptersSection } from "@/components/home/early-adopters-section";
 *   import { TeamSection } from "@/components/home/team-section";
 *   import { FAQSection } from "@/components/home/faq-section";
 *
 *   <FeaturesSection />
 *   <RoadmapSection />
 *   <EarlyAdoptersSection />
 *   <TeamSection />
 *   <FAQSection />
 *
 * A <YouTubeEmbed /> (src/components/home/youtube-player.tsx) sat
 * between TeamSection and FAQSection, already commented out before
 * this change.
 */

export function Home() {
  return (
    <>
      <InitSection />

      {/* AboutSection is a responsive split, not a duplicate: InitSection
          renders it inside the hero from md up, this renders it below the
          hero on mobile. Both halves have to stay for the hero to match
          across breakpoints. */}
      <div className="md:hidden visible">
        <AboutSection />
      </div>

      <SolutionsSection />
      <BenefitsSection />
      <UseCasesSection />
    </>
  );
}
