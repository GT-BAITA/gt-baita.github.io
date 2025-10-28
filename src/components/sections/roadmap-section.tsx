function RoadmapCard({
  title,
  quarter,
  description,
  image,
}: {
  title: string;
  quarter: string;
  description: string;
  image: string;
}) {
  return (
    <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-[#DFDFDA] via-[#F1F1EC] to-[#F1F1EC] p-8 min-h-[450px] flex flex-col justify-between">
      <div className="absolute -top-12 -left-12 w-48 h-48 rounded-full bg-[#D4D4D4]/50 blur-3xl"></div>

      <div className="z-10 space-y-4 relative">
        <h3 className="text-[32px] font-geist font-medium text-neutral-900 leading-8 tracking-[-0.03em] whitespace-pre-line">
          {title}
        </h3>
        <div className="space-y-2">
          <p className="text-neutral-600 font-geist">{quarter}</p>
          <p className="text-neutral-600 font-geist leading-snug max-w-[85%]">{description}</p>
        </div>
      </div>

      <img
        src={image}
        alt={title}
        className="absolute bottom-0 right-0 h-auto object-contain block"
      />
    </div>
  );
}

export function RoadmapSection() {
  return (
    <section id="roadmap" className="py-[88px]">
      <div className="space-y-24">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <h2 className="text-5xl md:text-5xl font-domine text-neutral-900">Nosso Roadmap</h2>
          <p className="text-neutral-600 text-base leading-5 font-geist max-w-[220px]">
            Estamos trabalhando para trazer a melhor solução.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          <RoadmapCard
            title={'Portal\nWhere Are You From'}
            quarter="Q1/2026"
            description="Portal de autenticação com redirecionamento para o IdP institucional"
            image="/svgs/roadmap-wayf.svg"
          />
          <RoadmapCard
            title="Painel de Gestão"
            quarter="Q2/2025"
            description="Sistema de gerenciamento completo para administradores de instituições federadas"
            image="/svgs/roadmap-painel.svg"
          />
          <RoadmapCard
            title="Portal de Benefícios"
            quarter="Em breve"
            description="Plataforma de descoberta de serviços para usuários de instituições federadas"
            image="/svgs/roadmap-portal.svg"
          />
        </div>
      </div>
    </section>
  );
}
