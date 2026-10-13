import { useState } from "react";
import { useIdpContent } from "./content";
import { CheckMark } from "./how-section";
import { ArrowRight } from "./icons";
import { Kicker, rv } from "./primitives";

function BenefitList({ items }: { items: { t: string; d: string }[] }) {
  return (
    <div className="bl">
      {items.map((b, i) => (
        <div key={b.t} className="b">
          <span className="mono-s">{String(i + 1).padStart(2, "0")}</span>
          <div>
            <h3 className="h3">{b.t}</h3>
            <p>{b.d}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

export function BenefitsSection() {
  const { benefits: c, brand } = useIdpContent();
  const [tab, setTab] = useState(0);
  const m = c.management;
  const it = c.it;

  return (
    <section id="beneficios" className="sec">
      <div className="wrap">
        <div className="head">
          <Kicker>{c.kicker}</Kicker>
          <h2 className="h2 rv" style={rv(1)}>
            {c.title}
          </h2>
        </div>

        <div className="tablist rv" style={rv(2)} role="tablist" aria-label={c.tablist}>
          {c.tabs.map((t, i) => (
            <button
              key={i}
              type="button"
              role="tab"
              id={`idp-tab-${i}`}
              aria-controls={`idp-tabpanel-${i}`}
              aria-selected={i === tab}
              className={i === tab ? "tab on" : "tab"}
              onClick={() => setTab(i)}
            >
              <span className="mono">{String(i + 1).padStart(2, "0")}</span>
              {t}
            </button>
          ))}
        </div>

        {tab === 0 ? (
          <div className="tabpanel" role="tabpanel" id="idp-tabpanel-0" aria-labelledby="idp-tab-0" key="g">
            <BenefitList items={m.items} />
            <div className="panel gridbg bv">
              <div className="ba">
                <span className="mono-s">{m.before}</span>
                <div className="flow">
                  <span className="box solo">{m.owner}</span>
                  <ArrowRight />
                  <span className="box">{m.access}</span>
                  <span className="pill dim">{m.spof}</span>
                </div>
              </div>
              <div className="ba">
                <span className="mono-s">{m.after}</span>
                <div className="flow">
                  <span className="box">{m.operation}</span>
                  <ArrowRight />
                  <span className="box">{brand}</span>
                  <ArrowRight />
                  <span className="box">{m.access}</span>
                  <span className="pill solid">{m.continuous}</span>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="tabpanel" role="tabpanel" id="idp-tabpanel-1" aria-labelledby="idp-tab-1" key="t">
            <BenefitList items={it.items} />
            <div className="panel gridbg bv">
              <div className="mono-s">{it.label}</div>
              <div className="list log">
                {it.rows.map(([label, status]) => (
                  <div key={label} className="li">
                    <CheckMark state="ok" />
                    <span>{label}</span>
                    <span className="pill">{status}</span>
                  </div>
                ))}
                <div className="li">
                  <CheckMark state="todo" />
                  <span>{it.integration}</span>
                  <span className="pill solid">OIDC</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
