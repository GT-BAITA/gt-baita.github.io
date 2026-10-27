import { useRef, useState, useCallback, useEffect } from "react";
import type { TFunction } from "i18next";

// Empresa e vínculo são coletados, mas não validados — são campos opcionais,
// portanto não possuem mensagem de erro.
type ContactFormField = "name" | "email";

type Errors = Record<ContactFormField, string>;

const emptyErrors: Errors = {
  name: "",
  email: "",
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
    const newErrors: Errors = { ...emptyErrors };

    if (name.length < 3) {
      newErrors.name = t("contactForm.form.validation.name");
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      newErrors.email = t("contactForm.form.validation.email");
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

  // O reCAPTCHA (~350 KB, mais o iframe) só carrega quando o formulário
  // chega perto da tela ou recebe foco — não em toda página que alguém abre.
  // Ao carregar, ele procura o botão .g-recaptcha e se liga a ele.
  useEffect(() => {
    const form = formRef.current;
    if (!form) return;
    const load = () => {
      io.disconnect();
      form.removeEventListener("focusin", load);
      if (document.querySelector("#recaptcha-script")) return;
      const script = document.createElement("script");
      script.id = "recaptcha-script";
      script.src = "https://www.google.com/recaptcha/api.js";
      script.async = true;
      script.defer = true;
      document.body.appendChild(script);
    };
    // Enviado antes de o reCAPTCHA se ligar ao botão, o formulário iria
    // direto para o Formspree, sem o token: segura e garante o carregamento.
    const holdUntilReady = (e: SubmitEvent) => {
      if ("grecaptcha" in window) return;
      e.preventDefault();
      load();
    };
    const io = new IntersectionObserver(
      ([e]) => e.isIntersecting && load(),
      { rootMargin: "800px 0px" }
    );
    // Só observa depois da primeira rolagem: na entrada, enquanto a página
    // ainda está no Suspense (que ocupa uma tela só), o rodapé fica perto o
    // bastante para disparar o carregamento sem ninguém ter rolado até ele.
    // Em página curta, sem rolagem, o foco e o envio cobrem.
    const watch = () => io.observe(form);
    window.addEventListener("scroll", watch, { once: true, passive: true });
    form.addEventListener("focusin", load);
    form.addEventListener("submit", holdUntilReady);
    return () => {
      io.disconnect();
      window.removeEventListener("scroll", watch);
      form.removeEventListener("focusin", load);
      form.removeEventListener("submit", holdUntilReady);
    };
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
