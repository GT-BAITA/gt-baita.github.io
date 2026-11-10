import { useTranslation } from "react-i18next";
import { useEffect, useState, type CSSProperties } from "react";
import {
  getSectionTone,
  useProposalNavigation,
} from "@/features/idp-proposal/sections";
import { Close, Menu } from "@/features/idp-proposal/components/icons";
import { ProposalLanguageToggle } from "@/features/idp-proposal/components/language-toggle";

/**
 * Índice da apresentação em telas estreitas. A folha sobreposta trava a rolagem
 * enquanto está aberta e pode ser fechada com Escape.
 */
export function MobileNavigation({
  currentSlideId,
  onNavigate,
}: {
  currentSlideId: string;
  onNavigate: (id: string) => void;
}) {
  const { t: translate } = useTranslation();

  const [open, setOpen] = useState(false);
  const { slides, sections } = useProposalNavigation();
  const currentSlide = slides.find((f) => f.id === currentSlideId)!;
  const section =
    currentSlide.sectionIndex < 0
      ? null
      : sections[currentSlide.sectionIndex].label;

  // Fecha com Esc e trava a rolagem da página enquanto a folha está aberta.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    addEventListener("keydown", onKey);
    document.documentElement.dataset.proposalLock = "";
    return () => {
      removeEventListener("keydown", onKey);
      delete document.documentElement.dataset.proposalLock;
    };
  }, [open]);

  const pick = (id: string) => {
    setOpen(false);
    onNavigate(id);
  };

  return (
    <>
      <header
        className="mbar"
        style={
          {
            "--tone": getSectionTone(currentSlide.sectionIndex),
          } as CSSProperties
        }
      >
        <button
          className="mbar-where"
          onClick={() => setOpen(true)}
          aria-haspopup="dialog"
          aria-expanded={open}
        >
          <span className="mbar-dot" aria-hidden="true" />
          {section && <span className="mbar-sec">{section}</span>}
          <span className="mbar-sub">{currentSlide.label}</span>
        </button>
        <ProposalLanguageToggle />
        <button
          className="mbar-btn"
          onClick={() => setOpen(true)}
          aria-label={translate("proposal.controls.openIndex")}
        >
          <Menu />
        </button>
      </header>

      {open && (
        <div
          className="msheet"
          role="dialog"
          aria-modal="true"
          aria-label={translate("proposal.controls.index")}
        >
          <div className="msheet-head">
            <span className="wordmark">GT-Baita</span>
            <button
              className="mbar-btn"
              onClick={() => setOpen(false)}
              aria-label={translate("proposal.controls.closeIndex")}
              autoFocus
            >
              <Close />
            </button>
          </div>
          <nav className="msheet-list">
            <button
              className="msheet-item msheet-item--cover"
              aria-current={
                currentSlideId === slides[0].id ? "page" : undefined
              }
              onClick={() => pick(slides[0].id)}
            >
              {slides[0].label}
            </button>
            {sections.map((s, si) => (
              <section
                key={s.label}
                className="msheet-group"
                style={{ "--tone": getSectionTone(si) } as CSSProperties}
              >
                <h2 className="msheet-sec">{s.label}</h2>
                {s.slides.map((sub) => (
                  <button
                    key={sub.id}
                    className="msheet-item"
                    aria-current={
                      sub.id === currentSlideId ? "page" : undefined
                    }
                    onClick={() => pick(sub.id)}
                  >
                    {sub.label}
                  </button>
                ))}
              </section>
            ))}
          </nav>
        </div>
      )}
    </>
  );
}
