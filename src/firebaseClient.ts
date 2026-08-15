import { getApp, getApps, initializeApp } from "firebase/app";

const firebaseConfig = {
  apiKey: "AIzaSyBIYS6kCgbJwDatwu6w_wSdNT38BBuqA54",
  authDomain: "jmazodje.firebaseapp.com",
  projectId: "jmazodje",
  storageBucket: "jmazodje.firebasestorage.app",
  messagingSenderId: "124686923007",
  appId: "1:124686923007:web:39cbd8e4367815e7ef08ca",
  measurementId: "G-LM05CRD4KG",
};

export function getFirebaseApp() {
  return getApps().length ? getApp() : initializeApp(firebaseConfig);
}

export async function getSiteContentDocRef() {
  const { doc, getFirestore } = await import("firebase/firestore");
  return doc(getFirestore(getFirebaseApp()), "siteContent", "current");
}

export async function getDashboardAuth() {
  const { browserLocalPersistence, getAuth, setPersistence } = await import(
    "firebase/auth"
  );
  const auth = getAuth(getFirebaseApp());
  await setPersistence(auth, browserLocalPersistence);
  return auth;
}

export async function saveQuoteRequest(request: {
  name: string;
  phone: string;
  service: string;
  date: string;
  message: string;
}) {
  const { addDoc, collection, getFirestore, serverTimestamp } = await import(
    "firebase/firestore"
  );

  return addDoc(collection(getFirestore(getFirebaseApp()), "quoteRequests"), {
    ...request,
    status: "new",
    createdAt: serverTimestamp(),
  });
}

export async function uploadDashboardImage(imageBlob: Blob, originalName: string) {
  const { getDownloadURL, getStorage, ref, uploadBytes } = await import(
    "firebase/storage"
  );
  const safeBaseName =
    originalName
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/\.[^.]+$/, "")
      .replace(/[^a-zA-Z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .toLowerCase() || "image";
  const uniqueId = globalThis.crypto?.randomUUID?.() ?? `${Date.now()}-${Math.random()}`;
  const imageRef = ref(
    getStorage(getFirebaseApp()),
    `site-images/${Date.now()}-${uniqueId}-${safeBaseName}.jpg`,
  );

  await uploadBytes(imageRef, imageBlob, {
    contentType: "image/jpeg",
    cacheControl: "public,max-age=31536000,immutable",
  });
  return getDownloadURL(imageRef);
}
