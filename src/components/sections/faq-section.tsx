import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { CustomLink } from '../atoms/custom-link';
import { useTranslation } from 'react-i18next';

function CustomAccordionItem(props: {
  value: string;
  children: React.ReactNode;
}) {
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

function CustomAccordionContent({
  text,
  children,
}: {
  text?: string;
  children?: React.ReactNode;
}) {
  return (
    <AccordionContent className="text-neutral-900 p-0 text-base font-[400] leading-5 px-4 pb-4 font-geist">
      {text}
      {children}
    </AccordionContent>
  );
}

export function FAQSection() {
  const { t } = useTranslation();

  return (
    <section id="faq">
      <div className="py-20 space-y-10">
        <h2 className="text-5xl md:text-6xl font-domine text-neutral-900 text-center">
          {t('faq.title')}
        </h2>

        <div className="max-w-[976px] mx-auto">
          <Accordion type="single" collapsible defaultValue="item-1">
            <CustomAccordionItem value="item-1">
              <CustomAccordionTrigger text={t('faq.q1')} />
              <CustomAccordionContent text={t('faq.a1')} />
            </CustomAccordionItem>

            <CustomAccordionItem value="item-2">
              <CustomAccordionTrigger text={t('faq.q2')} />
              <CustomAccordionContent text={t('faq.a2')} />
            </CustomAccordionItem>

            <CustomAccordionItem value="item-3">
              <CustomAccordionTrigger text={t('faq.q3')} />
              <CustomAccordionContent text={t('faq.a3')} />
            </CustomAccordionItem>

            <CustomAccordionItem value="item-4">
              <CustomAccordionTrigger text={t('faq.q4')} />
              <CustomAccordionContent text={t('faq.a4')} />
            </CustomAccordionItem>

            <CustomAccordionItem value="item-5">
              <CustomAccordionTrigger text={t('faq.q5')} />
              <CustomAccordionContent text={t('faq.a5')} />
            </CustomAccordionItem>

            <CustomAccordionItem value="item-6">
              <CustomAccordionTrigger text={t('faq.q6')} />
              <CustomAccordionContent>
                {t('faq.a6.prefix')}{' '}
                <CustomLink
                  href="https://wiki.geant.org/spaces/eduGAIN/pages/1072398451/eduGAIN+-+Open+ID+Federation+Pilot"
                  text={t('faq.a6.link-edugain')}
                />
                . {t('faq.a6.middle')}{' '}
                <CustomLink
                  href="https://italia.github.io/eid-wallet-it-docs/versione-corrente/en/trust-infrastructure.html"
                  text={t('faq.a6.link-italy')}
                />{' '}
                {t('faq.a6.and')}{' '}
                <CustomLink
                  href="https://sandbox.swedenconnect.se/oidfed/home"
                  text={t('faq.a6.link-sweden')}
                />{' '}
                {t('faq.a6.suffix')}
              </CustomAccordionContent>
            </CustomAccordionItem>
          </Accordion>
        </div>
      </div>
    </section>
  );
}
