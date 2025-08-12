// Configuration de l'API
// En production, utiliser l'URL Vercel, en développement utiliser localhost
import { Platform } from 'react-native';

// Configuration de l'API
const isDevelopment = __DEV__;

export const API_BASE_URL = isDevelopment 
  ? Platform.OS === 'android' 
    ? 'http://10.0.2.2:8080/api'  // Émulateur Android
    : 'http://localhost:8080/api'  // Simulateur iOS
  : 'https://backend-api-tasks-1.onrender.com/api'; // Production Render

export const API_ENDPOINTS = {
  // Auth
  LOGIN: `${API_BASE_URL}/auth/login`,
  REGISTER: `${API_BASE_URL}/auth/register`,
  
  // Tasks
  TASKS: `${API_BASE_URL}/tasks`,
  
  // Admin
  ADMIN_USERS: `${API_BASE_URL}/admin/users`,
  ADMIN_STATS: `${API_BASE_URL}/admin/stats`,
  ADMIN_TASKS: `${API_BASE_URL}/admin/tasks`,
};
