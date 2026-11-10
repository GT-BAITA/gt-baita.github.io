import { useTranslation } from "react-i18next";

/** Datas fictícias usam UTC para manter o mesmo instante nos dois idiomas. */
export function useFormattedDate() {
  const { i18n } = useTranslation();
  const locale = i18n.language.startsWith("en") ? "en-US" : "pt-BR";
  return (date: string, includeSeconds = false) =>
    new Intl.DateTimeFormat(locale, {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      ...(includeSeconds ? { second: "2-digit" } : {}),
      hourCycle: "h23",
      timeZone: "UTC",
    }).format(new Date(date));
}
