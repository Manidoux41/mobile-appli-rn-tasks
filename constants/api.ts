// Configuration de l'API
export const API_BASE_URL = 'http://localhost:8080/api';

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
