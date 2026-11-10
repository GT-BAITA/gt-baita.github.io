import { useTranslation } from "react-i18next";
import { Fragment, type ReactNode } from "react";
import {
  ChartBar,
  ClockCounterClockwise,
  GearSix,
  LinkSimple,
  Moon,
  SidebarSimple,
  Browsers,
  User,
  UsersThree,
} from "@phosphor-icons/react";
import { EXAMPLE_ADMINISTRATOR } from "@/features/idp-proposal/product/brand";
import { InstitutionMonogram } from "@/features/idp-proposal/product/institution-monogram";

/**
 * Estrutura das demonstrações do console: navegação recolhida e trilha de páginas.
 * Os controles ilustram o produto e não fazem operações reais.
 */
export type ConsoleSection =
  | "users"
  | "groups"
  | "clients"
  | "sessions"
  | "events"
  | "metrics";

export function ConsoleShell({
  active,
  crumbs,
  children,
}: {
  active: ConsoleSection;
  crumbs: string[];
  children: ReactNode;
}) {
  const { t: translate } = useTranslation();

  const navigationItems: {
    id: ConsoleSection;
    label: string;
    Icon: typeof User;
  }[] = [
    { id: "users", label: translate("proposal.common.users"), Icon: User },
    {
      id: "groups",
      label: translate("proposal.common.groups"),
      Icon: UsersThree,
    },
    {
      id: "clients",
      label: translate("proposal.common.clients"),
      Icon: LinkSimple,
    },
    {
      id: "sessions",
      label: translate("proposal.common.sessions"),
      Icon: Browsers,
    },
    {
      id: "events",
      label: translate("proposal.console.eventHistory"),
      Icon: ClockCounterClockwise,
    },
    {
      id: "metrics",
      label: translate("proposal.common.metrics"),
      Icon: ChartBar,
    },
  ];

  return (
    <div className="cs">
      <aside className="cs-rail">
        <InstitutionMonogram size={32} />
        <nav>
          {navigationItems.map(({ id, label, Icon }, i) => (
            <Fragment key={id}>
              {/* Separador entre "Gerenciamento de Usuários" e "Atividade". */}
              {i === 2 && <i className="cs-sep" aria-hidden="true" />}
              <span
                className="cs-item"
                data-on={id === active ? "" : undefined}
                title={label}
              >
                <Icon size={18} />
              </span>
            </Fragment>
          ))}
        </nav>
        {/* Configurações, no pé da barra, como na tela real. */}
        <span
          className="cs-item cs-settings"
          title={translate("proposal.common.settings")}
        >
          <GearSix size={18} />
        </span>
        <img
          className="cs-admin"
          src={EXAMPLE_ADMINISTRATOR.avatar}
          alt={EXAMPLE_ADMINISTRATOR.name}
          width={32}
          height={32}
        />
      </aside>
      <div className="cs-body">
        <header className="cs-top">
          <SidebarSimple size={18} className="p-muted" />
          <i className="cs-vsep" aria-hidden="true" />
          <span className="cs-crumbs">
            {crumbs.map((c, i) => (
              <span
                key={c}
                data-last={i === crumbs.length - 1 ? "" : undefined}
              >
                {c}
              </span>
            ))}
          </span>
          <Moon size={18} className="p-muted cs-theme" />
        </header>
        <main className="cs-main">{children}</main>
      </div>
    </div>
  );
}
