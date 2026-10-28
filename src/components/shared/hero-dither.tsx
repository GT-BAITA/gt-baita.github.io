import { useEffect, useRef, type RefObject } from "react";
import { ShaderMount } from "@paper-design/shaders";
import { DITHER_CELL, ditherLoop, isSoftwareGL, mixRgba, readInk, type Rgba } from "@/lib/dither";

/**
 * Fundo pontilhado dos heroes — o elo visual entre a página inicial e o IdP.
 *
 * As duas páginas desenham os MESMOS pontos, em duas formas:
 *
 *   "scatter" — página inicial: pontos soltos espalhados pelo hero, sem
 *               desenho nenhum, à deriva e reagindo ao mouse.
 *   "star"    — IdP: os pontos se juntam — a poeira vira o brilho do centro
 *               e as 14 estrelas ligam direto a ele, o "IdP BAITA · login
 *               único".
 *
 * Um único canvas, montado uma vez no Layout (<HeroBackdrop />), serve o
 * site inteiro: cada hero só registra a forma que quer (useHeroBackdrop) e,
 * ao trocar de página, o mesmo canvas se transforma no lugar (MORPH_MS) —
 * sem recriar contexto WebGL nem recompilar shader no meio da navegação.
 * Páginas sem hero não registram nada e os pontos se apagam.
 *
 * Divisão do trabalho: o JS só calcula onde estão ~124 pontos a cada quadro
 * (cena, transformação, deriva, mouse) e os envia como uniforms; o desenho
 * de cada pixel — campo, máscara e limiar de Bayer — roda num fragment
 * shader na GPU, via o ShaderMount do Paper Shaders. O canvas é renderizado
 * na resolução das células (um pixel = 3px) e ampliado com `pixelated`.
 */

type Pt = { x: number; y: number };

type Scene = {
  /** As 14 estrelas principais. */
  nodes: Pt[];
  /** Ponta do raio de cada estrela (o centro, na forma "star"). */
  spokes: Pt[];
  /** Raios estrela→centro (com pulsos): só na forma "star". */
  spokeW: number;
  dust: Pt[];
  /**
   * Peso da poeira extra (índices a partir de STAR_DUST): a moldura da
   * página inicial usa todos os pontos; a estrela do IdP, só os primeiros.
   */
  extraW: number;
  /** Tom da poeira (1 = cor cheia; menor = mais clarinha). */
  dustTone: number;
  hub: Pt;
  hubW: number;
  /** Quanto os pontos derivam e reagem ao mouse (1 solto, baixo na estrela). */
  life: number;
  /** 0 em páginas sem hero: os pontos se apagam onde estão. */
  opacity: number;
};

/**
 * Estrelas na forma "star", relativas à caixa `anchor` do IdP (0–1). As 9
 * primeiras são as principais e levam os rótulos de hero-section.tsx.
 */
export const STAR_NODES: Pt[] = [
  { x: 0.13, y: 0.2 }, { x: 0.06, y: 0.55 }, { x: 0.16, y: 0.86 },
  { x: 0.33, y: 0.1 }, { x: 0.3, y: 0.88 }, { x: 0.67, y: 0.13 },
  { x: 0.87, y: 0.3 }, { x: 0.9, y: 0.66 }, { x: 0.7, y: 0.88 },
  { x: 0.22, y: 0.44 }, { x: 0.4, y: 0.3 }, { x: 0.62, y: 0.7 },
  { x: 0.79, y: 0.48 }, { x: 0.42, y: 0.76 },
];
const MAJOR = 9;
/** Poeira da moldura da página inicial; a estrela do IdP usa só STAR_DUST. */
const DUST_N = 220;
const STAR_DUST = 110;
/** Tom da poeira na moldura: mais pontos, porém mais clarinhos. */
const SCATTER_TONE = 0.45;

/** Sorteio fixo de cada ponto: posição, brilho, cintilação e deriva. */
const SEEDS = (() => {
  let t = 0x9e3779b9;
  const rnd = () => {
    t += 0x6d2b79f5;
    let r = Math.imul(t ^ (t >>> 15), 1 | t);
    r ^= r + Math.imul(r ^ (r >>> 7), 61 | r);
    return ((r ^ (r >>> 14)) >>> 0) / 4294967296;
  };
  const gauss = () => Math.sqrt(-2 * Math.log(rnd() + 1e-9)) * Math.cos(6.2832 * rnd());
  return Array.from({ length: DUST_N + STAR_NODES.length }, () => ({
    u: rnd(),
    v: rnd(),
    gx: gauss(),
    gy: gauss(),
    amp: 0.32 + 0.5 * rnd(),
    speed: 0.5 + 1.1 * rnd(),
    phase: 6.2832 * rnd(),
    drift: 0.6 + 0.8 * rnd(),
    /** Força (0–1) e desvio de ângulo (−1–1) da dispersão pelo mouse. */
    kick: rnd(),
    turn: rnd() * 2 - 1,
  }));
})();
type Seed = (typeof SEEDS)[number];
const DUST = SEEDS.slice(0, DUST_N);
const NODE_SEEDS = SEEDS.slice(DUST_N);

const MORPH_MS = 850;
/** Sumir (página sem hero) é mais curto que se transformar. */
const FADE_MS = 400;

// Vida própria: deriva lenta (px) e reação ao mouse.
const DRIFT_DUST = 18;
const DRIFT_NODE = 10;
/** Velocidade angular da deriva (rad/s): ciclos de ~8 a ~19s por ponto. */
const DRIFT_SPEED = 0.55;
/** Raio de influência do cursor e quanto ele espalha (px). */
const MOUSE_R = 190;
const MOUSE_PUSH = 72;
/** Estrelas são mais "pesadas" que a poeira. */
const NODE_PUSH = 0.55;
const MOUSE_GLOW = 0.55;
/** Desvio máximo do ângulo de fuga (rad): espalha, não empurra em bloco. */
const MOUSE_TURN = 0.9;
/** Mola que traz cada ponto de volta: rigidez e amortecimento. */
const SPRING_K = 70;
const SPRING_D = 11;

// Simétrica de propósito: a página e o tema trocam no primeiro instante;
// uma curva que gasta o movimento no começo se perderia nessa troca.
const easeInOutCubic = (t: number) =>
  t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const lerpPt = (a: Pt, b: Pt, t: number): Pt => ({ x: lerp(a.x, b.x, t), y: lerp(a.y, b.y, t) });
const luma = ([r, g, b]: Rgba | number[]) => (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255;
const smoothstep = (e0: number, e1: number, x: number) => {
  const t = Math.min(1, Math.max(0, (x - e0) / (e1 - e0)));
  return t * t * (3 - 2 * t);
};

/** Luminosidade atual do fundo da página (0–1), que transiciona na virada de tema. */
function pageLuma(): number {
  const m = /rgba?\((\d+),\s*(\d+),\s*(\d+)/.exec(getComputedStyle(document.body).backgroundColor);
  return m ? luma([+m[1], +m[2], +m[3]]) : 0.5;
}

/**
 * Pesos não andam junto com as posições: o que vai sumir some no começo,
 * o que vai aparecer só aparece no fim. Assim os raios nunca atravessam
 * a tela já desenhados — só os pontos viajam.
 */
const fade = (a: number, b: number, t: number) =>
  lerp(a, b, b > a ? smoothstep(0.45, 1, t) : smoothstep(0, 0.55, t));

function lerpScene(a: Scene, b: Scene, t: number): Scene {
  return {
    nodes: a.nodes.map((p, i) => lerpPt(p, b.nodes[i], t)),
    spokes: a.spokes.map((p, i) => lerpPt(p, b.spokes[i], t)),
    spokeW: fade(a.spokeW, b.spokeW, t),
    dust: a.dust.map((p, i) => lerpPt(p, b.dust[i], t)),
    extraW: fade(a.extraW, b.extraW, t),
    dustTone: lerp(a.dustTone, b.dustTone, t),
    hub: lerpPt(a.hub, b.hub, t),
    hubW: fade(a.hubW, b.hubW, t),
    life: lerp(a.life, b.life, t),
    opacity: lerp(a.opacity, b.opacity, t),
  };
}

function starScene(box: DOMRect): Scene {
  const hub = { x: box.x + box.width / 2, y: box.y + box.height / 2 };
  return {
    nodes: STAR_NODES.map((p) => ({ x: box.x + p.x * box.width, y: box.y + p.y * box.height })),
    spokes: STAR_NODES.map(() => hub),
    spokeW: 1,
    // A poeira vira o brilho difuso em volta do centro (a extra se apaga).
    dust: DUST.map((d) => ({
      x: hub.x + d.gx * box.width * 0.16,
      y: hub.y + d.gy * box.height * 0.2,
    })),
    extraW: 0,
    dustTone: 1,
    hub,
    hubW: 1,
    // Os rótulos estão presos às estrelas: aqui elas quase não se mexem.
    life: 0.2,
    opacity: 1,
  };
}

/** Folga entre os pontos e o conteúdo do hero (px). */
const BOWL_GAP = 40;
/**
 * Até onde a tigela vai além do conteúdo, de cada lado (px). Em telas mais
 * largas que isso, ela não estica: fica do tamanho do conteúdo + margem e
 * rareia suavemente para fora, em vez de se espalhar até as bordas.
 */
const BOWL_REACH = 560;
/** Onde a curva toca as laterais da tigela (fração da altura da cena). */
const BOWL_RIM = 0.3;

type Box = { left: number; top: number; right: number; bottom: number };

/** Sorteio determinístico por ponto (o mesmo a cada medida). */
function prng(seed: number) {
  let t = seed >>> 0;
  return () => {
    t += 0x6d2b79f5;
    let r = Math.imul(t ^ (t >>> 15), 1 | t);
    r ^= r + Math.imul(r ^ (r >>> 7), 61 | r);
    return ((r ^ (r >>> 14)) >>> 0) / 4294967296;
  };
}

/**
 * Mesmos pontos, emoldurando o hero numa "tigela": um círculo grande e
 * vazio em volta do conteúdo, e os pontos do lado de fora dele — subindo
 * pelas laterais a partir do fundo da tela, mais densos junto à curva.
 *
 * O círculo é medido pelo conteúdo (`content`), não pela tela: a tigela
 * tem no máximo a largura do conteúdo + BOWL_REACH de cada lado, e além
 * disso os pontos rareiam. Assim, numa tela enorme, a forma continua
 * abraçando o texto e a captura em vez de fugir para as beiradas.
 * Nenhum ponto cai sobre os blocos de conteúdo (`blocks`).
 *
 * Quem fica à esquerda do centro na estrela do IdP fica no lado esquerdo
 * da tigela (e vice-versa), então na ida para o IdP tudo converge das
 * laterais para o centro.
 */
function scatterScene(width: number, top: number, bottom: number, content: Box, blocks: Box[]): Scene {
  const span = bottom - top;
  const cx = (content.left + content.right) / 2;
  const halfW = Math.min(Math.max(cx, width - cx), (content.right - content.left) / 2 + BOWL_REACH);
  // Círculo com centro no topo da cena, passando pelas laterais da tigela
  // à altura BOWL_RIM.
  const cy = top;
  const R = Math.hypot(halfW, span * BOWL_RIM);
  /** Ângulo em que a curva sai pela lateral da tigela (0 = horizontal). */
  const rim = Math.asin(Math.min(1, (span * BOWL_RIM) / R));

  const free = (x: number, y: number) =>
    x > 0 && x < width && y > top && y < bottom &&
    !blocks.some((b) => x > b.left - BOWL_GAP && x < b.right + BOWL_GAP && y > b.top - BOWL_GAP && y < b.bottom + BOWL_GAP);
  /** Fora da largura da tigela, os pontos rareiam em ~150px. */
  const keep = (x: number, rnd: number) => {
    const out = Math.abs(x - cx) - halfW;
    return out <= 0 || rnd < Math.exp(-(out * out) / (150 * 150));
  };

  /**
   * Um ponto do lado de fora do círculo, no lado pedido: ângulo sorteado
   * ao longo da metade de baixo e distância da curva meia-normal com
   * desvio `spread` (fração de R). Tenta até achar um lugar livre.
   */
  const place = (i: number, left: boolean, spread: number) => {
    const rnd = prng(0x51ed27 + i * 7919);
    // Em telas estreitas o círculo é pequeno: a faixa acompanha a altura.
    const band = spread * Math.max(R, span);
    for (let k = 0; k < 32; k++) {
      // De `rim` (um pouco acima da lateral) até o fundo, no meio.
      const a = rim - 0.12 + rnd() * (Math.PI / 2 - rim + 0.12);
      const g = Math.sqrt(-2 * Math.log(rnd() + 1e-9)) * Math.cos(6.2832 * rnd());
      const r = R + Math.abs(g) * band;
      const dx = Math.cos(a) * r;
      const p = { x: left ? cx - dx : cx + dx, y: cy + Math.sin(a) * r };
      if (free(p.x, p.y) && keep(p.x, rnd())) return p;
    }
    // Sem lugar livre (tela estreita): fica abaixo da cena, apagado pelo
    // esmaecimento da base, em vez de cair sobre o texto.
    return { x: left ? width * 0.15 : width * 0.85, y: bottom + 100 };
  };

  const nodes = STAR_NODES.map((s, k) => place(DUST_N + k, s.x < 0.5, 0.1));
  const dust = DUST.map((d, i) => place(i, d.u < 0.5, 0.2));
  const mid = top + span / 2;

  return {
    nodes,
    spokes: nodes,
    spokeW: 0,
    dust,
    extraW: 1,
    dustTone: SCATTER_TONE,
    hub: { x: width / 2, y: mid },
    hubW: 0,
    life: 1,
    opacity: 1,
  };
}

const CELL = DITHER_CELL.toFixed(1);
const NN = STAR_NODES.length;

/*
 * Um fragmento = uma célula de 3px. Distâncias em unidades de célula, com
 * as mesmas constantes do motor em CPU dos painéis do IdP (use-dither.ts),
 * para o grão e o brilho baterem.
 */
const FRAGMENT = /* glsl */ `#version 300 es
precision highp float;

// Mesma precisão do vertex shader do Paper, que também os declara.
uniform mediump vec2 u_resolution;
uniform mediump float u_pixelRatio;
uniform float u_t;
uniform vec2 u_size;
uniform vec4 u_ink;
uniform vec3 u_nodes[${NN}];
uniform vec2 u_spokes[${NN}];
uniform vec3 u_dust[${DUST_N}];
uniform vec2 u_hub;
uniform float u_hubW;
uniform float u_spokeW;
uniform vec4 u_quiet[2];
uniform float u_quietN;
uniform float u_quietIn;
uniform float u_opacity;
uniform float u_dustTone;
// Quantos pontos de poeira estão acesos: os de peso zero ficam fora do laço.
uniform float u_dustN;

out vec4 fragColor;

// Bayer 8x8 por intercalação de bits: limiar em (0, 1).
float bayer8(ivec2 p) {
  int x = p.x & 7, y = p.y & 7, v = x ^ y;
  int r = ((v & 1) << 5) | ((y & 1) << 4) | ((v & 2) << 2) | ((y & 2) << 1) | ((v & 4) >> 1) | ((y & 4) >> 2);
  return (float(r) + 0.5) / 64.0;
}

void main() {
  ivec2 cell = ivec2(int(gl_FragCoord.x), int(u_resolution.y - gl_FragCoord.y));
  vec2 css = (vec2(cell) + 0.5) / u_pixelRatio;
  vec2 P = css / ${CELL};

  // Esmaecimento no topo e na base + silêncio em volta dos textos.
  float edge = smoothstep(60.0, 200.0, css.y) * (1.0 - smoothstep(u_size.y - 240.0, u_size.y, css.y));
  float quiet = edge;
  for (int i = 0; i < 2; i++) {
    if (float(i) >= u_quietN) break;
    vec4 r = u_quiet[i];
    float dx = max(max(r.x - 20.0 - css.x, 0.0), css.x - r.z - 20.0);
    float dy = max(max(r.y - 20.0 - css.y, 0.0), css.y - r.w - 20.0);
    quiet *= 0.1 + 0.9 * smoothstep(0.0, 110.0, length(vec2(dx, dy)));
  }
  float m = mix(edge, quiet, u_quietIn) * u_opacity;
  if (m < 0.002) { fragColor = vec4(0.0); return; }

  float v = 0.0;

  if (u_hubW > 0.01) {
    vec2 d = P - u_hub / ${CELL};
    float d2 = dot(d, d);
    float br = 0.85 + 0.15 * sin(u_t * 0.9);
    v += 0.045 * u_hubW * exp(-d2 / 4322.0);
    v += u_hubW * (1.1 * exp(-d2 / 128.0) + 0.22 * exp(-d2 / 432.0)) * br;
  }

  for (int i = 0; i < ${NN}; i++) {
    vec3 n = u_nodes[i];
    vec2 d = P - n.xy / ${CELL};
    float d2 = dot(d, d);
    bool major = i < ${MAJOR};
    v += exp(-d2 / (major ? 13.52 : 5.12)) * (major ? 0.95 : 0.6);
    v += exp(-d2 / 162.0) * ((major ? 0.12 : 0.06) + n.z);
  }

  float dust = 0.0;
  for (int i = 0; i < ${DUST_N}; i++) {
    if (float(i) >= u_dustN) break;
    vec3 p = u_dust[i];
    vec2 d = P - p.xy / ${CELL};
    dust = max(dust, p.z * exp(-dot(d, d) / 2.42));
  }

  // Raios até o centro, com pulsos correndo para dentro.
  if (u_spokeW > 0.01) {
    float best = 0.0, bt = 0.0, bi = 0.0;
    for (int i = 0; i < ${NN}; i++) {
      vec2 a = u_nodes[i].xy / ${CELL};
      vec2 ab = u_spokes[i] / ${CELL} - a;
      float L2 = dot(ab, ab);
      if (L2 < 1.0) continue;
      float t = clamp(dot(P - a, ab) / L2, 0.0, 1.0);
      vec2 q = a + ab * t - P;
      float c = exp(-dot(q, q) / 2.0) * u_spokeW * (i < ${MAJOR} ? 1.0 : 0.6);
      if (c > best) { best = c; bt = t; bi = float(i); }
    }
    v += best * 0.2;
    if (best > 0.02) {
      float q = fract(bt - u_t * 0.14 + fract(bi * 0.618));
      float dd = min(q, 1.0 - q);
      v += best * exp(-dd * dd / 0.003) * 0.95;
    }
  }

  // A célula acesa só pela poeira sai no tom da poeira (mais clara).
  float b = bayer8(cell);
  float a = v * m > b ? 1.0 : (v + dust) * m > b ? u_dustTone : 0.0;
  fragColor = vec4(u_ink.rgb, 1.0) * u_ink.a * a;
}
`;

/* ── Registro: cada hero diz que forma quer ─────────────────────────── */

type Registration = {
  layout: "scatter" | "star";
  /**
   * scatter: elemento até onde os pontos se espalham (a captura); se
   * estiver oculto, eles ocupam a faixa logo abaixo dos textos.
   * star: caixa onde a estrela se desenha (centro = nó central).
   */
  anchorRef: RefObject<HTMLElement | null>;
  /** Textos e botões que o pontilhado deve contornar (até 2). */
  quietRefs: RefObject<HTMLElement | null>[];
};

let registration: Registration | null = null;
const listeners = new Set<() => void>();
const notify = () => listeners.forEach((fn) => fn());

/**
 * Pede ao fundo do Layout a forma deste hero enquanto ele estiver montado.
 * As posições são medidas a partir dos refs, então eles precisam estar no
 * DOM quando o efeito roda.
 */
export function useHeroBackdrop(reg: Registration) {
  const regRef = useRef(reg);
  regRef.current = reg;
  useEffect(() => {
    const mine = regRef.current;
    registration = mine;
    notify();
    return () => {
      if (registration === mine) registration = null;
      notify();
    };
  }, [reg.layout]);
}

/* ── O canvas ─────────────────────────────────────────────────────────── */

/**
 * Fica no topo do conteúdo rolável do Layout, atrás dos heroes (que ficam
 * em z-index acima dele). Montado uma vez; só a cena muda.
 */
export function HeroBackdrop() {
  const hostRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;

    // Sem GPU, cada quadro custa caro na CPU: fica como no movimento
    // reduzido. A consulta usa o contexto do próprio shader, logo abaixo.
    let reduce = (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches ?? false);

    let inkTo = readInk(host);
    let ink = inkTo;
    let morph: { from: Scene; inkFrom: Rgba; start: number; ms: number } | null = null;
    let quietIn = 1;
    let quiet: number[][] = [[0, 0, 0, 0], [0, 0, 0, 0]];
    let quietN = 0;
    let width = host.clientWidth;
    let height = 1;
    let reg: Registration | null = null;

    /** Mede a página registrada e devolve a cena-alvo, já com o host no tamanho. */
    const measure = (r: Registration, keepTaller = false): Scene | null => {
      const hostRect = host.getBoundingClientRect();
      width = host.clientWidth;
      /**
       * Caixa do elemento relativa ao host, sem o deslocamento do próprio
       * transform: os blocos entram na página deslizando (ex.: `.rv` do IdP,
       * translateY(18px)), e a medida chega no meio disso. Sem descontar, a
       * estrela ficaria 18px abaixo dos rótulos até a próxima medida.
       */
      const rel = (el: HTMLElement) => {
        const b = el.getBoundingClientRect();
        const t = getComputedStyle(el).transform;
        const m = t && t !== "none" ? new DOMMatrixReadOnly(t) : null;
        return new DOMRect(b.x - hostRect.x - (m?.m41 ?? 0), b.y - hostRect.y - (m?.m42 ?? 0), b.width, b.height);
      };
      const rects = r.quietRefs
        .map((q) => q.current)
        .filter((el): el is HTMLElement => !!el && el.offsetParent !== null)
        .slice(0, 2)
        .map(rel);
      const anchor = r.anchorRef.current;
      const anchorRect = anchor && anchor.offsetParent !== null ? rel(anchor) : null;
      if (!rects.length && !anchorRect) return null;

      quietN = rects.length;
      quiet = [0, 1].map((i) =>
        rects[i] ? [rects[i].left, rects[i].top, rects[i].right, rects[i].bottom] : [0, 0, 0, 0]
      );

      let next: Scene;
      let h: number;
      if (r.layout === "star" && anchorRect) {
        next = starScene(anchorRect);
        h = anchorRect.bottom + 60;
      } else {
        const textBottom = rects.reduce((b, q) => Math.max(b, q.bottom), 0);
        // A tigela sobe do fundo da primeira tela (nunca acima do fim dos textos).
        const bottom = Math.max(textBottom + 220, window.innerHeight);
        // O conteúdo é a união dos textos e da captura: a tigela é medida
        // por ele.
        const boxes = anchorRect ? [...rects, anchorRect] : rects;
        const content = {
          left: Math.min(...boxes.map((b) => b.left)),
          top: Math.min(...boxes.map((b) => b.top)),
          right: Math.max(...boxes.map((b) => b.right)),
          bottom: Math.max(...boxes.map((b) => b.bottom)),
        };
        next = scatterScene(width, 130, bottom, content, boxes);
        h = bottom + 120;
      }
      // Durante uma transformação, o canvas fica com a maior das duas
      // alturas para nenhum ponto em trânsito ser cortado.
      height = keepTaller ? Math.max(height, h) : h;
      host.style.height = `${Math.round(height)}px`;
      return next;
    };

    const hidden = (from: Scene): Scene => ({ ...from, opacity: 0, spokeW: 0, hubW: 0 });

    let target: Scene = hidden(scatterScene(width, 130, 600, { left: width * 0.3, top: 130, right: width * 0.7, bottom: 600 }, []));
    let scene: Scene = target;

    /** Troca de forma: parte do que está na tela agora. */
    const retarget = (animate: boolean) => {
      reg = registration;
      inkTo = readInk(host);
      const morphing = animate && !reduce && scene.opacity > 0.01;
      const next = reg ? measure(reg, morphing) : null;
      const goal = next ?? hidden(scene);
      if (morphing) {
        morph = { from: scene, inkFrom: ink, start: performance.now(), ms: next ? MORPH_MS : FADE_MS };
        quietIn = 0;
      } else {
        // Primeira forma, vindo de uma página sem hero ou com movimento
        // reduzido: aparece já pronta (com um fade, se puder animar).
        morph = !reduce && next ? { from: { ...goal, opacity: 0 }, inkFrom: inkTo, start: performance.now(), ms: FADE_MS } : null;
        scene = morph ? morph.from : goal;
        ink = inkTo;
        quietIn = 1;
      }
      target = goal;
    };

    // Mouse: posição na tela e força suavizada (entra e sai sem pulo).
    const pointer = { x: 0, y: 0, inside: false };
    let mouseK = 0;
    // Deslocamento e velocidade de cada ponto (poeira, depois estrelas, na
    // ordem de SEEDS): a dispersão é uma mola, não um empurrão instantâneo.
    const off = new Float32Array(SEEDS.length * 2);
    const vel = new Float32Array(SEEDS.length * 2);
    const glow = new Float32Array(SEEDS.length);
    let lastT = 0;
    const onPointer = (e: PointerEvent) => {
      pointer.x = e.clientX;
      pointer.y = e.clientY;
      pointer.inside = e.pointerType === "mouse";
    };
    const onLeave = () => {
      pointer.inside = false;
    };

    /** Estado do quadro → uniforms do shader. */
    const compute = (now: number) => {
      const T = now / 1000;
      if (morph) {
        // performance.now(), não o carimbo do rAF: os dois relógios podem
        // divergir, e um t fora de 0–1 extrapola posições e cor.
        const t = Math.min(1, Math.max(0, (performance.now() - morph.start) / morph.ms));
        const e = easeInOutCubic(t);
        scene = lerpScene(morph.from, target, e);
        // A cor segue o fundo, que vira em ~500ms: pixels escuros enquanto
        // ele é claro, claros quando passa do meio-tom.
        const [dark, light] =
          luma(morph.inkFrom) < luma(inkTo) ? [morph.inkFrom, inkTo] : [inkTo, morph.inkFrom];
        ink = mixRgba(dark, light, smoothstep(0.58, 0.42, pageLuma()));
        quietIn = Math.max(quietIn, e);
        if (t >= 1) {
          morph = null;
          ink = inkTo;
          if (reg) measure(reg); // volta à altura só da forma final
        }
      }

      const rect = host.getBoundingClientRect();
      const mx = pointer.x - rect.left;
      const my = pointer.y - rect.top;
      const over = pointer.inside && mx >= 0 && mx <= rect.width && my >= 0 && my <= rect.height;
      const dt = Math.min(0.05, Math.max(0, T - lastT));
      lastT = T;
      // Suavizações por quadro escritas para 60 fps; o expoente as mantém
      // iguais a qualquer taxa de quadros.
      const ease = (k: number) => 1 - (1 - k) ** (dt * 60);
      const glowK = ease(0.2);
      mouseK += ((over ? 1 : 0) - mouseK) * ease(0.1);
      const life = scene.life;

      /**
       * Deriva errante (frequências que não se repetem, então nada gira em
       * círculo) + dispersão: perto do cursor, cada ponto é lançado para
       * longe num ângulo e força próprios e volta com uma mola amortecida.
       * Devolve a posição e quanto o ponto acende.
       */
      const live = (p: Pt, sd: Seed, k: number, amp: number, push: number): [number, number, number] => {
        const a = DRIFT_SPEED * sd.drift;
        const x = p.x + amp * life * (0.6 * Math.sin(a * T + sd.phase) + 0.4 * Math.sin(1.71 * a * T + 2.3 * sd.phase));
        const y = p.y + amp * 0.8 * life * (0.6 * Math.sin(0.87 * a * T + 3.1 * sd.phase) + 0.4 * Math.sin(1.37 * a * T + 0.7 * sd.phase));

        let tx = 0;
        let ty = 0;
        let f = 0;
        if (mouseK > 0.01) {
          const dx = x - mx;
          const dy = y - my;
          const d = Math.hypot(dx, dy);
          if (d < MOUSE_R) {
            f = (1 - d / MOUSE_R) ** 1.5 * mouseK * life;
            const ang = Math.atan2(dy, dx) + sd.turn * MOUSE_TURN;
            const len = f * push * (0.5 + sd.kick);
            tx = Math.cos(ang) * len;
            ty = Math.sin(ang) * len;
          }
        }
        const ix = k * 2;
        vel[ix] += ((tx - off[ix]) * SPRING_K - vel[ix] * SPRING_D) * dt;
        vel[ix + 1] += ((ty - off[ix + 1]) * SPRING_K - vel[ix + 1] * SPRING_D) * dt;
        off[ix] += vel[ix] * dt;
        off[ix + 1] += vel[ix + 1] * dt;
        glow[k] += (f - glow[k]) * glowK;
        return [x + off[ix], y + off[ix + 1], glow[k]];
      };

      const dust = scene.dust.map((p, i) => {
        const sd = DUST[i];
        const [x, y, g] = live(p, sd, i, DRIFT_DUST, MOUSE_PUSH);
        const w = i < STAR_DUST ? 1 : scene.extraW;
        return [x, y, (sd.amp * (0.5 + 0.5 * Math.sin(T * sd.speed + sd.phase)) + g * MOUSE_GLOW) * w];
      });
      const nodes = scene.nodes.map((p, i) => {
        const [x, y, g] = live(p, NODE_SEEDS[i], DUST_N + i, DRIFT_NODE, MOUSE_PUSH * NODE_PUSH);
        return [x, y, g * MOUSE_GLOW * 0.4];
      });

      return {
        u_t: T,
        u_size: [width, height],
        u_ink: ink.map((c) => c / 255),
        u_nodes: nodes,
        u_spokes: scene.spokes.map((p) => [p.x, p.y]),
        u_dust: dust,
        u_hub: [scene.hub.x, scene.hub.y],
        u_hubW: scene.hubW,
        u_spokeW: scene.spokeW,
        u_quiet: quiet,
        u_quietN: quietN,
        u_quietIn: quietIn,
        u_opacity: scene.opacity,
        u_dustTone: scene.dustTone,
        u_dustN: scene.extraW > 0.001 ? DUST_N : STAR_DUST,
      };
    };

    // Renderiza na resolução das células: o teto de pixels do Paper vira
    // (largura/3) × (altura/3), e o CSS amplia sem suavizar.
    const cells = () => Math.max(64, Math.ceil(width / DITHER_CELL) * Math.ceil(height / DITHER_CELL));
    let mount: ShaderMount;
    try {
      mount = new ShaderMount(host, FRAGMENT, compute(performance.now()), { premultipliedAlpha: true, antialias: false }, 0, 0, 0.1, cells());
    } catch (err) {
      // Sem WebGL2 (ou shader recusado): os heroes ficam só com o conteúdo.
      console.warn("HeroBackdrop:", err);
      host.querySelector("canvas")?.remove();
      return;
    }
    mount.canvasElement.style.imageRendering = "pixelated";
    reduce ||= isSoftwareGL(mount.canvasElement.getContext("webgl2"));

    // O ShaderMount só registra os uniforms passados na criação; daí em
    // diante, um setUniforms por quadro (que já desenha). Com a cena
    // apagada e parada, não há o que redesenhar.
    let lastCells = 0;
    const frame = (now: number) => {
      if (!morph && scene.opacity < 0.01) return;
      const c = cells();
      if (c !== lastCells) {
        lastCells = c;
        mount.setMaxPixelCount(c);
      }
      mount.setUniforms(compute(now));
    };

    // Registros chegam na mesma renderização em que a página antiga sai:
    // espera um quadro para ver só o estado final (e o DOM já no lugar).
    let pendingRetarget = 0;
    const onRegistration = () => {
      cancelAnimationFrame(pendingRetarget);
      pendingRetarget = requestAnimationFrame(() => {
        retarget(true);
        observeRegistered();
        frame(performance.now());
      });
    };
    listeners.add(onRegistration);

    // Fontes e imagens mudam a altura dos textos e a posição da captura.
    let pendingResize = 0;
    const ro = new ResizeObserver(() => {
      cancelAnimationFrame(pendingResize);
      pendingResize = requestAnimationFrame(() => {
        if (!reg) return;
        inkTo = readInk(host);
        if (!morph) ink = inkTo;
        const next = measure(reg, !!morph);
        if (next) {
          target = next;
          if (!morph) scene = target;
        }
        frame(performance.now());
      });
    });
    const observeRegistered = () => {
      ro.disconnect();
      ro.observe(host);
      if (!reg) return;
      [reg.anchorRef, ...reg.quietRefs].forEach((r) => r.current && ro.observe(r.current));
    };

    retarget(false);
    observeRegistered();
    frame(performance.now());

    let stop = () => {};
    let visible = true;
    if (!reduce) {
      stop = ditherLoop((now) => {
        if (visible && !document.hidden) frame(now);
      });
      window.addEventListener("pointermove", onPointer, { passive: true });
      document.addEventListener("pointerleave", onLeave);
    }
    const io = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting;
    });
    io.observe(host);

    return () => {
      listeners.delete(onRegistration);
      stop();
      cancelAnimationFrame(pendingRetarget);
      cancelAnimationFrame(pendingResize);
      ro.disconnect();
      io.disconnect();
      window.removeEventListener("pointermove", onPointer);
      document.removeEventListener("pointerleave", onLeave);
      mount.dispose();
      mount.canvasElement.remove();
    };
  }, []);

  return (
    <div
      ref={hostRef}
      aria-hidden="true"
      className="pointer-events-none absolute inset-x-0 top-0 z-0"
    />
  );
}
