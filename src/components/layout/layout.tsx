import { Footer } from "./components/footer";
import { Header } from "./components/header";
import { ClarityNotice } from "./components/clarity-notice";
import { useSmoothScroll } from "@/hooks/useSmoothScroll";

export function Layout({ children }: { children: React.ReactNode }) {
  useSmoothScroll();

  return (
    <div>
      {/* Ambos usam position: fixed, então ficam fora do wrapper suave —
          dentro dele, resolveriam em relação ao conteúdo transformado e
          sairiam da tela junto com a página. */}
      <ClarityNotice />
      <Header />

      <div id="smooth-wrapper">
        <div id="smooth-content">
          <div className="min-h-screen max-w-[1264px] mx-auto px-4 pb-3.5">
            {children}
          </div>
          <Footer />
        </div>
      </div>
    </div>
  );
}
