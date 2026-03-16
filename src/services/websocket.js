import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';

const WS_URL = 'https://alpheratz-backend-production.up.railway.app/ws';

let client = null;

export const connectWebSocket = (groupId, onMessageReceived, onAlertReceived) => {
  client = new Client({
    webSocketFactory: () => new SockJS(WS_URL),
    onConnect: () => {
      console.log('WebSocket conectado');

      // Suscribirse a mensajes del grupo
      client.subscribe(`/topic/chat/${groupId}`, (message) => {
        onMessageReceived(JSON.parse(message.body));
      });

      // Suscribirse a alertas del grupo
      client.subscribe(`/topic/alert/${groupId}`, (alert) => {
        onAlertReceived(JSON.parse(alert.body));
      });
    },
    onDisconnect: () => {
      console.log('WebSocket desconectado');
    }
  });

  client.activate();
};

export const sendWebSocketMessage = (groupId, messageData) => {
  if (client && client.connected) {
    client.publish({
      destination: `/app/chat/${groupId}`,
      body: JSON.stringify(messageData)
    });
  }
};

export const sendWebSocketAlert = (groupId, alertData) => {
  if (client && client.connected) {
    client.publish({
      destination: `/app/alert/${groupId}`,
      body: JSON.stringify(alertData)
    });
  }
};

export const disconnectWebSocket = () => {
  if (client) {
    client.deactivate();
  }
};