import { useRef, type CSSProperties } from "react";
import { Button, buttonVariants } from "@/components/ui/button";
import { STAR_NODES, useHeroBackdrop } from "@/components/shared/hero-dither";
import { useIdpContent } from "./content";
import { ChevronRight } from "./icons";
import { Jump, rv, useRequestDemo } from "./primitives";

// Rótulos sobre os nós principais da estrela (os 9 primeiros de
// STAR_NODES, na mesma ordem). Os da borda inferior sobem para não cortar.
const NODE_POS: CSSProperties[] = STAR_NODES.slice(0, 9).map((p) => ({
  left: `${p.x * 100}%`,
  top: `${p.y * 100}%`,
  ...(p.y > 0.8 ? { transform: "translate(-50%,-36px)" } : {}),
}));

export function HeroSection() {
  const c = useIdpContent().hero;
  const requestDemo = useRequestDemo();
  const headRef = useRef<HTMLDivElement>(null);
  const vizRef = useRef<HTMLDivElement>(null);
  // Fundo pontilhado (no Layout), compartilhado com a página inicial: aqui
  // os pontos convergem no centro de .hero-viz.
  useHeroBackdrop({ layout: "star", anchorRef: vizRef, quietRefs: [headRef] });

  return (
    <header id="top" className="hero">
      <div className="wrap">
        <div className="hero-head" ref={headRef}>
          <h1 className="h1 rv" style={rv(0)}>
            {c.title}
          </h1>
          <p className="lead rv" style={rv(1)}>
            {c.lead}
          </p>
          <div className="ctas rv" style={rv(2)}>
            <Button size="lg" onClick={requestDemo}>
              {c.primary}
            </Button>
            <Jump to="como" className={buttonVariants({ variant: "secondary", size: "lg" })}>
              {c.secondary}
              <ChevronRight />
            </Jump>
          </div>
        </div>

        <div className="hero-viz rv" style={rv(4)} role="img" aria-label={c.vizLabel} ref={vizRef}>
          {c.nodes.map((label, i) => (
            <span key={i} className="nl" style={NODE_POS[i]}>
              {label}
            </span>
          ))}
          <span className="nl nl-c" style={{ left: "50%", top: "50%" }}>
            {c.center}
          </span>
        </div>
      </div>
    </header>
  );
}
