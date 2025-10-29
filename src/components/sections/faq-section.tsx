import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { CustomLink } from '../atoms/custom-link';

function CustomAccordionItem(props: { value: string; children: React.ReactNode }) {
  return (
    <AccordionItem
      value={props.value}
      className="bg-[#F1F1EC] hover:bg-white transition-all duration-300 ease-in-out rounded-lg mb-4 border-none"
    >
      {props.children}
    </AccordionItem>
  );
}

function CustomAccordionTrigger({ text }: { text: string }) {
  return (
    <AccordionTrigger className="text-neutral-900 font-medium hover:no-underline cursor-pointer text-base px-4">
      {text}
    </AccordionTrigger>
  );
}

function CustomAccordionContent({ text, children }: { text?: string; children?: React.ReactNode }) {
  return (
    <AccordionContent className="text-neutral-900 p-0 text-base font-[400] leading-5 px-4 pb-4 font-geist">
      {text}
      {children}
    </AccordionContent>
  );
}

export function FAQSection() {
  return (
    <section id="faq">
      <div className="py-20 space-y-10">
        <h2 className="text-5xl md:text-6xl font-domine text-neutral-900 text-center">FAQ</h2>

        <div className="max-w-[976px] mx-auto">
          <Accordion type="single" collapsible defaultValue="item-1">
            <CustomAccordionItem value="item-1">
              <CustomAccordionTrigger text="O Portal já está no ar?" />
              <CustomAccordionContent text="Ainda não. Temos lançamento previsto para 2027; você pode se inscrever em nosso banco de voluntários para participar do nosso programa de testes beta." />
            </CustomAccordionItem>

            <CustomAccordionItem value="item-2">
              <CustomAccordionTrigger text="Quais os critérios para participar?" />
              <CustomAccordionContent text="Em breve divulgaremos os critérios de participação." />
            </CustomAccordionItem>

            <CustomAccordionItem value="item-3">
              <CustomAccordionTrigger text="Como encontro os melhores benefícios?" />
              <CustomAccordionContent text="Através do Portal de Benefícios, você poderá descobrir todos os serviços disponíveis." />
            </CustomAccordionItem>

            <CustomAccordionItem value="item-4">
              <CustomAccordionTrigger text="Os benefícios são válidos em todo o país?" />
              <CustomAccordionContent text="Sim, os benefícios estarão disponíveis para todas as instituições federadas em todo o Brasil." />
            </CustomAccordionItem>

            <CustomAccordionItem value="item-5">
              <CustomAccordionTrigger text="Como entro em contato com o suporte?" />
              <CustomAccordionContent text="Em breve disponibilizaremos canais de suporte dedicados." />
            </CustomAccordionItem>
            <CustomAccordionItem value="item-6">
              <CustomAccordionTrigger text="Quais iniciativas internacionais estão alinhadas com a CAFe 2.0?" />
              <CustomAccordionContent>
                A eduGAIN tem adotado o OpenID Federation como novo protocolo para{' '}
                <CustomLink
                  href="https://wiki.geant.org/spaces/eduGAIN/pages/1072398451/eduGAIN+-+Open+ID+Federation+Pilot"
                  text="implementação da interfederação"
                />
                . A{' '}
                <CustomLink
                  href="https://italia.github.io/eid-wallet-it-docs/versione-corrente/en/trust-infrastructure.html"
                  text="Itália"
                />{' '}
                e a <CustomLink href="https://sandbox.swedenconnect.se/oidfed/home" text="Suécia" />{' '}
                também estão usando o OpenID Federation como solução de interoperabilidade.
              </CustomAccordionContent>
            </CustomAccordionItem>
          </Accordion>
        </div>
      </div>
    </section>
  );
}
