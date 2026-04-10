// — Agregar estas líneas al final de api.js —

// FCM Token
export const updateFcmToken = (userId, fcmToken) =>
  axios.put(`${API_URL}/api/users/${userId}/fcm-token`, { fcmToken });