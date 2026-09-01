import { Button } from "@/components/ui/button";
import { ChevronRight } from "lucide-react";
import { motion } from "motion/react";
import { useTranslation } from "react-i18next";

function UseCaseCard({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      viewport={{ once: true }}
      className="bg-white rounded-2xl p-8 shadow-sm border border-[#F0F0F0] hover:border-neutral-300 transition-colors duration-300"
    >
      <h4 className="text-lg font-geist font-medium text-neutral-900 mb-3">
        {title}
      </h4>
      <p className="text-neutral-600 text-sm leading-5 font-geist">
        {description}
      </p>
    </motion.div>
  );
}

export function EarlyAdoptersSection() {
  const { t } = useTranslation();

  const handleScrollToNewsletter = () => {
    const section = document.querySelector("#contact-form");
    if (section) {
      const y = section.getBoundingClientRect().top + window.pageYOffset - 50;
      window.scrollTo({ top: y, behavior: "smooth" });
    }
  };

  const useCases = [
    {
      title: t("earlyAdopters.usecase1.title"),
      description: t("earlyAdopters.usecase1.description"),
    },
    {
      title: t("earlyAdopters.usecase2.title"),
      description: t("earlyAdopters.usecase2.description"),
    },
    {
      title: t("earlyAdopters.usecase3.title"),
      description: t("earlyAdopters.usecase3.description"),
    },
  ];

  return (
    <section id="early-adopters" className="py-24 lg:py-32">
      <div className="max-w-[1440px] mx-auto px-6 space-y-10">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          viewport={{ once: true }}
          className="space-y-6"
        >
          <h2 className="text-5xl md:text-6xl font-domine text-neutral-900 tracking-[-0.03em]">
            {t("earlyAdopters.title")}
          </h2>
          <p className="text-lg text-neutral-600 font-geist max-w-2xl leading-7">
            {t("earlyAdopters.description")}
          </p>
        </motion.div>

        <div>
          <div className="grid md:grid-cols-3 gap-6">
            {useCases.map((useCase, index) => (
              <UseCaseCard
              key={index}
              title={useCase.title}
              description={useCase.description}
              />
            ))}
          </div>
        </div>

        <div>
          <Button
            onClick={handleScrollToNewsletter}
            className="bg-neutral-950 text-white hover:bg-neutral-900 rounded-lg font-geist text-sm font-medium h-10 px-8 gap-2 transition-all duration-300 cursor-pointer"
          >
            {t("earlyAdopters.cta")}
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </section>
  );
}
