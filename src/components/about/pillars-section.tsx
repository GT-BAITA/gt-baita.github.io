import { ManagementDecorations } from "./components/management-decorations";
import { PortalDecorations } from "./components/portal-decorations";

const portals = [
  {
    id: "management",
    src: "/svgs/portal-1.svg",
    alt: "Portal de gestão da federação",
    positionClassName: "left-1/2 top-[-33%] -translate-x-1/2",
    cardClassName: "w-[min(94vw,28rem)] md:w-[min(58vw,40rem)]",
  },
  {
    id: "benefits",
    src: "/svgs/portal-2.svg",
    alt: "Portal de autenticação e descoberta",
    positionClassName: "right-[-6%] top-[64%] -translate-y-1/2 md:right-[-12%]",
    cardClassName:
      "h-[min(78vw,21rem)] w-[min(96vw,28rem)] object-contain md:h-[min(43vw,29rem)] md:w-[min(58vw,39rem)]",
  },
  {
    id: "wayf",
    src: "/svgs/portal-3.svg",
    alt: "Portal de benefícios",
    positionClassName: "left-[-6%] top-[64%] -translate-y-1/2 md:left-[-12%]",
    cardClassName:
      "h-[min(78vw,21rem)] w-[min(96vw,28rem)] object-contain md:h-[min(43vw,29rem)] md:w-[min(58vw,39rem)]",
  },
];

export function PillarsSection() {
  return (
    <section id="pillars" className="overflow-visible py-16 md:py-20">
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

      <div className="relative mt-64 overflow-visible px-2 py-8 md:px-8 md:py-12">
        <div className="relative mx-auto aspect-[16/11] w-full max-w-[1320px]">
          <img
            src="/svgs/circle.svg"
            alt="Círculo central do ecossistema"
            className="absolute left-1/2 top-1/2 z-0 w-[50%] min-w-[280px] max-w-[620px] -translate-x-1/2 -translate-y-1/2 opacity-70"
          />

          {portals.map((portal) => (
            <div
              key={portal.src}
              className={`absolute ${portal.positionClassName}`}
            >
              <div className="relative">
                {portal.id === "management" && <ManagementDecorations />}

                {portal.id === "benefits" && (
                  <PortalDecorations
                    side="right"
                    title="Portal de Benefícios"
                    description="Facilita a busca e acesso a serviços de instituições federadas"
                  />
                )}
                {portal.id === "wayf" && (
                  <PortalDecorations
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
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
