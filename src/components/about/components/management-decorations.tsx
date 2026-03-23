import { CoffeeIcon, GraduationCapIcon, WrenchIcon } from "lucide-react";
import { Trans, useTranslation } from "react-i18next";
import { twMerge } from "tailwind-merge";

export function ManagementDecorations() {
  const { t } = useTranslation();
  const chips = [
    {
      icon: CoffeeIcon,
      text: t("aboutManagement.chip1"),
      className: "border-purple-600 bg-purple-50 text-purple-500",
    },
    {
      icon: WrenchIcon,
      text: t("aboutManagement.chip2"),
      className: "border-blue-200 bg-blue-50 text-blue-500",
    },
    {
      icon: GraduationCapIcon,
      text: t("aboutManagement.chip3"),
      className: "border-rose-200 bg-rose-50 text-rose-500",
    },
  ];

  const boxes = [
    t("aboutManagement.box1"),
    t("aboutManagement.box2"),
    t("aboutManagement.box3"),
  ];

  return (
    <>
      <div className="hidden xl:block xl:absolute xl:left-13 xl:top-1">
        <p className="font-geist text-2xl  font-medium text-neutral-800">
          {t("aboutManagement.title")}
        </p>
      </div>
      <div className="xl:absolute flex flex-col md:flex-row xl:flex-col xl:items-end gap-3 xl:top-[49px] xl:-left-[194px] ">
        {chips.map(({ icon: Icon, text, className }) => (
          <div
            key={text}
            className={twMerge(
              "flex w-fit items-center p-2 gap-2 rounded-full border px-3 py-1 text-sm font-medium",
              className
            )}
          >
            <Icon className="size-4" />
            <span>{text}</span>
          </div>
        ))}
      </div>

      <div className="xl:absolute xl:top-[8%] xl:-right-[46%] hidden xl:block xl:max-w-[21rem]">
        <div className="bg-neutral-50 border text-sm border-neutral-400 text-center rounded-sm font-geist py-4 leading-4 tracking-[0.426px]">
          <Trans
            i18nKey="aboutManagement.description"
            components={{ br: <br /> }}
          />
        </div>
        <div className="mt-2 flex gap-2 items-center ">
          {boxes.map((box) => (
            <div
              key={box}
              className="bg-neutral-50 border border-neutral-400 text-sm px-1 text-center rounded-sm font-geist max-w-[135px] w-full leading-4 tracking-[0.426px] h-[64px] flex items-center justify-center"
            >
              {box}
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
