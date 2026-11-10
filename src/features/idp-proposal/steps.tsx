import { createContext, useContext, useEffect, useRef } from "react";

/**
 * Passos dentro de uma tela: ←/→, as setas da tela e o passador de slides
 * primeiro percorrem os passos do slide atual e só trocam de slide
 * quando chegam ao fim ou ao começo.
 */
type Handler = (d: number) => boolean;

export const SlideStepsContext = createContext<{
  /** A tela registra quem responde a ←/→; devolve a função de remover. */
  register: (fn: Handler) => () => void;
  /** De onde se chegou: 1 vindo da tela anterior, −1 voltando da seguinte. */
  entryDirection: number;
}>({ register: () => () => {}, entryDirection: 0 });

/** Quando se volta para a tela, ela abre no último passo. */
export function useEntryStep(count: number) {
  return useContext(SlideStepsContext).entryDirection < 0 ? count - 1 : 0;
}

/** Liga ←/→ aos passos `0..count-1` da tela (estado em `on`/`setOn`). */
export function useSlideSteps(
  on: number,
  setOn: (i: number) => void,
  count: number
) {
  const { register } = useContext(SlideStepsContext);
  const state = useRef({ on, count, setOn });
  state.current = { on, count, setOn };

  useEffect(
    () =>
      register((d) => {
        const { on, count, setOn } = state.current;
        const next = on + d;
        if (next < 0 || next >= count) return false;
        setOn(next);
        return true;
      }),
    [register]
  );
}
