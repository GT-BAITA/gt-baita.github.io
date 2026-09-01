import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { ScrollSmoother } from "gsap/ScrollSmoother";

type ScrollToTopProps = {
  /** Se true, tenta restaurar o scroll ao voltar/avançar (POP). */
  restoreOnPop?: boolean;
};

/**
 * Reseta o scroll ao trocar de rota.
 */
export function ScrollToTop({ restoreOnPop = true }: ScrollToTopProps) {
  const { pathname, search, hash } = useLocation();

  useEffect(() => {
    if (hash) return;
    const smoother = ScrollSmoother.get();

    if (smoother) {
      // Atualiza também o alvo nativo do smoother para que a posição antiga
      // não seja restaurada depois que a animação atual terminar.
      smoother.scrollTo(0, false);
      return;
    }

    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  }, [pathname, search, hash]);

  useEffect(() => {
    if (!restoreOnPop) {
      if ("scrollRestoration" in window.history) {
        window.history.scrollRestoration = "manual";
      }
      return;
    }

    if ("scrollRestoration" in window.history) {
      const prev = window.history.scrollRestoration;
      window.history.scrollRestoration = "auto";
      return () => {
        window.history.scrollRestoration = prev;
      };
    }
  }, [restoreOnPop]);

  return null;
}
