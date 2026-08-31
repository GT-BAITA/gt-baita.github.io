export const CONSENT_KEY = "clarity-consent";

export type ConsentChoice = "accepted" | "rejected" | null;

export function getConsent(): ConsentChoice {
  const stored = localStorage.getItem(CONSENT_KEY);
  return stored === "accepted" || stored === "rejected" ? stored : null;
}

/**
 * Signal the choice to both analytics providers. Neither call is guarded by
 * the other, so a provider that fails to load cannot suppress the signal to
 * the one that did.
 *
 * Google Analytics denies these by default in index.html, so this update is
 * what turns it on; Clarity has no default, so this is also what turns it off.
 */
export function sendConsent(granted: boolean) {
  const state: ConsentState = granted ? "granted" : "denied";

  window.clarity?.("consentv2", {
    ad_Storage: state,
    analytics_Storage: state,
  });

  window.gtag?.("consent", "update", {
    ad_storage: state,
    ad_user_data: state,
    ad_personalization: state,
    analytics_storage: state,
  });
}

export function storeConsent(granted: boolean) {
  localStorage.setItem(CONSENT_KEY, granted ? "accepted" : "rejected");
  sendConsent(granted);
}
