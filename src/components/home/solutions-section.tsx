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
 * "O que estamos construindo" — Figma node 1058:35764.
 *
 * Desktop: the section is one viewport tall per card and pins its
 * content, so scrolling rolls the list — the active card expands, the
 * others recede, and the product demo on the right swaps to match.
 *
 * Below lg (or under prefers-reduced-motion) the pinning is off and
 * the same expand is driven by tapping instead, so nothing ever
 * reflows under the reader mid-sentence. There the demo also moves
 * inside the expanded card, trailing the CTA, since there is no
 * second column to hold it.
 *
 * Both modes share one `activeIndex`; only the driver differs.
 */

type Solution = {
  key: string;
  badge: string;
  title: string;
  description: string;
  cta?: {
    label: string;
    /** External URL, or "" when the CTA opens the contact form. */
    href: string;
    /** Prefills the form's Message field. Implies the contact form. */
    message?: string;
    /** Filled for the primary action, outlined for the secondary one. */
    variant: "primary" | "outline";
  };
};

const PORTAL_URL = "https://servicos.baita.testbeds.rnp.br/";

/**
 * Viewports of page height per card. Below the benefits section's 1.15
 * because there is one card fewer and the expand is a 400ms tween
 * rather than 700ms, so each card needs less dwell to read as settled.
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

/** Which screen belongs to which card. */
const SCREEN_FOR: Record<string, "benefits" | "management" | "idp"> = {
  portal: "benefits",
  management: "management",
  idp: "idp",
};

/**
 * The product screen for a card, in its browser window.
 *
 * `variant` rather than a className, because the two placements want
 * opposite sizing: the desktop column hands the window a box to fill,
 * while inside a mobile card it sets its own height from the capture's
 * own shape.
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

  // A contact CTA is a button, not a link: the app mounts a HashRouter,
  // so an "#contact-form" href would be read as a route.
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
      {/* Entrance opacity lives on the <li>, the active/inactive
          dimming on the card — two independent opacities that would
          otherwise fight over the same element. */}
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

                  {/* t-demo-inline, not an `lg:hidden` utility — see the
                      note on that class in global.css. */}
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

  // Scrubbed hand-off: the card that is opening and the one closing
  // both move with the scroll, so the pinned stretch never sits still
  // waiting for a discrete swap.
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

  // The open card is whichever panel track is tallest, so the badge
  // colours and the rail can never disagree with the geometry.
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

  // Clicking scrolls to the middle of the window where the item is
  // whole. Sharing this with the timeline is the point of
  // scrub-schedule: the two disagreeing is what froze item 0 half open.
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

  // Tap drives the list when the scroll stagger is off. First card
  // open by default, exactly one open at a time in both modes.
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

          {/* Demo column: panels are stacked and cross-faded, so the
              swap has no layout step. When the stagger is off the demo
              rides inside the expanded card instead. */}
          {/* Rendered unconditionally: the timeline is built inside the
              matchMedia callback, and anything gated on isPinned does
              not exist yet at that point — its tweens would silently
              never be created. `hidden lg:block` already keeps it off
              small screens. */}
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
