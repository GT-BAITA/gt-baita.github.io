import { useEffect, useRef } from "react";
import { ShaderMount } from "@paper-design/shaders";
import { DITHER_CELL, readInk } from "@/lib/dither";
import { DB, IDP, type P } from "./silos-geometry";

/**
 * Pontilhado de fundo do painel do "Problema", contando a mesma história
 * do diagrama por cima dele:
 *
 *   Antes  — manchas soltas pelo painel, flutuando e pulsando cada uma no
 *            seu ritmo, como no mock original: o caos.
 *   Depois — as manchas se recolhem num brilho e num halo calmos em volta
 *            do IdP BAITA, com um brilho menor na base unificada.
 *
 * Mesmo grão dos outros pontilhados (Bayer 8×8, células de 3px, cor pelos
 * tokens), desenhado na GPU. O JS só move 16 manchas por quadro.
 */

const N = 16;
const MORPH_MS = 900;

/** Mancha: posição em % do painel, raio em px, intensidade. */
type Blob = { x: number; y: number; r: number; a: number };

const SEEDS = (() => {
  let t = 0x2545f491;
  const rnd = () => {
    t += 0x6d2b79f5;
    let r = Math.imul(t ^ (t >>> 15), 1 | t);
    r ^= r + Math.imul(r ^ (r >>> 7), 61 | r);
    return ((r ^ (r >>> 14)) >>> 0) / 4294967296;
  };
  return Array.from({ length: N }, () => ({
    x: 8 + 84 * rnd(),
    y: 12 + 80 * rnd(),
    size: rnd(),
    phase: 6.2832 * rnd(),
    speed: 0.6 + 0.8 * rnd(),
  }));
})();

const at = (p: P, r: number, a: number): Blob => ({ x: p.x, y: p.y, r, a });

/** Antes: manchas soltas, do tamanho e brilho das do mock. */
function before(): Blob[] {
  return SEEDS.map((s) => ({ x: s.x, y: s.y, r: 12 + 21 * s.size, a: 0.45 + 0.4 * s.size }));
}

/** Depois: um brilho no IdP e o resto em halo à volta dele. */
function after(): Blob[] {
  return SEEDS.map((s, i) => {
    if (i === 0) return at(IDP, 70, 0.6);
    if (i === 1) return at(DB, 44, 0.5);
    const ang = (i / (N - 1)) * 6.2832 + s.phase * 0.2;
    const rad = 13 + 8 * s.size;
    return {
      x: IDP.x + Math.cos(ang) * rad * 0.9,
      y: IDP.y + Math.sin(ang) * rad,
      r: 10 + 12 * s.size,
      a: 0.3 + 0.22 * s.size,
    };
  });
}

const FRAGMENT = /* glsl */ `#version 300 es
precision highp float;

// Mesma precisão do vertex shader do Paper, que também os declara.
uniform mediump vec2 u_resolution;
uniform mediump float u_pixelRatio;
uniform vec4 u_blobs[${N}];
uniform vec4 u_ink;

out vec4 fragColor;

float bayer8(ivec2 p) {
  int x = p.x & 7, y = p.y & 7, v = x ^ y;
  int r = ((v & 1) << 5) | ((y & 1) << 4) | ((v & 2) << 2) | ((y & 2) << 1) | ((v & 4) >> 1) | ((y & 4) >> 2);
  return (float(r) + 0.5) / 64.0;
}

void main() {
  ivec2 cell = ivec2(int(gl_FragCoord.x), int(u_resolution.y - gl_FragCoord.y));
  vec2 css = (vec2(cell) + 0.5) / u_pixelRatio;
  vec2 size = u_resolution / u_pixelRatio;

  // Fundo: um degradê muito leve, mais denso embaixo (como no mock).
  float v = 0.02 + 0.06 * css.y / size.y;
  for (int i = 0; i < ${N}; i++) {
    vec4 b = u_blobs[i];
    vec2 d = css - b.xy;
    v += b.w * exp(-dot(d, d) / (2.0 * b.z * b.z));
  }
  fragColor = v > bayer8(cell) ? vec4(u_ink.rgb * u_ink.a, u_ink.a) : vec4(0.0);
}
`;

const easeOut = (t: number) => 1 - Math.pow(1 - t, 3);

export function SilosDither({ organized }: { organized: boolean }) {
  const hostRef = useRef<HTMLDivElement>(null);
  // Estado vivo do laço, lido sem recriar o efeito a cada troca.
  const state = useRef({
    target: organized ? after() : before(),
    from: organized ? after() : before(),
    start: 0,
    organized,
  });
  /** Redesenho avulso (com movimento reduzido não há laço). */
  const redraw = useRef<() => void>(() => {});

  // Troca de forma: parte de onde as manchas estão agora.
  useEffect(() => {
    const s = state.current;
    if (s.organized === organized) return;
    s.from = current(s, performance.now());
    s.target = organized ? after() : before();
    s.start = performance.now();
    s.organized = organized;
    redraw.current();
  }, [organized]);

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;
    const reduce = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches ?? false;
    let w = host.clientWidth;
    let h = host.clientHeight;
    const cells = () => Math.max(64, Math.ceil(w / DITHER_CELL) * Math.ceil(h / DITHER_CELL));
    // O tema é da rota: a cor não muda com o painel montado.
    const ink = readInk(host).map((c) => c / 255);

    const uniforms = (now: number) => {
      const s = state.current;
      const blobs = current(s, now);
      const T = now / 1000;
      // Antes, cada mancha vagueia e pulsa no seu ritmo; depois, quase só
      // respira no lugar.
      const calm = s.organized ? 0.35 : 1;
      return {
        u_ink: ink,
        u_blobs: blobs.map((b, i) => {
          const sd = SEEDS[i];
          const dx = reduce ? 0 : Math.sin(T * 0.5 * sd.speed + sd.phase) * 2.2 * calm;
          const dy = reduce ? 0 : Math.sin(T * 0.43 * sd.speed + sd.phase * 1.9) * 2.2 * calm;
          const pulse = reduce ? 1 : 0.75 + 0.25 * Math.sin(T * 0.7 * sd.speed + sd.phase);
          return [((b.x + dx) / 100) * w, ((b.y + dy) / 100) * h, b.r, b.a * pulse];
        }),
      };
    };

    let mount: ShaderMount;
    try {
      mount = new ShaderMount(host, FRAGMENT, uniforms(performance.now()), { premultipliedAlpha: true, antialias: false }, 0, 0, 0.1, cells());
    } catch (err) {
      console.warn("SilosDither:", err);
      host.querySelector("canvas")?.remove();
      return;
    }
    mount.canvasElement.style.imageRendering = "pixelated";

    const ro = new ResizeObserver(() => {
      w = host.clientWidth;
      h = host.clientHeight;
      mount.setMaxPixelCount(cells());
    });
    ro.observe(host);

    let visible = true;
    const io = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting;
    });
    io.observe(host);

    let raf = 0;
    const loop = (now: number) => {
      raf = requestAnimationFrame(loop);
      if (visible && !document.hidden) mount.setUniforms(uniforms(now));
    };
    if (!reduce) raf = requestAnimationFrame(loop);
    // Sem laço, a troca de forma vai direto ao estado final.
    redraw.current = () => {
      if (reduce) state.current.start = 0;
      mount.setUniforms(uniforms(performance.now()));
    };

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
      redraw.current = () => {};
      mount.dispose();
      mount.canvasElement.remove();
    };
  }, []);

  return <div ref={hostRef} className="silos-dither" aria-hidden="true" />;
}

/** Posições/intensidades agora, no meio (ou fim) da transformação. */
function current(s: { target: Blob[]; from: Blob[]; start: number }, now: number): Blob[] {
  const t = s.start ? easeOut(Math.min(1, Math.max(0, (now - s.start) / MORPH_MS))) : 1;
  return s.target.map((b, i) => {
    const a = s.from[i];
    return { x: a.x + (b.x - a.x) * t, y: a.y + (b.y - a.y) * t, r: a.r + (b.r - a.r) * t, a: a.a + (b.a - a.a) * t };
  });
}
