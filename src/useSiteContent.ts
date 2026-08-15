import { useCallback, useEffect, useRef, useState } from "react";
import { getSiteContentDocRef } from "./firebaseClient";
import {
  defaultSiteContent,
  normalizeSiteContent,
  siteContentStorageKey,
  type SiteContent,
} from "./siteContent";

const contentChangedEvent = "jma-site-content-changed";

export type SiteContentUpdate =
  | SiteContent
  | ((currentContent: SiteContent) => SiteContent);

function loadContent() {
  if (typeof window === "undefined") return defaultSiteContent;

  try {
    return normalizeSiteContent(
      JSON.parse(window.localStorage.getItem(siteContentStorageKey) || "null"),
    );
  } catch {
    return defaultSiteContent;
  }
}

export function useSiteContent() {
  const [content, setContent] = useState<SiteContent>(() => loadContent());
  const [cloudStatus, setCloudStatus] = useState<"syncing" | "online" | "local">(
    "syncing",
  );
  const contentRef = useRef(content);
  const writeQueueRef = useRef<Promise<void>>(Promise.resolve());
  const pendingWritesRef = useRef(0);
  const preserveLocalContentRef = useRef(false);

  useEffect(() => {
    const syncContent = () => {
      const nextContent = loadContent();
      contentRef.current = nextContent;
      setContent(nextContent);
    };

    window.addEventListener("storage", syncContent);
    window.addEventListener(contentChangedEvent, syncContent);

    return () => {
      window.removeEventListener("storage", syncContent);
      window.removeEventListener(contentChangedEvent, syncContent);
    };
  }, []);

  useEffect(() => {
    let unsubscribe = () => undefined;
    let isMounted = true;

    async function subscribeToRemoteContent() {
      try {
        const { getDocFromServer, onSnapshot } = await import("firebase/firestore");
        const docRef = await getSiteContentDocRef();

        if (!isMounted) return;

        const applyRemoteContent = (remoteContent: unknown) => {
          if (
            !remoteContent ||
            pendingWritesRef.current > 0 ||
            preserveLocalContentRef.current
          ) {
            return;
          }

          const normalizedContent = normalizeSiteContent(remoteContent);
          window.localStorage.setItem(
            siteContentStorageKey,
            JSON.stringify(normalizedContent),
          );
          contentRef.current = normalizedContent;
          setContent(normalizedContent);
        };

        unsubscribe = onSnapshot(
          docRef,
          (snapshot) => {
            applyRemoteContent(snapshot.data()?.content);
            setCloudStatus(snapshot.metadata.fromCache ? "syncing" : "online");
          },
          () => setCloudStatus("local"),
        );

        const serverSnapshot = await getDocFromServer(docRef);
        if (isMounted) {
          applyRemoteContent(serverSnapshot.data()?.content);
          setCloudStatus("online");
        }
      } catch {
        setCloudStatus("local");
      }
    }

    subscribeToRemoteContent();

    return () => {
      isMounted = false;
      unsubscribe();
    };
  }, []);

  const saveContent = useCallback((update: SiteContentUpdate) => {
    const nextContent =
      typeof update === "function" ? update(contentRef.current) : update;
    const normalizedContent = normalizeSiteContent(nextContent);

    contentRef.current = normalizedContent;
    preserveLocalContentRef.current = true;
    pendingWritesRef.current += 1;
    window.localStorage.setItem(
      siteContentStorageKey,
      JSON.stringify(normalizedContent),
    );
    setContent(normalizedContent);
    window.dispatchEvent(new Event(contentChangedEvent));
    setCloudStatus("syncing");

    const queuedWrite = writeQueueRef.current
      .catch(() => undefined)
      .then(async () => {
        const { getDocFromServer, serverTimestamp, setDoc } = await import(
          "firebase/firestore"
        );
        const docRef = await getSiteContentDocRef();
        await setDoc(
          docRef,
          { content: normalizedContent, updatedAt: serverTimestamp() },
          { merge: true },
        );

        const confirmedSnapshot = await getDocFromServer(docRef);
        const confirmedContent = normalizeSiteContent(
          confirmedSnapshot.data()?.content,
        );

        if (JSON.stringify(confirmedContent) !== JSON.stringify(normalizedContent)) {
          throw new Error("La version en ligne ne correspond pas à la sauvegarde.");
        }
      });

    writeQueueRef.current = queuedWrite.catch(() => undefined);

    return queuedWrite.then(
      () => {
        pendingWritesRef.current = Math.max(0, pendingWritesRef.current - 1);
        if (pendingWritesRef.current === 0) {
          preserveLocalContentRef.current = false;
          setCloudStatus("online");
        }
      },
      (error) => {
        pendingWritesRef.current = Math.max(0, pendingWritesRef.current - 1);
        if (pendingWritesRef.current === 0) {
          setCloudStatus("local");
        }
        throw error;
      },
    );
  }, []);

  const resetContent = useCallback(() => {
    return saveContent(defaultSiteContent);
  }, [saveContent]);

  return { cloudStatus, content, saveContent, resetContent };
}
