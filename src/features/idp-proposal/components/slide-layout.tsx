import { useRef, type CSSProperties, type ReactNode } from "react";
import {
  STAR_NODES,
  useHeroBackdrop,
} from "@/features/idp-proposal/components/hero-dither";

/**
 * Organiza a mensagem e o auxílio visual do slide. A constelação do fundo
 * acompanha o auxílio visual quando o backdrop está ativo.
 */
export const rv = (i: number) => ({ "--i": i }) as CSSProperties;

/**
 * Anatomia de uma tela: a ideia principal à esquerda, o auxílio visual à
 * direita. Por padrão a constelação do fundo se junta dentro do auxílio
 * visual (`star`); uma tela com conteúdo próprio passa `backdrop={false}`
 * e os pontos se apagam.
 */
export function SlideLayout({
  statement,
  visual,
  label,
  backdrop = true,
}: {
  statement: ReactNode;
  visual?: ReactNode;
  /** Descrição do auxílio visual para leitores de tela. */
  label: string;
  backdrop?: boolean;
}) {
  const textRef = useRef<HTMLDivElement>(null);
  const vizRef = useRef<HTMLDivElement>(null);
  useHeroBackdrop({
    layout: backdrop ? "star" : "scatter",
    anchorRef: backdrop ? vizRef : { current: null },
    quietRefs: backdrop ? [textRef] : [],
  });

  return (
    <div className="screen">
      <div className="statement rv" style={rv(0)} ref={textRef}>
        {statement}
      </div>
      <div
        className="viz rv"
        style={rv(2)}
        ref={vizRef}
        role="img"
        aria-label={label}
      >
        {visual}
      </div>
    </div>
  );
}

/**
 * Rótulos presos às estrelas principais da constelação (as mesmas
 * posições do hero do IdP no site). `at` = índice em STAR_NODES.
 */
export function StarLabels({
  labels,
  center,
}: {
  labels: { at: number; text: string }[];
  center: string;
}) {
  return (
    <>
      {labels.map(({ at, text }, i) => {
        const p = STAR_NODES[at];
        return (
          <span
            key={text}
            className="nl rv"
            style={{
              ...rv(4 + i),
              left: `${p.x * 100}%`,
              top: `${p.y * 100}%`,
              ...(p.y > 0.8 ? { translate: "-50% -36px" } : {}),
            }}
          >
            {text}
          </span>
        );
      })}
      <span
        className="nl nl-c rv"
        style={{ ...rv(3), left: "50%", top: "50%" }}
      >
        {center}
      </span>
    </>
  );
}
