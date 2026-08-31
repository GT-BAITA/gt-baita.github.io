import { useLayoutEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ScrollSmoother } from "gsap/ScrollSmoother";

gsap.registerPlugin(ScrollTrigger, ScrollSmoother);

/**
 * Adds inertial smoothing to the whole page.
 *
 * ScrollSmoother works by translating `#smooth-content` inside a
 * fixed-height `#smooth-wrapper`, so anything that must stay put —
 * the header, the consent notice — has to live OUTSIDE the wrapper.
 * A `position: fixed` element inside it resolves against the
 * transformed ancestor and scrolls away with the page.
 *
 * Skipped entirely under prefers-reduced-motion: smoothing decouples
 * the page from the input device, which is exactly what that setting
 * asks us not to do. Touch is left native for the same reason.
 */
export function useSmoothScroll() {
  useLayoutEffect(() => {
    const mm = gsap.matchMedia();

    mm.add("(prefers-reduced-motion: no-preference)", () => {
      const smoother = ScrollSmoother.create({
        wrapper: "#smooth-wrapper",
        content: "#smooth-content",
        smooth: 1,
        // Pointer devices only. On touch the OS already owns the
        // scroll feel, and overriding it reads as broken.
        smoothTouch: 0,
        // Keeps the pinned sections in step with the smoothed
        // position instead of the raw one.
        ignoreMobileResize: true,
      });

      return () => smoother.kill();
    });

    return () => mm.revert();
  }, []);
}
