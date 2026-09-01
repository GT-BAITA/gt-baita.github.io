import { useEffect, useRef, useState } from "react";

/**
 * Muda para true na primeira vez que o elemento entra na tela e nunca volta
 * — para animações de entrada que devem tocar uma única vez.
 *
 * Usa true como fallback quando IntersectionObserver não existe, para que o
 * conteúdo nunca fique preso no estado inicial oculto.
 */
export function useEnterOnce<T extends HTMLElement>(amount = 0.35) {
  const ref = useRef<T | null>(null);
  const [hasEntered, setHasEntered] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    if (typeof IntersectionObserver === "undefined") {
      setHasEntered(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        setHasEntered(true);
        observer.disconnect();
      },
      { threshold: amount }
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, [amount]);

  return { ref, hasEntered };
}
