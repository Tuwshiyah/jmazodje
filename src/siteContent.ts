import { prestations } from "./prestations";

export type GalleryItem = {
  id: string;
  image: string;
  title: string;
  caption: string;
};

export type EditablePrestation = {
  id: string;
  number: string;
  slug: string;
  title: string;
  titleLines: string[];
  description: string;
  className: string;
  image: string;
  gallery: GalleryItem[];
};

export type SiteContent = {
  hero: {
    eyebrow: string;
    intro: string;
    ctaLabel: string;
    portraitBadgeLabel: string;
    portraitBadgeTitle: string;
    portraits: Array<{
      id: string;
      src: string;
      alt: string;
    }>;
  };
  about: {
    titleLine1: string;
    titleLine2: string;
    titleEmphasis: string;
    lead: string;
    education: string;
    recognition: string;
    signature: string;
  };
  quote: {
    eyebrow: string;
    titleLine1: string;
    titleLine2: string;
    titleEmphasis: string;
    note: string;
    buttonLabel: string;
  };
  contact: {
    eyebrow: string;
    titleLine1: string;
    titleLine2: string;
    titleEmphasis: string;
    copy: string;
    primaryPhone: string;
    secondaryPhone: string;
    whatsappMessage: string;
  };
  prestations: EditablePrestation[];
};

export const siteContentStorageKey = "jma-site-content-v2";

export const createId = () =>
  globalThis.crypto?.randomUUID?.() ?? `${Date.now()}-${Math.random()}`;

export const createSlug = (value: string) =>
  value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/&/g, " et ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 70) || "prestation";

const defaultPrestations: EditablePrestation[] = prestations.map(
  (prestation, index) => ({
    ...prestation,
    id: prestation.slug,
    number: String(index + 1).padStart(2, "0"),
    gallery: prestation.gallery.map((item, itemIndex) => ({
      ...item,
      id: `${prestation.slug}-${itemIndex + 1}`,
    })),
  }),
);

export const defaultSiteContent: SiteContent = {
  hero: {
    eyebrow: "Bonjour, je suis",
    intro:
      "Journaliste, présentateur TV et maître de cérémonie. Je donne du sens, du rythme et de l’émotion à chaque événement.",
    ctaLabel: "Découvrir ma biographie",
    portraitBadgeLabel: "15 ans d’expérience",
    portraitBadgeTitle: "Maître de cérémonie",
    portraits: [
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
    ],
  },
  about: {
    titleLine1: "L’élégance du mot.",
    titleLine2: "La maîtrise du",
    titleEmphasis: "moment.",
    lead: "Jean-Martial Azodjé est journaliste, présentateur TV et maître de cérémonie.",
    education:
      "Diplômé de l’École Supérieure de Journalisme de Lille, il cumule plus de 15 années d’expérience dans les domaines de la communication, des médias et de l’animation événementielle.",
    recognition:
      "Reconnu pour son éloquence, son professionnalisme et sa maîtrise du protocole, il captive son auditoire, valorise ses invités et assure le bon déroulement de chaque programme.",
    signature:
      "Donner du sens, du rythme et de l’émotion à chaque événement : telle est ma signature.",
  },
  quote: {
    eyebrow: "Mes Tarifs",
    titleLine1: "Une présence à la hauteur",
    titleLine2: "de votre",
    titleEmphasis: "événement.",
    note:
      "Remplissez le formulaire et partagez les premiers détails de votre événement. Je vous répondrai avec une proposition adaptée.",
    buttonLabel: "Envoyer ma demande",
  },
  contact: {
    eyebrow: "Disponible pour votre prochain événement",
    titleLine1: "Faisons vivre",
    titleLine2: "votre",
    titleEmphasis: "moment.",
    copy:
      "Racontez-moi votre projet. Nous construirons ensemble une expérience fluide, élégante et mémorable.",
    primaryPhone: "+225 07 57 98 84 70",
    secondaryPhone: "+225 07 08 11 56 62",
    whatsappMessage:
      "Bonjour Jean-Martial, je souhaite vous parler de mon événement.",
  },
  prestations: defaultPrestations,
};

export const phoneHref = (value: string) => `tel:${value.replace(/[^\d+]/g, "")}`;

export const whatsappHref = (phone: string, message: string) =>
  `https://wa.me/${phone.replace(/[^\d]/g, "")}?text=${encodeURIComponent(message)}`;

const latestUploadedImageByPreviousPath = new Map([
  [
    "site-images%2F1786760295566-whatsapp-image-2026-08-15-at-02.17.29.jpeg",
    "https://firebasestorage.googleapis.com/v0/b/jmazodje.firebasestorage.app/o/site-images%2F1786761413395-whatsapp-image-2026-08-15-at-02.17.29.jpeg?alt=media&token=cd2e11df-e8f0-4466-8a5e-75dd1cd576bd",
  ],
]);

export const resolveLatestUploadedImage = (image = "") => {
  const replacement = [...latestUploadedImageByPreviousPath.entries()].find(
    ([previousPath]) => image.includes(previousPath),
  );

  return replacement?.[1] ?? image;
};

export function normalizeSiteContent(value: unknown): SiteContent {
  if (!value || typeof value !== "object") return defaultSiteContent;

  const partial = value as Partial<SiteContent>;
  const prestationsValue = Array.isArray(partial.prestations)
    ? partial.prestations
    : defaultSiteContent.prestations;

  const normalizedPrestations = prestationsValue.map((prestation, index) => {
    const title = prestation.title || `Prestation ${index + 1}`;
    const slug = prestation.slug || createSlug(title);
    const titleLines =
      Array.isArray(prestation.titleLines) && prestation.titleLines.length
        ? prestation.titleLines
        : [title];

    return {
      id: prestation.id || slug || createId(),
      number: String(index + 1).padStart(2, "0"),
      slug,
      title,
      titleLines,
      description: prestation.description || "",
      className: prestation.className || "event-card--wedding",
      image: resolveLatestUploadedImage(prestation.image || ""),
      gallery: Array.isArray(prestation.gallery)
        ? prestation.gallery.map((item, itemIndex) => ({
            id: item.id || `${slug}-${itemIndex + 1}`,
            image: resolveLatestUploadedImage(item.image || ""),
            title: item.title || `Image ${itemIndex + 1}`,
            caption: item.caption || "",
          }))
        : [],
    };
  });

  return {
    ...defaultSiteContent,
    ...partial,
    hero: {
      ...defaultSiteContent.hero,
      ...partial.hero,
      portraits:
        partial.hero?.portraits?.length
          ? partial.hero.portraits.map((portrait) => ({
              id: portrait.id || createId(),
              src: resolveLatestUploadedImage(portrait.src || ""),
              alt: portrait.alt || "Photo de Jean-Martial Azodjé",
            }))
          : defaultSiteContent.hero.portraits,
    },
    about: { ...defaultSiteContent.about, ...partial.about },
    quote: { ...defaultSiteContent.quote, ...partial.quote },
    contact: { ...defaultSiteContent.contact, ...partial.contact },
    prestations: normalizedPrestations,
  };
}

export const getServiceOptions = (content: SiteContent) => [
  ...content.prestations.map((prestation) => prestation.title),
  "Autre événement",
];
