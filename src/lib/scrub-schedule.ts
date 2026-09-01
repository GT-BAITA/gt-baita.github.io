/**
 * Agenda compartilhada das seções fixadas com scrub, em unidades de um item
 * — a timeline tem `count` unidades, então o tempo da timeline e o índice do
 * item compartilham a mesma escala.
 *
 * Mantida em um só lugar porque duas coisas precisam concordar: a timeline
 * que anima as transições e o alvo de clique que rola até um item. Quando
 * discordavam, clicar no primeiro item caía no meio de uma transição e o
 * deixava congelado pela metade.
 */

/** Trecho estático antes da primeira transição. Curto de propósito: uma longa
 *  pausa logo após a fixação parece que a página travou. */
export const LEAD_IN = 0.25;

/** Tempo que um item leva para dar lugar ao próximo. */
export const HAND_OFF = 0.95;

/** Trecho estático entre transições, para que o item possa ser lido. */
export const DWELL = 0.3;

/** Instante da timeline em que o item `index` começa a dar lugar a `index + 1`. */
export function handOffStart(index: number) {
  return LEAD_IN + index * (HAND_OFF + DWELL);
}

/**
 * Progresso (0..1) no meio da janela em que `index` está totalmente aberto
 * — onde um clique deve pousar.
 *
 * A fórmula óbvia `(index + 0.5) / count` assume que cada item possui a zona
 * `[i, i + 1)`, com o item centralizado nela. Isso era verdade antes de as
 * transições serem agendadas independentemente; agora o primeiro item só fica
 * inteiro em `[0, LEAD_IN]`, e essa fórmula coloca o clique bem no meio da
 * sua transição.
 */
export function restProgress(index: number, count: number) {
  const start = index === 0 ? 0 : handOffStart(index - 1) + HAND_OFF;
  const end = index === count - 1 ? count : handOffStart(index);

  return (start + end) / 2 / count;
}
