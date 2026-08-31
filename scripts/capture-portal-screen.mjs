/**
 * Captura a imagem estática do catálogo do Portal de Benefícios usada na
 * seção de soluções.
 *
 *   npm i --no-save playwright
 *   node scripts/capture-portal-screen.mjs
 *
 * Grava public/media/screen-benefits-pt.jpg. Execute novamente sempre que o
 * portal mudar — ele é um testbed, então o catálogo também mudará.
 *
 * 1280x980 de propósito: esse é o formato da janela de prévia na coluna
 * fixada (~1,3:1), então a imagem preenche o espaço quase sem cortes. É
 * também o formato usado pelo tour gravado em scripts/portal-tour/ — manter
 * ambos iguais permite trocar um pelo outro sem consequências no layout.
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
  // 1x: a imagem é exibida em uma caixa de 685px, então 1280 já fornece
  // ~1,9x. Capturar em 2x quadruplicou os bytes por um nível de detalhe que
  // nenhuma tela consegue resolver nesse tamanho.
  locale: 'pt-BR',
});
const page = await ctx.newPage();
await page.goto(`${BASE}/benefits`, { waitUntil: 'networkidle', timeout: 45000 });

// O badge é fixo no canto inferior direito e apareceria no canto da moldura;
// a barra de rolagem pareceria parte da moldura da nossa janela.
await page.addStyleTag({
  content: '.grecaptcha-badge{display:none !important} ::-webkit-scrollbar{display:none}',
});
// As imagens dos cards usam carregamento tardio: deixe-as estabilizar antes
// da captura.
await page.evaluate(() => window.scrollTo(0, 400));
await page.waitForTimeout(1200);
await page.evaluate(() => window.scrollTo(0, 0));
await page.waitForTimeout(1500);

fs.mkdirSync(path.dirname(OUT), { recursive: true });
await page.screenshot({ path: OUT, type: 'jpeg', quality: 86 });
await browser.close();

console.log(`${OUT} ${Math.round(fs.statSync(OUT).size / 1024)}KB`);
