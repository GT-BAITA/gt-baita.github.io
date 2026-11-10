import { useTranslation } from "react-i18next";

/**
 * Imagem estática de um dos produtos, emoldurada em uma janela de navegador.
 *
 * A janela de prévia mantém o mesmo enquadramento nos dois idiomas:
 *
 * - benefits: capturas do Portal de Benefícios em pt-BR e inglês, no mesmo
 *   viewport de 1280×980.
 * - management: a versão em inglês é o frame 40004264:1680 exportado do
 *   Figma e recortado no mesmo enquadramento da captura em português.
 * - idp: prévia estática do login institucional, baseada na tela da
 *   apresentação da proposta, em português e inglês.
 */

type Screen = "benefits" | "management" | "idp";
type AssetLanguage = "pt" | "en";

const SOURCES: Record<Screen, Record<AssetLanguage, string>> = {
  benefits: {
    pt: "/media/screen-benefits-pt.jpg",
    en: "/media/screen-benefits-en.jpg",
  },
  management: {
    pt: "/media/screen-management-pt.jpg",
    en: "/media/screen-management-en.png",
  },
  idp: {
    pt: "/media/screen-idp-pt.svg",
    en: "/media/screen-idp-en.svg",
  },
};

export function ProductScreen({
  screen,
  variant,
}: {
  screen: Screen;
  variant: "column" | "inline";
}) {
  const { t, i18n } = useTranslation();
  const assetLanguage: AssetLanguage = i18n.language.startsWith("pt")
    ? "pt"
    : "en";
  const source = SOURCES[screen][assetLanguage];

  return (
    <div className="t-screen-slot" data-variant={variant}>
      <figure className="t-screen-frame m-0">
        {/* A moldura da janela é marcação, não parte da captura: a imagem é
            apenas a área visível, e desenhar a moldura aqui a mantém nítida
            e permite seguir os raios da própria página. */}
        <div className="t-screen-bar" aria-hidden="true">
          <span />
          <span />
          <span />
        </div>

        <div className="t-screen-stage">
          <img
            className="t-screen-shot"
            src={source}
            alt={t(`screens.${screen}.alt`)}
            width={1280}
            height={980}
            loading="lazy"
            decoding="async"
          />
        </div>
      </figure>
    </div>
  );
}
