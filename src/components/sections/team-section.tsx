export function TeamSection() {
  const members = [
    { name: 'Frederico Schardong', role: 'Coordenador de Projeto' },
    { name: 'Ricardo Custódio', role: 'Vice-Coordenador de Projeto' },
    { name: 'Brendon Vicente', role: 'Assistente de Inovação' },
    { name: 'Eduardo Perottoni', role: 'Assistente de Inovação' },
    { name: 'Giulia Manno', role: 'Designer de Produto' },
    { name: 'Álison Batista', role: 'Desenvolvedor' },
    { name: 'Charlie Terra', role: 'Desenvolvedora' },
    { name: 'Rayane Melo', role: 'Desenvolvedora' },
    { name: 'Leonardo Passos', role: 'Desenvolvedor' },
    { name: 'Raissa Lima', role: 'Desenvolvedora' },
  ];

  return (
    <section id="equipe" className="py-24">
      <div className="relative rounded-[24px] overflow-hidden bg-neutral-900 text-white flex flex-col-reverse lg:flex-row">
        <img
          src="/svgs/ascii-globe.svg"
          alt="ASCII globe background"
          className="absolute right-0 z-10 w-1/2 h-full pointer-events-none hidden md:block"
        />

        <div className="absolute inset-y-0 left-0 w-full lg:w-2/3 bg-gradient-to-r from-neutral-800/60 via-neutral-800/30 to-transparent backdrop-blur-[6px]" />

        <div className="w-full lg:w-2/3 p-8 lg:p-14 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 z-10">
          {members.map((member, index) => (
            <div
              key={index}
              className="bg-neutral-900 rounded-2xl p-6 flex flex-col justify-center shadow-inner hover:bg-neutral-800 transition-colors cursor-pointer"
            >
              <h4 className="font-geist text-base font-normal">{member.name}</h4>
              <p className="text-neutral-300 text-[12px] font-geist">{member.role}</p>
            </div>
          ))}
        </div>

        <div className="relative w-full lg:w-1/3 flex items-center lg:items-end justify-center lg:justify-end p-8 lg:p-14 z-10">
          <h2 className="text-[48px] sm:text-[56px] lg:text-[64px] font-domine text-center lg:text-right">
            A Equipe
          </h2>
        </div>
      </div>
    </section>
  );
}
