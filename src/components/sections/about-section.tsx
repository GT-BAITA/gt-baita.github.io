export function AboutSection() {
  return (
    <section id="sobre">
      <div
        data-dark
        className="bg-neutral-900 rounded-3xl p-8 md:p-16 flex flex-col lg:flex-row items-center gap-12"
      >
        <h3 className="text-4xl md:text-5xl font-domine text-neutral-100 leading-none lg:max-w-[445px]">
          A CAFe conecta uma rede de mais de 300 instituições federadas.
        </h3>

        <div className="w-full lg:w-auto flex-shrink-0 2xl:flex items-center justify-center hidden">
          <div className="relative w-[210px] h-[214px]">
            <div className="w-8 h-8 rounded-full bg-[#D4D4D4] absolute left-0 top-1/2 -translate-y-1/2 flex items-center justify-center" />
            <div
              className="absolute top-1/2 left-8 right-[12px] h-[1px]"
              style={{
                backgroundImage:
                  'repeating-linear-gradient(to right, #E5E5E5, #E5E5E5 12px, transparent 12px, transparent 20px)',
              }}
            />
            <div className="absolute right-[12px] top-[20px] bottom-[20px] w-[1.5px] bg-neutral-200" />
          </div>
        </div>

        <div className="space-y-8 flex-1">
          <p className="text-neutral-200 font-geist">
            Mantida pela RNP, a atual CAFe operacionaliza a infraestrutura tecnológica de centenas
            de universidades, institutos e centros de pesquisa brasileiros.
          </p>
          <p className="text-neutral-200 font-geist">
            A proposta da CAFe 2.0 busca modernizar o modelo atual, por meio do protocolo
            OpenIDConnect, ampliando o alcance da rede federada e aumentando a qualidade dos
            benefícios para todas as partes.
          </p>
        </div>
      </div>
    </section>
  );
}
