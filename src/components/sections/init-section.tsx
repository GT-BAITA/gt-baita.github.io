import { Button } from '@/components/ui/button';
import { ChevronRight } from 'lucide-react';
import { motion, useScroll, useTransform } from 'motion/react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

export function InitSection() {
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 500], [0, -50]);

  const { t } = useTranslation();

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
        <div className="flex items-center justify-center flex-col gap-6 text-center">
          <h2 className="text-5xl md:text-6xl lg:text-[64px] max-w-[900px] font-domine leading-none text-neutral-900">
            {t('init.title')}
          </h2>
          <p className="text-xl text-neutral-500 leading-tight font-geist">
            {t('init.subtitle')}
          </p>

          <Button
            className="bg-zinc-950 text-white hover:bg-neutral-900 rounded-lg font-geist w-[139px]"
            onClick={handleScrollToAbout}
          >
            <Link to="/about" className="flex items-center justify-center gap-1">
              {t('init.cta')} <ChevronRight className="w-4 h-4" />
            </Link>

          </Button>
          <img
            src="/svgs/management-system.svg"
            alt="Management System Image"
            className="mt-10"
          />
        </div>
      </section>

      <motion.div
        className="absolute right-0 top-8 -z-[1] hidden opacity-50 lg:flex justify-end"
        style={{ y }}
      >
        <img
          src="/svgs/ascii-brasil.svg"
          alt="Hero Image"
          className="w-[80%] h-auto"
        />
      </motion.div>
    </>
  );
}
