import { motion } from "motion/react";
import { useEffect, useLayoutEffect, useRef, useState, type CSSProperties } from "react";
import { useIdpContent } from "./content";
import { Database, Grid, Key, Monitor, Shield } from "./icons";
import { useReducedMotion } from "./primitives";
import { EASE, Wire } from "./silos-diagram";
import { SilosDither } from "./silos-dither";
import type { P } from "./silos-geometry";

/**
 * Painéis "antes / com o IdP BAITA" dos Benefícios, como metáfora — mesma
 * linguagem do painel do Problema (vidro fosco sobre o pontilhado, fios que
 * se desenham só depois que as peças assentam, o mesmo seletor e a passagem
 * tocando sozinha na entrada):
 *
 *   Gestão — a base de usuários e os serviços institucionais flutuam
 *            soltos; o IdP BAITA chega e conecta os dois.
 *   TI     — diretório LDAP, Shibboleth, servidor de IdP e certificados,
 *            todos ligados ao serviço; com o IdP BAITA, eles somem e só ele
 *            se liga ao serviço.
 *
 * Cada peça tem uma posição "antes" e, se continua, uma "depois" (em % do
 * painel); sem "depois", ela se desfaz na passagem. Em telas estreitas, cada
 * cena tem um arranjo próprio, em coluna.
 */

type Icon = typeof Database;
type Spot = P & { r?: number };
type Piece = { key: string; Icon: Icon; before: Spot; after?: P; loose?: boolean; row?: boolean };
type Layout = { hub: P; glow: P; pieces: Piece[]; wiresBefore: [string, string][]; wiresAfter: [string, string][] };
type Scene = { wide: Layout; narrow: Layout };

const HUB = "hub";

const MANAGEMENT_WIRES: [string, string][] = [
  [HUB, "base"],
  [HUB, "services"],
];
const IT_BEFORE: [string, string][] = [
  ["ldap", "service"],
  ["shib", "service"],
  ["server", "service"],
  ["certs", "service"],
];

const SCENES: Record<"management" | "it", Scene> = {
  management: {
    wide: {
      hub: { x: 50, y: 52 },
      glow: { x: 50, y: 52 },
      pieces: [
        { key: "base", Icon: Database, loose: true, before: { x: 27, y: 32, r: -9 }, after: { x: 19, y: 52 } },
        { key: "services", Icon: Grid, loose: true, before: { x: 72, y: 70, r: 7 }, after: { x: 81, y: 52 } },
      ],
      wiresBefore: [],
      wiresAfter: MANAGEMENT_WIRES,
    },
    narrow: {
      hub: { x: 50, y: 53 },
      glow: { x: 50, y: 53 },
      pieces: [
        { key: "base", Icon: Database, loose: true, before: { x: 34, y: 30, r: -9 }, after: { x: 50, y: 26 } },
        { key: "services", Icon: Grid, loose: true, before: { x: 64, y: 78, r: 7 }, after: { x: 50, y: 80 } },
      ],
      wiresBefore: [],
      wiresAfter: MANAGEMENT_WIRES,
    },
  },
  it: {
    wide: {
      hub: { x: 30, y: 52 },
      glow: { x: 78, y: 52 },
      pieces: [
        { key: "ldap", Icon: Database, row: true, before: { x: 27, y: 22 } },
        { key: "shib", Icon: Shield, row: true, before: { x: 27, y: 41 } },
        { key: "server", Icon: Monitor, row: true, before: { x: 27, y: 60 } },
        { key: "certs", Icon: Key, row: true, before: { x: 27, y: 79 } },
        { key: "service", Icon: Grid, before: { x: 78, y: 52 }, after: { x: 78, y: 52 } },
      ],
      wiresBefore: IT_BEFORE,
      wiresAfter: [[HUB, "service"]],
    },
    narrow: {
      hub: { x: 50, y: 50 },
      glow: { x: 50, y: 82 },
      pieces: [
        { key: "ldap", Icon: Database, row: true, before: { x: 38, y: 19 } },
        { key: "shib", Icon: Shield, row: true, before: { x: 62, y: 32 } },
        { key: "server", Icon: Monitor, row: true, before: { x: 38, y: 45 } },
        { key: "certs", Icon: Key, row: true, before: { x: 62, y: 58 } },
        { key: "service", Icon: Grid, before: { x: 50, y: 82 }, after: { x: 50, y: 82 } },
      ],
      wiresBefore: IT_BEFORE,
      wiresAfter: [[HUB, "service"]],
    },
  },
};

/** Os fios do novo estado só começam depois que as peças quase assentaram (s). */
const SETTLE = 0.45;
const CENTER = { x: "-50%", y: "-50%" };
const NARROW_MQ = "(max-width: 960px)";

function useNarrow() {
  const [narrow, setNarrow] = useState(() => window.matchMedia(NARROW_MQ).matches);
  useEffect(() => {
    const mq = window.matchMedia(NARROW_MQ);
    const on = () => setNarrow(mq.matches);
    mq.addEventListener("change", on);
    return () => mq.removeEventListener("change", on);
  }, []);
  return narrow;
}

/** Fio levemente curvo entre dois pontos (px), arqueando para o lado. */
const arc = (a: P, b: P) => {
  const vertical = Math.abs(b.y - a.y) > Math.abs(b.x - a.x);
  const mx = (a.x + b.x) / 2 + (vertical ? 14 : 0);
  const my = (a.y + b.y) / 2 - (vertical ? 0 : 14);
  return `M ${a.x.toFixed(1)} ${a.y.toFixed(1)} Q ${mx.toFixed(1)} ${my.toFixed(1)}, ${b.x.toFixed(1)} ${b.y.toFixed(1)}`;
};

export function StabilityDiagram({ scene }: { scene: "management" | "it" }) {
  const { problem, benefits, brand } = useIdpContent();
  const c = benefits[scene];
  const labels = c.nodes as Record<string, string>;
  const reduce = useReducedMotion();
  const L = SCENES[scene][useNarrow() ? "narrow" : "wide"];
  const [calm, setCalm] = useState(reduce);
  const [touched, setTouched] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState<{ w: number; h: number } | null>(null);

  useLayoutEffect(() => {
    const el = panelRef.current;
    if (!el) return;
    const measure = () => setSize({ w: el.clientWidth, h: el.clientHeight });
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // Na primeira vez que aparece: um instante do "antes", depois a passagem.
  useEffect(() => {
    const el = panelRef.current;
    if (!el || reduce || touched) return;
    let timer = 0;
    const io = new IntersectionObserver(
      ([e]) => {
        if (!e.isIntersecting) return;
        io.disconnect();
        timer = window.setTimeout(() => setCalm(true), 1600);
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
    setCalm(next);
  };

  const t = { duration: reduce ? 0 : 0.8, ease: EASE };
  const px = (p: P) => (size ? { x: (p.x / 100) * size.w, y: (p.y / 100) * size.h } : p);
  const spot = (key: string, after: boolean): P => {
    if (key === HUB) return L.hub;
    const p = L.pieces.find((q) => q.key === key)!;
    return (after && p.after) || p.before;
  };

  return (
    <div className="panel silos stab" ref={panelRef}>
      <div className="silos-toggle">
        <button type="button" aria-pressed={!calm} onClick={() => pick(false)}>
          {problem.before}
        </button>
        <button type="button" aria-pressed={calm} onClick={() => pick(true)}>
          {problem.after}
        </button>
      </div>

      <div className="silos-stage" role="img" aria-label={c.vizLabel}>
        <SilosDither organized={calm} hub={L.hub} base={L.glow} />

        {size && (
          <svg className="silos-lines" viewBox={`0 0 ${size.w} ${size.h}`}>
            {L.wiresBefore.map(([a, b], i) => (
              <Wire
                key={`antes-${a}-${b}`}
                d={arc(px(spot(a, false)), px(spot(b, false)))}
                on={!calm}
                delay={SETTLE + i * 0.08}
                reduce={reduce}
              />
            ))}
            {L.wiresAfter.map(([a, b], i) => (
              <Wire
                key={`depois-${a}-${b}`}
                d={arc(px(spot(a, true)), px(spot(b, true)))}
                on={calm}
                delay={SETTLE + i * 0.12}
                reduce={reduce}
                flow
              />
            ))}
          </svg>
        )}

        <motion.span
          className="silos-node is-hub"
          initial={false}
          animate={{ opacity: calm ? 1 : 0, scale: calm ? 1 : 0.6 }}
          transition={t}
          style={{ ...CENTER, left: `${L.hub.x}%`, top: `${L.hub.y}%` }}
        >
          <span className="silos-idp">{brand}</span>
        </motion.span>

        {L.pieces.map(({ key, Icon, before, after, loose, row }, i) => {
          const gone = calm && !after;
          const at = (calm && after) || before;
          return (
            <motion.div
              key={key}
              className="silos-node"
              initial={false}
              animate={{
                left: `${at.x}%`,
                top: `${at.y}%`,
                rotate: calm ? 0 : (before.r ?? 0),
                opacity: gone ? 0 : 1,
                scale: gone ? 0.85 : 1,
              }}
              transition={{ ...t, delay: reduce ? 0 : i * 0.06 }}
              style={CENTER}
            >
              <div
                className={["stab-card", row && "row", !calm && loose && "loose"].filter(Boolean).join(" ")}
                style={{ "--wobble-delay": `${-i * 1.1}s` } as CSSProperties}
              >
                <span className="silos-db">
                  <Icon />
                </span>
                <span className="chip-t">{labels[key]}</span>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
