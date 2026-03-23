import { Button } from "@/components/ui/button";
import { ChevronRight } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { AboutSection } from "./about-section";

export function InitSection() {
  const { t } = useTranslation();

  return (
    <>
      <section id="init" className="pt-49.5 pb-40 lg:pb-0">
        <div className="flex items-center justify-center flex-col gap-6 text-center">
          <h2 className="text-5xl md:text-6xl lg:text-[64px] max-w-[900px] font-domine leading-none text-neutral-900">
            {t("init.title")}
          </h2>
          <p className="text-xl text-neutral-500 leading-tight font-geist">
            {t("init.subtitle")}
          </p>

          <Button className="bg-zinc-950 text-white hover:bg-neutral-900 p-0 rounded-lg ">
            <Link
              to="/sobre"
              className="flex items-center w-[139px] h-full rounded-lg justify-center gap-1"
            >
              {t("init.cta")} <ChevronRight className="w-4 h-4" />
            </Link>
          </Button>
          <div className="relative hidden w-full overflow-x-clip md:flex flex-col items-center">
            <img
              src="/svgs/management-system.svg"
              alt="Management System Image"
              className="mt-10 block h-auto w-full max-w-[1062px]"
            />

            <div className="lg:-mt-85 md:-mt-70 w-full flex justify-center">
              <AboutSection />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
