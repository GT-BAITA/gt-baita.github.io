import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./styles/global.css";
import "./locale";
import App from "./App.tsx";
import { HashRouter } from "react-router-dom";
import { GoogleReCaptchaProvider } from "react-google-recaptcha-v3";
import { ScrollToTop } from "./components/shared/scroll-to-top.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <HashRouter>
      <GoogleReCaptchaProvider
        reCaptchaKey={import.meta.env.VITE_RECAPTCHA_SITE_KEY}
      >
        <ScrollToTop />
        <App />
      </GoogleReCaptchaProvider>
    </HashRouter>
  </StrictMode>
);
