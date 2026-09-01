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

/**
 * @param message Preenche o campo de mensagem do formulário. Não passe nada
 * para um CTA neutro — ele ainda limpa uma mensagem injetada por um CTA
 * anterior, para que o visitante nunca chegue com o texto de um botão que não
 * foi o último clicado.
 */
export function requestContact(message = "") {
  window.dispatchEvent(new CustomEvent(EVENT, { detail: message }));
  scrollToSection(FORM_TARGET);
}

export function onContactRequest(handler: (message: string) => void) {
  const listener = (event: Event) => {
    handler((event as CustomEvent<string>).detail);
  };

  window.addEventListener(EVENT, listener);
  return () => window.removeEventListener(EVENT, listener);
}
