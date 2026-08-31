/**
 * Records the Portal de Benefícios tour used by the solutions section.
 *
 *   npm i --no-save playwright ffmpeg-static
 *   node scripts/record-portal-tour.mjs
 *
 * Writes public/media/portal-tour-pt.webm and its poster frame. Re-run
 * it whenever the portal changes — it is a testbed, so its catalogue
 * will. Needs Playwright and a local Chrome; nothing here is a build
 * dependency, so it is deliberately not wired into npm scripts.
 *
 * The recorder only emits WebM/VP8, which real Safari would not play,
 * so the WebM is transcoded to H.264 MP4 and thrown away. That needs a
 * full ffmpeg — the one bundled with Playwright is built
 * --disable-everything and has no H.264 encoder — hence ffmpeg-static.
 */
import { chromium } from 'playwright';
import fs from 'fs';
import path from 'path';
import { execFileSync } from 'child_process';
import ffmpeg from 'ffmpeg-static';

const BASE = 'https://servicos.baita.testbeds.rnp.br';
const OUT_TMP = 'scripts/.rec';
const OUT_WEBM = 'scripts/.rec/tour.webm';
const OUT_VIDEO = 'public/media/portal-tour-pt.mp4';
const OUT_POSTER = 'public/media/portal-tour-pt.jpg';
/**
 * Recorded taller than a laptop window on purpose. The preview is a
 * fixed 685px column whose height follows the cards beside it, which
 * lands around 1.3:1 — a 16:10 capture into that box has to give up a
 * quarter of its width. At 1280x980 the capture already has the box's
 * shape, so almost nothing is cropped.
 */
const W = 1280, H = 980;

// Playwright's recorder does not draw a cursor, so the page draws its own:
// it follows the real mouse, which means hovers in the video are genuine.
const CURSOR = `
(() => {
  const draw = () => {
    if (document.getElementById('__rec_cursor')) return;
    const el = document.createElement('div');
    el.id = '__rec_cursor';
    el.style.cssText = 'position:fixed;left:0;top:0;z-index:2147483647;pointer-events:none;transform:translate(-100px,-100px);will-change:transform';
    el.innerHTML = '<svg width="24" height="26" viewBox="0 0 20 22" fill="none" style="display:block;filter:drop-shadow(0 2px 5px rgba(0,0,0,.35))"><path d="M2 1.5 L2 18.2 L6.4 14.1 L9.2 20.4 L12.1 19.1 L9.4 12.9 L15.3 12.6 Z" fill="#111" stroke="#fff" stroke-width="1.5" stroke-linejoin="round"/></svg><span id="__rec_ring" style="position:absolute;left:2px;top:2px;width:34px;height:34px;margin:-17px 0 0 -17px;border:2px solid rgba(17,17,17,.5);border-radius:999px;opacity:0;transform:scale(.2)"></span>';
    document.documentElement.appendChild(el);
    addEventListener('mousemove', e => { el.style.transform = 'translate(' + e.clientX + 'px,' + e.clientY + 'px)'; }, true);
    addEventListener('mousedown', () => {
      const r = document.getElementById('__rec_ring');
      r.style.transition = 'none'; r.style.opacity = '.6'; r.style.transform = 'scale(.2)';
      requestAnimationFrame(() => { r.style.transition = 'all 420ms cubic-bezier(.22,1,.36,1)'; r.style.opacity = '0'; r.style.transform = 'scale(1)'; });
    }, true);
    // The badge is fixed bottom-right and would sit in every frame.
    const s = document.createElement('style');
    s.textContent = '.grecaptcha-badge{display:none !important}';
    document.head.appendChild(s);
  };
  if (document.readyState === 'loading') addEventListener('DOMContentLoaded', draw); else draw();
})();`;

const browser = await chromium.launch({ channel: 'chrome' });
const ctx = await browser.newContext({
  viewport: { width: W, height: H },
  locale: 'pt-BR',
  recordVideo: { dir: OUT_TMP, size: { width: W, height: H } },
  reducedMotion: 'no-preference',
});
await ctx.addInitScript(CURSOR);
const page = await ctx.newPage();

const wait = (ms) => page.waitForTimeout(ms);
const glide = async (x, y, ms = 900) => {
  await page.mouse.move(x, y, { steps: Math.max(12, Math.round(ms / 16)) });
};
const smoothScroll = async (top) => page.evaluate(t => window.scrollTo({ top: t, behavior: 'smooth' }), top);

await page.goto(BASE, { waitUntil: 'networkidle' });
await wait(1000);

// 1 — the hero call to action (the header has one too; take the lower one)
const heroCta = await page.evaluateHandle(() => {
  const all = Array.from(document.querySelectorAll('a,button')).filter(e => /Acessar Benef/i.test(e.textContent || ''));
  return all.find(e => e.getBoundingClientRect().top > 250) || all[0];
});
const cta = await heroCta.asElement().boundingBox();
await page.mouse.move(640, 780);
await glide(Math.round(cta.x + cta.width / 2), Math.round(cta.y + cta.height / 2), 1000);
await wait(800);
await page.mouse.down(); await wait(90); await page.mouse.up();

// 2 — the catalogue
await page.waitForURL('**/benefits**', { timeout: 20000 }).catch(() => {});
await page.waitForLoadState('networkidle').catch(() => {});
await wait(1300);

// 3 — filter it by typing
const filter = await page.$('input[placeholder="Buscar..."]');
if (filter) {
  const fb = await filter.boundingBox();
  await glide(Math.round(fb.x + fb.width / 2), Math.round(fb.y + fb.height / 2), 800);
  await wait(350);
  await page.mouse.down(); await wait(80); await page.mouse.up();
  await page.keyboard.type('periódicos', { delay: 120 });
  await wait(1600);
}

// 4 — hover a result, then open it
const card = await page.$('a[href*="/benefits/details"]');
if (card) {
  const cb = await card.boundingBox();
  await glide(Math.round(cb.x + cb.width / 2), Math.round(cb.y + 120), 900);
  await wait(1100);
  await page.mouse.down(); await wait(90); await page.mouse.up();
  await page.waitForLoadState('networkidle').catch(() => {});
  await wait(1600);
  await smoothScroll(320);
  await wait(1400);
}

// 5 — back to where it started, so the loop seam is soft
await smoothScroll(0);
await wait(700);
await page.goto(BASE, { waitUntil: 'networkidle' });
await page.mouse.move(640, 640);
await wait(1200);

const video = page.video();
await ctx.close();
const raw = await video.path();
fs.mkdirSync(path.dirname(OUT_VIDEO), { recursive: true });
fs.renameSync(raw, OUT_WEBM);

// -an: the capture is silent, and an empty audio track only gives some
// browsers a reason to treat the element as needing a user gesture.
// +faststart puts the index first so playback can begin while it loads.
execFileSync(ffmpeg, [
  '-y', '-hide_banner', '-loglevel', 'error',
  '-i', OUT_WEBM,
  '-c:v', 'libx264', '-profile:v', 'high', '-level', '4.0',
  '-pix_fmt', 'yuv420p', '-crf', '26', '-preset', 'slow',
  '-movflags', '+faststart', '-an',
  OUT_VIDEO,
]);

// The poster is the recording's own first frame, so the still and the
// video can never show different framing.
const poster = await browser.newPage({ viewport: { width: W + 20, height: H + 30 } });
const b64 = fs.readFileSync(OUT_VIDEO).toString('base64');
await poster.setContent(
  `<body style="margin:0"><video id="v" src="data:video/mp4;base64,${b64}" style="width:${W}px;display:block" muted></video></body>`
);
await poster.waitForFunction(() => document.getElementById('v').readyState >= 2, null, { timeout: 30000 });
await poster.evaluate(() => { document.getElementById('v').currentTime = 0.35; });
await poster.waitForTimeout(900);
await poster.locator('#v').screenshot({ path: OUT_POSTER, type: 'jpeg', quality: 82 });
await browser.close();
fs.rmSync(OUT_TMP, { recursive: true, force: true });

const kb = (f) => Math.round(fs.statSync(f).size / 1024);
console.log(`${OUT_VIDEO} ${kb(OUT_VIDEO)}KB · ${OUT_POSTER} ${kb(OUT_POSTER)}KB`);
