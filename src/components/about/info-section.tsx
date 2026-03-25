import { splitText } from "@/utils/split-text";
import { motion } from "motion/react";
import { useTranslation } from "react-i18next";

export function InfoSection() {
  const { t } = useTranslation();
  const text = t("aboutInfo.title");

  return (
    <section id="info" className="py-11">
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
          {t("aboutInfo.description")}
        </p>
      </div>
    </section>
  );
}
