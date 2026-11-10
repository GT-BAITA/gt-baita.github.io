import { useTranslation } from "react-i18next";
import { useFormattedDate } from "@/features/idp-proposal/hooks/use-formatted-date";
import type { CSSProperties } from "react";
import {
  ArrowsDownUp,
  CaretDown,
  CaretRight,
  CheckCircle,
  DeviceMobile,
  DotsThreeVertical,
  Funnel,
  LockSimple,
  MagnifyingGlass,
  Monitor,
  Plus,
  User,
} from "@phosphor-icons/react";
import { EXAMPLE_INSTITUTION } from "@/features/idp-proposal/product/brand";
import { ConsoleShell } from "@/features/idp-proposal/product/console-shell";
import { ProductFrame } from "@/features/idp-proposal/product/product-frame";

/**
 * Lista e detalhes de usuários com dados fictícios. Cada passo seleciona uma aba
 * sem executar ações na conta representada.
 */

const INSTITUTION_DOMAIN = EXAMPLE_INSTITUTION.domain;

/** A lista do protótipo (primeira página). */
const EXAMPLE_USERS = [
  ["Ana", "Souza", `ana.souza@${INSTITUTION_DOMAIN}`],
  ["Juliana", "Almeida", `juliana.almeida@${INSTITUTION_DOMAIN}`],
  ["Carla", "Lima", `carla.lima@${INSTITUTION_DOMAIN}`],
  ["Gustavo", "Nascimento", `gustavo.nascimento@${INSTITUTION_DOMAIN}`],
  ["Lucas", "Pereira", `lucas.pereira@${INSTITUTION_DOMAIN}`],
  ["Patricia", "Lima", `patricia.lima@${INSTITUTION_DOMAIN}`],
  ["Sofia", "Martins", `sofia.martins@${INSTITUTION_DOMAIN}`],
  ["Roberto", "Dias", "roberto.dias@example.com"],
  ["Leonardo", "Ribeiro", `leonardo.ribeiro@${INSTITUTION_DOMAIN}`],
  ["Tatiana", "Almeida", `tatiane.almeida@${INSTITUTION_DOMAIN}`],
];

const EXAMPLE_PROFILE = {
  initials: "AS",
  email: `ana.souza@${INSTITUTION_DOMAIN}`,
  id: "2c380ffe-4c9a-4c69-baa0-2664db8146240",
  created: "2026-07-08T09:48:59Z",
  first: "Ana",
  last: "Souza",
};

const CONSENTS = [
  {
    client: "account-console",
    scopes: ["email", "roles", "profile"],
    created: "2026-07-08T10:59:04Z",
    updated: "2026-07-08T10:59:04Z",
  },
];

const SESSIONS = [
  {
    start: "2026-07-08T10:50:00Z",
    last: "2026-07-08T10:59:00Z",
    ip: "172.18.0.1",
    device: "desktop",
    client: "account-console",
  },
  {
    start: "2026-07-07T16:04:00Z",
    last: "2026-07-07T17:21:00Z",
    ip: "10.0.2.18",
    device: "mobile",
    client: `${EXAMPLE_INSTITUTION.short.toLowerCase()}-portal`,
  },
];

const EVENTS = [
  {
    date: "2026-08-14T19:06:00Z",
    type: "CODE_TO_TOKEN",
    details: [
      ["token_id", "onltac:a7c7e338-e24a-7c18-1c9e-5baee0d4eccc"],
      ["grant_type", "authorization_code"],
      ["refresh_token_type", "Refresh"],
      ["scope", "openid email profile"],
    ],
  },
  { date: "2026-08-14T19:06:00Z", type: "LOGIN" },
  { date: "2026-08-14T19:06:00Z", type: "LOGOUT" },
];
const EVENT_IP = "200.225.115.94";
const EVENT_CLIENT = "security-admin-console";

export function UserConsole({ step }: { step: number }) {
  const { t: translate } = useTranslation();

  const tabs = [
    translate("proposal.users.details"),
    translate("proposal.common.groups"),
    translate("proposal.users.consents"),
    translate("proposal.common.sessions"),
    translate("proposal.users.events"),
  ];

  if (step === 0)
    return (
      <ProductFrame>
        <ConsoleShell
          active="users"
          crumbs={[translate("proposal.common.users")]}
        >
          <UserList />
        </ConsoleShell>
      </ProductFrame>
    );
  const tab = step - 1;
  return (
    <ProductFrame>
      <ConsoleShell
        active="users"
        crumbs={[
          translate("proposal.common.users"),
          translate("proposal.users.userDetails"),
        ]}
      >
        <div className="up up-enter">
          <div className="up-head">
            <span className="up-avatar">{EXAMPLE_PROFILE.initials}</span>
            <h1>{EXAMPLE_PROFILE.email}</h1>
            <span className="up-actions">
              <span className="up-switch">
                <i />
              </span>
              {translate("proposal.users.enabled")}
              <span className="p-btn p-btn--ghost">
                <User size={16} />
                {translate("proposal.users.impersonate")}
              </span>
            </span>
          </div>

          <nav className="up-tabs">
            {tabs.map((t, i) => (
              <span key={t} data-on={i === tab ? "" : undefined}>
                {t}
              </span>
            ))}
          </nav>

          {/* key: cada aba entra com um fade. */}
          <div className="up-body" key={tab}>
            {tab === 0 && <UserDetails />}
            {tab === 1 && <UserGroups />}
            {tab === 2 && <UserConsents />}
            {tab === 3 && <UserSessions />}
            {tab === 4 && <UserEvents />}
          </div>
        </div>
      </ConsoleShell>
    </ProductFrame>
  );
}

/** A lista de usuários; o cursor vai até a Ana e a linha acende. */
function UserList() {
  const { t: translate } = useTranslation();

  return (
    <div className="up up-enter">
      <div>
        <h1>{translate("proposal.common.users")}</h1>
        <p className="p-muted up-sub">
          {translate("proposal.users.description")}
        </p>
      </div>
      <div className="up-tools up-tools--start">
        <span className="p-input up-search">
          <MagnifyingGlass size={16} />
          <span className="p-muted">{translate("proposal.users.search")}</span>
        </span>
        <span className="p-btn p-btn--ghost p-btn--sm">
          <Funnel size={14} />
          {translate("proposal.users.advancedSearch")}
          <CaretDown size={12} />
        </span>
      </div>
      <div
        className="up-table"
        data-t="list"
        style={
          {
            "--cols": "minmax(0,1.6fr) minmax(0,1fr) minmax(0,1fr)",
          } as CSSProperties
        }
      >
        <div className="up-th">
          <span className="up-ico">
            {translate("proposal.users.user")} <ArrowsDownUp size={13} />
          </span>
          <span>{translate("proposal.common.firstName")}</span>
          <span>{translate("proposal.common.lastName")}</span>
        </div>
        {EXAMPLE_USERS.map(([first, last, email], i) => (
          <div
            key={email}
            className="up-tr up-tr--list"
            data-pick={i === 0 ? "" : undefined}
          >
            <span className="up-ico up-person">
              <span className="up-avatar up-avatar--sm">
                {first[0]}
                {last[0]}
              </span>
              {email}
              {i === 0 && (
                <svg
                  className="p-cursor up-cursor"
                  data-on=""
                  viewBox="0 0 24 24"
                  width="20"
                  height="20"
                  aria-hidden="true"
                >
                  <path
                    d="M5 3l14 8-6 1.6L10 19z"
                    fill="#0a0a0a"
                    stroke="#fff"
                    strokeWidth="1.5"
                    strokeLinejoin="round"
                  />
                </svg>
              )}
            </span>
            <span>{first}</span>
            <span>{last}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function UserDetails() {
  const formatDate = useFormattedDate();
  const { t: translate } = useTranslation();

  const rows: [string, string, boolean?][] = [
    ["ID", EXAMPLE_PROFILE.id, true],
    [
      translate("proposal.common.created"),
      formatDate(EXAMPLE_PROFILE.created, true),
    ],
    ["Email", EXAMPLE_PROFILE.email],
    [translate("proposal.common.firstName"), EXAMPLE_PROFILE.first],
    [translate("proposal.common.lastName"), EXAMPLE_PROFILE.last],
  ];
  return (
    <>
      <div className="up-form">
        {rows.map(([k, v, mono]) => (
          <div key={k} className="up-row">
            <span>{k}</span>
            <span className="p-input up-ro" data-mono={mono ? "" : undefined}>
              {v}
            </span>
          </div>
        ))}
      </div>
      <div className="up-sec">
        <h2>{translate("proposal.users.credentials")}</h2>
        <p className="p-muted">
          {translate("proposal.users.authenticationMethods")}
        </p>
      </div>
      <div
        className="up-table"
        data-t="cred"
        style={{ "--cols": "minmax(0,1fr) 170px" } as CSSProperties}
      >
        <div className="up-th">
          <span>{translate("proposal.users.type")}</span>
          <span />
        </div>
        <div className="up-tr">
          <span className="up-ico">
            <LockSimple size={16} />
            {translate("proposal.common.password")}
          </span>
          <span className="p-btn p-btn--ghost p-btn--sm">
            {translate("proposal.users.resetPassword")}
          </span>
        </div>
      </div>
    </>
  );
}

function UserGroups() {
  const { t: translate } = useTranslation();

  const groups = [
    {
      name: translate("proposal.users.members"),
      path: `/${EXAMPLE_INSTITUTION.short}/Associados/Efetivos`,
    },
    {
      name: translate("proposal.users.associates"),
      path: `/${EXAMPLE_INSTITUTION.short}/Associados`,
    },
  ];

  return (
    <>
      <div className="up-tools up-tools--end">
        <span className="p-btn p-btn--sm">
          <Plus size={14} />
          {translate("proposal.users.addToGroup")}
        </span>
      </div>
      <div
        className="up-table"
        data-t="groups"
        style={
          { "--cols": "minmax(0,1fr) minmax(0,1.4fr) 100px" } as CSSProperties
        }
      >
        <div className="up-th">
          <span>{translate("proposal.users.groupName")}</span>
          <span>{translate("proposal.users.path")}</span>
          <span />
        </div>
        {groups.map((g) => (
          <div key={g.path} className="up-tr">
            <span>{g.name}</span>
            <span className="p-muted up-mono">{g.path}</span>
            <span className="up-end">{translate("proposal.users.remove")}</span>
          </div>
        ))}
      </div>
    </>
  );
}

function UserConsents() {
  const formatDate = useFormattedDate();
  const { t: translate } = useTranslation();

  return (
    <>
      <div className="up-tools">
        <span className="p-input up-search">
          <MagnifyingGlass size={16} />
          <span className="p-muted">
            {translate("proposal.users.searchClient")}
          </span>
        </span>
        <span className="p-muted">{translate("proposal.users.pageCount")}</span>
      </div>
      <div
        className="up-table"
        data-t="consents"
        style={
          {
            "--cols":
              "minmax(0,1fr) minmax(0,1.2fr) minmax(0,1fr) minmax(0,1fr) 36px",
          } as CSSProperties
        }
      >
        <div className="up-th">
          <span>{translate("proposal.common.client")}</span>
          <span>{translate("proposal.users.grantedScopes")}</span>
          <span>{translate("proposal.common.created")}</span>
          <span>{translate("proposal.users.lastUpdated")}</span>
          <span />
        </div>
        {CONSENTS.map((c) => (
          <div key={c.client} className="up-tr">
            <span>{c.client}</span>
            <span className="up-badges">
              {c.scopes.map((s) => (
                <i key={s}>{s}</i>
              ))}
            </span>
            <span className="p-muted">{formatDate(c.created, true)}</span>
            <span className="p-muted">{formatDate(c.updated, true)}</span>
            <DotsThreeVertical size={16} className="p-muted" />
          </div>
        ))}
      </div>
    </>
  );
}

function UserSessions() {
  const formatDate = useFormattedDate();
  const { t: translate } = useTranslation();

  return (
    <div
      className="up-table"
      data-t="sessions"
      style={
        {
          "--cols":
            "minmax(0,1fr) minmax(0,1fr) minmax(0,.9fr) minmax(0,.9fr) 90px",
        } as CSSProperties
      }
    >
      <div className="up-th">
        <span>{translate("proposal.common.start")}</span>
        <span>{translate("proposal.users.lastAccess")}</span>
        <span>{translate("proposal.common.ipAddress")}</span>
        <span>{translate("proposal.common.client")}</span>
        <span />
      </div>
      {SESSIONS.map((s) => (
        <div key={s.ip} className="up-tr">
          <span>{formatDate(s.start)}</span>
          <span>{formatDate(s.last)}</span>
          <span className="up-ico up-mono">
            {s.device === "mobile" ? (
              <DeviceMobile size={15} />
            ) : (
              <Monitor size={15} />
            )}
            {s.ip}
          </span>
          <span className="p-muted">{s.client}</span>
          <span className="up-end up-kill">
            {translate("proposal.users.endSession")}
          </span>
        </div>
      ))}
    </div>
  );
}

function UserEvents() {
  const formatDate = useFormattedDate();
  const { t: translate } = useTranslation();

  return (
    <>
      <nav className="up-subtabs">
        <span data-on="">{translate("proposal.users.userEvents")}</span>
        <span>{translate("proposal.users.adminEvents")}</span>
      </nav>
      <div
        className="up-table"
        data-t="events"
        style={
          {
            "--cols":
              "28px minmax(0,1fr) minmax(0,1fr) minmax(0,.8fr) minmax(0,1.1fr)",
          } as CSSProperties
        }
      >
        <div className="up-th">
          <span />
          <span>{translate("proposal.users.date")}</span>
          <span>{translate("proposal.users.eventType")}</span>
          <span>{translate("proposal.common.ipAddress")}</span>
          <span>{translate("proposal.common.client")}</span>
        </div>
        {EVENTS.map((e, i) => (
          <div key={e.type} className="up-tr-group">
            <div className="up-tr">
              {i === 0 ? <CaretDown size={14} /> : <CaretRight size={14} />}
              <span>{formatDate(e.date)}</span>
              <span className="up-ico up-mono">
                <CheckCircle size={15} className="up-okc" />
                {e.type}
              </span>
              <span className="up-mono">{EVENT_IP}</span>
              <span className="p-muted up-ellipsis">{EVENT_CLIENT}</span>
            </div>
            {e.details && (
              <dl className="up-details">
                {e.details.map(([k, v]) => (
                  <div key={k}>
                    <dt>{k}</dt>
                    <dd>{v}</dd>
                  </div>
                ))}
              </dl>
            )}
          </div>
        ))}
      </div>
    </>
  );
}
