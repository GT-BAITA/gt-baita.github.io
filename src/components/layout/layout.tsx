import { Footer } from "./components/footer";
import { Header } from "./components/header";
import { ClarityNotice } from "./components/clarity-notice";
import { useSmoothScroll } from "@/hooks/useSmoothScroll";

export function Layout({ children }: { children: React.ReactNode }) {
  useSmoothScroll();

  return (
    <div>
      {/* Both of these are position: fixed, so they stay outside the
          smooth wrapper — inside it they would resolve against the
          transformed content and scroll away with the page. */}
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
