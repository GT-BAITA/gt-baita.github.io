import { useLayoutEffect } from "react";
import { useTranslation } from "react-i18next";
import { ProposalPresentation } from "@/features/idp-proposal/proposal-presentation";
import "@/features/idp-proposal/styles/app.css";
import "@/features/idp-proposal/styles/product.css";

/** Apresentação independente do cabeçalho e da rolagem do site. */
export function IdpProposalPage() {
  const { t, i18n } = useTranslation();
  const language = i18n.language.startsWith("en") ? "en" : "pt-BR";
  useLayoutEffect(() => {
    const title = document.title;
    const lang = document.documentElement.lang;
    document.title = t("proposal.meta.title");
    document.documentElement.lang = language;
    document.body.classList.add("idp-proposal-active");
    return () => {
      document.title = title;
      document.documentElement.lang = lang;
      document.body.classList.remove("idp-proposal-active");
    };
  }, [t, language]);

  return (
    <div className="idp-proposal">
      <ProposalPresentation />
    </div>
  );
}
