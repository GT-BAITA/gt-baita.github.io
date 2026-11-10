import { useTranslation } from "react-i18next";
import { useEffect, useState, type CSSProperties, type ReactNode } from "react";
import {
  ArrowSquareOut,
  ArrowsClockwise,
  CaretDoubleLeft,
  CaretDoubleRight,
  CaretDown,
  Clock,
  Info,
  MagnifyingGlassMinus,
} from "@phosphor-icons/react";
import { ConsoleShell } from "@/features/idp-proposal/product/console-shell";
import { ProductFrame } from "@/features/idp-proposal/product/product-frame";

/**
 * Painel ilustrativo de autenticação: indicadores, séries temporais e clientes.
 * As três falhas simuladas também compõem a taxa de sucesso e os totais por cliente.
 */
type Group = "stats" | "activity" | "reasons" | "clients";
const STEP_GROUP: Group[] = ["stats", "activity", "reasons", "clients"];

// Cores dos painéis do Grafana, como na captura.
const CHART_COLORS = {
  green: "#56a64b",
  red: "#e02f44",
  purple: "#a352cc",
  blue: "#3274d9",
};

/** Falhas simuladas por motivo, acumuladas (horas do dia → total). */
const REASONS: { error: string; color: string; pts: [number, number][] }[] = [
  {
    error: "invalid_user_credentials",
    color: CHART_COLORS.red,
    pts: [
      [0, 0],
      [9.3, 0],
      [9.3, 1],
      [14.2, 1],
      [14.2, 2],
      [23, 2],
    ],
  },
  {
    error: "user_not_found",
    color: CHART_COLORS.blue,
    pts: [
      [0, 0],
      [11.7, 0],
      [11.7, 1],
      [23, 1],
    ],
  },
];

/** Logins acumulados ao longo do dia (ilustrativo; termina nos 10). */
const CUMULATIVE: [number, number][] = [
  [0, 0],
  [8.5, 0],
  [9, 2],
  [10.5, 4],
  [11, 5],
  [13.5, 6],
  [14, 8],
  [16, 9],
  [17.5, 10],
  [23, 10],
];

export function MetricsConsole({ step }: { step: number }) {
  const { t: translate } = useTranslation();

  const statistics: { t: string; v: number; suffix?: string; c: string }[] = [
    {
      t: translate("proposal.metrics.availability"),
      v: 1,
      c: CHART_COLORS.green,
    },
    {
      t: translate("proposal.metrics.successfulLogins"),
      v: 10,
      c: CHART_COLORS.green,
    },
    { t: translate("proposal.metrics.failures"), v: 3, c: CHART_COLORS.red },
    { t: translate("proposal.metrics.logouts"), v: 1, c: CHART_COLORS.purple },
    {
      t: translate("proposal.metrics.codeExchange"),
      v: 9,
      c: CHART_COLORS.blue,
    },
    {
      t: translate("proposal.metrics.tokenRefreshes"),
      v: 0,
      c: CHART_COLORS.blue,
    },
    // 10 com sucesso de 13 tentativas.
    {
      t: translate("proposal.metrics.successRate"),
      v: 77,
      suffix: "%",
      c: CHART_COLORS.green,
    },
  ];

  const on = STEP_GROUP[step];
  const dim = (g: Group) => (g === on ? undefined : "");
  return (
    <ProductFrame>
      <ConsoleShell
        active="metrics"
        crumbs={[translate("proposal.common.metrics")]}
      >
        <div className="mx">
          <div className="mx-head">
            <div>
              <h1>{translate("proposal.common.metrics")}</h1>
              <p className="p-muted">
                {translate("proposal.metrics.description")}
              </p>
            </div>
            <span className="p-btn p-btn--ghost p-btn--sm">
              {translate("proposal.metrics.openTab")}{" "}
              <ArrowSquareOut size={14} />
            </span>
          </div>

          {/* O painel do Grafana embutido. */}
          <div className="gf">
            <div className="gf-bar">
              <span className="gf-btn">
                <CaretDoubleLeft size={12} />
              </span>
              <span className="gf-btn">
                <Clock size={13} /> {translate("proposal.metrics.timeRange")}{" "}
                <CaretDown size={10} />
              </span>
              <span className="gf-btn">
                <CaretDoubleRight size={12} />
              </span>
              <span className="gf-btn">
                <MagnifyingGlassMinus size={13} />
              </span>
              <span className="gf-btn gf-gap">
                <ArrowsClockwise size={13} />{" "}
                {translate("proposal.metrics.refresh")}
              </span>
              <span className="gf-btn">
                30s <CaretDown size={10} />
              </span>
            </div>

            <div className="gf-stats" data-dim={dim("stats")}>
              {statistics.map((s) => (
                <MetricPanel key={s.t} title={s.t}>
                  <MetricValue
                    value={s.v}
                    suffix={s.suffix}
                    color={s.c}
                    replay={on === "stats" ? step : -1}
                  />
                </MetricPanel>
              ))}
            </div>

            <div className="gf-row">
              <MetricPanel
                title={translate("proposal.metrics.activity")}
                dim={dim("activity")}
              >
                <TimeChart
                  key={on === "activity" ? step : "a"}
                  max={15}
                  ticks={[15, 10, 5, 0]}
                  series={[
                    {
                      name: translate("proposal.metrics.successes"),
                      color: CHART_COLORS.green,
                      pts: CUMULATIVE,
                    },
                  ]}
                />
              </MetricPanel>
              <MetricPanel
                title={translate("proposal.metrics.failureReasons")}
                dim={dim("reasons")}
              >
                <TimeChart
                  key={on === "reasons" ? step : "r"}
                  max={3}
                  ticks={[3, 2, 1, 0]}
                  series={REASONS.map((r) => ({
                    name: r.error,
                    color: r.color,
                    pts: r.pts,
                  }))}
                />
              </MetricPanel>
            </div>

            <div className="gf-row" data-dim={dim("clients")}>
              <MetricPanel title={translate("proposal.metrics.successByClient")}>
                <ClientGauges
                  key={on === "clients" ? step : "s"}
                  rows={[
                    ["grafana", 6],
                    ["security-admin-console", 4],
                  ]}
                  max={6}
                  color={CHART_COLORS.green}
                />
              </MetricPanel>
              <MetricPanel title={translate("proposal.metrics.failuresByClient")}>
                <ClientGauges
                  key={on === "clients" ? `f${step}` : "f"}
                  rows={[
                    ["grafana", 1],
                    ["security-admin-console", 2],
                  ]}
                  max={6}
                  color={CHART_COLORS.red}
                />
              </MetricPanel>
            </div>

            <p className="gf-foot">{translate("proposal.metrics.poweredBy")}</p>
          </div>
        </div>
      </ConsoleShell>
    </ProductFrame>
  );
}

function MetricPanel({
  title,
  dim,
  children,
}: {
  title: string;
  dim?: string;
  children: ReactNode;
}) {
  return (
    <section className="gf-panel" data-dim={dim}>
      <h3>
        {title} <Info size={11} />
      </h3>
      <div className="gf-panel-body">{children}</div>
    </section>
  );
}

/** Número grande e colorido do Grafana, contando até o valor. */
function MetricValue({
  value,
  suffix,
  color,
  replay,
}: {
  value: number;
  suffix?: string;
  color: string;
  replay: number;
}) {
  const n = useAnimatedCount(value, replay);
  return (
    <span className="gf-stat" style={{ color }}>
      {Math.round(n)}
      {suffix && <small>{suffix}</small>}
    </span>
  );
}

function useAnimatedCount(target: number, replay: number, ms = 800) {
  const [v, setV] = useState(0);
  useEffect(() => {
    if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) {
      setV(target);
      return;
    }
    let raf = 0;
    const t0 = performance.now();
    const tick = (t: number) => {
      const k = Math.min(1, (t - t0) / ms);
      setV(target * (1 - Math.pow(1 - k, 3)));
      if (k < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, replay, ms]);
  return v;
}

/**
 * Série temporal acumulada (00:00 a 23:00), como os painéis do Grafana: uma
 * linha por série, legenda embaixo e, com mais de uma série, o nome de cada
 * uma direto na ponta da linha (a cor não é a única pista).
 */
function TimeChart({
  series,
  max,
  ticks,
}: {
  series: { name: string; color: string; pts: [number, number][] }[];
  max: number;
  ticks: number[];
}) {
  const W = 400;
  const H = 120;
  const x = (h: number) => (h / 23) * W;
  const y = (v: number) => H - (v / max) * H;
  const path = (pts: [number, number][]) =>
    pts
      .map(
        ([h, v], i) => `${i ? "L" : "M"} ${x(h).toFixed(1)} ${y(v).toFixed(1)}`
      )
      .join(" ");
  return (
    <div className="gf-chart">
      <div className="gf-plot">
        <span className="gf-yaxis">
          {ticks.map((v) => (
            <i key={v}>{v}</i>
          ))}
        </span>
        <svg
          viewBox={`0 0 ${W} ${H}`}
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          {ticks.map((v) => (
            <line
              key={v}
              x1="0"
              x2={W}
              y1={y(v)}
              y2={y(v)}
              className="gf-grid"
              vectorEffect="non-scaling-stroke"
            />
          ))}
          {Array.from({ length: 12 }, (_, i) => (
            <line
              key={i}
              x1={x(i * 2)}
              x2={x(i * 2)}
              y1="0"
              y2={H}
              className="gf-grid"
              vectorEffect="non-scaling-stroke"
            />
          ))}
          {series.map((s) => (
            <path
              key={s.name}
              d={path(s.pts)}
              className="gf-line"
              style={{ stroke: s.color }}
              pathLength={1}
              vectorEffect="non-scaling-stroke"
            />
          ))}
        </svg>
        {series.length > 1 && (
          <span className="gf-direct" aria-hidden="true">
            {series.map((s) => {
              const last = s.pts[s.pts.length - 1][1];
              return (
                <i key={s.name} style={{ top: `${(1 - last / max) * 100}%` }}>
                  {s.name}
                </i>
              );
            })}
          </span>
        )}
      </div>
      <span className="gf-xaxis">
        {/* A cada 4 horas: no tamanho do slide, a cada 2 horas os rótulos se encostam. */}
        {Array.from({ length: 6 }, (_, i) => (
          <i key={i}>{String(i * 4).padStart(2, "0")}:00</i>
        ))}
      </span>
      <span className="gf-legend">
        {series.map((s) => (
          <span key={s.name}>
            <i style={{ background: s.color }} /> {s.name}
          </span>
        ))}
      </span>
    </div>
  );
}

/** Barras por cliente (bar gauge do Grafana): nome, barra e valor grande. */
function ClientGauges({
  rows,
  max,
  color,
}: {
  rows: [string, number][];
  max: number;
  color: string;
}) {
  return (
    <ul className="gf-gauges">
      {rows.map(([name, v], i) => (
        <li key={name}>
          <span className="gf-gauge-t">{name}</span>
          <span className="gf-gauge-track">
            <span
              className="gf-gauge"
              style={
                {
                  width: `${(v / max) * 100}%`,
                  background: color,
                  "--i": i,
                } as CSSProperties
              }
            />
          </span>
          <span className="gf-gauge-v" style={{ color }}>
            {v}
          </span>
        </li>
      ))}
    </ul>
  );
}
