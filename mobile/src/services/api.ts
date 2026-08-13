   import axios from 'axios';

const API_URL = 'http://192.168.X.X:3000/api'; 

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const authService = {
  login: async (email: string, role: string) => {
    console.log("Tentative de login pour:", email, role);
  },
  
  register: async (data: any) => {
    console.log("Tentative de register:", data);
  }
};

export const chatService = {
  getInbox: async () => {
  },
  
  getMessages: async (chatId: string) => {
  },

  sendMessage: async (chatId: string, text: string) => {
  }
};

export default api;