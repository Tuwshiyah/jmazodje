import type { ChangeEvent, FormEvent } from "react";
import { lazy, Suspense, useState } from "react";
import SiteHeader from "../app/SiteHeader";
import HeroPortrait from "../app/HeroPortrait";
import FirebaseServices from "./FirebaseServices";
import { saveQuoteRequest } from "./firebaseClient";
import {
  getServiceOptions,
  phoneHref,
  whatsappHref,
  type EditablePrestation,
  type SiteContent,
} from "./siteContent";
import { useSiteContent } from "./useSiteContent";

const Dashboard = lazy(() => import("./Dashboard"));

function HomePage({ content }: { content: SiteContent }) {
  const serviceOptions = getServiceOptions(content);
  const [quoteForm, setQuoteForm] = useState({
    name: "",
    phone: "",
    service: serviceOptions[0],
    date: "",
    message: "",
  });
  const [quoteStatus, setQuoteStatus] = useState("");
  const [isSendingQuote, setIsSendingQuote] = useState(false);

  const updateQuoteForm =
    (field: keyof typeof quoteForm) =>
    (
      event: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>,
    ) => {
      setQuoteForm((current) => ({ ...current, [field]: event.target.value }));
    };

  const submitQuoteForm = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (isSendingQuote) return;

    const message = [
      content.contact.whatsappMessage,
      `Nom : ${quoteForm.name}`,
      `Téléphone : ${quoteForm.phone}`,
      `Prestation : ${quoteForm.service}`,
      quoteForm.date ? `Date : ${quoteForm.date}` : "",
      quoteForm.message ? `Message : ${quoteForm.message}` : "",
    ]
      .filter(Boolean)
      .join("\n");

    const whatsappUrl = whatsappHref(content.contact.primaryPhone, message);
    setIsSendingQuote(true);
    setQuoteStatus("Enregistrement de votre demande...");

    try {
      await saveQuoteRequest({
        name: quoteForm.name.trim(),
        phone: quoteForm.phone.trim(),
        service: quoteForm.service,
        date: quoteForm.date,
        message: quoteForm.message.trim(),
      });
      setQuoteStatus("Demande enregistrée. Ouverture de WhatsApp...");
      setQuoteForm({
        name: "",
        phone: "",
        service: serviceOptions[0],
        date: "",
        message: "",
      });
      window.location.href = whatsappUrl;
    } catch {
      setQuoteStatus(
        "La sauvegarde est momentanément indisponible. Vous pouvez continuer sur WhatsApp.",
      );
      window.location.href = whatsappUrl;
    } finally {
      setIsSendingQuote(false);
    }
  };

  return (
    <main>
      <SiteHeader homeHref="#accueil" />
      <section className="hero" id="accueil">
        <div className="hero-copy">
          <p className="eyebrow">{content.hero.eyebrow}</p>
          <h1>Jean-Martial<br /><em data-text="Azodjé">Azodjé</em></h1>
          <p className="hero-intro">
            {content.hero.intro}<br />
            <a className="hero-learn-more" href="/a-propos">{content.hero.ctaLabel}</a>
          </p>
        </div>
        <HeroPortrait portraits={content.hero.portraits} badgeLabel={content.hero.portraitBadgeLabel} badgeTitle={content.hero.portraitBadgeTitle} />
      </section>

      <section className="prestations-showcase section-shell" id="prestations">
        <div className="section-heading"><p className="eyebrow eyebrow--dark">Mes prestations</p><p className="section-index">01 / 02</p></div>
        <div className="prestations-heading"><h2>Chaque scène mérite<br />sa juste <em>émotion.</em></h2></div>
        <div className="prestations-carousel" aria-label="Carousel des prestations">
          {content.prestations.map((prestation) => <a className="prestation-slide" data-index={prestation.number} href={`/prestations/${prestation.slug}`} key={prestation.id}>
            <span className="prestation-illustration">
              {prestation.image ? (
                <img src={prestation.image} alt={`Illustration — ${prestation.title}`} />
              ) : (
                <span>Image à ajouter</span>
              )}
            </span>
            <span className="prestation-slide__content">
              <span className="prestation-number">{prestation.number}</span>
              <h3>{prestation.titleLines.map((line) => <span key={line}>{line}</span>)}</h3>
              <p>{prestation.description}</p>
              <span className="prestation-cta">Voir la galerie</span>
            </span>
          </a>)}
        </div>
      </section>

      <section className="pricing" id="tarifs"><div className="section-shell"><div className="section-heading section-heading--light"><p className="eyebrow">{content.quote.eyebrow}</p><p className="section-index">02 / 02</p></div><div className="pricing-grid"><div><h2>{content.quote.titleLine1}<br />{content.quote.titleLine2} <em>{content.quote.titleEmphasis}</em></h2><p className="pricing-note">{content.quote.note}</p></div><form className="quote-form" onSubmit={submitQuoteForm}><div className="quote-form__row"><label>Nom complet<input type="text" value={quoteForm.name} onChange={updateQuoteForm("name")} placeholder="Votre nom" maxLength={120} required /></label><label>Téléphone<input type="tel" value={quoteForm.phone} onChange={updateQuoteForm("phone")} placeholder="+225 ..." maxLength={40} required /></label></div><label>Type d’événement<select value={quoteForm.service} onChange={updateQuoteForm("service")} required>{serviceOptions.map((service) => <option key={service} value={service}>{service}</option>)}</select></label><label>Date prévue<input type="date" value={quoteForm.date} onChange={updateQuoteForm("date")} /></label><label>Votre message<textarea value={quoteForm.message} onChange={updateQuoteForm("message")} placeholder="Lieu, heure, format, nombre d’invités..." maxLength={2000} rows={4} /></label><button type="submit" disabled={isSendingQuote}>{isSendingQuote ? "Envoi en cours..." : content.quote.buttonLabel}</button>{quoteStatus ? <p className="quote-form__status" role="status">{quoteStatus}</p> : null}</form></div></div></section>

      <section className="contact" id="contact"><p className="eyebrow">{content.contact.eyebrow}</p><h2>{content.contact.titleLine1}<br />{content.contact.titleLine2} <em>{content.contact.titleEmphasis}</em></h2><p className="contact-copy">{content.contact.copy}</p><div className="contact-links"><a href={phoneHref(content.contact.primaryPhone)}>{content.contact.primaryPhone}</a><a href={phoneHref(content.contact.secondaryPhone)}>{content.contact.secondaryPhone}</a></div></section>
      <footer><div className="footer-brand">Jean-Martial Azodjé</div><p>Journaliste · Présentateur TV · Maître de cérémonie</p><p>Abidjan, Côte d’Ivoire</p><a href="#accueil">Retour en haut ↑</a></footer>
      <nav className="mobile-actions" aria-label="Actions rapides"><a href={phoneHref(content.contact.primaryPhone)} aria-label={`Appeler le ${content.contact.primaryPhone}`}>Appeler</a><a href={whatsappHref(content.contact.primaryPhone, content.contact.whatsappMessage)} target="_blank" rel="noreferrer">WhatsApp <svg aria-hidden="true" className="mobile-action-icon" focusable="false" viewBox="0 0 24 24"><path d="M7 17 17 7" /><path d="M9 7h8v8" /></svg></a></nav>
    </main>
  );
}

function AboutPage({ content }: { content: SiteContent }) {
  return <main className="bio-page"><SiteHeader homeHref="/" variant="inner" /><section className="bio-hero"><a className="bio-back" href="/">← Retour</a><p className="eyebrow eyebrow--dark">À propos</p><h1>{content.about.titleLine1}<br />{content.about.titleLine2} <em>{content.about.titleEmphasis}</em></h1><div className="bio-copy"><p className="bio-lead">{content.about.lead}</p><p>{content.about.education}</p><p>{content.about.recognition}</p></div><blockquote className="bio-signature" id="signature"><span aria-hidden="true">“</span><em>{content.about.signature}</em></blockquote></section></main>;
}

function PrestationPage({ prestation }: { prestation: EditablePrestation }) {
  return (
    <main className="gallery-page">
      <SiteHeader homeHref="/" variant="inner" />
      <section className="gallery-hero">
        <a className="bio-back" href="/#prestations">← Retour aux prestations</a>
        <div className="gallery-hero__copy">
          <p className="eyebrow eyebrow--dark">Prestation {prestation.number}</p>
          <h1>{prestation.titleLines.map((line) => <span key={line}>{line}</span>)}</h1>
          <p>{prestation.description}</p>
        </div>
      </section>
      <section className="gallery-section">
        <div className="section-heading">
          <p className="eyebrow eyebrow--dark">Cérémonies</p>
          <p className="section-index">{prestation.number} / 04</p>
        </div>
        <div className="gallery-grid">
          {prestation.gallery.map((item) => (
            <article className="gallery-card" key={item.title}>
              <img src={item.image} alt={item.title} />
              <div>
                <h2>{item.title}</h2>
                <p>{item.caption}</p>
              </div>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}

function PublicSite({ path }: { path: string }) {
  const { content } = useSiteContent();
  const isAboutPage = path === "/a-propos";
  const prestationSlug = path.startsWith("/prestations/")
    ? path.replace("/prestations/", "")
    : "";
  const selectedPrestation = content.prestations.find(
    (prestation) => prestation.slug === prestationSlug,
  );

  if (isAboutPage) return <AboutPage content={content} />;
  if (selectedPrestation) return <PrestationPage prestation={selectedPrestation} />;
  return <HomePage content={content} />;
}

export default function App() {
  const path = window.location.pathname.replace(/\/+$/, "") || "/";
  const isDashboardPage = path === "/dashboard" || path.startsWith("/dashboard/");

  return <>
    <FirebaseServices />
    {isDashboardPage ? (
      <Suspense fallback={<main className="dashboard-page"><p className="dashboard-status">Chargement du dashboard...</p></main>}>
        <Dashboard />
      </Suspense>
    ) : (
      <PublicSite path={path} />
    )}
  </>;
}
