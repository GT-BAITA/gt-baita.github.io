import { useTranslation } from "react-i18next";
import {
  StepSlide,
  type Step,
} from "@/features/idp-proposal/components/step-slide";
import { UserConsole } from "@/features/idp-proposal/product/user-console";

/**
 * Percorre a lista de usuários e as abas do console com dados fictícios.
 */

export function UsersScreen() {
  const { t: translate } = useTranslation();

  const steps: Step[] = [
    {
      title: translate("proposal.usersSlide.listTitle"),
      body: translate("proposal.usersSlide.listBody"),
      label: translate("proposal.usersSlide.listLabel"),
    },
    {
      title: translate("proposal.users.details"),
      body: translate("proposal.usersSlide.detailsBody"),
      label: translate("proposal.usersSlide.detailsLabel"),
    },
    {
      title: translate("proposal.common.groups"),
      body: translate("proposal.usersSlide.groupsBody"),
      label: translate("proposal.usersSlide.groupsLabel"),
    },
    {
      title: translate("proposal.users.consents"),
      body: translate("proposal.usersSlide.consentsBody"),
      label: translate("proposal.usersSlide.consentsLabel"),
    },
    {
      title: translate("proposal.common.sessions"),
      body: translate("proposal.usersSlide.sessionsBody"),
      label: translate("proposal.usersSlide.sessionsLabel"),
    },
    {
      title: translate("proposal.users.events"),
      body: translate("proposal.usersSlide.eventsBody"),
      label: translate("proposal.usersSlide.eventsLabel"),
    },
  ];

  return (
    <StepSlide
      head={
        <>
          <span className="d1">
            {translate("proposal.usersSlide.headingLead")}
          </span>{" "}
          {translate("proposal.usersSlide.headingEnd")}
        </>
      }
      steps={steps}
      screen={UserConsole}
    />
  );
}
