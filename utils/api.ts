import { API_BASE_URL } from '../constants/api';
import { getToken, logout } from './auth';

export interface User {
  _id: string;
  username: string;
  email: string;
  name: string;
  role: 'admin' | 'user';
  createdAt: string;
}

export interface Task {
  _id: string;
  title: string;
  description: string;
  priority: 'low' | 'medium' | 'high';
  status: 'pending' | 'in_progress' | 'completed';
  completed?: boolean; // Pour compatibilité avec l'ancien système
  dueDate?: string;
  assignedBy?: string;
  assignedTo?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateTaskData {
  title: string;
  description: string;
  priority: 'low' | 'medium' | 'high';
  dueDate?: string;
  assignedTo?: string;
}

export interface TaskData {
  title: string;
  description: string;
  dueDate: string;
  priority: 'low' | 'medium' | 'high';
}

export interface CreateUserData {
  username: string;
  email: string;
  password: string;
  name: string;
  role?: 'admin' | 'user';
}

export interface LoginResponse {
  token: string;
  user: User;
}

export interface LoginData {
  email: string;
  password: string;
}

class ApiService {
  private async makeRequest<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const token = await getToken();
    
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers,
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      const errorMessage = errorData.message || `HTTP error! status: ${response.status}`;
      
      // Si l'erreur indique que l'utilisateur n'est pas trouvé, déconnecter automatiquement
      if (errorMessage.includes('Utilisateur non trouvé') || 
          errorMessage.includes('Token invalide') ||
          response.status === 401) {
        console.log('🚪 Token invalide détecté, déconnexion automatique...');
        await logout();
        // Rediriger vers la page de connexion sera géré par les composants
      }
      
      throw new Error(errorMessage);
    }

    return response.json();
  }

  // Auth methods
  async login(usernameOrEmail: string, password: string): Promise<LoginResponse> {
    return this.makeRequest('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ usernameOrEmail, password }),
    });
  }

  async register(userData: { username: string; email: string; password: string; name: string }) {
    return this.makeRequest('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  // Task methods
  async getTasks(): Promise<Task[]> {
    const response = await this.makeRequest<{ tasks: Task[] }>('/tasks');
    return response.tasks;
  }

  async createTask(taskData: CreateTaskData): Promise<Task> {
    return this.makeRequest('/tasks', {
      method: 'POST',
      body: JSON.stringify(taskData),
    });
  }

  async updateTask(taskId: string, updates: Partial<Task>): Promise<Task> {
    return this.makeRequest(`/tasks/${taskId}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
  }

  async toggleTaskComplete(taskId: string, completed: boolean): Promise<Task> {
    return this.updateTask(taskId, { 
      completed,
      status: completed ? 'completed' : 'pending'
    });
  }

  async deleteTask(taskId: string): Promise<void> {
    return this.makeRequest(`/tasks/${taskId}`, {
      method: 'DELETE',
    });
  }

  // Admin methods
  async getUsers(): Promise<User[]> {
    const response = await this.makeRequest<{ users: User[] }>('/admin/users');
    return response.users;
  }

  async createUser(userData: CreateUserData): Promise<User> {
    return this.makeRequest('/admin/users', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  async updateUserRole(userId: string, role: 'admin' | 'user'): Promise<User> {
    return this.makeRequest(`/admin/users/${userId}/role`, {
      method: 'PUT',
      body: JSON.stringify({ role }),
    });
  }

  async deleteUser(userId: string): Promise<void> {
    return this.makeRequest(`/admin/users/${userId}`, {
      method: 'DELETE',
    });
  }

  async assignTask(taskData: CreateTaskData): Promise<Task> {
    return this.makeRequest('/admin/tasks/assign', {
      method: 'POST',
      body: JSON.stringify(taskData),
    });
  }

  async assignExistingTask(taskId: string, userId: string): Promise<Task> {
    console.log('🌐 API assignExistingTask - taskId:', taskId, 'userId:', userId);
    console.log('🌐 API URL:', `${API_BASE_URL}/admin/tasks/${taskId}/assign`);
    
    try {
      const result = await this.makeRequest(`/admin/tasks/${taskId}/assign`, {
        method: 'PUT',
        body: JSON.stringify({ assignedTo: userId }),
      });
      console.log('🌐 API assignExistingTask success:', result);
      return result as Task;
    } catch (error) {
      console.error('🌐 API assignExistingTask error:', error);
      throw error;
    }
  }

  async unassignTask(taskId: string): Promise<Task> {
    return this.makeRequest(`/admin/tasks/${taskId}/assign`, {
      method: 'DELETE',
    });
  }

  async getAdminStats(): Promise<{
    totalUsers: number;
    totalTasks: number;
    pendingTasks: number;
    completedTasks: number;
  }> {
    return this.makeRequest('/admin/stats');
  }
}

export const apiService = new ApiService();
