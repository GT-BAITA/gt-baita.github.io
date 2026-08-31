/**
 * Captures the still of the Portal de Benefícios catalogue used by the
 * solutions section.
 *
 *   npm i --no-save playwright
 *   node scripts/capture-portal-screen.mjs
 *
 * Writes public/media/screen-benefits-pt.jpg. Re-run it whenever the
 * portal changes — it is a testbed, so its catalogue will.
 *
 * 1280x980 on purpose: that is the shape the preview window takes in
 * the pinned column (~1.3:1), so the still fills it with almost
 * nothing cropped. It is also the shape the recorded tour used, in
 * scripts/portal-tour/ — keeping them equal means swapping one for the
 * other is a one-line change with no layout consequences.
 */
import { chromium } from 'playwright';
import fs from 'fs';
import path from 'path';

const BASE = 'https://servicos.baita.testbeds.rnp.br';
const OUT = 'public/media/screen-benefits-pt.jpg';
const W = 1280, H = 980;

const browser = await chromium.launch();
const ctx = await browser.newContext({
  viewport: { width: W, height: H },
  // 1x: the still is shown in a 685px box, so 1280 already gives it
  // ~1.9x. Capturing at 2x quadrupled the bytes for detail no display
  // resolves at that size.
  locale: 'pt-BR',
});
const page = await ctx.newPage();
await page.goto(`${BASE}/benefits`, { waitUntil: 'networkidle', timeout: 45000 });

// The badge is fixed bottom-right and would sit in the corner of the
// frame; the scrollbar would read as part of our own window chrome.
await page.addStyleTag({
  content: '.grecaptcha-badge{display:none !important} ::-webkit-scrollbar{display:none}',
});
// Card images are lazy: let them settle before the shutter.
await page.evaluate(() => window.scrollTo(0, 400));
await page.waitForTimeout(1200);
await page.evaluate(() => window.scrollTo(0, 0));
await page.waitForTimeout(1500);

fs.mkdirSync(path.dirname(OUT), { recursive: true });
await page.screenshot({ path: OUT, type: 'jpeg', quality: 86 });
await browser.close();

console.log(`${OUT} ${Math.round(fs.statSync(OUT).size / 1024)}KB`);
