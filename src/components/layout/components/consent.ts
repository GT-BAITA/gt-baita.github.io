export const CONSENT_KEY = "clarity-consent";

export type ConsentChoice = "accepted" | "rejected" | null;

export function getConsent(): ConsentChoice {
  const stored = localStorage.getItem(CONSENT_KEY);
  return stored === "accepted" || stored === "rejected" ? stored : null;
}

/**
 * Informa a escolha aos dois provedores de análise. Uma chamada não depende
 * da outra, então uma falha ao carregar um provedor não impede o aviso ao
 * outro que foi carregado.
 *
 * O Google Analytics nega essas opções por padrão em index.html, então esta
 * atualização é o que o habilita; o Clarity não tem um padrão, então ela
 * também é o que o desabilita.
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
