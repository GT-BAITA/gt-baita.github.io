import { ChevronRight } from "lucide-react";
import { useRef } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { AboutSection } from "./about-section";
import { requestContact } from "@/lib/contact-request";
import { Button, buttonVariants } from "@/components/ui/button";
import { useHeroBackdrop } from "@/components/shared/hero-dither";

/**
 * Tamanho de public/svgs/management-system-{pt,en}.svg (atributos width e
 * height da raiz). Se um deles for reexportado, atualize aqui, ou a área
 * reservada não bate e a página volta a pular quando a imagem chega.
 */
const SHOT_SIZE = { pt: [1472, 1048], en: [1434, 1046] } as const;

export function InitSection() {
  const { t, i18n } = useTranslation();
  const assetLanguage = i18n.language.startsWith("pt") ? "pt" : "en";
  const textRef = useRef<HTMLDivElement>(null);
  const shotRef = useRef<HTMLImageElement>(null);
  // Fundo pontilhado (no Layout): pontos soltos em volta dos textos e da
  // captura. Na ida para o IdP, eles se juntam na estrela do hero de lá.
  useHeroBackdrop({ layout: "scatter", anchorRef: shotRef, quietRefs: [textRef] });

  return (
    <>
      <section id="init" className="relative pt-49.5 pb-40 lg:pb-0">
        <div className="relative z-10 flex items-center justify-center flex-col gap-6 text-center">
          <div ref={textRef} className="flex flex-col items-center gap-6">
            <h2 className="text-5xl md:text-6xl lg:text-[64px] max-w-[900px] font-domine leading-none text-neutral-900">
              {t("init.title")}
            </h2>
            <p className="text-xl text-neutral-500 leading-tight font-geist max-w-[720px]">
              {t("init.subtitle")}
            </p>

            <div className="flex flex-col items-stretch gap-4 sm:flex-row sm:items-start">
              <Button size="md" onClick={() => requestContact()}>
                {t("init.ctaPrimary")}
              </Button>

              {/* Um Link simples, sem ser envolvido por um Button: um <a> dentro
                  de um <button> é inválido e se comporta de forma inconsistente. */}
              <Link
                to="/about"
                className={buttonVariants({ variant: "secondary", size: "md" })}
              >
                {t("init.cta")} <ChevronRight />
              </Link>
            </div>
          </div>
          <div className="relative hidden w-full overflow-x-clip md:flex flex-col items-center">
            <img
              ref={shotRef}
              src={`/svgs/management-system-${assetLanguage}.svg`}
              alt="Management System Image"
              // Reserva a altura antes de o SVG chegar.
              width={SHOT_SIZE[assetLanguage][0]}
              height={SHOT_SIZE[assetLanguage][1]}
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
