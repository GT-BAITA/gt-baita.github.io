import { LGPDSection } from "./components/lgpd";
import { NewsletterSection } from "./components/newsletter-section";
import { Header } from "./components/header";

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <div className="min-h-screen max-w-[1264px] mx-auto px-4 pb-3.5">
        <Header />
        {children}
      </div>
      <NewsletterSection />
      <LGPDSection />
    </div>
  );
}
