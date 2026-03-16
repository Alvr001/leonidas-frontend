import axios from 'axios';

const API_URL = 'https://alpheratz-backend-production.up.railway.app';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// USUARIOS
export const getUsers = () => api.get('/api/users');
export const createUser = (phone, name) => api.post('/api/users', { phone, name });
export const getUserById = (id) => api.get(`/api/users/${id}`);

// GRUPOS
export const getGroups = () => api.get('/api/groups');
export const createGroup = (data) => api.post('/api/groups', data);
export const joinGroup = (groupId, userId) => api.post(`/api/groups/${groupId}/join`, { userId });
export const getGroupsByUser = (userId) => api.get(`/api/groups/user/${userId}`);

// MENSAJES
export const getMessages = (groupId) => api.get(`/api/messages/group/${groupId}`);
export const sendMessage = (data) => api.post('/api/messages', data);

// ALERTAS
export const getAlerts = (groupId) => api.get(`/api/alerts/group/${groupId}`);
export const createAlert = (data) => api.post('/api/alerts', data);
export const resolveAlert = (id) => api.put(`/api/alerts/${id}/resolve`);

export default api;