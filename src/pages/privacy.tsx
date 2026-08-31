import { useState } from "react";
import { useTranslation } from "react-i18next";
import { getConsent, storeConsent, type ConsentChoice } from "@/components/layout/components/consent";

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="mt-10">
      <h2 className="font-domine text-xl text-neutral-900">{title}</h2>
      <div className="mt-3 flex flex-col gap-3 font-geist text-neutral-700 leading-relaxed">
        {children}
      </div>
    </section>
  );
}

function List({ items }: { items: string[] }) {
  return (
    <ul className="flex list-disc flex-col gap-2 pl-5 marker:text-neutral-400">
      {items.map((item) => (
        <li key={item}>{item}</li>
      ))}
    </ul>
  );
}

const CONTACT_EMAIL = "contato.gtbaita@gmail.com";

function ContactLink() {
  return (
    <a
      href={`mailto:${CONTACT_EMAIL}`}
      className="text-neutral-900 underline underline-offset-2 hover:opacity-70"
    >
      {CONTACT_EMAIL}
    </a>
  );
}

function ConsentControls() {
  const { t } = useTranslation();
  const [choice, setChoice] = useState<ConsentChoice>(() => getConsent());
  const [justSaved, setJustSaved] = useState(false);

  const update = (granted: boolean) => {
    storeConsent(granted);
    setChoice(granted ? "accepted" : "rejected");
    setJustSaved(true);
  };

  const status =
    choice === "accepted"
      ? t("privacy.consent.granted")
      : choice === "rejected"
        ? t("privacy.consent.denied")
        : t("privacy.consent.unset");

  return (
    <section className="mt-12 rounded-xl border border-neutral-200 bg-neutral-50 p-6">
      <h2 className="font-domine text-xl text-neutral-900">
        {t("privacy.consent.title")}
      </h2>

      <p className="mt-3 font-geist text-neutral-700" aria-live="polite">
        {status} {justSaved && <span>{t("privacy.consent.saved")}</span>}
      </p>

      <div className="mt-5 flex flex-wrap gap-3">
        <button
          onClick={() => update(false)}
          aria-pressed={choice === "rejected"}
          className="h-10 rounded-lg border border-neutral-300 px-4 font-geist text-sm font-medium text-neutral-800 transition-colors hover:bg-neutral-200"
        >
          {t("privacy.consent.reject")}
        </button>
        <button
          onClick={() => update(true)}
          aria-pressed={choice === "accepted"}
          className="h-10 rounded-lg bg-neutral-900 px-4 font-geist text-sm font-medium text-white transition-colors hover:bg-neutral-800"
        >
          {t("privacy.consent.accept")}
        </button>
      </div>
    </section>
  );
}

export function PrivacyPage() {
  const { t } = useTranslation();

  return (
    <div className="mx-auto max-w-3xl px-4 pt-32 pb-16 md:pt-40 md:pb-24">
      <p className="font-geist text-sm text-neutral-500">
        {t("privacy.lastUpdated")}
      </p>

      <h1 className="mt-3 font-domine text-4xl text-neutral-900 sm:text-5xl">
        {t("privacy.title")}
      </h1>

      <p className="mt-4 font-geist text-lg text-neutral-600">
        {t("privacy.subtitle")}
      </p>

      <p className="mt-8 font-geist leading-relaxed text-neutral-700">
        {t("privacy.intro")}
      </p>

      <Section title={t("privacy.s1.title")}>
        <p>{t("privacy.s1.intro")}</p>
        <List
          items={[
            t("privacy.s1.item1"),
            t("privacy.s1.item2"),
            t("privacy.s1.item3"),
          ]}
        />
      </Section>

      <Section title={t("privacy.s2.title")}>
        <p>{t("privacy.s2.intro")}</p>
        <List
          items={[
            t("privacy.s2.item1"),
            t("privacy.s2.item2"),
            t("privacy.s2.item3"),
            t("privacy.s2.item4"),
            t("privacy.s2.item5"),
          ]}
        />
      </Section>

      <Section title={t("privacy.s3.title")}>
        <p>{t("privacy.s3.p1")}</p>
        <p>{t("privacy.s3.p2")}</p>
      </Section>

      <Section title={t("privacy.s4.title")}>
        <p>{t("privacy.s4.p1")}</p>
        <p>{t("privacy.s4.p2")}</p>
      </Section>

      <Section title={t("privacy.s5.title")}>
        <p>{t("privacy.s5.p1")}</p>
        <p>{t("privacy.s5.p2")}</p>
      </Section>

      <Section title={t("privacy.s6.title")}>
        <p>{t("privacy.s6.p1")}</p>
        <p>{t("privacy.s6.p2")}</p>
        <List
          items={[
            t("privacy.s6.item1"),
            t("privacy.s6.item2"),
            t("privacy.s6.item3"),
            t("privacy.s6.item4"),
            t("privacy.s6.item5"),
          ]}
        />
      </Section>

      <Section title={t("privacy.s7.title")}>
        <p>{t("privacy.s7.p1")}</p>
        <p>{t("privacy.s7.p2")}</p>
      </Section>

      <Section title={t("privacy.s8.title")}>
        <p>{t("privacy.s8.p1")}</p>
        <p>
          {t("privacy.s8.p2")} <ContactLink />
        </p>
      </Section>

      <Section title={t("privacy.s9.title")}>
        <p>{t("privacy.s9.p1")}</p>
      </Section>

      <Section title={t("privacy.s10.title")}>
        <p>
          {t("privacy.s10.p1")} <ContactLink />
        </p>
      </Section>

      <ConsentControls />
    </div>
  );
}
