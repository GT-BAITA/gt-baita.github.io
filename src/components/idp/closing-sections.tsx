import { Button, buttonVariants } from "@/components/ui/button";
import { useIdpContent } from "./content";
import { Dither, Jump, Kicker, rv, useRequestContact } from "./primitives";

export function ProofSection() {
  const c = useIdpContent().proof;

  return (
    <section id="prova" className="sec" style={{ paddingTop: 40 }}>
      <div className="wrap">
        <div className="panel proof rv" style={rv(0)}>
          <div className="proof-l">
            <Kicker reveal={false} style={{ margin: 0 }}>
              {c.kicker}
            </Kicker>
            <h2 className="h2" style={{ fontSize: 38 }}>
              {c.title}
            </h2>
            <p className="muted" style={{ margin: 0, maxWidth: 480 }}>
              {c.body}
            </p>
          </div>
          <div className="proof-r">
            <Dither mode="wave" />
            <div className="term">
              <div className="mini-h" style={{ fontFamily: "var(--mono)", fontSize: 11 }}>
                {c.status}
              </div>
              {c.rows.map((r) => (
                <div key={r.k} className="li">
                  <span>{r.k}</span>
                  <span>{r.v}</span>
                  <span className="pill">
                    {r.live && <span className="dot" />}
                    {r.pill}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export function CtaSection() {
  const c = useIdpContent().cta;
  const requestContact = useRequestContact();

  return (
    <section id="contato" className="sec" style={{ paddingTop: 40 }}>
      <div className="wrap">
        <div className="panel cta rv" style={rv(0)}>
          <Dither mode="ripple" />
          <Kicker reveal={false} style={{ margin: 0 }}>
            {c.kicker}
          </Kicker>
          <h2 className="h1" style={{ fontSize: 52, maxWidth: 760 }}>
            {c.title}
          </h2>
          <p className="lead" style={{ margin: 0 }}>
            {c.lead}
          </p>
          <div className="ctas">
            <Button size="lg" onClick={requestContact}>
              {c.primary}
            </Button>
            <Jump to="diagnostico" className={buttonVariants({ variant: "secondary", size: "lg" })}>
              {c.secondary}
            </Jump>
          </div>
        </div>
      </div>
    </section>
  );
}
