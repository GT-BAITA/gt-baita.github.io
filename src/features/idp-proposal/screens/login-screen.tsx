import { useTranslation } from "react-i18next";
import {
  StepSlide,
  type Step,
} from "@/features/idp-proposal/components/step-slide";
import { LoginFlow } from "@/features/idp-proposal/product/login-flow";

/**
 * Demonstra login institucional, segundo fator e reaproveitamento da sessão.
 */

export function LoginScreen() {
  const { t: translate } = useTranslation();

  const steps: Step[] = [
    {
      title: translate("proposal.login.accessTitle"),
      body: translate("proposal.login.accessBody"),
      label: translate("proposal.login.accessLabel"),
    },
    {
      title: translate("proposal.login.institutionalTitle"),
      body: translate("proposal.login.institutionalBody"),
      label: translate("proposal.login.institutionalLabel"),
    },
    {
      title: translate("proposal.common.secondFactor"),
      body: translate("proposal.login.mfaBody"),
      label: translate("proposal.login.mfaLabel"),
    },
    {
      title: translate("proposal.login.ssoTitle"),
      body: translate("proposal.login.ssoBody"),
      label: translate("proposal.login.ssoLabel"),
    },
  ];

  return (
    <StepSlide
      head={
        <>
          <span className="d1">{translate("proposal.login.headingLead")}</span>{" "}
          {translate("proposal.login.headingEnd")}
        </>
      }
      steps={steps}
      screen={LoginFlow}
    />
  );
}
