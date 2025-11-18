import { motion } from 'motion/react';
import { useTranslation } from 'react-i18next';

export default function YouTubeEmbed() {
  const { t } = useTranslation();

  return (
    <section id="journey" className="text-center py-24 overflow-hidden">
      <div className="max-w-[840px] mx-auto px-6">
        <motion.h2
          className="text-5xl md:text-6xl font-domine text-neutral-900 mb-6"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          viewport={{ once: true }}
        >
          {t('journey.title')}
        </motion.h2>

        <motion.p
          className="text-neutral-600 text-base leading-relaxed mb-12 font-geist"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut', delay: 0.1 }}
          viewport={{ once: true }}
        >
          {t('journey.p1.prefix')} <strong>{t('journey.p1.strong1')}</strong>,{' '}
          {t('journey.p1.middle')} <strong>{t('journey.p1.strong2')}</strong>.{' '}
          {t('journey.p1.suffix')}
        </motion.p>

        <motion.div
          className="aspect-video max-w-[800px] mx-auto rounded-2xl overflow-hidden shadow-xl"
          initial={{ opacity: 0, y: 60 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: 'easeOut', delay: 0.2 }}
          viewport={{ once: true }}
        >
          <iframe
            width="100%"
            height="100%"
            src="https://www.youtube.com/embed/m_gvrV80jUs"
            title={t('journey.videoTitle')}
            allowFullScreen
            className="rounded-2xl"
          ></iframe>
        </motion.div>
      </div>
    </section>
  );
}
