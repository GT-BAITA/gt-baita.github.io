import { ChevronRight } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { AboutSection } from "./about-section";
import { requestContact } from "@/lib/contact-request";

export function InitSection() {
  const { t, i18n } = useTranslation();
  const assetLanguage = i18n.language.startsWith("pt") ? "pt" : "en";

  return (
    <>
      <section id="init" className="pt-49.5 pb-40 lg:pb-0">
        <div className="flex items-center justify-center flex-col gap-6 text-center">
          <h2 className="text-5xl md:text-6xl lg:text-[64px] max-w-[900px] font-domine leading-none text-neutral-900">
            {t("init.title")}
          </h2>
          <p className="text-xl text-neutral-500 leading-tight font-geist max-w-[720px]">
            {t("init.subtitle")}
          </p>

          <div className="flex flex-col items-stretch gap-4 sm:flex-row sm:items-start">
            <button
              type="button"
              onClick={() => requestContact()}
              className="inline-flex min-h-10 items-center justify-center gap-2 rounded-lg bg-neutral-950 px-6 py-[9.5px] font-geist text-sm font-medium tracking-[0.07px] text-white transition-colors hover:bg-neutral-900"
            >
              {t("init.ctaPrimary")}
            </button>

            {/* A plain Link, not a Button wrapping one: an <a> inside a
                <button> is invalid and behaves inconsistently. */}
            <Link
              to="/about"
              className="inline-flex min-h-10 items-center justify-center gap-1 rounded-lg border border-neutral-200 px-6 py-[9.5px] font-geist text-sm font-medium tracking-[0.07px] text-neutral-900 shadow-sm transition-colors hover:bg-neutral-100"
            >
              {t("init.cta")} <ChevronRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="relative hidden w-full overflow-x-clip md:flex flex-col items-center">
            <img
              src={`/svgs/management-system-${assetLanguage}.svg`}
              alt="Management System Image"
              className="mt-10 block h-auto w-full max-w-[1062px]"
            />

            <div className="lg:-mt-80 md:-mt-70 w-full flex justify-center">
              <AboutSection />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
