import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { useIdpContent, type IdpContent } from "./content";
import { ArrowRight, Check } from "./icons";
import { LoginMerge } from "./login-merge";
import { Kicker, rv, useReducedMotion } from "./primitives";

type How = IdpContent["how"];
const TOTAL = "04";
const counter = (i: number) => `0${i + 1} / ${TOTAL}`;

function PaneHead({ title, i }: { title: string; i: number }) {
  return (
    <div className="pane-h" style={i === 3 ? { width: "100%" } : undefined}>
      <span className="pane-t">{title}</span>
      <span className="pill">{counter(i)}</span>
    </div>
  );
}

export function CheckMark({ state }: { state: "ok" | "run" | "todo" }) {
  return (
    <span className={state === "ok" ? "ck ok" : state === "run" ? "ck run" : "ck"}>
      {state === "ok" && <Check />}
    </span>
  );
}

/* O conteúdo da "janela" muda com a etapa ativa; a key força a animação
   de entrada (idp-paneIn) a cada troca. */
function Pane({ step, c, reduce }: { step: number; c: How; reduce: boolean }) {
  if (step === 0)
    return (
      <div className="pane" key={0}>
        <PaneHead title={c.survey.title} i={0} />
        <div className="list">
          {c.survey.items.map(([t, d]) => (
            <div key={t} className="li">
              <div>
                {t}
                <small>{d}</small>
              </div>
              <span className="pill dim">{c.survey.status}</span>
            </div>
          ))}
        </div>
      </div>
    );

  if (step === 1)
    return (
      <div className="pane" key={1}>
        <PaneHead title={c.mapping.title} i={1} />
        <div className="list">
          <div className="map hd">
            <span>{c.mapping.head[0]}</span>
            <span />
            <span>{c.mapping.head[1]}</span>
          </div>
          {c.mapping.rows.map((r) => (
            <div key={r.from} className="map">
              <span>{r.from}</span>
              <ArrowRight />
              <span>{r.to}</span>
            </div>
          ))}
        </div>
      </div>
    );

  if (step === 2)
    return (
      <div className="pane" key={2}>
        <PaneHead title={c.config.title} i={2} />
        {/* O que a etapa entrega, sem status: é informação para a
            instituição, não um quadro de tarefas. */}
        <div className="list log">
          {c.config.items.map((item) => (
            <div key={item} className="li">
              <span className="bullet" aria-hidden="true" />
              <span>{item}</span>
            </div>
          ))}
        </div>
      </div>
    );

  return (
    <div className="pane" key={3}>
      <PaneHead title={c.access.title} i={3} />
      <LoginMerge label={c.access.label} reduce={reduce} />
    </div>
  );
}

export function HowSection() {
  const c = useIdpContent().how;
  const reduce = useReducedMotion();
  const [step, setStep] = useState(0);
  const howRef = useRef<HTMLDivElement>(null);
  const fillRef = useRef<HTMLDivElement>(null);
  const stepRefs = useRef<(HTMLDivElement | null)[]>([]);
  // Depois de um clique, a rolagem suave passa pelas outras etapas; a trava
  // impede que a sincronização marque essas etapas no caminho.
  const lockUntil = useRef(0);
  const viewRef = useRef<HTMLDivElement>(null);
  const fitRef = useRef<HTMLDivElement>(null);
  const visRef = useRef<HTMLDivElement>(null);

  // A janela acompanha a altura da etapa: mede o conteúdo e fixa a altura
  // em px, que o CSS anima (height: auto não tem transição).
  useLayoutEffect(() => {
    const view = viewRef.current;
    const fit = fitRef.current;
    if (!view || !fit) return;
    const resize = () => {
      const cs = getComputedStyle(view);
      const pad = parseFloat(cs.paddingTop) + parseFloat(cs.paddingBottom);
      view.style.height = `${fit.offsetHeight + pad}px`;
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(fit);
    return () => ro.disconnect();
  }, []);

  // A janela gruda centrada na tela: o CSS calcula o `top` a partir da
  // altura dela (--vis-h), que muda a cada etapa.
  useLayoutEffect(() => {
    const vis = visRef.current;
    const box = vis?.firstElementChild as HTMLElement | null;
    if (!vis || !box) return;
    const update = () => vis.style.setProperty("--vis-h", `${box.offsetHeight}px`);
    update();
    const ro = new ResizeObserver(update);
    ro.observe(box);
    return () => ro.disconnect();
  }, []);

  useEffect(() => {
    let raf = 0;

    const sync = () => {
      raf = 0;
      const how = howRef.current;
      if (!how) return;
      const vh = window.innerHeight || 800;
      const r = how.getBoundingClientRect();
      // A linha lateral enche conforme o meio da tela atravessa a lista.
      const p = Math.min(1, Math.max(0, (vh * 0.5 - r.top) / Math.max(1, r.height)));
      if (fillRef.current) fillRef.current.style.transform = `scaleY(${p.toFixed(4)})`;
      if (Date.now() < lockUntil.current) return;
      let active = 0;
      stepRefs.current.forEach((el, i) => {
        if (el && el.getBoundingClientRect().top < vh * 0.5) active = i;
      });
      setStep(active);
    };

    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(sync);
    };

    document.addEventListener("scroll", onScroll, { passive: true, capture: true });
    window.addEventListener("resize", onScroll);
    sync();

    return () => {
      cancelAnimationFrame(raf);
      document.removeEventListener("scroll", onScroll, { capture: true });
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  const goStep = (i: number) => {
    setStep(i);
    lockUntil.current = Date.now() + 900;
    stepRefs.current[i]?.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "center" });
  };

  return (
    <section id="como" className="sec">
      <div className="wrap">
        <div className="head">
          <Kicker>{c.kicker}</Kicker>
          <h2 className="h2 rv" style={rv(1)}>
            {c.title}
          </h2>
        </div>
        <div className="how" ref={howRef}>
          <div className="how-list">
            <div className="how-line" aria-hidden="true">
              <div className="how-fill" ref={fillRef} />
            </div>
            {c.steps.map((st, i) => (
              <div
                key={i}
                ref={(el) => {
                  stepRefs.current[i] = el;
                }}
                className={i === step ? "step on" : "step"}
              >
                <button
                  type="button"
                  className="step-btn"
                  aria-current={i === step ? "step" : undefined}
                  onClick={() => goStep(i)}
                >
                  <span className="step-n">{`0${i + 1}`}</span>
                  <span className="step-t">{st.t}</span>
                </button>
                <p className="step-d">{st.d}</p>
                {/* Rótulos de cada fase: fora da V1 (sozinhos, explicavam
                    pouco). Os textos continuam em content.ts.
                <div className="tags">
                  {st.tags.map((tg) => (
                    <span key={tg} className="pill">
                      {tg}
                    </span>
                  ))}
                </div> */}
              </div>
            ))}
          </div>
          <div className="how-vis" ref={visRef}>
            <div className="browser">
              <div className="bar">
                <span className="dots">
                  <i />
                  <i />
                  <i />
                </span>
                <span className="url">{c.url}</span>
              </div>
              <div className="bview gridbg" ref={viewRef}>
                <div className="pane-fit" ref={fitRef}>
                  <Pane step={step} c={c} reduce={reduce} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
