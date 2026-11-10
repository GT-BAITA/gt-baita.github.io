import type { ComponentType } from "react";
import { useTranslation } from "react-i18next";
import { TeamScreen } from "@/features/idp-proposal/screens/team-screen";
import { ProblemScreen } from "@/features/idp-proposal/screens/problem-screen";
import { SolutionScreen } from "@/features/idp-proposal/screens/solution-screen";
import { BenefitsScreen } from "@/features/idp-proposal/screens/benefits-screen";
import { ArchitectureScreen } from "@/features/idp-proposal/screens/architecture-screen";
import { LoginScreen } from "@/features/idp-proposal/screens/login-screen";
import { UsersScreen } from "@/features/idp-proposal/screens/users-screen";
import { MetricsScreen } from "@/features/idp-proposal/screens/metrics-screen";
import { ProcessScreen } from "@/features/idp-proposal/screens/process-screen";
import { FaqScreen } from "@/features/idp-proposal/screens/faq-screen";

export const COVER_ID = "cover";
export const PROPOSAL_PATH = "/idp-proposal";

type ProposalSlide = { id: string; labelKey: string; Screen: ComponentType };
type ProposalSection = {
  labelKey: string;
  slides: ProposalSlide[];
  hidden?: boolean;
};

/** Rotas estáveis; os rótulos vêm do mesmo catálogo de idiomas do site. */
const ALL_SECTIONS: ProposalSection[] = [
  {
    labelKey: "proposal.navigation.introduction",
    slides: [
      { id: "team", labelKey: "proposal.navigation.team", Screen: TeamScreen },
    ],
  },
  {
    labelKey: "proposal.navigation.problemSolution",
    slides: [
      {
        id: "problem",
        labelKey: "proposal.navigation.problem",
        Screen: ProblemScreen,
      },
      {
        id: "solution",
        labelKey: "proposal.navigation.solution",
        Screen: SolutionScreen,
      },
      {
        id: "benefits",
        labelKey: "proposal.navigation.benefits",
        Screen: BenefitsScreen,
      },
    ],
  },
  {
    labelKey: "proposal.navigation.technicalSolution",
    slides: [
      {
        id: "architecture",
        labelKey: "proposal.navigation.architecture",
        Screen: ArchitectureScreen,
      },
    ],
  },
  {
    labelKey: "proposal.navigation.product",
    slides: [
      {
        id: "login",
        labelKey: "proposal.navigation.login",
        Screen: LoginScreen,
      },
      { id: "users", labelKey: "proposal.common.users", Screen: UsersScreen },
      {
        id: "metrics",
        labelKey: "proposal.common.metrics",
        Screen: MetricsScreen,
      },
    ],
  },
  {
    labelKey: "proposal.navigation.nextSteps",
    // TODO: revisar o conteúdo de Processo em um próximo PR antes de reexibi-lo.
    hidden: true,
    slides: [
      {
        id: "process",
        labelKey: "proposal.navigation.process",
        Screen: ProcessScreen,
      },
    ],
  },
  {
    labelKey: "proposal.faq.questions",
    // TODO: revisar o conteúdo do FAQ em um próximo PR antes de reexibi-lo.
    hidden: true,
    slides: [{ id: "faq", labelKey: "proposal.faq.title", Screen: FaqScreen }],
  },
];

export const SECTIONS = ALL_SECTIONS.filter((section) => !section.hidden);

/** A navegação por teclado inclui a capa antes da primeira seção. */
export const SLIDES = [
  { id: COVER_ID, labelKey: "proposal.navigation.cover", sectionIndex: -1 },
  ...SECTIONS.flatMap((section, sectionIndex) =>
    section.slides.map(({ id, labelKey }) => ({ id, labelKey, sectionIndex }))
  ),
];

const LEGACY_SLIDES: Record<string, string> = {
  capa: COVER_ID,
  equipe: "team",
  problema: "problem",
  solucao: "solution",
  beneficios: "benefits",
  arq: "architecture",
  usuarios: "users",
  metricas: "metrics",
  processo: "process",
};

/** Preserva links compartilhados antes da padronização dos nomes. */
export function resolveSlideId(slide?: string): string {
  const id = slide ? (LEGACY_SLIDES[slide] ?? slide) : COVER_ID;
  return SLIDES.some((item) => item.id === id) ? id : COVER_ID;
}

export const getSlidePath = (id: string) =>
  id === COVER_ID ? PROPOSAL_PATH : `${PROPOSAL_PATH}/${id}`;

export const findSlide = (id: string) =>
  SECTIONS.flatMap((section) => section.slides).find(
    (slide) => slide.id === id
  );

/** Tons das divisórias; acompanham a seção, independentemente do idioma. */
export const getSectionTone = (sectionIndex: number) =>
  sectionIndex < 0 ? "var(--tone-cover)" : `var(--tone-${sectionIndex % 6})`;

export function useProposalNavigation() {
  const { t } = useTranslation();
  return {
    sections: SECTIONS.map((section) => ({
      label: t(section.labelKey),
      slides: section.slides.map((slide) => ({
        ...slide,
        label: t(slide.labelKey),
      })),
    })),
    slides: SLIDES.map((slide) => ({ ...slide, label: t(slide.labelKey) })),
  };
}
