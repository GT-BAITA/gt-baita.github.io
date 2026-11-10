import { useTranslation } from "react-i18next";
import {
  StepSlide,
  type Step,
} from "@/features/idp-proposal/components/step-slide";
import {
  InfraVisual,
  LoginsVisual,
  QueueVisual,
  TimelineVisual,
} from "@/features/idp-proposal/screens/problem-visuals";

/**
 * Percorre as dificuldades de adesão à CAFe; os benefícios respondem na mesma ordem.
 */

export function ProblemScreen() {
  const { t: translate } = useTranslation();

  const steps: Step[] = [
    {
      title: translate("proposal.problem.monthsTitle"),
      body: translate("proposal.problem.monthsBody"),
      Visual: TimelineVisual,
      label: translate("proposal.problem.monthsLabel"),
    },
    {
      title: translate("proposal.problem.infrastructureTitle"),
      body: translate("proposal.problem.infrastructureBody"),
      Visual: InfraVisual,
      label: translate("proposal.problem.infrastructureLabel"),
    },
    {
      title: translate("proposal.problem.loginsTitle"),
      body: translate("proposal.problem.loginsBody"),
      Visual: LoginsVisual,
      label: translate("proposal.problem.loginsLabel"),
    },
    {
      title: translate("proposal.problem.supportTitle"),
      body: translate("proposal.problem.supportBody"),
      Visual: QueueVisual,
      label: translate("proposal.problem.supportLabel"),
    },
  ];

  return (
    <StepSlide
      head={
        <>
          <span className="d1">
            {translate("proposal.problem.headingLead")}
          </span>{" "}
          {translate("proposal.problem.headingEnd")}
        </>
      }
      steps={steps}
    />
  );
}
