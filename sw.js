// Offline-Nutzung: Seite, Akten und Texte werden auf dem Gerät gespeichert.
// Ist das Netz da, kommt immer die neueste Fassung. Ohne Netz kommt die gespeicherte.
const CACHE = 'medic-handbuch-v1';
const DATEIEN = ['./', './index.html', './akten.json', './inhalt.json', './manifest.json', './icon-180.png', './icon-192.png', './icon-512.png'];

self.addEventListener('install', e => {
  e.waitUntil((async () => {
    const cache = await caches.open(CACHE);
    // Eine fehlende Datei soll die übrigen nicht blockieren
    await Promise.all(DATEIEN.map(f => cache.add(f).catch(() => {})));
    await self.skipWaiting();
  })());
});

self.addEventListener('activate', e => {
  e.waitUntil((async () => {
    for (const k of await caches.keys()) if (k !== CACHE) await caches.delete(k);
    await self.clients.claim();
  })());
});

self.addEventListener('fetch', e => {
  const url = new URL(e.request.url);
  if (e.request.method !== 'GET' || url.origin !== self.location.origin) return;
  e.respondWith((async () => {
    try {
      const antwort = await fetch(e.request);
      if (antwort.ok) (await caches.open(CACHE)).put(e.request, antwort.clone());
      return antwort;
    } catch (fehler) {
      const gespeichert = await caches.match(e.request, {ignoreSearch: true});
      if (gespeichert) return gespeichert;
      if (e.request.mode === 'navigate') return caches.match('./index.html');
      throw fehler;
    }
  })());
});
