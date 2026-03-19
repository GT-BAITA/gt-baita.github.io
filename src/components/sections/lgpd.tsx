import { useTranslation } from 'react-i18next';

export function LGPDSection() {
  const { t } = useTranslation();

  return (
    <div className="flex h-[64px] px-[88px] flex-col justify-center items-center gap-2 self-stretch bg-neutral-950">
      <p className="text-neutral-500 font-geist">
        {t('lgpd.prefix')}{' '}
        <a href="mailto:edu.perottoni@gmail.com" className="underline">
          edu.perottoni@gmail.com
        </a>
        .
      </p>
    </div>
  );
}
