import { useScroll, useTransform } from "motion/react";
import { motion } from "motion/react";
import { Trans, useTranslation } from "react-i18next";
import { BrazilDither } from "./brazil-dither";
import { EYEBROW } from "@/lib/typography";

export function HeroSection() {
  const { t } = useTranslation();
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 500], [0, -50]);

  return (
    <>
      <section id="init" className="pt-32 pb-11 md:pt-49.5 md:pb-40">
        <div className="flex items-start flex-col gap-10 max-w-200">
          <p className={EYEBROW}>
            {t("aboutHero.eyebrow")}
          </p>
          <h2 className="text-5xl md:text-6xl lg:text-[64px] max-w-225 font-domine leading-none text-neutral-900">
            {t("aboutHero.title")}
          </h2>
          <p className="text-xl text-neutral-500 leading-tight font-geist max-w-143.25">
            <Trans i18nKey="aboutHero.description" />
          </p>
        </div>
      </section>

      {/* O Brasil em pontilhado animado (antes, um mapa em ASCII), na mesma
          linguagem dos outros heroes. Leve e deslocado para a direita, para
          dar respiro ao texto; o corte pela borda da tela é intencional
          (html/body usam overflow-x: clip, então não cria rolagem). */}
      <motion.div
        className="absolute -right-[14%] top-8 -z-1 hidden w-full opacity-40 lg:flex justify-end"
        style={{ y }}
      >
        <BrazilDither className="w-[80%]" />
      </motion.div>
    </>
  );
}
