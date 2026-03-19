import { splitText } from "@/utils/split-text";
import { motion } from "motion/react";

export function InfoSection() {
  const text =
    "Hoje, a CAFe conecta mais 320 instituições — mas muitos usuários não sabem o que pode ser acessado com ela.";

  return (
    <section id="info" className="pt-24 pb-12 md:pt-40  mx-auto">
      <div
        data-dark
        className="bg-neutral-900 rounded-3xl p-8 md:p-16 flex flex-col items-center gap-8 text-center"
      >
        <div className="text-4xl font-domine text-neutral-100 leading-none">
          <motion.h3
            key={text}
            className="inline-block"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.5 }}
            variants={{
              visible: {
                transition: {
                  staggerChildren: 0.04,
                },
              },
            }}
          >
            {splitText(text).map((char, index) => (
              <motion.span
                key={`${text}-${index}-${char}`}
                variants={{
                  hidden: { opacity: 0 },
                  visible: { opacity: 1 },
                }}
                transition={{ duration: 0.05, ease: "linear" }}
              >
                {char}
              </motion.span>
            ))}
          </motion.h3>
        </div>

        <p className="text-neutral-200 font-geist max-w-[957px]">
          Os serviços disponíveis possuem pouca visibilidade, e a federação é
          muitas vezes vista apenas como uma porta de entrada para sistemas da
          RNP. Ela pode ser muito mais do que isso.
        </p>
      </div>
    </section>
  );
}
