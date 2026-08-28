import { LGPDSection } from "./components/lgpd";
import { NewsletterSection } from "./components/newsletter-section";
import { Header } from "./components/header";
import { ClarityNotice } from "./components/clarity-notice";

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <ClarityNotice />
      <div className="min-h-screen max-w-[1264px] mx-auto px-4 pb-3.5">
        <Header />
        {children}
      </div>
      <NewsletterSection />
      <LGPDSection />
    </div>
  );
}
