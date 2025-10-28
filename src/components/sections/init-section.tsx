import { Button } from '@/components/ui/button';
import { ChevronRight } from 'lucide-react';

export function InitSection() {
  return (
    <>
      <section id="init" className="pt-24 pb-12 md:pt-40 md:pb-50 ">
        <div className="max-w-[1440px] mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-end">
            <div className="space-y-14 max-w-[517px]">
              <div className="space-y-10">
                <h2 className="text-5xl md:text-6xl lg:text-[64px] font-domine leading-none text-neutral-900">
                  A maior interfederação do Brasil: agora moderna
                </h2>
                <p className="text-xl text-neutral-500 leading-tight font-geist">
                  A CAFe 2.0 chegou para revolucionar o acesso digital entre institutos e
                  universidades.
                </p>
              </div>
              <Button className="bg-zinc-950 text-white hover:bg-neutral-900 rounded-lg font-geist w-[139px]">
                Saiba Mais <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </section>
      <div className="absolute right-0 top-8 -z-[1] hidden lg:block">
        <img src="/svgs/ascii-brasil.svg" alt="Hero Image" className="w-full h-full" />
      </div>
    </>
  );
}
