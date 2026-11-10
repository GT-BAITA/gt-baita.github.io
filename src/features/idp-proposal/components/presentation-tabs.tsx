import { useTranslation } from "react-i18next";
import type { CSSProperties } from "react";
import {
  getSectionTone,
  useProposalNavigation,
} from "@/features/idp-proposal/sections";

/**
 * Abas de navegação na borda esquerda. A cor identifica a seção atual
 * e o atalho S permite recolher a lista.
 */
export function PresentationTabs({
  currentSlideId,
  onNavigate,
}: {
  currentSlideId: string;
  onNavigate: (id: string) => void;
}) {
  const { t: translate } = useTranslation();

  const { slides, sections } = useProposalNavigation();
  const currentSlide = slides.find((f) => f.id === currentSlideId)!;

  return (
    <nav
      className="index"
      aria-label={translate("proposal.controls.sections")}
      style={
        {
          "--spine": getSectionTone(currentSlide.sectionIndex),
        } as CSSProperties
      }
    >
      <span className="spine" aria-hidden="true" />
      <ol className="index-list">
        {slides.map((f, i) => (
          <li
            key={f.id}
            data-break={
              i > 1 && slides[i - 1].sectionIndex !== f.sectionIndex
                ? ""
                : undefined
            }
            style={
              { "--tone": getSectionTone(f.sectionIndex) } as CSSProperties
            }
          >
            <button
              className="itab"
              aria-current={f.id === currentSlideId ? "page" : undefined}
              title={
                f.sectionIndex < 0
                  ? f.label
                  : `${sections[f.sectionIndex].label} / ${f.label}`
              }
              onClick={() => onNavigate(f.id)}
            >
              <span className="itab-label">{f.label}</span>
            </button>
          </li>
        ))}
      </ol>
    </nav>
  );
}
