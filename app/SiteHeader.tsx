"use client";

import { useState } from "react";

const menuLinks = [
  { label: "Ma biographie", href: "/a-propos" },
  { label: "Mes prestations", href: "/#prestations" },
  { label: "Tarifs", href: "/#tarifs" },
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
        <a href="/#tarifs">Tarifs</a>
        <a href="/dashboard">Dashboard</a>
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
          className="header-icon header-icon--tiktok"
          href="https://www.tiktok.com/@jeanmartialazodje?_r=1&_t=ZS-98rN8zROgq2"
          target="_blank"
          rel="noreferrer"
          aria-label="TikTok de Jean-Martial Azodjé"
          title="TikTok"
        >
          <span aria-hidden="true">♪</span>
        </a>
        <a
          className="header-icon"
          href="tel:+2250757988470"
          aria-label="Appeler Jean-Martial Azodjé"
        >
          <svg
            aria-hidden="true"
            className="header-icon__svg"
            focusable="false"
            viewBox="0 0 24 24"
          >
            <path d="M6.6 2.8 9 2.2l2.1 5-1.6 1.2c1 2.1 2.6 3.8 4.7 4.9l1.3-1.6 5 2.2-.5 2.4c-.3 1.4-1.7 2.3-3.1 2a18 18 0 0 1-11-7.2A17.7 17.7 0 0 1 4.5 5.9c-.3-1.4.7-2.8 2.1-3.1Z" />
          </svg>
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
