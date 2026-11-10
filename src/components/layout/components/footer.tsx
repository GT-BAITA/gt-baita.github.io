import { Mail } from "lucide-react";
import { useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { ContactFormSection } from "./contact-form-section";
import { IDP_PATH } from "@/lib/route-theme";

const CONTACT_EMAIL = "contato.gtbaita@gmail.com";

const NAV_LINK =
  "font-geist text-sm text-ink-3 transition-colors hover:text-ink";

export function Footer() {
  const { t } = useTranslation();
  const cardRef = useRef<HTMLDivElement>(null);

  // O card sobe e acende ao entrar na tela, marcando o fim da página. Volta
  // ao estado inicial quando sai por baixo, para tocar de novo na próxima
  // chegada.
  useEffect(() => {
    const card = cardRef.current;
    if (!card) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) card.dataset.in = "";
        else if (e.boundingClientRect.top > 0) delete card.dataset.in;
      },
      { rootMargin: "0px 0px -12% 0px" }
    );
    io.observe(card);
    return () => io.disconnect();
  }, []);

  return (
    // Ilha escura: a classe `dark` troca os tokens só aqui dentro, então o
    // rodapé é o mesmo bloco escuro no site claro e um painel no microsite
    // do IdP, que já é escuro.
    <footer className="dark page-frame pb-4 md:pb-6">
      <div ref={cardRef} className="footer-rise rounded-3xl border border-line bg-surface px-6 py-16 md:px-16 md:py-20">
        <ContactFormSection />

        <hr className="my-14 border-line md:my-20" />

        <div className="flex flex-col gap-12 md:flex-row md:justify-between">
          <div className="space-y-4">
            <p className="font-domine text-xl text-ink">
              {t("header.brand")}
            </p>

            <p className="font-geist text-sm text-ink-3">
              {t("footer.contactUs")}
            </p>

            <a
              href={`mailto:${CONTACT_EMAIL}`}
              className="inline-flex items-center gap-3 rounded-full bg-canvas px-5 py-3 font-geist text-sm text-ink transition-colors hover:bg-surface-2"
            >
              <Mail className="h-4 w-4 shrink-0" />
              {CONTACT_EMAIL}
            </a>
          </div>

          <nav className="md:pr-4">
            <h2 className="font-geist text-sm font-medium text-ink">
              {t("footer.navigation")}
            </h2>

            <ul className="mt-4 space-y-3">
              <li>
                <Link to="/" className={NAV_LINK}>
                  {t("footer.homepage")}
                </Link>
              </li>
              <li>
                <Link to="/about" className={NAV_LINK}>
                  {t("footer.aboutUs")}
                </Link>
              </li>
              <li>
                <Link to={IDP_PATH} className={NAV_LINK}>
                  {t("footer.idp")}
                </Link>
              </li>
            </ul>
          </nav>
        </div>

        <div className="mt-14 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between md:mt-20">
          <p className="font-geist text-xs text-ink-3">
            {t("footer.copyright")}
          </p>

          <Link
            to="/privacy"
            className="font-geist text-sm text-ink-2 transition-colors hover:text-ink"
          >
            {t("footer.privacy")}
          </Link>
        </div>
      </div>
    </footer>
  );
}
