/// <reference types="vite/client" />

interface ClarityConsentV2Settings {
  ad_Storage: "granted" | "denied";
  analytics_Storage: "granted" | "denied";
}

interface Window {
  clarity?: (
    command: "consentv2",
    settings: ClarityConsentV2Settings,
  ) => void;
}
