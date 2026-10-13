import { Routes, Route, Outlet } from "react-router-dom";
import NotFound from "./pages/not-found";
import { Home } from "./pages";
import { AboutPage } from "./pages/about";
import { Layout } from "./components/layout/layout";
import RandomRedirect from "./pages/redirect";
import { PrivacyPage } from "./pages/privacy";
import { IdpSaasPage } from "./pages/idp-saas";

function App() {
  return (
    <Routes>
      <Route
        element={
          <Layout>
            <Outlet />
          </Layout>
        }
      >
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/privacy" element={<PrivacyPage />} />
        {/* Mesmo chassi, modo escuro: ver src/lib/route-theme.ts. */}
        <Route path="/idp-saas" element={<IdpSaasPage />} />
        <Route path="/wayf-ux-test" element={<RandomRedirect />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}

export default App;
