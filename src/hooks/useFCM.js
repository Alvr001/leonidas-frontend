import { useEffect } from 'react';
import { requestFCMToken, onForegroundMessage } from '../services/firebase';
import { updateFcmToken } from '../services/api';

// Llama este hook en el componente raíz después del login
export function useFCM(userId) {
  useEffect(() => {
    if (!userId) return;

    const register = async () => {
      const token = await requestFCMToken();
      if (token) {
        try {
          await updateFcmToken(userId, token);
          console.log('✅ Token FCM registrado en backend');
        } catch (err) {
          console.error('Error guardando token FCM:', err);
        }
      }
    };

    register();

    // Notificaciones en primer plano (app abierta)
    const unsubscribe = onForegroundMessage((payload) => {
      const { title, body } = payload.notification || {};
      // Mostrar notificación nativa del navegador
      if (Notification.permission === 'granted') {
        new Notification(title || 'Alpheratz', {
          body: body || '',
          icon: '/logo192.png',
        });
      }
    });

    return () => unsubscribe();
  }, [userId]);
}