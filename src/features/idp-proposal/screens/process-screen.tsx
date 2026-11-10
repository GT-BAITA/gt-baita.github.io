import { useTranslation } from "react-i18next";
import { useState, type CSSProperties } from "react";
import { rv } from "@/features/idp-proposal/components/slide-layout";
import { useEntryStep, useSlideSteps } from "@/features/idp-proposal/steps";

/**
 * Percorre as fases do piloto nos cenários de adesão à CAFe e login unificado.
 * A troca de cenário preserva a fase selecionada.
 */
type Scenario = "cafe" | "unified";
type Phase = { t: string; when?: string; body: string };

export function ProcessScreen() {
  const { t: translate } = useTranslation();

  const onboarding: Phase = {
    t: translate("proposal.process.onboarding"),
    when: translate("proposal.process.oneToTwoWeeks"),
    body: translate("proposal.process.onboardingBody"),
  };
  const phasesByScenario: Record<Scenario, Phase[]> = {
    cafe: [
      onboarding,
      {
        t: translate("proposal.process.pilotGroup"),
        when: translate("proposal.process.twoToFourWeeks"),
        body: translate("proposal.process.cafePilotBody"),
      },
      {
        t: translate("proposal.process.staging"),
        when: translate("proposal.process.twoToFourWeeks"),
        body: translate("proposal.process.stagingBody"),
      },
      {
        t: translate("proposal.process.production"),
        body: translate("proposal.process.productionBody"),
      },
    ],
    unified: [
      onboarding,
      {
        t: translate("proposal.process.pilotGroup"),
        when: translate("proposal.process.twoToFourWeeks"),
        body: translate("proposal.process.unifiedPilotBody"),
      },
      {
        t: translate("proposal.architecture.internalSystems"),
        body: translate("proposal.process.systemsBody"),
      },
      {
        t: translate("proposal.process.switch"),
        body: translate("proposal.process.switchBody"),
      },
    ],
  };
  const scenarios: { id: Scenario; label: string }[] = [
    { id: "cafe", label: translate("proposal.process.joinCafe") },
    { id: "unified", label: translate("proposal.process.unifiedLogin") },
  ];

  const entry = useEntryStep(4);
  const [step, setStep] = useState(entry);
  useSlideSteps(step, setStep, 4);
  const [scenario, setScenario] = useState<Scenario>("cafe");
  const phases = phasesByScenario[scenario];

  return (
    <div className="proc">
      <div className="proc-top rv" style={rv(0)}>
        <p className="big proc-head">
          <span className="d1">
            {translate("proposal.process.headingLead")}
          </span>{" "}
          {translate("proposal.process.headingEnd")}
        </p>
        <div
          className="seg"
          role="tablist"
          aria-label={translate("proposal.process.scenario")}
        >
          {scenarios.map((s) => (
            <button
              key={s.id}
              role="tab"
              aria-selected={scenario === s.id}
              onClick={() => setScenario(s.id)}
            >
              {s.label}
            </button>
          ))}
        </div>
      </div>

      {/* A linha liga as fases e se preenche até a fase atual. */}
      <ol
        className="proc-track rv"
        style={{ ...rv(1), "--done": step / 3 } as CSSProperties}
        key={scenario}
      >
        {phases.map((p, i) => (
          <li
            key={p.t}
            className="proc-phase"
            data-on={i === step ? "" : undefined}
            data-past={i < step ? "" : undefined}
          >
            <button
              onClick={() => setStep(i)}
              aria-current={i === step ? "step" : undefined}
            >
              <span className="proc-dot" aria-hidden="true" />
              <span className="proc-t">{p.t}</span>
              <span className="proc-when">
                {p.when ?? translate("proposal.process.institutionPace")}
              </span>
              <span className="proc-body">{p.body}</span>
            </button>
          </li>
        ))}
      </ol>

      <p className="proc-ask rv" style={rv(2)}>
        {translate("proposal.process.requirements")}
      </p>
    </div>
  );
}
