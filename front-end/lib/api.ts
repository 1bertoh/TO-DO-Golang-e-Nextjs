import axios from 'axios';

const API_URL = "http://localhost:8080/api";

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export interface RegisterPayload {
  username: string;
  email: string;
  password: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  user: {
    id: number;
    email: string;
    username: string;
  };
}

export interface Task {
  id: number;
  title: string;
  description?: string;
  completed: boolean;
}

export interface TaskPayload {
  title: string;
  description?: string;
  completed?: boolean;
}

export const register = async (data: RegisterPayload): Promise<AuthResponse> => {
  try {
    console.log(data, 'n.flying')
    const response = await api.post<AuthResponse>('/register', data);
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.error || 'Registration failed');
  }
};

export const login = async (data: LoginPayload): Promise<AuthResponse> => {
  try {
    const response = await api.post<AuthResponse>('/login', data);
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.error || 'Login failed');
  }
};

export const getProfile = async (): Promise<{ id?: number; username: string; email: string }> => {
  try {
    const res = await api.get('/profile'); // teste de autenticação
    return {email: res.data.data.email, username: res.data.data.username}; // mock
  } catch (error) {
    throw new Error('Authentication failed');
  }
};

export const getTasks = async (): Promise<Task[]> => {
  try {
    const response = await api.get<{ data: Task[] }>('/tasks');
    return response.data.data || [];
  } catch (error: any) {
    throw new Error(error.response?.data?.error || 'Failed to fetch tasks');
  }
};

export const getTask = async (id: number): Promise<Task> => {
  try {
    const response = await api.get<{ data: Task }>(`/tasks/${id}`);
    return response.data.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.error || 'Failed to fetch task');
  }
};

export const createTask = async (taskData: TaskPayload): Promise<Task> => {
  try {
    const response = await api.post<{ data: Task }>('/tasks', taskData);
    return response.data.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.error || 'Failed to create task');
  }
};

export const updateTask = async (id: number, taskData: any): Promise<Task> => {
  try {
    console.log(taskData, 'YEAH')
    const response = await api.put<{ data: any }>(`/tasks/${id}`, taskData);
    return response.data.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.error || 'Failed to update task');
  }
};

export const deleteTask = async (id: number): Promise<{ message: string }> => {
  try {
    const response = await api.delete<{ message: string }>(`/tasks/${id}`);
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.error || 'Failed to delete task');
  }
};
