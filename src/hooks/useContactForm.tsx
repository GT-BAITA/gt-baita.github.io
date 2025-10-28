import { useEffect, useState } from 'react';
import { useForm } from '@formspree/react';

export function useContactForm() {
  const formId = import.meta.env.VITE_FORMSPREE_ID!;

  if (!formId) {
    console.error('Variável de ambiente VITE_FORMSPREE_ID não encontrada.');
  }

  const [form, handleSubmit] = useForm(formId || '');
  const [isSucceeded, setIsSucceeded] = useState(false);

  function goBack() {
    setIsSucceeded(false);
  }

  useEffect(() => {
    if (form.succeeded && !form.submitting) {
      setIsSucceeded(true);
    }
  }, [form.succeeded, form.submitting]);

  return { handleSubmit, goBack, isSubmitting: form.submitting, isSucceeded, errors: form.errors };
}
