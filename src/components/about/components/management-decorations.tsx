import { CoffeeIcon, GraduationCapIcon, WrenchIcon } from "lucide-react";
import { twMerge } from "tailwind-merge";

export function ManagementDecorations() {
  const chips = [
    {
      icon: CoffeeIcon,
      text: "Gestores da CAFe/RNP",
      className: "border-purple-600 bg-purple-50 text-purple-500",
    },
    {
      icon: WrenchIcon,
      text: "Técnicos de TI e Sistemas",
      className: "border-blue-200 bg-blue-50 text-blue-500",
    },
    {
      icon: GraduationCapIcon,
      text: "Professores e Pesquisadores",
      className: "border-rose-200 bg-rose-50 text-rose-500",
    },
  ];

  const boxes = [
    "Organizações",
    "Identity Providers (IdP)",
    "Service Providers (SP)",
  ];

  return (
    <>
      <div className="absolute left-13 top-1">
        <p className="font-geist text-2xl  font-medium text-neutral-800">
          Painel de Gestão da Federação
        </p>
      </div>
      <div className="absolute flex flex-col items-end gap-3 top-[49px] -left-[194px] ">
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

      <div className="absolute top-[8%] -right-[58%] z-10 ">
        <div className="bg-neutral-50 border border-neutral-400 text-center rounded-sm font-geist py-4 leading-4 tracking-[0.426px]">
          Cadastro e Gerenciamento de <br /> entidades na federação
        </div>
        <div className="mt-2 flex gap-3 items-center ">
          {boxes.map((box) => (
            <div
              key={box}
              className="bg-neutral-50 border border-neutral-400 text-center rounded-sm font-geist max-w-[135px] w-full leading-4 tracking-[0.426px] h-[64px] flex items-center justify-center"
            >
              {box}
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
