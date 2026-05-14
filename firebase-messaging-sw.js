importScripts('https://www.gstatic.com/firebasejs/10.12.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.12.0/firebase-messaging-compat.js');

firebase.initializeApp({
  apiKey: "AIzaSyAjjFMj0qbJlINPspy_mYslAwJtDI9jRWs",
  authDomain: "frota-moreno.firebaseapp.com",
  projectId: "frota-moreno",
  storageBucket: "frota-moreno.firebasestorage.app",
  messagingSenderId: "726316011876",
  appId: "1:726316011876:web:45fd87f747603c417baa71"
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage(function(payload) {
  var n = payload.notification || {};
  var title = n.title || '🚨 Grupo Moreno — Alerta de Meta';
  var body = n.body || 'Proprietario abaixo da meta! Verifique o dashboard.';

  self.registration.showNotification(title, {
    body: body,
    icon: 'https://moreno-o-chi.vercel.app/icon-192.png',
    badge: 'https://moreno-o-chi.vercel.app/icon-192.png',
    vibrate: [500, 200, 500, 200, 800],
    requireInteraction: true,
    tag: 'alerta-meta',
    renotify: true,
    silent: false
  });
});

self.addEventListener('notificationclick', function(e) {
  e.notification.close();
  e.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then(function(cs) {
      if (cs.length > 0) { cs[0].focus(); return; }
      clients.openWindow('https://moreno-o-chi.vercel.app/');
    })
  );
});
