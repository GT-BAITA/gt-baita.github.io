import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTrigger,
} from '@/components/ui/sheet';
import { Menu } from 'lucide-react';
import { useEffect, useRef } from 'react';
import { LanguageToggle } from './language-toggle';
import { useTranslation } from 'react-i18next';

type NavItem = {
  href: string;
  label: string;
};

type CustomHrefProps = {
  href: string;
  className?: string;
  children: React.ReactNode;
  offset?: number;
};

export function CustomHref({
  href,
  className = '',
  children,
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
      className={`text-neutral-700 hover:text-neutral-900 transition-all duration-300 font-geist hover:scale-[1.05] ${className}`}
    >
      {children}
    </a>
  );
}

function scrollToSection(href: string, offset = -100) {
  const el = document.querySelector(href);
  if (!el) return;

  const y = el.getBoundingClientRect().top + window.pageYOffset + offset;
  window.scrollTo({ top: y, behavior: 'smooth' });
  window.history.pushState(null, '', href);
}

function ScrollToSectionOnLoad() {
  useEffect(() => {
    const hash = window.location.hash;
    if (hash) scrollToSection(hash);
  }, []);
  return null;
}

function NavLinks({ items }: { items: NavItem[] }) {
  return (
    <>
      {items.map((item) => (
        <CustomHref key={item.href} href={item.href}>
          {item.label}
        </CustomHref>
      ))}
    </>
  );
}

export function Header() {
  const { t } = useTranslation();
  const navRef = useRef<HTMLDivElement | null>(null);

  const navItems: NavItem[] = [
    { href: '#sobre', label: t('header.nav-1') },
    { href: '#roadmap', label: t('header.nav-2') },
    { href: '#equipe', label: t('header.nav-3') },
    { href: '#faq', label: t('header.nav-4') },
  ];

  const CTAButton = (
    <Button
      onClick={(e) => {
        e.preventDefault();
        scrollToSection('#newsletter');
      }}
      className="bg-neutral-900 text-white rounded-lg font-geist transition-all duration-300 hover:bg-neutral-800 hover:shadow-lg"
    >
      {t('header.cta')}
    </Button>
  );

  const Brand = (
    <h1
      onClick={(e) => {
        e.preventDefault();
        scrollToSection('#init');
      }}
      className="text-2xl font-bold font-domine text-neutral-900 transition hover:opacity-90 cursor-pointer"
    >
      {t('header.brand')}
    </h1>
  );
  return (
    <>
      <ScrollToSectionOnLoad />

      <header className="fixed top-7 left-1/2 -translate-x-1/2 z-50 w-full max-w-[1264px] px-4">
        <nav
          ref={navRef}
          className="flex items-center justify-between px-12 py-4 rounded-3xl bg-white/50 backdrop-blur-sm transition-all duration-300 hover:bg-white/70"
        >
          <div className="flex items-center gap-12">
            {Brand}
            <div className="hidden md:flex items-center gap-6">
              <NavLinks items={navItems} />
              <LanguageToggle />
            </div>
          </div>

          <div className="hidden md:block">{CTAButton}</div>

          <div className="md:hidden">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" className="p-2">
                  <Menu className="h-6 w-6" />
                </Button>
              </SheetTrigger>

              <SheetContent side="right" className="px-6 py-10">
                <SheetHeader>
                  <div className="mb-8">{Brand}</div>
                </SheetHeader>

                <div className="flex flex-col gap-6 text-lg font-geist">
                  <NavLinks items={navItems} />
                  <LanguageToggle />
                  <div className="mt-2">{CTAButton}</div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </nav>
      </header>
    </>
  );
}
