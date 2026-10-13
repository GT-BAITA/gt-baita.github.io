/**
 * Posições do painel do "Problema", em % do painel. Compartilhadas entre o
 * diagrama (cards, bases, IdP, fios) e o pontilhado de fundo.
 */

export type P = { x: number; y: number };

/** Cards no arranjo original do mock: dois à esquerda, dois à direita. */
export const CARD_POS = [
  { left: "8%", top: "10%" },
  { right: "7%", top: "30%" },
  { left: "12%", top: "52%" },
  { right: "9%", bottom: "8%" },
] as const;

/**
 * Antes: a base de cada card, nos vãos livres do arranjo e do lado oposto
 * ao card, para os fios atravessarem o painel (o caos).
 */
export const BEFORE_DBS: P[] = [
  { x: 82, y: 19 },
  { x: 12, y: 38 },
  { x: 87, y: 61 },
  { x: 14, y: 84 },
];

/**
 * Depois: base unificada e IdP em cima, à esquerda (a base acima do IdP);
 * os serviços descem para uma coluna alinhada embaixo, e os fios saem do
 * IdP e entram pela lateral esquerda de cada card.
 */
export const DB: P = { x: 22, y: 11 };
export const IDP: P = { x: 22, y: 27 };
/** Borda esquerda da coluna de serviços (% da largura). */
export const AFTER_LEFT = 34;
/** Centro vertical de cada serviço na coluna (% da altura). */
export const AFTER_Y = [42, 58, 74, 90];
