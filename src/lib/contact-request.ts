import { scrollToSection } from "./scroll-to-section";

/**
 * Leva o visitante ao formulário de contato com o campo de mensagem já
 * preenchido de acordo com o que foi clicado.
 *
 * Usa um evento da janela em vez de estado compartilhado ou contexto: os CTAs
 * e o formulário vivem em ramos diferentes da árvore (seções da página e
 * rodapé), e passar um setter entre eles exigiria elevar ao layout o estado
 * de uma única string.
 */

const EVENT = "baita:contact-request";
const FORM_TARGET = "#contact-form";

/** O que um CTA manda ao formulário: a mensagem visível e campos ocultos. */
type ContactDetail = { message: string; fields: Record<string, string> };

/**
 * @param message Preenche o campo de mensagem do formulário. Não passe nada
 * para um CTA neutro — ele ainda limpa uma mensagem injetada por um CTA
 * anterior, para que o visitante nunca chegue com o texto de um botão que não
 * foi o último clicado.
 * @param fields Campos ocultos enviados junto com o formulário (ex.: o
 * resultado padronizado do diagnóstico do IdP). Um CTA sem eles limpa os de
 * um CTA anterior.
 */
export function requestContact(message = "", fields: Record<string, string> = {}) {
  window.dispatchEvent(
    new CustomEvent<ContactDetail>(EVENT, { detail: { message, fields } })
  );
  scrollToSection(FORM_TARGET);
}

export function onContactRequest(
  handler: (message: string, fields: Record<string, string>) => void
) {
  const listener = (event: Event) => {
    const { message, fields } = (event as CustomEvent<ContactDetail>).detail;
    handler(message, fields);
  };

  window.addEventListener(EVENT, listener);
  return () => window.removeEventListener(EVENT, listener);
}
