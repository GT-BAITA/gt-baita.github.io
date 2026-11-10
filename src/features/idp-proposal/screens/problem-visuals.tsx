import { useTranslation } from "react-i18next";
import type { CSSProperties } from "react";
import {
  ArrowsClockwise,
  BookOpenText,
  Certificate,
  Database,
  FileCode,
  GraduationCap,
  HardDrives,
  Key,
  Lifebuoy,
  Ticket,
  User,
  UsersThree,
} from "@phosphor-icons/react";

/**
 * Desenhos da tela ProblemScreen, um por dor. Linguagem do microsite do IdP:
 * cartões com borda fina, rótulos em Geist Mono, peças soltas balançando
 * (fragilidade) e pacotes andando devagar (espera).
 */

const i = (n: number) => ({ "--i": n }) as CSSProperties;

/**
 * Meses até entrar na CAFe: o caminho começa reto e logo se enrola em
 * voltas (idas e vindas), até finalmente chegar. A linha se desenha na
 * entrada e um ponto percorre o caminho devagar, em loop.
 */
export const TANGLE =
  "M 40 150 L 130 150 " +
  "C 190 150 205 82 172 82 C 140 82 150 158 222 152 " +
  "C 262 148 276 214 244 216 C 214 218 226 150 292 140 " +
  "C 340 132 348 58 314 62 C 284 66 294 150 352 160 " +
  "C 402 170 388 232 366 224 C 344 216 372 150 424 150 " +
  "L 520 150";

export function TimelineVisual() {
  const { t: translate } = useTranslation();

  return (
    <div className="pv pv-time">
      <svg
        className="pv-tangle"
        viewBox="0 0 560 300"
        style={i(0)}
        aria-hidden="true"
      >
        <path className="pv-tangle-line" d={TANGLE} pathLength={1} />
        <circle className="pv-tangle-end" cx="40" cy="150" r="4" />
        <circle
          className="pv-tangle-end pv-tangle-end--goal"
          cx="520"
          cy="150"
          r="5"
        />
        {/* A linha termina em 2s (0,2s de atraso + 1,8s de desenho).
            Até lá, oculta o ponto que ainda estaria na origem do SVG. */}
        <circle className="pv-tangle-dot" r="3.5" visibility="hidden">
          <set attributeName="visibility" to="visible" begin="2s" />
          <animateMotion
            dur="7s"
            repeatCount="indefinite"
            path={TANGLE}
            begin="2s"
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
        {translate("proposal.visuals.waitingMonths")}
      </p>
    </div>
  );
}

/** Infraestrutura própria: peças soltas que a TI precisa manter de pé. */
export function InfraVisual() {
  const { t: translate } = useTranslation();

  const parts = [
    { Icon: HardDrives, t: translate("proposal.common.server"), x: 33, y: 27 },
    {
      Icon: Certificate,
      t: translate("proposal.common.certificates"),
      x: 66,
      y: 24,
    },
    { Icon: FileCode, t: translate("proposal.common.metadata"), x: 49, y: 46 },
    {
      Icon: ArrowsClockwise,
      t: translate("proposal.common.updates"),
      x: 31,
      y: 67,
    },
    {
      Icon: Database,
      t: translate("proposal.common.userDirectory"),
      x: 67,
      y: 69,
    },
  ];
  return (
    <div className="pv pv-infra">
      {parts.map(({ Icon, t, x, y }, n) => (
        <span
          key={t}
          className="pv-part"
          style={
            {
              left: `${x}%`,
              top: `${y}%`,
              "--wobble-delay": `${-n * 0.6}s`,
              ...i(n),
            } as CSSProperties
          }
        >
          <Icon weight="light" />
          {t}
        </span>
      ))}
      <p className="pv-cap pv-cap--abs">
        {translate("proposal.visuals.itResponsibility")}
      </p>
    </div>
  );
}

/**
 * Um login para cada sistema: a mesma pessoa ligada a três sistemas, cada
 * um com sua senha e sua base, sem ligação entre eles.
 */
export function LoginsVisual() {
  const { t: translate } = useTranslation();

  const systems = [
    {
      Icon: GraduationCap,
      t: translate("proposal.common.academicSystem"),
      b: translate("proposal.visuals.ownDatabase"),
    },
    {
      Icon: BookOpenText,
      t: translate("proposal.common.library"),
      b: translate("proposal.visuals.otherDatabase"),
    },
    {
      Icon: Lifebuoy,
      t: translate("proposal.common.helpdesk"),
      b: translate("proposal.visuals.anotherDatabase"),
    },
  ];
  return (
    <div className="pv pv-logins">
      <span className="pv-user" style={i(0)}>
        <User weight="light" />
        {translate("proposal.common.samePerson")}
      </span>
      {/* Ramificação: da pessoa para os três sistemas. */}
      <div className="pv-branch" aria-hidden="true" style={i(0)}>
        <i />
        <i />
        <i />
      </div>
      <div className="pv-cols">
        {systems.map(({ Icon, t, b }, n) => (
          <div key={t} className="pv-silo" style={i(n + 1)}>
            <span className="pv-sys">
              <Icon weight="light" />
              {t}
            </span>
            <span className="pv-pass">
              <Key weight="light" />
              {translate("proposal.visuals.ownPassword")}
            </span>
            <span className="pv-v" aria-hidden="true" />
            <span className="pv-db">
              <Database weight="light" />
              {b}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

/** Suporte em fila: o chamado anda nível por nível, devagar. */
export function QueueVisual() {
  const { t: translate } = useTranslation();

  const levels = [1, 2, 3].map((level) => translate("proposal.visuals.supportTier", { level }));
  return (
    <div className="pv pv-queue">
      <div className="pv-row">
        <span className="pv-ticket" style={i(0)}>
          <Ticket weight="light" />
          {translate("proposal.visuals.ticket")}
        </span>
        {levels.map((l, n) => (
          <div key={l} className="pv-step" style={i(n + 1)}>
            <span className="pv-link" aria-hidden="true">
              <span
                className="pv-pkt"
                style={{ animationDelay: `${n * 1.6}s` }}
              />
              <span className="pv-wait">
                {translate("proposal.visuals.wait")}
              </span>
            </span>
            <span className="pv-level">
              <UsersThree weight="light" />
              {l}
            </span>
          </div>
        ))}
      </div>
      <p className="pv-cap" style={i(4)}>
        {translate("proposal.visuals.weeksForHelp")}
      </p>
    </div>
  );
}
