import { useTranslation } from "react-i18next";
import { useState } from "react";
import { rv } from "@/features/idp-proposal/components/slide-layout";
import { useEntryStep, useSlideSteps } from "@/features/idp-proposal/steps";

/**
 * Organiza as dúvidas por assunto; teclado e índice selecionam a resposta em destaque.
 */
type ProposalQuestion = { question: string; answer: string };

export function FaqScreen() {
  const { t: translate } = useTranslation();

  const groups: { label: string; items: ProposalQuestion[] }[] = [
    {
      label: translate("proposal.faq.service"),
      items: [
        {
          question: translate("proposal.faq.availableQuestion"),
          answer: translate("proposal.faq.availableAnswer"),
        },
        {
          question: translate("proposal.faq.infrastructureQuestion"),
          answer: translate("proposal.faq.infrastructureAnswer"),
        },
        {
          question: translate("proposal.faq.supportQuestion"),
          answer: translate("proposal.faq.supportAnswer"),
        },
        {
          question: translate("proposal.faq.continuityQuestion"),
          answer: translate("proposal.faq.continuityAnswer"),
        },
      ],
    },
    {
      label: translate("proposal.faq.pilot"),
      items: [
        {
          question: translate("proposal.faq.effortQuestion"),
          answer: translate("proposal.faq.effortAnswer"),
        },
        {
          question: translate("proposal.faq.timelineQuestion"),
          answer: translate("proposal.faq.timelineAnswer"),
        },
        {
          question: translate("proposal.faq.costQuestion"),
          answer: translate("proposal.faq.costAnswer"),
        },
        {
          question: translate("proposal.faq.specificQuestion"),
          answer: translate("proposal.faq.specificAnswer"),
        },
      ],
    },
    {
      label: translate("proposal.faq.integration"),
      items: [
        {
          question: translate("proposal.faq.databasesQuestion"),
          answer: translate("proposal.faq.databasesAnswer"),
        },
        {
          question: translate("proposal.faq.systemsQuestion"),
          answer: translate("proposal.faq.systemsAnswer"),
        },
      ],
    },
    {
      label: translate("proposal.faq.usersData"),
      items: [
        {
          question: translate("proposal.faq.experienceQuestion"),
          answer: translate("proposal.faq.experienceAnswer"),
        },
        {
          question: translate("proposal.faq.mfaQuestion"),
          answer: translate("proposal.faq.mfaAnswer"),
        },
        {
          question: translate("proposal.faq.attributesQuestion"),
          answer: translate("proposal.faq.attributesAnswer"),
        },
        {
          question: translate("proposal.faq.dataQuestion"),
          answer: translate("proposal.faq.dataAnswer"),
        },
      ],
    },
  ];
  const questions = groups.flatMap((g) =>
    g.items.map((f) => ({ ...f, group: g.label }))
  );

  const entry = useEntryStep(questions.length);
  const [on, setOn] = useState(entry);
  useSlideSteps(on, setOn, questions.length);
  const cur = questions[on];
  let n = 0;

  return (
    <div className="faq">
      <nav
        className="faq-index rv"
        style={rv(0)}
        aria-label={translate("proposal.faq.questions")}
      >
        <h2 className="faq-title">{translate("proposal.faq.title")}</h2>
        {groups.map((g) => (
          <div key={g.label} className="faq-group">
            <span className="faq-group-t">{g.label}</span>
            <ul>
              {g.items.map((f) => {
                const i = n++;
                return (
                  <li key={f.question}>
                    <button
                      data-on={i === on ? "" : undefined}
                      aria-current={i === on ? "true" : undefined}
                      onClick={() => setOn(i)}
                    >
                      {f.question}
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>

      {/* A resposta troca com uma entrada curta a cada pergunta. */}
      <article className="faq-answer" key={on} aria-live="polite">
        <span className="faq-count">
          {cur.group} · {String(on + 1).padStart(2, "0")}/{questions.length}
        </span>
        <h3 className="faq-q">{cur.question}</h3>
        <p className="faq-a">{cur.answer}</p>
      </article>
    </div>
  );
}
