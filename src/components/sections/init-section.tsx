import { Button } from '@/components/ui/button';
import { ChevronRight } from 'lucide-react';
import { motion, useScroll, useTransform } from 'motion/react';

export function InitSection() {
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 500], [0, -50]);

  const handleScrollToAbout = () => {
    const section = document.querySelector('#sobre');
    if (section) {
      const y = section.getBoundingClientRect().top + window.pageYOffset - 100;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };
  return (
    <>
      <section id="init" className="pt-24 pb-12 md:pt-40 md:pb-50 mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 items-end">
          <div className="space-y-14 max-w-[517px]">
            <div className="space-y-10">
              <h2 className="text-5xl md:text-6xl lg:text-[64px] font-domine leading-none text-neutral-900">
                A maior federação do Brasil: agora moderna
              </h2>
              <p className="text-xl text-neutral-600 leading-tight font-geist">
                A CAFe 2.0 chegou para revolucionar o acesso digital entre institutos e
                universidades.
              </p>
            </div>
            <Button
              className="bg-zinc-950 text-white hover:bg-neutral-900 rounded-lg font-geist w-[139px]"
              onClick={() => handleScrollToAbout()}
            >
              Saiba Mais <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </section>
      <motion.div
        className="absolute right-0 top-8 -z-[1] hidden opacity-50 lg:flex justify-end"
        style={{ y }}
      >
        <img src="/svgs/ascii-brasil.svg" alt="Hero Image" className="w-[80%] h-auto" />
      </motion.div>
    </>
  );
}
