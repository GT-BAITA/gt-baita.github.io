import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import { CheckCircle2 } from 'lucide-react';
import { CustomInput } from '../atoms/custom-input';
import { CustomTextarea } from '../atoms/custom-textarea';
import { useContactForm } from '@/hooks/useContactForm';
import { motion } from 'motion/react';
import { splitText } from '@/utils/split-text';

export function NewsletterSection() {
  const { formRef, siteKey, isSubmitting, isSucceeded, formId, goBack, errors } = useContactForm();
  const title = 'Inscreva-se em nossa lista';

  return (
    <section id="newsletter" className="px-6 md:px-24 py-24 md:py-48 bg-neutral-900">
      <script src="https://www.google.com/recaptcha/api.js" async defer></script>

      <div className="max-w-[1440px] mx-auto flex flex-col lg:flex-row justify-between items-center gap-12">
        <div className="space-y-6 max-w-[582px]">
          <div className="min-h-[140px]">
            <motion.h2
              className="text-5xl md:text-6xl font-domine text-neutral-100 leading-none inline-block"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.5 }}
              variants={{
                visible: {
                  transition: {
                    staggerChildren: 0.04,
                  },
                },
              }}
            >
              {splitText(title).map((char, index) => (
                <motion.span
                  key={index}
                  variants={{
                    hidden: { opacity: 0 },
                    visible: { opacity: 1 },
                  }}
                  transition={{ duration: 0.05, ease: 'linear' }}
                >
                  {char}
                </motion.span>
              ))}
            </motion.h2>
          </div>

          <p className="text-neutral-300 font-geist">
            Inscreva-se em nosso banco de voluntários para participar do nosso programa de testes
            beta.
          </p>
        </div>

        <div className="w-full max-w-[519px] min-h-[460px] flex items-center justify-center">
          {isSucceeded ? (
            <div className="flex flex-col items-center justify-center text-center gap-6 bg-neutral-800 rounded-2xl p-10 w-full transition-all duration-300 ease-in-out">
              <CheckCircle2 className="w-16 h-16 text-neutral-400 opacity-80" />
              <h2 className="text-4xl md:text-5xl font-domine text-neutral-100 mb-2">Obrigado!</h2>
              <p className="text-neutral-300 font-geist">Sua inscrição foi enviada com sucesso.</p>
              <Button onClick={goBack} className="bg-neutral-950 text-white rounded-lg">
                Voltar
              </Button>
            </div>
          ) : (
            <form
              ref={formRef}
              id="myForm"
              action={`https://formspree.io/f/${formId}`}
              method="POST"
              className="space-y-4 w-full"
            >
              <CustomInput
                id="name"
                type="text"
                name="name"
                label="Nome completo"
                placeholder="Seu nome"
                required
                error={errors.name}
              />

              <CustomInput
                id="email"
                type="email"
                name="email"
                label="Email"
                required
                placeholder="Seu email"
                error={errors.email}
              />

              <CustomTextarea
                id="message"
                name="message"
                label="Mensagem (Opcional)"
                placeholder="Deixe sua mensagem"
                rows={4}
              />

              <button
                className="g-recaptcha w-[90px] text-sm flex justify-center items-center h-10 text-white bg-neutral-950 hover:bg-neutral-950 rounded-lg transition-all duration-300 ease-in-out"
                data-sitekey={siteKey}
                data-callback="onSubmit"
                data-action="submit"
                disabled={isSubmitting}
                type="submit"
              >
                {isSubmitting ? <Spinner /> : 'Enviar'}
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
