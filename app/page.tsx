import SiteHeader from "./SiteHeader";
import HeroPortrait from "./HeroPortrait";
import { prestations, serviceOptions } from "../src/prestations";

export default function Home() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: "Jean-Martial Azodjé",
    jobTitle: "Journaliste, présentateur TV et maître de cérémonie",
    telephone: ["+2250757988470", "+2250708115662"],
    description:
      "Maître de cérémonie avec plus de 15 années d’expérience dans la communication, les médias et l’animation événementielle.",
  };

  return (
    <main>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <SiteHeader homeHref="#accueil" />

      <section className="hero" id="accueil">
        <div className="hero-copy">
          <p className="eyebrow">
            Bonjour, je suis
          </p>
          <h1>
            Jean-Martial
            <br />
            <em data-text="Azodjé">Azodjé</em>
          </h1>
          <p className="hero-intro">
            Journaliste, présentateur TV et maître de cérémonie. Je donne du
            sens, du rythme et de l’émotion à chaque événement.
            <br />
            <a className="hero-learn-more" href="/a-propos">
              Découvrir ma biographie
            </a>
          </p>
        </div>

        <HeroPortrait />

      </section>

      <section className="prestations-showcase section-shell" id="prestations">
        <div className="section-heading">
          <p className="eyebrow eyebrow--dark">
            <span />
            Mes prestations
          </p>
          <p className="section-index">01 / 02</p>
        </div>
        <div className="prestations-heading">
          <h2>
            Chaque scène mérite
            <br />
            sa juste <em>émotion.</em>
          </h2>
        </div>
        <div className="prestations-carousel" aria-label="Carousel des prestations">
          {prestations.map((prestation) => (
            <a
              className="prestation-slide"
              data-index={prestation.number}
              href={`/prestations/${prestation.slug}`}
              key={prestation.title}
            >
              <span className="prestation-illustration">
                {prestation.image ? (
                  <img
                    src={prestation.image}
                    alt={`Illustration — ${prestation.title}`}
                  />
                ) : (
                  <span>Image à ajouter</span>
                )}
              </span>
              <span className="prestation-slide__content">
                <span className="prestation-number">{prestation.number}</span>
                <h3>
                  {prestation.titleLines.map((line) => (
                    <span key={line}>{line}</span>
                  ))}
                </h3>
                <p>{prestation.description}</p>
                <span className="prestation-cta">Voir la galerie</span>
              </span>
            </a>
          ))}
        </div>
      </section>

      <section className="pricing" id="tarifs">
        <div className="section-shell">
          <div className="section-heading section-heading--light">
            <p className="eyebrow">
              <span />
              Mes Tarifs
            </p>
            <p className="section-index">02 / 02</p>
          </div>
          <div className="pricing-grid">
            <div>
              <h2>
                Une présence à la hauteur
                <br />
                de votre <em>événement.</em>
              </h2>
              <p className="pricing-note">
                Remplissez le formulaire et partagez les premiers détails de
                votre événement. Je vous répondrai avec une proposition adaptée.
              </p>
            </div>
            <form
              className="quote-form"
              action="https://wa.me/2250757988470"
              method="get"
              target="_blank"
            >
              <input
                type="hidden"
                name="text"
                value="Bonjour Jean-Martial, je souhaite vous parler de mon événement."
              />
              <div className="quote-form__row">
                <label>
                  Nom complet
                  <input type="text" name="nom" placeholder="Votre nom" required />
                </label>
                <label>
                  Téléphone
                  <input type="tel" name="telephone" placeholder="+225 ..." required />
                </label>
              </div>
              <label>
                Type d’événement
                <select name="prestation" defaultValue={serviceOptions[0]} required>
                  {serviceOptions.map((service) => (
                    <option key={service} value={service}>
                      {service}
                    </option>
                  ))}
                </select>
              </label>
              <label>
                Date prévue
                <input type="date" name="date" />
              </label>
              <label>
                Votre message
                <textarea
                  name="message"
                  placeholder="Lieu, heure, format, nombre d’invités..."
                  rows={4}
                />
              </label>
              <button type="submit">Envoyer ma demande</button>
            </form>
          </div>
        </div>
      </section>

      <section className="contact" id="contact">
        <p className="eyebrow">
          <span />
          Disponible pour votre prochain événement
        </p>
        <h2>
          Faisons vivre
          <br />
          votre <em>moment.</em>
        </h2>
        <p className="contact-copy">
          Racontez-moi votre projet. Nous construirons ensemble une expérience
          fluide, élégante et mémorable.
        </p>
        <div className="contact-links">
          <a href="tel:+2250757988470">+225 07 57 98 84 70</a>
          <a href="tel:+2250708115662">+225 07 08 11 56 62</a>
        </div>
      </section>

      <footer>
        <div className="footer-brand">Jean-Martial Azodjé</div>
        <p>Journaliste · Présentateur TV · Maître de cérémonie</p>
        <p>Abidjan, Côte d’Ivoire</p>
        <a href="#accueil">Retour en haut ↑</a>
      </footer>

      <nav className="mobile-actions" aria-label="Actions rapides">
        <a
          href="tel:+2250757988470"
          aria-label="Appeler le +225 07 57 98 84 70"
        >
          Appeler
        </a>
        <a
          href="https://wa.me/2250757988470?text=Bonjour%20Jean-Martial%2C%20je%20souhaite%20vous%20parler%20de%20mon%20%C3%A9v%C3%A9ment."
          target="_blank"
          rel="noreferrer"
        >
          WhatsApp{" "}
          <svg
            aria-hidden="true"
            className="mobile-action-icon"
            focusable="false"
            viewBox="0 0 24 24"
          >
            <path d="M7 17 17 7" />
            <path d="M9 7h8v8" />
          </svg>
        </a>
      </nav>
    </main>
  );
}
