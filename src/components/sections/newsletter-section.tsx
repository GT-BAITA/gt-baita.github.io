import { Button } from '@/components/ui/button';
import { useContactForm } from '@/hooks/useContactForm';
import { ValidationError } from '@formspree/react';
import React from 'react';
import { CheckCircle2 } from 'lucide-react';
import { Spinner } from '@/components/ui/spinner';

export function CustomLabel({ children }: { children: React.ReactNode }) {
  return <label className="text-sm font-geist font-medium text-neutral-300">{children}</label>;
}

export function CustomInput({
  label,
  ...props
}: { label: string } & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div className="space-y-1">
      <CustomLabel>{label}</CustomLabel>
      <input
        {...props}
        className="w-full px-3 py-2 bg-neutral-800 text-neutral-100 rounded-lg border-0 shadow-sm placeholder:text-neutral-500 focus:ring-2 focus:ring-white/20 transition-all duration-300 ease-in-out hover:bg-neutral-700"
      />
    </div>
  );
}

export function CustomTextarea({
  label,
  ...props
}: { label: string } & React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <div className="space-y-1">
      <CustomLabel>{label}</CustomLabel>
      <textarea
        {...props}
        className="w-full px-3 py-2 bg-neutral-800 text-neutral-100 rounded-lg border-0 shadow-sm placeholder:text-neutral-500 resize-none focus:ring-2 focus:ring-white/20 transition-all duration-300 ease-in-out hover:bg-neutral-700"
      />
    </div>
  );
}

export function NewsletterSection() {
  const { handleSubmit, goBack, isSubmitting, isSucceeded, errors } = useContactForm();

  return (
    <section id="newsletter" className="px-6 md:px-24 py-24 md:py-48 bg-neutral-900">
      <div className="max-w-[1440px] mx-auto flex flex-col lg:flex-row justify-between items-center gap-12">
        <div className="space-y-6 max-w-[582px]">
          <h2 className="text-5xl md:text-6xl font-domine text-neutral-100 leading-none">
            Inscreva-se em nossa lista
          </h2>
          <p className="text-neutral-300 font-geist">
            Inscreva-se em nosso banco de voluntários para participar do nosso programa de testes
            beta.
          </p>
        </div>

        <div className="w-full max-w-[519px] min-h-[460px] flex items-center justify-center">
          {isSucceeded ? (
            <div className="flex flex-col items-center justify-center text-center gap-6 bg-neutral-800 rounded-2xl p-10 w-full transition-all duration-300 ease-in-out">
              <CheckCircle2 className="w-16 h-16 text-neutral-400 opacity-80" />
              <div>
                <h2 className="text-4xl md:text-5xl font-domine text-neutral-100 mb-2">
                  Obrigado!
                </h2>
                <p className="text-neutral-300 font-geist">
                  Sua inscrição foi enviada com sucesso.
                </p>
              </div>
              <Button
                onClick={goBack}
                className="w-[90px] h-10 text-white bg-neutral-950 rounded-lg transition-all duration-300 ease-in-out"
              >
                Voltar
              </Button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4 w-full">
              <CustomInput
                id="name"
                type="text"
                name="name"
                label="Nome completo"
                placeholder="Seu nome"
                required
              />
              <ValidationError prefix="Nome" field="name" errors={errors} />

              <CustomInput
                id="email"
                type="email"
                name="email"
                label="Email"
                placeholder="Seu email"
                required
              />
              <ValidationError prefix="Email" field="email" errors={errors} />

              <CustomTextarea
                id="message"
                name="message"
                label="Mensagem (Opcional)"
                placeholder="Diga sua mensagem"
                rows={4}
              />
              <ValidationError prefix="Mensagem" field="message" errors={errors} />

              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-[90px] h-10 text-white bg-neutral-950 hover:bg-neutral-950 rounded-lg transition-all duration-300 ease-in-out"
              >
                {isSubmitting ? <Spinner /> : 'Enviar'}
              </Button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
