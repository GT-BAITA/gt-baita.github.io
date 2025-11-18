import { splitText } from '@/utils/split-text';
import { CustomLink } from '../atoms/custom-link';
import { motion } from 'motion/react';
import { useTranslation } from 'react-i18next';

export function AboutSection() {
  const { t } = useTranslation();

  const text = t('about.title');

  return (
    <section id="sobre">
      <div
        data-dark
        className="bg-neutral-900 rounded-3xl p-8 md:p-16 flex flex-col lg:flex-row items-center gap-12"
      >
        <div className="lg:max-w-[445px] min-h-[108px] lg:min-h-[190px] text-4xl md:text-5xl font-domine text-neutral-100 leading-none">
          <motion.h3
            className="inline-block"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.5 }}
            variants={{
              visible: {
                transition: {
                  staggerChildren: 0.04,
                },
              },
            }}
          >
            {splitText(text).map((char, index) => (
              <motion.span
                key={index}
                variants={{
                  hidden: { opacity: 0 },
                  visible: { opacity: 1 },
                }}
                transition={{ duration: 0.05, ease: 'linear' }}
              >
                {char}
              </motion.span>
            ))}
          </motion.h3>
        </div>

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
          <p className="text-neutral-200 font-geist">{t('about.p1')}</p>
          <p className="text-neutral-200 font-geist">
            {t('about.p2.prefix')}{' '}
            <CustomLink
              href="https://openid.net/specs/openid-federation-1_0.html"
              text="OpenID Federation 1.0"
            />{' '}
            {t('about.p2.suffix')}
          </p>
        </div>
      </div>
    </section>
  );
}
