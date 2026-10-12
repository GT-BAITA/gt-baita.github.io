/**
 * Base comum dos gráficos pontilhados do site (hero da página inicial,
 * hero e painéis do IdP): a mesma matriz de Bayer e a mesma cor de pixel,
 * para que todos tenham o mesmo "grão" nos dois modos.
 */

/** Tamanho da célula, em px CSS: cada pixel do canvas vira um quadrado de 3px. */
export const DITHER_CELL = 3;

/** Limiar de Bayer 8×8 normalizado (0–1), indexado por (y & 7) << 3 | (x & 7). */
export function bayer8(): Float32Array {
  const b = [0, 2, 3, 1];
  let M = [0];
  let n = 1;
  while (n < 8) {
    const N2 = n * 2;
    const R = new Array<number>(N2 * N2);
    for (let y = 0; y < N2; y++)
      for (let x = 0; x < N2; x++)
        R[y * N2 + x] = 4 * M[(y % n) * n + (x % n)] + b[(y >= n ? 2 : 0) + (x >= n ? 1 : 0)];
    M = R;
    n = N2;
  }
  return new Float32Array(M.map((v) => (v + 0.5) / 64));
}

export type Rgba = [number, number, number, number];

// Cor do mock (#EEEBE4, alfa ~0.91) caso os tokens não possam ser lidos.
const FALLBACK: Rgba = [238, 235, 228, 232];

/**
 * Cor do pixel "aceso" a partir dos tokens --ink e --dither-alpha do
 * elemento: claro sobre o modo escuro, escuro (e mais transparente) sobre
 * o claro.
 */
export function readInk(el: Element): Rgba {
  const css = getComputedStyle(el);
  const m = /^#([0-9a-f]{2})([0-9a-f]{2})([0-9a-f]{2})$/i.exec(
    css.getPropertyValue("--ink").trim()
  );
  if (!m) return FALLBACK;
  const alpha = parseFloat(css.getPropertyValue("--dither-alpha")) || 0.91;
  return [parseInt(m[1], 16), parseInt(m[2], 16), parseInt(m[3], 16), Math.round(alpha * 255)];
}

export function mixRgba(a: Rgba, b: Rgba, t: number): Rgba {
  return [0, 1, 2, 3].map((i) =>
    Math.min(255, Math.max(0, Math.round(a[i] + (b[i] - a[i]) * t)))
  ) as Rgba;
}

/** Empacota para um Uint32Array sobre ImageData (little-endian: A B G R). */
export function packRgba([r, g, b, a]: Rgba): number {
  return ((a << 24) | (b << 16) | (g << 8) | r) >>> 0;
}
