# Portal de Benefícios — tour gravado (arquivado)

Uma versão funcional e finalizada da prévia da seção de soluções como um
**tour gravado do portal em produção**, em vez de uma imagem estática. Foi
arquivada porque o projeto ainda não está pronto para publicá-la, não porque
há algo quebrado — sua reprodução foi verificada no Chrome, WebKit e em 390px,
com e sem `prefers-reduced-motion`.

Nada nesta pasta é referenciado pela aplicação ou copiado para `dist`.

## O que há aqui

| Arquivo | O que é |
| --- | --- |
| `record-portal-tour.mjs` | Grava o tour no portal em produção e faz a conversão. |
| `portal-tour-pt.mp4` | A gravação produzida (H.264, 1280×980, 19s, 923KB). |
| `portal-tour-pt-poster.jpg` | Primeiro quadro, usado como `<video poster>`. |
| `portal-screen-video.tsx` | O componente que o reproduzia. |
| `portal-screen-video.css` | Estilos do controle de reprodução/pausa. |

## O tour

Início → o cursor vai até "Acessar Benefícios" e clica → catálogo → digita
"periódicos" no filtro, e a lista é reduzida ao vivo a dois resultados → passa
o mouse sobre um card → abre sua página de detalhes → rola → volta ao início,
para que a emenda do loop seja suave.

O gravador do Playwright não desenha o cursor, então o script injeta um que
acompanha o mouse real — os hovers no vídeo são genuínos, não simulados.

## Como reativá-lo

1. `mv portal-tour-pt.mp4 portal-tour-pt-poster.jpg ../../public/media/`
   (o poster deve se chamar `portal-tour-pt.jpg`).
2. Replace `src/components/home/demos/product-screen.tsx` with
   `portal-screen-video.tsx` (e direcione apenas o card do Portal de Benefícios
   para ele — o card do Sistema de Gestão agora compartilha esse componente).
3. Paste `portal-screen-video.css` back into `src/styles/global.css`,
   after the `.t-screen-stage` rules.
4. Readicione as chaves `portalDemo.play` / `portalDemo.pause` aos dois
   arquivos de locale e aponte o texto alternativo do componente para
   `screens.benefits.alt` — `portalDemo.alt` foi renomeada quando a tela de
   gestão foi incorporada.

A moldura da janela (`.t-screen-frame`, `.t-screen-bar`, `.t-screen-stage`)
permaneceu em `global.css` — a imagem estática também a utiliza — e a imagem
é capturada no mesmo 1280×980, então trocar uma pela outra não tem
consequências no layout.

## Como gravar novamente

```
npm i --no-save playwright ffmpeg-static
node scripts/portal-tour/record-portal-tour.mjs
```

Vale fazer isso antes de qualquer lançamento real: o portal é um **testbed**,
então seu catálogo terá mudado. Duas coisas para observar no próximo conteúdo
capturado —

- Os chips de filtro do catálogo são renderizados em inglês na página em
  português ("Students (9)", "Teaching & Learning (8)"), assim como os badges
  de categoria dos cards. Isso é uma lacuna nas traduções do próprio portal, e
  uma gravação levaria esse problema para a landing page.
- Existe uma entrada de placeholder chamada "Biblioteca Fictícia". O script
  procura por "periódicos" em parte para mantê-la fora do quadro.

## Duas coisas que custam tempo e vale registrar

**H.264, nunca WebM.** O gravador do Playwright emite WebM/VP8. Ele funciona
no Chrome e no WebKit do Playwright — mas o WebKit do Playwright não é o
Safari e tem sua própria pilha de mídia, então isso não é evidência sobre o
Safari. No Safari real, o arquivo nunca carregou: sem autoplay, o botão de
reprodução também não fazia nada, porque não havia nada decodificado para
reproduzir. Agora o script converte para H.264, que também ocupa menos da
metade do tamanho.

**O ffmpeg incluído não consegue fazer isso.** O Playwright distribui um
ffmpeg compilado com `--disable-everything`, com libvpx e sem qualquer
codificador H.264. Por isso a dependência `ffmpeg-static`, instalada com
`--no-save` para nunca entrar em `package.json`.
