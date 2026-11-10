import {
  useEffect,
  useRef,
  useState,
  type ComponentType,
  type ReactNode,
} from "react";
import { rv } from "@/features/idp-proposal/components/slide-layout";
import { useEntryStep, useSlideSteps } from "@/features/idp-proposal/steps";
import { isMobile } from "@/features/idp-proposal/hooks/use-mobile";

export type Step = {
  title: string;
  body: string;
  label: string;
  /** Auxílio visual usado nos slides de problemas e benefícios. */
  Visual?: ComponentType;
};

/**
 * Tela em passos: título em cima, a lista à esquerda (o item aberto mostra
 * a explicação) e o desenho do item aberto à direita, como o "O que é um
 * IdP" do site. ←/→ (e o passador) passam pelos itens antes de trocar de
 * tela; ↑/↓ trocam sem sair dela.
 *
 * Com `screen` (telas de produto), o lado direito é uma janela de navegador
 * maior, e a tela do produto recebe o passo atual: ela fica montada entre
 * os passos e anima as mudanças, em vez de trocar de desenho.
 */
export function StepSlide({
  head,
  steps,
  screen: Screen,
}: {
  head: ReactNode;
  steps: Step[];
  screen?: ComponentType<{ step: number }>;
}) {
  const entry = useEntryStep(steps.length);
  const [on, setOn] = useState(entry);
  useSlideSteps(on, setOn, steps.length);
  const btns = useRef<(HTMLButtonElement | null)[]>([]);

  // No celular o desenho vem logo abaixo do item aberto (ver `order` e
  // app.css). Ao trocar de item, ele sobe para o topo da janela, para o
  // texto e o desenho ficarem à vista juntos.
  const first = useRef(true);
  useEffect(() => {
    if (first.current) {
      first.current = false;
      return;
    }
    if (!isMobile()) return;
    const reduce = window.matchMedia?.(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    // Espera o item anterior fechar (.ss-more, .4s): antes disso a posição
    // final ainda não existe.
    const t = window.setTimeout(
      () =>
        btns.current[on]?.scrollIntoView({
          block: "start",
          behavior: reduce ? "auto" : "smooth",
        }),
      reduce ? 0 : 420
    );
    return () => window.clearTimeout(t);
  }, [on]);

  // Se o foco está na lista, ele acompanha o item aberto (senão o anel de
  // foco ficaria no anterior depois de ↑/↓).
  useEffect(() => {
    if (btns.current.includes(document.activeElement as HTMLButtonElement))
      btns.current[on]?.focus();
  }, [on]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowDown")
        setOn((i) => Math.min(steps.length - 1, i + 1));
      else if (e.key === "ArrowUp") setOn((i) => Math.max(0, i - 1));
      else return;
      e.preventDefault();
    };
    addEventListener("keydown", onKey);
    return () => removeEventListener("keydown", onKey);
  }, [steps.length]);

  const { Visual, label } = steps[on];

  return (
    <div className="ss" data-product={Screen ? "" : undefined}>
      <p className="big ss-head rv" style={rv(0)}>
        {head}
      </p>
      <div className="ss-body">
        <ul className="ss-list rv" style={rv(2)}>
          {steps.map((s, i) => (
            <li
              key={s.title}
              className="ss-item"
              data-on={i === on ? "" : undefined}
              style={{ order: i * 2 }}
            >
              <button
                className="ss-btn"
                ref={(el) => {
                  btns.current[i] = el;
                }}
                aria-expanded={i === on}
                onClick={() => setOn(i)}
              >
                <span className="ss-title">{s.title}</span>
                <span className="ss-more">
                  <span className="ss-text">{s.body}</span>
                </span>
              </button>
            </li>
          ))}
        </ul>
        {Screen ? (
          <div
            className="browser rv"
            style={{ ...rv(3), order: on * 2 + 1 }}
            role="img"
            aria-label={label}
          >
            <div className="browser-bar" aria-hidden="true">
              <span className="browser-dots">
                <i />
                <i />
                <i />
              </span>
            </div>
            <div className="browser-view">
              <Screen step={on} />
            </div>
          </div>
        ) : (
          <div
            className="ss-viz rv"
            style={{ ...rv(3), order: on * 2 + 1 }}
            role="img"
            aria-label={label}
          >
            {/* key: cada troca remonta o desenho e reinicia a entrada. */}
            <div className="ss-pane" key={on}>
              {Visual && <Visual />}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
