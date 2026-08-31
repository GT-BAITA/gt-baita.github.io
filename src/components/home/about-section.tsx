import { splitText } from "@/utils/split-text";
import { motion } from "motion/react";
import { useTranslation } from "react-i18next";

/**
 * "De uma rede de acesso a um ecossistema de serviços" — Figma node
 * 1058:35759.
 *
 * Rendered twice by design, never at the same time: InitSection places
 * it inside the hero from md up, and the home page places it below the
 * hero on mobile. See the note in src/pages/index.tsx.
 */
export function AboutSection() {
  const { t } = useTranslation();

  const title = t("about.title");
  const paragraphs = [t("about.p1"), t("about.p2"), t("about.p3")];

  return (
    <section id="about">
      <div
        data-dark
        className="flex flex-col items-start gap-8 rounded-3xl bg-neutral-900 p-8 text-left md:p-12 lg:flex-row lg:items-center lg:gap-[67px] lg:px-16 lg:py-[88px]"
      >
        <motion.h3
          key={title}
          className="font-domine text-4xl leading-none text-neutral-100 md:text-5xl lg:min-w-0 lg:flex-1"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.5 }}
          variants={{
            visible: { transition: { staggerChildren: 0.04 } },
          }}
        >
          {splitText(title).map((char, index) => (
            <motion.span
              key={`${title}-${index}-${char}`}
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

        <div className="flex min-w-0 flex-col gap-4 lg:w-[406px] lg:shrink-0">
          {paragraphs.map((paragraph) => (
            <p
              key={paragraph}
              className="font-geist text-base leading-snug text-neutral-200"
            >
              {paragraph}
            </p>
          ))}
        </div>
      </div>
    </section>
  );
}
