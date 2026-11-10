import { useTranslation } from "react-i18next";
import type { CSSProperties } from "react";
import {
  ArrowsClockwise,
  BookOpenText,
  Certificate,
  ChatsCircle,
  Database,
  FileCode,
  GlobeHemisphereWest,
  GraduationCap,
  HardDrives,
  Lifebuoy,
  ShieldCheck,
  User,
  UsersThree,
} from "@phosphor-icons/react";
import { TANGLE } from "@/features/idp-proposal/screens/problem-visuals";

/**
 * Desenhos da tela Os Benefícios: cada um é a resposta ao desenho da dor na
 * mesma posição da tela O ProblemScreen (o caminho enrolado vira reto, as peças
 * soltas se encaixam, as bases separadas viram um login só, a fila some).
 */

const i = (n: number) => ({ "--i": n }) as CSSProperties;

/** Poucas semanas: o caminho enrolado fica de fundo, apagado; o novo é reto. */
export function WeeksVisual() {
  const { t: translate } = useTranslation();

  const STRAIGHT = "M 40 150 L 520 150";
  return (
    <div className="pv pv-time">
      <svg
        className="pv-tangle"
        viewBox="0 0 560 300"
        style={i(0)}
        aria-hidden="true"
      >
        <path className="pv-tangle-ghost" d={TANGLE} />
        <path
          className="pv-tangle-line pv-tangle-line--fast"
          d={STRAIGHT}
          pathLength={1}
        />
        <circle className="pv-tangle-end" cx="40" cy="150" r="4" />
        <circle
          className="pv-tangle-end pv-tangle-end--goal"
          cx="520"
          cy="150"
          r="5"
        />
        {/* A linha termina em 1,1s (0,2s de atraso + 0,9s de desenho).
            A visibilidade e o movimento começam juntos depois dela. */}
        <circle className="pv-tangle-dot" r="3.5" visibility="hidden">
          <set attributeName="visibility" to="visible" begin="1.1s" />
          <animateMotion
            dur="2.4s"
            repeatCount="indefinite"
            path={STRAIGHT}
            begin="1.1s"
          />
        </circle>
        <text className="pv-tangle-label" x="40" y="180" textAnchor="middle">
          {translate("proposal.common.start")}
        </text>
        <text className="pv-tangle-label" x="520" y="180" textAnchor="middle">
          CAFe
        </text>
      </svg>
      <p className="pv-cap" style={i(1)}>
        {translate("proposal.visuals.registration")}
      </p>
    </div>
  );
}

/** Nada para instalar: as mesmas peças, agora firmes, dentro da nuvem do GT. */
export function HostedVisual() {
  const { t: translate } = useTranslation();

  const parts = [
    { Icon: HardDrives, t: translate("proposal.common.server") },
    { Icon: Certificate, t: translate("proposal.common.certificates") },
    { Icon: FileCode, t: translate("proposal.common.metadata") },
    { Icon: ArrowsClockwise, t: translate("proposal.common.updates") },
    { Icon: Database, t: translate("proposal.common.userDirectory") },
  ];
  return (
    <div className="pv pv-hosted">
      <div className="pv-cloud" style={i(0)}>
        <span className="pv-cloud-t">
          {translate("proposal.visuals.hosted")}
        </span>
        <div className="pv-cloud-parts">
          {parts.map(({ Icon, t }, n) => (
            <span key={t} className="pv-fixed" style={i(n + 1)}>
              <Icon weight="light" />
              {t}
            </span>
          ))}
        </div>
      </div>
      <p className="pv-cap" style={i(6)}>
        {translate("proposal.visuals.institutionManagesAccess")}
      </p>
    </div>
  );
}

/** Um login para tudo: a pessoa passa pelo IdP e chega a todos os sistemas. */
export function OneLoginVisual() {
  const { t: translate } = useTranslation();

  const systems = [
    { Icon: GraduationCap, t: translate("proposal.common.academicSystem") },
    { Icon: BookOpenText, t: translate("proposal.common.library") },
    { Icon: Lifebuoy, t: translate("proposal.common.helpdesk") },
    { Icon: GlobeHemisphereWest, t: translate("proposal.common.cafeServices") },
  ];
  return (
    <div className="pv pv-logins pv-one">
      <span className="pv-user" style={i(0)}>
        <User weight="light" />
        {translate("proposal.common.samePerson")}
      </span>
      <span className="pv-v" aria-hidden="true" style={i(0)} />
      <span className="pv-idp" style={i(1)}>
        <ShieldCheck weight="fill" />
        IdP SaaS
        <small>{translate("proposal.visuals.ssoMfa")}</small>
      </span>
      <div
        className="pv-branch"
        aria-hidden="true"
        style={{ "--n": systems.length, ...i(1) } as CSSProperties}
      >
        {systems.map((s) => (
          <i key={s.t} />
        ))}
      </div>
      <div
        className="pv-cols"
        style={{ "--n": systems.length } as CSSProperties}
      >
        {systems.map(({ Icon, t }, n) => (
          <div key={t} className="pv-silo" style={i(n + 2)}>
            <span className="pv-sys pv-sys--short">
              <Icon weight="light" />
              {t}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

/** Suporte direto: sem níveis no meio, a conversa vai e volta rápido. */
export function DirectVisual() {
  const { t: translate } = useTranslation();

  return (
    <div className="pv pv-queue">
      <div className="pv-row">
        <span className="pv-ticket" style={i(0)}>
          <UsersThree weight="light" />
          {translate("proposal.common.itTeam")}
        </span>
        <span
          className="pv-link pv-link--direct"
          aria-hidden="true"
          style={i(1)}
        >
          <span className="pv-pkt pv-pkt--fast" />
          <span className="pv-pkt pv-pkt--fast pv-pkt--back" />
          <span className="pv-wait">
            {translate("proposal.visuals.direct")}
          </span>
        </span>
        <span className="pv-level" style={i(2)}>
          <ChatsCircle weight="light" />
          {translate("proposal.visuals.developers")}
        </span>
      </div>
      <p className="pv-cap" style={i(3)}>
        {translate("proposal.visuals.supportChannels")}
      </p>
    </div>
  );
}
