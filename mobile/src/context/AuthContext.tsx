import React, { createContext, useContext, useState, useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { storage, authService, setUnauthorizedCallback } from '../services/api';
import { disconnectSocket } from '../services/socket';

interface AuthContextType {
  user: any;
  token: string | null;
  isLoading: boolean;
  login: (token: string, user: any) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  token: null,
  isLoading: true,
  login: async () => {},
  logout: async () => {},
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<any>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const queryClient = useQueryClient();

  const logout = async () => {
    disconnectSocket();
    queryClient.clear();
    setToken(null);
    setUser(null);
    try {
      await storage.removeToken();
    } catch {}
  };

  useEffect(() => {
    let isMounted = true;

    setUnauthorizedCallback(() => {
      logout();
    });

    const initAuth = async () => {
      try {
        const storedToken = await storage.getToken();
        if (storedToken && typeof storedToken === 'string' && storedToken.trim().length > 0) {
          const timeoutPromise = new Promise((_, reject) =>
            setTimeout(() => reject(new Error('Timeout fetching user profile')), 4000)
          );
          const userData: any = await Promise.race([authService.getMe(), timeoutPromise]);

          if (isMounted) {
            if (userData && userData.id) {
              setUser(userData);
              setToken(storedToken);
            } else {
              setToken(null);
              setUser(null);
              await storage.removeToken();
            }
          }
        } else {
          if (isMounted) {
            setToken(null);
            setUser(null);
          }
        }
      } catch {
        if (isMounted) {
          setToken(null);
          setUser(null);
          await storage.removeToken();
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    initAuth();

    return () => {
      isMounted = false;
    };
  }, []);

  const login = async (newToken: string, newUser: any) => {
    if (!newToken || typeof newToken !== 'string' || newToken.trim().length === 0) {
      throw new Error('Invalid token provided');
    }
    await storage.saveToken(newToken);
    let resolvedUser = newUser;
    if (!resolvedUser || !resolvedUser.id) {
      resolvedUser = await authService.getMe();
    }
    setToken(newToken);
    setUser(resolvedUser);
  };

  return (
    <AuthContext.Provider value={{ user, token, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
