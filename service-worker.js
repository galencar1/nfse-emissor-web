// Versão fixa do cache - ATUALIZAR MANUALMENTE a cada deploy
const CACHE_VERSION = 'v3.0.0';
const CACHE_NAME = 'nfse-cache-' + CACHE_VERSION;

// URLs para cache offline (arquivos estáticos)
const urlsToCache = [
  '/',
  '/index.html',
  '/css/styles.css',
  '/js/app.js',
  '/js/api.js',
  '/js/config.js',
  '/assets/icons/icon.svg'
  // Não cachear CDNs externos como Tailwind - sempre buscar da rede
];

// Install - Cache resources
self.addEventListener('install', event => {
  console.log('[SW] Instalando versão:', CACHE_VERSION);
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('[SW] Cache aberto:', CACHE_NAME);
        return cache.addAll(urlsToCache);
      })
      .then(() => {
        console.log('[SW] Arquivos em cache');
        // Força ativação imediata da nova versão
        return self.skipWaiting();
      })
  );
});

// Activate - Clean old caches e assume controle
self.addEventListener('activate', event => {
  console.log('[SW] Ativando versão:', CACHE_VERSION);
  event.waitUntil(
    caches.keys()
      .then(cacheNames => {
        return Promise.all(
          cacheNames.map(cacheName => {
            if (cacheName !== CACHE_NAME) {
              console.log('[SW] Removendo cache antigo:', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      })
      .then(() => {
        console.log('[SW] Caches antigos removidos');
        // Assume controle imediatamente de todas as páginas abertas
        return self.clients.claim();
      })
  );
});

// Fetch Strategy:
// - API calls: SEMPRE Network (nunca cachear)
// - Arquivos estáticos: Network first, fallback para cache
// - CDNs externos: Network only
self.addEventListener('fetch', event => {
  const url = new URL(event.request.url);
  
  // NUNCA cachear chamadas de API
  if (url.origin.includes('nfse-api') || url.pathname.startsWith('/api/')) {
    event.respondWith(fetch(event.request));
    return;
  }
  
  // Não cachear CDNs externos (sempre buscar da rede)
  if (url.origin !== location.origin) {
    event.respondWith(fetch(event.request));
    return;
  }
  
  // Para arquivos locais: Network first, fallback para cache
  event.respondWith(
    fetch(event.request)
      .then(response => {
        // Se response ok, atualizar cache e retornar
        if (response && response.status === 200) {
          const responseToCache = response.clone();
          caches.open(CACHE_NAME).then(cache => {
            cache.put(event.request, responseToCache);
          });
        }
        return response;
      })
      .catch(() => {
        // Em caso de erro de rede, tentar buscar do cache
        return caches.match(event.request).then(cached => {
          if (cached) {
            console.log('[SW] Servindo do cache:', event.request.url);
            return cached;
          }
          // Se não tem no cache, retornar erro
          return new Response('Offline - recurso não disponível', {
            status: 503,
            statusText: 'Service Unavailable'
          });
        });
      })
  );
});
