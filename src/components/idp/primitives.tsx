import { useEffect, useRef, useState, type CSSProperties, type ReactNode, type RefObject } from "react";
import { useTranslation } from "react-i18next";
import { Dithering, type DitheringParams } from "@paper-design/shaders-react";
import { requestContact } from "@/lib/contact-request";
import { DITHER_CELL, readInk } from "@/lib/dither";
import { EYEBROW } from "@/lib/typography";
import { cn } from "@/lib/utils";

export function useReducedMotion() {
  const [reduce] = useState(
    () => window.matchMedia?.("(prefers-reduced-motion: reduce)").matches ?? false
  );
  return reduce;
}

/**
 * Revela os elementos `.rv` quando entram na tela. O atraso de cada um vem
 * da variável --i (ver idp.css). Sem IntersectionObserver ou com movimento
 * reduzido, `data-anim` nunca é ligado e tudo aparece de imediato.
 */
export function useReveal(rootRef: RefObject<HTMLElement | null>, reduceMotion: boolean) {
  useEffect(() => {
    const root = rootRef.current;
    if (!root || reduceMotion || !("IntersectionObserver" in window)) return;

    root.setAttribute("data-anim", "on");
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (!e.isIntersecting) continue;
          e.target.setAttribute("data-in", "1");
          io.unobserve(e.target);
        }
      },
      { rootMargin: "0px 0px -6% 0px", threshold: 0.08 }
    );
    root.querySelectorAll(".rv").forEach((el) => io.observe(el));

    return () => {
      io.disconnect();
      root.removeAttribute("data-anim");
    };
  }, [rootRef, reduceMotion]);
}

/**
 * O site usa HashRouter, então um href="#como" trocaria a rota em vez de
 * rolar até a seção. A rolagem é feita aqui; o scroll-margin-top das
 * seções compensa a barra fixa.
 */
export function scrollToId(id: string) {
  const reduce = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
  document
    .getElementById(id)
    ?.scrollIntoView({ block: "start", behavior: reduce ? "auto" : "smooth" });
}

/**
 * CTAs da página: levam ao formulário de contato do rodapé com a mensagem do
 * IdP já preenchida — a mesma do CTA do cabeçalho nesta rota.
 */
export function useRequestContact() {
  const { t } = useTranslation();
  return () => requestContact(t("solutions.card3.message"));
}

export function Jump({
  to,
  className,
  children,
}: {
  to: string;
  className?: string;
  children: ReactNode;
}) {
  return (
    <a
      href={`#${to}`}
      className={className}
      onClick={(e) => {
        e.preventDefault();
        scrollToId(to);
      }}
    >
      {children}
    </a>
  );
}

/** Índice de revelação em cascata (`--i`) para o CSS. */
export const rv = (i: number) => ({ "--i": i }) as CSSProperties;

/** Eyebrow das seções do IdP: o mesmo estilo das outras páginas. */
export function Kicker({
  children,
  reveal = 0,
  style,
}: {
  children: ReactNode;
  reveal?: number | false;
  style?: CSSProperties;
}) {
  return (
    <p
      className={cn("kicker", EYEBROW, reveal !== false && "rv")}
      style={reveal === false ? style : { ...rv(reveal), ...style }}
    >
      {children}
    </p>
  );
}

/**
 * Painéis pontilhados do IdP. Ondas e ripple usam o <Dithering> do Paper
 * Shaders (GPU); o orbe fica no motor próprio (use-dither.ts),
 * que reproduz o mock com mais fidelidade. O grão (Bayer 8×8, pixel de 3px)
 * e a cor (tokens --ink e --dither-alpha) são os mesmos nos dois.
 */
// `ink`: fração do alfa do pixel aceso. O Paper preenche as formas por
// inteiro; o mock era esparso, então os painéis atrás de texto ficam fracos.
const PAPER_SHAPE = {
  wave: { shape: "wave", scale: 1.1, speed: 0.35, ink: 0.32 },
  ripple: { shape: "ripple", scale: 1.25, speed: 0.5, offsetY: 0.55, ink: 0.22 },
} satisfies Record<string, Partial<DitheringParams> & { ink: number }>;

export function Dither({
  mode,
  style,
}: {
  mode: keyof typeof PAPER_SHAPE | "orb";
  style?: CSSProperties;
}) {
  if (mode === "orb")
    return <canvas className="dither" data-dither={mode} aria-hidden="true" style={style} />;
  return <PaperDither mode={mode} style={style} />;
}

function PaperDither({
  mode,
  style,
}: {
  mode: keyof typeof PAPER_SHAPE;
  style?: CSSProperties;
}) {
  const { speed, ink: inkScale, ...shape } = PAPER_SHAPE[mode];
  const ink = useInkColor(inkScale);
  const reduce = useReducedMotion();
  const near = useNearViewport();
  // Cada painel cria um contexto WebGL e compila um shader: só monta quando
  // chega perto da tela, não todos de uma vez na entrada da página. A cor
  // também só existe depois que o tema da rota foi aplicado.
  if (!ink || !near.ready) return <div ref={near.ref} className="dither" aria-hidden="true" style={style} />;

  return (
    <Dithering
      className="dither"
      aria-hidden="true"
      style={style}
      colorBack="#00000000"
      colorFront={ink}
      type="8x8"
      size={DITHER_CELL}
      speed={reduce ? 0 : speed}
      {...shape}
    />
  );
}

/** Liga de vez quando o elemento chega a 400px da área visível. */
function useNearViewport() {
  const ref = useRef<HTMLDivElement>(null);
  const [ready, setReady] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (ready || !el) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (!e.isIntersecting) return;
        setReady(true);
        io.disconnect();
      },
      { rootMargin: "400px 0px" }
    );
    io.observe(el);
    return () => io.disconnect();
  });
  return { ref, ready };
}

/** Cor do pixel aceso (--ink + --dither-alpha), lida depois do tema aplicado. */
function useInkColor(scale: number) {
  const [ink, setInk] = useState<string | null>(null);
  useEffect(() => {
    const [r, g, b, a] = readInk(document.documentElement);
    setInk(`rgba(${r}, ${g}, ${b}, ${((a / 255) * scale).toFixed(3)})`);
  }, [scale]);
  return ink;
}
