import { useTranslation } from "react-i18next";
import { useEnterOnce } from "@/hooks/useEnterOnce";
import { requestContact } from "@/lib/contact-request";

/**
 * "Participe como Early Adopter" — Figma node 1058:37336.
 *
 * Static two-column section: the pitch and its CTA on the left, the
 * use cases on the right. No pinning or scroll driver here — after two
 * scroll-driven sections in a row, a third would be exhausting, and
 * the content has no state to move through.
 *
 * Reuses the existing earlyAdopters.title / .description copy, which
 * already matched the Figma word for word.
 */

type UseCase = {
  key: string;
  title: string;
  description: string;
};


function UseCaseCard({ useCase, index }: { useCase: UseCase; index: number }) {
  const { ref, hasEntered } = useEnterOnce<HTMLLIElement>(0.25);

  return (
    <li
      ref={ref}
      className={`t-card-enter ${hasEntered ? "is-shown" : ""}`}
      style={{ "--i": index } as React.CSSProperties}
    >
      <div className="rounded-3xl bg-white px-6 pb-6 pt-8 shadow-[0px_1px_1.5px_rgba(0,0,0,0.1),0px_1px_1px_rgba(0,0,0,0.1)]">
        <h3 className="font-geist text-2xl font-medium leading-6 tracking-[-0.72px] text-neutral-900">
          {useCase.title}
        </h3>

        <p className="mt-6 font-geist text-base leading-6 tracking-[-0.48px] text-neutral-600">
          {useCase.description}
        </p>
      </div>
    </li>
  );
}

export function UseCasesSection() {
  const { t } = useTranslation();

  const useCases: UseCase[] = [
    {
      key: "share",
      title: t("earlyAdopters.case1.title"),
      description: t("earlyAdopters.case1.description"),
    },
    {
      key: "idp",
      title: t("earlyAdopters.case2.title"),
      description: t("earlyAdopters.case2.description"),
    },
  ];

  return (
    <section id="use-cases" className="py-20 lg:py-24">
      <div className="flex flex-col gap-12 lg:flex-row lg:items-start lg:gap-12">
        <div className="flex flex-col gap-6 lg:w-[520px] lg:shrink-0">
          <div className="flex flex-col gap-10">
            <p className="font-geist text-base uppercase leading-6 tracking-[-0.32px] text-neutral-500">
              {t("earlyAdopters.eyebrow")}
            </p>

            <h2 className="max-w-[412px] font-domine text-4xl leading-tight text-neutral-900 md:text-5xl md:leading-[48px]">
              {t("earlyAdopters.title")}
            </h2>
          </div>

          <p className="font-geist text-base leading-6 tracking-[-0.48px] text-neutral-600">
            {t("earlyAdopters.description")}
          </p>

          <button
            type="button"
            onClick={() => requestContact()}
            className="inline-flex min-h-9 w-fit items-center justify-center gap-2 rounded-lg bg-neutral-900 px-4 py-[7.5px] font-geist text-sm font-medium tracking-[0.07px] text-neutral-50 transition-colors hover:bg-neutral-800"
          >
            {t("earlyAdopters.cta")}
          </button>
        </div>

        <ul className="flex min-w-0 flex-1 flex-col gap-6">
          {useCases.map((useCase, index) => (
            <UseCaseCard key={useCase.key} useCase={useCase} index={index} />
          ))}
        </ul>
      </div>
    </section>
  );
}
