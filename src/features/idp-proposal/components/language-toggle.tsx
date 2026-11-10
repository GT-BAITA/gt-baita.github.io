import { useTranslation } from "react-i18next";

/** Usa a preferência de idioma compartilhada com o site, sem sair do slide. */
export function ProposalLanguageToggle() {
  const { t, i18n } = useTranslation();
  const language = i18n.language.startsWith("en") ? "en" : "pt";
  return (
    <div
      className="proposal-language"
      role="group"
      aria-label={t("proposal.controls.language")}
    >
      {(["pt", "en"] as const).map((value) => (
        <button
          key={value}
          type="button"
          aria-label={t(`language-${value}`)}
          aria-pressed={language === value}
          onClick={() => void i18n.changeLanguage(value)}
        >
          {value.toUpperCase()}
        </button>
      ))}
    </div>
  );
}
