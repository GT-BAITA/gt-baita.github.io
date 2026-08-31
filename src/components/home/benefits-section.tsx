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
 * "Feito para quem move a federação" — Figma node 1058:37302.
 *
 * Desktop: four panes in a row, one open at a time. The open pane
 * takes the width the collapsed rails leave over; the rest stay as
 * dark vertical rails showing their number and a rotated label.
 * Scrolling through the pinned section shuffles which pane is open —
 * same driver as the solutions section above — and clicking a rail
 * jumps to that pane's scroll offset.
 *
 * Below lg the row becomes a vertical accordion — a 90px rail per
 * pane leaves nothing readable on a phone — reusing the same tap
 * behaviour as the solutions section above it.
 */

/**
 * `body` has a budget of ~260 characters. The pane is a fixed box on a
 * pinned viewport, so anything longer does not scroll — it eats the
 * image's height, and past a point the image is dropped entirely.
 * Longest today is tab1 at 254.
 */
type Tab = {
  key: string;
  label: string;
  body: string;
  /** Prefills the contact form's Message field for this audience. */
  message: string;
  image?: string;
};


/**
 * Viewports of page height per tab. At 1 each tab got ~675px of travel
 * on a 900px viewport — less than a screen, so one trackpad flick
 * crossed a whole tab. 1.5 fixed that but made the section 5400px of
 * page. 1.15 keeps each tab just over a screen (~810px) while cutting
 * ~1250px of scrolling out of the section.
 */
const VIEWPORTS_PER_TAB = 1.15;

/** Timeline schedule, in units of one tab. */

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

/** The dark rail: number on top, rotated label on the bottom. */
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

  // One unit of timeline time per tab. The hand-offs start almost
  // immediately and are spaced so the row is in motion for ~70% of the
  // pin: a long static stretch right after the pin engages is exactly
  // what reads as the page jamming.
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

        // ease: "none" — the scroll position is the easing. Any curve
        // here would make the geometry lead or trail the finger.
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

      // Pin the timeline's length to one unit per tab.
      tl.set({}, {}, panes.length);
    },
    []
  );

  // The open tab is whichever pane currently has the most grow, so the
  // label and colours can never disagree with the geometry.
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

  // Clicking scrolls to the middle of the window where the item is
  // whole. Sharing this with the timeline is the point of
  // scrub-schedule: the two disagreeing is what froze item 0 half open.
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

  // Tap drives the list when the pinned scroll is off.
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

        {/* Desktop: four panes side by side, one open. */}
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

                {/* No inner scrollbar: the body fills the pane and the
                    image gives up whatever height the text needs. */}
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

        {/* Mobile: the same content as a vertical accordion. */}
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
