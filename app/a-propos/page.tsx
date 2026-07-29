import SiteHeader from "../SiteHeader";

export default function AboutPage() {
  return (
    <main className="bio-page">
      <SiteHeader homeHref="/" variant="inner" />

      <section className="bio-hero">
        <a className="bio-back" href="/">
          ← Retour
        </a>
        <p className="eyebrow eyebrow--dark">
          <span />
          À propos
        </p>
        <h1>
          L’élégance du mot.
          <br />
          La maîtrise du <em>moment.</em>
        </h1>
        <div className="bio-copy">
          <p className="bio-lead">
            Jean-Martial Azodjé est journaliste, présentateur TV et maître de
            cérémonie.
          </p>
          <p>
            Diplômé de l’École Supérieure de Journalisme de Lille, il cumule
            plus de 15 années d’expérience dans les domaines de la
            communication, des médias et de l’animation événementielle.
          </p>
          <p>
            Reconnu pour son éloquence, son professionnalisme et sa maîtrise du
            protocole, il captive son auditoire, valorise ses invités et assure
            le bon déroulement de chaque programme.
          </p>
        </div>
        <blockquote className="bio-signature" id="signature">
          <span aria-hidden="true">“</span>
          <em>
            Donner du sens, du rythme et de l’émotion à chaque événement :
            telle est ma signature.
          </em>
        </blockquote>
      </section>
    </main>
  );
}
