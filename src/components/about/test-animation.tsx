import { GraduationCap, ShieldCheck, UserRoundCog, Users } from "lucide-react";
import { motion, useScroll, useTransform } from "motion/react";
import { useRef } from "react";

const portals = [
  {
    id: "management",
    src: "/svgs/portal-1.svg",
    alt: "Portal de gestão da federação",
    positionClassName: "left-1/2 top-[-2%] -translate-x-1/2 md:top-[-4%]",
    cardClassName: "w-[min(90vw,24rem)] md:w-[min(50vw,34rem)]",
  },
  {
    id: "benefits",
    src: "/svgs/portal-2.svg",
    alt: "Portal de autenticação e descoberta",
    positionClassName: "right-[0%] top-[63%] -translate-y-1/2 md:right-[-1%]",
    cardClassName:
      "h-[min(68vw,18.2rem)] w-[min(92vw,24.5rem)] object-contain md:h-[min(36.4vw,24.5rem)] md:w-[min(49vw,33rem)]",
  },
  {
    id: "wayf",
    src: "/svgs/portal-3.svg",
    alt: "Portal de benefícios",
    positionClassName: "left-[0%] top-[63%] -translate-y-1/2 md:left-[-1%]",
    cardClassName:
      "h-[min(68vw,18.2rem)] w-[min(92vw,24.5rem)] object-contain md:h-[min(36.4vw,24.5rem)] md:w-[min(49vw,33rem)]",
  },
];

function ManagementDecorations() {
  const chips = [
    {
      icon: ShieldCheck,
      text: "Gestores da CAFe/RNP",
      className: "border-fuchsia-200 bg-fuchsia-50 text-fuchsia-500",
    },
    {
      icon: UserRoundCog,
      text: "Técnicos de TI e Sistemas",
      className: "border-blue-200 bg-blue-50 text-blue-500",
    },
    {
      icon: GraduationCap,
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
      <div className="absolute top-[16%] hidden flex-col gap-2 md:-left-[8.25rem] md:flex xl:-left-[10.5rem]">
        {chips.map(({ icon: Icon, text, className }) => (
          <div
            key={text}
            className={`flex items-center gap-2 whitespace-nowrap rounded-full border px-2.5 py-2 font-geist text-[10px] leading-none shadow-sm xl:px-3 xl:text-[11px] ${className}`}
          >
            <Icon className="h-3 w-3 xl:h-3.5 xl:w-3.5" />
            <span>{text}</span>
          </div>
        ))}
      </div>

      <div className="absolute top-[6%] hidden w-[11rem] md:-right-[8.5rem] md:block lg:w-[12rem] xl:-right-[11rem] xl:w-[13.5rem]">
        <div className="rounded-xl border border-neutral-300 bg-white/90 p-3 text-center font-geist text-[10px] leading-4 text-neutral-700 shadow-sm backdrop-blur-sm xl:p-4 xl:text-[11px]">
          Cadastro e Gerenciamento de entidades na federação
        </div>
        <div className="mt-2 grid grid-cols-3 gap-2">
          {boxes.map((box) => (
            <div
              key={box}
              className="rounded-lg border border-neutral-300 bg-white/90 px-1.5 py-2 text-center font-geist text-[9px] leading-3 text-neutral-600 shadow-sm backdrop-blur-sm xl:px-2 xl:py-3 xl:text-[10px]"
            >
              {box}
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

function BottomPortalDecorations({
  side,
  title,
  description,
}: {
  side: "left" | "right";
  title: string;
  description: string;
}) {
  const align =
    side === "left" ? "items-start text-left" : "items-end text-right";
  const bubbleAnchor = side === "left" ? "-left-1" : "-right-1";

  return (
    <>
      <div
        className={`absolute -top-7 ${side === "left" ? "left-0" : "right-0"} ${align} hidden md:flex xl:-top-8`}
      >
        <span className="font-geist text-xs text-neutral-800 xl:text-sm">
          {title}
        </span>
      </div>

      <div
        className={`absolute -bottom-12 ${side === "left" ? "left-0" : "right-0"} hidden w-[12.5rem] md:block xl:-bottom-14 xl:w-[15rem]`}
      >
        <div
          className={`mb-3 flex ${side === "left" ? "justify-start" : "justify-end"} font-geist text-[11px]`}
        >
          <span className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-[10px] text-emerald-600 shadow-sm xl:px-3 xl:py-1.5 xl:text-[11px]">
            <Users className="h-3 w-3 xl:h-3.5 xl:w-3.5" />
            Aberto ao Público
          </span>
        </div>

        <div className="relative rounded-xl border border-neutral-300 bg-white/90 px-3 py-2.5 text-center font-geist text-[10px] leading-4 text-neutral-700 shadow-sm backdrop-blur-sm xl:px-4 xl:py-3 xl:text-[11px]">
          <span
            className={`absolute ${bubbleAnchor} top-1/2 h-4 w-4 -translate-y-1/2 rotate-45 border-b border-l border-neutral-300 bg-white/90`}
          />
          {description}
        </div>
      </div>
    </>
  );
}

export function PillarsSection() {
  const sectionRef = useRef<HTMLDivElement | null>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start 75%", "end 25%"],
  });
  const orbitRotate = useTransform(scrollYProgress, [0, 1], [-70, 70]);
  const cardRotate = useTransform(scrollYProgress, [0, 1], [70, -70]);

  return (
    <section id="pillars" className="overflow-x-clip py-16 md:py-20">
      <div className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
        <div className="flex flex-col gap-8">
          <p className="font-geist text-base uppercase tracking-[0.02em] text-neutral-500">
            O que estamos construindo
          </p>

          <h2 className="max-w-[536px] font-domine text-4xl leading-10 font-normal text-neutral-900 md:text-5xl md:leading-12">
            Três portais, um ecossistema.
          </h2>
        </div>

        <div className="max-w-[500px] font-geist text-base leading-6 tracking-[-0.48px] text-neutral-600">
          <p>
            O círculo central representa o barramento de interoperabilidade que
            conecta gestão, descoberta e acesso em uma única experiência
            federada.
          </p>
          <p>
            Cada portal orbita o mesmo núcleo, reforçando visualmente a ideia de
            um ecossistema integrado.
          </p>
        </div>
      </div>

      <div
        ref={sectionRef}
        className="relative mt-16 min-h-[190vh] md:min-h-[240vh]"
      >
        <div className="sticky top-12 overflow-visible rounded-[40px] px-6 py-10 md:top-16 md:px-12 md:py-16">
          <div className="relative mx-auto aspect-square w-full max-w-[1120px]">
            <img
              src="/svgs/circle.svg"
              alt="Círculo central do ecossistema"
              className="absolute left-1/2 top-1/2 z-0 w-[62%] min-w-[280px] max-w-[620px] -translate-x-1/2 -translate-y-1/2 opacity-70 md:w-[58%]"
            />

            <motion.div
              className="absolute inset-0 z-10"
              style={{ rotate: orbitRotate }}
            >
              {portals.map((portal) => (
                <div
                  key={portal.src}
                  className={`absolute ${portal.positionClassName}`}
                >
                  <motion.div
                    className="relative"
                    style={{ rotate: cardRotate }}
                  >
                    {portal.id === "management" && <ManagementDecorations />}
                    {portal.id === "benefits" && (
                      <BottomPortalDecorations
                        side="right"
                        title="Portal de Benefícios"
                        description="Facilita a busca e acesso a serviços de instituições federadas"
                      />
                    )}
                    {portal.id === "wayf" && (
                      <BottomPortalDecorations
                        side="left"
                        title="Portal Where Are You From (WAYF)"
                        description="Permite a oferta de IdPs e atua na comercialização da identidade do usuário"
                      />
                    )}
                    <img
                      src={portal.src}
                      alt={portal.alt}
                      className={`block h-auto max-w-none ${portal.cardClassName}`}
                    />
                  </motion.div>
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
