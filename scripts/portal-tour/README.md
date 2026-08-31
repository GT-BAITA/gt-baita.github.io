# Portal de Benefícios — recorded tour (parked)

A working, finished version of the solutions-section preview as a
**recorded walkthrough of the live portal** instead of a still. Parked
because the project is not ready to publish it yet, not because
anything is broken — it was verified playing in Chrome, WebKit and at
390px, with and without `prefers-reduced-motion`.

Nothing in this folder is referenced by the app or copied into `dist`.

## What is here

| File | What it is |
| --- | --- |
| `record-portal-tour.mjs` | Records the tour against the live portal and transcodes it. |
| `portal-tour-pt.mp4` | The recording it produced (H.264, 1280×980, 19s, 923KB). |
| `portal-tour-pt-poster.jpg` | First frame, used as the `<video poster>`. |
| `portal-screen-video.tsx` | The component that played it. |
| `portal-screen-video.css` | The play/pause control's styles. |

## The tour

Home → cursor travels to "Acessar Benefícios" and clicks → catalogue →
types "periódicos" in the filter, list narrows live to two results →
hovers a card → opens its detail page → scrolls → returns home, so the
loop seam is soft.

Playwright's recorder draws no cursor, so the script injects one that
follows the real mouse — the hovers in the video are genuine, not
faked.

## To bring it back

1. `mv portal-tour-pt.mp4 portal-tour-pt-poster.jpg ../../public/media/`
   (the poster is expected as `portal-tour-pt.jpg`).
2. Replace `src/components/home/demos/product-screen.tsx` with
   `portal-screen-video.tsx` (and route only the Benefits Portal card
   to it — the Management System card shares that component now).
3. Paste `portal-screen-video.css` back into `src/styles/global.css`,
   after the `.t-screen-stage` rules.
4. Re-add the `portalDemo.play` / `portalDemo.pause` keys to both
   locale files, and point the component's alt text at
   `screens.benefits.alt` — `portalDemo.alt` was renamed when the
   management screen joined it.

The window chrome (`.t-screen-frame`, `.t-screen-bar`,
`.t-screen-stage`) stayed in `global.css` — the still uses it too — and
the still is captured at the same 1280×980, so swapping one for the
other has no layout consequences.

## To re-record

```
npm i --no-save playwright ffmpeg-static
node scripts/portal-tour/record-portal-tour.mjs
```

Worth doing before any real launch: the portal is a **testbed**, so its
catalogue will have moved on. Two things to look at in whatever it
captures next —

- The catalogue's filter chips render in English on the Portuguese page
  ("Students (9)", "Teaching & Learning (8)"), as do the cards' category
  badges. That is a gap in the portal's own translations, and a
  recording puts it on the landing page.
- There is a placeholder entry called "Biblioteca Fictícia". The script
  searches for "periódicos" partly to keep it out of frame.

## Two things that cost time, so they are worth writing down

**H.264, never WebM.** Playwright's recorder emits WebM/VP8. It plays
in Chrome and in Playwright's WebKit — but Playwright's WebKit is not
Safari, it has its own media stack, so that is not evidence about
Safari. On real Safari the file never loaded: no autoplay, and the play
button did nothing either, because there was nothing decoded to play.
The script now transcodes to H.264, which also happens to be less than
half the size.

**The bundled ffmpeg cannot do it.** Playwright ships an ffmpeg built
`--disable-everything`, with libvpx and no H.264 encoder at all. Hence
the `ffmpeg-static` dependency, installed with `--no-save` so it never
enters `package.json`.
