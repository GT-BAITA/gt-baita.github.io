import { Button } from '@/components/ui/button';
import { useEffect, useRef } from 'react';
import { LanguageToggle } from './language-toggle';
import { useTranslation } from 'react-i18next';

type CustomHrefProps = {
  href: string;
  children: React.ReactNode;
  className?: string;
  offset?: number;
};

export function CustomHref({
  href,
  children,
  className = '',
  offset = -100,
}: CustomHrefProps) {
  const handleScroll = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    scrollToSection(href, offset);
  };

  return (
    <a
      href={href}
      onClick={handleScroll}
      className={`text-neutral-700 hover:text-neutral-900 transition-all duration-300 ease-in-out font-geist hover:scale-[1.05] ${className}`}
    >
      {children}
    </a>
  );
}

function scrollToSection(href: string, offset = -100) {
  const section = document.querySelector(href);
  if (section) {
    const y = section.getBoundingClientRect().top + window.pageYOffset + offset;
    window.scrollTo({ top: y, behavior: 'smooth' });
    window.history.pushState(null, '', href);
  }
}

function ScrollToSectionOnLoad() {
  useEffect(() => {
    const hash = window.location.hash;
    if (hash) scrollToSection(hash);
  }, []);
  return null;
}

export function Header() {
  const { t } = useTranslation();
  const navRef = useRef<HTMLDivElement | null>(null);

  return (
    <>
      <ScrollToSectionOnLoad />
      <header className="fixed top-7 left-1/2 -translate-x-1/2 z-50 w-full max-w-[1264px] px-4">
        <nav
          ref={navRef}
          className="flex items-center justify-between px-12 py-4 rounded-3xl bg-white/50 backdrop-blur-sm transition-all duration-300 ease-in-out hover:bg-white/70"
        >
          <div className="flex items-center gap-12">
            <h1
              onClick={(e) => {
                e.preventDefault();
                scrollToSection('#init');
              }}
              className="text-2xl font-bold font-domine text-neutral-900 transition-all duration-300 hover:opacity-90 cursor-pointer"
            >
              {t('header.brand')}
            </h1>

            <div className="hidden md:flex items-center gap-6">
              <CustomHref href="#sobre">{t('header.nav-1')}</CustomHref>
              <CustomHref href="#roadmap">{t('header.nav-2')}</CustomHref>
              <CustomHref href="#equipe">{t('header.nav-3')}</CustomHref>
              <CustomHref href="#faq">{t('header.nav-4')}</CustomHref>
              <LanguageToggle />
            </div>
          </div>

          <Button
            onClick={(e) => {
              e.preventDefault();
              scrollToSection('#newsletter');
            }}
            className="bg-neutral-900 text-white rounded-lg font-geist transition-all duration-300 ease-in-out hover:bg-neutral-800 hover:shadow-lg"
          >
            {t('header.cta')}
          </Button>
        </nav>
      </header>
    </>
  );
}
