import { Fragment } from "react";
import { useIdpContent } from "./content";
import {
  ArrowRight,
  Books,
  Building,
  Cap,
  Chat,
  Database,
  Globe,
  Grid,
  Mail,
  Monitor,
  Person,
  Plug,
  Share,
  Shield,
} from "./icons";
import { Dither, Kicker, rv } from "./primitives";
import { SilosDiagram } from "./silos-diagram";

/* Seções narrativas: problema, ponto de partida, a peça que faltava e por
   que o BAITA. */

export function ProblemSection() {
  const c = useIdpContent().problem;
  const [s0, s1] = c.statement;

  return (
    <section id="problema" className="sec">
      <div className="wrap grid2">
        <div>
          <Kicker>{c.kicker}</Kicker>
          <h2 className="statement rv" style={rv(1)}>
            {s0} <span className="d1">{s1}</span>
          </h2>
          <div className="problem-body rv" style={rv(2)}>
            {c.body.map((p) => (
              <p key={p}>{p}</p>
            ))}
          </div>
        </div>
        <SilosDiagram />
      </div>
    </section>
  );
}

function StageArrow() {
  return (
    <div className="arrow" aria-hidden="true">
      <ArrowRight />
    </div>
  );
}

export function StartingPointSection() {
  const { start: c, brand } = useIdpContent();
  const { sheet, db, dir } = c;
  // Na planilha, a célula vazia (linha 3) e o nome duplicado (linha 4)
  // ficam destacados.
  const flagged = (r: number, col: number) => (r === 2 && col === 2) || (r === 3 && col === 0);
  // Coluna de tipos alinhada mesmo quando um nome de campo é longo.
  const pad = Math.max(10, ...db.fields.map(([name]) => name.length + 2));

  return (
    <section id="partida" className="sec">
      <div className="wrap">
        <div className="head">
          <Kicker>{c.kicker}</Kicker>
          <h2 className="h2 rv" style={rv(1)}>
            {c.title}
          </h2>
        </div>

        <div className="stages">
          <div className="stage rv" style={rv(0)}>
            <div className="stage-h">
              <span className="stage-k">{sheet.kicker}</span>
              <span className="pill">.xlsx</span>
            </div>
            <div className="stage-t">{sheet.title}</div>
            <div className="mini">
              <div className="mini-h">{sheet.file}</div>
              <div className="xl">
                <span className="hd" />
                {sheet.head.map((h) => (
                  <span key={h} className="hd">
                    {h}
                  </span>
                ))}
                {sheet.rows.map((row, r) => (
                  <Fragment key={r}>
                    <span className="hd">{r + 2}</span>
                    {row.map((cell, col) => (
                      <span key={col} className={flagged(r, col) ? "flag" : undefined}>
                        {cell}
                      </span>
                    ))}
                  </Fragment>
                ))}
              </div>
            </div>
            <div className="stage-f">{sheet.foot}</div>
          </div>

          <StageArrow />

          <div className="stage rv" style={rv(1)}>
            <div className="stage-h">
              <span className="stage-k">{db.kicker}</span>
              <span className="pill">SQL</span>
            </div>
            <div className="stage-t">{db.title}</div>
            <div className="mini">
              <div className="mini-h">{db.file}</div>
              <div className="code">
                <span className="c">TABLE</span> {db.table} (
                {db.fields.map(([name, type], i) => (
                  <Fragment key={name}>
                    {"\n  "}
                    {name.padEnd(pad)}
                    <span className="c">{type}</span>
                    {i < db.fields.length - 1 ? "," : ""}
                  </Fragment>
                ))}
                {"\n)"}
              </div>
            </div>
            <div className="stage-f">{db.foot}</div>
          </div>

          <StageArrow />

          <div className="stage rv" style={rv(2)}>
            <div className="stage-h">
              <span className="stage-k">{dir.kicker}</span>
              <span className="pill">LDAP / AD</span>
            </div>
            <div className="stage-t">{dir.title}</div>
            <div className="mini">
              <div className="mini-h">{dir.file}</div>
              <div className="code">
                {dir.ous
                  .map((ou, i) => `${i === dir.ous.length - 1 ? "└─" : "├─"} ou=${ou}`)
                  .join("\n")}
                {"\n"}
                <span className="c">{"   uid · mail · affiliation"}</span>
              </div>
            </div>
            <div className="stage-f">{dir.foot}</div>
          </div>
        </div>

        <div className="spectrum rv" style={rv(3)}>
          <span>{c.less}</span>
          <i />
          <span>{c.more}</span>
        </div>
        <div className="dest rv" style={rv(4)}>
          <div className="dest-l">
            <span className="dot" />
            {c.dest}
          </div>
          <span className="pill solid">{brand}</span>
        </div>
      </div>
    </section>
  );
}

const LEFT_ICONS = [Cap, Monitor, Mail, Books, Person];
const RIGHT_ICONS = [Globe, Grid, Building, Share, Database];
// Uma linha horizontal por nó, alinhada ao centro de cada um (52px + 12px).
const LINE_TOPS = [26, 90, 154, 218, 282];

function Connector({ reverse = false }: { reverse?: boolean }) {
  return (
    <div className={reverse ? "conn r" : "conn"} aria-hidden="true">
      {LINE_TOPS.map((top) => (
        <i key={top} className="h" style={{ top }} />
      ))}
      <i className="v" />
      <i className="m" />
      <span className="pkt" />
    </div>
  );
}

export function PieceSection() {
  const { piece: c, brand } = useIdpContent();

  return (
    <section id="peca" className="sec">
      <div className="wrap">
        <div className="head">
          <Kicker>{c.kicker}</Kicker>
          <h2 className="h2 rv" style={rv(1)}>
            {c.title}
          </h2>
        </div>
        <div className="piece rv" style={rv(2)}>
          <div>
            <div className="col-t">{c.left}</div>
            <div className="nodes">
              {c.leftNodes.map((label, i) => {
                const Icon = LEFT_ICONS[i];
                return (
                  <div key={i} className="node">
                    <Icon />
                    {label}
                  </div>
                );
              })}
            </div>
          </div>
          <Connector />
          <div className="core">
            <Dither mode="orb" style={{ top: 0, height: 240 }} />
            <div className="orb" aria-hidden="true" />
            <div className="core-t">{brand}</div>
            <div className="core-b">
              <span className="pill">OIDC</span>
              <span className="pill">OpenID Federation</span>
            </div>
          </div>
          <Connector reverse />
          <div>
            <div className="col-t" style={{ textAlign: "right" }}>
              {c.right}
            </div>
            <div className="nodes r">
              {c.rightNodes.map((label, i) => {
                const Icon = RIGHT_ICONS[i];
                return (
                  <div key={i} className="node">
                    {label}
                    <Icon />
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

const WHY_ICONS = [Shield, Share, Chat, Plug];

export function WhySection() {
  const c = useIdpContent().why;

  return (
    <section id="porque" className="sec">
      <div className="wrap">
        <div className="head">
          <Kicker>{c.kicker}</Kicker>
          <h2 className="h2 rv" style={rv(1)}>
            {c.title}
          </h2>
        </div>
        <div className="why">
          {c.cards.map((card, i) => {
            const Icon = WHY_ICONS[i];
            return (
              <article key={i} className="card rv" style={rv(i)}>
                <div className="card-top">
                  <span className="ico">
                    <Icon />
                  </span>
                  <span className="mono-s">{String(i + 1).padStart(2, "0")}</span>
                </div>
                <h3 className="h3">{card.t}</h3>
                <p>{card.d}</p>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
