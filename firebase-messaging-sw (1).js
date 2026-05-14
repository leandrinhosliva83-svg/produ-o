// Firebase Messaging Service Worker — Grupo Moreno
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

// Receber push com app fechado
messaging.onBackgroundMessage(function(payload) {
  var data = payload.notification || payload.data || {};
  var title = data.title || '🚨 Alerta de Meta — Grupo Moreno';
  var body  = data.body  || 'Proprietário abaixo da meta!';

  self.registration.showNotification(title, {
    body: body,
    icon: '/icon-192.png',
    badge: '/icon-192.png',
    vibrate: [300, 100, 300, 100, 500],
    requireInteraction: true,
    tag: 'alerta-meta',
    renotify: true,
    actions: [{ action: 'abrir', title: '📊 Ver Dashboard' }]
  });
});

self.addEventListener('notificationclick', function(e) {
  e.notification.close();
  e.waitUntil(
    clients.matchAll({ type: 'window' }).then(function(cs) {
      if (cs.length) { cs[0].focus(); return; }
      clients.openWindow('https://moreno-o-chi.vercel.app/');
    })
  );
});
