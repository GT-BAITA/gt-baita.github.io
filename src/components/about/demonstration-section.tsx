import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import type { CarouselApi } from "@/components/ui/carousel";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

export function DemonstrationSection() {
  const { t } = useTranslation();
  const [api, setApi] = useState<CarouselApi>();
  const [activeIndex, setActiveIndex] = useState(0);
  const videos = [
    {
      id: "Ig2H4jNx84I",
      title: t("aboutDemonstration.video1.title"),
    },
    {
      id: "MAkWvnqat5o",
      title: t("aboutDemonstration.video2.title"),
    },
    {
      id: "lzbS-PFNfPU",
      title: t("aboutDemonstration.video3.title"),
    },
    {
      id: "QOzteJ4bA7M",
      title: t("aboutDemonstration.video4.title"),
    },
  ];

  useEffect(() => {
    if (!api) {
      return;
    }

    const handleSelect = () => {
      setActiveIndex(api.selectedScrollSnap());
    };

    handleSelect();
    api.on("select", handleSelect);
    api.on("reInit", handleSelect);

    return () => {
      api.off("select", handleSelect);
      api.off("reInit", handleSelect);
    };
  }, [api]);

  return (
    <section id="demonstration" className="py-11 lg:py-22">
      <div className="flex flex-col md:flex-row md:justify-between md:items-end gap-8">
        <div className="flex flex-col gap-8">
          <p className="font-geist text-base uppercase tracking-[0.02em] text-neutral-500">
            {t("aboutDemonstration.eyebrow")}
          </p>

          <h2 className="font-domine text-4xl leading-10 md:text-5xl md:leading-12 font-normal text-neutral-900 max-w-[536px]">
            {t("aboutDemonstration.title")}
          </h2>
        </div>

        <div className="text-base leading-6 tracking-[-0.48px] font-geist text-neutral-600 max-w-[500px]">
          <p>{t("aboutDemonstration.description1")}</p>
          <p>{t("aboutDemonstration.description2")}</p>
        </div>
      </div>

      <div className="mt-10 flex flex-col gap-5">
        <Carousel
          setApi={setApi}
          opts={{
            align: "start",
            loop: false,
          }}
          className="w-full"
        >
          <CarouselContent>
            {videos.map((video, index) => (
              <CarouselItem key={video.id}>
                <div className="overflow-hidden rounded-2xl border border-neutral-200 bg-neutral-950 ">
                  <div className="aspect-video w-full">
                    {index === activeIndex ? (
                      <iframe
                        width="100%"
                        height="100%"
                        src={`https://www.youtube.com/embed/${video.id}?autoplay=1`}
                        title={video.title}
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                        allowFullScreen
                        className="h-full w-full"
                      />
                    ) : (
                      <button
                        type="button"
                        onClick={() => api?.scrollTo(index)}
                        className="flex h-full w-full items-center justify-center bg-neutral-950 p-6 text-center"
                      >
                        <span className="font-geist text-base text-neutral-100 md:text-lg">
                          {video.title}
                        </span>
                      </button>
                    )}
                  </div>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>

          <CarouselPrevious className="left-3 border-neutral-200 bg-white/90 text-neutral-900 shadow-lg backdrop-blur disabled:opacity-40" />
          <CarouselNext className="right-3 border-neutral-200 bg-white/90 text-neutral-900 shadow-lg backdrop-blur disabled:opacity-40" />
        </Carousel>

        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
          {videos.map((video, index) => {
            const isActive = index === activeIndex;

            return (
              <button
                key={video.id}
                type="button"
                onClick={() => api?.scrollTo(index)}
                className={cn(
                  "rounded-2xl border px-4 py-4 text-left transition-all duration-200",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900 focus-visible:ring-offset-2",
                  isActive
                    ? "border-neutral-900 bg-neutral-900 text-neutral-50 shadow-lg"
                    : "border-neutral-200 bg-white text-neutral-700 hover:border-neutral-400 hover:bg-neutral-50"
                )}
              >
                <span
                  className={cn(
                    "mb-2 block font-geist text-xs uppercase tracking-[0.18em]",
                    isActive ? "text-neutral-300" : "text-neutral-400"
                  )}
                >
                  {t("aboutDemonstration.videoLabel", { number: index + 1 })}
                </span>

                <span className="block font-geist text-sm leading-6 md:text-base">
                  {video.title}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}
