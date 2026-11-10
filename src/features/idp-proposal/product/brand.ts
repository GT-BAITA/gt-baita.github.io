/**
 * Identidades fictícias compartilhadas pelas demonstrações do produto.
 * Os nomes de exibição da instituição vêm dos arquivos de tradução.
 */
export const EXAMPLE_INSTITUTION = {
  short: "UF",
  domain: "uf.edu.br",
};

/** Quem administra o console no protótipo. */
export const EXAMPLE_ADMINISTRATOR = {
  name: "Maria Rocha",
  avatar: "/idp-proposal/product/admin.png",
};

/** A pessoa que faz login no fluxo de exemplo. */
export const EXAMPLE_USER = {
  first: "Ana",
  last: "Souza",
  user: "ana.souza",
  email: `ana.souza@${EXAMPLE_INSTITUTION.domain}`,
};
