export const prestations = [
  {
    number: "01",
    slug: "mariages-dotes",
    title: "Mariages & Dotes",
    titleLines: ["Mariages &", "Dotes"],
    description:
      "Une présence élégante pour donner du rythme aux temps forts, créer de l’émotion et faire de votre union un souvenir inoubliable.",
    className: "event-card--wedding",
    image: "/mariage-dote.jpg",
    gallery: [
      {
        image: "/mariage-dote.jpg",
        title: "Moments forts de l’union",
        caption: "Une animation fluide pour accompagner les temps symboliques.",
      },
      {
        image: "/portrait-jean-martial.webp",
        title: "Présence élégante",
        caption: "Une posture sobre, rassurante et attentive au protocole.",
      },
      {
        image: "/hero-jean-martial-2.webp",
        title: "Transitions maîtrisées",
        caption: "Des prises de parole claires pour garder le rythme de la cérémonie.",
      },
    ],
  },
  {
    number: "02",
    slug: "ceremonies-institutionnelles",
    title: "Cérémonies institutionnelles",
    titleLines: ["Cérémonies", "institutionnelles"],
    description:
      "Une parfaite maîtrise du protocole, des prises de parole et des transitions pour porter l’image de votre institution.",
    className: "event-card--institution",
    image: "/ceremonie-institutionnelle.jpg",
    gallery: [
      {
        image: "/ceremonie-institutionnelle.jpg",
        title: "Cérémonie officielle",
        caption: "Un ton juste pour les institutions, les officiels et les invités.",
      },
      {
        image: "/hero-jean-martial-2.webp",
        title: "Prise de parole",
        caption: "Une conduite claire pour chaque séquence importante.",
      },
      {
        image: "/portrait-jean-martial.webp",
        title: "Maîtrise du protocole",
        caption: "Une présence professionnelle qui sécurise le déroulé.",
      },
    ],
  },
  {
    number: "03",
    slug: "galas-evenements-entreprise",
    title: "Galas & événements d’entreprise",
    titleLines: ["Galas & événements", "d’entreprise"],
    description:
      "Une animation précise et vivante qui valorise vos invités, vos messages et chaque séquence de votre programme.",
    className: "event-card--gala",
    image: "/gala-evenement-entreprise.jpg",
    gallery: [
      {
        image: "/gala-evenement-entreprise.jpg",
        title: "Gala & prestige",
        caption: "Un rythme élégant pour installer l’énergie de la soirée.",
      },
      {
        image: "/ceremonie-institutionnelle.jpg",
        title: "Image de marque",
        caption: "Une animation qui valorise vos invités et vos messages clés.",
      },
      {
        image: "/hero-jean-martial-2.webp",
        title: "Scène & transitions",
        caption: "Des interventions nettes pour garder l’attention du public.",
      },
    ],
  },
  {
    number: "04",
    slug: "baptemes-anniversaires",
    title: "Baptêmes & Anniversaires",
    titleLines: ["Baptêmes &", "Anniversaires"],
    description:
      "Une ambiance chaleureuse, fluide et participative, pensée pour rassembler toutes les générations.",
    className: "event-card--celebration",
    image: "/bapteme-anniversaire.jpg",
    gallery: [
      {
        image: "/bapteme-anniversaire.jpg",
        title: "Ambiance familiale",
        caption: "Une animation chaleureuse, adaptée aux invités et aux générations.",
      },
      {
        image: "/mariage-dote.jpg",
        title: "Émotion partagée",
        caption: "Des moments rythmés sans perdre la douceur de l’événement.",
      },
      {
        image: "/portrait-jean-martial.webp",
        title: "Présence attentive",
        caption: "Un accompagnement fluide du début à la fin du programme.",
      },
    ],
  },
] as const;

export const serviceOptions = [
  ...prestations.map((prestation) => prestation.title),
  "Autre événement",
] as const;

export type Prestation = (typeof prestations)[number];
