import assert from "node:assert/strict";
import { readFile, readdir } from "node:fs/promises";
import test from "node:test";

test("builds the public Jean-Martial site", async () => {
  const html = await readFile(
    new URL("../dist/index.html", import.meta.url),
    "utf8",
  );
  const assets = await readdir(new URL("../dist/assets/", import.meta.url));

  assert.match(html, /<html lang="fr">/i);
  assert.match(html, /<title>Jean-Martial Azodjé \| Maître de cérémonie<\/title>/i);
  assert.match(html, /<div id="root"><\/div>/i);
  assert.ok(assets.some((file) => file.endsWith(".js")));
  assert.ok(assets.some((file) => file.endsWith(".css")));
});

test("connects prestation illustrations to the dashboard and public cards", async () => {
  const [app, dashboard, firebaseClient, storageRules] = await Promise.all([
    readFile(new URL("../src/App.tsx", import.meta.url), "utf8"),
    readFile(new URL("../src/Dashboard.tsx", import.meta.url), "utf8"),
    readFile(new URL("../src/firebaseClient.ts", import.meta.url), "utf8"),
    readFile(new URL("../storage.rules", import.meta.url), "utf8"),
  ]);

  assert.match(app, /className="prestation-illustration"/);
  assert.match(app, /src=\{prestation\.image\}/);
  assert.match(dashboard, /label="Illustration de la carte"/);
  assert.match(dashboard, /accept="image\/\*,\.heic,\.heif"/);
  assert.match(firebaseClient, /uploadDashboardImage/);
  assert.match(firebaseClient, /uploadBytes/);
  assert.match(firebaseClient, /contentType: "image\/jpeg"/);
  assert.match(firebaseClient, /site-images\/\$\{Date\.now\(\)\}/);
  assert.match(storageRules, /request\.resource\.contentType\.matches\('image\/\.\*'\)/);
});

test("gives each dashboard section its own route and exposes TikTok in the header", async () => {
  const [app, dashboard, header] = await Promise.all([
    readFile(new URL("../src/App.tsx", import.meta.url), "utf8"),
    readFile(new URL("../src/Dashboard.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/SiteHeader.tsx", import.meta.url), "utf8"),
  ]);

  assert.match(app, /path\.startsWith\("\/dashboard\/"\)/);
  assert.match(dashboard, /href="\/dashboard\/prestations"/);
  assert.match(dashboard, /href="\/dashboard\/formulaire"/);
  assert.match(dashboard, /data-dashboard-section=\{activeDashboardSection\}/);
  assert.match(header, /tiktok\.com\/@jeanmartialazodje/);
  assert.match(header, /aria-label="TikTok de Jean-Martial Azodjé"/);
});

test("keeps dashboard image replacements safe during concurrent edits", async () => {
  const [app, dashboard, contentHook, siteContent, serviceWorker, firebaseConfig] = await Promise.all([
    readFile(new URL("../src/App.tsx", import.meta.url), "utf8"),
    readFile(new URL("../src/Dashboard.tsx", import.meta.url), "utf8"),
    readFile(new URL("../src/useSiteContent.ts", import.meta.url), "utf8"),
    readFile(new URL("../src/siteContent.ts", import.meta.url), "utf8"),
    readFile(new URL("../public/sw.js", import.meta.url), "utf8"),
    readFile(new URL("../firebase.json", import.meta.url), "utf8"),
  ]);

  assert.match(contentHook, /writeQueueRef/);
  assert.match(contentHook, /typeof update === "function"/);
  assert.match(contentHook, /preserveLocalContentRef/);
  assert.match(contentHook, /getDocFromServer/);
  assert.match(contentHook, /version en ligne ne correspond pas/);
  assert.match(app, /function PublicSite/);
  assert.doesNotMatch(app, /export default function App\(\) \{\s+const \{ content \} = useSiteContent/);
  assert.match(siteContent, /1786761413395-whatsapp-image/);
  assert.match(serviceWorker, /jean-martial-v3/);
  assert.match(firebaseConfig, /"source": "\/sw\.js"/);
  assert.match(dashboard, /Remplacer l’image/);
  assert.match(dashboard, /L’image précédente est conservée/);
  assert.match(dashboard, /Supprimer cette image du site \?/);
  assert.match(dashboard, /updateGalleryItem\(activePrestation\.id, item\.id/);
  assert.match(dashboard, /pendingPreview/);
  assert.match(dashboard, /25 Mo maximum/);
});

test("uses the WhatsApp green for the mobile action", async () => {
  const css = await readFile(new URL("../app/globals.css", import.meta.url), "utf8");
  assert.match(css, /\.mobile-actions a:last-child\s*\{\s*background:\s*#25d366;/i);
});
