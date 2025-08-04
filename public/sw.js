const CACHE_NAME = 'globalnet-v1';
const urlsToCache = [
  '/',
  '/offline',
  '/images/logo.jpg',
  '/images/badge.png',
  '/sounds/notification.mp3',
  '/sounds/success.mp3',
  '/sounds/error.mp3',
  '/sounds/warning.mp3',
];

// Installation du Service Worker
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Cache ouvert');
        return cache.addAll(urlsToCache);
      })
      .catch((error) => {
        console.error('Erreur lors de l\'installation du cache:', error);
      })
  );
});

// Activation du Service Worker
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('Suppression de l\'ancien cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

// Interception des requêtes réseau
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // Retourner la réponse du cache si elle existe
        if (response) {
          return response;
        }

        // Sinon, faire la requête réseau
        return fetch(event.request)
          .then((response) => {
            // Vérifier si la réponse est valide
            if (!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }

            // Cloner la réponse pour la mettre en cache
            const responseToCache = response.clone();

            caches.open(CACHE_NAME)
              .then((cache) => {
                cache.put(event.request, responseToCache);
              });

            return response;
          })
          .catch(() => {
            // En cas d'erreur réseau, retourner la page offline
            if (event.request.mode === 'navigate') {
              return caches.match('/offline');
            }
          });
      })
  );
});

// Gestion des notifications push
self.addEventListener('push', (event) => {
  console.log('Notification push reçue:', event);

  let notificationData = {
    title: 'GlobalNet Services',
    body: 'Nouvelle notification',
    icon: '/images/logo.jpg',
    badge: '/images/badge.png',
    tag: 'globalnet-notification',
    data: {},
  };

  if (event.data) {
    try {
      const data = event.data.json();
      notificationData = {
        ...notificationData,
        ...data,
      };
    } catch (error) {
      console.error('Erreur lors du parsing des données de notification:', error);
    }
  }

  const options = {
    body: notificationData.body,
    icon: notificationData.icon,
    badge: notificationData.badge,
    tag: notificationData.tag,
    data: notificationData.data,
    requireInteraction: true,
    actions: [
      {
        action: 'view',
        title: 'Voir',
        icon: '/images/view.png',
      },
      {
        action: 'close',
        title: 'Fermer',
        icon: '/images/close.png',
      },
    ],
  };

  event.waitUntil(
    self.registration.showNotification(notificationData.title, options)
  );
});

// Gestion des clics sur les notifications
self.addEventListener('notificationclick', (event) => {
  console.log('Clic sur notification:', event);

  event.notification.close();

  if (event.action === 'close') {
    return;
  }

  // Ouvrir l'application
  event.waitUntil(
    clients.matchAll({ type: 'window' })
      .then((clientList) => {
        // Si une fenêtre est déjà ouverte, la focaliser
        for (const client of clientList) {
          if (client.url.includes(self.location.origin) && 'focus' in client) {
            return client.focus();
          }
        }

        // Sinon, ouvrir une nouvelle fenêtre
        if (clients.openWindow) {
          return clients.openWindow('/');
        }
      })
  );
});

// Gestion des notifications fermées
self.addEventListener('notificationclose', (event) => {
  console.log('Notification fermée:', event);
});

// Gestion des messages du client
self.addEventListener('message', (event) => {
  console.log('Message reçu du client:', event.data);

  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }

  if (event.data && event.data.type === 'GET_VERSION') {
    event.ports[0].postMessage({ version: CACHE_NAME });
  }
});

// Fonction utilitaire pour envoyer une notification
function sendNotification(title, body, icon = '/images/logo.jpg') {
  return self.registration.showNotification(title, {
    body,
    icon,
    badge: '/images/badge.png',
    tag: 'globalnet-notification',
    requireInteraction: false,
  });
}

// Fonction utilitaire pour jouer un son
function playNotificationSound(soundType = 'notification') {
  const audioContext = new AudioContext();
  
  fetch(`/sounds/${soundType}.mp3`)
    .then(response => response.arrayBuffer())
    .then(arrayBuffer => audioContext.decodeAudioData(arrayBuffer))
    .then(audioBuffer => {
      const source = audioContext.createBufferSource();
      const gainNode = audioContext.createGain();
      
      source.buffer = audioBuffer;
      source.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      gainNode.gain.value = 0.3; // Volume à 30%
      source.start(0);
    })
    .catch(error => {
      console.error('Erreur lors de la lecture du son:', error);
    });
} 