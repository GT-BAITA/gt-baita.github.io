import { useScroll, useTransform } from "motion/react";
import { motion } from "motion/react";

export function HeroSection() {
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 500], [0, -50]);

  return (
    <>
      <section id="init" className="pt-49.5 pb-40">
        <div className="flex items-start flex-col gap-10 max-w-200">
          <p className="uppercase text-neutral-500 text-base font-geist">
            Sobre o projeto
          </p>
          <h2 className="text-5xl md:text-6xl lg:text-[64px] max-w-225 font-domine leading-none text-neutral-900">
            A próxima geração da identidade acadêmica brasileira.
          </h2>
          <p className="text-xl text-neutral-500 leading-tight font-geist max-w-143.25">
            O GT-BAITA está redesenhando a infraestrutura por trás
            <br /> do acesso digital de milhões de pesquisadores, professores{" "}
            <br />e estudantes em todo o país.
          </p>
        </div>
      </section>

      <motion.div
        className="absolute right-0 top-8 -z-1 hidden opacity-50 lg:flex justify-end"
        style={{ y }}
      >
        <img
          src="/svgs/ascii-brasil.svg"
          alt="Hero Image"
          className="w-[80%] h-auto"
        />
      </motion.div>
    </>
  );
}
