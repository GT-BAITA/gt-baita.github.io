import { useEffect } from "react";
import { useLocation } from "react-router-dom";

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
    window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
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
