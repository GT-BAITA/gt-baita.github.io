import { useEffect, useRef } from "react";
import "@/components/idp/idp.css";
import { useIdpContent } from "@/components/idp/content";
import { HeroSection } from "@/components/idp/hero-section";
import {
  PieceSection,
  ProblemSection,
  // StartingPointSection, — fora da V1 (ver o comentário no JSX).
  WhySection,
} from "@/components/idp/story-sections";
import { HowSection } from "@/components/idp/how-section";
import { BenefitsSection } from "@/components/idp/benefits-section";
import { QuizSection } from "@/components/idp/quiz-section";
import { FaqSection } from "@/components/idp/faq-section";
import { CtaSection /* , ProofSection */ } from "@/components/idp/closing-sections";
import { useReducedMotion, useReveal } from "@/components/idp/primitives";
import { useDither } from "@/components/idp/use-dither";

/**
 * Microsite do IdP BAITA: a versão "invertida" do site principal, escura e
 * voltada ao público técnico. Usa o mesmo Layout (cabeçalho, rodapé com o
 * formulário de contato); o modo escuro e a rolagem nativa vêm da rota —
 * ver src/lib/route-theme.ts.
 */
export function IdpSaasPage() {
  const rootRef = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const c = useIdpContent();

  useReveal(rootRef, reduce);
  useDither(rootRef, reduce);

  useEffect(() => {
    const prev = document.title;
    document.title = c.meta.title;
    return () => {
      document.title = prev;
    };
  }, [c.meta.title]);

  return (
    <div className="idp" ref={rootRef}>
      <HeroSection />
      <ProblemSection />
      {/* Fora da V1, por revisão do conteúdo: "Como funciona" já cobre os
          pontos de partida. Volta descomentando aqui e no import.
      <StartingPointSection /> */}
      <HowSection />
      <PieceSection />
      <WhySection />
      <BenefitsSection />
      <QuizSection />
      <FaqSection />
      {/* Fora da V1: a prova do piloto volta quando houver resultados para
          mostrar. Volta descomentando aqui e no import.
      <ProofSection /> */}
      <CtaSection />
    </div>
  );
}
