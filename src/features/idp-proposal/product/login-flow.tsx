import { useTranslation } from "react-i18next";
import type { ReactNode } from "react";
import {
  CaretDown,
  CaretRight,
  CheckCircle,
  DeviceMobileCamera,
  EnvelopeSimple,
  Eye,
  Key,
  Globe,
  Lifebuoy,
  LockSimple,
  MagnifyingGlass,
  UserSwitch,
} from "@phosphor-icons/react";
import { EXAMPLE_USER } from "@/features/idp-proposal/product/brand";
import { InstitutionMonogram } from "@/features/idp-proposal/product/institution-monogram";
import {
  ProductFrame,
  useAfter,
  useTyped,
} from "@/features/idp-proposal/product/product-frame";

/**
 * Demonstra o fluxo de login em quatro etapas: biblioteca, credenciais,
 * segundo fator e outro sistema com a sessão já estabelecida.
 */
export function LoginFlow({ step }: { step: number }) {
  return (
    <ProductFrame>
      <div className="lf">
        <DigitalLibrary on={step === 0} />
        <InstitutionalLogin on={step === 1} />
        <SecondFactorVerification on={step === 2} />
        <HelpdeskPreview on={step === 3} />
      </div>
    </ProductFrame>
  );
}

/** Cursor de mentira que vai até o alvo e "clica" nele. */
function DemoCursor({ on }: { on: boolean }) {
  return (
    <svg
      className="p-cursor"
      data-on={on ? "" : undefined}
      viewBox="0 0 24 24"
      width="22"
      height="22"
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
  );
}

function DigitalLibrary({ on }: { on: boolean }) {
  const { t: translate } = useTranslation();

  const clicked = useAfter(on, 1500);
  return (
    <section
      className="lf-page lf-lib"
      data-on={on ? "" : undefined}
      aria-hidden={!on}
    >
      <header className="lib-top">
        <span className="lib-brand">
          <InstitutionMonogram size={24} />
          {translate("proposal.console.digitalLibrary")}
        </span>
        <nav>
          <span>{translate("proposal.console.collection")}</span>
          <span>{translate("proposal.console.proceedings")}</span>
          <span>{translate("proposal.console.journals")}</span>
        </nav>
        <span className="p-btn p-btn--ghost">
          {translate("proposal.common.signIn")}
        </span>
      </header>
      <div className="lib-main">
        <h1>{translate("proposal.console.digitalLibrary")}</h1>
        <p className="p-muted">
          {translate("proposal.console.libraryDescription")}
        </p>
        <div className="p-input lib-search">
          <MagnifyingGlass size={16} />
          <span className="p-muted">
            {translate("proposal.console.searchCollection")}
          </span>
        </div>
        <div className="p-card lib-gate">
          <LockSimple size={20} />
          <div>
            <strong>{translate("proposal.console.communityContent")}</strong>
            <p className="p-muted">
              {translate("proposal.console.signInToRead")}
            </p>
          </div>
          <span className="lib-cta">
            <span className="p-btn" data-pressed={clicked ? "" : undefined}>
              <InstitutionMonogram size={18} />
              {translate("proposal.console.institutionalSignIn")}
            </span>
            <DemoCursor on={on} />
          </span>
        </div>
      </div>
    </section>
  );
}

/**
 * Cartão de login no visual das telas reais do IdP (Keycloak com o tema do
 * GT): fundo pontilhado, cartão em duas metades, a instituição à esquerda
 * e o formulário à direita, com o seletor de idioma no canto.
 */
function AuthenticationCard({
  children,
  who,
}: {
  children: ReactNode;
  who?: boolean;
}) {
  const { t: translate } = useTranslation();

  return (
    <div className="ac">
      <div className="ac-brand">
        <InstitutionMonogram size={64} />
        <strong>{translate("proposal.console.institution")}</strong>
      </div>
      <div className="ac-form">
        <span className="ac-lang">
          <Globe size={15} /> {translate("proposal.console.language")}
          <CaretDown size={12} />
        </span>
        <div className="ac-body">{children}</div>
        {who && (
          <span className="ac-who">
            <span className="p-avatar ac-who-av">
              {EXAMPLE_USER.first[0]}
              {EXAMPLE_USER.last[0]}
            </span>
            {EXAMPLE_USER.email}
            <UserSwitch size={14} />
          </span>
        )}
      </div>
    </div>
  );
}

function InstitutionalLogin({ on }: { on: boolean }) {
  const { t: translate } = useTranslation();

  const T = EXAMPLE_USER.email;
  const user = useTyped(T, on, 500, 60);
  const passAt = 500 + T.length * 60 + 300;
  const pass = useTyped("••••••••••", on, passAt, 70);
  const sent = useAfter(on, passAt + 10 * 70 + 400);
  return (
    <section
      className="lf-page lf-dots"
      data-on={on ? "" : undefined}
      aria-hidden={!on}
    >
      <AuthenticationCard>
        <h2>{translate("proposal.common.signIn")}</h2>
        <p className="p-muted">
          {translate("proposal.console.credentialsPrompt")}
        </p>
        <label className="p-field">
          <span>
            {translate("proposal.console.username")} <i className="ac-req">*</i>
          </span>
          <span
            className="p-input"
            data-focus={user < T.length ? "" : undefined}
          >
            {user === 0 ? (
              <span className="ac-ph">
                {translate("proposal.console.emailPlaceholder")}
              </span>
            ) : (
              T.slice(0, user)
            )}
            {user > 0 && user < T.length && <i className="p-caret" />}
          </span>
        </label>
        <label className="p-field">
          <span>
            {translate("proposal.common.password")} <i className="ac-req">*</i>
          </span>
          <span
            className="p-input"
            data-focus={user >= T.length && !sent ? "" : undefined}
          >
            {"••••••••••".slice(0, pass)}
            <Eye size={16} className="ac-eye" />
          </span>
        </label>
        <span
          className="p-btn p-btn--block ac-submit"
          data-pressed={sent ? "" : undefined}
        >
          {translate("proposal.common.signIn")}
        </span>
      </AuthenticationCard>
    </section>
  );
}

/**
 * Métodos do segundo fator, como na tela real "Selecione o método de login".
 * E-mail e chave de segurança têm o texto da captura; o app autenticador
 * entra primeiro porque é o que a pessoa escolhe aqui.
 */

function SecondFactorVerification({ on }: { on: boolean }) {
  const { t: translate } = useTranslation();

  const authenticationMethods = [
    {
      Icon: DeviceMobileCamera,
      t: translate("proposal.console.authenticator"),
      d: translate("proposal.console.authenticatorDescription"),
    },
    {
      Icon: EnvelopeSimple,
      t: translate("proposal.console.emailAuthentication"),
      d: translate("proposal.console.emailAuthenticationDescription"),
    },
    {
      Icon: Key,
      t: translate("proposal.console.securityKey"),
      d: translate("proposal.console.securityKeyDescription"),
    },
  ];

  // Primeiro a escolha do método (o cursor clica no app autenticador), depois o código.
  const PICK = 1500;
  const picked = useAfter(on, PICK);
  const otp = useAfter(on, PICK + 450);
  const CODE = "482913";
  const n = useTyped(CODE, on, PICK + 450 + 700, 160);
  const ok = useAfter(on, PICK + 450 + 700 + CODE.length * 160 + 500);
  return (
    <section
      className="lf-page lf-dots"
      data-on={on ? "" : undefined}
      aria-hidden={!on}
    >
      <AuthenticationCard who>
        {!otp ? (
          <div className="ac-step" key="pick">
            <h2>{translate("proposal.console.chooseMethod")}</h2>
            <ul className="ac-methods">
              {authenticationMethods.map(({ Icon, t, d }, i) => (
                <li
                  key={t}
                  className="ac-method"
                  data-pressed={i === 0 && picked ? "" : undefined}
                >
                  <Icon size={17} />
                  <span>
                    <strong>{t}</strong>
                    <small>{d}</small>
                  </span>
                  <CaretRight size={14} className="ac-method-go" />
                  {i === 0 && <DemoCursor on={on} />}
                </li>
              ))}
            </ul>
          </div>
        ) : (
          <div className="ac-step" key="otp">
            <span className="ac-icon">
              <DeviceMobileCamera size={18} />
            </span>
            <h2>{translate("proposal.console.twoStepVerification")}</h2>
            <p className="p-muted">
              {translate("proposal.console.codePrompt")}
            </p>
            <div className="otp" data-ok={ok ? "" : undefined}>
              {CODE.split("").map((d, i) => (
                <span
                  key={i}
                  className="otp-cell"
                  data-active={i === n && !ok ? "" : undefined}
                >
                  {i < n ? d : ""}
                </span>
              ))}
            </div>
            {ok ? (
              <p className="otp-ok">
                <CheckCircle size={18} weight="fill" />{" "}
                {translate("proposal.console.verified")}
              </p>
            ) : (
              <span className="p-btn p-btn--block">
                {translate("proposal.console.verify")}
              </span>
            )}
            <span className="p-btn p-btn--ghost p-btn--block">
              {translate("proposal.console.tryAnotherMethod")}
            </span>
          </div>
        )}
      </AuthenticationCard>
    </section>
  );
}

function HelpdeskPreview({ on }: { on: boolean }) {
  const { t: translate } = useTranslation();

  const loaded = useAfter(on, 700);
  return (
    <section
      className="lf-page lf-app"
      data-on={on ? "" : undefined}
      aria-hidden={!on}
    >
      {/* Barra de carregamento: o redirecionamento passa pelo IdP sem pedir nada. */}
      <span className="app-progress" data-done={loaded ? "" : undefined} />
      <header className="app-top">
        <span className="lib-brand">
          <Lifebuoy size={20} />
          {translate("proposal.common.helpdesk")}
        </span>
        <span className="app-user">
          <span className="p-avatar">
            {EXAMPLE_USER.first[0]}
            {EXAMPLE_USER.last[0]}
          </span>
          {EXAMPLE_USER.first} {EXAMPLE_USER.last}
        </span>
      </header>
      <div className="app-main" data-in={loaded ? "" : undefined}>
        <h1>
          {translate("proposal.console.greeting")}
          {EXAMPLE_USER.first}
        </h1>
        <p className="p-muted">{translate("proposal.console.signedIn")}</p>
        <div className="app-cards">
          <div className="p-card">
            <strong>{translate("proposal.console.openTicket")}</strong>
            <p className="p-muted">
              {translate("proposal.console.askForHelp")}
            </p>
          </div>
          <div className="p-card">
            <strong>{translate("proposal.console.myTickets")}</strong>
            <p className="p-muted">
              {translate("proposal.console.trackTickets")}
            </p>
          </div>
        </div>
      </div>
      <div className="p-toast" data-in={loaded ? "" : undefined}>
        <CheckCircle size={18} weight="fill" />
        <span>
          {translate("proposal.console.activeSession")}
          <strong>{translate("proposal.console.singleSignOn")}</strong>
        </span>
      </div>
    </section>
  );
}
