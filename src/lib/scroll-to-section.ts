import { ScrollSmoother } from "gsap/ScrollSmoother";

/**
 * Scrolls to an in-page section by selector.
 *
 * Two reasons this cannot just be `<a href="#contact-form">`:
 *
 * 1. The app mounts a HashRouter, so the URL hash *is* the route.
 *    A bare `#contact-form` href navigates to a route named
 *    "contact-form", which matches nothing and renders NotFound — the
 *    whole page content disappears.
 * 2. ScrollSmoother owns the scroll position; going through it keeps
 *    the jump in step with the smoothed content instead of fighting it.
 */
export function scrollToSection(selector: string, offset = 100) {
  const target = document.querySelector<HTMLElement>(selector);
  if (!target) return;

  const smoother = ScrollSmoother.get();
  if (smoother) {
    smoother.scrollTo(target, true, `top ${offset}px`);
    return;
  }

  const top = target.getBoundingClientRect().top + window.scrollY - offset;
  window.scrollTo({ top, behavior: "smooth" });
}
