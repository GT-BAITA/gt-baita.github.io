import { scrollToSection } from "./scroll-to-section";

/**
 * Sends the visitor to the contact form with the Message field already
 * filled in for whatever they clicked.
 *
 * A window event rather than shared state or a context: the CTAs and
 * the form live in different branches of the tree (page sections vs.
 * the footer), and threading a setter between them would mean lifting
 * state to the layout for one string.
 */

const EVENT = "baita:contact-request";
const FORM_TARGET = "#contact-form";

/**
 * @param message Prefills the form's Message field. Pass nothing for a
 * neutral CTA — it still clears a message a previous CTA injected, so
 * the visitor never arrives with wording from a button they did not
 * click last.
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
