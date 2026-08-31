import { useCallback, useLayoutEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";
import { ScrollSmoother } from "gsap/ScrollSmoother";

gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

/**
 * Pins a section with ScrollTrigger and turns its scroll progress into
 * a discrete active index, so a fixed viewport can roll through N items.
 *
 * Replaces a hand-rolled `position: sticky` + scroll listener. The pin
 * has to come from ScrollTrigger rather than CSS because ScrollSmoother
 * puts the page inside a transformed wrapper, and native sticky resolves
 * against that wrapper — which never scrolls — so it silently stops
 * pinning.
 *
 * Progress is written to the DOM as a custom property instead of state:
 * a React render per scroll frame to move one element is wasted work.
 */

/** Deadband around each boundary, as a fraction of one item's zone. */
const HYSTERESIS = 0.06;

/** Ceiling on how long a click-driven jump suppresses scroll updates. */
const JUMP_TIMEOUT = 1500;

/**
 * Quiet time after the reader stops scrolling before the section
 * settles onto the nearest item.
 *
 * Counted from the *native* scroll position going quiet, not from
 * ScrollTrigger's updates. ScrollSmoother keeps easing the page for
 * close to a second after the wheel stops and every one of those
 * frames is an update, so waiting for those to stop added that whole
 * second to the wait before this timer even started.
 */
const SETTLE_DELAY = 90;

/** Close enough to a rest point that settling would not be visible. */
const SETTLE_EPSILON = 0.012;

/**
 * How far back into the item they came from the reader has to be, as a
 * fraction of the gap, to be put back there rather than carried on.
 *
 * A quarter, against the three quarters it leaves for going on, so
 * the two are deliberately uneven: scrolling down should mean the next
 * item rather than a tug-of-war with the one behind you. At an even
 * half — plain "nearest" — a click wheel could never win that, since
 * one notch moves far less than half a gap.
 *
 * It went 0.12 → 0.25 because an eighth of a gap is only about 140px
 * of scroll here, so two notches on the way into the section carried
 * the reader straight past the first card.
 */
const RETURN_TOLERANCE = 0.25;

/**
 * How long input has to have stopped before a small, undecided
 * position is settled anyway.
 *
 * A decisive flick is acted on at SETTLE_DELAY and never waits for
 * this. This is for the opposite input: a click wheel, whose notches
 * move a fraction of a gap and arrive a couple of hundred ms apart.
 * Snapping between those notches undoes every one of them and the
 * section becomes impossible to scroll through, so while input is
 * still arriving small displacements are left alone to accumulate.
 */
const INPUT_SETTLED = 500;

/**
 * Glide length for the fallback path only. With ScrollSmoother present
 * — which is every real page here — the smoother owns the curve, and
 * measured that way the release runs 0.18 → 0.24 → 0.10 → 0.03 → 0.006
 * of progress per 200ms: one peak, then a steady decay into the
 * anchor, which is the coasting stop this was after.
 */
const SETTLE_DURATION = 0.3;

/**
 * Fallback path only, as above. Decelerating only, with no ease-in.
 * Measured, per 100ms of progress
 * after release: power2.inOut ran 0.070 → 0.0005 → 0.003 → 0.013,
 * i.e. it stalled dead for a fifth of a second before picking up
 * again, because an ease-in starts from zero velocity while the page
 * is still moving. sine.inOut stalled the same way. power2.out goes
 * 0.065 → 0.033 → 0.017 → 0.009 → 0, taking over at very nearly the
 * speed the scroll already had and coasting down from there — which
 * is what "keeps sliding to the next anchor" actually feels like. The
 * soft end is the ease-out.
 */
const SETTLE_EASE = "power2.out";

/** Ceiling on how long a settle suppresses scheduling another one. */
const SETTLE_TIMEOUT = 1100;

export function useScrollPin(
  count: number,
  {
    viewportsPerItem = 1,
    minWidth = 1024,
    buildTimeline,
    deriveIndex,
    progressForIndex,
  }: {
    viewportsPerItem?: number;
    minWidth?: number;
    /**
     * Builds the scrubbed animation. The timeline is `count` units
     * long — one per item — so timeline time and the index derivation
     * below share a scale. Put each transition inside a unit and leave
     * the rest as dwell.
     */
    buildTimeline?: (tl: gsap.core.Timeline, root: HTMLElement) => void;
    /**
     * Reads the active index off the scrubbed state instead of off raw
     * progress. With a freely scheduled timeline the two would drift
     * apart, and the labels would flip while the geometry was still
     * mid-hand-off.
     */
    deriveIndex?: (root: HTMLElement) => number;
    /**
     * Progress (0..1) a click on `index` should scroll to. Defaults to
     * the middle of an even split, which is only right when the items
     * are evenly spread across the timeline.
     */
    progressForIndex?: (index: number) => number;
  } = {}
) {
  const sectionRef = useRef<HTMLElement | null>(null);
  const pinRef = useRef<HTMLDivElement | null>(null);
  const progressRef = useRef<HTMLElement | null>(null);

  const activeRef = useRef(0);
  const triggerRef = useRef<ScrollTrigger | null>(null);
  // Set while a click is animating the scroll to a target item.
  // Without it onUpdate keeps deriving the index on the way there, so
  // jumping from 01 to 04 flashes 02 and 03 in passing.
  const jumpRef = useRef<{ index: number; expires: number } | null>(null);

  // Latest scroll progress, plus the pending settle. Refs rather than
  // state: these change every frame and drive no rendering.
  const progressValueRef = useRef(0);
  const settleTimerRef = useRef<number | null>(null);
  const isSettlingRef = useRef(false);
  /** Which way the reader is going, and where they were last frame. */
  const directionRef = useRef(1);
  const lastScrollRef = useRef(0);
  const settleTweenRef = useRef<gsap.core.Tween | null>(null);
  /** When the reader last touched the wheel, screen or keyboard. */
  const lastInputAtRef = useRef(0);

  const [activeIndex, setActiveIndex] = useState(0);
  const [isEnabled, setIsEnabled] = useState(false);

  // Read inside the effect rather than listed as a dependency: the
  // effect builds and pins a ScrollTrigger, and re-running it on a
  // changed callback identity would tear the pin down mid-scroll.
  const progressForIndexRef = useRef(progressForIndex);
  progressForIndexRef.current = progressForIndex;

  useLayoutEffect(() => {
    const section = sectionRef.current;
    const pin = pinRef.current;
    if (!section || !pin) return;

    const mm = gsap.matchMedia();

    mm.add(
      {
        pinned: `(min-width: ${minWidth}px) and (prefers-reduced-motion: no-preference)`,
      },
      (context) => {
        if (!context.conditions?.pinned) return;

        setIsEnabled(true);

        // A pinned section stops the page dead: the scroll keeps taking
        // input while nothing translates, which reads as the page
        // jamming. Scrubbing the geometry to scroll progress gives back
        // motion proportional to the input for every pixel.
        const tl = buildTimeline
          ? gsap.timeline({ paused: true })
          : null;
        if (tl && buildTimeline) buildTimeline(tl, pin);

        // Where each item sits fully open — the same positions a click
        // scrolls to. Sharing them is the point: released mid-hand-off,
        // the scroll settles exactly where clicking that item lands.
        const resolve = progressForIndexRef.current;
        const restPoints = Array.from({ length: count }, (_, i) =>
          resolve ? resolve(i) : (i + 0.5) / count
        ).sort((a, b) => a - b);
        const firstRest = restPoints[0];
        const lastRest = restPoints[restPoints.length - 1];

        const clearSettle = () => {
          if (settleTimerRef.current === null) return;
          window.clearTimeout(settleTimerRef.current);
          settleTimerRef.current = null;
        };

        /**
         * Eases onto the nearest item once the scroll has come to rest,
         * so letting go mid-hand-off never leaves a card half open.
         *
         * Hand-rolled rather than ScrollTrigger's own `snap`. That one
         * calls `snapTo` with progress values from outside the
         * trigger's range — it was handed −0.37 and −1.17 during load —
         * and acts on whatever comes back, so a "leave it alone" return
         * of the same value scrolled the page clean off the top. Going
         * through the smoother is also exactly what a click already
         * does, so both land identically by construction.
         */
        const settle = () => {
          settleTimerRef.current = null;

          const trigger = triggerRef.current;
          if (!trigger || !trigger.isActive) return;
          // A click is already animating towards its own target.
          if (jumpRef.current || isSettlingRef.current) return;

          // Read from the native scroll rather than the trigger's own
          // progress: the smoother is still gliding towards this
          // position, so it is the destination, while `progress` is
          // wherever the easing has got to so far. Targeting the
          // destination is what lets the settle start early without
          // picking the item the reader was already leaving.
          const span = trigger.end - trigger.start;
          if (span <= 0) return;
          const value = Math.min(
            1,
            Math.max(0, (window.scrollY - trigger.start) / span)
          );
          // Outside the outermost rest points nothing is mid-transition
          // — the first and last items are already whole there — so
          // leave the reader alone as they enter or leave the section.
          if (value <= firstRest || value >= lastRest) return;

          // Which anchor to land on is decided by direction, not by
          // distance. Nearest alone is only right for a long flick; for
          // anything shorter the nearest anchor is the one the reader
          // is trying to leave, so it drags them back.
          //
          // Derived from the position each time rather than remembered:
          // a stored "anchor we came from" is wrong the moment a glide
          // is interrupted, and an interrupted glide left it holding
          // the abandoned *target*. The next settle then read the page
          // as being behind where it started, decided the reader was
          // going backwards, and returned them a step — on screen, the
          // card advancing and then snapping back.
          const direction = directionRef.current;
          const behind = restPoints.filter((point) =>
            direction > 0 ? point <= value : point >= value
          );
          const from =
            behind.length === 0
              ? restPoints[direction > 0 ? 0 : restPoints.length - 1]
              : direction > 0
                ? Math.max(...behind)
                : Math.min(...behind);

          let index = restPoints.indexOf(from);
          const ahead = index + direction;
          if (ahead >= 0 && ahead < restPoints.length) {
            const gap = Math.abs(restPoints[ahead] - from);
            if (Math.abs(value - from) > gap * RETURN_TOLERANCE) {
              index = ahead;
            }
          }

          const nearest = restPoints[index];
          if (Math.abs(nearest - value) < SETTLE_EPSILON) return;

          // `index` only moved off `from` if the reader cleared the
          // tolerance, so this is "they have decided where they are
          // going". Undecided and still scrolling means leaving them
          // be — but check again once the input really has stopped,
          // otherwise a half-open card could sit there for good.
          const hasCommitted = nearest !== from;
          const sinceInput = Date.now() - lastInputAtRef.current;
          if (!hasCommitted && sinceInput < INPUT_SETTLED) {
            settleTimerRef.current = window.setTimeout(
              settle,
              INPUT_SETTLED - sinceInput + 20
            );
            return;
          }

          const target = trigger.start + span * nearest;

          isSettlingRef.current = true;
          window.setTimeout(() => {
            isSettlingRef.current = false;
          }, SETTLE_TIMEOUT);
          settleTweenRef.current?.kill();

          const landed = () => {
            settleTweenRef.current = null;
            isSettlingRef.current = false;
          };

          // Handed to the smoother, which is the only thing that owns
          // the scroll position while it is running — the same call the
          // click-to-card path has always used.
          //
          // Both alternatives were measured and both fight it. Writing
          // `scrollTo(v, false)` frame by frame from a tween seeded on
          // `smoother.scrollTop()` uses the *smoothed* value, which
          // lags, while the smoother's own lerp is still running
          // towards the native one: on a flick the page glided to
          // progress 0.904, snapped back to 0.628 as the tween's writes
          // won, then played the transition again. Tweening the native
          // scroll instead is filtered by the smoother — 0.85s of tween
          // moved it 34px of 496 — leaving a visible plateau partway.
          const smoother = ScrollSmoother.get();
          if (smoother) {
            smoother.scrollTo(target, true);
            window.setTimeout(landed, SETTLE_TIMEOUT);
            return;
          }

          settleTweenRef.current = gsap.to(window, {
            scrollTo: { y: target, autoKill: false },
            duration: SETTLE_DURATION,
            ease: SETTLE_EASE,
            overwrite: true,
            onComplete: landed,
          });
        };

        const trigger = ScrollTrigger.create({
          trigger: section,
          start: "top top",
          // The whole section is `count * viewportsPerItem` viewports
          // tall; one of those is spent standing still while pinned.
          end: () =>
            `+=${count * viewportsPerItem * window.innerHeight - window.innerHeight}`,
          pin,
          pinSpacing: true,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            progressRef.current?.style.setProperty(
              "--progress",
              String(self.progress)
            );

            progressValueRef.current = self.progress;

            // Drive the scrub directly off progress rather than
            // ScrollTrigger's own `scrub`, so the smoother's eased
            // position is what the geometry follows.
            tl?.progress(self.progress);

            const position = self.progress * count;
            const current = activeRef.current;

            // Hold the current item until the position clears its zone
            // by the deadband, so jitter parked on a boundary does not
            // flip the item back and forth. When the geometry is
            // scrubbed, read the index off it instead — the two would
            // otherwise disagree mid hand-off.
            const next = deriveIndex
              ? deriveIndex(pin)
              : position < current - HYSTERESIS ||
                  position > current + 1 + HYSTERESIS
                ? Math.min(count - 1, Math.max(0, Math.floor(position)))
                : current;

            // Mid-jump: hold the target open and let the scroll pass
            // under it, so the items in between never flash. This
            // release has to run for BOTH paths — when it only ran on
            // the non-scrubbed one, any click left the jump latched and
            // the label froze while the geometry carried on.
            const jump = jumpRef.current;
            if (jump) {
              if (next === jump.index || Date.now() > jump.expires) {
                jumpRef.current = null;
              }
              return;
            }

            if (next !== current) {
              activeRef.current = next;
              setActiveIndex(next);
            }
          },
          // A CTA elsewhere on the page can scroll clean past this
          // section, so a jump in flight would never reach its target.
          // Leaving resets where "here" was, so coming back in does not
          // measure the reader's first nudge against a stale rest point.
          onLeave: () => {
            jumpRef.current = null;
            clearSettle();
          },
          onLeaveBack: () => {
            jumpRef.current = null;
            clearSettle();
          },
        });

        triggerRef.current = trigger;

        // Grabbing the page again cancels both the pending settle and
        // any settle in flight, so it never pulls against a live scroll.
        const noteInput = () => {
          lastInputAtRef.current = Date.now();
        };
        window.addEventListener("wheel", noteInput, { passive: true });
        window.addEventListener("touchmove", noteInput, { passive: true });
        window.addEventListener("keydown", noteInput);

        const cancelJump = () => {
          lastInputAtRef.current = Date.now();
          jumpRef.current = null;
          isSettlingRef.current = false;
          clearSettle();
          settleTweenRef.current?.kill();
          settleTweenRef.current = null;
        };
        window.addEventListener("wheel", cancelJump, { passive: true });
        window.addEventListener("touchstart", cancelJump, { passive: true });

        const scheduleSettle = () => {
          const y = window.scrollY;
          if (y !== lastScrollRef.current) {
            directionRef.current = y > lastScrollRef.current ? 1 : -1;
            lastScrollRef.current = y;
          }
          clearSettle();
          settleTimerRef.current = window.setTimeout(settle, SETTLE_DELAY);
        };
        window.addEventListener("scroll", scheduleSettle, { passive: true });

        return () => {
          tl?.kill();
          clearSettle();
          settleTweenRef.current?.kill();
          settleTweenRef.current = null;
          isSettlingRef.current = false;
          window.removeEventListener("wheel", cancelJump);
          window.removeEventListener("touchstart", cancelJump);
          window.removeEventListener("scroll", scheduleSettle);
          window.removeEventListener("wheel", noteInput);
          window.removeEventListener("touchmove", noteInput);
          window.removeEventListener("keydown", noteInput);
          triggerRef.current = null;
          setIsEnabled(false);
          activeRef.current = 0;
          setActiveIndex(0);
        };
      }
    );

    return () => mm.revert();
  }, [count, viewportsPerItem, minWidth, buildTimeline, deriveIndex]);

  /** Scrolls to the offset that makes `index` the active item. */
  const scrollToIndex = useCallback(
    (index: number) => {
      const trigger = triggerRef.current;
      if (!trigger) return;

      const progress = progressForIndex
        ? progressForIndex(index)
        : (index + 0.5) / count;
      const target =
        trigger.start + (trigger.end - trigger.start) * progress;

      // Open the target immediately and let the scroll catch up, so the
      // items in between never flash open on the way there.
      activeRef.current = index;
      setActiveIndex(index);
      jumpRef.current = { index, expires: Date.now() + JUMP_TIMEOUT };

      const smoother = ScrollSmoother.get();
      if (smoother) {
        smoother.scrollTo(target, true);
        return;
      }

      gsap.to(window, {
        scrollTo: { y: target, autoKill: true },
        duration: 0.6,
        ease: "power2.inOut",
        overwrite: true,
      });
    },
    [count, progressForIndex]
  );

  return {
    sectionRef,
    pinRef,
    progressRef,
    activeIndex,
    isEnabled,
    scrollToIndex,
  };
}
