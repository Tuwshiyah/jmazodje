const events = [
  {
    number: "01",
    title: "Mariages & Dotes",
    description:
      "Une présence élégante pour donner du rythme aux temps forts, créer de l’émotion et faire de votre union un souvenir inoubliable.",
    price: "À partir de 350 000 FCFA",
    className: "event-card--wedding",
  },
  {
    number: "02",
    title: "Cérémonies institutionnelles",
    description:
      "Une parfaite maîtrise du protocole, des prises de parole et des transitions pour porter l’image de votre institution.",
    price: "1 000 000 FCFA",
    className: "event-card--institution",
  },
  {
    number: "03",
    title: "Galas & événements d’entreprise",
    description:
      "Une animation précise et vivante qui valorise vos invités, vos messages et chaque séquence de votre programme.",
    price: "Sur devis",
    className: "event-card--gala",
  },
  {
    number: "04",
    title: "Baptêmes & Anniversaires",
    description:
      "Une ambiance chaleureuse, fluide et participative, pensée pour rassembler toutes les générations.",
    price: "À partir de 250 000 FCFA",
    className: "event-card--celebration",
  },
];

const pricing = [
  { service: "Mariage & Dote", price: "350 000 — 400 000", note: "FCFA" },
  {
    service: "Cérémonie institutionnelle",
    price: "1 000 000",
    note: "FCFA",
  },
  {
    service: "Baptême & Anniversaire",
    price: "250 000 — 300 000",
    note: "FCFA",
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

      <header className="site-header">
        <a className="brand" href="#accueil" aria-label="Retour à l’accueil">
          <span className="brand-mark">JM</span>
          <span className="brand-name">Jean-Martial Azodjé</span>
        </a>
        <nav className="desktop-nav" aria-label="Navigation principale">
          <a href="#apropos">À propos</a>
          <a href="#evenements">Événements</a>
          <a href="#tarifs">Tarifs</a>
        </nav>
        <a className="header-cta" href="tel:+2250757988470">
          Contactez-moi <span aria-hidden="true">→</span>
        </a>
      </header>

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
          </p>
          <div className="hero-actions">
            <a
              className="button button--copper"
              href="https://wa.me/2250757988470?text=Bonjour%20Jean-Martial%2C%20je%20souhaite%20vous%20parler%20de%20mon%20%C3%A9v%C3%A9nement."
              target="_blank"
              rel="noreferrer"
            >
              Travaillons ensemble <span aria-hidden="true">→</span>
            </a>
          </div>
        </div>

        <div className="hero-portrait">
          <div className="portrait-placeholder" role="img" aria-label="Emplacement réservé au portrait de Jean-Martial Azodjé">
            <span className="portrait-initials">JM</span>
            <span className="portrait-label">
              Votre portrait
              <small>Photo à remplacer</small>
            </span>
          </div>
          <div className="availability">
            <span />
            Disponible pour de nouveaux événements
          </div>
        </div>

        <div className="hero-profile">
          <p className="profile-kicker">15 ans d’expérience</p>
          <h2>
            Maître de
            <br />
            <span>cérémonie</span>
          </h2>
          <div className="profile-proof">
            <div className="profile-dots" aria-hidden="true">
              <i>JM</i>
              <i>TV</i>
              <i>MC</i>
              <i>+15</i>
            </div>
            <p>
              <strong>Des événements mémorables</strong>
              <span>Mariages · Galas · Institutions</span>
            </p>
          </div>
          <a className="profile-link" href="#evenements">
            Voir mes prestations <span aria-hidden="true">↓</span>
          </a>
        </div>
      </section>

      <section className="proof-strip" aria-label="Expertises">
        <span>Mariages</span>
        <i>✦</i>
        <span>Protocoles</span>
        <i>✦</i>
        <span>Conférences</span>
        <i>✦</i>
        <span>Galas</span>
        <i>✦</i>
        <span>Événements d’entreprise</span>
      </section>

      <section className="about section-shell" id="apropos">
        <div className="section-heading">
          <p className="eyebrow eyebrow--dark">
            <span />
            À propos
          </p>
          <p className="section-index">01 / 04</p>
        </div>
        <div className="about-grid">
          <h2>
            L’élégance du mot.
            <br />
            La maîtrise du <em>moment.</em>
          </h2>
          <div className="about-copy">
            <p className="about-lead">
              Jean-Martial Azodjé est journaliste, présentateur TV et maître de
              cérémonie.
            </p>
            <p>
              Diplômé de l’École Supérieure de Journalisme de Lille, il cumule
              plus de 15 années d’expérience dans les domaines de la
              communication, des médias et de l’animation événementielle.
            </p>
            <p>
              Reconnu pour son éloquence, son professionnalisme et sa maîtrise
              du protocole, il captive son auditoire, valorise ses invités et
              assure le bon déroulement de chaque programme.
            </p>
            <div className="about-quote">
              <span aria-hidden="true">“</span>
              <blockquote>
                Donner du sens, du rythme et de l’émotion à chaque événement :
                telle est ma signature.
              </blockquote>
            </div>
          </div>
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
                  <span>Photo événement</span>
                  <small>à remplacer</small>
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

      <section className="method section-shell">
        <div className="section-heading">
          <p className="eyebrow eyebrow--dark">
            <span />
            Ma signature
          </p>
          <p className="section-index">03 / 04</p>
        </div>
        <div className="method-grid">
          <h2>
            Avant la scène,
            <br />
            tout se <em>prépare.</em>
          </h2>
          <ol className="method-list">
            <li>
              <span>01</span>
              <div>
                <h3>Écoute & compréhension</h3>
                <p>Vos objectifs, votre public, votre histoire et vos attentes.</p>
              </div>
            </li>
            <li>
              <span>02</span>
              <div>
                <h3>Préparation du conducteur</h3>
                <p>Une trame fluide, des transitions précises et le bon tempo.</p>
              </div>
            </li>
            <li>
              <span>03</span>
              <div>
                <h3>Présence & émotion</h3>
                <p>Le jour J, chaque séquence trouve naturellement sa place.</p>
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
              Prestations & tarifs
            </p>
            <p className="section-index">04 / 04</p>
          </div>
          <div className="pricing-grid">
            <div>
              <h2>
                Une présence
                <br />
                à la hauteur de
                <br />
                votre <em>événement.</em>
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
                    <span>{item.note}</span>
                  </p>
                </div>
              ))}
              <a
                className="button button--copper button--full"
                href="https://wa.me/2250757988470?text=Bonjour%20Jean-Martial%2C%20je%20souhaite%20recevoir%20un%20devis."
                target="_blank"
                rel="noreferrer"
              >
                Demander un devis personnalisé <span aria-hidden="true">↗</span>
              </a>
            </div>
          </div>
        </div>
      </section>

      <section className="contact">
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
        <a
          className="button button--light"
          href="https://wa.me/2250757988470?text=Bonjour%20Jean-Martial%2C%20je%20souhaite%20vous%20parler%20de%20mon%20%C3%A9v%C3%A9nement."
          target="_blank"
          rel="noreferrer"
        >
          Démarrer la conversation <span aria-hidden="true">↗</span>
        </a>
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
