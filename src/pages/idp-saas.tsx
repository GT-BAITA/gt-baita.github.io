import { useEffect, useRef } from "react";
import "@/components/idp/idp.css";
import { useIdpContent } from "@/components/idp/content";
import { HeroSection } from "@/components/idp/hero-section";
import {
  // PieceSection, — substituída por RoleSection (ver o comentário no JSX).
  ProblemSection,
  // StartingPointSection, — fora da V1 (ver o comentário no JSX).
  WhySection,
} from "@/components/idp/story-sections";
import { HowSection } from "@/components/idp/how-section";
import { RoleSection } from "@/components/idp/role-section";
import { BenefitsSection } from "@/components/idp/benefits-section";
import { QuizSection } from "@/components/idp/quiz-section";
import { FaqSection } from "@/components/idp/faq-section";
// import { CtaSection, ProofSection } from "@/components/idp/closing-sections";
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
      <RoleSection />
      {/* Fora da V1, por revisão do conteúdo: "Como funciona" já cobre os
          pontos de partida. Volta descomentando aqui e no import.
      <StartingPointSection /> */}
      <HowSection />
      {/* "A peça que faltava" virou "O que é um IdP" (RoleSection, logo
          depois do Problema), com a mesma linguagem visual.
      <PieceSection /> */}
      <WhySection />
      <BenefitsSection />
      {/* O FAQ vem antes do diagnóstico: tira as dúvidas antes da decisão, e
          o diagnóstico fica colado no formulário de contato do rodapé. */}
      <FaqSection />
      <QuizSection />
      {/* Fora da V1: a prova do piloto volta quando houver resultados para
          mostrar. Volta descomentando aqui e no import.
      <ProofSection /> */}
      {/* Fora da V1: o diagnóstico virou o "próximo passo" da página.
      <CtaSection /> */}
    </div>
  );
}
