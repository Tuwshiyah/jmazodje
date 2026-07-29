"use client";

import { useState } from "react";

const menuLinks = [
  { label: "Ma biographie", href: "/a-propos" },
  { label: "Mes prestations", href: "/#prestations" },
  { label: "Événements animés", href: "/#evenements" },
  { label: "Ma signature", href: "/#signature" },
  { label: "Prestation et tarifs", href: "/#tarifs" },
  { label: "Me contacter", href: "/#contact" },
];

type SiteHeaderProps = {
  homeHref?: string;
  variant?: "home" | "inner";
};

export default function SiteHeader({
  homeHref = "/#accueil",
  variant = "home",
}: SiteHeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className={`site-header${variant === "inner" ? " site-header--inner" : ""}`}>
      <button
        className="brand-mark menu-toggle"
        type="button"
        aria-label={isMenuOpen ? "Fermer le menu" : "Ouvrir le menu"}
        aria-expanded={isMenuOpen}
        aria-controls="main-menu"
        onClick={() => setIsMenuOpen((current) => !current)}
      >
        <span />
        <span />
        <span />
      </button>
      <a className="brand-name brand-name--link" href={homeHref}>
        Jean-Martial Azodjé
      </a>
      <nav className="desktop-nav" aria-label="Navigation principale">
        <a href="/a-propos">À propos</a>
        <a href="/#evenements">Événements</a>
        <a href="/#tarifs">Tarifs</a>
      </nav>
      <div className="header-actions">
        <a
          className="header-contact"
          href="https://wa.me/2250757988470?text=Bonjour%20Jean-Martial%2C%20je%20souhaite%20vous%20parler%20de%20mon%20%C3%A9v%C3%A9nement."
          target="_blank"
          rel="noreferrer"
        >
          Me contacter
        </a>
        <a
          className="header-icon header-icon--facebook"
          href="https://www.facebook.com/"
          target="_blank"
          rel="noreferrer"
          aria-label="Facebook"
        >
          <span aria-hidden="true">f</span>
        </a>
        <a
          className="header-icon"
          href="tel:+2250757988470"
          aria-label="Appeler Jean-Martial Azodjé"
        >
          <span aria-hidden="true">☎</span>
        </a>
      </div>

      <div
        className="fullscreen-menu"
        id="main-menu"
        aria-hidden={!isMenuOpen}
        data-open={isMenuOpen}
      >
        <div className="fullscreen-menu__top">
          <span>Menu</span>
          <button type="button" onClick={() => setIsMenuOpen(false)}>
            Fermer
          </button>
        </div>
        <nav className="fullscreen-menu__links" aria-label="Menu principal">
          {menuLinks.map((link, index) => (
            <a
              href={link.href}
              key={link.label}
              onClick={() => setIsMenuOpen(false)}
            >
              <span>{String(index + 1).padStart(2, "0")}</span>
              {link.label}
            </a>
          ))}
        </nav>
      </div>
    </header>
  );
}
