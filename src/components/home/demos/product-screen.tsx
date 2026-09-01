import { useTranslation } from "react-i18next";

/**
 * Imagem estática de um dos produtos, emoldurada em uma janela de navegador.
 *
 * A janela de prévia mantém o mesmo enquadramento nos dois idiomas. As artes
 * em inglês são capturadas/exportadas das mesmas telas das versões em
 * português:
 *
 * - benefits: capturas do Portal de Benefícios em pt-BR e inglês, no mesmo
 *   viewport de 1280×980.
 * - management: a versão em inglês é o frame 40004264:1680 exportado do
 *   Figma e recortado no mesmo enquadramento da captura em português.
 * - idp: ainda não há nada construído para capturar. A janela continua sendo
 *   desenhada, com uma observação dentro, para manter os três cards iguais.
 */

type Screen = "benefits" | "management" | "idp";
type AssetLanguage = "pt" | "en";

/** null quando ainda não há nada para mostrar — a janela continua sendo
 *  desenhada, com uma observação no lugar da captura. */
const SOURCES: Record<Screen, Record<AssetLanguage, string | null>> = {
  benefits: {
    pt: "/media/screen-benefits-pt.jpg",
    en: "/media/screen-benefits-en.jpg",
  },
  management: {
    pt: "/media/screen-management-pt.jpg",
    en: "/media/screen-management-en.png",
  },
  idp: { pt: null, en: null },
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
          {source ? (
            <img
              className="t-screen-shot"
              src={source}
              alt={t(`screens.${screen}.alt`)}
              width={1280}
              height={980}
              loading="lazy"
              decoding="async"
            />
          ) : (
            // Dimensionado em cqw em relação à moldura, que é um container:
            // a janela tem ~685px na coluna fixada e ~294px dentro de um card
            // no celular; um tamanho fixo seria um título em um caso e quase
            // ilegível no outro.
            <p className="flex h-full w-full items-center justify-center bg-neutral-900 font-domine text-[clamp(20px,4.2cqw,34px)] text-neutral-400">
              {t("screens.pending")}
            </p>
          )}
        </div>
      </figure>
    </div>
  );
}
