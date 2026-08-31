import { Pause, Play } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";

/**
 * A recorded tour of the live Portal de Benefícios
 * (servicos.baita.testbeds.rnp.br), framed in a browser window.
 *
 * A recording rather than a replica, because it *is* the product: the
 * catalogue, the copy and the photos are the real ones, and the
 * portal's own hover states and route transitions come along for free.
 * A hand-built replica would drift from it and would need invented
 * content to fill the cards.
 *
 * Re-record with scripts/record-portal-tour.mjs whenever the portal
 * changes — it is a testbed, so its catalogue will.
 */

/**
 * H.264 in MP4, not WebM. WebM/VP8 is what the recorder emits and it
 * plays in Chrome and in Playwright's WebKit — but Playwright's WebKit
 * is not Safari, it has its own media stack, so that was never
 * evidence about Safari, and on a real Safari the file never loaded:
 * no autoplay, and the play button did nothing either. H.264 is the
 * one video codec every browser decodes. It also happens to be half
 * the size here.
 */
const TOUR = "/media/portal-tour-pt.mp4";
/** First frame of the same recording, so the still and the video can
 *  never show different framing. */
const POSTER = "/media/portal-tour-pt.jpg";

export function PortalScreen({
  variant,
}: {
  variant: "column" | "inline";
}) {
  const { t } = useTranslation();
  const ref = useRef<HTMLDivElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  // The section sits several screens down, and the recording is ~1.9MB.
  // Nothing is fetched until the visitor is on their way to it — the
  // poster carries the frame in the meantime.
  const [isNear, setIsNear] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    if (typeof IntersectionObserver === "undefined") {
      setIsNear(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        setIsNear(true);
        observer.disconnect();
      },
      // Close enough that it is the next thing on screen, far
      // enough that the poster is rarely what the visitor arrives to.
      { rootMargin: "300px" }
    );

    // Two frames before observing: ScrollTrigger inserts the pin
    // spacers for this section on its own pass, and until it has, the
    // page is short enough that this element sits just under the fold.
    // Observing immediately fired on that transient layout and fetched
    // the recording for visitors still at the top of the page.
    let frame = requestAnimationFrame(() => {
      frame = requestAnimationFrame(() => observer.observe(element));
    });

    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
    };
  }, []);

  // Plays unconditionally, prefers-reduced-motion included. That is a
  // deliberate exception to the rest of the page, which honours the
  // preference everywhere: this panel is the product demo and was
  // asked to loop on its own, and a paused frame reads as broken here
  // rather than as calm. The pause control below is the way out.
  //
  // Autoplay is still only a request — Safari refuses it in Low Power
  // Mode — so every path that ends up paused shows a play button.
  useEffect(() => {
    const video = videoRef.current;
    if (!video || !isNear) return;

    // Setting src after mount does not reliably re-arm the autoplay
    // attribute, so ask explicitly once the source is in place.
    video.play().catch(() => {});

    // If the browser refused, the first tap or click anywhere counts
    // as the gesture it was waiting for.
    const retry = () => {
      if (video.paused) video.play().catch(() => {});
    };
    document.addEventListener("pointerdown", retry, { once: true });
    return () => document.removeEventListener("pointerdown", retry);
  }, [isNear]);

  // Bound imperatively rather than through React's onPlaying/onPause
  // props: those did not fire here — the native events do, so the
  // button stayed on screen over a video that was already running.
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const sync = () => setIsPlaying(!video.paused);
    const events = ["play", "playing", "pause", "ended", "emptied"];
    events.forEach((name) => video.addEventListener(name, sync));
    sync();

    return () => events.forEach((name) => video.removeEventListener(name, sync));
  }, []);

  const toggle = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;
    if (video.paused) video.play().catch(() => {});
    else video.pause();
  }, []);

  return (
    <div ref={ref} className="t-screen-slot" data-variant={variant}>
      <figure className="t-screen-frame m-0">
        {/* The window chrome is markup, not part of the recording: the
            capture is only the viewport, and drawing the frame here
            keeps it crisp and lets it follow the page's own radii. */}
        <div className="t-screen-bar" aria-hidden="true">
          <span />
          <span />
          <span />
        </div>

        <div className="t-screen-stage">
          <video
            ref={videoRef}
            className="t-screen-video"
            // Any of these missing and iOS opens it fullscreen or
            // refuses to start: muted + playsInline are what make
            // autoplay legal.
            autoPlay
            muted
            loop
            playsInline
            // Not "none": Safari takes that literally and then never
            // autoplays. Laziness is the src gate above, not preload.
            preload="auto"
            poster={POSTER}
            aria-label={t("portalDemo.alt")}
            src={isNear ? TOUR : undefined}
          />

          <button
            type="button"
            onClick={toggle}
            className="t-screen-play"
            data-playing={String(isPlaying)}
            aria-label={t(isPlaying ? "portalDemo.pause" : "portalDemo.play")}
          >
            {isPlaying ? (
              <Pause className="h-4 w-4 fill-current" aria-hidden="true" />
            ) : (
              <Play className="h-5 w-5 fill-current" aria-hidden="true" />
            )}
          </button>
        </div>
      </figure>
    </div>
  );
}
