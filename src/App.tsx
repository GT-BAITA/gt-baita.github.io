import { Component, Suspense, type ReactNode } from "react";
import { Routes, Route, Outlet, useLocation } from "react-router-dom";
import NotFound from "./pages/not-found";
import { Layout } from "./components/layout/layout";
import RandomRedirect from "./pages/redirect";
import { AboutPage, Home, IdpSaasPage, PrivacyPage, usePreloadPages } from "./lib/lazy-pages";

/** Quando a página foi recarregada pela última vez por falha de módulo. */
const RELOADED_AT = "page-module-reload";

/**
 * Se o pedaço de uma página não chega — deploy novo apagou os arquivos com
 * o hash antigo, ou a rede caiu —, recarrega uma vez para buscar a versão
 * atual, em vez de deixar o site em branco. Outros erros (e uma segunda
 * falha seguida) ficam contidos aqui: cabeçalho e rodapé seguem de pé.
 */
class PageErrorBoundary extends Component<{ children: ReactNode }, { failed: boolean }> {
  state = { failed: false };

  static getDerivedStateFromError() {
    return { failed: true };
  }

  componentDidCatch(error: unknown) {
    const missingModule = /dynamically imported module|module script failed/i.test(String(error));
    if (!missingModule) return;
    try {
      if (Date.now() - Number(sessionStorage.getItem(RELOADED_AT)) < 10_000) return;
      sessionStorage.setItem(RELOADED_AT, String(Date.now()));
    } catch {
      return; // Sem sessionStorage, não há como evitar recarregar em laço.
    }
    window.location.reload();
  }

  render() {
    return this.state.failed ? <div className="min-h-screen" /> : this.props.children;
  }
}

function App() {
  usePreloadPages();
  const { pathname } = useLocation();
  return (
    <Routes>
      <Route
        element={
          <Layout>
            {/* Enquanto o pedaço da página chega, a altura de uma tela
                segura o rodapé lá embaixo. A chave zera o erro ao trocar
                de rota. */}
            <PageErrorBoundary key={pathname}>
              <Suspense fallback={<div className="min-h-screen" />}>
                <Outlet />
              </Suspense>
            </PageErrorBoundary>
          </Layout>
        }
      >
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/privacy" element={<PrivacyPage />} />
        {/* Mesmo chassi, modo escuro: ver src/lib/route-theme.ts. */}
        <Route path="/idp-saas" element={<IdpSaasPage />} />
        <Route path="/wayf-ux-test" element={<RandomRedirect />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}

export default App;
