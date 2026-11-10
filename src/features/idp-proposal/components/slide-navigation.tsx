import { useTranslation } from "react-i18next";
import {
  ChevronLeft,
  ChevronRight,
} from "@/features/idp-proposal/components/icons";

export function SlideNavigation({
  onPrev,
  onNext,
  atStart,
  atEnd,
}: {
  onPrev: () => void;
  onNext: () => void;
  atStart: boolean;
  atEnd: boolean;
}) {
  const { t: translate } = useTranslation();

  return (
    <div className="arrows">
      <button
        className="arrow arrow--prev"
        onClick={onPrev}
        disabled={atStart}
        aria-label={translate("proposal.controls.previous")}
      >
        <ChevronLeft />
      </button>
      <button
        className="arrow arrow--next"
        onClick={onNext}
        disabled={atEnd}
        aria-label={translate("proposal.controls.next")}
      >
        <ChevronRight />
      </button>
    </div>
  );
}
