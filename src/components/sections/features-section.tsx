import { Button } from '@/components/ui/button';
import { ChevronRight } from 'lucide-react';
import { motion } from 'motion/react';

function CardOne() {
  const handleScrollToRoadmap = () => {
    const section = document.querySelector('#roadmap');
    if (section) {
      const y = section.getBoundingClientRect().top + window.pageYOffset - 50;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 80 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: 'easeOut' }}
      viewport={{ once: true }}
      className="bg-white rounded-2xl px-8 pt-10 pb-4 pr-0 flex flex-col justify-between shadow-sm border border-[#F0F0F0] lg:row-span-2 relative min-h-[620px]"
    >
      <div className="space-y-6">
        <h4 className="text-2xl text-neutral-900 leading-6 font-geist font-medium tracking-[-0.03em]">
          Três plataformas, <br /> uma solução
        </h4>
        <p className="text-neutral-600 text-base leading-5 font-geist w-[75%]">
          A adoção do protocolo OpenID Federation possibilita uma infraestrutura flexível, com a
          criação de portais de autenticação, gestão administrativa e user-facing.
        </p>
        <Button
          onClick={() => handleScrollToRoadmap()}
          className="bg-neutral-950 text-white hover:bg-neutral-900 rounded-lg font-geist w-[139px] flex items-center justify-center gap-1 transition-all duration-300"
        >
          Saiba Mais <ChevronRight className="w-4 h-4" />
        </Button>
      </div>

      <div className="flex justify-end mt-12">
        <img
          src="/svgs/feature-graphic.svg"
          alt="OpenID Connect illustration"
          className="w-full max-w-[260px] opacity-80"
        />
      </div>
    </motion.div>
  );
}

function CardTwo() {
  return (
    <motion.div
      initial={{ opacity: 0, x: 100 }}
      whileInView={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.8, ease: 'easeOut', delay: 0.1 }}
      viewport={{ once: true }}
      className="bg-white rounded-2xl p-8 pb-10 flex flex-col justify-between shadow-sm border border-[#F0F0F0] min-h-[320px]"
    >
      <div className="flex justify-end">
        <img src="/svgs/edugain.svg" alt="eduGAIN" className="h-20" />
      </div>
      <h4 className="text-2xl text-neutral-900 leading-6 font-geist font-medium tracking-[-0.03em]">
        Conexão com <br /> o Brasil e o Mundo
      </h4>
      <p className="text-neutral-600 text-base leading-5 font-geist w-[98%]">
        A solução proporciona interoperabilidade com a eduGAIN, conectando a federação brasileira a
        serviços de mais de 3400 instituições internacionais.
      </p>
    </motion.div>
  );
}

function CardThree() {
  return (
    <motion.div
      initial={{ opacity: 0, x: 100 }}
      whileInView={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.8, ease: 'easeOut', delay: 0.2 }}
      viewport={{ once: true }}
      className="bg-white rounded-2xl p-8 flex items-end justify-end shadow-sm border border-[#F0F0F0] relative overflow-hidden min-h-[320px]"
    >
      <div className="absolute top-0 left-0">
        <img src="/svgs/world.svg" alt="Network Icon" className="h-52" />
      </div>
      <h4 className="text-2xl text-neutral-900 leading-6 font-geist font-medium text-right tracking-[-0.03em] z-10 relative">
        Padrões adotados <br /> por federações <br /> internacionais*
      </h4>
    </motion.div>
  );
}

function CardFour() {
  return (
    <motion.div
      initial={{ opacity: 0, x: 120 }}
      whileInView={{ opacity: 1, x: 0 }}
      transition={{ duration: 1.2, ease: 'easeOut' }}
      viewport={{ once: true }}
      className="lg:col-span-2 bg-neutral-900 rounded-2xl p-8 relative overflow-hidden flex items-end min-h-[280px]"
    >
      <div className="z-10 space-y-4">
        <h4 className="text-5xl md:text-5xl font-domine text-white leading-tight tracking-[-0.03em]">
          Tecnologia que <br /> abre portas.
        </h4>
      </div>
      <img
        src="/svgs/ascii-globe.svg"
        alt="Background globe"
        className="absolute right-[-20px] top-0 h-full object-cover"
      />
    </motion.div>
  );
}

export function FeaturesSection() {
  return (
    <section className="pt-48 pb-[106px]">
      <div
        className="
          max-w-[1440px] mx-auto 
          grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6
          auto-rows-[minmax(200px,auto)]
        "
      >
        <CardOne />
        <CardTwo />
        <CardThree />
        <CardFour />
      </div>
    </section>
  );
}
