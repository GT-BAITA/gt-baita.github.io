import { useTranslation } from "react-i18next";
import { useRef, useState } from "react";
import { useHeroBackdrop } from "@/features/idp-proposal/components/hero-dither";
import { rv } from "@/features/idp-proposal/components/slide-layout";

/**
 * Equipe do projeto. As fotos locais usam as iniciais como alternativa quando não carregam.
 */

export function TeamScreen() {
  const { t: translate } = useTranslation();

  const members = [
    {
      photo: "frederico",
      name: "Frederico Schardong",
      role: translate("proposal.team.coordinator"),
      title: translate("proposal.team.professor"),
    },
    {
      photo: "brendon",
      name: "Brendon Vicente",
      role: translate("proposal.team.assistant"),
      title: translate("proposal.team.masters"),
    },
    {
      photo: "eduardo",
      name: "Eduardo Perottoni",
      role: translate("proposal.team.assistant"),
      title: translate("proposal.team.masters"),
    },
    {
      photo: "giulia",
      name: "Giulia Manno",
      role: translate("proposal.team.assistant"),
      title: translate("proposal.team.designer"),
    },
  ];

  const headRef = useRef<HTMLParagraphElement>(null);
  const gridRef = useRef<HTMLUListElement>(null);
  useHeroBackdrop({
    layout: "scatter",
    anchorRef: gridRef,
    quietRefs: [headRef, gridRef],
  });

  return (
    <div className="team">
      <p className="big team-head rv" style={rv(0)} ref={headRef}>
        <span className="d1">{translate("proposal.team.headingLead")}</span>{" "}
        {translate("proposal.team.headingEnd")}
      </p>
      <ul className="team-grid" ref={gridRef}>
        {members.map((p, i) => (
          <li key={p.name} className="person rv" style={rv(2 + i)}>
            <TeamPhoto slug={p.photo} name={p.name} />
            <div className="person-text">
              <p className="person-name">{p.name}</p>
              <p className="person-role">{p.role}</p>
              <p className="person-title">{p.title}</p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

function TeamPhoto({ slug, name }: { slug: string; name: string }) {
  const [missing, setMissing] = useState(false);
  const initials = name
    .split(" ")
    .map((w) => w[0])
    .slice(0, 2)
    .join("");
  return (
    <div className="photo">
      {missing ? (
        <span className="photo-empty" aria-hidden="true">
          {initials}
        </span>
      ) : (
        <img
          src={`/idp-proposal/team/${slug}.jpg`}
          alt={name}
          onError={() => setMissing(true)}
        />
      )}
    </div>
  );
}
