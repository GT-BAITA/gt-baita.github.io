import { motion } from "motion/react";
import { useEffect, useState } from "react";
import { Books, Cap, Globe, Grid, Monitor, Shield } from "./icons";

/**
 * Fase 4 do "Como funciona", como alegoria: uma telinha de login por
 * sistema, espalhadas e tortas, que deslizam para o centro e viram uma só.
 * Sem texto nem detalhes de formulário — só o símbolo de cada sistema, dois
 * campos e o botão. Embaixo da tela única, os mesmos símbolos em fila: um
 * login para todos.
 *
 * Toca ao montar (a janela troca o conteúdo a cada etapa, então volta a
 * tocar sempre que a fase 4 entra). Com movimento reduzido, mostra direto o
 * estado final.
 */

type Icon = typeof Cap;

/** Telinhas soltas: deslocamento do centro (px), inclinação e símbolo. */
const SCREENS: { x: number; y: number; r: number; Icon: Icon }[] = [
  { x: -146, y: -84, r: -7, Icon: Cap },
  { x: 0, y: -112, r: -2, Icon: Books },
  { x: 142, y: -80, r: 6, Icon: Monitor },
  { x: -136, y: 78, r: 5, Icon: Globe },
  { x: 8, y: 108, r: 3, Icon: Grid },
  { x: 146, y: 72, r: -5, Icon: Cap },
];
/** Símbolos na fila embaixo da tela única (sem repetir). */
const ROW: Icon[] = [Cap, Books, Monitor, Globe, Grid];

const EASE = [0.22, 1, 0.36, 1] as const;
/** Quanto tempo as telinhas ficam espalhadas antes de se juntar (ms). */
const HOLD = 900;

function Screen({ Icon }: { Icon: Icon }) {
  return (
    <>
      <span className="ml-ico">
        <Icon />
      </span>
      <i />
      <i />
      <b />
    </>
  );
}

export function LoginMerge({ label, reduce }: { label: string; reduce: boolean }) {
  const [merged, setMerged] = useState(reduce);

  useEffect(() => {
    if (reduce) return;
    const t = window.setTimeout(() => setMerged(true), HOLD);
    return () => window.clearTimeout(t);
  }, [reduce]);

  const instant = { duration: 0 };

  return (
    <div className="ml-stage" role="img" aria-label={label}>
      {SCREENS.map(({ x, y, r, Icon }, i) => (
        <motion.div
          key={i}
          className="ml"
          initial={reduce ? false : { x, y, rotate: r, opacity: 0, scale: 0.85 }}
          animate={
            merged
              ? { x: 0, y: 0, rotate: 0, scale: 0.92, opacity: 0 }
              : { x, y, rotate: r, opacity: 1, scale: 1 }
          }
          transition={
            reduce
              ? instant
              : merged
                ? {
                    default: { duration: 0.7, ease: EASE, delay: i * 0.04 },
                    // Somem só no fim do caminho, já em cima da tela única.
                    opacity: { duration: 0.2, delay: 0.5 + i * 0.04 },
                  }
                : { duration: 0.45, ease: EASE, delay: i * 0.06 }
          }
        >
          <Screen Icon={Icon} />
        </motion.div>
      ))}

      <motion.div
        className="ml big"
        initial={reduce ? false : { opacity: 0, scale: 0.9 }}
        animate={merged ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.9 }}
        transition={reduce ? instant : { duration: 0.45, ease: EASE, delay: merged ? 0.5 : 0 }}
      >
        <Screen Icon={Shield} />
      </motion.div>

      <div className="ml-row" aria-hidden="true">
        {ROW.map((Icon, i) => (
          <motion.span
            key={i}
            initial={reduce ? false : { opacity: 0, y: 6 }}
            animate={merged ? { opacity: 1, y: 0 } : { opacity: 0, y: 6 }}
            transition={reduce ? instant : { duration: 0.35, ease: EASE, delay: merged ? 0.85 + i * 0.06 : 0 }}
          >
            <Icon />
          </motion.span>
        ))}
      </div>
    </div>
  );
}
