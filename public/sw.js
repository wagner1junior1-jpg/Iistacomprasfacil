// Service Worker para MercadoFácil - Compras Mensais & Comparador
const CACHE_NAME = 'mercadofacil-cache-v12';

const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/icons/icon-192.png',
  '/icons/icon-512.png',
  '/icons/icon.svg',
];

// Lê o index.html publicado e devolve os assets com hash gerados pelo Vite (/assets/*.js|css),
// para que o app inteiro abra offline mesmo que o usuário nunca tenha navegado por todas as telas.
async function getBuildAssets() {
  try {
    const response = await fetch('/index.html', { cache: 'no-cache' });
    const html = await response.text();
    const matches = html.match(/(?:src|href)="(\/assets\/[^"]+)"/g) || [];
    return matches.map((m) => m.replace(/^(?:src|href)="/, '').replace(/"$/, ''));
  } catch {
    return [];
  }
}

// Instalação do Service Worker e pré-cache inicial
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(async (cache) => {
      await cache.addAll(STATIC_ASSETS);
      const buildAssets = await getBuildAssets();
      await Promise.all(buildAssets.map((asset) => cache.add(asset).catch(() => {})));
    })
  );
  self.skipWaiting();
});

// Ativação e limpeza de caches antigos
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

function shouldCache(url, networkResponse) {
  return !!networkResponse && networkResponse.status === 200 && networkResponse.type === 'basic';
}

// Estratégia de Fetch: Cache-first com fallback para rede e cache dinâmico de assets
self.addEventListener('fetch', (event) => {
  const request = event.request;
  const url = new URL(request.url);

  // Só intercepta GET em http(s)
  if (request.method !== 'GET' || !url.protocol.startsWith('http')) {
    return;
  }

  // Navegações de página (HTML SPA): tenta rede, cai no cache de index.html
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request)
        .then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200) {
            const copy = networkResponse.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put('/', copy));
          }
          return networkResponse;
        })
        .catch(async () => {
          const cached = await caches.match(request);
          if (cached) return cached;
          const fallback = await caches.match('/index.html') || await caches.match('/');
          return fallback || Response.error();
        })
    );
    return;
  }

  // Assets estáticos (JS, CSS, Imagens, Fontes, SVGs): Stale-while-revalidate
  event.respondWith(
    caches.match(request).then((cachedResponse) => {
      const fetchPromise = fetch(request)
        .then((networkResponse) => {
          if (shouldCache(url, networkResponse)) {
            const responseToCache = networkResponse.clone();
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(request, responseToCache);
            });
          }
          return networkResponse;
        })
        .catch(() => cachedResponse || Response.error());

      return cachedResponse || fetchPromise;
    })
  );
});
