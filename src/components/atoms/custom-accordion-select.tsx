import { ChevronDown } from 'lucide-react';
import { useId } from 'react';
import { Link } from 'react-router-dom';
import { twMerge } from 'tailwind-merge';

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

type CustomAccordionSelectProps = {
  /** Valor da opção atualmente selecionada. */
  value?: string;
  /** Lista de opções que serão exibidas no accordion. */
  options: {
    /** Valor único da opção. */
    value: string;
    /** Texto exibido no item do menu. */
    label: string;
    /** Função executada ao clicar na opção. */
    onClick?: () => void;
    /** Link opcional para navegação. */
    href?: string;
  }[];
  /** Conteúdo do botão que abre o accordion. */
  children: React.ReactNode;
  /** Função chamada ao alterar a opção selecionada. */
  onChange?: (value: string) => void;
};

/**
 * Componente genérico de accordion.
 */
export function CustomAccordionSelect({
  value,
  children,
  options,
  onChange,
}: CustomAccordionSelectProps) {
  const accordionValue = useId();
  return (
    <Accordion type="single" collapsible>
      <AccordionItem value={accordionValue} className="border-none">
        <AccordionTrigger className="flex items-center justify-start cursor-pointer hover:no-underline p-0">
          <div>{children}</div>
          <ChevronDown className="h-4 w-4 text-white transition-transform duration-200 group-data-[state=open]:rotate-180" />
        </AccordionTrigger>

        <AccordionContent className="flex flex-col gap-4 mt-4 pb-0">
          {options.map((option) => {
            const Component = (
              <button
                key={option.value}
                onClick={() => {
                  if (option.onClick) option.onClick();
                  onChange?.(option.value);
                }}
                className={twMerge(
                  'text-left flex text-sm items-center gap-2 px-4 text-neutral-700 hover:text-neutral-900 ',
                  option.value === value && 'font-semibold'
                )}
              >
                {option.label}
              </button>
            );

            if (option.href) {
              return (
                <Link key={option.value} to={option.href}>
                  {Component}
                </Link>
              );
            }
            return Component;
          })}
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}
