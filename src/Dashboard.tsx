import type { ChangeEvent, FormEvent, ReactNode } from "react";
import { useEffect, useMemo, useState } from "react";
import type { Auth, User } from "firebase/auth";
import {
  getDashboardAuth,
  getFirebaseApp,
  uploadDashboardImage,
} from "./firebaseClient";
import {
  createId,
  createSlug,
  defaultSiteContent,
  normalizeSiteContent,
  phoneHref,
  siteContentStorageKey,
  type EditablePrestation,
  type GalleryItem,
  type SiteContent,
} from "./siteContent";
import { useSiteContent } from "./useSiteContent";

type DashboardProps = {
  onBackHome?: () => void;
};

type DashboardSection =
  | "overview"
  | "requests"
  | "home"
  | "about"
  | "services"
  | "quote"
  | "contact"
  | "account"
  | "backup";

const dashboardSectionBySlug: Record<string, DashboardSection> = {
  demandes: "requests",
  accueil: "home",
  biographie: "about",
  prestations: "services",
  formulaire: "quote",
  contact: "contact",
  compte: "account",
  sauvegarde: "backup",
};

const getDashboardSection = (): DashboardSection => {
  const slug = window.location.pathname
    .replace(/^\/dashboard\/?/, "")
    .split("/")[0];

  return dashboardSectionBySlug[slug] ?? "overview";
};

const adminUid = "JD4zZi1Mb2P3ByJ8C3WVNiZi1Dh1";

type QuoteRequest = {
  id: string;
  name: string;
  phone: string;
  service: string;
  date: string;
  message: string;
  status: "new" | "processed";
  createdAt?: { toDate?: () => Date };
};

const formatRequestDate = (value?: QuoteRequest["createdAt"]) => {
  const date = value?.toDate?.();
  if (!date) return "À l’instant";

  return new Intl.DateTimeFormat("fr-FR", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
};

const resizeImageFile = async (file: File): Promise<Blob> => {
  const imageUrl = URL.createObjectURL(file);
  let image: HTMLImageElement;

  try {
    image = await new Promise<HTMLImageElement>((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = () => reject(new Error("Format d’image non pris en charge"));
      img.src = imageUrl;
    });
  } catch (error) {
    URL.revokeObjectURL(imageUrl);
    throw error;
  }

  const maxSide = 1800;
  const scale = Math.min(1, maxSide / Math.max(image.width, image.height));
  const canvas = document.createElement("canvas");
  canvas.width = Math.max(1, Math.round(image.width * scale));
  canvas.height = Math.max(1, Math.round(image.height * scale));
  const context = canvas.getContext("2d");

  if (!context) {
    URL.revokeObjectURL(imageUrl);
    throw new Error("Image non lisible");
  }

  context.drawImage(image, 0, 0, canvas.width, canvas.height);
  URL.revokeObjectURL(imageUrl);
  const resizedBlob = await new Promise<Blob | null>((resolve) =>
    canvas.toBlob(resolve, "image/jpeg", 0.86),
  );

  if (!resizedBlob) {
    throw new Error("L’image n’a pas pu être préparée");
  }

  return resizedBlob;
};

function Field({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) {
  return (
    <label className="dashboard-field">
      <span>{label}</span>
      {children}
    </label>
  );
}

function ImageField({
  label,
  image,
  onChange,
  onStatus,
}: {
  label: string;
  image: string;
  onChange: (image: string) => boolean | void | Promise<boolean | void>;
  onStatus?: (message: string) => void;
}) {
  const [isLoading, setIsLoading] = useState(false);
  const [fieldStatus, setFieldStatus] = useState("");
  const [pendingPreview, setPendingPreview] = useState("");

  const handleFile = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    let didUpdateContent = false;
    const acceptedExtension = /\.(jpe?g|png|webp|heic|heif)$/i.test(file.name);

    if (!file.type.startsWith("image/") && !acceptedExtension) {
      setFieldStatus("Choisissez une photo JPG, PNG, WebP ou HEIC.");
      onStatus?.("Ce fichier n’est pas une image valide.");
      event.target.value = "";
      return;
    }

    if (file.size > 25 * 1024 * 1024) {
      setFieldStatus("Cette photo dépasse la limite de 25 Mo.");
      onStatus?.("Cette image est trop lourde. La taille maximale autorisée est de 25 Mo.");
      event.target.value = "";
      return;
    }

    const localPreview = URL.createObjectURL(file);
    setPendingPreview(localPreview);
    setIsLoading(true);
    setFieldStatus("Préparation de la nouvelle image...");
    onStatus?.("Préparation et envoi de l’image...");
    try {
      const resizedImage = await resizeImageFile(file);
      setFieldStatus("Envoi de la photo vers le stockage sécurisé...");
      const uploadedImageUrl = await uploadDashboardImage(resizedImage, file.name);
      setFieldStatus("Sauvegarde de l’image dans la prestation...");
      didUpdateContent = true;
      const wasSaved = await onChange(uploadedImageUrl);
      if (wasSaved === false) {
        throw new Error("La référence de l’image n’a pas été sauvegardée.");
      }
      setFieldStatus(image ? "Image remplacée avec succès." : "Image ajoutée avec succès.");
      onStatus?.("Image envoyée et publiée avec succès.");
    } catch {
      if (didUpdateContent) {
        await onChange(image);
      }
      setFieldStatus("Échec de l’envoi. L’image précédente est conservée.");
      onStatus?.(
        "L’image n’a pas pu être envoyée. L’ancienne photo a été conservée. Réessayez dans quelques instants.",
      );
    } finally {
      URL.revokeObjectURL(localPreview);
      setPendingPreview("");
      setIsLoading(false);
      event.target.value = "";
    }
  };

  const removeImage = async () => {
    if (!image) return;
    if (!window.confirm("Supprimer cette image du site ?")) return;

    setIsLoading(true);
    setFieldStatus("Suppression de l’image...");
    const wasSaved = await onChange("");
    if (wasSaved === false) {
      await onChange(image);
      setFieldStatus("La suppression n’a pas pu être enregistrée.");
      onStatus?.("La suppression de l’image a échoué. L’image est conservée.");
    } else {
      setFieldStatus("Image supprimée.");
      onStatus?.("Image supprimée du site.");
    }
    setIsLoading(false);
  };

  return (
    <div className="dashboard-image-field">
      <span>{label}</span>
      <div className={`dashboard-image-field__preview${isLoading ? " is-loading" : ""}`}>
        {pendingPreview || image ? (
          <img src={pendingPreview || image} alt="Aperçu de l’image" />
        ) : (
          <small>Image à ajouter</small>
        )}
        {isLoading ? <b>Enregistrement…</b> : null}
      </div>
      <div className="dashboard-image-field__actions">
        <label>
          {isLoading
            ? "Enregistrement..."
            : image
              ? "Remplacer l’image"
              : "Ajouter une image"}
          <input
            type="file"
            accept="image/*,.heic,.heif"
            disabled={isLoading}
            onChange={handleFile}
          />
        </label>
        {image ? (
          <button type="button" disabled={isLoading} onClick={removeImage}>
            Supprimer l’image
          </button>
        ) : null}
      </div>
      {fieldStatus ? (
        <small className="dashboard-image-field__status" role="status">
          {fieldStatus}
        </small>
      ) : null}
      <small className="dashboard-image-field__help">
        JPG, PNG, WebP ou photo mobile · 25 Mo maximum
      </small>
    </div>
  );
}

export default function Dashboard({ onBackHome }: DashboardProps) {
  const { cloudStatus, content, saveContent, resetContent } = useSiteContent();
  const activeDashboardSection = getDashboardSection();
  const [activePrestationId, setActivePrestationId] = useState(
    content.prestations[0]?.id ?? "",
  );
  const [status, setStatus] = useState("Dashboard local prêt.");
  const [adminUser, setAdminUser] = useState<User | null>(null);
  const [auth, setAuth] = useState<Auth | null>(null);
  const [authReady, setAuthReady] = useState(false);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [loginError, setLoginError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loginForm, setLoginForm] = useState({ email: "", password: "" });
  const [quoteRequests, setQuoteRequests] = useState<QuoteRequest[]>([]);
  const [requestsLoading, setRequestsLoading] = useState(false);

  const activePrestation = useMemo(
    () =>
      content.prestations.find((prestation) => prestation.id === activePrestationId) ??
      content.prestations[0],
    [activePrestationId, content.prestations],
  );

  useEffect(() => {
    if (!activePrestation && content.prestations[0]) {
      setActivePrestationId(content.prestations[0].id);
    }
  }, [activePrestation, content.prestations]);

  useEffect(() => {
    let unsubscribe = () => undefined;

    async function connectAuth() {
      try {
        const { onAuthStateChanged } = await import("firebase/auth");
        const dashboardAuth = await getDashboardAuth();
        setAuth(dashboardAuth);
        unsubscribe = onAuthStateChanged(dashboardAuth, async (user) => {
          if (user && user.uid !== adminUid) {
            const { signOut } = await import("firebase/auth");
            await signOut(dashboardAuth);
            setLoginError("Ce compte n’est pas autorisé à accéder au dashboard.");
            setAdminUser(null);
            setAuthReady(true);
            return;
          }

          setAdminUser(user);
          setAuthReady(true);
        });
      } catch {
        setLoginError("Le service de connexion est momentanément indisponible.");
        setAuthReady(true);
      }
    }

    connectAuth();

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    let unsubscribe = () => undefined;

    if (!adminUser) {
      setQuoteRequests([]);
      setRequestsLoading(false);
      return unsubscribe;
    }

    setRequestsLoading(true);

    async function subscribeToQuoteRequests() {
      try {
        const { collection, getFirestore, onSnapshot, orderBy, query } =
          await import("firebase/firestore");
        const requestsQuery = query(
          collection(getFirestore(getFirebaseApp()), "quoteRequests"),
          orderBy("createdAt", "desc"),
        );

        unsubscribe = onSnapshot(
          requestsQuery,
          (snapshot) => {
            setQuoteRequests(
              snapshot.docs.map((requestDoc) => ({
                id: requestDoc.id,
                ...(requestDoc.data() as Omit<QuoteRequest, "id">),
              })),
            );
            setRequestsLoading(false);
          },
          () => {
            setRequestsLoading(false);
            setStatus("Impossible de charger les demandes. Vérifiez les règles Firebase.");
          },
        );
      } catch {
        setRequestsLoading(false);
        setStatus("Impossible de charger les demandes pour le moment.");
      }
    }

    subscribeToQuoteRequests();
    return () => unsubscribe();
  }, [adminUser]);

  const persist = (
    update: SiteContent | ((currentContent: SiteContent) => SiteContent),
    message = "Modifications enregistrées.",
  ) => {
    return saveContent(update).then(
      () => {
        setStatus(message);
        return true;
      },
      () => {
        setStatus("La sauvegarde a échoué. La dernière version reste affichée pour éviter toute perte.");
        return false;
      },
    );
  };

  const loginAdmin = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!auth) return;

    setIsLoggingIn(true);
    setLoginError("");

    try {
      const { signInWithEmailAndPassword } = await import("firebase/auth");
      await signInWithEmailAndPassword(
        auth,
        loginForm.email.trim().toLowerCase(),
        loginForm.password,
      );
      setStatus("Connexion admin réussie. Les modifications peuvent se synchroniser.");
    } catch {
      setLoginError("Email ou mot de passe incorrect. Veuillez réessayer.");
    } finally {
      setIsLoggingIn(false);
    }
  };

  const updateRequestStatus = async (
    requestId: string,
    nextStatus: QuoteRequest["status"],
  ) => {
    try {
      const { doc, getFirestore, serverTimestamp, updateDoc } = await import(
        "firebase/firestore"
      );
      await updateDoc(
        doc(getFirestore(getFirebaseApp()), "quoteRequests", requestId),
        { status: nextStatus, updatedAt: serverTimestamp() },
      );
      setStatus(nextStatus === "processed" ? "Demande marquée comme traitée." : "Demande rouverte.");
    } catch {
      setStatus("La demande n’a pas pu être mise à jour.");
    }
  };

  const deleteQuoteRequest = async (requestId: string) => {
    if (!window.confirm("Supprimer définitivement cette demande ?")) return;

    try {
      const { deleteDoc, doc, getFirestore } = await import("firebase/firestore");
      await deleteDoc(
        doc(getFirestore(getFirebaseApp()), "quoteRequests", requestId),
      );
      setStatus("Demande supprimée.");
    } catch {
      setStatus("La demande n’a pas pu être supprimée.");
    }
  };

  const updateHero = (field: keyof SiteContent["hero"], value: string) => {
    return persist((currentContent) => ({
      ...currentContent,
      hero: { ...currentContent.hero, [field]: value },
    }));
  };

  const updateAbout = (field: keyof SiteContent["about"], value: string) => {
    return persist((currentContent) => ({
      ...currentContent,
      about: { ...currentContent.about, [field]: value },
    }));
  };

  const updateQuote = (field: keyof SiteContent["quote"], value: string) => {
    return persist((currentContent) => ({
      ...currentContent,
      quote: { ...currentContent.quote, [field]: value },
    }));
  };

  const updateContact = (field: keyof SiteContent["contact"], value: string) => {
    return persist((currentContent) => ({
      ...currentContent,
      contact: { ...currentContent.contact, [field]: value },
    }));
  };

  const updateHeroPortrait = (id: string, patch: Partial<{ src: string; alt: string }>) => {
    return persist((currentContent) => ({
      ...currentContent,
      hero: {
        ...currentContent.hero,
        portraits: currentContent.hero.portraits.map((portrait) =>
          portrait.id === id ? { ...portrait, ...patch } : portrait,
        ),
      },
    }));
  };

  const addHeroPortrait = () => {
    return persist((currentContent) => ({
      ...currentContent,
      hero: {
        ...currentContent.hero,
        portraits: [
          ...currentContent.hero.portraits,
          { id: createId(), src: "", alt: "Photo de Jean-Martial Azodjé" },
        ],
      },
    }));
  };

  const deleteHeroPortrait = (id: string) => {
    if (!window.confirm("Supprimer définitivement cette photo du hero ?")) return;
    return persist((currentContent) => ({
      ...currentContent,
      hero: {
        ...currentContent.hero,
        portraits: currentContent.hero.portraits.filter((portrait) => portrait.id !== id),
      },
    }));
  };

  const updatePrestation = (id: string, patch: Partial<EditablePrestation>) => {
    return persist((currentContent) => ({
      ...currentContent,
      prestations: currentContent.prestations.map((prestation) =>
        prestation.id === id ? { ...prestation, ...patch } : prestation,
      ),
    }));
  };

  const addPrestation = () => {
    const id = createId();
    const title = "Nouvelle prestation";
    const newPrestation: EditablePrestation = {
      id,
      number: String(content.prestations.length + 1).padStart(2, "0"),
      slug: `${createSlug(title)}-${Date.now().toString().slice(-4)}`,
      title,
      titleLines: ["Nouvelle", "prestation"],
      description: "Décrivez ici cette prestation.",
      className: "event-card--wedding",
      image: "",
      gallery: [],
    };

    persist((currentContent) => ({
      ...currentContent,
      prestations: [...currentContent.prestations, newPrestation],
    }));
    setActivePrestationId(id);
  };

  const deletePrestation = (id: string) => {
    if (!window.confirm("Supprimer définitivement cette prestation et toutes ses images ?")) return;
    const nextPrestations = content.prestations.filter(
      (prestation) => prestation.id !== id,
    );

    persist((currentContent) => ({
      ...currentContent,
      prestations: currentContent.prestations.filter(
        (prestation) => prestation.id !== id,
      ),
    }));
    setActivePrestationId(nextPrestations[0]?.id ?? "");
  };

  const addGalleryItem = (prestationId: string) => {
    const item: GalleryItem = {
      id: createId(),
      image: "",
      title: "Nouvelle image",
      caption: "Ajoutez une courte description.",
    };

    return persist((currentContent) => ({
      ...currentContent,
      prestations: currentContent.prestations.map((prestation) =>
        prestation.id === prestationId
          ? { ...prestation, gallery: [...prestation.gallery, item] }
          : prestation,
      ),
    }));
  };

  const updateGalleryItem = (
    prestationId: string,
    itemId: string,
    patch: Partial<GalleryItem>,
  ) => {
    return persist((currentContent) => ({
      ...currentContent,
      prestations: currentContent.prestations.map((prestation) =>
        prestation.id === prestationId
          ? {
              ...prestation,
              gallery: prestation.gallery.map((item) =>
                item.id === itemId ? { ...item, ...patch } : item,
              ),
            }
          : prestation,
      ),
    }));
  };

  const deleteGalleryItem = (prestationId: string, itemId: string) => {
    if (!window.confirm("Supprimer définitivement cette image et sa description ?")) return;
    return persist((currentContent) => ({
      ...currentContent,
      prestations: currentContent.prestations.map((prestation) =>
        prestation.id === prestationId
          ? {
              ...prestation,
              gallery: prestation.gallery.filter((item) => item.id !== itemId),
            }
          : prestation,
      ),
    }));
  };

  const exportContent = () => {
    const blob = new Blob([JSON.stringify(content, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "jean-martial-site-content.json";
    link.click();
    URL.revokeObjectURL(url);
    setStatus("Export JSON généré.");
  };

  const importContent = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const text = await file.text();
    persist(normalizeSiteContent(JSON.parse(text)), "Contenu importé.");
    event.target.value = "";
  };

  if (!authReady) {
    return (
      <main className="dashboard-auth-page">
        <section className="dashboard-auth-card dashboard-auth-card--loading">
          <span className="dashboard-auth-monogram">JM</span>
          <p>Vérification de la session...</p>
        </section>
      </main>
    );
  }

  if (!adminUser) {
    return (
      <main className="dashboard-auth-page">
        <a className="dashboard-auth-back" href="/" onClick={onBackHome}>
          ← Retour au site
        </a>
        <section className="dashboard-auth-card">
          <div className="dashboard-auth-heading">
            <span className="dashboard-auth-monogram">JM</span>
            <p>Espace privé</p>
            <h1>Connexion au dashboard</h1>
            <span>
              Identifiez-vous pour gérer le contenu et publier vos modifications en direct.
            </span>
          </div>

          <form className="dashboard-auth-form" onSubmit={loginAdmin}>
            <Field label="Adresse email">
              <input
                type="email"
                autoComplete="username"
                value={loginForm.email}
                onChange={(event) =>
                  setLoginForm((current) => ({
                    ...current,
                    email: event.target.value,
                  }))
                }
                placeholder="votre@email.com"
                required
              />
            </Field>
            <Field label="Mot de passe">
              <div className="dashboard-password-field">
                <input
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  value={loginForm.password}
                  onChange={(event) =>
                    setLoginForm((current) => ({
                      ...current,
                      password: event.target.value,
                    }))
                  }
                  placeholder="Votre mot de passe"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((current) => !current)}
                  aria-label={showPassword ? "Masquer le mot de passe" : "Afficher le mot de passe"}
                >
                  {showPassword ? "Masquer" : "Afficher"}
                </button>
              </div>
            </Field>
            {loginError ? (
              <p className="dashboard-auth-error" role="alert">{loginError}</p>
            ) : null}
            <button
              className="dashboard-auth-submit"
              type="submit"
              disabled={isLoggingIn || !auth}
            >
              {isLoggingIn ? "Connexion..." : "Se connecter"}
            </button>
          </form>

          <p className="dashboard-auth-note">
            Accès réservé à l’administrateur du site Jean-Martial Azodjé.
          </p>
        </section>
      </main>
    );
  }

  return (
    <main className="dashboard-page" data-dashboard-section={activeDashboardSection}>
      <header className="dashboard-header">
        <div className="dashboard-header__brand">
          <span className="dashboard-header__monogram">JM</span>
          <div>
            <p>Administration du site</p>
            <h1>Tableau de bord</h1>
            <span className="dashboard-header__subtitle">
              Gérez les pages, les prestations et les informations publiques.
            </span>
          </div>
        </div>
        <nav>
          <a href="/" onClick={onBackHome}>
            Voir le site
          </a>
          <button type="button" onClick={exportContent}>
            Exporter
          </button>
          <label>
            Importer
            <input type="file" accept="application/json" onChange={importContent} />
          </label>
          <button
            type="button"
            className="dashboard-danger"
            onClick={() => {
              resetContent();
              setStatus("Contenu réinitialisé.");
            }}
          >
            Réinitialiser
          </button>
        </nav>
      </header>

      <div className="dashboard-statusbar" role="status">
        <p>{status}</p>
        <span className={cloudStatus === "online" ? "is-online" : "is-local"}>
          <i aria-hidden="true" />
          {cloudStatus === "online" ? "Firebase connecté" : "Mode local"}
        </span>
      </div>

      <section className="dashboard-overview" aria-labelledby="dashboard-overview-title">
        <div className="dashboard-overview__intro">
          <p>Vue d’ensemble</p>
          <h2 id="dashboard-overview-title">Les pages de votre site</h2>
          <span>Sélectionnez une page pour accéder directement à son contenu.</span>
        </div>
        <div className="dashboard-page-cards">
          <a href="/dashboard/accueil" className="dashboard-page-card">
            <span className="dashboard-page-card__number">01</span>
            <div>
              <strong>Page d’accueil</strong>
              <small>Hero · Prestations · Formulaire · Contact</small>
            </div>
            <b aria-hidden="true">→</b>
          </a>
          <a href="/dashboard/biographie" className="dashboard-page-card">
            <span className="dashboard-page-card__number">02</span>
            <div>
              <strong>Ma biographie</strong>
              <small>Présentation, parcours et signature</small>
            </div>
            <b aria-hidden="true">→</b>
          </a>
          <a href="/dashboard/prestations" className="dashboard-page-card">
            <span className="dashboard-page-card__number">03</span>
            <div>
              <strong>Pages prestations</strong>
              <small>{content.prestations.length} galeries à gérer</small>
            </div>
            <b aria-hidden="true">→</b>
          </a>
        </div>
      </section>

      <section className="dashboard-layout">
        <aside className="dashboard-sidebar">
          <div className="dashboard-sidebar__group">
            <p>Activité</p>
            <a className={activeDashboardSection === "requests" ? "is-active" : ""} href="/dashboard/demandes"><span>{String(quoteRequests.filter((request) => request.status === "new").length).padStart(2, "0")}</span><b>Demandes reçues</b></a>
          </div>
          <div className="dashboard-sidebar__group">
            <p>Pages du site</p>
            <a className={activeDashboardSection === "home" ? "is-active" : ""} href="/dashboard/accueil"><span>01</span><b>Accueil</b></a>
            <a className={activeDashboardSection === "about" ? "is-active" : ""} href="/dashboard/biographie"><span>02</span><b>Biographie</b></a>
            <a className={activeDashboardSection === "services" ? "is-active" : ""} href="/dashboard/prestations"><span>03</span><b>Prestations</b></a>
          </div>
          <div className="dashboard-sidebar__group">
            <p>Sections de l’accueil</p>
            <a className={activeDashboardSection === "quote" ? "is-active" : ""} href="/dashboard/formulaire"><span>04</span><b>Formulaire</b></a>
            <a className={activeDashboardSection === "contact" ? "is-active" : ""} href="/dashboard/contact"><span>05</span><b>Contact</b></a>
          </div>
          <div className="dashboard-sidebar__group">
            <p>Réglages</p>
            <a className={activeDashboardSection === "account" ? "is-active" : ""} href="/dashboard/compte"><span>06</span><b>Connexion</b></a>
            <a className={activeDashboardSection === "backup" ? "is-active" : ""} href="/dashboard/sauvegarde"><span>07</span><b>Sauvegarde</b></a>
          </div>
        </aside>

        <div className="dashboard-panels">
          <section className="dashboard-panel dashboard-panel--inbox dashboard-section-panel dashboard-section-panel--requests" id="demandes">
            <div className="dashboard-panel__title">
              <div>
                <p>Activité · Formulaire de tarifs</p>
                <h2>Demandes reçues</h2>
                <span>Retrouvez ici les informations envoyées depuis le formulaire du site.</span>
              </div>
              <span className="dashboard-request-count">
                {quoteRequests.filter((request) => request.status === "new").length} nouvelle(s)
              </span>
            </div>

            {!adminUser ? (
              <div className="dashboard-inbox-empty">
                <strong>Connectez le compte administrateur</strong>
                <p>La liste des demandes est protégée. Utilisez la section « Compte administrateur » en bas du dashboard.</p>
                <a href="/dashboard/compte">Aller à la connexion →</a>
              </div>
            ) : requestsLoading ? (
              <p className="dashboard-empty">Chargement des demandes...</p>
            ) : quoteRequests.length === 0 ? (
              <div className="dashboard-inbox-empty">
                <strong>Aucune demande reçue</strong>
                <p>Les prochains formulaires envoyés apparaîtront automatiquement ici.</p>
              </div>
            ) : (
              <div className="dashboard-requests-list">
                {quoteRequests.map((request) => (
                  <article
                    className={`dashboard-request-card${request.status === "processed" ? " is-processed" : ""}`}
                    key={request.id}
                  >
                    <header>
                      <span>{request.status === "processed" ? "Traitée" : "Nouvelle demande"}</span>
                      <time>{formatRequestDate(request.createdAt)}</time>
                    </header>
                    <div className="dashboard-request-card__body">
                      <div className="dashboard-request-card__identity">
                        <h3>{request.name}</h3>
                        <a href={phoneHref(request.phone)}>{request.phone}</a>
                      </div>
                      <dl>
                        <div><dt>Prestation</dt><dd>{request.service}</dd></div>
                        <div><dt>Date prévue</dt><dd>{request.date || "Non précisée"}</dd></div>
                      </dl>
                      {request.message ? <p>{request.message}</p> : <p className="is-empty">Aucun message complémentaire.</p>}
                    </div>
                    <footer>
                      <a className="dashboard-request-action" href={phoneHref(request.phone)}>Appeler</a>
                      <button
                        type="button"
                        className="dashboard-request-action"
                        onClick={() => updateRequestStatus(request.id, request.status === "processed" ? "new" : "processed")}
                      >
                        {request.status === "processed" ? "Rouvrir" : "Marquer comme traitée"}
                      </button>
                      <button
                        type="button"
                        className="dashboard-request-action dashboard-danger-text"
                        onClick={() => deleteQuoteRequest(request.id)}
                      >
                        Supprimer
                      </button>
                    </footer>
                  </article>
                ))}
              </div>
            )}
          </section>

          <section className="dashboard-panel dashboard-section-panel dashboard-section-panel--home" id="hero">
            <div className="dashboard-panel__title">
              <div>
                <p>Page d’accueil · Section 01</p>
                <h2>En-tête principal</h2>
                <span>Modifiez les textes et les photos visibles dès l’ouverture du site.</span>
              </div>
              <a href="/#accueil" target="_blank" rel="noreferrer">Aperçu ↗</a>
            </div>
            <div className="dashboard-grid dashboard-grid--two">
              <Field label="Petit titre">
                <input
                  value={content.hero.eyebrow}
                  onChange={(event) => updateHero("eyebrow", event.target.value)}
                />
              </Field>
              <Field label="Texte du badge photo">
                <input
                  value={content.hero.portraitBadgeLabel}
                  onChange={(event) =>
                    updateHero("portraitBadgeLabel", event.target.value)
                  }
                />
              </Field>
              <Field label="Titre du badge photo">
                <input
                  value={content.hero.portraitBadgeTitle}
                  onChange={(event) =>
                    updateHero("portraitBadgeTitle", event.target.value)
                  }
                />
              </Field>
              <Field label="Texte du lien biographie">
                <input
                  value={content.hero.ctaLabel}
                  onChange={(event) => updateHero("ctaLabel", event.target.value)}
                />
              </Field>
            </div>
            <Field label="Description du hero">
              <textarea
                rows={3}
                value={content.hero.intro}
                onChange={(event) => updateHero("intro", event.target.value)}
              />
            </Field>
            <div className="dashboard-image-list">
              {content.hero.portraits.map((portrait) => (
                <div
                  className="dashboard-nested-card dashboard-hero-photo-card"
                  key={portrait.id}
                >
                  <ImageField
                    label="Photo du hero"
                    image={portrait.src}
                    onStatus={setStatus}
                    onChange={(image) => updateHeroPortrait(portrait.id, { src: image })}
                  />
                  <Field label="Texte alternatif">
                    <input
                      value={portrait.alt}
                      onChange={(event) =>
                        updateHeroPortrait(portrait.id, { alt: event.target.value })
                      }
                    />
                  </Field>
                  <button
                    type="button"
                    className="dashboard-text-button"
                    onClick={() => deleteHeroPortrait(portrait.id)}
                  >
                    Supprimer cette photo
                  </button>
                </div>
              ))}
            </div>
            <button type="button" className="dashboard-add" onClick={addHeroPortrait}>
              Ajouter une photo au hero
            </button>
          </section>

          <section className="dashboard-panel dashboard-section-panel dashboard-section-panel--about" id="bio">
            <div className="dashboard-panel__title">
              <div>
                <p>Page indépendante · Page 02</p>
                <h2>Ma biographie</h2>
                <span>Présentez le parcours, l’expérience et la signature de Jean-Martial.</span>
              </div>
              <a href="/a-propos" target="_blank" rel="noreferrer">Aperçu ↗</a>
            </div>
            <div className="dashboard-grid dashboard-grid--three">
              <Field label="Titre ligne 1">
                <input
                  value={content.about.titleLine1}
                  onChange={(event) => updateAbout("titleLine1", event.target.value)}
                />
              </Field>
              <Field label="Titre ligne 2">
                <input
                  value={content.about.titleLine2}
                  onChange={(event) => updateAbout("titleLine2", event.target.value)}
                />
              </Field>
              <Field label="Mot en couleur">
                <input
                  value={content.about.titleEmphasis}
                  onChange={(event) =>
                    updateAbout("titleEmphasis", event.target.value)
                  }
                />
              </Field>
            </div>
            <Field label="Introduction">
              <textarea
                rows={2}
                value={content.about.lead}
                onChange={(event) => updateAbout("lead", event.target.value)}
              />
            </Field>
            <Field label="Paragraphe diplôme / expérience">
              <textarea
                rows={3}
                value={content.about.education}
                onChange={(event) => updateAbout("education", event.target.value)}
              />
            </Field>
            <Field label="Paragraphe reconnaissance">
              <textarea
                rows={3}
                value={content.about.recognition}
                onChange={(event) => updateAbout("recognition", event.target.value)}
              />
            </Field>
            <Field label="Signature">
              <textarea
                rows={2}
                value={content.about.signature}
                onChange={(event) => updateAbout("signature", event.target.value)}
              />
            </Field>
          </section>

          <section className="dashboard-panel dashboard-section-panel dashboard-section-panel--services" id="prestations-admin">
            <div className="dashboard-panel__title dashboard-panel__title--row">
              <div>
                <p>Accueil et pages dédiées · Page 03</p>
                <h2>Mes prestations</h2>
                <span>Gérez les cartes de l’accueil et la galerie de chaque prestation.</span>
              </div>
              <button type="button" className="dashboard-add" onClick={addPrestation}>
                Ajouter une prestation
              </button>
            </div>

            <div className="dashboard-prestation-layout">
              <div className="dashboard-prestation-list">
                {content.prestations.map((prestation) => (
                  <button
                    type="button"
                    className={
                      prestation.id === activePrestation?.id ? "is-active" : ""
                    }
                    key={prestation.id}
                    onClick={() => setActivePrestationId(prestation.id)}
                  >
                    <span>{prestation.number}</span>
                    {prestation.title}
                  </button>
                ))}
              </div>

              {activePrestation ? (
                <div className="dashboard-prestation-editor">
                  <div className="dashboard-prestation-main-card">
                    <div className="dashboard-prestation-main-fields">
                      <div className="dashboard-grid dashboard-grid--two">
                        <Field label="Titre">
                          <input
                            value={activePrestation.title}
                            onChange={(event) =>
                              updatePrestation(activePrestation.id, {
                                title: event.target.value,
                              })
                            }
                          />
                        </Field>
                        <Field label="Lien de la page">
                          <input
                            value={activePrestation.slug}
                            onChange={(event) =>
                              updatePrestation(activePrestation.id, {
                                slug: createSlug(event.target.value),
                              })
                            }
                          />
                        </Field>
                      </div>
                      <Field label="Titre en cartes, une ligne par ligne">
                        <textarea
                          rows={2}
                          value={activePrestation.titleLines.join("\n")}
                          onChange={(event) =>
                            updatePrestation(activePrestation.id, {
                              titleLines: event.target.value
                                .split("\n")
                                .map((line) => line.trim())
                                .filter(Boolean),
                            })
                          }
                        />
                      </Field>
                      <Field label="Description">
                        <textarea
                          rows={3}
                          value={activePrestation.description}
                          onChange={(event) =>
                            updatePrestation(activePrestation.id, {
                              description: event.target.value,
                            })
                          }
                        />
                      </Field>
                    </div>
                    <ImageField
                      label="Illustration de la carte"
                      image={activePrestation.image}
                      onStatus={setStatus}
                      onChange={(image) =>
                        updatePrestation(activePrestation.id, { image })
                      }
                    />
                  </div>

                  <div className="dashboard-gallery-head">
                    <h3>Galerie de cette prestation</h3>
                    <button
                      type="button"
                      className="dashboard-add"
                      onClick={() => addGalleryItem(activePrestation.id)}
                    >
                      Ajouter une image
                    </button>
                  </div>
                  <div className="dashboard-gallery-list">
                    {activePrestation.gallery.map((item) => (
                      <div
                        className="dashboard-nested-card dashboard-gallery-edit-card"
                        key={item.id}
                      >
                        <ImageField
                          label="Image"
                          image={item.image}
                          onStatus={setStatus}
                          onChange={(image) =>
                            updateGalleryItem(activePrestation.id, item.id, { image })
                          }
                        />
                        <div className="dashboard-gallery-edit-fields">
                          <Field label="Titre">
                            <input
                              value={item.title}
                              onChange={(event) =>
                                updateGalleryItem(activePrestation.id, item.id, {
                                  title: event.target.value,
                                })
                              }
                            />
                          </Field>
                          <Field label="Description">
                            <textarea
                              rows={3}
                              value={item.caption}
                              onChange={(event) =>
                                updateGalleryItem(activePrestation.id, item.id, {
                                  caption: event.target.value,
                                })
                              }
                            />
                          </Field>
                          <button
                            type="button"
                            className="dashboard-text-button dashboard-danger-text"
                            onClick={() =>
                              deleteGalleryItem(activePrestation.id, item.id)
                            }
                          >
                            Supprimer cette image
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                  <button
                    type="button"
                    className="dashboard-danger dashboard-delete-prestation"
                    onClick={() => deletePrestation(activePrestation.id)}
                  >
                    Supprimer cette prestation
                  </button>
                </div>
              ) : (
                <p className="dashboard-empty">Aucune prestation pour l’instant.</p>
              )}
            </div>
          </section>

          <section className="dashboard-panel dashboard-section-panel dashboard-section-panel--quote" id="formulaire">
            <div className="dashboard-panel__title">
              <div>
                <p>Page d’accueil · Section 04</p>
                <h2>Formulaire de demande</h2>
                <span>Personnalisez la présentation du formulaire de devis.</span>
              </div>
              <a href="/#tarifs" target="_blank" rel="noreferrer">Aperçu ↗</a>
            </div>
            <div className="dashboard-grid dashboard-grid--three">
              <Field label="Nom de section">
                <input
                  value={content.quote.eyebrow}
                  onChange={(event) => updateQuote("eyebrow", event.target.value)}
                />
              </Field>
              <Field label="Titre ligne 1">
                <input
                  value={content.quote.titleLine1}
                  onChange={(event) => updateQuote("titleLine1", event.target.value)}
                />
              </Field>
              <Field label="Titre ligne 2">
                <input
                  value={content.quote.titleLine2}
                  onChange={(event) => updateQuote("titleLine2", event.target.value)}
                />
              </Field>
              <Field label="Mot en couleur">
                <input
                  value={content.quote.titleEmphasis}
                  onChange={(event) =>
                    updateQuote("titleEmphasis", event.target.value)
                  }
                />
              </Field>
              <Field label="Bouton">
                <input
                  value={content.quote.buttonLabel}
                  onChange={(event) => updateQuote("buttonLabel", event.target.value)}
                />
              </Field>
            </div>
            <Field label="Note">
              <textarea
                rows={3}
                value={content.quote.note}
                onChange={(event) => updateQuote("note", event.target.value)}
              />
            </Field>
          </section>

          <section className="dashboard-panel dashboard-section-panel dashboard-section-panel--contact" id="contact-admin">
            <div className="dashboard-panel__title">
              <div>
                <p>Page d’accueil · Section 05</p>
                <h2>Contact</h2>
                <span>Modifiez les numéros, le message WhatsApp et le texte final.</span>
              </div>
              <a href="/#contact" target="_blank" rel="noreferrer">Aperçu ↗</a>
            </div>
            <div className="dashboard-grid dashboard-grid--two">
              <Field label="Nom de section">
                <input
                  value={content.contact.eyebrow}
                  onChange={(event) => updateContact("eyebrow", event.target.value)}
                />
              </Field>
              <Field label="Téléphone principal">
                <input
                  value={content.contact.primaryPhone}
                  onChange={(event) =>
                    updateContact("primaryPhone", event.target.value)
                  }
                />
              </Field>
              <Field label="Téléphone secondaire">
                <input
                  value={content.contact.secondaryPhone}
                  onChange={(event) =>
                    updateContact("secondaryPhone", event.target.value)
                  }
                />
              </Field>
              <Field label="Message WhatsApp">
                <input
                  value={content.contact.whatsappMessage}
                  onChange={(event) =>
                    updateContact("whatsappMessage", event.target.value)
                  }
                />
              </Field>
            </div>
            <div className="dashboard-grid dashboard-grid--three">
              <Field label="Titre ligne 1">
                <input
                  value={content.contact.titleLine1}
                  onChange={(event) =>
                    updateContact("titleLine1", event.target.value)
                  }
                />
              </Field>
              <Field label="Titre ligne 2">
                <input
                  value={content.contact.titleLine2}
                  onChange={(event) =>
                    updateContact("titleLine2", event.target.value)
                  }
                />
              </Field>
              <Field label="Mot en couleur">
                <input
                  value={content.contact.titleEmphasis}
                  onChange={(event) =>
                    updateContact("titleEmphasis", event.target.value)
                  }
                />
              </Field>
            </div>
            <Field label="Texte de contact">
              <textarea
                rows={3}
                value={content.contact.copy}
                onChange={(event) => updateContact("copy", event.target.value)}
              />
            </Field>
          </section>

          <section className="dashboard-panel dashboard-panel--settings dashboard-section-panel dashboard-section-panel--account" id="admin">
            <div className="dashboard-panel__title">
              <div>
                <p>Réglages · Connexion</p>
                <h2>Compte administrateur</h2>
                <span>
                  Votre session protège l’accès et autorise la synchronisation Firebase.
                </span>
              </div>
            </div>
            <div className="dashboard-admin-session">
              <div>
                <small>Session active</small>
                <p>{adminUser.email}</p>
              </div>
              <button
                type="button"
                className="dashboard-add"
                onClick={async () => {
                  if (!auth) return;
                  const { signOut } = await import("firebase/auth");
                  await signOut(auth);
                  setStatus("Déconnecté.");
                }}
              >
                Se déconnecter
              </button>
            </div>
          </section>

          <section className="dashboard-panel dashboard-panel--quiet dashboard-section-panel dashboard-section-panel--backup" id="sauvegarde">
            <div className="dashboard-panel__title">
              <div>
                <p>Réglages · Sauvegarde</p>
                <h2>Sauvegarde du contenu</h2>
                <span>Les modifications sont synchronisées avec le site public.</span>
              </div>
            </div>
            <p>
              Les contenus sont sauvegardés dans Firebase et apparaissent
              automatiquement sur le site dès leur modification.
            </p>
            <code>{siteContentStorageKey}</code>
            <button
              type="button"
              className="dashboard-text-button"
              onClick={() => persist(defaultSiteContent, "Contenu par défaut restauré.")}
            >
              Restaurer le contenu par défaut
            </button>
          </section>
        </div>
      </section>
    </main>
  );
}
