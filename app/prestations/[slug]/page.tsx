import { notFound } from "next/navigation";
import SiteHeader from "../../SiteHeader";
import { prestations } from "../../../src/prestations";

type PrestationPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export function generateStaticParams() {
  return prestations.map((prestation) => ({ slug: prestation.slug }));
}

export default async function PrestationPage({ params }: PrestationPageProps) {
  const { slug } = await params;
  const prestation = prestations.find((item) => item.slug === slug);

  if (!prestation) notFound();

  return (
    <main className="gallery-page">
      <SiteHeader homeHref="/" variant="inner" />

      <section className="gallery-hero">
        <a className="bio-back" href="/#prestations">
          ← Retour aux prestations
        </a>
        <div className="gallery-hero__copy">
          <p className="eyebrow eyebrow--dark">
            <span />
            Prestation {prestation.number}
          </p>
          <h1>
            {prestation.titleLines.map((line) => (
              <span key={line}>{line}</span>
            ))}
          </h1>
          <p>{prestation.description}</p>
        </div>
      </section>

      <section className="gallery-section">
        <div className="section-heading">
          <p className="eyebrow eyebrow--dark">
            <span />
            Cérémonies
          </p>
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
