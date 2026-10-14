import type { ReactNode, SVGProps } from "react";

/* Ícones de traço do mock. Herdam a cor via currentColor; o tamanho vem
   do CSS de cada contexto (.btn svg, .node svg, .ico svg…). */

type IconProps = SVGProps<SVGSVGElement> & { strokeWidth?: number };

function Icon({ children, strokeWidth = 1.6, ...props }: IconProps & { children: ReactNode }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...props}
    >
      {children}
    </svg>
  );
}

export const ArrowUpRight = (p: IconProps) => (
  <Icon {...p}><path d="M7 17 17 7M9 7h8v8" /></Icon>
);
export const ChevronRight = (p: IconProps) => (
  <Icon strokeWidth={1.8} {...p}><path d="m9 6 6 6-6 6" /></Icon>
);
export const ChevronLeft = (p: IconProps) => (
  <Icon strokeWidth={1.8} {...p}><path d="m15 6-6 6 6 6" /></Icon>
);
export const ArrowRight = (p: IconProps) => (
  <Icon {...p}><path d="M5 12h14M13 6l6 6-6 6" /></Icon>
);
export const Play = (p: IconProps) => (
  <Icon {...p}><path d="M8 5.5v13a.5.5 0 0 0 .77.42l10-6.5a.5.5 0 0 0 0-.84l-10-6.5A.5.5 0 0 0 8 5.5Z" /></Icon>
);
export const Pause = (p: IconProps) => (
  <Icon {...p}><path d="M9 5v14M15 5v14" /></Icon>
);
export const Check = (p: IconProps) => (
  <Icon strokeWidth={3} {...p}><path d="m5 12 5 5 9-10" /></Icon>
);
export const Plus = (p: IconProps) => (
  <Icon {...p}><path d="M12 5v14M5 12h14" /></Icon>
);

/* Sistemas da instituição */
export const Cap = (p: IconProps) => (
  <Icon {...p}><path d="M3 9 12 4l9 5-9 5-9-5Z" /><path d="M7 11v5c0 1 2.2 3 5 3s5-2 5-3v-5" /></Icon>
);
export const Monitor = (p: IconProps) => (
  <Icon {...p}><rect x="3" y="4" width="18" height="13" rx="2" /><path d="M8 21h8" /></Icon>
);
export const Mail = (p: IconProps) => (
  <Icon {...p}><rect x="3" y="5" width="18" height="14" rx="2" /><path d="m3 7 9 6 9-6" /></Icon>
);
export const Books = (p: IconProps) => (
  <Icon {...p}><path d="M4 19V5a1 1 0 0 1 1-1h5v15H5a1 1 0 0 1-1-1Z" /><path d="M10 4h4v15h-4M14 6l4-1 3 13-4 1" /></Icon>
);
export const Person = (p: IconProps) => (
  <Icon {...p}><circle cx="12" cy="8" r="4" /><path d="M4 21c1-4 4-6 8-6s7 2 8 6" /></Icon>
);

/* Serviços da RNP e da CAFe */
export const Globe = (p: IconProps) => (
  <Icon {...p}><circle cx="12" cy="12" r="9" /><path d="M3 12h18M12 3c3 3 3 15 0 18M12 3c-3 3-3 15 0 18" /></Icon>
);
export const Grid = (p: IconProps) => (
  <Icon {...p}>
    <rect x="3" y="3" width="7" height="7" rx="1.5" />
    <rect x="14" y="3" width="7" height="7" rx="1.5" />
    <rect x="3" y="14" width="7" height="7" rx="1.5" />
    <rect x="14" y="14" width="7" height="7" rx="1.5" />
  </Icon>
);
export const Building = (p: IconProps) => (
  <Icon {...p}><path d="M3 21h18M5 21V10l7-5 7 5v11M9 21v-6h6v6" /></Icon>
);
export const Share = (p: IconProps) => (
  <Icon {...p}>
    <circle cx="6" cy="12" r="2.5" />
    <circle cx="18" cy="6" r="2.5" />
    <circle cx="18" cy="18" r="2.5" />
    <path d="m8.2 11 7.6-4M8.2 13l7.6 4" />
  </Icon>
);
export const Database = (p: IconProps) => (
  <Icon {...p}>
    <ellipse cx="12" cy="6" rx="7" ry="3" />
    <path d="M5 6v12c0 1.7 3.1 3 7 3s7-1.3 7-3V6M5 12c0 1.7 3.1 3 7 3s7-1.3 7-3" />
  </Icon>
);

/* Por que o BAITA */
export const Shield = (p: IconProps) => (
  <Icon {...p}><path d="M12 3 4 7v5c0 4.5 3.4 8.3 8 9 4.6-.7 8-4.5 8-9V7l-8-4Z" /><path d="m9 12 2 2 4-4" /></Icon>
);
export const Flag = (p: IconProps) => (
  <Icon {...p}><path d="M5 21V4M5 4h11l-2 4 2 4H5" /></Icon>
);
export const Chat = (p: IconProps) => (
  <Icon {...p}><path d="M21 12a8 8 0 0 1-11.6 7.1L4 20l1-4.6A8 8 0 1 1 21 12Z" /></Icon>
);
export const Key = (p: IconProps) => (
  <Icon {...p}><circle cx="7.5" cy="15.5" r="5.5" /><path d="m21 2-9.6 9.6" /><path d="m15.5 7.5 2.3 2.3a1 1 0 0 0 1.4 0l2.1-2.1a1 1 0 0 0 0-1.4L19 4" /></Icon>
);
