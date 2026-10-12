import { useEffect } from "react";
import { flushSync } from "react-dom";
import { useNavigate } from "react-router-dom";
import { getRouteChrome } from "./route-theme";

/**
 * Virada de tema como um interruptor: ao seguir um link que troca o modo
 * (ex.: da página inicial para o IdP), a página nova aparece num círculo
 * que cresce a partir do ponto do clique e cobre a tela, por cima da
 * antiga. Usa a View Transitions API: o navegador fotografa a página
 * atual, a navegação acontece por baixo, e a nova é revelada pelo
 * clip-path. O pontilhado do hero segue vivo dentro do círculo.
 *
 * Sem suporte à API, ou com movimento reduzido, o link segue normal e vale
 * a transição curta de cores de useApplyTheme.
 */

/** true enquanto uma virada por View Transition está em andamento. */
let active = false;
export const themeTransitionActive = () => active;

export function useThemeTransitionLinks() {
  const navigate = useNavigate();

  useEffect(() => {
    if (!document.startViewTransition) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");

    // Captura no document: roda antes do onClick do <Link>, que respeita o
    // preventDefault e não navega de novo.
    const onClick = (e: MouseEvent) => {
      if (reduce.matches || active || e.defaultPrevented) return;
      if (e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const link = (e.target as Element | null)?.closest?.("a");
      const href = link?.getAttribute("href");
      if (!link || !href?.startsWith("#/") || (link.target && link.target !== "_self")) return;

      const to = href.slice(1);
      const goingDark = getRouteChrome(to.split(/[?#]/)[0]).theme === "dark";
      if (goingDark === document.documentElement.classList.contains("dark")) return;

      e.preventDefault();
      // Em % da tela, não em px: o snapshot da transição pode ter outra
      // escala que a da página (zoom, tela de alta densidade). Pelo teclado
      // (detail 0) o clique não tem posição: o círculo sai do link.
      const box = link.getBoundingClientRect();
      const cx = e.detail ? e.clientX : box.x + box.width / 2;
      const cy = e.detail ? e.clientY : box.y + box.height / 2;
      const root = document.documentElement;
      root.style.setProperty("--vt-x", `${((cx / innerWidth) * 100).toFixed(2)}%`);
      root.style.setProperty("--vt-y", `${((cy / innerHeight) * 100).toFixed(2)}%`);
      // A animação do círculo é CSS (global.css, html.theme-vt), não JS: vale
      // desde o primeiro quadro da transição. Disparada por JS no `ready`,
      // ela chegava um quadro atrasada, e a página nova aparecia inteira
      // nesse quadro — uma piscada.
      root.classList.add("theme-vt");

      active = true;
      const vt = document.startViewTransition(() => {
        flushSync(() => navigate(to));
      });
      vt.finished.finally(() => {
        active = false;
        root.classList.remove("theme-vt");
      });
    };

    document.addEventListener("click", onClick, true);
    return () => document.removeEventListener("click", onClick, true);
  }, [navigate]);
}
