import { useTranslation } from "react-i18next";
import {
  SlideLayout,
  StarLabels,
} from "@/features/idp-proposal/components/slide-layout";

/**
 * Apresenta a divisão de responsabilidades entre o GT e a instituição.
 */
export function SolutionScreen() {
  const { t: translate } = useTranslation();

  return (
    <SlideLayout
      label={translate("proposal.solution.label")}
      statement={
        <>
          <p className="big">
            <span className="d1">
              {translate("proposal.solution.headingLead")}
            </span>{" "}
            {translate("proposal.solution.headingEnd")}
          </p>
          <p className="lead">
            {translate("proposal.solution.descriptionLead")}{" "}
            <span className="nowrap">GT-Baita</span>
            {translate("proposal.solution.descriptionEnd")}
          </p>
        </>
      }
      visual={
        <StarLabels
          center="IdP SaaS"
          labels={[
            { at: 0, text: translate("proposal.common.academicSystem") },
            { at: 5, text: translate("proposal.common.library") },
            { at: 7, text: translate("proposal.common.cafeServices") },
            { at: 4, text: translate("proposal.common.userBase") },
          ]}
        />
      }
    />
  );
}
