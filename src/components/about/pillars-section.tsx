import { motion } from "motion/react";
import { ManagementDecorations } from "./components/management-decorations";
import { PortalDecorations } from "./components/portal-decorations";

const viewportOnce = { once: true, amount: 0.2 };

const portals = [
  {
    id: "management",
    src: "/svgs/portal-1.svg",
    alt: "Portal de gestão da federação",
    positionClassName: "left-1/2 top-[-33%] -translate-x-1/2",
    cardClassName: "w-[min(94vw,28rem)] md:w-[min(58vw,40rem)]",
    mobileCardClassName: "h-auto w-full max-w-none",
  },
  {
    id: "benefits",
    src: "/svgs/portal-2.svg",
    alt: "Portal de autenticação e descoberta",
    positionClassName: "right-[-6%] top-[64%] -translate-y-1/2 md:right-[-12%]",
    cardClassName:
      "h-[min(78vw,21rem)] w-[min(96vw,28rem)] object-contain md:h-[min(43vw,29rem)] md:w-[min(58vw,39rem)]",
    mobileCardClassName: "h-auto w-full max-w-none object-contain",
  },
  {
    id: "wayf",
    src: "/svgs/portal-3.svg",
    alt: "Portal de benefícios",
    positionClassName: "left-[-6%] top-[64%] -translate-y-1/2 md:left-[-12%]",
    cardClassName:
      "h-[min(78vw,21rem)] w-[min(96vw,28rem)] object-contain md:h-[min(43vw,29rem)] md:w-[min(58vw,39rem)]",
    mobileCardClassName: "h-auto w-full max-w-none object-contain",
  },
];

export function PillarsSection() {
  return (
    <section id="pillars" className="overflow-visible py-11 pb-12">
      <div className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
        <motion.div
          className="flex flex-col gap-8"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          viewport={viewportOnce}
        >
          <p className="font-geist text-base uppercase tracking-[0.02em] text-neutral-500">
            O que estamos construindo
          </p>

          <h2 className="xl:max-w-[536px] font-domine text-4xl leading-10 font-normal text-neutral-900 md:text-5xl md:leading-12">
            Três portais, um ecossistema.
          </h2>
        </motion.div>

        <motion.div
          className="max-w-[500px] font-geist text-base leading-6 tracking-[-0.48px] text-neutral-600 hidden xl:block"
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: "easeOut", delay: 0.08 }}
          viewport={viewportOnce}
        >
          <p>
            O círculo central representa o barramento de interoperabilidade que
            conecta gestão, descoberta e acesso em uma única experiência
            federada.
          </p>
          <p>
            Cada portal orbita o mesmo núcleo, reforçando visualmente a ideia de
            um ecossistema integrado.
          </p>
        </motion.div>
      </div>

      {/* Desktop */}
      <div className="relative mt-70 overflow-visible px-2 py-8 md:px-8 md:py-12 hidden xl:block">
        <div className="relative mx-auto aspect-[16/11] w-full max-w-[1320px]">
          <motion.img
            src="/svgs/circle.svg"
            alt="Círculo central do ecossistema"
            className="absolute left-1/2 top-1/2 z-0 w-[50%] min-w-[280px] max-w-[620px] -translate-x-1/2 -translate-y-1/2 opacity-70"
            initial={{ opacity: 0, scale: 0.96 }}
            whileInView={{ opacity: 0.7, scale: 1 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            viewport={viewportOnce}
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

      {/*Mobile*/}
      <motion.div
        className="xl:hidden flex flex-col gap-12 overflow-hidden px-2 py-4"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.55, ease: "easeOut" }}
        viewport={viewportOnce}
      >
        <motion.div
          className="flex items-center gap-4"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, ease: "easeOut", delay: 0.04 }}
          viewport={viewportOnce}
        >
          <img
            src="/svgs/icon-cafe.svg"
            alt="Ícone da CAFe"
            className="w-17 h-16"
          />
          <p className="text-[#B3B3B3] text-center text-3xl  tracking-[-1.186px] font-bold font-geist">
            Barramento de Interoperabilidade
          </p>
        </motion.div>
        {portals.map((portal, index) => (
          <motion.div
            key={portal.id}
            className="mx-auto flex w-full max-w-[36rem] flex-col "
            initial={{
              opacity: 0,
              y: 18,
              x: portal.id === "benefits" ? 18 : portal.id === "wayf" ? -18 : 0,
            }}
            whileInView={{ opacity: 1, x: 0, y: 0 }}
            transition={{
              duration: 0.55,
              ease: "easeOut",
              delay: 0.05 * index,
            }}
            viewport={viewportOnce}
          >
            <span className="font-geist text-2xl font-medium text-neutral-800">
              {portal.alt}
            </span>
            <div className="mx-auto w-full overflow-hidden rounded-[1.5rem]">
              <img
                src={portal.src}
                alt={portal.alt}
                className={`mx-auto block h-auto w-full max-w-full ${portal.mobileCardClassName}`}
              />
            </div>
            {portal.id === "management" && (
              <div className="w-full overflow-hidden">
                <ManagementDecorations />
              </div>
            )}

            {portal.id === "benefits" && (
              <div className="w-full overflow-hidden">
                <PortalDecorations
                  side="right"
                  title="Portal de Benefícios"
                  description="Facilita a busca e acesso a serviços de instituições federadas"
                />
              </div>
            )}
            {portal.id === "wayf" && (
              <div className="w-full overflow-hidden">
                <PortalDecorations
                  side="left"
                  title="Portal Where Are You From (WAYF)"
                  description="Permite a oferta de IdPs e atua na comercialização da identidade do usuário"
                />
              </div>
            )}
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}
