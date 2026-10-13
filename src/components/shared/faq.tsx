import * as AccordionPrimitive from "@radix-ui/react-accordion";
import { Plus } from "lucide-react";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export type FaqItem = {
  q: string;
  a: ReactNode;
};

/**
 * Lista de perguntas frequentes do site — a mesma no modo claro e no
 * escuro, porque só usa tokens (ink, line…).
 *
 * Uma pergunta aberta por vez, e a primeira já começa aberta: quem chega à
 * seção vê de cara o formato da resposta. O Radix cuida de teclado,
 * aria-expanded e da altura animada.
 */
export function Faq({
  items,
  defaultOpen = 0,
  className,
}: {
  items: FaqItem[];
  /** Índice aberto ao montar; -1 para começar tudo fechado. */
  defaultOpen?: number;
  className?: string;
}) {
  return (
    <AccordionPrimitive.Root
      type="single"
      collapsible
      defaultValue={defaultOpen >= 0 ? `faq-${defaultOpen}` : undefined}
      className={cn("border-t border-line", className)}
    >
      {items.map((item, i) => (
        <AccordionPrimitive.Item
          key={i}
          value={`faq-${i}`}
          className="group border-b border-line"
        >
          <AccordionPrimitive.Header>
            <AccordionPrimitive.Trigger className="flex min-h-[72px] w-full cursor-pointer items-center justify-between gap-5 py-[18px] text-left font-domine text-lg font-medium tracking-[-0.01em] text-ink outline-none focus-visible:ring-1 focus-visible:ring-ink-3 focus-visible:ring-offset-4 focus-visible:ring-offset-canvas md:text-xl">
              {item.q}
              <Plus
                aria-hidden="true"
                strokeWidth={1.6}
                className="size-[18px] shrink-0 text-ink-3 transition-transform duration-350 ease-[cubic-bezier(.22,1,.36,1)] group-data-[state=open]:rotate-45 group-data-[state=open]:text-ink"
              />
            </AccordionPrimitive.Trigger>
          </AccordionPrimitive.Header>
          <AccordionPrimitive.Content className="overflow-hidden data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down">
            <div className="flex flex-col gap-2.5 pb-6 font-geist text-base leading-relaxed text-ink-2 md:pr-12">
              {item.a}
            </div>
          </AccordionPrimitive.Content>
        </AccordionPrimitive.Item>
      ))}
    </AccordionPrimitive.Root>
  );
}
