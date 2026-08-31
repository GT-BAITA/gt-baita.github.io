/// <reference types="vite/client" />

type ConsentState = "granted" | "denied";

interface ClarityConsentV2Settings {
  ad_Storage: ConsentState;
  analytics_Storage: ConsentState;
}

interface GtagConsentSettings {
  ad_storage?: ConsentState;
  ad_user_data?: ConsentState;
  ad_personalization?: ConsentState;
  analytics_storage?: ConsentState;
}

interface Window {
  clarity?: (
    command: "consentv2",
    settings: ClarityConsentV2Settings,
  ) => void;
  gtag?: (
    command: "consent",
    action: "default" | "update",
    settings: GtagConsentSettings,
  ) => void;
}
