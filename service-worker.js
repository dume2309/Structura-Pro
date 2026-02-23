// STRUCTURA PRO — Service Worker (PWA offline)
// Incrémentez CACHE_VERSION pour forcer la mise à jour du cache
const CACHE_VERSION = 'structura-pro-v3.0';

const ASSETS_TO_CACHE = [
  './',
  './index.html',
  './manifest.json',
  './logo.png',
  './icons/icon-192.png',
  './icons/icon-512.png',
  './images/axes.JPG',
  // Poutres ptr1–18
  './images/poutres/ptr1.png',
  './images/poutres/ptr2.png',
  './images/poutres/ptr3.png',
  './images/poutres/ptr4.png',
  './images/poutres/ptr5.png',
  './images/poutres/ptr6.png',
  './images/poutres/ptr7.png',
  './images/poutres/ptr8.png',
  './images/poutres/ptr9.png',
  './images/poutres/ptr10.png',
  './images/poutres/ptr11.png',
  './images/poutres/ptr12.png',
  './images/poutres/ptr13.png',
  './images/poutres/ptr14.png',
  './images/poutres/ptr15.png',
  './images/poutres/ptr16.png',
  './images/poutres/ptr17.png',
  './images/poutres/ptr18.png',
  // Sections
  './images/sections/Sections%20avec%20Noms/Barre%20Ronde.png',
  './images/sections/Sections%20avec%20Noms/Carr%C3%A9e.png',
  './images/sections/Sections%20avec%20Noms/Corniere%20a%2045%C2%B0%20a%20ailes%20egales.png',
  './images/sections/Sections%20avec%20Noms/Corniere.png',
  './images/sections/Sections%20avec%20Noms/HEA.png',
  './images/sections/Sections%20avec%20Noms/HEB.png',
  './images/sections/Sections%20avec%20Noms/I%20Perc%C3%A9.png',
  './images/sections/Sections%20avec%20Noms/IPE.png',
  './images/sections/Sections%20avec%20Noms/IPN.png',
  './images/sections/Sections%20avec%20Noms/Rectangle.png',
  './images/sections/Sections%20avec%20Noms/Section%20en%20Croix.png',
  './images/sections/Sections%20avec%20Noms/Section%20en%20I.png',
  './images/sections/Sections%20avec%20Noms/Section%20en%20U.png',
  './images/sections/Sections%20avec%20Noms/Section%20Ovale%20Creuse.png',
  './images/sections/Sections%20avec%20Noms/Section%20Ovale.png',
  './images/sections/Sections%20avec%20Noms/Section%20Rectangulaire%20Perc%C3%A9e.png',
  './images/sections/Sections%20avec%20Noms/Section%20Triangle.png',
  './images/sections/Sections%20avec%20Noms/Sections%20en%20T.png',
  './images/sections/Sections%20avec%20Noms/Tube%20Carr%C3%A9%2045%C2%B0.png',
  './images/sections/Sections%20avec%20Noms/Tube%20Rectangle.png',
  './images/sections/Sections%20avec%20Noms/Tube%20Rond.png',
  './images/sections/Sections%20avec%20Noms/U%20Perc%C3%A9.png',
  './images/sections/Sections%20avec%20Noms/UAP.png',
  './images/sections/Sections%20avec%20Noms/UPE.png',
  './images/sections/Sections%20avec%20Noms/UPN.png'
];

// Installation : mise en cache de tous les fichiers
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_VERSION).then((cache) => {
      console.log('[SW] Mise en cache de tous les fichiers…');
      return cache.addAll(ASSETS_TO_CACHE);
    }).then(() => {
      return self.skipWaiting();
    })
  );
});

// Activation : nettoyer les anciens caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((name) => name !== CACHE_VERSION)
          .map((name) => {
            console.log('[SW] Suppression ancien cache :', name);
            return caches.delete(name);
          })
      );
    }).then(() => {
      return self.clients.claim();
    })
  );
});

// Fetch : cache-first, fallback réseau
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) {
        return cachedResponse;
      }
      return fetch(event.request).then((networkResponse) => {
        if (networkResponse && networkResponse.status === 200) {
          const responseClone = networkResponse.clone();
          caches.open(CACHE_VERSION).then((cache) => {
            cache.put(event.request, responseClone);
          });
        }
        return networkResponse;
      });
    }).catch(() => {
      if (event.request.mode === 'navigate') {
        return caches.match('./index.html');
      }
    })
  );
});
