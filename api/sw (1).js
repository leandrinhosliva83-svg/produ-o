// api/sw.js — Serve o Firebase Messaging Service Worker

export default function handler(req, res) {
  res.setHeader('Content-Type', 'application/javascript');
  res.setHeader('Service-Worker-Allowed', '/');
  res.setHeader('Cache-Control', 'no-cache');
  
  res.send(`
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
  var data = payload.notification || payload.data || {};
  self.registration.showNotification(data.title || '🚨 Alerta de Meta — Grupo Moreno', {
    body: data.body || 'Proprietário abaixo da meta!',
    icon: 'https://moreno-o-chi.vercel.app/icon-192.png',
    vibrate: [300, 100, 300, 100, 500],
    requireInteraction: true,
    tag: 'alerta-meta',
    renotify: true
  });
});

self.addEventListener('notificationclick', function(e) {
  e.notification.close();
  e.waitUntil(clients.openWindow('https://moreno-o-chi.vercel.app/'));
});
  `);
}
