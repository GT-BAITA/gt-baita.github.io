import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Trans, useTranslation } from "react-i18next";

function CustomAccordionItem(props: {
  value: string;
  children: React.ReactNode;
}) {
  return (
    <AccordionItem
      value={props.value}
      className="bg-[#F1F1EC] hover:bg-white transition-all duration-300 ease-in-out rounded-lg mb-4 border-none"
    >
      {props.children}
    </AccordionItem>
  );
}

function CustomAccordionTrigger({ text }: { text: string }) {
  return (
    <AccordionTrigger className="text-neutral-900 font-medium hover:no-underline cursor-pointer text-base px-4">
      {text}
    </AccordionTrigger>
  );
}

function CustomAccordionContent({
  i18nKey,
  linkHref,
}: {
  i18nKey: string;
  linkHref?: string;
}) {
  const isExternalLink = linkHref?.startsWith("http");

  return (
    <AccordionContent className="text-neutral-900 p-0 text-base font-[400] leading-5 px-4 pb-4 font-geist [&_a]:text-blue-600 [&_a]:underline [&_a]:hover:text-blue-800">
      <Trans
        i18nKey={i18nKey}
        components={
          linkHref
            ? {
                a: (
                  <a
                    href={linkHref}
                    {...(isExternalLink
                      ? { target: "_blank", rel: "noopener noreferrer" }
                      : {})}
                  />
                ),
              }
            : undefined
        }
      />
    </AccordionContent>
  );
}

export function FAQSection() {
  const { t } = useTranslation();

  return (
    <section id="faq">
      <div className="lg:py-22 space-y-10">
        <h2 className="text-5xl md:text-6xl font-domine text-neutral-900 text-center">
          {t("faq.title")}
        </h2>

        <div className="max-w-[976px] mx-auto">
          <Accordion type="single" collapsible defaultValue="item-1">
            <CustomAccordionItem value="item-1">
              <CustomAccordionTrigger text={t("faq.q1")} />
              <CustomAccordionContent
                i18nKey="faq.a1"
                linkHref="https://servicos.baita.testbeds.rnp.br/"
              />
            </CustomAccordionItem>

            <CustomAccordionItem value="item-2">
              <CustomAccordionTrigger text={t("faq.q2")} />
              <CustomAccordionContent i18nKey="faq.a2" />
            </CustomAccordionItem>

            <CustomAccordionItem value="item-3">
              <CustomAccordionTrigger text={t("faq.q3")} />
              <CustomAccordionContent i18nKey="faq.a3" />
            </CustomAccordionItem>

            <CustomAccordionItem value="item-4">
              <CustomAccordionTrigger text={t("faq.q4")} />
              <CustomAccordionContent
                i18nKey="faq.a4"
                linkHref="https://servicos.baita.testbeds.rnp.br/"
              />
            </CustomAccordionItem>

            <CustomAccordionItem value="item-5">
              <CustomAccordionTrigger text={t("faq.q5")} />
              <CustomAccordionContent
                i18nKey="faq.a5"
                linkHref="mailto:contato.gtbaita@gmail.com"
              />
            </CustomAccordionItem>

            <CustomAccordionItem value="item-6">
              <CustomAccordionTrigger text={t("faq.q6")} />
              <CustomAccordionContent i18nKey="faq.a6" />
            </CustomAccordionItem>
          </Accordion>
        </div>
      </div>
    </section>
  );
}
