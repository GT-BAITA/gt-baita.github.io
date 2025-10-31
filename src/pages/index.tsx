import { Layout } from '@/components/layout/layout';
import { AboutSection } from '@/components/sections/about-section';
import { FAQSection } from '@/components/sections/faq-section';
import { FeaturesSection } from '@/components/sections/features-section';
import { InitSection } from '@/components/sections/init-section';
import { RoadmapSection } from '@/components/sections/roadmap-section';
import { TeamSection } from '@/components/sections/team-section';
import YouTubeEmbed from '@/components/sections/youtube-player';

export function Home() {
  return (
    <Layout>
      <InitSection />
      <AboutSection />
      <FeaturesSection />
      <RoadmapSection />
      <TeamSection />
      <YouTubeEmbed />
      <FAQSection />
    </Layout>
  );
}
