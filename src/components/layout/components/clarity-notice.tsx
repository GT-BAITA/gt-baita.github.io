import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { CONSENT_KEY, sendConsent, storeConsent } from "./consent";

export function ClarityNotice() {
  const { t } = useTranslation();
  // Lê a escolha armazenada antes da primeira renderização para que o aviso
  // não apareça rapidamente para quem já respondeu.
  const [isVisible, setIsVisible] = useState(
    () => !localStorage.getItem(CONSENT_KEY)
  );
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    // Reenvia a escolha anterior ao Clarity a cada carregamento, pois o
    // próprio Clarity não persiste o estado do consentimento.
    const userChoice = localStorage.getItem(CONSENT_KEY);
    if (userChoice) {
      sendConsent(userChoice === "accepted");
      return;
    }

    const frame = window.requestAnimationFrame(() => setIsMounted(true));
    return () => window.cancelAnimationFrame(frame);
  }, []);

  const handleChoice = (granted: boolean) => {
    storeConsent(granted);
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div
      role="dialog"
      aria-modal="false"
      aria-labelledby="clarity-notice-title"
      className={`fixed inset-x-4 bottom-4 z-50 sm:inset-x-auto sm:bottom-6 sm:right-6 sm:max-w-md transition-all duration-300 ${
        isMounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
      }`}
    >
      <div className="rounded-xl border border-neutral-800 bg-neutral-950 p-6 shadow-2xl">
        <h2
          id="clarity-notice-title"
          className="font-domine text-lg text-neutral-50"
        >
          {t("clarityNotice.title")}
        </h2>

        <p className="mt-2 font-geist text-sm leading-relaxed text-neutral-400">
          {t("clarityNotice.description")}{" "}
          <Link
            to="/privacy"
            className="text-neutral-200 underline underline-offset-2 transition-colors hover:text-white"
          >
            {t("clarityNotice.link")}
          </Link>
        </p>

        <div className="mt-5 flex gap-3 sm:justify-end">
          <button
            onClick={() => handleChoice(false)}
            className="flex-1 h-10 rounded-lg border border-neutral-700 bg-transparent px-4 font-geist text-sm font-medium text-neutral-200 transition-colors hover:bg-neutral-800 sm:flex-none"
          >
            {t("clarityNotice.reject")}
          </button>
          <button
            onClick={() => handleChoice(true)}
            className="flex-1 h-10 rounded-lg bg-neutral-50 px-4 font-geist text-sm font-medium text-neutral-900 transition-colors hover:bg-white sm:flex-none"
          >
            {t("clarityNotice.accept")}
          </button>
        </div>
      </div>
    </div>
  );
}
