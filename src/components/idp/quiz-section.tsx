import { useEffect, useState, type ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { getConsent } from "@/components/layout/components/consent";
import { requestContact } from "@/lib/contact-request";
import { useIdpContent, type IdpContent } from "./content";
import { ArrowRight, ChevronLeft } from "./icons";
import { Dither, Kicker, rv, useRequestContact } from "./primitives";

type Answers = (number | null)[];
type Quiz = IdpContent["quiz"];
type ResultKey = keyof Quiz["results"];

const EMPTY: Answers = [null, null, null, null];

/*
 * O diagnóstico é o "próximo passo" da página: responde se a instituição
 * está pronta para a CAFe com um veredito e a dor de quem respondeu, e leva
 * isso ao formulário de contato logo abaixo — a equipe recebe o contato já
 * qualificado.
 */

/** Identificadores estáveis das respostas, para o campo oculto e o Clarity. */
const SLUGS = {
  result: {
    active: "ja-na-cafe",
    stopped: "acesso-interrompido",
    directory: "sem-shib-diretorio",
    database: "sem-shib-banco",
    spreadsheet: "sem-shib-planilha",
  } satisfies Record<ResultKey, string>,
  answers: [
    ["cadastro", ["planilha", "banco", "diretorio"]],
    ["sistemas", ["ate-5", "6-20", "mais-20", "sem-levantamento"]],
    ["telas", ["1", "2-3", "mais-3"]],
    ["shibboleth", ["ativo", "parou", "nao"]],
  ] as const,
};

/** O Shibboleth (4ª) decide o veredito; sem ele, a base de usuários (1ª). */
function resultKey([base, , , shib]: Answers): ResultKey {
  if (shib === 0) return "active";
  if (shib === 1) return "stopped";
  return base === 2 ? "directory" : base === 1 ? "database" : "spreadsheet";
}

/** No máximo uma linha de dor: as telas de login antes dos sistemas. */
function painLine([, systems, screens]: Answers, c: Quiz) {
  if (screens === 2) return c.pains.moreThanThree;
  if (screens === 1) return c.pains.twoOrThree;
  if (systems === 1 || systems === 2) return c.pains.manySystems;
  if (systems === 3) return c.pains.noInventory;
  return null;
}

/** Resumo legível (mensagem) e padronizado (campo oculto) do diagnóstico. */
function summarize(a: Answers, key: ResultKey, c: Quiz) {
  const lines = c.questions.map((q, i) => `– ${q.sum}: ${q.o[a[i] ?? 0]}`);
  const message = [c.summary.hello, `${c.summary.result}: ${c.results[key].v}.`, ...lines, c.summary.bye].join("\n");
  const coded = [
    `resultado=${SLUGS.result[key]}`,
    ...SLUGS.answers.map(([name, values], i) => `${name}=${values[a[i] ?? 0]}`),
  ].join("; ");
  return { message, fields: { diagnostico: coded } };
}

/** Uma tela do painel: fora de vista, continua ocupando espaço (para a
 * altura), mas fica invisível, inerte e fora da leitura de tela. */
function View({ on, children }: { on: boolean; children: ReactNode }) {
  return (
    <div className={on ? "quiz-view on" : "quiz-view"} aria-hidden={!on} inert={!on} aria-live={on ? "polite" : undefined}>
      {children}
    </div>
  );
}

export function QuizSection() {
  const c = useIdpContent().quiz;
  const contactDirect = useRequestContact();
  const [q, setQ] = useState(0);
  const [ans, setAns] = useState<Answers>(EMPTY);

  const total = c.questions.length;
  const done = q >= total;
  const qi = Math.min(q, total - 1);
  const pad = (n: number) => String(n).padStart(2, "0");

  const answer = (i: number) => {
    const next = ans.slice();
    next[qi] = i;
    setAns(next);
    setQ(qi + 1);
  };

  const key = done ? resultKey(ans) : null;
  const pain = done ? painLine(ans, c) : null;

  // Registro anônimo do resultado no Clarity, só com o consentimento dado
  // no aviso de cookies. Nenhum dado pessoal: só o identificador do veredito.
  useEffect(() => {
    if (!key || getConsent() !== "accepted") return;
    window.clarity?.("set", "idp_diagnostico", SLUGS.result[key]);
    window.clarity?.("event", "idp_diagnostico_concluido");
  }, [key]);

  const longestPain = Object.values(c.pains).reduce((a, b) => (b.length > a.length ? b : a));

  const renderQuestion = (i: number) => {
    const qq = c.questions[i];
    return (
      <>
        <div className="prog" aria-hidden="true">
          {c.questions.map((_, j) => (
            <span key={j} className={j < i ? "seg done" : j === i ? "seg cur" : "seg"} />
          ))}
        </div>
        <div className="q-meta">
          <span className="mono-s">
            {c.question} {pad(i + 1)} {c.of} {pad(total)}
          </span>
          <span className="pill">{qq.k}</span>
        </div>
        <h3 className="q-title">{qq.t}</h3>
        <div className="opts" role="group" aria-label={qq.t}>
          {qq.o.map((label, j) => (
            <button
              key={label}
              type="button"
              className={ans[i] === j ? "opt on" : "opt"}
              aria-pressed={ans[i] === j}
              onClick={() => answer(j)}
            >
              <span className="mono">{"ABCD"[j]}</span>
              {label}
            </button>
          ))}
        </div>
        <div className="q-foot">
          {i > 0 && (
            <button type="button" className="linkbtn" onClick={() => setQ(i - 1)}>
              <ChevronLeft />
              {c.back}
            </button>
          )}
        </div>
      </>
    );
  };

  const renderResult = (k: ResultKey, line: string | null) => {
    const r = c.results[k];
    return (
      <div className="res">
        <div className="q-meta">
          <span className="pill solid">{r.v}</span>
        </div>
        <h3 className="q-title">{r.t}</h3>
        <p className="muted" style={{ margin: 0 }}>
          {r.d}
        </p>
        {line && <p className="res-pain">{line}</p>}
        {/* Ações sempre no pé do painel: refazer à esquerda, envio à direita. */}
        <div className="res-actions">
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
          <Button size="lg" onClick={send}>
            {c.send}
          </Button>
        </div>
      </div>
    );
  };

  const send = () => {
    if (!key) return;
    const { message, fields } = summarize(ans, key, c);
    requestContact(message, fields);
  };

  return (
    <section id="diagnostico" className="sec">
      <div className="wrap">
        <div className="quiz">
          <div className="panel quiz-intro rv" style={rv(0)}>
            <Dither mode="wave" style={{ opacity: 0.55 }} />
            <div style={{ position: "relative" }}>
              <Kicker reveal={false}>{c.kicker}</Kicker>
              <h2 className="h2" style={{ fontSize: 38 }}>
                {c.title}
              </h2>
              <p className="muted quiz-lead">{c.intro}</p>
            </div>
            <button type="button" className="linkbtn quiz-skip" onClick={contactDirect}>
              {c.skip}
              <ArrowRight />
            </button>
          </div>

          <div className="panel quiz-main rv" style={rv(1)}>
            {/* Todas as telas do painel ficam empilhadas na mesma célula, só
                a atual visível: o painel tem sempre a altura da mais alta, e
                não muda de tamanho entre uma pergunta e outra. */}
            <div className="quiz-stack">
              {c.questions.map((_, i) => (
                <View key={`q${i}`} on={!done && i === qi}>
                  {renderQuestion(i)}
                </View>
              ))}
              {(Object.keys(c.results) as ResultKey[]).map((k) => (
                <View key={k} on={k === key}>
                  {renderResult(k, k === key ? pain : longestPain)}
                </View>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
