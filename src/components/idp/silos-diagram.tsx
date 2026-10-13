import { Database } from "lucide-react";
import { motion } from "motion/react";
import { useEffect, useLayoutEffect, useRef, useState, type CSSProperties } from "react";
import { useIdpContent } from "./content";
import { useReducedMotion } from "./primitives";
import { AFTER_LEFT, AFTER_Y, BEFORE_DBS, CARD_POS, DB, IDP, type P } from "./silos-geometry";
import { SilosDither } from "./silos-dither";

/**
 * Painel do "Problema", no arranjo e estilo do mock (cards de vidro fosco
 * sobre o pontilhado), contando a passagem do caos à organização:
 *
 *   Antes  — cada sistema ligado à própria base de dados, com os fios
 *            atravessando o painel.
 *   Depois — as quatro bases viram uma só, que sobe para o topo e liga ao
 *            IdP BAITA; os sistemas descem para uma coluna alinhada e o IdP
 *            liga a cada um, entrando pela lateral do card.
 *
 * Ao entrar na tela, mostra o "antes" por um instante e se organiza
 * sozinho; o seletor permite rever a passagem. Os fios partem do centro
 * real de cada card (medido), então acompanham qualquer largura.
 */

const EASE = [0.22, 1, 0.36, 1] as const;
/**
 * Quando os fios começam a se desenhar. O movimento desacelera no fim, então
 * aqui os objetos já estão quase no lugar: o fio nasce enquanto eles
 * terminam de assentar, sem um intervalo parado antes.
 */
const SETTLE = 0.4;
/** Tempo para um fio se desenhar da origem ao destino. */
const DRAW = 0.5;
/** Intervalo entre um fio e o próximo. */
const STAGGER = 0.1;

/**
 * Um fio do diagrama. Ao deixar de valer, some rápido (e volta a comprimento
 * zero, pronto para se redesenhar); ao passar a valer, espera `delay` — os
 * objetos chegarem — e se desenha. O pulso (`flow`) só começa depois.
 */
function Wire({
  d,
  on,
  delay,
  reduce,
  flow = false,
}: {
  d: string;
  on: boolean;
  delay: number;
  reduce: boolean;
  flow?: boolean;
}) {
  const transition = reduce
    ? { duration: 0 }
    : on
      ? { opacity: { duration: 0, delay }, pathLength: { duration: DRAW, delay, ease: EASE } }
      : { opacity: { duration: 0.2 }, pathLength: { duration: 0, delay: 0.2 } };
  const draw = {
    initial: false as const,
    animate: { pathLength: on ? 1 : 0, opacity: on ? 1 : 0 },
    transition,
  };
  return (
    <g>
      <motion.path d={d} className="silos-wire-halo" {...draw} />
      <motion.path d={d} className="silos-wire" {...draw} />
      {flow && (
        <motion.path
          d={d}
          className="silos-wire-flow"
          initial={false}
          animate={{ opacity: on ? 1 : 0 }}
          transition={reduce ? { duration: 0 } : { duration: on ? 0.3 : 0.2, delay: on ? delay + DRAW : 0 }}
        />
      )}
    </g>
  );
}
/** O motion controla o transform: a centralização vai por ele, não pelo CSS. */
const CENTER = { x: "-50%", y: "-50%" };

/** Ritmo próprio de flutuação para cada peça (duração e atraso). */
const float = (i: number) =>
  ({ "--float-dur": `${4.6 + ((i * 0.73) % 1) * 2.4}s`, "--float-delay": `${-((i * 1.37) % 4)}s` }) as CSSProperties;

/** Do IdP à lateral esquerda do card: desce e entra na horizontal. */
const branch = (a: P, b: P) =>
  `M ${a.x.toFixed(1)} ${a.y.toFixed(1)} C ${a.x.toFixed(1)} ${b.y.toFixed(1)}, ${(b.x - 30).toFixed(1)} ${b.y.toFixed(1)}, ${b.x.toFixed(1)} ${b.y.toFixed(1)}`;

/** Curva em S horizontal entre dois pontos (px). */
const wire = (a: P, b: P) => {
  const mx = a.x + (b.x - a.x) * 0.5;
  return `M ${a.x.toFixed(1)} ${a.y.toFixed(1)} C ${mx.toFixed(1)} ${a.y.toFixed(1)}, ${mx.toFixed(1)} ${b.y.toFixed(1)}, ${b.x.toFixed(1)} ${b.y.toFixed(1)}`;
};

export function SilosDiagram() {
  const c = useIdpContent().problem;
  const reduce = useReducedMotion();
  const [organized, setOrganized] = useState(reduce);
  const [touched, setTouched] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [geo, setGeo] = useState<{ w: number; h: number; cards: P[]; widths: number[] } | null>(null);

  // Centro e largura de cada card na posição do "antes" (offset* ignora
  // transforms, então nem a flutuação nem o deslocamento do "depois" contam).
  useLayoutEffect(() => {
    const panel = panelRef.current;
    if (!panel) return;
    const measure = () =>
      setGeo({
        w: panel.clientWidth,
        h: panel.clientHeight,
        cards: cardRefs.current.map((el) =>
          el ? { x: el.offsetLeft + el.offsetWidth / 2, y: el.offsetTop + el.offsetHeight / 2 } : { x: 0, y: 0 }
        ),
        widths: cardRefs.current.map((el) => el?.offsetWidth ?? 0),
      });
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(panel);
    cardRefs.current.forEach((el) => el && ro.observe(el));
    return () => ro.disconnect();
  }, []);

  // Na primeira vez que aparece: um instante de caos, depois a ordem.
  useEffect(() => {
    const el = panelRef.current;
    if (!el || reduce || touched) return;
    let timer = 0;
    const io = new IntersectionObserver(
      ([e]) => {
        if (!e.isIntersecting) return;
        io.disconnect();
        timer = window.setTimeout(() => setOrganized(true), 1400);
      },
      { threshold: 0.5 }
    );
    io.observe(el);
    return () => {
      io.disconnect();
      window.clearTimeout(timer);
    };
  }, [reduce, touched]);

  const pick = (next: boolean) => {
    setTouched(true);
    setOrganized(next);
  };

  const t = { duration: reduce ? 0 : 0.7, ease: EASE };
  const px = (p: P) => (geo ? { x: (p.x / 100) * geo.w, y: (p.y / 100) * geo.h } : p);
  const hub = px(IDP);
  const base = px(DB);
  /** Depois: ponto onde o fio entra no card (lateral esquerda) e deslocamento do card. */
  const after = (i: number) => {
    if (!geo) return { entry: { x: 0, y: 0 }, dx: 0, dy: 0 };
    const left = (AFTER_LEFT / 100) * geo.w;
    const cy = (AFTER_Y[i] / 100) * geo.h;
    const card = geo.cards[i];
    return {
      entry: { x: left, y: cy },
      dx: left + geo.widths[i] / 2 - card.x,
      dy: cy - card.y,
    };
  };

  return (
    <div className="panel silos rv" style={{ "--i": 2 } as CSSProperties} ref={panelRef}>
      <div className="silos-toggle">
        <button type="button" aria-pressed={!organized} onClick={() => pick(false)}>
          {c.before}
        </button>
        <button type="button" aria-pressed={organized} onClick={() => pick(true)}>
          {c.after}
        </button>
      </div>

      <div className="silos-stage" role="img" aria-label={c.vizLabel}>
        <SilosDither organized={organized} />

        {/* Fios: um contorno escuro por baixo separa o traço do pontilhado.
            Não se transformam de um estado no outro: os do estado que sai
            somem logo, os objetos se movem, e só então os do novo estado se
            desenham, da origem ao destino. */}
        {geo && (
          <svg className="silos-lines" viewBox={`0 0 ${geo.w} ${geo.h}`}>
            {geo.cards.map((card, i) => (
              <Wire
                key={`antes-${i}`}
                d={wire(px(BEFORE_DBS[i]), card)}
                on={!organized}
                delay={SETTLE + i * STAGGER}
                reduce={reduce}
              />
            ))}
            <Wire d={wire(base, hub)} on={organized} delay={SETTLE} reduce={reduce} flow />
            {geo.cards.map((_, i) => (
              <Wire
                key={`depois-${i}`}
                d={branch(hub, after(i).entry)}
                on={organized}
                delay={SETTLE + 0.25 + i * STAGGER}
                reduce={reduce}
                flow
              />
            ))}
          </svg>
        )}

        {/* As quatro bases: no "depois", deslizam para o mesmo ponto e só a
            primeira continua visível — viram a base unificada. */}
        {BEFORE_DBS.map((p, i) => (
          <motion.span
            key={i}
            className="silos-node is-db"
            initial={false}
            animate={{
              left: `${organized ? DB.x : p.x}%`,
              top: `${organized ? DB.y : p.y}%`,
              opacity: organized && i > 0 ? 0 : 1,
              scale: organized && i === 0 ? 1.15 : 1,
            }}
            transition={t}
            style={CENTER}
          >
            <span className="silos-db" style={float(10 + i)}>
              <Database strokeWidth={1.7} />
            </span>
          </motion.span>
        ))}

        <motion.span
          className="silos-node is-hub"
          initial={false}
          animate={{ opacity: organized ? 1 : 0, scale: organized ? 1 : 0.7 }}
          transition={{ ...t, delay: organized && !reduce ? 0.05 : 0 }}
          style={{ ...CENTER, left: `${IDP.x}%`, top: `${IDP.y}%` }}
        >
          <span className="silos-idp" style={float(4)}>
            {c.idp}
          </span>
        </motion.span>

        {/* O wrapper fica no arranjo do "antes" e o motion o desloca até a
            coluna do "depois"; o card dentro dele faz só a flutuação. */}
        {c.services.map((name, i) => {
          const a = after(i);
          return (
            <motion.div
              key={i}
              className="chip-pos"
              ref={(el) => {
                cardRefs.current[i] = el;
              }}
              style={CARD_POS[i]}
              initial={false}
              animate={{ x: organized ? a.dx : 0, y: organized ? a.dy : 0 }}
              transition={{ ...t, delay: reduce ? 0 : i * 0.05 }}
            >
              <div className="chip" style={float(i)}>
                <span className="chip-t">{name}</span>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
