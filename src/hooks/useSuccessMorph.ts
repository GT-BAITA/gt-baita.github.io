import { useEffect, useRef, useState } from "react";

/**
 * Choreographs the newsletter form → success banner morph.
 *
 * Forward: the fields collapse (400ms) while the CTA pill travels up
 * and becomes a check badge, then the Obrigado block staggers in.
 * Reverse: the block fades out as one (200ms), then the fields reopen.
 *
 * Both panels open and close on the same clock. The card's height is
 * never set — it follows the two grid tracks — so the tracks have to
 * move together for it to read as one gesture: with a shared easing
 * curve E the height is `full − net · E(t)`, which is monotonic. Open
 * the second panel after the first has closed and the card visibly
 * undershoots its final height by the difference, then grows back.
 * The text is held back by `is-shown` instead, which costs no height.
 *
 * Durations are read from the CSS custom properties so the timers stay
 * in sync with the values in global.css.
 */

const HIDE_DURATION = 200; // .t-stagger.is-hiding, fixed by the snippet

function readDuration(name: string, fallback: number) {
  if (typeof window === "undefined") return fallback;

  const raw = getComputedStyle(document.documentElement)
    .getPropertyValue(name)
    .trim();

  if (!raw) return fallback;
  const value = parseFloat(raw);
  if (Number.isNaN(value)) return fallback;

  return raw.endsWith("ms") ? value : value * 1000;
}

export function useSuccessMorph(isSucceeded: boolean) {
  // `phase` lags isSucceeded on the way back: it drives the card's
  // padding and the CTA, both of which affect height, so it has to
  // flip on the same tick as the grid tracks. Reading isSucceeded
  // directly starts the padding 200ms early and the card dips well
  // below its final height before growing back.
  const [phase, setPhase] = useState<"form" | "success">("form");
  const [fieldsOpen, setFieldsOpen] = useState(true);
  const [messageOpen, setMessageOpen] = useState(false);
  const [messageState, setMessageState] = useState<"" | "is-shown" | "is-hiding">("");

  const checkRef = useRef<HTMLSpanElement | null>(null);
  const messageRef = useRef<HTMLDivElement | null>(null);
  const isFirstRun = useRef(true);

  // Calibrate the stroke-draw to this path's real length, so the
  // checkmark neither pre-reveals nor over-draws.
  useEffect(() => {
    const path = checkRef.current?.querySelector("path");
    if (!path) return;

    const length = Math.ceil(path.getTotalLength());
    path.style.strokeDasharray = String(length);
    path.style.strokeDashoffset = String(length);
  }, []);

  useEffect(() => {
    if (isFirstRun.current) {
      isFirstRun.current = false;
      return;
    }

    if (isSucceeded) {
      setPhase("success");
      setFieldsOpen(false);
      setMessageOpen(true);

      const collapse = readDuration("--duration-slow", 400);
      const timer = window.setTimeout(() => setMessageState("is-shown"), collapse);

      return () => window.clearTimeout(timer);
    }

    setMessageState("is-hiding");

    const timer = window.setTimeout(() => {
      setPhase("form");
      setMessageOpen(false);
      setMessageState("");
      setFieldsOpen(true);
    }, HIDE_DURATION);

    return () => window.clearTimeout(timer);
  }, [isSucceeded]);

  // The block is already in the DOM — its height is what the card
  // tweens into — so aria-live has nothing to announce. Move focus
  // instead, since the form the user was in is gone. This has to wait
  // for the render that clears `inert`: focusing into an inert
  // subtree fails silently and leaves focus on <body>.
  useEffect(() => {
    if (messageState !== "is-shown") return;
    messageRef.current?.focus({ preventScroll: true });
  }, [messageState]);

  return { phase, fieldsOpen, messageOpen, messageState, checkRef, messageRef };
}
