/* eslint-disable */
importScripts('https://www.gstatic.com/firebasejs/10.7.1/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.7.1/firebase-messaging-compat.js');

firebase.initializeApp({
  apiKey: "AIzaSyDgou7N8JCbqtSA8Rl2nAvWjegKOpib4-o",
  authDomain: "alpheratz-dd17e.firebaseapp.com",
  projectId: "alpheratz-dd17e",
  storageBucket: "alpheratz-dd17e.firebasestorage.app",
  messagingSenderId: "833580844642",
  appId: "1:833580844642:web:e8b12bb7edadc9fc9ab33b"
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  console.log('📩 Mensaje en background:', payload);
  const { title, body } = payload.notification || {};
  self.registration.showNotification(title || 'Alpheratz', {
    body: body || '',
    icon: '/logo192.png',
    badge: '/logo192.png',
    vibrate: [200, 100, 200],
    requireInteraction: true
  });
});