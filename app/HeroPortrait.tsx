"use client";

import { useState } from "react";

const portraits = [
  {
    id: "portrait-main",
    src: "/portrait-jean-martial.webp",
    alt: "Portrait de Jean-Martial Azodjé",
  },
  {
    id: "portrait-speaking",
    src: "/hero-jean-martial-2.webp",
    alt: "Jean-Martial Azodjé prenant la parole lors d’un événement",
  },
];

type HeroPortraitProps = {
  portraits?: typeof portraits;
  badgeLabel?: string;
  badgeTitle?: string;
};

export default function HeroPortrait({
  portraits: providedPortraits = portraits,
  badgeLabel = "15 ans d’expérience",
  badgeTitle = "Maître de cérémonie",
}: HeroPortraitProps) {
  const [activePortrait, setActivePortrait] = useState(0);
  const visiblePortraits = providedPortraits.filter((portrait) => portrait.src);
  const activePortraitIndex = visiblePortraits.length
    ? activePortrait % visiblePortraits.length
    : 0;

  const showNextPortrait = () => {
    setActivePortrait((current) => (current + 1) % visiblePortraits.length);
  };

  return (
    <div className="hero-portrait">
      <div className="portrait-placeholder">
        {visiblePortraits.length ? (
          visiblePortraits.map((portrait, index) => (
            <img
              key={portrait.id}
              className={`portrait-photo ${index === activePortraitIndex ? "is-active" : ""}`}
              src={portrait.src}
              alt={portrait.alt}
              aria-hidden={index !== activePortraitIndex}
            />
          ))
        ) : (
          <div className="portrait-photo is-active" />
        )}
      </div>
      <div className="availability">
        <div className="availability-copy">
          <p>{badgeLabel}</p>
          <strong>{badgeTitle}</strong>
        </div>
        {visiblePortraits.length > 1 ? (
          <button
            className="portrait-next"
            type="button"
            onClick={showNextPortrait}
            aria-label="Afficher la photo suivante"
          >
            <span aria-hidden="true">→</span>
          </button>
        ) : null}
      </div>
    </div>
  );
}
