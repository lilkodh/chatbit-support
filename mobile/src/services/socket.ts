import { io, Socket } from 'socket.io-client';
import { SOCKET_URL } from '../config/env';
import { storage } from './api';

let socket: Socket | null = null;

export const connectSocket = async (): Promise<Socket | null> => {
  const token = await storage.getToken();
  if (!token || typeof token !== 'string' || token.trim().length === 0) {
    return null;
  }

  if (socket && socket.connected) {
    return socket;
  }

  if (socket) {
    socket.disconnect();
  }

  socket = io(SOCKET_URL, {
    auth: { token: token.trim() },
    transports: ['websocket', 'polling'],
    autoConnect: true,
  });

  socket.on('connect_error', (err) => {
    if (err.message && (err.message.includes('Authentication') || err.message.includes('jwt') || err.message.includes('token'))) {
      disconnectSocket();
    }
  });

  return socket;
};

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};

export const getSocket = (): Socket | null => {
  return socket;
};

export const joinConversationRoom = (conversationId: number | string) => {
  if (socket && socket.connected) {
    socket.emit('conversation:join', Number(conversationId));
  }
};

export const leaveConversationRoom = (conversationId: number | string) => {
  if (socket && socket.connected) {
    socket.emit('conversation:leave', Number(conversationId));
  }
};

export const sendSocketMessage = (conversationId: number | string, content: string) => {
  if (socket && socket.connected) {
    socket.emit('message:send', {
      conversationId: Number(conversationId),
      content,
    });
  }
};

export const startTypingSocket = (conversationId: number | string) => {
  if (socket && socket.connected) {
    socket.emit('typing:start', Number(conversationId));
  }
};

export const stopTypingSocket = (conversationId: number | string) => {
  if (socket && socket.connected) {
    socket.emit('typing:stop', Number(conversationId));
  }
};
