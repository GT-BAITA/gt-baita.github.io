import { useEffect, useState } from "react";

export function ClarityNotice() {
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
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-neutral-900 border-t border-neutral-800 shadow-2xl">
      <div className="max-w-[1264px] mx-auto px-6 py-6 sm:py-8 flex flex-col items-center gap-6">
        <p className="text-base sm:text-lg text-neutral-200 font-geist text-center">
          Utilizamos ferramentas de análise para melhorar sua experiência no site.{" "}
          <a
            href="https://clarity.microsoft.com/privacy"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-400 underline hover:text-blue-300"
          >
            Saiba mais
          </a>
        </p>
        <div className="flex gap-4 shrink-0 w-full sm:w-auto">
          <button
            onClick={handleReject}
            className="flex-1 sm:flex-none px-6 h-12 rounded-lg bg-neutral-800 text-neutral-100 text-base font-medium hover:bg-neutral-700 transition-colors"
          >
            Não aceito
          </button>
          <button
            onClick={handleAccept}
            className="flex-1 sm:flex-none px-6 h-12 rounded-lg bg-neutral-100 text-neutral-900 text-base font-medium hover:bg-white transition-colors"
          >
            Aceito
          </button>
        </div>
      </div>
    </div>
  );
}
