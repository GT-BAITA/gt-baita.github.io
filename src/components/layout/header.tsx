import { Button } from '@/components/ui/button';
import { useRef } from 'react';

interface CustomHrefProps {
  href: string;
  children: React.ReactNode;
  className?: string;
  offset?: number;
}

export function CustomHref({ href, children, className = '', offset = -100 }: CustomHrefProps) {
  const handleScroll = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    const section = document.querySelector(href);
    if (section) {
      const y = section.getBoundingClientRect().top + window.pageYOffset + offset;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
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

export function Header() {
  const navRef = useRef<HTMLDivElement | null>(null);

  const handleScroll = (e: React.MouseEvent<HTMLElement>, id: string) => {
    e.preventDefault();
    const section = document.querySelector(id);
    if (section) {
      const yOffset = -100;
      const y = section.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  return (
    <header className="fixed top-7 left-1/2 -translate-x-1/2 z-50 w-full max-w-[1264px] px-4">
      <nav
        ref={navRef}
        className="flex items-center justify-between px-12 py-4 rounded-3xl bg-white/50 backdrop-blur-sm transition-all duration-300 ease-in-out hover:bg-white/70"
      >
        <div className="flex items-center gap-12">
          <h1
            onClick={(e) => handleScroll(e, '#init')}
            className="text-2xl font-bold font-domine text-neutral-900 transition-all duration-300 hover:opacity-90 cursor-pointer"
          >
            GTBaita
          </h1>

          <div className="hidden md:flex items-center gap-6">
            <CustomHref href="#sobre">Sobre</CustomHref>
            <CustomHref href="#roadmap">Roadmap</CustomHref>
            <CustomHref href="#equipe">Equipe</CustomHref>
            <CustomHref href="#faq">Perguntas Frequentes</CustomHref>
          </div>
        </div>

        <Button
          onClick={(e) => handleScroll(e, '#newsletter')}
          className="bg-neutral-900 text-white rounded-lg font-geist transition-all duration-300 ease-in-out hover:bg-neutral-800  hover:shadow-lg"
        >
          Inscreva-se
        </Button>
      </nav>
    </header>
  );
}
