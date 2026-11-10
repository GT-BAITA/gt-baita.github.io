import { useTranslation } from "react-i18next";
import {
  StepSlide,
  type Step,
} from "@/features/idp-proposal/components/step-slide";
import { MetricsConsole } from "@/features/idp-proposal/product/metrics-console";

/**
 * Destaca os indicadores e gráficos de autenticação do console a cada passo.
 */

export function MetricsScreen() {
  const { t: translate } = useTranslation();

  const steps: Step[] = [
    {
      title: translate("proposal.metricsSlide.overviewTitle"),
      body: translate("proposal.metricsSlide.overviewBody"),
      label: translate("proposal.metricsSlide.overviewLabel"),
    },
    {
      title: translate("proposal.metricsSlide.activityTitle"),
      body: translate("proposal.metricsSlide.activityBody"),
      label: translate("proposal.metricsSlide.activityLabel"),
    },
    {
      title: translate("proposal.metricsSlide.reasonsTitle"),
      body: translate("proposal.metricsSlide.reasonsBody"),
      label: translate("proposal.metricsSlide.reasonsLabel"),
    },
    {
      title: translate("proposal.metricsSlide.clientsTitle"),
      body: translate("proposal.metricsSlide.clientsBody"),
      label: translate("proposal.metricsSlide.clientsLabel"),
    },
  ];

  return (
    <StepSlide
      head={
        <>
          <span className="d1">
            {translate("proposal.metricsSlide.headingLead")}
          </span>{" "}
          {translate("proposal.metricsSlide.headingEnd")}
        </>
      }
      steps={steps}
      screen={MetricsConsole}
    />
  );
}
