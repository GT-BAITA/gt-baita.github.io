import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./styles/global.css";
import "./locale";
import App from "./App.tsx";
import { HashRouter } from "react-router-dom";
import { ScrollToTop } from "./components/shared/scroll-to-top.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <HashRouter>
      <ScrollToTop />
      <App />
    </HashRouter>
  </StrictMode>
);
