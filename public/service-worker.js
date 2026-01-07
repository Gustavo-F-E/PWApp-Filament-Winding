// public/service-worker.js
self.addEventListener('install', (event) => {
    console.log('Service Worker instalado');
    self.skipWaiting();
  });
  
  self.addEventListener('activate', (event) => {
    console.log('Service Worker activado');
    event.waitUntil(clients.claim());
  });
  
  // Enviar mensaje a los clientes sobre el estado de la PWA
  self.addEventListener('message', (event) => {
    if (event.data && event.data.type === 'GET_ORIENTATION') {
      // Los clients pueden preguntar por la orientación
      self.clients.matchAll().then(clients => {
        clients.forEach(client => {
          client.postMessage({
            type: 'ORIENTATION_STATUS',
            isStandalone: window.matchMedia('(display-mode: standalone)').matches ||
                          window.matchMedia('(display-mode: fullscreen)').matches ||
                          window.matchMedia('(display-mode: minimal-ui)').matches
          });
        });
      });
    }
  });