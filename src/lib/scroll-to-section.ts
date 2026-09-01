import { ScrollSmoother } from "gsap/ScrollSmoother";

/**
 * Rola até uma seção da página usando um seletor.
 *
 * Há dois motivos para não usar apenas `<a href="#contact-form">`:
 *
 * 1. A aplicação monta um HashRouter, então o hash da URL *é* a rota. Um
 *    href `#contact-form` simples navega para uma rota chamada
 *    "contact-form", que não corresponde a nada e renderiza NotFound — todo
 *    o conteúdo da página desaparece.
 * 2. O ScrollSmoother controla a posição de rolagem; passar por ele mantém o
 *    salto sincronizado com o conteúdo suavizado, em vez de competir com ele.
 */
export function scrollToSection(selector: string, offset = 100, smooth = true) {
  const target = document.querySelector<HTMLElement>(selector);
  if (!target) return;

  const smoother = ScrollSmoother.get();
  if (smoother) {
    smoother.scrollTo(target, smooth, `top ${offset}px`);
    return;
  }

  const top = target.getBoundingClientRect().top + window.scrollY - offset;
  window.scrollTo({ top, behavior: smooth ? "smooth" : "auto" });
}
