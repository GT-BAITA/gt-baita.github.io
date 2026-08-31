import { ChevronDown, GlobeIcon } from "lucide-react";
import { useTranslation } from "react-i18next";

import { CustomDropdown } from "@/components/shared/custom-dropdown";
import { Button } from "@/components/ui/button";

/**
 * Seletor de idioma da aplicação.
 *
 * Usa um dropdown flutuante em todos os tamanhos de tela. Antes o
 * mobile usava um acordeão que abria embutido, o que funcionava dentro
 * do menu lateral — uma pilha vertical. Agora que o seletor vive na
 * barra horizontal, abrir embutido empurra os itens e quebra a linha.
 */
export function LanguageToggle() {
  const { i18n, t } = useTranslation();

  const currentLang = i18n.language === "pt" ? "PT" : "EN";

  const options = [
    {
      value: "pt",
      label: `${t("language-pt")}`,
      onClick: () => i18n.changeLanguage("pt"),
    },
    {
      value: "en",
      label: `${t("language-en")}`,
      onClick: () => i18n.changeLanguage("en"),
    },
  ];

  return (
    <CustomDropdown options={options}>
      <Button
        variant="ghost"
        aria-label={t("language-pt") + " / " + t("language-en")}
        className="flex h-auto shrink-0 cursor-pointer gap-1.5 whitespace-nowrap px-1.5 py-1 text-neutral-700 transition-colors duration-300 hover:bg-transparent hover:text-neutral-900 focus-visible:ring-white/50 md:gap-3 md:px-3"
      >
        {/* Dropped below sm: on a 320px bar every icon costs a link its room. */}
        <GlobeIcon className="hidden h-4 w-4 sm:block md:h-5 md:w-5" />
        <span className="text-sm font-normal md:text-sm">{currentLang}</span>
        <ChevronDown className="h-4 w-4" />
      </Button>
    </CustomDropdown>
  );
}
