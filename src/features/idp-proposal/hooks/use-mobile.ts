import { useEffect, useState } from "react";

/** Mesmo corte do CSS (app.css, "Celular"). */
export const MOBILE_QUERY = "(max-width: 700px)";

export const isMobile = () =>
  window.matchMedia?.(MOBILE_QUERY).matches ?? false;

/** Verdadeiro em telas estreitas (celular); acompanha giro e redimensionamento. */
export function useMobile() {
  const [isNarrow, setIsNarrow] = useState(isMobile);
  useEffect(() => {
    const mediaQuery = window.matchMedia?.(MOBILE_QUERY);
    if (!mediaQuery) return;
    const onChange = () => setIsNarrow(mediaQuery.matches);
    onChange();
    mediaQuery.addEventListener("change", onChange);
    return () => mediaQuery.removeEventListener("change", onChange);
  }, []);
  return isNarrow;
}
