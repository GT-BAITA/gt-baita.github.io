import { useLayoutEffect } from "react";
import { useLocation } from "react-router-dom";
import { themeTransitionActive } from "./theme-transition";

/**
 * O que muda de uma rota para outra no "chassi" do site (Layout, cabeçalho,
 * rodapé). O site principal é claro; o microsite do IdP vira a chave para o
 * modo escuro, voltado ao público técnico.
 */
export type RouteChrome = {
  theme: "light" | "dark";
  /** ScrollSmoother desligado: ele quebra `position: sticky`. */
  smoothScroll: boolean;
  /** Sem o container de 1264px: a página cuida das próprias margens. */
  fullBleed: boolean;
  ctaMessageKey?: string;
};

export const IDP_PATH = "/idp-saas";

const MAIN: RouteChrome = {
  theme: "light",
  smoothScroll: true,
  fullBleed: false,
};

const IDP: RouteChrome = {
  theme: "dark",
  smoothScroll: false,
  fullBleed: true,
  ctaMessageKey: "solutions.card3.message",
};

export function getRouteChrome(pathname: string): RouteChrome {
  return pathname.startsWith(IDP_PATH) ? IDP : MAIN;
}

export function useRouteChrome() {
  return getRouteChrome(useLocation().pathname);
}

const SWITCH_MS = 600;
// A primeira aplicação (carregamento da página) não anima: quem abre
// /idp-saas direto não deve ver o site claro "virando".
let firstApply = true;

/**
 * Aplica o tema da rota no <html>. Na primeira renderização a classe entra
 * sem transição; nas trocas seguintes, `theme-switching` dá à virada uma
 * transição curta (ver global.css).
 */
export function useApplyTheme(theme: RouteChrome["theme"]) {
  useLayoutEffect(() => {
    const root = document.documentElement;
    const isDark = theme === "dark";
    // Numa virada por View Transition (theme-transition.ts) o círculo já é
    // a animação: as cores trocam de uma vez, por baixo dele.
    const animate = !firstApply && !themeTransitionActive();
    firstApply = false;
    if (root.classList.contains("dark") === isDark) return;
    if (!animate) {
      root.classList.toggle("dark", isDark);
      return;
    }

    root.classList.add("theme-switching");
    root.classList.toggle("dark", isDark);
    const timer = window.setTimeout(
      () => root.classList.remove("theme-switching"),
      SWITCH_MS
    );
    return () => {
      window.clearTimeout(timer);
      root.classList.remove("theme-switching");
    };
  }, [theme]);
}
