import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useIdpContent, type IdpContent } from "./content";
import { ChevronLeft } from "./icons";
import { Dither, Kicker, rv, useRequestContact } from "./primitives";

type Answers = (number | null)[];
type Quiz = IdpContent["quiz"];

const EMPTY: Answers = [null, null, null, null];

/** Caminho sugerido: a 1ª resposta escolhe a trilha; as demais somam notas. */
function result(a: Answers, c: Quiz) {
  const path = c.paths[a[0] ?? 0];
  const steps = [c.stepNames.first, path.mid, c.stepNames.third, c.stepNames.last];
  const notes: string[] = [];
  const [, systems, logins, shib] = a;
  if (systems === 1 || systems === 2) notes.push(c.notes.manySystems);
  if (systems === 3) notes.push(c.notes.noInventory);
  if (logins !== null && logins >= 1) notes.push(c.notes.duplicates);
  if (shib === 0) notes.push(c.notes.shibActive);
  if (shib === 1) notes.push(c.notes.shibStopped);
  if (shib === 2) notes.push(c.notes.shibNone);
  return { ...path, steps, notes };
}

export function QuizSection() {
  const c = useIdpContent().quiz;
  const requestContact = useRequestContact();
  const [q, setQ] = useState(0);
  const [ans, setAns] = useState<Answers>(EMPTY);

  const total = c.questions.length;
  const done = q >= total;
  const qi = Math.min(q, total - 1);
  const cur = c.questions[qi];
  const pad = (n: number) => String(n).padStart(2, "0");

  const answer = (i: number) => {
    const next = ans.slice();
    next[qi] = i;
    setAns(next);
    setQ(qi + 1);
  };

  const res = done ? result(ans, c) : null;

  return (
    <section id="diagnostico" className="sec">
      <div className="wrap">
        <div className="quiz">
          <div className="panel quiz-intro rv" style={rv(0)}>
            <Dither mode="wave" style={{ opacity: 0.55 }} />
            <div style={{ position: "relative" }}>
              <Kicker reveal={false}>
                {c.kicker}
              </Kicker>
              <h2 className="h2" style={{ fontSize: 38 }}>
                {c.title}
              </h2>
            </div>
            <p className="muted" style={{ position: "relative", margin: 0 }}>
              {c.intro}
            </p>
          </div>

          <div className="panel quiz-main rv" style={rv(1)} aria-live="polite">
            {!res ? (
              <>
                <div className="prog" aria-hidden="true">
                  {c.questions.map((_, i) => (
                    <span key={i} className={i < q ? "seg done" : i === q ? "seg cur" : "seg"} />
                  ))}
                </div>
                <div className="q-meta">
                  <span className="mono-s">
                    {c.question} {pad(qi + 1)} {c.of} {pad(total)}
                  </span>
                  <span className="pill">{cur.k}</span>
                </div>
                <h3 className="q-title">{cur.t}</h3>
                <div className="opts" role="group" aria-label={cur.t}>
                  {cur.o.map((label, i) => (
                    <button
                      key={label}
                      type="button"
                      className={ans[qi] === i ? "opt on" : "opt"}
                      aria-pressed={ans[qi] === i}
                      onClick={() => answer(i)}
                    >
                      <span className="mono">{"ABCD"[i]}</span>
                      {label}
                    </button>
                  ))}
                </div>
                <div className="q-foot">
                  {q > 0 && (
                    <button type="button" className="linkbtn" onClick={() => setQ(q - 1)}>
                      <ChevronLeft />
                      {c.back}
                    </button>
                  )}
                  <span className="mono-s" style={{ marginLeft: "auto" }}>
                    {c.noSignup}
                  </span>
                </div>
              </>
            ) : (
              <div className="res">
                <div className="q-meta">
                  <span className="mono-s">{c.result}</span>
                  <span className="pill solid">{c.path}</span>
                </div>
                <h3 className="q-title">{res.title}</h3>
                <p className="muted" style={{ margin: 0 }}>
                  {res.lead}
                </p>
                <div className="res-path">
                  {res.steps.map((t, i) => (
                    <div key={i} className="rp">
                      <span className="mono-s">{pad(i + 1)}</span>
                      <span>{t}</span>
                    </div>
                  ))}
                </div>
                <ul className="notes">
                  {res.notes.map((n) => (
                    <li key={n}>{n}</li>
                  ))}
                </ul>
                <div className="ctas" style={{ justifyContent: "flex-start" }}>
                  <Button size="lg" onClick={requestContact}>
                    {c.cta}
                  </Button>
                  <button
                    type="button"
                    className="linkbtn"
                    onClick={() => {
                      setQ(0);
                      setAns(EMPTY);
                    }}
                  >
                    {c.restart}
                  </button>
                </div>
                <span className="mono-s">{c.disclaimer}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
