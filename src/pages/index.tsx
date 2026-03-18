import { AboutSection } from '@/components/sections/about-section';
import { FAQSection } from '@/components/sections/faq-section';
import { FeaturesSection } from '@/components/sections/features-section';
import { InitSection } from '@/components/sections/init-section';
import { RoadmapSection } from '@/components/sections/roadmap-section';
import { TeamSection } from '@/components/sections/team-section';

export function Home() {
  return (
    <>
      <InitSection />
      <div className="lg:hidden visible">
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
