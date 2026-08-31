import { useTranslation } from "react-i18next";

/**
 * Imagem estática de um dos produtos, emoldurada em uma janela de navegador.
 *
 * As duas telas são capturadas no mesmo 1280×980 — o formato da janela de
 * prévia na coluna fixada —, então a matemática do enquadramento é idêntica
 * para ambas e trocar uma pela outra não exige mudança de layout. O mesmo
 * vale para o tour gravado e arquivado em scripts/portal-tour/, capturado
 * nesse tamanho pelo mesmo motivo.
 *
 * Elas vêm de lugares diferentes, porém, e apenas uma pode ser regenerada por
 * script — e uma ainda não tem nada para mostrar:
 *
 * - benefits: o portal em produção em servicos.baita.testbeds.rnp.br —
 *   recapture com scripts/capture-portal-screen.mjs sempre que ele mudar,
 *   pois é um testbed.
 * - management: nó 1081:47103 do Figma, exportado em 2x e cortado para os
 *   1280×980 superiores. Não há um sistema em execução para apontar um
 *   script, então reexportar é uma etapa manual.
 * - idp: ainda não há nada construído para capturar. A janela continua sendo
 *   desenhada, com uma observação dentro, para manter os três cards iguais.
 */

type Screen = "benefits" | "management" | "idp";

/** null quando ainda não há nada para mostrar — a janela continua sendo
 *  desenhada, com uma observação no lugar da captura. */
const SOURCES: Record<Screen, string | null> = {
  benefits: "/media/screen-benefits-pt.jpg",
  management: "/media/screen-management-pt.jpg",
  idp: null,
};

export function ProductScreen({
  screen,
  variant,
}: {
  screen: Screen;
  variant: "column" | "inline";
}) {
  const { t } = useTranslation();
  const source = SOURCES[screen];

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
