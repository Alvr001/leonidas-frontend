import { initializeApp } from 'firebase/app';
import { getMessaging, getToken, onMessage } from 'firebase/messaging';

const firebaseConfig = {
  apiKey: "AIzaSyDgou7N8JCbqtSA8Rl2nAvWjegKOpib4-o",
  authDomain: "alpheratz-dd17e.firebaseapp.com",
  projectId: "alpheratz-dd17e",
  storageBucket: "alpheratz-dd17e.firebasestorage.app",
  messagingSenderId: "833580844642",
  appId: "1:833580844642:web:e8b12bb7edadc9fc9ab33b"
};

const VAPID_KEY = "BCus-b9X6hLvMveXnUOc9DEBCQlAIC_Nz9D7aHsQy5eZhKkTAHawKus2JoW1XJYOon1NECWtLVxEjTrn45f_s6E";

const app = initializeApp(firebaseConfig);
const messaging = getMessaging(app);

// Pide permiso y devuelve el token FCM del dispositivo
export const requestFCMToken = async () => {
  try {
    const permission = await Notification.requestPermission();
    if (permission !== 'granted') {
      console.warn('🔕 Permiso de notificaciones denegado');
      return null;
    }

    const token = await getToken(messaging, { vapidKey: VAPID_KEY });
    console.log('🔑 FCM Token:', token);
    return token;
  } catch (err) {
    console.error('Error obteniendo FCM token:', err);
    return null;
  }
};

// Escucha mensajes cuando la app está en primer plano
export const onForegroundMessage = (callback) => {
  return onMessage(messaging, (payload) => {
    console.log('📩 Mensaje en foreground:', payload);
    callback(payload);
  });
};