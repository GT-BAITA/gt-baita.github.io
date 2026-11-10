import { useTranslation } from "react-i18next";
import {
  StepSlide,
  type Step,
} from "@/features/idp-proposal/components/step-slide";
import {
  DirectVisual,
  HostedVisual,
  OneLoginVisual,
  WeeksVisual,
} from "@/features/idp-proposal/screens/benefits-visuals";

/**
 * Relaciona cada benefício ao problema correspondente, um passo por vez.
 */

export function BenefitsScreen() {
  const { t: translate } = useTranslation();

  const steps: Step[] = [
    {
      title: translate("proposal.benefits.weeksTitle"),
      body: translate("proposal.benefits.weeksBody"),
      Visual: WeeksVisual,
      label: translate("proposal.benefits.weeksLabel"),
    },
    {
      title: translate("proposal.benefits.hostingTitle"),
      body: translate("proposal.benefits.hostingBody"),
      Visual: HostedVisual,
      label: translate("proposal.benefits.hostingLabel"),
    },
    {
      title: translate("proposal.benefits.ssoTitle"),
      body: translate("proposal.benefits.ssoBody"),
      Visual: OneLoginVisual,
      label: translate("proposal.benefits.ssoLabel"),
    },
    {
      title: translate("proposal.benefits.supportTitle"),
      body: translate("proposal.benefits.supportBody"),
      Visual: DirectVisual,
      label: translate("proposal.benefits.supportLabel"),
    },
  ];

  return (
    <StepSlide
      head={
        <>
          <span className="d1">
            {translate("proposal.benefits.headingLead")}
          </span>{" "}
          {translate("proposal.benefits.headingEnd")}
        </>
      }
      steps={steps}
    />
  );
}
