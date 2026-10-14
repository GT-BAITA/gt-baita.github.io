import { motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { useIdpContent } from "./content";
import { Books, Cap, Chat, ChevronLeft, ChevronRight, Database, Monitor, Pause, Play } from "./icons";
import { Dither, Kicker, rv, useReducedMotion } from "./primitives";

/**
 * "O que é um IdP": o papel do provedor de identidade contado como um login.
 * Reaproveita a linguagem da antiga "A peça que faltava" (nós, conectores
 * com pacotes, o núcleo com o orbe pontilhado), agora com a base de usuários
 * em cima do IdP. Um pacote faz o caminho de um login, em quatro passos que
 * acendem ao lado:
 *
 *   0 Acesso       — o serviço acende
 *   1 Login no IdP — serviço → IdP
 *   2 Verificação  — IdP → base → IdP
 *   3 Resposta     — IdP → serviço
 *
 * No automático, cada passo dura PHASE_MS, com uma barra que enche no passo
 * ativo; a cada volta, o login parte de outro serviço. Clicar num passo ou
 * usar ← → para o loop naquele passo, e ▶ retoma. Só corre com a seção na
 * tela; com movimento reduzido, começa parado e sem o pacote.
 */

const ICONS = [Monitor, Cap, Books, Chat];
/** Tempo de leitura de cada passo no automático (ms). */
const PHASE_MS = 5000;
/** Duração do trajeto do pacote, no começo de cada passo (s). */
const TRAVEL = 1.4;

// Geometria do conector (px): quatro nós de 52px com 12px entre eles.
const CONN_W = 80;
const CONN_H = 244;
const NODE_Y = [26, 90, 154, 218];
const CORE_Y = CONN_H / 2;
const MID_X = CONN_W / 2;
/** Altura do trecho vertical entre a base e o IdP. */
const V_H = 44;

type Pt = { x: number; y: number };
const route = (i: number): Pt[] => [
  { x: 0, y: NODE_Y[i] },
  { x: MID_X, y: NODE_Y[i] },
  { x: MID_X, y: CORE_Y },
  { x: CONN_W, y: CORE_Y },
];

/** Tempos de cada ponto do trajeto, proporcionais ao comprimento dos trechos. */
function times(pts: Pt[]) {
  const seg = pts.slice(1).map((p, k) => Math.hypot(p.x - pts[k].x, p.y - pts[k].y));
  const total = seg.reduce((a, b) => a + b, 0) || 1;
  let acc = 0;
  return [0, ...seg.map((d) => (acc += d) / total)];
}

function Packet({ pts }: { pts: Pt[] }) {
  const t = times(pts);
  return (
    <motion.span
      className="role-pkt"
      initial={{ x: pts[0].x, y: pts[0].y, opacity: 0 }}
      animate={{ x: pts.map((p) => p.x), y: pts.map((p) => p.y), opacity: [0, 1, 1, 0] }}
      transition={{
        x: { duration: TRAVEL, times: t, ease: "easeInOut" },
        y: { duration: TRAVEL, times: t, ease: "easeInOut" },
        opacity: { duration: TRAVEL, times: [0, 0.1, 0.85, 1] },
      }}
    />
  );
}

export function RoleSection() {
  const { role: c, brand } = useIdpContent();
  const reduce = useReducedMotion();
  const vizRef = useRef<HTMLDivElement>(null);
  const fillRef = useRef<HTMLSpanElement>(null);
  /** Progresso do passo atual (0–1), fora do estado: muda a cada quadro. */
  const progress = useRef(reduce ? 1 : 0);
  const [tick, setTick] = useState(0);
  const [playing, setPlaying] = useState(!reduce);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = vizRef.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setInView(e.isIntersecting));
    io.observe(el);
    return () => io.disconnect();
  }, []);

  // Automático: enche a barra do passo ativo e, cheia, passa ao próximo.
  // Pausado (ou fora da tela), a barra para onde está.
  useEffect(() => {
    if (!playing || !inView) return;
    let raf = 0;
    let last = performance.now();
    const loop = (now: number) => {
      progress.current += (now - last) / PHASE_MS;
      last = now;
      if (progress.current >= 1) {
        progress.current = 0;
        setTick((n) => n + 1);
      }
      if (fillRef.current) fillRef.current.style.transform = `scaleX(${progress.current})`;
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [playing, inView]);

  /** Navegação manual: vai ao passo e para o loop ali (barra cheia). */
  const goTo = (next: number) => {
    progress.current = 1;
    setPlaying(false);
    setTick(Math.max(0, next));
  };
  const cycle = Math.floor(tick / 4) * 4;

  const phase = tick % 4;
  const node = Math.floor(tick / 4) % c.serviceNodes.length;
  const path = route(node);

  return (
    <section id="idp" className="sec">
      <div className="wrap">
        <div className="head">
          <Kicker>{c.kicker}</Kicker>
          <h2 className="h2 rv" style={rv(1)}>
            {c.title}
          </h2>
          <p className="lead rv" style={{ ...rv(2), maxWidth: 720 }}>
            {c.lead}
          </p>
        </div>

        <div className="role">
          {/* No celular, o diagrama vira esta faixa baixa: o serviço, o IdP
              (um orbe pontilhado pequeno) e a base, com um pacote fazendo o
              caminho do login em loop (só CSS). */}
          <div className="role-mini rv" style={rv(2)} aria-hidden="true">
            <div className="rm-node">
              <span className="rm-ico">
                <span className="rm-tile">
                  <Monitor />
                </span>
              </span>
              <span className="rm-l">{c.mini.service}</span>
            </div>
            <div className="rm-line">
              <i className="rm-pkt rm-a" />
            </div>
            <div className="rm-node rm-idp">
              <span className="rm-ico">
                <canvas className="dither" data-dither="orb" />
              </span>
              <span className="rm-l">{brand}</span>
            </div>
            <div className="rm-line">
              <i className="rm-pkt rm-b" />
            </div>
            <div className="rm-node">
              <span className="rm-ico">
                <span className="rm-tile">
                  <Database />
                </span>
              </span>
              <span className="rm-l">{c.mini.base}</span>
            </div>
          </div>

          <div className="role-viz rv" style={rv(2)} ref={vizRef} role="img" aria-label={c.vizLabel}>
            <div className="role-col">
              <div className="col-t">{c.services}</div>
              <div className="nodes">
                {c.serviceNodes.map((label, i) => {
                  const Icon = ICONS[i % ICONS.length];
                  const on = i === node && phase !== 2;
                  return (
                    <div key={label} className={on ? "node on" : "node"}>
                      <Icon />
                      {label}
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="role-conn" aria-hidden="true">
              <svg viewBox={`0 0 ${CONN_W} ${CONN_H}`}>
                {NODE_Y.map((y) => (
                  <path key={y} d={`M0 ${y}H${MID_X}`} />
                ))}
                <path d={`M${MID_X} ${NODE_Y[0]}V${NODE_Y[NODE_Y.length - 1]}M${MID_X} ${CORE_Y}H${CONN_W}`} />
              </svg>
              {!reduce && phase === 1 && <Packet key={`in-${tick}`} pts={path} />}
              {!reduce && phase === 3 && <Packet key={`out-${tick}`} pts={[...path].reverse()} />}
            </div>

            <div className="role-center">
              <div className={phase === 2 ? "node role-db on" : "node role-db"}>
                <Database />
                {c.base}
              </div>
              <div className="role-v" aria-hidden="true">
                {!reduce && phase === 2 && (
                  <Packet
                    key={`v-${tick}`}
                    pts={[
                      { x: 0, y: V_H },
                      { x: 0, y: 0 },
                      { x: 0, y: 0 },
                      { x: 0, y: V_H },
                    ]}
                  />
                )}
              </div>
              <div className={phase >= 1 ? "core role-core on" : "core role-core"}>
                <Dither mode="orb" style={{ top: 0, height: 200 }} />
                <div className="orb" aria-hidden="true" />
                <div className="core-t">{brand}</div>
              </div>
            </div>
          </div>

          <div className="role-side">
            <ol className="role-steps" aria-label={c.controls.label}>
              {c.steps.map((st, i) => {
                const on = i === phase;
                return (
                  <li key={st.t} className={on ? "on" : undefined}>
                    <button type="button" aria-current={on ? "step" : undefined} onClick={() => goTo(cycle + i)}>
                      <span className="n">{String(i + 1).padStart(2, "0")}</span>
                      <span className="t">{st.t}</span>
                      <span className="d">{st.d}</span>
                      {on && (
                        <span className="role-bar" aria-hidden="true">
                          <span
                            ref={fillRef}
                            className="role-fill"
                            style={{ transform: `scaleX(${progress.current})` }}
                          />
                        </span>
                      )}
                    </button>
                  </li>
                );
              })}
            </ol>
            <div className="role-ctrl">
              <button type="button" aria-label={c.controls.prev} onClick={() => goTo(tick > 0 ? tick - 1 : 3)}>
                <ChevronLeft />
              </button>
              <button
                type="button"
                aria-label={playing ? c.controls.pause : c.controls.play}
                onClick={() => {
                  // Retomando de um passo escolhido à mão: a barra recomeça.
                  if (!playing && progress.current >= 1) progress.current = 0;
                  setPlaying(!playing);
                }}
              >
                {playing ? <Pause /> : <Play />}
              </button>
              <button type="button" aria-label={c.controls.next} onClick={() => goTo(tick + 1)}>
                <ChevronRight />
              </button>
              <span className="mono-s">{`0${phase + 1} / 04`}</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
