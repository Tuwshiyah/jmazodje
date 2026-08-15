import { useEffect } from "react";
import { getAnalytics, isSupported } from "firebase/analytics";
import { getFirebaseApp } from "./firebaseClient";

export default function FirebaseServices() {
  useEffect(() => {
    const app = getFirebaseApp();

    isSupported()
      .then((supported) => {
        if (supported) getAnalytics(app);
      })
      .catch(() => undefined);

    if ("serviceWorker" in navigator) {
      if (import.meta.env.PROD) {
        navigator.serviceWorker.register("/sw.js").catch(() => undefined);
      } else {
        navigator.serviceWorker
          .getRegistrations()
          .then((registrations) =>
            registrations.forEach((registration) => registration.unregister()),
          )
          .catch(() => undefined);

        if ("caches" in window) {
          caches
            .keys()
            .then((keys) =>
              Promise.all(
                keys
                  .filter((key) => key.startsWith("jean-martial-"))
                  .map((key) => caches.delete(key)),
              ),
            )
            .catch(() => undefined);
        }
      }
    }
  }, []);

  return null;
}
