import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

export function ClarityNotice() {
  const { t } = useTranslation();
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    // Re-send the user's previous choice to Clarity on every page load,
    // since consent state is not persisted by Clarity itself.
    const userChoice = localStorage.getItem("clarity-consent");
    if (userChoice && window.clarity) {
      window.clarity("consentv2", {
        ad_Storage: userChoice === "accepted" ? "granted" : "denied",
        analytics_Storage: userChoice === "accepted" ? "granted" : "denied",
      });
    }
    if (userChoice) {
      setIsVisible(false);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem("clarity-consent", "accepted");
    if (window.clarity) {
      window.clarity("consentv2", {
        ad_Storage: "granted",
        analytics_Storage: "granted",
      });
    }
    setIsVisible(false);
  };

  const handleReject = () => {
    localStorage.setItem("clarity-consent", "rejected");
    if (window.clarity) {
      window.clarity("consentv2", {
        ad_Storage: "denied",
        analytics_Storage: "denied",
      });
    }
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-neutral-200 shadow-md">
      <div className="max-w-[1264px] mx-auto px-4 py-3 flex flex-row items-center justify-between gap-4">
        <p className="text-xs sm:text-sm text-neutral-600 font-geist">
          {t("clarityNotice.text")}{" "}
          <a
            href="https://clarity.microsoft.com/privacy"
            target="_blank"
            rel="noopener noreferrer"
            className="underline hover:text-neutral-900"
          >
            {t("clarityNotice.learnMore")}
          </a>
        </p>
        <div className="flex gap-2 shrink-0">
          <button
            onClick={handleReject}
            className="px-3 h-8 rounded-md border border-neutral-300 text-neutral-700 text-xs font-medium hover:bg-neutral-100 transition-colors"
          >
            {t("clarityNotice.reject")}
          </button>
          <button
            onClick={handleAccept}
            className="px-3 h-8 rounded-md bg-neutral-900 text-white text-xs font-medium hover:bg-neutral-800 transition-colors"
          >
            {t("clarityNotice.accept")}
          </button>
        </div>
      </div>
    </div>
  );
}
