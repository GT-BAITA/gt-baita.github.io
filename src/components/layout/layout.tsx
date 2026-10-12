import { Footer } from "./components/footer";
import { Header } from "./components/header";
import { ClarityNotice } from "./components/clarity-notice";
import { useSmoothScroll } from "@/hooks/useSmoothScroll";
import { useApplyTheme, useRouteChrome } from "@/lib/route-theme";
import { HeroBackdrop } from "@/components/shared/hero-dither";

export function Layout({ children }: { children: React.ReactNode }) {
  // Um único chassi para o site todo; o que muda por rota (tema, rolagem
  // suave, largura) vem de route-theme.ts.
  const chrome = useRouteChrome();
  useApplyTheme(chrome.theme);
  useSmoothScroll(chrome.smoothScroll);

  return (
    <div>
      {/* Ambos usam position: fixed, então ficam fora do wrapper suave —
          dentro dele, resolveriam em relação ao conteúdo transformado e
          sairiam da tela junto com a página. */}
      <ClarityNotice />
      <Header />

      <div id="smooth-wrapper">
        <div id="smooth-content" className="relative">
          {/* Um canvas para os heroes do site inteiro: as páginas só pedem a
              forma (useHeroBackdrop), e ele se transforma entre elas. */}
          <HeroBackdrop />
          {chrome.fullBleed ? (
            children
          ) : (
            <div className="min-h-screen max-w-[1264px] mx-auto px-4 pb-3.5">
              {children}
            </div>
          )}
          <Footer />
        </div>
      </div>
    </div>
  );
}
