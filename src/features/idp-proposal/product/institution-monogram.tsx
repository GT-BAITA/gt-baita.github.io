import { useTranslation } from "react-i18next";
import { EXAMPLE_INSTITUTION } from "@/features/idp-proposal/product/brand";

/** Marca da instituição fictícia: só as iniciais, num quadrado neutro. */
export function InstitutionMonogram({ size = 32 }: { size?: number }) {
  const { t: translate } = useTranslation();

  return (
    <span
      className="p-mono"
      style={{ width: size, height: size, fontSize: size * 0.38 }}
      aria-label={translate("proposal.console.institution")}
    >
      {EXAMPLE_INSTITUTION.short}
    </span>
  );
}
