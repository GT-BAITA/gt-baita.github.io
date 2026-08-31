import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useEffect, useRef, useState } from "react";
import { LanguageToggle } from "./language-toggle";
import { useTranslation } from "react-i18next";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { ScrollSmoother } from "gsap/ScrollSmoother";

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
  className = "",
  children,
  offset = -100,
}: CustomHrefProps) {
  const location = useLocation();
  const navigate = useNavigate();

  const handleScroll = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();

    if (location.pathname !== "/") {
      navigate(`/${href}`);
      return;
    }

    scrollToSection(href, offset);
  };

  return (
    <a
      href={href}
      onClick={handleScroll}
      className={`whitespace-nowrap text-neutral-700 hover:text-neutral-900 transition-all duration-300 font-geist hover:scale-[1.05] ${className}`}
    >
      {children}
    </a>
  );
}

function scrollToSection(href: string, offset = -100) {
  const el = document.querySelector(href);
  if (!el) return;

  const y = el.getBoundingClientRect().top + window.pageYOffset + offset;
  window.scrollTo({ top: y, behavior: "smooth" });
  window.history.pushState(null, "", href);
}

function scrollToTop() {
  const smoother = ScrollSmoother.get();
  if (smoother) {
    // Atualiza também o alvo nativo do smoother; scrollTop() sozinho pode
    // deixar o navegador apontando para a posição anterior.
    smoother.scrollTo(0, false);
    return;
  }

  window.scrollTo({ top: 0, left: 0, behavior: "auto" });
}

function ScrollToSectionOnLoad() {
  const location = useLocation();

  useEffect(() => {
    if (!location.hash) return;

    const frame = window.requestAnimationFrame(() => {
      scrollToSection(location.hash);
    });

    return () => window.cancelAnimationFrame(frame);
  }, [location.pathname, location.hash]);
  return null;
}

function NavLinks({ items }: { items: NavItem[] }) {
  return (
    <>
      {items.map((item) =>
        item.href.startsWith("#") ? (
          <CustomHref key={item.href} href={item.href}>
            {item.label}
          </CustomHref>
        ) : (
          <Link
            key={item.href}
            to={item.href}
            className="whitespace-nowrap text-neutral-700 hover:text-neutral-900 transition-all duration-300 font-geist hover:scale-[1.05]"
          >
            {item.label}
          </Link>
        )
      )}
    </>
  );
}

export function Header() {
  const { t } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();
  const navRef = useRef<HTMLDivElement | null>(null);
  const [isMobile, setIsMobile] = useState(false);
  const [isVisible, setIsVisible] = useState(true);

  // A marca já é o link para a página inicial, então "Sobre" é o único outro
  // destino do site. #roadmap / #team / #faq apontavam para seções arquivadas
  // e não levavam a lugar algum.
  const navItems: NavItem[] = [{ href: "/about", label: t("header.nav-1") }];

  const CTAButton = (
    <Button
      onClick={(e) => {
        e.preventDefault();
        if (location.pathname !== "/") {
          navigate("/#contact-form");
          return;
        }
        scrollToSection("#contact-form");
      }}
      className="shrink-0 whitespace-nowrap bg-neutral-900 px-3 text-white rounded-lg font-geist transition-all duration-300 hover:bg-neutral-800 hover:shadow-lg md:px-4"
    >
      {t("header.cta")}
    </Button>
  );

  const Brand = (
    <h1 className="whitespace-nowrap text-lg font-bold font-domine text-neutral-900 transition hover:opacity-90 cursor-pointer sm:text-xl md:text-2xl">
      <Link
        to="/"
        onClick={(e) => {
          if (location.pathname !== "/") return;
          e.preventDefault();
          scrollToTop();
        }}
      >
        {t("header.brand")}
      </Link>
    </h1>
  );

  useEffect(() => {
    const mediaQuery = window.matchMedia("(max-width: 767px)");

    const syncViewport = () => {
      const mobile = mediaQuery.matches;
      setIsMobile(mobile);

      if (!mobile) {
        setIsVisible(true);
      }
    };

    syncViewport();

    let lastScrollY = window.scrollY;
    const scrollThreshold = 12;
    const topOffset = 24;

    const handleScroll = () => {
      if (!mediaQuery.matches) {
        setIsVisible(true);
        lastScrollY = window.scrollY;
        return;
      }

      const currentScrollY = window.scrollY;
      const scrollDelta = currentScrollY - lastScrollY;

      if (Math.abs(scrollDelta) < scrollThreshold) return;

      if (currentScrollY <= topOffset) {
        setIsVisible(true);
      } else {
        setIsVisible(scrollDelta < 0);
      }

      lastScrollY = currentScrollY;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    mediaQuery.addEventListener("change", syncViewport);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      mediaQuery.removeEventListener("change", syncViewport);
    };
  }, []);

  return (
    <>
      <ScrollToSectionOnLoad />

      <header
        className={cn(
          "fixed top-7 left-1/2 -translate-x-1/2 z-50 w-full max-w-[1264px] px-4 transition-transform duration-300 ease-out",
          isMobile && !isVisible ? "-translate-y-[140%] md:translate-y-0" : "translate-y-0",
        )}
      >
        <nav
          ref={navRef}
          className="flex items-center justify-between gap-2 px-3 md:px-12 py-4 rounded-3xl bg-white/50 backdrop-blur-sm transition-all duration-300 hover:bg-white/70"
        >
          {/* Sem menu hambúrguer: com um único destino, ele esconderia um
              link atrás de um toque extra. Tudo fica na barra. */}
          <div className="flex min-w-0 items-center gap-3 md:gap-12">
            {Brand}
            <NavLinks items={navItems} />
          </div>

          {/* Grupo de idioma e CTA à direita: ambos são ações, enquanto a
              marca e o link são destinos. */}
          <div className="flex shrink-0 items-center gap-1 md:gap-3">
            <LanguageToggle />
            {CTAButton}
          </div>
        </nav>
      </header>
    </>
  );
}
