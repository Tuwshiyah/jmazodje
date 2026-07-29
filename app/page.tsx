import SiteHeader from "./SiteHeader";

const events = [
  {
    number: "01",
    title: "Mariages & Dotes",
    titleLines: ["Mariages &", "Dotes"],
    description:
      "Une présence élégante pour donner du rythme aux temps forts, créer de l’émotion et faire de votre union un souvenir inoubliable.",
    price: "À partir de 350.000 FCFA",
    className: "event-card--wedding",
    image: "/mariage-dote.jpg",
  },
  {
    number: "02",
    title: "Cérémonies institutionnelles",
    titleLines: ["Cérémonies", "institutionnelles"],
    description:
      "Une parfaite maîtrise du protocole, des prises de parole et des transitions pour porter l’image de votre institution.",
    price: "1 000 000 FCFA",
    className: "event-card--institution",
    image: "/ceremonie-institutionnelle.jpg",
  },
  {
    number: "03",
    title: "Galas & événements d’entreprise",
    titleLines: ["Galas & événements", "d’entreprise"],
    description:
      "Une animation précise et vivante qui valorise vos invités, vos messages et chaque séquence de votre programme.",
    price: "Sur devis",
    className: "event-card--gala",
    image: "/gala-evenement-entreprise.jpg",
  },
  {
    number: "04",
    title: "Baptêmes & Anniversaires",
    titleLines: ["Baptêmes &", "Anniversaires"],
    description:
      "Une ambiance chaleureuse, fluide et participative, pensée pour rassembler toutes les générations.",
    price: "À partir de 250.000 FCFA",
    className: "event-card--celebration",
    image: "/bapteme-anniversaire.jpg",
  },
];

const pricing = [
  { service: "Mariage & Dote", price: "350 000 — 400 000 FCFA" },
  {
    service: "Cérémonie institutionnelle",
    price: "1 000 000 FCFA",
  },
  {
    service: "Baptême & Anniversaire",
    price: "250 000 — 300 000 FCFA",
  },
];

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
            <em>Azodjé</em>
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

        <div className="hero-portrait">
          <div className="portrait-placeholder">
            <img
              className="portrait-photo"
              src="/portrait-jean-martial.webp"
              alt="Portrait de Jean-Martial Azodjé"
              width="2078"
              height="2472"
            />
          </div>
          <div className="availability">
            <p>15 ans d’expérience</p>
            <strong>Maître de cérémonie</strong>
          </div>
        </div>

      </section>

      <section className="prestations-showcase section-shell" id="prestations">
        <div className="section-heading">
          <p className="eyebrow eyebrow--dark">
            <span />
            Mes prestations
          </p>
          <p className="section-index">01 / 04</p>
        </div>
        <div className="prestations-heading">
          <h2>
            Chaque scène mérite
            <br />
            sa juste <em>émotion.</em>
          </h2>
        </div>
        <div className="prestations-carousel" aria-label="Carousel des prestations">
          {events.map((event) => (
            <article
              className="prestation-slide"
              data-index={event.number}
              key={event.title}
            >
              <span className="prestation-number">{event.number}</span>
              <h3>
                {event.titleLines.map((line) => (
                  <span key={line}>{line}</span>
                ))}
              </h3>
              <p>{event.description}</p>
              <strong>{event.price}</strong>
            </article>
          ))}
        </div>
      </section>

      <section className="events" id="evenements">
        <div className="section-shell">
          <div className="section-heading section-heading--light">
            <p className="eyebrow">
              <span />
              Événements animés
            </p>
            <p className="section-index">02 / 04</p>
          </div>
          <div className="events-title">
            <h2>
              Chaque scène mérite
              <br />
              sa juste <em>émotion.</em>
            </h2>
            <p>
              Une animation sur mesure, adaptée au ton, au public et aux enjeux
              de votre événement.
            </p>
          </div>
          <div className="events-grid">
            {events.map((event) => (
              <article className={`event-card ${event.className}`} key={event.title}>
                <div className="event-photo">
                  {event.image ? (
                    <img src={event.image} alt={`${event.title} animé par Jean-Martial Azodjé`} />
                  ) : (
                    <>
                      <span>Photo événement</span>
                      <small>à remplacer</small>
                    </>
                  )}
                </div>
                <div className="event-content">
                  <span className="event-number">{event.number}</span>
                  <h3>{event.title}</h3>
                  <p>{event.description}</p>
                  <span className="event-price">{event.price}</span>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="method section-shell" id="signature">
        <div className="section-heading">
          <p className="eyebrow eyebrow--dark">
            <span />
            Ma signature
          </p>
          <p className="section-index">03 / 04</p>
        </div>
        <div className="method-grid method-grid--signature">
          <div className="signature-statement">
            <p className="signature-kicker">Une méthode en trois temps</p>
            <h2>
              Donner du sens,
              <br />
              du rythme et de <em>l’émotion.</em>
            </h2>
            <p className="signature-lead">
              Chaque prise de parole est pensée pour porter le moment, respecter
              le protocole et créer une présence qui reste en mémoire.
            </p>
          </div>
          <ol className="method-list signature-steps">
            <li>
              <span>01</span>
              <div>
                <h3>Comprendre l’intention</h3>
                <p>Identifier le ton, les enjeux, le public et l’histoire de votre événement.</p>
              </div>
            </li>
            <li>
              <span>02</span>
              <div>
                <h3>Construire le rythme</h3>
                <p>Préparer les transitions, les prises de parole et les respirations du programme.</p>
              </div>
            </li>
            <li>
              <span>03</span>
              <div>
                <h3>Porter le moment</h3>
                <p>Installer l’élégance, la fluidité et l’émotion juste le jour J.</p>
              </div>
            </li>
          </ol>
        </div>
      </section>

      <section className="pricing" id="tarifs">
        <div className="section-shell">
          <div className="section-heading section-heading--light">
            <p className="eyebrow">
              <span />
              Mes Tarifs
            </p>
            <p className="section-index">04 / 04</p>
          </div>
          <div className="pricing-grid">
            <div>
              <h2>
                Une présence à la hauteur
                <br />
                de votre <em>événement.</em>
              </h2>
              <p className="pricing-note">
                Les tarifs peuvent évoluer selon le lieu, la durée et le niveau
                de préparation requis.
              </p>
            </div>
            <div className="price-list">
              {pricing.map((item) => (
                <div className="price-row" key={item.service}>
                  <h3>{item.service}</h3>
                  <p>
                    <strong>{item.price}</strong>
                  </p>
                </div>
              ))}
            </div>
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
        <a href="tel:+2250757988470">Appeler</a>
        <a
          href="https://wa.me/2250757988470?text=Bonjour%20Jean-Martial%2C%20je%20souhaite%20vous%20parler%20de%20mon%20%C3%A9v%C3%A9ment."
          target="_blank"
          rel="noreferrer"
        >
          WhatsApp ↗
        </a>
      </nav>
    </main>
  );
}
