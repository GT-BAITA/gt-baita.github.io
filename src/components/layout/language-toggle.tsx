import { ChevronDown, GlobeIcon } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { twMerge } from 'tailwind-merge';

import { Button } from '@/components/ui/button';
import { CustomDropdown } from '../atoms/custom-dropdown';

/**
 * Botão de seleção de idioma da aplicação.
 *
 * Exibe um ícone de globo e abre um menu com as opções de idioma (Português e Inglês).
 * Ao clicar em uma opção, o idioma é alterado via `i18next`.
 */
export function LanguageToggle() {
  const { i18n, t } = useTranslation();

  const currentLang = i18n.language === 'pt' ? 'PT' : 'EN';

  /** Lista de opções disponíveis para troca de idioma. */
  const options = [
    {
      value: 'pt',
      label: `${t('language-pt')}`,
      onClick: () => i18n.changeLanguage('pt'),
    },
    {
      value: 'en',
      label: `${t('language-en')}`,
      onClick: () => i18n.changeLanguage('en'),
    },
  ];

  return (
    <CustomDropdown options={options}>
      <Button
        variant="ghost"
        size="sm"
        className={twMerge(
          'text-neutral-700  focus-visible:ring-white/50 transition-colors duration-300 cursor-pointer flex items-center gap-3'
        )}
      >
        <GlobeIcon className="h-5 w-5 text-neutral-700" />
        <span className="text-neutral-700 text-base font-normal">
          {currentLang}
        </span>
        <ChevronDown className="h-4 w-4 text-neutral-700" />
      </Button>
    </CustomDropdown>
  );
}
