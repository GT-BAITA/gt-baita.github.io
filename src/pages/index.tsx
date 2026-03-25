import { AboutSection } from "@/components/home/about-section";
import { FAQSection } from "@/components/home/faq-section";
import { FeaturesSection } from "@/components/home/features-section";
import { InitSection } from "@/components/home/init-section";
import { RoadmapSection } from "@/components/home/roadmap-section";
import { TeamSection } from "@/components/home/team-section";

export function Home() {
  return (
    <>
      <InitSection />
      <div className="md:hidden visible">
        <AboutSection />
      </div>
      <FeaturesSection />
      <RoadmapSection />
      <TeamSection />
      {/* <YouTubeEmbed /> */}
      <FAQSection />
    </>
  );
}
