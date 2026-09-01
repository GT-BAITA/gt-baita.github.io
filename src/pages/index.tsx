import { AboutSection } from "@/components/home/about-section";
import { BenefitsSection } from "@/components/home/benefits-section";
import { InitSection } from "@/components/home/init-section";
import { SolutionsSection } from "@/components/home/solutions-section";
import { UseCasesSection } from "@/components/home/use-cases-section";

/**
 * A página está sendo refeita do zero a partir do arquivo mestre do Figma
 * (arquivo DRQsUf0HedIdSMsLCt8PcX, frame `/home`, nó 1058:35737), então tudo
 * entre o hero e o rodapé fica arquivado aqui.
 *
 * Nada foi excluído: cada componente de seção continua em
 * src/components/home/, então reativar uma seção é descomentar sua importação
 * e sua linha na árvore abaixo.
 *
 * O rodapé não aparece aqui — ele é renderizado por Layout, e o formulário de
 * newsletter vive dentro dele, então ambos continuaram ativos automaticamente.
 *
 * Seções arquivadas, na ordem original:
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
 * Um <YouTubeEmbed /> (src/components/home/youtube-player.tsx) ficava entre
 * TeamSection e FAQSection e já estava comentado antes desta alteração.
 */

export function Home() {
  return (
    <>
      <InitSection />

      {/* AboutSection é uma divisão responsiva, não uma duplicação: InitSection
          a renderiza dentro do hero a partir de md, e esta página a renderiza
          abaixo do hero no mobile. As duas metades precisam existir para que o
          hero corresponda em todos os breakpoints. */}
      <div className="md:hidden visible">
        <AboutSection />
      </div>

      <SolutionsSection />
      <BenefitsSection />
      <UseCasesSection />
    </>
  );
}
