import { Faq } from "@/components/shared/faq";
import { Trans, useTranslation } from "react-i18next";

const PORTAL_URL = "https://servicos.baita.testbeds.rnp.br/";

function Answer({ i18nKey, linkHref }: { i18nKey: string; linkHref?: string }) {
  const isExternalLink = linkHref?.startsWith("http");

  return (
    <p className="[&_a]:text-ink [&_a]:underline [&_a]:underline-offset-2 [&_a]:hover:opacity-70">
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
    </p>
  );
}

export function FAQSection() {
  const { t } = useTranslation();

  const items = [
    { n: 1, link: PORTAL_URL },
    { n: 2 },
    { n: 3 },
    { n: 4, link: PORTAL_URL },
    { n: 5, link: "mailto:contato.gtbaita@gmail.com" },
    { n: 6 },
  ].map(({ n, link }) => ({
    q: t(`faq.q${n}`),
    a: <Answer i18nKey={`faq.a${n}`} linkHref={link} />,
  }));

  return (
    <section id="faq">
      <div className="lg:py-22 space-y-10">
        <h2 className="text-5xl md:text-6xl font-domine text-ink text-center">
          {t("faq.title")}
        </h2>

        <Faq items={items} className="mx-auto max-w-[976px]" />
      </div>
    </section>
  );
}
