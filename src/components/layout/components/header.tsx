import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useEffect, useRef, useState } from "react";
import { LanguageToggle } from "./language-toggle";
import { useTranslation } from "react-i18next";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { ScrollSmoother } from "gsap/ScrollSmoother";
import { requestContact } from "@/lib/contact-request";
import { IDP_PATH, useRouteChrome } from "@/lib/route-theme";

// Links da barra: cor por token, então servem os dois modos.
const LINK_CLASS =
  "whitespace-nowrap text-ink-2 hover:text-ink aria-[current=page]:text-ink transition-all duration-300 font-geist hover:scale-[1.05]";

type NavItem = {
  href: string;
  label: string;
  badge?: string;
  /** Rótulo da segunda linha do celular, onde o espaço é curto. */
  shortLabel?: string;
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
      className={cn(LINK_CLASS, className)}
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

function NavLinks({ items, compact = false }: { items: NavItem[]; compact?: boolean }) {
  const { pathname } = useLocation();

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
            aria-current={pathname === item.href ? "page" : undefined}
            className={cn(LINK_CLASS, "inline-flex items-center gap-1.5")}
          >
            {compact && item.shortLabel ? (
              // Só no celular: em tablet a segunda linha tem espaço de sobra.
              <>
                <span className="sm:hidden">{item.shortLabel}</span>
                <span className="hidden sm:inline">{item.label}</span>
              </>
            ) : (
              item.label
            )}
            {item.badge && (
              // Some abaixo de sm: na segunda linha do celular, os três links
              // precisam caber sem o selo.
              <span className="hidden rounded-full bg-ink px-1.5 py-0.5 font-mono text-[10px] font-medium leading-none tracking-wide text-canvas sm:inline-block">
                {item.badge}
              </span>
            )}
          </Link>
        )
      )}
    </>
  );
}

export function Header() {
  const { t } = useTranslation();
  const location = useLocation();
  const chrome = useRouteChrome();
  const navRef = useRef<HTMLDivElement | null>(null);
  const [isVisible, setIsVisible] = useState(true);
  const headerRef = useRef<HTMLElement>(null);

  // As três frentes do site: o BAITA em geral, o barramento e o IdP (que
  // vira o modo escuro). Sem links para seções: cada página é um destino.
  const navItems: NavItem[] = [
    { href: "/", label: t("header.nav-home") },
    { href: "/about", label: t("header.nav-bus") },
    {
      href: IDP_PATH,
      label: t("header.nav-idp"),
      shortLabel: t("header.nav-idp-short"),
      badge: t("header.new"),
    },
  ];

  // Todas as páginas têm o formulário de contato no rodapé, então o CTA só
  // rola até ele — com a mensagem da rota já preenchida. O texto é o mesmo
  // em todas as rotas, para o cabeçalho não mudar na virada de tema.
  const CTAButton = (
    <Button
      onClick={() =>
        requestContact(chrome.ctaMessageKey ? t(chrome.ctaMessageKey) : "")
      }
      className="shrink-0 px-3 md:px-4"
    >
      {t("header.cta")}
    </Button>
  );

  const Brand = (
    <h1 className="flex items-baseline gap-1.5 whitespace-nowrap text-lg font-bold font-domine text-ink transition hover:opacity-90 cursor-pointer sm:text-xl md:text-2xl">
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

  // Some ao rolar para baixo e volta ao rolar para cima, em qualquer
  // largura. A direção vem do gesto de quem lê (roda, toque, teclado), não
  // da posição da rolagem: o site também rola sozinho (o snap da página
  // inicial, os saltos para seções), e isso não deve mostrar o menu. No
  // rodapé (que já tem a navegação e o contato) ele fica escondido até o
  // rodapé sair da tela. Perto do topo, sempre visível. Com mouse, levar o
  // ponteiro até o alto da tela também traz o menu de volta (e ele fica
  // enquanto o ponteiro estiver sobre ele).
  useEffect(() => {
    const topOffset = 24;
    /** Faixa no alto da tela que chama o menu (px). */
    const hotZone = 72;
    let wantsUp = true;
    let footerInView = false;
    let hoverTop = false;
    let touchY = 0;

    const apply = () =>
      setIsVisible(hoverTop || ((window.scrollY <= topOffset || wantsUp) && !footerInView));
    const intent = (up: boolean) => {
      if (wantsUp === up) return;
      wantsUp = up;
      apply();
    };

    const onWheel = (e: WheelEvent) => {
      if (Math.abs(e.deltaY) > 2) intent(e.deltaY < 0);
    };
    const onTouchStart = (e: TouchEvent) => {
      touchY = e.touches[0].clientY;
    };
    const onTouchMove = (e: TouchEvent) => {
      const dy = e.touches[0].clientY - touchY;
      if (Math.abs(dy) < 10) return;
      intent(dy > 0); // dedo descendo = rolagem para cima
      touchY = e.touches[0].clientY;
    };
    const onKey = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      if (target?.closest("input, textarea, select, [contenteditable]")) return;
      if (["ArrowDown", "PageDown", "End"].includes(e.key) || (e.key === " " && !e.shiftKey)) intent(false);
      if (["ArrowUp", "PageUp", "Home"].includes(e.key) || (e.key === " " && e.shiftKey)) intent(true);
    };
    const onScroll = () => apply();
    const onPointer = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      // Com o menu à vista por causa do mouse, a faixa se estende até o fim
      // dele, para não piscar ao descer o ponteiro pelos itens.
      // Fim do menu na posição final (sem a animação de entrada): `top` do
      // fixed + a altura dele.
      const h = headerRef.current;
      const menuBottom = h ? parseFloat(getComputedStyle(h).top) + h.offsetHeight : hotZone;
      const bottom = hoverTop ? Math.max(hotZone, menuBottom + 16) : hotZone;
      const next = e.clientY <= bottom;
      if (next === hoverTop) return;
      hoverTop = next;
      apply();
    };
    const onLeave = () => {
      if (!hoverTop) return;
      hoverTop = false;
      apply();
    };

    const footer = document.querySelector("footer");
    const io = footer
      ? new IntersectionObserver(
          ([e]) => {
            footerInView = e.isIntersecting;
            apply();
          },
          // Conta como "no rodapé" quando ele ocupa uma faixa razoável da tela.
          { rootMargin: "0px 0px -35% 0px" }
        )
      : null;
    if (footer && io) io.observe(footer);

    window.addEventListener("wheel", onWheel, { passive: true });
    window.addEventListener("touchstart", onTouchStart, { passive: true });
    window.addEventListener("touchmove", onTouchMove, { passive: true });
    window.addEventListener("keydown", onKey);
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("pointermove", onPointer, { passive: true });
    document.documentElement.addEventListener("pointerleave", onLeave);
    return () => {
      window.removeEventListener("pointermove", onPointer);
      document.documentElement.removeEventListener("pointerleave", onLeave);
      window.removeEventListener("wheel", onWheel);
      window.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("scroll", onScroll);
      io?.disconnect();
    };
  }, []);

  return (
    <>
      <ScrollToSectionOnLoad />

      <header
        ref={headerRef}
        className={cn(
          "page-frame fixed top-7 left-1/2 -translate-x-1/2 z-50 transition-transform duration-300 ease-out",
          !isVisible ? "-translate-y-[140%] focus-within:translate-y-0" : "translate-y-0",
        )}
      >
        <nav
          ref={navRef}
          className="flex flex-wrap items-center justify-between gap-x-2 gap-y-3 px-3 md:px-12 py-4 rounded-3xl border border-[var(--nav-border)] bg-[var(--nav-bg)] backdrop-blur-md transition-all duration-300 hover:bg-[var(--nav-bg-hover)]"
        >
          {/* Sem menu hambúrguer: com poucos destinos, ele esconderia links
              atrás de um toque extra. Abaixo de lg eles descem para uma
              segunda linha dentro da própria barra (ver o fim do <nav>). */}
          <div className="flex min-w-0 items-center gap-3 md:gap-12">
            {Brand}
            <div className="hidden items-center gap-10 lg:flex">
              <NavLinks items={navItems} />
            </div>
          </div>

          {/* Grupo de idioma e CTA à direita: ambos são ações, enquanto a
              marca e o link são destinos. */}
          <div className="flex shrink-0 items-center gap-1 md:gap-3">
            <LanguageToggle />
            {CTAButton}
          </div>

          <div className="flex w-full items-center gap-5 border-t border-line pt-3 text-sm sm:gap-8 lg:hidden">
            <NavLinks items={navItems} compact />
          </div>
        </nav>
      </header>
    </>
  );
}
