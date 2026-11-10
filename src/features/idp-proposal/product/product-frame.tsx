import { useEffect, useRef, useState, type ReactNode } from "react";
import { useMobile } from "@/features/idp-proposal/hooks/use-mobile";

/**
 * Tela de produto em tamanho real (largura fixa de W px), reduzida para
 * caber na janela do navegador do slide. A altura acompanha a janela, então
 * a tela preenche a área toda e o texto mantém as proporções do produto.
 */
const W_DESKTOP = 840;
/** No celular a tela do produto é mais estreita (layout adaptado em
 *  product.css), para o texto não ficar minúsculo depois de reduzido. */
const W_MOBILE = 520;

export function ProductFrame({ children }: { children: ReactNode }) {
  const narrow = useMobile();
  const W = narrow ? W_MOBILE : W_DESKTOP;
  const host = useRef<HTMLDivElement>(null);
  const [box, setBox] = useState({ scale: 1, h: 600 });

  useEffect(() => {
    const el = host.current;
    if (!el) return;
    const ro = new ResizeObserver(() => {
      const scale = el.clientWidth / W;
      setBox({ scale, h: el.clientHeight / scale });
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, [W]);

  return (
    <div className="pframe" ref={host}>
      <div
        className="pui"
        data-narrow={narrow ? "" : undefined}
        style={{ width: W, height: box.h, transform: `scale(${box.scale})` }}
      >
        {children}
      </div>
    </div>
  );
}

/**
 * Digitação de mentira: devolve quantos caracteres de `text` já
 * "apareceram", começando `delay` ms depois de `on` ficar verdadeiro.
 */
export function useTyped(text: string, on: boolean, delay = 300, every = 85) {
  const [n, setN] = useState(0);
  useEffect(() => {
    setN(0);
    if (!on) return;
    let i = 0;
    let iv = 0;
    const t = window.setTimeout(() => {
      iv = window.setInterval(() => {
        i += 1;
        setN(i);
        if (i >= text.length) window.clearInterval(iv);
      }, every);
    }, delay);
    return () => {
      window.clearTimeout(t);
      window.clearInterval(iv);
    };
  }, [text, on, delay, every]);
  return n;
}

/** Verdadeiro `ms` depois de `on` ligar (para cliques e trocas encenados). */
export function useAfter(on: boolean, ms: number) {
  const [done, setDone] = useState(false);
  useEffect(() => {
    setDone(false);
    if (!on) return;
    const t = window.setTimeout(() => setDone(true), ms);
    return () => window.clearTimeout(t);
  }, [on, ms]);
  return done;
}
