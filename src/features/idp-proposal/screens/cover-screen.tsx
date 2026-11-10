import { useTranslation } from "react-i18next";
import { DitherOrb } from "@/features/idp-proposal/components/dither-orb";
import { rv } from "@/features/idp-proposal/components/slide-layout";

/**
 * Capa da proposta, com o resumo da conversa e o globo pontilhado.
 */
export function CoverScreen() {
  const { t: translate } = useTranslation();

  return (
    <div className="cover">
      <DitherOrb className="cover-orb rv" />
      <span className="wordmark cover-mark rv" style={rv(0)}>
        GT-Baita
      </span>

      <div className="cover-copy">
        <h1 className="cover-title rv" style={rv(1)}>
          IdP SaaS
        </h1>
        <p className="cover-sub rv" style={rv(2)}>
          {translate("proposal.cover.summary")}{" "}
          <strong>{translate("proposal.cover.invitation")}</strong>
        </p>
      </div>

      <div className="cover-foot rv" style={rv(3)}>
        {/* Nome oficial do programa (chamada pública da RNP) e o ciclo do GT,
            o mesmo do rodapé do site: PD&I RNP 2025-2027. */}
        <span>{translate("proposal.cover.programme")}</span>
        <span>{translate("proposal.cover.cycle")}</span>
      </div>
    </div>
  );
}
