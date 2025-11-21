import { ChevronDown, GlobeIcon } from 'lucide-react';
import { useTranslation } from 'react-i18next';

import { CustomAccordionSelect } from '@/components/atoms/custom-accordion-select';
import { CustomDropdown } from '@/components/atoms/custom-dropdown';
import { Button } from '@/components/ui/button';

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
    <>
      <div className="md:hidden">
        <CustomAccordionSelect value={i18n.language} options={options}>
          <div className="flex items-center gap-3 text-neutral-700 hover:text-neutral-900 text-base font-normal select-none">
            <GlobeIcon className="h-4 w-4 text-neutral-700 hover:text-neutral-900" />
            {currentLang}
          </div>
        </CustomAccordionSelect>
      </div>

      <div className="hidden md:block">
        <CustomDropdown options={options}>
          <Button
            variant="ghost"
            size="sm"
            className={
              'text-neutral-700 hover:text-neutral-900  hover:bg-white/10 focus-visible:ring-white/50 transition-colors duration-300 cursor-pointer flex gap-3 md:hover:bg-transparent md:w-fit'
            }
          >
            <GlobeIcon className="h-5 w-5 text-neutral-700 hover:text-neutral-900 " />
            <span className="text-neutral-700 hover:text-neutral-900  text-sm font-normal">
              {currentLang}
            </span>
            <ChevronDown className="h-4 w-4 text-neutral-700 hover:text-neutral-900 " />
          </Button>
        </CustomDropdown>
      </div>
    </>
  );
}
