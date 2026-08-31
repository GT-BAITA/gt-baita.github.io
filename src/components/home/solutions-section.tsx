import { ArrowRight } from "lucide-react";
import { useCallback, useState } from "react";
import { useTranslation } from "react-i18next";
import gsap from "gsap";
import { ProductScreen } from "@/components/home/demos/product-screen";
import { useEnterOnce } from "@/hooks/useEnterOnce";
import { requestContact } from "@/lib/contact-request";
import { useScrollPin } from "@/hooks/useScrollPin";
import {
  HAND_OFF,
  handOffStart,
  restProgress,
} from "@/lib/scrub-schedule";

/**
 * "O que estamos construindo" — nó 1058:35764 do Figma.
 *
 * Desktop: a seção tem uma viewport de altura por card e fixa o conteúdo,
 * então a rolagem percorre a lista — o card ativo se expande, os demais
 * recuam e a demonstração do produto à direita troca para acompanhá-lo.
 *
 * Abaixo de lg (ou com prefers-reduced-motion), a fixação é desativada e a
 * mesma expansão é controlada por toque, então nada é reorganizado sob o
 * leitor no meio da frase. Nesse caso, a demonstração também se move para
 * dentro do card expandido, depois do CTA, pois não há uma segunda coluna
 * para abrigá-la.
 *
 * Os dois modos compartilham um `activeIndex`; apenas o controlador muda.
 */

type Solution = {
  key: string;
  badge: string;
  title: string;
  description: string;
  cta?: {
    label: string;
    /** URL externa ou "" quando o CTA abre o formulário de contato. */
    href: string;
    /** Preenche o campo de mensagem do formulário. Implica o formulário. */
    message?: string;
    /** Preenchido para a ação primária e contornado para a secundária. */
    variant: "primary" | "outline";
  };
};

const PORTAL_URL = "https://servicos.baita.testbeds.rnp.br/";

/**
 * Viewports de altura de página por card. Abaixo dos 1.15 da seção de
 * benefícios porque há um card a menos e a expansão é um tween de 400ms em
 * vez de 700ms; assim, cada card precisa de menos tempo parado para parecer
 * estável.
 */
const VIEWPORTS_PER_CARD = 0.9;


function useSolutions(): Solution[] {
  const { t } = useTranslation();

  return [
    {
      key: "portal",
      badge: t("solutions.card1.badge"),
      title: t("solutions.card1.title"),
      description: t("solutions.card1.description"),
      cta: {
        label: t("solutions.card1.cta"),
        href: PORTAL_URL,
        variant: "outline",
      },
    },
    {
      key: "management",
      badge: t("solutions.card2.badge"),
      title: t("solutions.card2.title"),
      description: t("solutions.card2.description"),
      cta: {
        label: t("solutions.card2.cta"),
        href: "",
        message: t("solutions.card2.message"),
        variant: "primary",
      },
    },
    {
      key: "idp",
      badge: t("solutions.card3.badge"),
      title: t("solutions.card3.title"),
      description: t("solutions.card3.description"),
      cta: {
        label: t("solutions.card3.cta"),
        href: "",
        message: t("solutions.card3.message"),
        variant: "primary",
      },
    },
  ];
}

/** Qual tela pertence a cada card. */
const SCREEN_FOR: Record<string, "benefits" | "management" | "idp"> = {
  portal: "benefits",
  management: "management",
  idp: "idp",
};

/**
 * A tela do produto de um card, dentro de sua janela de navegador.
 *
 * Usa `variant` em vez de className porque as duas posições precisam de
 * dimensionamentos opostos: a coluna desktop oferece à janela uma caixa para
 * preencher, enquanto dentro de um card mobile ela define a própria altura a
 * partir do formato da captura.
 */
function DemoPanel({
  solution,
  variant,
}: {
  solution: Solution;
  variant: "column" | "inline";
}) {
  return <ProductScreen screen={SCREEN_FOR[solution.key]} variant={variant} />;
}

function SolutionCard({
  solution,
  index,
  isActive,
  isPinned,
  onSelect,
}: {
  solution: Solution;
  index: number;
  isActive: boolean;
  isPinned: boolean;
  onSelect: () => void;
}) {
  const { ref, hasEntered } = useEnterOnce<HTMLLIElement>();

  const ctaClass = [
    "inline-flex min-h-9 shrink-0 items-center justify-center gap-2 rounded-lg px-4 py-[7.5px] font-geist text-sm font-medium transition-colors",
    solution.cta?.variant === "primary"
      ? "bg-neutral-900 text-neutral-50 hover:bg-neutral-800"
      : "border border-neutral-200 bg-white/40 text-neutral-950 shadow-sm hover:bg-white/80",
  ].join(" ");

  // Um CTA de contato é um botão, não um link: a aplicação monta um
  // HashRouter, então um href "#contact-form" seria lido como uma rota.
  const cta = !solution.cta ? null : solution.cta.message ? (
    <button
      type="button"
      onClick={() => requestContact(solution.cta!.message!)}
      className={ctaClass}
    >
      {solution.cta.label}
      <ArrowRight className="h-4 w-4" />
    </button>
  ) : (
    <a
      href={solution.cta.href}
      target="_blank"
      rel="noopener noreferrer"
      className={ctaClass}
    >
      {solution.cta.label}
      <ArrowRight className="h-4 w-4" />
    </a>
  );

  return (
    <li
      ref={ref}
      className={`t-card-enter ${hasEntered ? "is-shown" : ""}`}
      style={{ "--i": index } as React.CSSProperties}
    >
      {/* A opacidade de entrada vive no <li>, e o escurecimento de ativo/inativo
          no card — são duas opacidades independentes que, de outro modo,
          competiriam pelo mesmo elemento. */}
      <div className="t-solution-card" data-active={String(isActive)}>
        <span className="t-solution-blob" aria-hidden="true" />

        <button
          type="button"
          onClick={onSelect}
          aria-expanded={isActive}
          className="t-solution-hit"
        >
          <span className="sr-only">{solution.title}</span>
        </button>

        <div className="t-solution-body">
          <span className="inline-flex items-center justify-center rounded-full bg-[#e2e2df] px-3 py-2 font-geist text-sm tracking-[-0.42px] text-neutral-900">
            {solution.badge}
          </span>

          <h3 className="mt-6 font-geist text-[32px] font-medium leading-none tracking-[-0.96px] text-neutral-900">
            {solution.title}
          </h3>

          <div className="t-acc" data-open={String(isActive)}>
            <div className="t-acc-panel">
              <div className="t-acc-panel-inner">
                <div className={`t-stagger pt-6 ${isActive ? "is-shown" : ""}`}>
                  <p className="t-stagger-line t-stagger-line--2 font-geist text-base leading-snug tracking-[-0.48px] text-neutral-600">
                    {solution.description}
                  </p>

                  {cta && (
                    <span className="t-stagger-line t-stagger-line--3 mt-6 block">
                      {cta}
                    </span>
                  )}

                  {/* t-demo-inline, não o utilitário `lg:hidden` — veja a
                      observação sobre essa classe em global.css. */}
                  {!isPinned && (
                    <span className="t-stagger-line t-stagger-line--4 t-demo-inline mt-6 block">
                      <DemoPanel solution={solution} variant="inline" />
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </li>
  );
}

export function SolutionsSection() {
  const { t } = useTranslation();
  const solutions = useSolutions();

  // Transição com scrub: o card que abre e o que fecha se movem com a
  // rolagem, então o trecho fixado nunca fica parado esperando uma troca
  // discreta.
  const buildTimeline = useCallback(
    (tl: gsap.core.Timeline, root: HTMLElement) => {
      const panels = Array.from(
        root.querySelectorAll<HTMLElement>(".t-solution-card .t-acc-panel")
      );
      const demos = Array.from(
        root.querySelectorAll<HTMLElement>(".t-panel-slide")
      );
      if (!panels.length) return;

      gsap.set(panels, {
        gridTemplateRows: (i: number) => (i === 0 ? "1fr" : "0fr"),
      });
      gsap.set(demos, {
        opacity: (i: number) => (i === 0 ? 1 : 0),
        y: (i: number) => (i === 0 ? 0 : 100),
      });

      panels.forEach((panel, i) => {
        const next = panels[i + 1];
        if (!next) return;

        const start = handOffStart(i);

        tl.to(
          panel,
          { gridTemplateRows: "0fr", duration: HAND_OFF, ease: "none" },
          start
        ).to(
          next,
          { gridTemplateRows: "1fr", duration: HAND_OFF, ease: "none" },
          start
        );

        if (demos[i] && demos[i + 1]) {
          tl.to(
            demos[i],
            { opacity: 0, y: -60, duration: HAND_OFF / 2, ease: "none" },
            start
          ).to(
            demos[i + 1],
            { opacity: 1, y: 0, duration: HAND_OFF / 2, ease: "none" },
            start + HAND_OFF / 2
          );
        }
      });

      tl.set({}, {}, panels.length);
    },
    []
  );

  // O card aberto é aquele cuja faixa do painel está mais alta, então as cores
  // do badge e a régua nunca discordam da geometria.
  const deriveIndex = useCallback((root: HTMLElement) => {
    const panels = Array.from(
      root.querySelectorAll<HTMLElement>(".t-solution-card .t-acc-panel")
    );
    let best = 0;
    let bestHeight = -1;
    panels.forEach((panel, i) => {
      const height = panel.getBoundingClientRect().height;
      if (height > bestHeight) {
        bestHeight = height;
        best = i;
      }
    });
    return best;
  }, []);

  // Clicar rola até o meio da janela, onde o item fica inteiro. Compartilhar
  // isso com a timeline é o propósito de scrub-schedule: quando discordavam,
  // o item 0 ficava congelado pela metade.
  const progressForIndex = useCallback(
    (index: number) => restProgress(index, solutions.length),
    []
  );

  const {
    sectionRef,
    pinRef,
    activeIndex: scrolledIndex,
    progressRef,
    isEnabled: isPinned,
    scrollToIndex,
  } = useScrollPin(solutions.length, {
    viewportsPerItem: VIEWPORTS_PER_CARD,
    buildTimeline,
    deriveIndex,
    progressForIndex,
  });

  // O toque controla a lista quando o stagger da rolagem está desativado. O
  // primeiro card abre por padrão, com exatamente um aberto em ambos os modos.
  const [tappedIndex, setTappedIndex] = useState(0);
  const activeIndex = isPinned ? scrolledIndex : tappedIndex;

  const header = (
    <h2 className="font-domine text-4xl leading-tight text-neutral-900 md:text-5xl md:leading-[48px]">
      {t("solutions.title")}
    </h2>
  );

  return (
    <section id="solutions" ref={sectionRef} className="py-20 lg:py-0">
      <div
        ref={pinRef}
        className="t-solution-pin lg:flex lg:h-screen lg:flex-col lg:justify-center"
      >
        {header}

        <div
          className="t-solution-grid mt-14 grid gap-12 lg:grid-cols-[507px_minmax(0,1fr)] lg:gap-10"
          data-scrub={String(isPinned)}
        >
          <div className="flex gap-6">
            {isPinned && (
              <div
                ref={progressRef as React.RefObject<HTMLDivElement>}
                className="t-solution-rail my-1 shrink-0"
                aria-hidden="true"
              >
                <div className="t-solution-rail-fill" />
              </div>
            )}

            <div className="min-w-0 flex-1">
              <ol className="t-solution-cards flex flex-col gap-5">
                {solutions.map((solution, index) => (
                  <SolutionCard
                    key={solution.key}
                    solution={solution}
                    index={index}
                    isActive={index === activeIndex}
                    isPinned={isPinned}
                    onSelect={() =>
                      isPinned ? scrollToIndex(index) : setTappedIndex(index)
                    }
                  />
                ))}
              </ol>
            </div>
          </div>

          {/* Coluna de demonstração: os painéis ficam empilhados e fazem
              cross-fade, então a troca não altera o layout. Com o stagger
              desativado, a demonstração fica dentro do card expandido. */}
          {/* Renderizado incondicionalmente: a timeline é criada dentro do
              callback de matchMedia, e qualquer elemento condicionado a
              isPinned ainda não existiria nesse momento — seus tweens nunca
              seriam criados. `hidden lg:block` já o mantém fora de telas
              pequenas. */}
          <div className="t-solution-demo relative hidden lg:block">
            {solutions.map((solution, index) => (
              <div
                key={solution.key}
                className="t-panel-slide absolute inset-0"
                data-open={String(index === activeIndex)}
                aria-hidden={index !== activeIndex}
              >
                <DemoPanel solution={solution} variant="column" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
