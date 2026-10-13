import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

/**
 * Botões do site. `primary` e `secondary` são os da marca: usam só os
 * tokens de global.css (ink, raised, line…), então o mesmo botão serve o
 * site claro e o microsite escuro do IdP. As demais variantes vêm do
 * shadcn e ficam para usos utilitários (ghost no seletor de idioma).
 *
 * Para um <a> ou <Link> com cara de botão, use `asChild` ou
 * `buttonVariants({ variant, size })` direto no className.
 */
const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg font-geist text-sm font-medium tracking-[0.07px] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink-3 focus-visible:ring-offset-2 focus-visible:ring-offset-canvas disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        primary: "bg-ink text-canvas hover:bg-ink-hover",
        secondary:
          "border border-line-2 bg-raised text-ink shadow-xs hover:bg-surface-2",
        default:
          "bg-primary text-primary-foreground shadow hover:bg-primary/90",
        destructive:
          "bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90",
        outline:
          "border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        /** Botões dentro de cards e da barra. */
        default: "min-h-9 px-4 py-1.5",
        sm: "min-h-8 px-3 text-xs",
        /** CTAs de seção. */
        md: "min-h-10 px-6 py-2",
        /** CTAs de hero. */
        lg: "min-h-12 px-[22px] py-2.5 text-base",
        icon: "h-9 w-9",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
