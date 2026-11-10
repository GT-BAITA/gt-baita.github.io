import { useTranslation } from "react-i18next";
import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type CSSProperties,
} from "react";
import { useNavigate, useParams } from "react-router-dom";
import { HeroBackdrop } from "@/features/idp-proposal/components/hero-dither";
import { PresentationTabs } from "@/features/idp-proposal/components/presentation-tabs";
import { Expand } from "@/features/idp-proposal/components/icons";
import { SlideNavigation } from "@/features/idp-proposal/components/slide-navigation";
import { MobileNavigation } from "@/features/idp-proposal/components/mobile-navigation";
import { CoverScreen } from "@/features/idp-proposal/screens/cover-screen";
import {
  COVER_ID,
  SLIDES,
  findSlide,
  resolveSlideId,
  getSlidePath,
} from "@/features/idp-proposal/sections";
import { SlideStepsContext } from "@/features/idp-proposal/steps";
import { ProposalLanguageToggle } from "@/features/idp-proposal/components/language-toggle";

export function ProposalPresentation() {
  const { t: translate } = useTranslation();

  // O hash pertence ao roteador do site. A tela é um segmento da rota:
  // /#/idp-proposal/team, por exemplo.
  const { slide } = useParams();
  const navigate = useNavigate();
  const currentSlideId = resolveSlideId(slide);
  const [tabsHidden, setTabsHidden] = useState(false);
  // Direção e alcance da última troca: a tela entra vindo do lado da viagem,
  // mais longe quando muda de seção.
  // `entry`: −1 quando se volta com ←, para a tela abrir no último passo;
  // pelas abas ou por link, ela abre no começo.
  const [transition, setTransition] = useState({
    dir: 0,
    far: false,
    entry: 0,
  });
  const currentSlideRef = useRef(currentSlideId);
  currentSlideRef.current = currentSlideId;

  // Passos dentro da tela atual (ver steps.tsx): ←/→ passam por eles antes.
  const stepHandlerRef = useRef<((d: number) => boolean) | null>(null);
  const register = useCallback((fn: (d: number) => boolean) => {
    stepHandlerRef.current = fn;
    return () => {
      if (stepHandlerRef.current === fn) stepHandlerRef.current = null;
    };
  }, []);

  const goToSlide = useCallback(
    (id: string, entry = 0) => {
      const from = SLIDES.findIndex((f) => f.id === currentSlideRef.current);
      const to = SLIDES.findIndex((f) => f.id === id);
      if (to < 0 || from === to) return;
      setTransition({
        dir: Math.sign(to - from),
        far: SLIDES[to].sectionIndex !== SLIDES[from].sectionIndex,
        entry,
      });
      navigate(getSlidePath(id), {
        replace: true,
      });
    },
    [navigate]
  );

  const advance = useCallback(
    (d: number) => {
      if (stepHandlerRef.current?.(d)) return;
      const i = SLIDES.findIndex((f) => f.id === currentSlideRef.current);
      const n = i + d;
      if (n >= 0 && n < SLIDES.length) goToSlide(SLIDES[n].id, d);
    },
    [goToSlide]
  );

  useEffect(() => {
    if (
      slide &&
      slide !== (currentSlideId === COVER_ID ? undefined : currentSlideId)
    ) {
      navigate(getSlidePath(currentSlideId), { replace: true });
    }
  }, [slide, currentSlideId, navigate]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      const t = e.target as HTMLElement;
      if (
        t.isContentEditable ||
        t.tagName === "INPUT" ||
        t.tagName === "TEXTAREA"
      )
        return;
      // PageUp/PageDown: o que os passadores de slide enviam.
      if (e.key === "ArrowRight" || e.key === "PageDown") advance(1);
      else if (e.key === "ArrowLeft" || e.key === "PageUp") advance(-1);
      else if (e.key === "Home") goToSlide(COVER_ID);
      else if (e.key === "End") goToSlide(SLIDES[SLIDES.length - 1].id);
      else if (e.key === "s" || e.key === "S") setTabsHidden((h) => !h);
      else if (e.key === "f" || e.key === "F") toggleFullscreen();
      else return;
      e.preventDefault();
    };
    addEventListener("keydown", onKey);
    return () => removeEventListener("keydown", onKey);
  }, [goToSlide, advance]);

  // No celular a página rola: cada tela nova começa do topo.
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [currentSlideId]);

  // Toque: deslizar para os lados passa para o próximo/anterior (passos
  // primeiro, como ←/→). Só conta um gesto claramente horizontal, para não
  // brigar com a rolagem vertical.
  useEffect(() => {
    let x0 = 0;
    let y0 = 0;
    let t0 = 0;
    let track = false;
    const onStart = (e: TouchEvent) => {
      track =
        e.touches.length === 1 &&
        !document.documentElement.hasAttribute("data-proposal-lock");
      x0 = e.touches[0].clientX;
      y0 = e.touches[0].clientY;
      t0 = performance.now();
    };
    const onEnd = (e: TouchEvent) => {
      if (!track) return;
      track = false;
      const t = e.changedTouches[0];
      const dx = t.clientX - x0;
      const dy = t.clientY - y0;
      if (
        Math.abs(dx) < 56 ||
        Math.abs(dy) > Math.abs(dx) * 0.6 ||
        performance.now() - t0 > 700
      )
        return;
      advance(dx < 0 ? 1 : -1);
    };
    addEventListener("touchstart", onStart, { passive: true });
    addEventListener("touchend", onEnd, { passive: true });
    return () => {
      removeEventListener("touchstart", onStart);
      removeEventListener("touchend", onEnd);
    };
  }, [advance]);

  const currentSlide = SLIDES.find((f) => f.id === currentSlideId)!;
  const isCoverSlide = currentSlideId === COVER_ID;
  const SlideScreen = isCoverSlide
    ? CoverScreen
    : findSlide(currentSlideId)!.Screen;
  const slideIndex = SLIDES.indexOf(currentSlide);

  return (
    <div className="app" data-tabs={tabsHidden ? "hidden" : undefined}>
      <HeroBackdrop />
      {/* Sem barra no topo: as abas e a lombada já dizem onde estamos. */}
      <div className="corner">
        <ProposalLanguageToggle />
        <button
          className="icon-btn"
          onClick={() => setTabsHidden((h) => !h)}
          aria-pressed={tabsHidden}
          aria-label={
            tabsHidden
              ? translate("proposal.controls.showTabs")
              : translate("proposal.controls.hideTabs")
          }
          title={
            tabsHidden
              ? translate("proposal.controls.showTabs")
              : translate("proposal.controls.hideTabs")
          }
        >
          <kbd>S</kbd>
        </button>
        <button
          className="icon-btn"
          onClick={toggleFullscreen}
          aria-label={translate("proposal.controls.fullscreen")}
          title={translate("proposal.controls.fullscreen")}
        >
          <Expand />
        </button>
        {!isCoverSlide && <span className="wordmark">GT-Baita</span>}
      </div>
      <main
        key={currentSlideId}
        className="stage"
        style={
          {
            "--dx": `${transition.dir * (transition.far ? 80 : 28)}px`,
            "--dy": transition.dir ? "0px" : "18px",
          } as CSSProperties
        }
      >
        <SlideStepsContext.Provider
          value={{ register, entryDirection: transition.entry }}
        >
          <SlideScreen />
        </SlideStepsContext.Provider>
      </main>
      <SlideNavigation
        onPrev={() => advance(-1)}
        onNext={() => advance(1)}
        atStart={slideIndex === 0}
        atEnd={slideIndex === SLIDES.length - 1}
      />
      <PresentationTabs
        currentSlideId={currentSlideId}
        onNavigate={goToSlide}
      />
      <MobileNavigation
        currentSlideId={currentSlideId}
        onNavigate={goToSlide}
      />
      {/* Com as abas ocultas, um lembrete curto de como trazê-las de volta. */}
      {tabsHidden && (
        <p className="tabs-hint" role="status">
          <kbd>S</kbd> {translate("proposal.controls.tabsHint")}
        </p>
      )}
    </div>
  );
}

function toggleFullscreen() {
  if (document.fullscreenElement) document.exitFullscreen();
  else document.documentElement.requestFullscreen?.().catch(() => {});
}
