export function DemonstrationSection() {
  return (
    <section id="demonstration" className="py-16 md:py-20 ">
      <div className="flex flex-col md:flex-row md:justify-between md:items-end gap-8">
        <div className="flex flex-col gap-8">
          <p className="font-geist text-base uppercase tracking-[0.02em] text-neutral-500">
            Demonstração — MVP atual
          </p>

          <h2 className="font-domine text-4xl leading-10 md:text-5xl md:leading-12 font-normal text-neutral-900 max-w-[536px]">
            Veja o Painel de Gestão em funcionamento.
          </h2>
        </div>

        <div className="text-base leading-6 tracking-[-0.48px] font-geist text-neutral-600 max-w-[500px]">
          <p>Os vídeos abaixo mostram os fluxos implementados até agora.</p>
          <p>
            Esta é uma versão em desenvolvimento — funcionalidades continuam
            evoluindo a cada dia.
          </p>
        </div>
      </div>
    </section>
  );
}
