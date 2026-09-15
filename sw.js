/* Offline-Speicher: App-Huelle zwischenlagern, Daten immer live holen. */
const CACHE = "ebuxi-v4";
const HUELLE = ["./", "./index.html", "./manifest.webmanifest", "./icon.svg", "./icon-180.png"];

self.addEventListener("install", e=>{
  // cache:"reload" umgeht den Browser-Zwischenspeicher, sonst landet eine veraltete Fassung im Offline-Speicher
  e.waitUntil(caches.open(CACHE)
    .then(c=>c.addAll(HUELLE.map(u=> new Request(u, {cache:"reload"}))))
    .then(()=>self.skipWaiting()));
});
self.addEventListener("activate", e=>{
  e.waitUntil(caches.keys()
    .then(k=>Promise.all(k.filter(n=>n!==CACHE).map(n=>caches.delete(n))))
    .then(()=>self.clients.claim()));
});
self.addEventListener("fetch", e=>{
  const u = new URL(e.request.url);
  if(e.request.method!=="GET" || u.origin!==location.origin) return;   // GitHub-API nie abfangen
  // GitHub Pages erlaubt 10 Minuten Zwischenspeicher. "no-cache" fragt trotzdem jedes Mal
  // beim Server nach, ob es eine neuere Fassung gibt; unveraenderte Dateien kosten nur eine kurze Rueckfrage.
  e.respondWith(
    fetch(u.href, {cache:"no-cache", credentials:"same-origin"})
      .then(a=>{
        if(a && a.ok) { const kopie = a.clone(); caches.open(CACHE).then(c=>c.put(e.request, kopie)); }
        return a;
      })
      .catch(()=> caches.match(e.request).then(t=> t || caches.match("./index.html")))
  );
});
