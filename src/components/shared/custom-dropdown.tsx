import { Link } from "react-router-dom";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

/**
 * Propriedades do componente `CustomDropdown`.
 *
 * Estende as propriedades de `DropdownMenu`, exceto `children`.
 */
type CustomDropdownProps = Omit<
  React.ComponentProps<typeof DropdownMenu>,
  "children"
> & {
  /** Lista de opções que serão exibidas no dropdown. */
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
  /** Elemento que dispara a abertura do menu (por exemplo, um botão). */
  children: React.ReactNode;
};

/**
 * Componente genérico de menu suspenso.
 */
export function CustomDropdown({
  options,
  children,
  ...props
}: CustomDropdownProps) {
  return (
    <DropdownMenu modal={false} {...props}>
      <DropdownMenuTrigger asChild>
        {children}
      </DropdownMenuTrigger>
      <DropdownMenuContent
        onOpenAutoFocus={(event) => {
          // O menu é portado para o body. Focar seu container sem
          // `preventScroll` faz o navegador reposicionar o alvo nativo do
          // ScrollSmoother e a página sobe ao abrir o seletor.
          event.preventDefault();
          const content = event.currentTarget as HTMLElement | null;
          window.requestAnimationFrame(() =>
            content?.focus({ preventScroll: true })
          );
        }}
      >
        {options.map((option) => {
          const Component = (
            <DropdownMenuItem key={option.value} onClick={option.onClick}>
              {option.label}
            </DropdownMenuItem>
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
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
