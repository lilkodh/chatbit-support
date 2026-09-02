import axios from 'axios';
import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';
import { API_URL } from '../config/env';

const TOKEN_KEY = 'chatbit_token';

export const storage = {
  saveToken: async (token: string): Promise<void> => {
    if (!token || typeof token !== 'string' || token.trim().length === 0) {
      throw new Error('Invalid token provided');
    }
    const cleanToken = token.trim();
    if (Platform.OS === 'web') {
      try {
        localStorage.setItem(TOKEN_KEY, cleanToken);
      } catch {}
    } else {
      try {
        await SecureStore.setItemAsync(TOKEN_KEY, cleanToken);
      } catch {}
    }
  },
  getToken: async (): Promise<string | null> => {
    try {
      if (Platform.OS === 'web') {
        const token = localStorage.getItem(TOKEN_KEY);
        if (!token || typeof token !== 'string' || token.trim().length === 0 || token === 'undefined' || token === 'null') {
          return null;
        }
        return token.trim();
      }
      const token = await SecureStore.getItemAsync(TOKEN_KEY);
      if (!token || typeof token !== 'string' || token.trim().length === 0 || token === 'undefined' || token === 'null') {
        return null;
      }
      return token.trim();
    } catch {
      return null;
    }
  },
  removeToken: async (): Promise<void> => {
    try {
      if (Platform.OS === 'web') {
        localStorage.removeItem(TOKEN_KEY);
      } else {
        await SecureStore.deleteItemAsync(TOKEN_KEY);
      }
    } catch {}
  },
};

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

let onUnauthorizedCallback: (() => void) | null = null;

export const setUnauthorizedCallback = (cb: () => void) => {
  onUnauthorizedCallback = cb;
};

export const setUnauthorizedHandler = setUnauthorizedCallback;

api.interceptors.request.use(
  async (config) => {
    const token = await storage.getToken();
    if (token) {
      if (config.headers && typeof config.headers.set === 'function') {
        config.headers.set('Authorization', `Bearer ${token}`);
      } else if (config.headers) {
        config.headers['Authorization'] = `Bearer ${token}`;
      }
    } else {
      if (config.headers && typeof config.headers.delete === 'function') {
        config.headers.delete('Authorization');
      } else if (config.headers) {
        delete config.headers['Authorization'];
        delete config.headers['authorization'];
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response && error.response.status === 401) {
      await storage.removeToken();
      if (onUnauthorizedCallback) {
        onUnauthorizedCallback();
      }
    }
    return Promise.reject(error);
  }
);

export const authService = {
  register: async (data: { full_name: string; email: string; password?: string; role: 'client' | 'agent' }) => {
    const res = await api.post('/auth/register', data);
    const token = res.data?.data?.token || res.data?.token;
    const user = res.data?.data?.user || res.data?.user;
    if (!token || typeof token !== 'string') {
      throw new Error('Registration response missing JWT token');
    }
    return { token, user };
  },
  login: async (data: { email: string; password?: string }) => {
    const res = await api.post('/auth/login', data);
    const token = res.data?.data?.token || res.data?.token;
    const user = res.data?.data?.user || res.data?.user;
    if (!token || typeof token !== 'string') {
      throw new Error('Login response missing JWT token');
    }
    return { token, user };
  },
  getMe: async () => {
    const res = await api.get('/users/me');
    return res.data?.data || res.data;
  },
  logout: async () => {
    await storage.removeToken();
  },
};

export const conversationService = {
  getConversations: () =>
    api.get('/conversations'),
  createConversation: (subject: string) =>
    api.post('/conversations', { subject }),
  joinConversation: (id: number | string) =>
    api.patch(`/conversations/${id}/join`),
  closeConversation: (id: number | string) =>
    api.patch(`/conversations/${id}/close`),
  getMessages: (id: number | string, page = 1, limit = 20) =>
    api.get(`/conversations/${id}/messages`, { params: { page, limit } }),
  sendMessage: (id: number | string, content: string) =>
    api.post(`/conversations/${id}/messages`, { content }),
};

export default api;