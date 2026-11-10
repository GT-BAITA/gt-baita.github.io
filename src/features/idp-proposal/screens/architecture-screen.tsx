import { useTranslation } from "react-i18next";
import { useState, type CSSProperties, type ReactNode } from "react";
import {
  Database,
  Desktop,
  GlobeHemisphereWest,
  GraduationCap,
  Shield,
  ShieldCheck,
  WifiHigh,
  X,
} from "@phosphor-icons/react";
import { rv } from "@/features/idp-proposal/components/slide-layout";
import { useEntryStep, useSlideSteps } from "@/features/idp-proposal/steps";
import { useMobile } from "@/features/idp-proposal/hooks/use-mobile";

/**
 * Compara a arquitetura antes e depois do IdP SaaS, com diretório hospedado ou local.
 * As áreas e conexões permanecem montadas para animar posição e opacidade.
 * O eduroam usa o RADIUS da instituição e não passa pelo IdP.
 */

type UserDatabaseScenario = "none" | "many" | "ldap" | "acad";
type DirectoryLocation = "gt" | "inst";
type ArchitectureLane = "rnp" | "gt" | "inst";

/** Quem já tem LDAP/AD tende a manter o diretório; os outros, a hospedar. */
const getSuggestedDirectory = (s: UserDatabaseScenario): DirectoryLocation =>
  s === "ldap" ? "inst" : "gt";

/** No Antes não há GT: RNP e instituição se alargam e ficam só com um vão
 *  no meio para o corte (o X). Na troca, as áreas deslizam para o lugar. */
const LANES_BEFORE: Record<ArchitectureLane, { x: number; w: number }> = {
  rnp: { x: 0, w: 500 },
  gt: { x: 500, w: 200 },
  inst: { x: 700, w: 500 },
};

/** O que roda em cada área depois (GT e instituição dependem da opção). */

const W = 1200;
const H = 460;
const toPercentage = (v: number, of: number) => `${(v / of) * 100}%`;
/**
 * Posição de um ponto do diagrama. No celular (`vert`) o diagrama gira:
 * x e y trocam de lugar, e as áreas ficam empilhadas (RNP em cima, GT no
 * meio, instituição embaixo), com espaço para os cartões.
 */
const getNodePosition = (x: number, y: number, vert: boolean) =>
  vert
    ? { left: toPercentage(y, H), top: toPercentage(x, W) }
    : { left: toPercentage(x, W), top: toPercentage(y, H) };

/** Linhas de cima e de baixo e o centro, abaixo do título das áreas. */
const TOP = 165;
const MID = 252;
const BOT = 340;
const COL = { rnp: 150, gt: 580, inst: 1030 };
/** Centros das colunas no Antes (áreas mais largas). */
const COL_BEFORE = { rnp: 250, gt: 600, inst: 950 };

type NodeId = "cafe" | "edu" | "idp" | "hdir" | "sys" | "base" | "shib";
type Coordinates = readonly [number, number];
const LANE_OF: Record<NodeId, ArchitectureLane> = {
  cafe: "rnp",
  edu: "rnp",
  idp: "gt",
  hdir: "gt",
  sys: "inst",
  base: "inst",
  shib: "inst",
};

export function ArchitectureScreen() {
  const { t: translate } = useTranslation();

  const scenarios: { id: UserDatabaseScenario; label: string; text: string }[] =
    [
      {
        id: "none",
        label: translate("proposal.architecture.noDatabase"),
        text: translate("proposal.architecture.noDatabaseDescription"),
      },
      {
        id: "many",
        label: translate("proposal.architecture.multipleDatabases"),
        // Quem já tem um IdP Shibboleth na CAFe, mas quer juntar as bases num
        // login unificado.
        text: translate("proposal.architecture.multipleDatabasesDescription"),
      },
      {
        id: "ldap",
        label: "LDAP/AD",
        text: translate("proposal.architecture.ldapDescription"),
      },
      {
        id: "acad",
        label: translate("proposal.common.academicSystem"),
        text: translate("proposal.architecture.academicDescription"),
      },
    ];
  const directoryOptions: {
    id: DirectoryLocation;
    label: string;
    text: string;
  }[] = [
    {
      id: "gt",
      label: translate("proposal.architecture.hostedDirectory"),
      text: translate("proposal.architecture.hostedDescription"),
    },
    {
      id: "inst",
      label: translate("proposal.architecture.localDirectory"),
      text: translate("proposal.architecture.localDescription"),
    },
  ];
  const lanes: { id: ArchitectureLane; t: string; x: number; w: number }[] = [
    { id: "rnp", t: "RNP", x: 0, w: 300 },
    { id: "gt", t: "GT-Baita", x: 330, w: 500 },
    {
      id: "inst",
      t: translate("proposal.architecture.institution"),
      x: 860,
      w: 340,
    },
  ];
  function getLaneDescription(
    lane: ArchitectureLane,
    option: DirectoryLocation
  ): string {
    if (lane === "rnp")
      return translate("proposal.architecture.rnpDescription");
    if (lane === "gt")
      return option === "gt"
        ? translate("proposal.architecture.gtHostedDescription")
        : translate("proposal.architecture.gtLocalDescription");
    return option === "gt"
      ? translate("proposal.architecture.institutionHostedDescription")
      : translate("proposal.architecture.institutionLocalDescription");
  }

  const vert = useMobile();
  const entry = useEntryStep(5);
  const [step, setStep] = useState(entry);
  useSlideSteps(step, setStep, 5);
  const after = step >= 1;
  const lane: ArchitectureLane | null = step >= 2 ? lanes[step - 2].id : null;
  const pickLane = (l: ArchitectureLane) =>
    setStep(lane === l ? 1 : 2 + lanes.findIndex((z) => z.id === l));

  const [scenario, setScenario] = useState<UserDatabaseScenario>("ldap");
  const [option, setOption] = useState<DirectoryLocation>(
    getSuggestedDirectory("ldap")
  );
  const pickScenario = (s: UserDatabaseScenario) => {
    setScenario(s);
    setOption(getSuggestedDirectory(s));
  };

  // Antes, com várias bases: a instituição já tem um IdP Shibboleth.
  const shib = !after && scenario === "many";

  // O que aparece em cada estado.
  const show = {
    x: !after && !shib,
    hdir: after && option === "gt",
    base: !after || option === "inst",
    sysBase: !after && scenario !== "none",
    instLink: after && option === "inst",
    // Com o diretório no GT, não há como ligar o eduroam: a RNP fica só
    // com os serviços da CAFe.
    edu: !after || option === "inst",
  };

  // Posições: quem fica sozinho na sua área vai para o centro dela.
  const C = after ? COL : COL_BEFORE;
  const P: Record<NodeId, Coordinates> = {
    cafe: [C.rnp, show.edu ? TOP : MID],
    edu: [C.rnp, BOT],
    // No Antes, o X fica no mesmo ponto (no vão entre as áreas).
    idp: [C.gt, show.hdir ? TOP - 10 : MID],
    hdir: [C.gt, BOT + 10],
    // Com Shibboleth, a área (larga, no Antes) vira uma pequena árvore:
    // Shibboleth e sistemas lado a lado em cima, as bases embaixo, no meio.
    sys: shib ? [C.inst + 120, TOP] : [C.inst, show.base ? TOP : MID],
    base: [C.inst, BOT],
    shib: [C.inst - 120, TOP],
  };

  /** Apagado quando há uma área acesa e o elemento não toca nela. */
  const dim = (...pts: NodeId[]) =>
    lane && !pts.some((p) => LANE_OF[p] === lane) ? true : undefined;

  const caption = !after
    ? scenarios.find((s) => s.id === scenario)!.text +
      (shib ? "" : translate("proposal.architecture.noIdpExplanation"))
    : lane
      ? getLaneDescription(lane, option)
      : directoryOptions.find((o) => o.id === option)!.text +
        // Quem vinha do Shibboleth: o IdP SaaS entra no lugar dele.
        (scenario === "many"
          ? translate("proposal.architecture.replacesShibboleth")
          : "");

  return (
    <div className="arch">
      <div className="arch-stack">
        <div className="arch-top rv" style={rv(0)}>
          <h2 className="arch-title">
            {translate("proposal.architecture.title")}
          </h2>
          <div
            className="seg"
            role="tablist"
            aria-label={translate("proposal.architecture.beforeAfter")}
          >
            <button
              role="tab"
              aria-selected={!after}
              onClick={() => setStep(0)}
            >
              {translate("proposal.architecture.before")}
            </button>
            <button role="tab" aria-selected={after} onClick={() => setStep(1)}>
              {translate("proposal.architecture.after")}
            </button>
          </div>
        </div>

        <div className="arch-chips rv" style={rv(1)}>
          <span className="arch-chips-t">
            {after
              ? translate("proposal.common.directory")
              : translate("proposal.common.userBase")}
          </span>
          {(after ? directoryOptions : scenarios).map((c) => {
            const on = after ? option === c.id : scenario === c.id;
            return (
              <button
                key={c.id}
                className="chip"
                aria-pressed={on}
                onClick={() =>
                  after
                    ? setOption(c.id as DirectoryLocation)
                    : pickScenario(c.id as UserDatabaseScenario)
                }
              >
                {c.label}
              </button>
            );
          })}
        </div>

        <div
          className="arch-canvas rv"
          style={rv(2)}
          data-lane={lane ?? undefined}
          data-after={after ? "" : undefined}
          data-vert={vert ? "" : undefined}
        >
          {lanes.map((z) => (
            <button
              key={z.id}
              className="arch-zone"
              data-zone={z.id}
              data-on={lane === z.id ? "" : undefined}
              data-dim={lane && lane !== z.id ? "" : undefined}
              data-off={z.id === "gt" && !after ? "" : undefined}
              // Só o Depois é percorrido por área.
              disabled={!after}
              aria-pressed={lane === z.id}
              onClick={() => pickLane(z.id)}
              style={(() => {
                const at = toPercentage(after ? z.x : LANES_BEFORE[z.id].x, W);
                const len = toPercentage(after ? z.w : LANES_BEFORE[z.id].w, W);
                return vert
                  ? { top: at, height: len }
                  : { left: at, width: len };
              })()}
            >
              <span className="arch-zone-t">{z.t}</span>
            </button>
          ))}

          <svg
            className="arch-lines"
            viewBox={vert ? `0 0 ${H} ${W}` : `0 0 ${W} ${H}`}
            preserveAspectRatio="none"
            aria-hidden="true"
          >
            {/* No celular, a matriz troca x e y (o diagrama gira). */}
            <g transform={vert ? "matrix(0 1 1 0 0 0)" : undefined}>
              {/* Antes: a ligação com a CAFe está cortada. */}
              <ConnectionLine a={P.cafe} b={P.idp} on={show.x} broken />
              <ConnectionLine a={P.idp} b={P.sys} on={show.x} broken />
              {/* Antes, com Shibboleth: a CAFe chega por ele, que lê uma das bases
                (curva pela direita, para não passar por trás dos sistemas). */}
              <ConnectionLine a={P.cafe} b={P.shib} on={shib} />
              <ConnectionLine a={P.shib} b={P.base} on={shib} />
              <ConnectionLine a={P.sys} b={P.base} on={show.sysBase} />
              {/* Depois. */}
              <ConnectionLine
                a={P.cafe}
                b={P.idp}
                on={after}
                dim={dim("cafe", "idp")}
                flow
              />
              <ConnectionLine
                a={P.idp}
                b={P.sys}
                on={after}
                dim={dim("idp", "sys")}
                flow
              />
              <ConnectionLine
                a={P.idp}
                b={P.hdir}
                on={show.hdir}
                dim={dim("idp")}
                flow
              />
              <ConnectionLine
                a={P.idp}
                b={P.base}
                on={show.instLink}
                dim={dim("idp", "base")}
                flow
              />
              {/* O diretório da instituição também pode servir ao eduroam (pelo
                RADIUS da própria instituição), sem passar pelo IdP. */}
              <ConnectionLine
                a={P.base}
                b={P.edu}
                on={show.instLink}
                dim={dim("base", "edu")}
                optional
                arc
              />
            </g>
          </svg>

          <ProtocolLabel
            vert={vert}
            a={P.cafe}
            b={P.idp}
            on={after}
            dim={dim("cafe", "idp")}
          >
            SAML
          </ProtocolLabel>
          <ProtocolLabel vert={vert} a={P.cafe} b={P.shib} on={shib}>
            SAML
          </ProtocolLabel>
          <ProtocolLabel vert={vert} a={P.shib} b={P.base} on={shib}>
            LDAP
          </ProtocolLabel>
          <ProtocolLabel
            vert={vert}
            a={P.idp}
            b={P.sys}
            on={after}
            dim={dim("idp", "sys")}
          >
            OIDC/SAML
          </ProtocolLabel>
          <ProtocolLabel
            vert={vert}
            a={P.idp}
            b={P.hdir}
            on={show.hdir}
            dim={dim("idp")}
            side
          >
            LDAP
          </ProtocolLabel>
          <ProtocolLabel
            vert={vert}
            a={P.idp}
            b={P.base}
            on={show.instLink}
            dim={dim("idp", "base")}
          >
            LDAPS
          </ProtocolLabel>
          {/* No ponto mais baixo da curva até o eduroam. */}
          <ProtocolLabel
            vert={vert}
            a={[590, 400]}
            b={[590, 400]}
            on={show.instLink}
            dim={dim("base", "edu")}
          >
            RADIUS
          </ProtocolLabel>

          <ArchitectureNode
            vert={vert}
            at={P.cafe}
            lane="rnp"
            i={0}
            label={translate("proposal.common.cafeServices")}
            dim={dim("cafe")}
          >
            <GlobeHemisphereWest weight="light" />
          </ArchitectureNode>
          <ArchitectureNode
            vert={vert}
            at={P.edu}
            lane="rnp"
            i={1}
            label="eduroam"
            on={show.edu}
            dim={dim("edu")}
          >
            <WifiHigh weight="light" />
          </ArchitectureNode>
          <ArchitectureNode
            vert={vert}
            at={P.shib}
            lane="inst"
            i={7}
            label="IdP Shibboleth"
            on={shib}
          >
            <Shield weight="light" />
          </ArchitectureNode>
          <ArchitectureNode
            vert={vert}
            at={[C.gt, MID]}
            lane="gt"
            i={2}
            label={translate("proposal.architecture.noAccess")}
            on={show.x}
            variant="x"
          >
            <X weight="light" />
          </ArchitectureNode>
          <ArchitectureNode
            vert={vert}
            at={P.idp}
            lane="gt"
            i={3}
            label="IdP SaaS"
            on={after}
            dim={dim("idp")}
            variant="hero"
          >
            <ShieldCheck weight="fill" />
            <span className="anode-feats">
              <span>{translate("proposal.common.singleSignOn")}</span>
              <span>{translate("proposal.common.secondFactor")}</span>
              <span>
                {translate("proposal.architecture.managementConsole")}
              </span>
            </span>
          </ArchitectureNode>
          <ArchitectureNode
            vert={vert}
            at={P.hdir}
            lane="gt"
            i={4}
            label={translate("proposal.architecture.hostedNode")}
            on={show.hdir}
            dim={dim("hdir")}
          >
            <Database weight="light" />
          </ArchitectureNode>
          <ArchitectureNode
            vert={vert}
            at={P.sys}
            lane="inst"
            i={5}
            label={translate("proposal.architecture.internalSystems")}
            dim={dim("sys")}
          >
            <Desktop weight="light" />
          </ArchitectureNode>
          <UserDirectoryNode
            vert={vert}
            at={P.base}
            scenario={scenario}
            after={after}
            on={show.base}
            dim={dim("base")}
          />
        </div>

        <div
          className="arch-caption rv"
          style={rv(3)}
          key={`${step}-${scenario}-${option}`}
          data-lane={lane ?? undefined}
        >
          {lane ? (
            <span className="arch-caption-t">
              {lanes.find((z) => z.id === lane)!.t}
            </span>
          ) : (
            after && (
              <span className="arch-caption-t arch-caption-t--hint">
                {translate(
                  vert
                    ? "proposal.architecture.touchHint"
                    : "proposal.architecture.clickHint"
                )}
              </span>
            )
          )}
          <p>{caption}</p>
        </div>
      </div>
    </div>
  );
}

/** A base da instituição: muda de ícone e nome conforme o cenário. */
function UserDirectoryNode({
  at,
  scenario,
  after,
  on,
  dim,
  vert,
}: {
  at: Coordinates;
  scenario: UserDatabaseScenario;
  after: boolean;
  on: boolean;
  dim?: true;
  vert: boolean;
}) {
  const { t: translate } = useTranslation();

  const p = { at, lane: "inst" as const, i: 6, on, dim, vert };
  if (after)
    return (
      <ArchitectureNode
        {...p}
        label={translate("proposal.architecture.normalisedLdap")}
      >
        <Database weight="light" />
      </ArchitectureNode>
    );
  if (scenario === "none")
    return (
      <ArchitectureNode
        {...p}
        label={translate("proposal.architecture.noUserDatabase")}
        variant="empty"
      >
        <Database weight="light" />
      </ArchitectureNode>
    );
  if (scenario === "many")
    return (
      <ArchitectureNode
        {...p}
        label={translate("proposal.architecture.multipleDatabases")}
        variant="wide"
      >
        <Database weight="light" />
        <Database weight="light" />
        <Database weight="light" />
      </ArchitectureNode>
    );
  if (scenario === "acad")
    return (
      <ArchitectureNode
        {...p}
        label={translate("proposal.architecture.academicDatabase")}
        variant="wide"
      >
        <GraduationCap weight="light" />
        <Database weight="light" />
      </ArchitectureNode>
    );
  return (
    <ArchitectureNode {...p} label="LDAP/AD">
      <Database weight="light" />
    </ArchitectureNode>
  );
}

function ArchitectureNode({
  at,
  lane,
  i,
  label,
  on = true,
  dim,
  variant,
  vert,
  children,
}: {
  vert: boolean;
  at: Coordinates;
  lane: ArchitectureLane;
  /** Índice para variar o balanço (duração e atraso) entre os nós. */
  i: number;
  label: string;
  on?: boolean;
  dim?: true;
  variant?: "hero" | "x" | "empty" | "wide";
  children: ReactNode;
}) {
  return (
    <div
      className="anode"
      data-variant={variant}
      data-lane={lane}
      data-off={on ? undefined : ""}
      data-dim={dim ? "" : undefined}
      aria-hidden={!on}
      style={
        {
          ...getNodePosition(at[0], at[1], vert),
          "--float-dur": `${4.2 + (i % 3) * 0.7}s`,
          "--float-delay": `${-i * 0.9}s`,
        } as CSSProperties
      }
    >
      <span className="anode-ico">{children}</span>
      <span className="anode-t">{label}</span>
    </div>
  );
}

function ConnectionLine({
  a,
  b,
  on,
  dim,
  broken,
  optional,
  flow,
  arc,
}: {
  a: Coordinates;
  b: Coordinates;
  on: boolean;
  dim?: true;
  broken?: boolean;
  /** Ligação à parte do fluxo do IdP: pontilhada, sem o ponto andando. */
  optional?: boolean;
  flow?: boolean;
  /** Curva por baixo, para não cruzar o meio do diagrama. */
  arc?: boolean;
}) {
  const d = arc
    ? `M ${a[0]} ${a[1]} Q ${(a[0] + b[0]) / 2} ${Math.max(a[1], b[1]) + 85} ${b[0]} ${b[1]}`
    : `M ${a[0]} ${a[1]} L ${b[0]} ${b[1]}`;
  return (
    <g
      className="aline"
      data-off={on ? undefined : ""}
      data-dim={dim ? "" : undefined}
      data-broken={broken ? "" : undefined}
      data-optional={optional ? "" : undefined}
    >
      {/* `d` também no style: no Chrome a linha acompanha o nó na troca. */}
      <path
        d={d}
        style={{ d: `path("${d}")` } as CSSProperties}
        vectorEffect="non-scaling-stroke"
      />
      {flow && on && (
        // Ponto discreto e lento: sinal de que a ligação está viva, sem roubar
        // a atenção do diagrama.
        <circle r="2.5">
          <animateMotion
            dur="7s"
            repeatCount="indefinite"
            path={d}
            keyPoints="0;1;0"
            keyTimes="0;0.5;1"
            calcMode="spline"
            keySplines="0.45 0 0.55 1;0.45 0 0.55 1"
          />
        </circle>
      )}
    </g>
  );
}

/** Rótulo do protocolo no meio da linha (`side`: ao lado, para linhas
 *  verticais; senão, logo acima). */
function ProtocolLabel({
  a,
  b,
  on,
  dim,
  side,
  vert,
  children,
}: {
  a: Coordinates;
  b: Coordinates;
  on: boolean;
  dim?: true;
  side?: boolean;
  vert: boolean;
  children: ReactNode;
}) {
  const x = (a[0] + b[0]) / 2 + (side ? 34 : 0);
  const y = (a[1] + b[1]) / 2 - (side ? 0 : 18);
  return (
    <span
      className="arch-proto"
      data-off={on ? undefined : ""}
      data-dim={dim ? "" : undefined}
      style={getNodePosition(x, y, vert)}
    >
      {children}
    </span>
  );
}
