import { useEffect, type RefObject } from "react";
import { bayer8, DITHER_CELL, packRgba, readInk } from "@/lib/dither";

/**
 * Anima os <canvas data-dither="orb"> dentro de `rootRef` com
 * dithering ordenado (matriz de Bayer 8×8), portado do mock. Ondas e
 * ripple ficaram com o Paper Shaders (ver Dither em primitives.tsx).
 *
 * Cada canvas é desenhado em células de 3px e ampliado com
 * image-rendering: pixelated. Os campos que não dependem do tempo são
 * pré-calculados por modo (pre); o quadro só combina esses campos com o
 * tempo e compara com o limiar de Bayer (draw). O laço roda a ~24fps e
 * só desenha canvases visíveis. Com prefers-reduced-motion, cada canvas
 * recebe um único quadro estático.
 */

type Mode = "orb";

type Field = {
  c: HTMLCanvasElement;
  mode: Mode;
  vis: boolean;
  w: number;
  h: number;
  ctx?: CanvasRenderingContext2D;
  img?: ImageData;
  buf?: Uint32Array;
  f1?: Float32Array;
  f2?: Float32Array;
  f3?: Float32Array;
  f4?: Float32Array;
  u?: Uint8Array;
};

const CELL = DITHER_CELL;
const FRAME_MS = 42;

function pre(o: Field) {
  const w = o.w, h = o.h, N = w * h, a = w / h, px = 1 / h;
  const f1 = (o.f1 = new Float32Array(N));
  const f2 = (o.f2 = new Float32Array(N));
  const f3 = (o.f3 = new Float32Array(N));
  const f4 = (o.f4 = new Float32Array(N));
  const u = (o.u = new Uint8Array(N));

  if (o.mode === "orb") {
    const cx = .5 * a, cy = .5, Rr = .34, hr2 = 2 * (2.5 * px) ** 2;
    for (let j = 0; j < h; j++) for (let i = 0; i < w; i++) {
      const X = (i + .5) / h, Y = (j + .5) / h, k0 = j * w + i;
      const nx = (X - cx) / Rr, ny = (Y - cy) / Rr, rr = nx * nx + ny * ny;
      if (rr < 1) { u[k0] = 1; f1[k0] = nx; f2[k0] = ny; f3[k0] = Math.sqrt(1 - rr); }
      const dr = (Math.sqrt(rr) - 1) * Rr;
      f4[k0] = Math.exp(-(dr * dr) / hr2) * 0.4 + 0.015;
    }
  }
}

function draw(o: Field, B: Float32Array, T: number, ON: number) {
  const w = o.w, h = o.h, buf = o.buf!;
  const f1 = o.f1!, f2 = o.f2!, f3 = o.f3!, f4 = o.f4!, u = o.u!;

  if (o.mode === "orb") {
    let Lx = Math.cos(T * 0.35) * 0.75, Ly = -0.45, Lz = 0.55 + 0.25 * Math.sin(T * 0.35);
    const L = Math.sqrt(Lx * Lx + Ly * Ly + Lz * Lz);
    Lx /= L; Ly /= L; Lz /= L;
    const rot = T * 0.05;
    for (let j = 0; j < h; j++) {
      const row = (j & 7) << 3;
      for (let i = 0; i < w; i++) {
        const k = j * w + i;
        let v = f4[k];
        if (u[k]) {
          const nx = f1[k], ny = f2[k], nz = f3[k];
          const d = nx * Lx + ny * Ly + nz * Lz;
          v = 0.05 + (d > 0 ? d : 0) * 0.92;
          // Meridianos girando e paralelos fixos sobre a esfera iluminada.
          let q = Math.atan2(nx, nz) / 6.283 * 8 + rot;
          q -= Math.floor(q);
          const e = q < 0.5 ? q : 1 - q;
          v += Math.exp(-e * e / 0.002) * 0.3 * nz;
          let p = (Math.asin(ny) / 3.1416 + 0.5) * 6;
          p -= Math.floor(p);
          const g = p < 0.5 ? p : 1 - p;
          v += Math.exp(-g * g / 0.003) * 0.22 * nz;
        }
        buf[k] = v > B[row + (i & 7)] ? ON : 0;
      }
    }
  }
  o.ctx!.putImageData(o.img!, 0, 0);
}

export function useDither(rootRef: RefObject<HTMLElement | null>, reduceMotion: boolean) {
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const B = bayer8();
    // Lido uma vez: o tema é da rota e não muda com a página montada.
    const ON = packRgba(readInk(root));
    const fields = new Map<Element, Field>();

    const size = (o: Field) => {
      const cw = o.c.clientWidth, ch = o.c.clientHeight;
      if (!cw || !ch) return;
      const w = Math.max(8, Math.round(cw / CELL)), h = Math.max(8, Math.round(ch / CELL));
      if (w === o.w && h === o.h) return;
      o.w = w; o.h = h; o.c.width = w; o.c.height = h;
      const ctx = o.c.getContext("2d");
      if (!ctx) return;
      o.ctx = ctx;
      o.img = ctx.createImageData(w, h);
      o.buf = new Uint32Array(o.img.data.buffer);
      pre(o);
      draw(o, B, 12, ON);
    };

    const vio = new IntersectionObserver((entries) => {
      for (const e of entries) {
        const o = fields.get(e.target);
        if (o) o.vis = e.isIntersecting;
      }
    });
    const ro = new ResizeObserver((entries) => {
      for (const e of entries) {
        const o = fields.get(e.target);
        if (o) size(o);
      }
    });

    root.querySelectorAll<HTMLCanvasElement>("canvas[data-dither]").forEach((c) => {
      const o: Field = { c, mode: c.dataset.dither as Mode, vis: false, w: 0, h: 0 };
      fields.set(c, o);
      vio.observe(c);
      ro.observe(c);
      size(o);
    });

    let raf = 0;
    if (!reduceMotion) {
      let last = 0;
      const loop = (now: number) => {
        raf = requestAnimationFrame(loop);
        if (now - last < FRAME_MS) return;
        last = now;
        const T = now / 1000;
        for (const o of fields.values()) if (o.vis && o.w && o.ctx) draw(o, B, T, ON);
      };
      raf = requestAnimationFrame(loop);
    }

    return () => {
      cancelAnimationFrame(raf);
      vio.disconnect();
      ro.disconnect();
    };
  }, [rootRef, reduceMotion]);
}
