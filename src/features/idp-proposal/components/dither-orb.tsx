import { useEffect, useRef } from "react";
import { bayer8, DITHER_CELL, packRgba, readInk } from "@/lib/dither";

/**
 * Globo pontilhado da capa: o mesmo orbe dos painéis do IdP no site
 * (gt-baita.github.io, src/components/idp/use-dither.ts), maior e com a luz
 * puxada pelo cursor. Esfera iluminada, meridianos girando e paralelos
 * fixos, comparados com o limiar de Bayer 8×8 em células de 3px.
 * Com prefers-reduced-motion, um único quadro estático.
 */

const CELL = DITHER_CELL;
const FRAME_MS = 42;
/** Raio da esfera, em fração da altura do canvas (o resto é o halo). */
const R = 0.42;
/** Espessura de meridianos e paralelos: mais finos que no site, porque o
 *  globo aqui é bem maior e as linhas cresceriam junto. */
const LINE_M = 0.0009;
const LINE_P = 0.0013;

export function DitherOrb({ className }: { className?: string }) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const c = ref.current;
    const ctx = c?.getContext("2d");
    if (!c || !ctx) return;

    const reduce =
      window.matchMedia?.("(prefers-reduced-motion: reduce)").matches ?? false;
    const B = bayer8();
    const ON = packRgba(readInk(c));

    let w = 0,
      h = 0;
    let img: ImageData, buf: Uint32Array;
    let nxA: Float32Array,
      nyA: Float32Array,
      nzA: Float32Array,
      halo: Float32Array,
      inside: Uint8Array;

    // Campos que não dependem do tempo: normal da esfera e halo da borda.
    const pre = () => {
      const N = w * h,
        a = w / h,
        px = 1 / h;
      nxA = new Float32Array(N);
      nyA = new Float32Array(N);
      nzA = new Float32Array(N);
      halo = new Float32Array(N);
      inside = new Uint8Array(N);
      const cx = 0.5 * a,
        cy = 0.5,
        hr2 = 2 * (2.5 * px) ** 2;
      for (let j = 0; j < h; j++)
        for (let i = 0; i < w; i++) {
          const k = j * w + i;
          const nx = ((i + 0.5) / h - cx) / R,
            ny = ((j + 0.5) / h - cy) / R,
            rr = nx * nx + ny * ny;
          if (rr < 1) {
            inside[k] = 1;
            nxA[k] = nx;
            nyA[k] = ny;
            nzA[k] = Math.sqrt(1 - rr);
          }
          const dr = (Math.sqrt(rr) - 1) * R;
          // Sem o piso de 0.015 do site: aqui não há painel em volta, e o piso
          // desenharia um quadrado de pontos ao redor do globo.
          halo[k] = Math.exp(-(dr * dr) / hr2) * 0.4;
        }
    };

    // Luz: gira sozinha e é puxada na direção do cursor (suavizado).
    const pull = { x: 0, y: 0, tx: 0, ty: 0 };

    const draw = (T: number) => {
      pull.x += (pull.tx - pull.x) * 0.08;
      pull.y += (pull.ty - pull.y) * 0.08;
      let Lx =
        Math.cos(T * 0.35) * 0.75 * (1 - Math.abs(pull.x) * 0.6) + pull.x * 0.9;
      let Ly = -0.45 + pull.y * 0.7;
      let Lz = 0.55 + 0.25 * Math.sin(T * 0.35);
      const L = Math.hypot(Lx, Ly, Lz);
      Lx /= L;
      Ly /= L;
      Lz /= L;
      const rot = T * 0.05;
      for (let j = 0; j < h; j++) {
        const row = (j & 7) << 3;
        for (let i = 0; i < w; i++) {
          const k = j * w + i;
          let v = halo[k];
          if (inside[k]) {
            const nx = nxA[k],
              ny = nyA[k],
              nz = nzA[k];
            const d = nx * Lx + ny * Ly + nz * Lz;
            v = 0.04 + (d > 0 ? d : 0) * 0.8;
            let q = (Math.atan2(nx, nz) / 6.283) * 8 + rot;
            q -= Math.floor(q);
            const e = q < 0.5 ? q : 1 - q;
            v += Math.exp((-e * e) / LINE_M) * 0.3 * nz;
            let p = (Math.asin(ny) / 3.1416 + 0.5) * 6;
            p -= Math.floor(p);
            const g = p < 0.5 ? p : 1 - p;
            v += Math.exp((-g * g) / LINE_P) * 0.22 * nz;
          }
          buf[k] = v > B[row + (i & 7)] ? ON : 0;
        }
      }
      ctx.putImageData(img, 0, 0);
    };

    const size = () => {
      const nw = Math.max(8, Math.round(c.clientWidth / CELL));
      const nh = Math.max(8, Math.round(c.clientHeight / CELL));
      if (nw === w && nh === h) return;
      w = nw;
      h = nh;
      c.width = w;
      c.height = h;
      img = ctx.createImageData(w, h);
      buf = new Uint32Array(img.data.buffer);
      pre();
      draw(performance.now() / 1000);
    };
    const ro = new ResizeObserver(size);
    ro.observe(c);
    size();

    const onPointer = (e: PointerEvent) => {
      const r = c.getBoundingClientRect();
      // −1 a 1 em relação ao centro do globo, limitado.
      pull.tx = Math.max(
        -1,
        Math.min(1, (e.clientX - (r.left + r.width / 2)) / (r.width * 0.8))
      );
      pull.ty = Math.max(
        -1,
        Math.min(1, (e.clientY - (r.top + r.height / 2)) / (r.height * 0.8))
      );
    };

    let raf = 0;
    if (!reduce) {
      let last = 0;
      const loop = (now: number) => {
        raf = requestAnimationFrame(loop);
        if (now - last < FRAME_MS || document.hidden) return;
        last = now;
        draw(now / 1000);
      };
      raf = requestAnimationFrame(loop);
      addEventListener("pointermove", onPointer, { passive: true });
    }

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      removeEventListener("pointermove", onPointer);
    };
  }, []);

  return <canvas ref={ref} className={className} aria-hidden="true" />;
}
