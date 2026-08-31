import { Mail } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { ContactFormSection } from "./contact-form-section";

const CONTACT_EMAIL = "contato.gtbaita@gmail.com";

export function Footer() {
  const { t } = useTranslation();

  return (
    <footer className="px-4 pb-4 md:px-6 md:pb-6">
      <div className="mx-auto max-w-[1440px] rounded-3xl bg-neutral-900 px-6 py-16 md:px-16 md:py-20">
        <ContactFormSection />

        <hr className="my-14 border-neutral-800 md:my-20" />

        <div className="flex flex-col gap-12 md:flex-row md:justify-between">
          <div className="space-y-4">
            <p className="font-domine text-xl text-neutral-100">
              {t("header.brand")}
            </p>

            <p className="font-geist text-sm text-neutral-400">
              {t("footer.contactUs")}
            </p>

            <a
              href={`mailto:${CONTACT_EMAIL}`}
              className="inline-flex items-center gap-3 rounded-full bg-neutral-950 px-5 py-3 font-geist text-sm text-neutral-100 transition-colors hover:bg-neutral-800"
            >
              <Mail className="h-4 w-4 shrink-0" />
              {CONTACT_EMAIL}
            </a>
          </div>

          <nav className="md:pr-4">
            <h2 className="font-geist text-sm font-medium text-neutral-100">
              {t("footer.navigation")}
            </h2>

            <ul className="mt-4 space-y-3">
              <li>
                <Link
                  to="/"
                  className="font-geist text-sm text-neutral-400 transition-colors hover:text-neutral-100"
                >
                  {t("footer.homepage")}
                </Link>
              </li>
              <li>
                <Link
                  to="/about"
                  className="font-geist text-sm text-neutral-400 transition-colors hover:text-neutral-100"
                >
                  {t("footer.aboutUs")}
                </Link>
              </li>
            </ul>
          </nav>
        </div>

        <div className="mt-14 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between md:mt-20">
          <p className="font-geist text-xs text-neutral-500">
            {t("footer.copyright")}
          </p>

          <Link
            to="/privacy"
            className="font-geist text-sm text-neutral-300 transition-colors hover:text-neutral-100"
          >
            {t("footer.privacy")}
          </Link>
        </div>
      </div>
    </footer>
  );
}
