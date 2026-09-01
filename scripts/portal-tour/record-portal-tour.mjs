/**
 * Grava o tour do Portal de Benefícios usado na seção de soluções.
 *
 *   npm i --no-save playwright ffmpeg-static
 *   node scripts/record-portal-tour.mjs
 *
 * Grava public/media/portal-tour-pt.webm e seu poster. Execute novamente
 * sempre que o portal mudar — ele é um testbed, então o catálogo também
 * mudará. Requer Playwright e um Chrome local; nada aqui é dependência de
 * build, por isso o script não está ligado aos scripts do npm.
 *
 * O gravador só emite WebM/VP8, que o Safari real não reproduz; por isso o
 * WebM é convertido para H.264 MP4 e descartado. Isso exige um ffmpeg
 * completo — o que vem com o Playwright é compilado com
 * --disable-everything e não tem codificador H.264 — daí o ffmpeg-static.
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
 * Gravado mais alto que uma janela de laptop de propósito. A prévia é uma
 * coluna fixa de 685px cuja altura acompanha os cards ao lado, chegando a
 * aproximadamente 1,3:1 — uma captura 16:10 nessa caixa teria de perder um
 * quarto da largura. Em 1280x980, a captura já tem o formato da caixa, então
 * quase nada é cortado.
 */
const W = 1280, H = 980;

// O gravador do Playwright não desenha o cursor, então a página desenha o
// próprio: ele acompanha o mouse real, tornando genuínos os hovers do vídeo.
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
    // O badge é fixo no canto inferior direito e apareceria em todos os quadros.
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

// 1 — o call to action do hero (o cabeçalho também tem um; use o inferior)
const heroCta = await page.evaluateHandle(() => {
  const all = Array.from(document.querySelectorAll('a,button')).filter(e => /Acessar Benef/i.test(e.textContent || ''));
  return all.find(e => e.getBoundingClientRect().top > 250) || all[0];
});
const cta = await heroCta.asElement().boundingBox();
await page.mouse.move(640, 780);
await glide(Math.round(cta.x + cta.width / 2), Math.round(cta.y + cta.height / 2), 1000);
await wait(800);
await page.mouse.down(); await wait(90); await page.mouse.up();

// 2 — o catálogo
await page.waitForURL('**/benefits**', { timeout: 20000 }).catch(() => {});
await page.waitForLoadState('networkidle').catch(() => {});
await wait(1300);

// 3 — filtre digitando
const filter = await page.$('input[placeholder="Buscar..."]');
if (filter) {
  const fb = await filter.boundingBox();
  await glide(Math.round(fb.x + fb.width / 2), Math.round(fb.y + fb.height / 2), 800);
  await wait(350);
  await page.mouse.down(); await wait(80); await page.mouse.up();
  await page.keyboard.type('periódicos', { delay: 120 });
  await wait(1600);
}

// 4 — passe o mouse sobre um resultado e abra-o
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

// 5 — volte ao início para que a emenda do loop seja suave
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

// -an: a captura é silenciosa, e uma faixa de áudio vazia apenas faz alguns
// navegadores tratarem o elemento como dependente de um gesto do usuário.
// +faststart coloca o índice no início para que a reprodução comece durante o
// carregamento.
execFileSync(ffmpeg, [
  '-y', '-hide_banner', '-loglevel', 'error',
  '-i', OUT_WEBM,
  '-c:v', 'libx264', '-profile:v', 'high', '-level', '4.0',
  '-pix_fmt', 'yuv420p', '-crf', '26', '-preset', 'slow',
  '-movflags', '+faststart', '-an',
  OUT_VIDEO,
]);

// O poster é o primeiro quadro da própria gravação, então a imagem estática
// e o vídeo nunca podem mostrar enquadramentos diferentes.
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
