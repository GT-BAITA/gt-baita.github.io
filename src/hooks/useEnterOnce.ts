import { useEffect, useRef, useState } from "react";

/**
 * Flips to true the first time the element scrolls into view, and
 * never back — for entrance animations that should play once.
 *
 * Falls back to true when IntersectionObserver is missing, so the
 * content is never left stuck in its hidden starting state.
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
