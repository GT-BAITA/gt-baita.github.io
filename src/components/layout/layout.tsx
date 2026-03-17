import { useLocation } from 'react-router-dom';
import { LGPDSection } from '../sections/lgpd';
import { NewsletterSection } from '../sections/newsletter-section';
import { Header } from './header';

export function Layout({ children }: { children: React.ReactNode }) {
  const { pathname } = useLocation();

  const isHomePage = pathname === '/';

  return (
    <div>
      <div className="min-h-screen max-w-[1264px] mx-auto px-4 pb-3.5">
        <Header />
        {children}
      </div>
      {isHomePage ? (<>
        <NewsletterSection />
        <LGPDSection />
      </>) : <></>}
    </div>
  );
}
