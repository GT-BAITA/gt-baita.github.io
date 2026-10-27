import { useEffect, useRef } from "react";
import { ShaderMount } from "@paper-design/shaders";
import { DITHER_CELL, ditherLoop, isSoftwareGL, readInk } from "@/lib/dither";
import {
  BRAZIL_ASPECT,
  BRAZIL_CITIES,
  BRAZIL_COLS,
  BRAZIL_ROW_COUNT,
  BRAZIL_ROWS,
} from "./brazil-map";

/**
 * O Brasil do hero do Barramento, em pontilhado animado — a mesma
 * linguagem dos heroes da página inicial e do IdP (Bayer 8×8, células de
 * 3px, cor pelos tokens --ink / --dither-alpha).
 *
 * O território vira uma textura de 113×62 (a grade do ASCII original) que
 * a GPU amostra com filtro linear, então as bordas saem suaves. Por cima:
 *   - as cidades-polo como estrelas;
 *   - fios entre cidades vizinhas, com pulsos correndo — o barramento
 *     ligando a federação;
 *   - ondas que saem de cada cidade, em tempos diferentes, e só se
 *     espalham por dentro do território.
 */

/** Ligações: cada cidade às duas mais próximas (sem repetir pares). */
const LINKS: [number, number][] = (() => {
  // Distância na proporção real das células (9,21 × 15,21).
  const d = (a: number, b: number) =>
    Math.hypot(
      (BRAZIL_CITIES[a].c - BRAZIL_CITIES[b].c) * 9.21,
      (BRAZIL_CITIES[a].r - BRAZIL_CITIES[b].r) * 15.21
    );
  const seen = new Set<string>();
  const out: [number, number][] = [];
  BRAZIL_CITIES.forEach((_, a) => {
    BRAZIL_CITIES.map((_, b) => b)
      .filter((b) => b !== a)
      .sort((x, y) => d(a, x) - d(a, y))
      .slice(0, 2)
      .forEach((b) => {
        const key = a < b ? `${a}-${b}` : `${b}-${a}`;
        if (seen.has(key)) return;
        seen.add(key);
        out.push([a, b]);
      });
  });
  return out;
})();

const uv = (i: number): [number, number] => [
  (BRAZIL_CITIES[i].c + 0.5) / BRAZIL_COLS,
  (BRAZIL_CITIES[i].r + 0.5) / BRAZIL_ROW_COUNT,
];

const NC = BRAZIL_CITIES.length;
const NL = LINKS.length;

/** A grade vira uma imagem (canal R = tom do território) para a textura. */
function mapImage(): Promise<HTMLImageElement> {
  const canvas = document.createElement("canvas");
  canvas.width = BRAZIL_COLS;
  canvas.height = BRAZIL_ROW_COUNT;
  const ctx = canvas.getContext("2d")!;
  const img = ctx.createImageData(BRAZIL_COLS, BRAZIL_ROW_COUNT);
  const TONE = [0, 180, 215, 255];
  BRAZIL_ROWS.forEach((row, r) => {
    for (let c = 0; c < BRAZIL_COLS; c++) {
      const k = (r * BRAZIL_COLS + c) * 4;
      img.data[k] = TONE[+row[c]];
      img.data[k + 3] = 255;
    }
  });
  ctx.putImageData(img, 0, 0);
  const image = new Image();
  image.src = canvas.toDataURL();
  return image.decode().then(() => image);
}

const FRAGMENT = /* glsl */ `#version 300 es
precision highp float;

// Mesma precisão do vertex shader do Paper, que também os declara.
uniform mediump vec2 u_resolution;
uniform mediump float u_pixelRatio;
uniform sampler2D u_map;
uniform float u_t;
uniform vec4 u_ink;
uniform vec2 u_cities[${NC}];
uniform vec4 u_links[${NL}];

out vec4 fragColor;

float bayer8(ivec2 p) {
  int x = p.x & 7, y = p.y & 7, v = x ^ y;
  int r = ((v & 1) << 5) | ((y & 1) << 4) | ((v & 2) << 2) | ((y & 2) << 1) | ((v & 4) >> 1) | ((y & 4) >> 2);
  return (float(r) + 0.5) / 64.0;
}

float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
float noise(vec2 p) {
  vec2 i = floor(p), f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(mix(hash(i), hash(i + vec2(1, 0)), u.x), mix(hash(i + vec2(0, 1)), hash(i + vec2(1, 1)), u.x), u.y);
}

void main() {
  // Um fragmento = uma célula; distâncias em células.
  ivec2 cell = ivec2(int(gl_FragCoord.x), int(u_resolution.y - gl_FragCoord.y));
  vec2 P = vec2(cell) + 0.5;
  vec2 uv = P / u_resolution;

  float tone = texture(u_map, uv).r;
  float land = smoothstep(0.3, 0.65, tone);

  // Território: textura rala, com um tremular lento de ruído.
  float v = land * (0.07 + 0.09 * tone + 0.07 * noise(P * 0.07 + vec2(u_t * 0.12, -u_t * 0.08)));

  for (int i = 0; i < ${NC}; i++) {
    vec2 c = u_cities[i] * u_resolution;
    float d = length(P - c);
    // Onda: cada cidade no seu tempo; anel que cresce e esmaece.
    float ph = fract(u_t / 4.5 + float(i) * 0.137);
    float ring = d - ph * 90.0;
    v += land * exp(-ring * ring / 10.0) * (1.0 - ph) * 0.4;
    // A cidade: núcleo + halo.
    v += exp(-d * d / 13.5) * 0.95 + exp(-d * d / 162.0) * 0.14;
  }

  // Fios entre cidades, com um pulso viajando em cada um.
  for (int j = 0; j < ${NL}; j++) {
    vec2 a = u_links[j].xy * u_resolution;
    vec2 ab = u_links[j].zw * u_resolution - a;
    float L = length(ab);
    float t = clamp(dot(P - a, ab) / (L * L), 0.0, 1.0);
    vec2 q = a + ab * t - P;
    float line = exp(-dot(q, q) / 2.2);
    float pos = fract(u_t * 26.0 / L + float(j) * 0.37);
    float along = (t - pos) * L;
    v += line * (0.22 + 0.9 * exp(-along * along / 18.0));
  }

  fragColor = v > bayer8(cell) ? vec4(u_ink.rgb * u_ink.a, u_ink.a) : vec4(0.0);
}
`;

export function BrazilDither({ className }: { className?: string }) {
  const hostRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;
    // Sem GPU, cada quadro custa caro na CPU: fica como no movimento
    // reduzido. A consulta usa o contexto do próprio shader, quando ele existir.
    let reduce = (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches ?? false);

    let mount: ShaderMount | null = null;
    let stop = () => {};
    let visible = true;
    let cancelled = false;
    const cells = () =>
      Math.max(64, Math.ceil(host.clientWidth / DITHER_CELL) * Math.ceil(host.clientHeight / DITHER_CELL));
    const ink = () => readInk(host).map((c) => c / 255);

    const io = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting;
    });
    const ro = new ResizeObserver(() => mount?.setMaxPixelCount(cells()));

    mapImage().then((image) => {
      if (cancelled) return;
      try {
        mount = new ShaderMount(
          host,
          FRAGMENT,
          {
            u_map: image,
            u_t: 0,
            u_ink: ink(),
            u_cities: BRAZIL_CITIES.map((_, i) => uv(i)),
            u_links: LINKS.map(([a, b]) => [...uv(a), ...uv(b)]),
          },
          { premultipliedAlpha: true, antialias: false },
          0,
          0,
          0.1,
          cells()
        );
      } catch (err) {
        console.warn("BrazilDither:", err);
        host.querySelector("canvas")?.remove();
        return;
      }
      mount.canvasElement.style.imageRendering = "pixelated";
      reduce ||= isSoftwareGL(mount.canvasElement.getContext("webgl2"));
      io.observe(host);
      ro.observe(host);
      if (reduce) {
        mount.setUniforms({ u_t: 2.2 });
        return;
      }
      stop = ditherLoop((now) => {
        if (visible && !document.hidden) mount!.setUniforms({ u_t: now / 1000 });
      });
    });

    return () => {
      cancelled = true;
      stop();
      io.disconnect();
      ro.disconnect();
      if (mount) {
        mount.dispose();
        mount.canvasElement.remove();
      }
    };
  }, []);

  return (
    <div
      ref={hostRef}
      aria-hidden="true"
      className={className}
      style={{ aspectRatio: BRAZIL_ASPECT }}
    />
  );
}
