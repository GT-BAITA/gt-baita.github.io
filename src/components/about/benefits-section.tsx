import { motion } from "motion/react";
import { useTranslation } from "react-i18next";

export function BenefitsSection() {
  const { t } = useTranslation();
  const benefits = [
    {
      number: "01",
      title: t("aboutBenefits.card1.title"),
      description: t("aboutBenefits.card1.description"),
    },
    {
      number: "02",
      title: t("aboutBenefits.card2.title"),
      description: t("aboutBenefits.card2.description"),
    },
    {
      number: "03",
      title: t("aboutBenefits.card3.title"),
      description: t("aboutBenefits.card3.description"),
    },
  ];

  return (
    <section id="benefits" className="pb-11">
      <div className="flex flex-col gap-6">
        <motion.p
          className="font-geist text-base uppercase tracking-[0.02em] text-neutral-500"
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, ease: "easeOut" }}
          viewport={{ once: true, amount: 0.2 }}
        >
          {t("aboutBenefits.eyebrow")}
        </motion.p>

        <div className="grid gap-6 lg:grid-cols-3">
          {benefits.map((benefit, index) => (
            <motion.article
              key={benefit.number}
              className="p-10 rounded-3xl bg-white shadow-sm"
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.6,
                ease: "easeOut",
                delay: index * 0.07,
              }}
              viewport={{ once: true, amount: 0.2 }}
            >
              <div className="flex h-full flex-col space-y-6">
                <span className="font-domine text-5xl leading-none text-neutral-300">
                  {benefit.number}
                </span>

                <h3 className="font-geist font-medium text-2xl leading-6 tracking-[-0.72px] text-neutral-900">
                  {benefit.title}
                </h3>

                <p className="font-geist text-base font-normal leading-6 tracking-[-0.48px] text-neutral-600">
                  {benefit.description}
                </p>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
