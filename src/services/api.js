import axios from 'axios';

const API_URL = 'http://192.168.100.45:8080';

const api = axios.create({
  baseURL: API_URL,
  headers: { 'Content-Type': 'application/json' }
});

// USUARIOS
export const getUsers = () => api.get('/api/users');
export const createUser = (phone, name) => api.post('/api/users', { phone, name });
export const getUserById = (id) => api.get(`/api/users/${id}`);
export const updateUserPhoto = (userId, profilePhoto) =>
  api.put(`/api/users/${userId}/photo`, { profilePhoto });
export const updateUserName = (userId, name) =>
  api.put(`/api/users/${userId}/name`, { name });
export const updateFcmToken = (userId, fcmToken) =>
  api.put(`/api/users/${userId}/fcm-token`, { fcmToken });

// GRUPOS
export const getGroups = () => api.get('/api/groups');
export const getGroupById = (groupId) => api.get(`/api/groups/${groupId}`);
export const createGroup = (data) => api.post('/api/groups', data);
export const joinGroup = (groupId, userId) => api.post(`/api/groups/${groupId}/join`, { userId });
export const getGroupsByUser = (userId) => api.get(`/api/groups/user/${userId}`);
export const getGroupMembers = (groupId) => api.get(`/api/groups/${groupId}/members`);
export const getLastMessage = (groupId, userId) =>
  api.get(`/api/groups/${groupId}/last-message${userId ? `?userId=${userId}` : ''}`);
export const isFormerMember = (groupId, userId) =>
  api.get(`/api/groups/${groupId}/is-former-member?userId=${userId}`);
export const leaveGroup = (groupId, userId) =>
  api.delete(`/api/groups/${groupId}/leave?userId=${userId}`);
export const deleteGroup = (groupId) => api.delete(`/api/groups/${groupId}`);
export const updateGroupName = (groupId, name) =>
  api.put(`/api/groups/${groupId}/name`, { name });
export const updateGroupDescription = (groupId, description) =>
  api.put(`/api/groups/${groupId}/description`, { description });
export const updateGroupPhoto = (groupId, groupPhoto) =>
  api.put(`/api/groups/${groupId}/photo`, { groupPhoto });
export const updateGroupPermissions = (groupId, permissions) =>
  api.put(`/api/groups/${groupId}/permissions`, permissions);
export const removeMember = (groupId, memberId) =>
  api.delete(`/api/groups/${groupId}/members/${memberId}`);
export const makeAdmin = (groupId, memberId) =>
  api.put(`/api/groups/${groupId}/members/${memberId}/make-admin`);

// MENSAJES
export const getMessages = (groupId, userId) =>
  api.get(`/api/messages/group/${groupId}?userId=${userId}`);
export const getGroupImages = (groupId) =>
  api.get(`/api/messages/group/${groupId}/images`);
export const sendMessage = (data) => api.post('/api/messages', data);
export const clearChat = (groupId, userId) =>
  api.delete(`/api/messages/group/${groupId}?userId=${userId}`);
export const getMessageContent = (messageId) =>
  api.get(`/api/messages/${messageId}/content`);

// ALERTAS
export const getAlerts = (groupId, userId) =>
  api.get(`/api/alerts/group/${groupId}${userId ? `?userId=${userId}` : ''}`);
export const createAlert = (data) => api.post('/api/alerts', data);
export const resolveAlert = (id) => api.put(`/api/alerts/${id}/resolve`);

// AMIGOS ──────────────────────────────────────────────────────────────────────
// Buscar usuario por animalId exacto (ej: "fox@5334")
// GET /api/friends/search?animalId=fox@5334&requesterId=1
export const searchUserByAnimalId = (animalId, requesterId) =>
  api.get(`/api/friends/search?animalId=${encodeURIComponent(animalId)}&requesterId=${requesterId}`);

// Enviar solicitud de amistad
// POST /api/friends/request  { senderId, receiverId }
export const sendFriendRequest = (senderId, receiverId) =>
  api.post('/api/friends/request', { senderId, receiverId });

// Obtener lista de amigos
// GET /api/friends?userId=1
export const getFriends = (userId) =>
  api.get(`/api/friends?userId=${userId}`);

// Obtener solicitudes recibidas pendientes
// GET /api/friends/requests?userId=1
export const getFriendRequests = (userId) =>
  api.get(`/api/friends/requests?userId=${userId}`);

// Aceptar solicitud
// PUT /api/friends/request/{requestId}/accept
export const acceptFriendRequest = (requestId) =>
  api.put(`/api/friends/request/${requestId}/accept`);

// Rechazar solicitud
// DELETE /api/friends/request/{requestId}/reject
export const rejectFriendRequest = (requestId) =>
  api.delete(`/api/friends/request/${requestId}/reject`);

// Eliminar amigo
// DELETE /api/friends?userId=1&friendId=2
export const deleteFriend = (userId, friendId) =>
  api.delete(`/api/friends?userId=${userId}&friendId=${friendId}`);
// ─────────────────────────────────────────────────────────────────────────────

export default api;