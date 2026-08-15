import type { Metadata } from "next";
import { Cormorant_Garamond, Manrope } from "next/font/google";
import { headers } from "next/headers";
import "./globals.css";

const display = Cormorant_Garamond({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const sans = Manrope({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export async function generateMetadata(): Promise<Metadata> {
  const requestHeaders = await headers();
  const host = requestHeaders.get("x-forwarded-host") ?? requestHeaders.get("host");
  const protocol =
    requestHeaders.get("x-forwarded-proto") ??
    (host?.includes("localhost") ? "http" : "https");
  const baseUrl = new URL(`${protocol}://${host ?? "localhost:3000"}`);
  const socialImage = new URL("/site-primary-photo.jpg", baseUrl).toString();

  return {
    metadataBase: baseUrl,
    title: "Jean-Martial Azodjé | Maître de cérémonie",
    description:
      "Journaliste, présentateur TV et maître de cérémonie à Abidjan. Mariages, cérémonies officielles, galas, conférences et événements d’entreprise.",
    keywords: [
      "maître de cérémonie Abidjan",
      "animateur événementiel Côte d’Ivoire",
      "présentateur TV",
      "animateur mariage",
      "Jean-Martial Azodjé",
    ],
    icons: {
      icon: [{ url: "/site-icon-192.png", sizes: "192x192", type: "image/png" }],
      apple: [{ url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" }],
    },
    openGraph: {
      title: "Jean-Martial Azodjé | La voix de vos grands moments",
      description:
        "Maître de cérémonie, journaliste et présentateur TV à Abidjan.",
      type: "website",
      locale: "fr_CI",
      images: [{ url: socialImage, width: 1200, height: 630 }],
    },
    twitter: {
      card: "summary_large_image",
      title: "Jean-Martial Azodjé | Maître de cérémonie",
      description: "Donner du sens, du rythme et de l’émotion à chaque événement.",
      images: [socialImage],
    },
  };
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <body className={`${display.variable} ${sans.variable}`}>
        {children}
      </body>
    </html>
  );
}
