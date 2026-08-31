import { useCallback, useState } from "react";
import { useTranslation } from "react-i18next";
import gsap from "gsap";
import { useScrollPin } from "@/hooks/useScrollPin";
import { requestContact } from "@/lib/contact-request";
import {
  HAND_OFF,
  handOffStart,
  restProgress,
} from "@/lib/scrub-schedule";

/**
 * "Feito para quem move a federação" — nó 1058:37302 do Figma.
 *
 * Desktop: quatro painéis em uma linha, com apenas um aberto por vez. O
 * painel aberto ocupa a largura deixada pelas réguas recolhidas; as demais
 * permanecem como réguas verticais escuras com seu número e um rótulo girado.
 * Rolar pela seção fixada alterna o painel aberto — com o mesmo controle da
 * seção de soluções acima —, e clicar em uma régua salta para o deslocamento
 * de rolagem daquele painel.
 *
 * Abaixo de lg, a linha vira um acordeão vertical — uma régua de 90px por
 * painel não deixa nada legível no celular — reutilizando o mesmo comportamento
 * de toque da seção de soluções acima.
 */

/**
 * `body` tem um limite de ~260 caracteres. O painel é uma caixa fixa em uma
 * viewport fixada, então textos maiores não rolam — consomem a altura da
 * imagem e, depois de certo ponto, a imagem é removida por completo.
 * O maior texto atual é o da tab1, com 254 caracteres.
 */
type Tab = {
  key: string;
  label: string;
  body: string;
  /** Preenche o campo de mensagem do formulário para este público. */
  message: string;
  image?: string;
};


/**
 * Viewports de altura de página por tab. Com 1, cada tab tinha ~675px de
 * deslocamento em uma viewport de 900px — menos que uma tela, então um gesto
 * do trackpad atravessava uma tab inteira. 1.5 corrigia isso, mas deixava a
 * seção com 5400px de página. 1.15 mantém cada tab pouco acima de uma tela
 * (~810px), removendo ~1250px de rolagem da seção.
 */
const VIEWPORTS_PER_TAB = 1.15;

/** Agenda da timeline, em unidades de uma tab. */

function useTabs(): Tab[] {
  const { t } = useTranslation();

  return [
    {
      key: "institutions",
      label: t("benefits.tab1.label"),
      body: t("benefits.tab1.body"),
      message: t("benefits.tab1.message"),
      image: "/svgs/benefits-institutions.jpg",
    },
    {
      key: "researchers",
      label: t("benefits.tab2.label"),
      body: t("benefits.tab2.body"),
      message: t("benefits.tab2.message"),
      image: "/svgs/benefits-researchers.jpg",
    },
    {
      key: "students",
      label: t("benefits.tab3.label"),
      body: t("benefits.tab3.body"),
      message: t("benefits.tab3.message"),
      image: "/svgs/benefits-students.jpg",
    },
    {
      key: "operators",
      label: t("benefits.tab4.label"),
      body: t("benefits.tab4.body"),
      message: t("benefits.tab4.message"),
      image: "/svgs/benefits-operators.jpg",
    },
  ];
}

function paneNumber(index: number) {
  return String(index + 1).padStart(2, "0");
}

function TabBody({
  tab,
  isOpen,
  className = "",
}: {
  tab: Tab;
  isOpen: boolean;
  className?: string;
}) {
  const { t } = useTranslation();

  return (
    <div
      className={`t-stagger flex flex-col ${
        isOpen ? "is-shown" : ""
      } ${className}`}
    >
      <h3 className="t-stagger-line font-domine text-2xl text-neutral-900 lg:text-[30px]">
        {tab.label}
      </h3>

      <p className="t-stagger-line t-stagger-line--2 mt-4 font-geist lg:mt-6 text-base leading-6 text-neutral-600">
        {tab.body}
      </p>

      <button
        type="button"
        onClick={() => requestContact(tab.message)}
        className="t-stagger-line t-stagger-line--3 mt-4 inline-flex w-fit lg:mt-6 min-h-9 items-center gap-2 rounded-lg py-[7.5px] text-left font-geist text-sm font-medium tracking-[0.07px] text-neutral-700 transition-colors hover:text-neutral-950"
      >
        {t("benefits.cta")} →
      </button>

      <div className="t-stagger-line t-stagger-line--4 mt-4 aspect-[812/342] lg:mt-6 w-full min-h-0 shrink overflow-hidden rounded-lg bg-neutral-200 lg:aspect-auto lg:flex-1">
        {tab.image ? (
          <img
            src={tab.image}
            alt=""
            loading="lazy"
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-neutral-200">
            <span className="font-geist text-xs uppercase tracking-widest text-neutral-500">
              imagem
            </span>
          </div>
        )}
      </div>
    </div>
  );
}

/** A régua escura: número no topo e rótulo girado na parte inferior. */
function TabRail({
  index,
  tab,
  isOpen,
}: {
  index: number;
  tab: Tab;
  isOpen: boolean;
}) {
  return (
    <div className="t-tab-rail flex h-full flex-col items-center justify-between overflow-hidden px-6 py-8">
      <span
        className={`font-domine text-[32px] leading-none ${
          isOpen ? "text-neutral-900" : "text-neutral-500"
        }`}
      >
        {paneNumber(index)}
      </span>

      <span className="flex items-center justify-center">
        <span
          className={`t-tab-label font-geist text-sm font-medium ${
            isOpen ? "text-neutral-600" : "text-neutral-300"
          }`}
        >
          {tab.label}
        </span>
      </span>
    </div>
  );
}

export function BenefitsSection() {
  const { t } = useTranslation();
  const tabs = useTabs();

  // Uma unidade de tempo da timeline por tab. As transições começam quase
  // imediatamente e são espaçadas para que a linha esteja em movimento em
  // ~70% da fixação: um longo trecho parado logo após a fixação é exatamente
  // o que faz a página parecer travada.
  const buildTimeline = useCallback(
    (tl: gsap.core.Timeline, root: HTMLElement) => {
      const panes = Array.from(
        root.querySelectorAll<HTMLElement>(".t-tab-pane")
      );
      if (!panes.length) return;

      gsap.set(panes, { flexGrow: (i: number) => (i === 0 ? 1 : 0) });
      gsap.set(
        panes.map((p) => p.querySelector(".t-stagger")),
        { opacity: (i: number) => (i === 0 ? 1 : 0) }
      );

      panes.forEach((pane, i) => {
        const next = panes[i + 1];
        if (!next) return;

        const start = handOffStart(i);

        // ease: "none" — a posição de rolagem é o easing. Qualquer curva aqui
        // faria a geometria se adiantar ou ficar para trás do dedo.
        tl.to(pane, { flexGrow: 0, duration: HAND_OFF, ease: "none" }, start)
          .to(next, { flexGrow: 1, duration: HAND_OFF, ease: "none" }, start)
          .to(
            pane.querySelector(".t-stagger"),
            { opacity: 0, duration: HAND_OFF / 2, ease: "none" },
            start
          )
          .to(
            next.querySelector(".t-stagger"),
            { opacity: 1, duration: HAND_OFF / 2, ease: "none" },
            start + HAND_OFF / 2
          );
      });

      // Fixa o comprimento da timeline em uma unidade por tab.
      tl.set({}, {}, panes.length);
    },
    []
  );

  // A tab aberta é o painel com maior crescimento neste momento, então o
  // rótulo e as cores nunca discordam da geometria.
  const deriveIndex = useCallback((root: HTMLElement) => {
    const panes = Array.from(root.querySelectorAll<HTMLElement>(".t-tab-pane"));
    let best = 0;
    let bestGrow = -1;
    panes.forEach((pane, i) => {
      const grow = Number(gsap.getProperty(pane, "flexGrow")) || 0;
      if (grow > bestGrow) {
        bestGrow = grow;
        best = i;
      }
    });
    return best;
  }, []);

  // Clicar rola até o meio da janela, onde o item fica inteiro. Compartilhar
  // isso com a timeline é o propósito de scrub-schedule: quando discordavam,
  // o item 0 ficava congelado pela metade.
  const progressForIndex = useCallback(
    (index: number) => restProgress(index, tabs.length),
    []
  );

  const {
    sectionRef,
    pinRef,
    activeIndex: scrolledIndex,
    isEnabled: isPinned,
    scrollToIndex,
  } = useScrollPin(tabs.length, {
    viewportsPerItem: VIEWPORTS_PER_TAB,
    buildTimeline,
    deriveIndex,
    progressForIndex,
  });

  // O toque controla a lista quando a rolagem fixada está desativada.
  const [tappedIndex, setTappedIndex] = useState(0);
  const openIndex = isPinned ? scrolledIndex : tappedIndex;
  const select = (index: number) =>
    isPinned ? scrollToIndex(index) : setTappedIndex(index);

  return (
    <section
      id="benefits"
      ref={sectionRef}
      className="py-20 lg:py-0"
    >
      <div
        ref={pinRef}
        className="t-benefits-pin lg:flex lg:h-screen lg:flex-col lg:justify-center"
      >
        <div className="flex flex-col gap-10 lg:flex-row lg:items-end lg:justify-between">
          <h2 className="max-w-[412px] font-domine text-4xl leading-tight text-neutral-900 md:text-5xl md:leading-[48px]">
            {t("benefits.title")}
          </h2>

          <p className="max-w-[520px] font-geist text-base leading-6 tracking-[-0.48px] text-neutral-600">
            {t("benefits.description")}
          </p>
        </div>

        {/* Desktop: quatro painéis lado a lado, com um aberto. */}
        <div
          className="t-tabs t-tab-row mt-14 hidden overflow-hidden rounded-2xl border border-neutral-200 lg:flex"
          data-scrub={String(isPinned)}
          style={{ "--tab-count": tabs.length } as React.CSSProperties}
        >
          {tabs.map((tab, index) => {
            const isOpen = index === openIndex;

            return (
              <div
                key={tab.key}
                className="t-tab-pane t-resize flex h-full items-start"
                data-open={String(isOpen)}
              >
                <button
                  type="button"
                  onClick={() => select(index)}
                  aria-expanded={isOpen}
                  className={`h-full shrink-0 ${
                    isOpen ? "cursor-default" : "cursor-pointer"
                  }`}
                  tabIndex={isOpen ? -1 : 0}
                >
                  <span className="sr-only">{tab.label}</span>
                  <TabRail index={index} tab={tab} isOpen={isOpen} />
                </button>

                {/* Sem barra de rolagem interna: o texto preenche o painel e a
                    imagem cede a altura necessária ao conteúdo. */}
                <div className="t-tab-body flex h-full overflow-hidden px-10 py-8">
                  <TabBody
                    tab={tab}
                    isOpen={isOpen}
                    className="min-h-0 flex-1"
                  />
                </div>
              </div>
            );
          })}
        </div>

        {/* Mobile: o mesmo conteúdo em um acordeão vertical. */}
        <ol className="t-tab-stack mt-12 flex flex-col lg:hidden">
          {tabs.map((tab, index) => {
            const isOpen = index === openIndex;

            return (
              <li
                key={tab.key}
                className="t-tab-item"
                data-open={String(isOpen)}
              >
                <button
                  type="button"
                  onClick={() => select(index)}
                  aria-expanded={isOpen}
                  className="flex w-full items-center gap-4 px-5 py-4 text-left"
                >
                  <span
                    className={`font-domine text-2xl ${
                      isOpen ? "text-neutral-900" : "text-neutral-500"
                    }`}
                  >
                    {paneNumber(index)}
                  </span>
                  <span
                    className={`font-geist text-sm font-medium ${
                      isOpen ? "text-neutral-900" : "text-neutral-300"
                    }`}
                  >
                    {tab.label}
                  </span>
                </button>

                <div className="t-acc" data-open={String(isOpen)}>
                  <div className="t-acc-panel">
                    <div className="t-acc-panel-inner">
                      <TabBody
                        tab={tab}
                        isOpen={isOpen}
                        className="px-5 pb-6 [&>h3]:sr-only"
                      />
                    </div>
                  </div>
                </div>
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}
