import { useRef, useState, useCallback, useEffect } from "react";
import type { TFunction } from "i18next";

type ContactFormField =
  | "name"
  | "email"
  | "companyOrInstitution"
  | "affiliation";

type Errors = Record<ContactFormField, string>;

const emptyErrors: Errors = {
  name: "",
  email: "",
  companyOrInstitution: "",
  affiliation: "",
};

type ContactFormElements = HTMLFormElement & {
  name: HTMLInputElement;
  email: HTMLInputElement;
  companyOrInstitution: HTMLInputElement;
  affiliation: HTMLInputElement;
};

export function useContactForm(t: TFunction) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSucceeded, setIsSucceeded] = useState(false);
  const [errors, setErrors] = useState<Errors>(emptyErrors);
  const formRef = useRef<ContactFormElements | null>(null);

  const formId = import.meta.env.VITE_FORMSPREE_ID!;
  const siteKey = import.meta.env.VITE_RECAPTCHA_SITE_KEY!;

  const validateForm = () => {
    if (!formRef.current) return false;

    const name = formRef.current.name.value.trim();
    const email = formRef.current.email.value.trim();
    const companyOrInstitution =
      formRef.current.companyOrInstitution.value.trim();
    const affiliation = formRef.current.affiliation.value.trim();

    const newErrors: Errors = { ...emptyErrors };

    if (name.length < 3) {
      newErrors.name = t("newsletter.form.validation.name");
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      newErrors.email = t("newsletter.form.validation.email");
    }

    if (companyOrInstitution.length < 3) {
      newErrors.companyOrInstitution = t(
        "newsletter.form.validation.companyOrInstitution"
      );
    }

    if (affiliation.length < 3) {
      newErrors.affiliation = t("newsletter.form.validation.affiliation");
    }

    setErrors(newErrors);
    return Object.values(newErrors).every((error) => !error);
  };

  (window as any).onSubmit = async function () {
    if (!formRef.current) return;

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const formData = new FormData(formRef.current);

      const response = await fetch(`https://formspree.io/f/${formId}`, {
        method: "POST",
        body: formData,
        headers: { Accept: "application/json" },
      });

      const data = await response.json();
      if (data.ok) {
        setIsSucceeded(true);
        formRef.current.reset();
        setErrors(emptyErrors);
      } else {
        console.error("Erro Formspree:", data);
      }
    } catch (err) {
      console.error("Erro ao enviar:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const goBack = useCallback(() => {
    setIsSucceeded(false);
  }, []);

  useEffect(() => {
    if (document.querySelector("#recaptcha-script")) return;
    const script = document.createElement("script");
    script.id = "recaptcha-script";
    script.src = "https://www.google.com/recaptcha/api.js";
    script.async = true;
    script.defer = true;
    document.body.appendChild(script);
  }, []);

  return {
    formRef,
    formId,
    siteKey,
    isSubmitting,
    isSucceeded,
    goBack,
    errors,
  };
}
