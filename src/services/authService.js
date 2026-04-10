import { API_URL } from '../config';

const BASE_URL = `${API_URL}/api/auth`;
export async function register({ email, name, password }) {
  const res = await fetch(`${BASE_URL}/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, name, password }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Error al registrar');
  return data; // { token, userId, name, animalId }
}

export async function login({ email, password }) {
  const res = await fetch(`${BASE_URL}/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Error al iniciar sesión');
  return data;
}

export function saveSession({ token, userId, name, animalId, profilePhoto }) {
  localStorage.setItem('token', token);
  localStorage.setItem('userId', String(userId));
  localStorage.setItem('userName', name);
  localStorage.setItem('userAnimalId', animalId);
  if (profilePhoto) localStorage.setItem('userPhoto', profilePhoto);
  // 🔥 NO disparar session-changed aquí para register
}

export function clearSession() {
  localStorage.removeItem('token');
  localStorage.removeItem('userId');
  localStorage.removeItem('userName');
  localStorage.removeItem('userAnimalId');
  // 👇 AGREGA ESTA LÍNEA
  window.dispatchEvent(new Event('session-changed'));
}

export function getToken() {
  return localStorage.getItem('token');
}