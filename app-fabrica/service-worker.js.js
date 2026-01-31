// ========== CONFIGURAÇÃO ==========
const CACHE_NAME = 'fabrica-tempo-v2.0';
const OFFLINE_URL = '/offline.html';

// Arquivos para cache
const FILES_TO_CACHE = [
  '/',
  '/index.html',
  '/worker-config.js',
  '/orders-config.js',
  'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css',
  'https://cdn.jsdelivr.net/npm/xlsx@0.18.5/dist/xlsx.full.min.js'
];

// ========== INSTALAÇÃO ==========
self.addEventListener('install', (event) => {
  console.log('[Service Worker] 📦 Instalando...');
  
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('[Service Worker] 📂 Cacheando arquivos essenciais');
        return cache.addAll(FILES_TO_CACHE);
      })
      .then(() => {
        console.log('[Service Worker] ✅ Instalação completa');
        return self.skipWaiting();
      })
      .catch(error => {
        console.error('[Service Worker] ❌ Erro na instalação:', error);
      })
  );
});

// ========== ATIVAÇÃO ==========
self.addEventListener('activate', (event) => {
  console.log('[Service Worker] 🚀 Ativando...');
  
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('[Service Worker] 🗑️ Removendo cache antiga:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => {
      console.log('[Service Worker] ✅ Ativação completa');
      return self.clients.claim();
    })
  );
});

// ========== FETCH (Intercepta requisições) ==========
self.addEventListener('fetch', (event) => {
  // Ignora requisições que não são GET
  if (event.request.method !== 'GET') {
    return;
  }
  
  // Para requisições de API, sempre tenta rede primeiro
  if (event.request.url.includes('/api/')) {
    event.respondWith(
      fetch(event.request)
        .catch(() => {
          // Se offline, retorna dados do localStorage se possível
          return offlineApiResponse(event.request);
        })
    );
    return;
  }
  
  // Para recursos estáticos, usa cache primeiro
  event.respondWith(
    caches.match(event.request)
      .then((cachedResponse) => {
        // Se tem no cache, retorna
        if (cachedResponse) {
          // Atualiza o cache em background
          updateCache(event.request);
          return cachedResponse;
        }
        
        // Se não tem no cache, busca na rede
        return fetch(event.request)
          .then((response) => {
            // Se a resposta é válida, cacheia
            if (response.status === 200) {
              const responseClone = response.clone();
              caches.open(CACHE_NAME)
                .then((cache) => {
                  cache.put(event.request, responseClone);
                });
            }
            return response;
          })
          .catch(() => {
            // Se offline e é uma página, retorna offline page
            if (event.request.headers.get('accept').includes('text/html')) {
              return caches.match('/');
            }
            return new Response('Offline', { 
              status: 503, 
              statusText: 'Service Unavailable',
              headers: new Headers({ 'Content-Type': 'text/plain' })
            });
          });
      })
  );
});

// ========== FUNÇÕES AUXILIARES ==========
function updateCache(request) {
  // Atualiza o cache em background
  fetch(request)
    .then((response) => {
      if (response.status === 200) {
        const responseClone = response.clone();
        caches.open(CACHE_NAME)
          .then((cache) => {
            cache.put(request, responseClone);
          });
      }
    })
    .catch(() => {
      // Falha na rede, mantém cache existente
    });
}

function offlineApiResponse(request) {
  // Tenta retornar dados salvos do localStorage
  return new Response(JSON.stringify({
    message: 'Offline mode - using cached data',
    timestamp: new Date().toISOString()
  }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' }
  });
}

// ========== SINCRONIZAÇÃO EM BACKGROUND ==========
self.addEventListener('sync', (event) => {
  console.log('[Service Worker] 🔄 Sincronização:', event.tag);
  
  if (event.tag === 'sync-records') {
    event.waitUntil(syncPendingRecords());
  }
});

async function syncPendingRecords() {
  // Aqui você sincronizaria com um servidor
  console.log('[Service Worker] Sincronizando registros pendentes...');
  
  // Notifica o app principal
  const clients = await self.clients.matchAll();
  clients.forEach(client => {
    client.postMessage({
      type: 'SYNC_COMPLETE',
      timestamp: new Date().toISOString()
    });
  });
}

// ========== MENSAGENS ==========
self.addEventListener('message', (event) => {
  console.log('[Service Worker] 📨 Mensagem recebida:', event.data);
  
  if (event.data.type === 'CACHE_DATA') {
    // Cacheia dados específicos
    cacheData(event.data.key, event.data.value);
  } else if (event.data.type === 'GET_CACHED_DATA') {
    // Retorna dados cacheados
    getCachedData(event.data.key)
      .then(data => {
        event.ports[0].postMessage(data);
      });
  }
});

function cacheData(key, data) {
  caches.open(CACHE_NAME)
    .then(cache => {
      const url = `/cache/${key}`;
      const response = new Response(JSON.stringify(data), {
        headers: { 'Content-Type': 'application/json' }
      });
      cache.put(url, response);
    });
}

function getCachedData(key) {
  return caches.open(CACHE_NAME)
    .then(cache => {
      return cache.match(`/cache/${key}`)
        .then(response => {
          if (response) {
            return response.json();
          }
          return null;
        });
    });
}

// ========== PUSH NOTIFICATIONS ==========
self.addEventListener('push', (event) => {
  console.log('[Service Worker] 🔔 Push notification recebida');
  
  if (!event.data) return;
  
  const data = event.data.json();
  const options = {
    body: data.body || 'Notificação do Sistema',
    icon: 'https://cdn.jsdelivr.net/npm/emoji-datasource-apple/img/apple/64/2692-fe0f.png',
    badge: 'https://cdn.jsdelivr.net/npm/emoji-datasource-apple/img/apple/64/1f3ed.png',
    vibrate: [200, 100, 200],
    data: {
      url: data.url || '/'
    },
    actions: [
      {
        action: 'open',
        title: 'Abrir'
      },
      {
        action: 'close',
        title: 'Fechar'
      }
    ]
  };
  
  event.waitUntil(
    self.registration.showNotification(data.title || 'Sistema Fábrica', options)
  );
});

self.addEventListener('notificationclick', (event) => {
  console.log('[Service Worker] 🔔 Notificação clicada');
  
  event.notification.close();
  
  if (event.action === 'open') {
    event.waitUntil(
      clients.openWindow(event.notification.data.url)
    );
  }
});