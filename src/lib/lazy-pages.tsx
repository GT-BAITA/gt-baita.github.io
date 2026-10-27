import { lazy, useEffect, useState, type ComponentType } from "react";

/**
 * Cada página vira um pedaço próprio do bundle: quem abre o IdP não baixa o
 * código da home, e vice-versa.
 *
 * Uma página já carregada renderiza direto, sem suspender — o que estragaria
 * a transição de tema entre rotas. O tipo do componente fica fixo durante a
 * vida da instância: trocar o `Lazy` pelo componente carregado no meio do
 * caminho faria o React desmontar e montar a página de novo.
 */
function lazyPage(load: () => Promise<ComponentType>) {
  let loaded: ComponentType | undefined;
  let pending: Promise<ComponentType> | undefined;
  const preload = () =>
    (pending ??= load()
      .then((C) => (loaded = C))
      .catch((err) => {
        // Falhou (rede, deploy novo): a próxima tentativa busca de novo.
        pending = undefined;
        throw err;
      }));
  const Lazy = lazy(() => preload().then((C) => ({ default: C })));

  function Page() {
    const [C] = useState<ComponentType>(() => loaded ?? Lazy);
    return <C />;
  }
  return Object.assign(Page, { preload });
}

export const Home = lazyPage(() => import("@/pages").then((m) => m.Home));
export const AboutPage = lazyPage(() => import("@/pages/about").then((m) => m.AboutPage));
export const PrivacyPage = lazyPage(() => import("@/pages/privacy").then((m) => m.PrivacyPage));
export const IdpSaasPage = lazyPage(() => import("@/pages/idp-saas").then((m) => m.IdpSaasPage));

const BY_PATH: Record<string, { preload: () => Promise<unknown> }> = {
  "/": Home,
  "/about": AboutPage,
  "/privacy": PrivacyPage,
  "/idp-saas": IdpSaasPage,
};

/** Carrega a página da rota, se ela for uma das divididas; nunca rejeita. */
export function preloadPath(path: string): Promise<void> {
  return Promise.resolve(BY_PATH[path]?.preload())
    .then(() => undefined)
    .catch(() => undefined);
}

/**
 * As outras páginas chegam em segundo plano, sem disputar a banda da
 * primeira visita. Numa SPA, o `load` dispara antes de o React desenhar
 * qualquer coisa; por isso, depois dele, ainda espera um intervalo e um
 * momento ocioso.
 */
const PRELOAD_DELAY_MS = 3000;

export function usePreloadPages() {
  useEffect(() => {
    let idle = 0;
    let timer = 0;
    const go = () => Object.keys(BY_PATH).forEach(preloadPath);
    const schedule = () => {
      timer = window.setTimeout(() => {
        // Safari não tem requestIdleCallback.
        if (typeof requestIdleCallback === "function") idle = requestIdleCallback(go, { timeout: 5000 });
        else go();
      }, PRELOAD_DELAY_MS);
    };
    if (document.readyState === "complete") schedule();
    else window.addEventListener("load", schedule, { once: true });
    return () => {
      window.removeEventListener("load", schedule);
      if (idle) cancelIdleCallback(idle);
      window.clearTimeout(timer);
    };
  }, []);
}
