# gt-baita.github.io

Para executar localmente:

```
npm install
```

```
npm run dev
```

Lembre de primeiro, declarar as variáveis de ambiente (arquivo `.env`)

## Apresentação da proposta do IdP SaaS

A apresentação está integrada ao mesmo projeto e build, sem links no menu,
cabeçalho ou rodapé do site. Ela pode ser acessada pelo FAQ de `/idp-saas`
ou diretamente pela URL. Como o site usa `HashRouter` no GitHub Pages,
acesse `/#/idp-proposal` (localmente: `http://localhost:5173/#/idp-proposal`).

Cada tela também tem um link direto, como `/#/idp-proposal/team` ou
`/#/idp-proposal/login`. As telas disponíveis são `team`, `problem`, `solution`,
`benefits`, `architecture`, `login`, `users`, `metrics`, `process` e `faq`.
Uma tela desconhecida retorna à capa. Os nomes anteriores em português
continuam aceitos e são redirecionados para a URL em inglês.

Use as setas do teclado ou PageUp/PageDown para navegar, Home/End para ir
ao início/fim, S para ocultar as abas e F para alternar a tela cheia.
No celular, use o índice ou deslize para os lados.

O código fica em `src/features/idp-proposal`, a página de entrada em
`src/pages/idp-proposal.tsx` e as imagens em `public/idp-proposal`. Os estilos são
limitados à apresentação e ela é carregada apenas quando sua URL é acessada.

A apresentação usa o i18next e a preferência de idioma do site. O seletor
PT/EN troca o idioma sem sair do slide. Textos, rótulos de acessibilidade e
metadados ficam nos arquivos `src/locale/pt-translation.json` e
`src/locale/en-translation.json`, sob o prefixo `proposal.`.
