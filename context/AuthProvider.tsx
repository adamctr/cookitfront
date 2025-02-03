// context/AuthProvider.tsx
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { Platform } from 'react-native';
import * as SecureStore from 'expo-secure-store';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { AuthContextType, AuthProviderProps } from 'interfaces/auth';

// Typage du JWT pour extraire id_user
interface JwtPayload {
  id_user: string;
  exp: number;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

// Méthodes de stockage universelles
const storage = {
  setItem: async (key: string, value: string) => {
    if (Platform.OS === 'web') {
      await AsyncStorage.setItem(key, value);
    } else {
      await SecureStore.setItemAsync(key, value);
    }
  },
  getItem: async (key: string) => {
    return Platform.OS === 'web' 
      ? await AsyncStorage.getItem(key) 
      : await SecureStore.getItemAsync(key);
  },
  deleteItem: async (key: string) => {
    if (Platform.OS === 'web') {
      await AsyncStorage.removeItem(key);
    } else {
      await SecureStore.deleteItemAsync(key);
    }
  }
};

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [authState, setAuthState] = useState({
    isLoading: true,
    isAuthenticated: false,
    userId: null as string | null,  // Ajout de userId dans l'état
  });

  const checkAuthToken = useCallback(async () => {
    try {
      const token = await storage.getItem('auth_token');
      if (token) {
const jwt_decode = require('jwt-decode');
        setAuthState({
          isLoading: false,
          isAuthenticated: true,
          userId: jwt_decode.id_user,  // Stocke l'id_user
        });
      } else {
        setAuthState({
          isLoading: false,
          isAuthenticated: false,
          userId: null,
        });
      }
    } catch (error) {
      console.error('Erreur de vérification du token:', error);
      setAuthState(prev => ({ ...prev, isLoading: false }));
    }
  }, []);

  useEffect(() => {
    checkAuthToken();
  }, [checkAuthToken]);

  const login = async (token: string) => {
    try {
      await storage.setItem('auth_token', token);
      var jwt = require('jsonwebtoken');
      var decoded = jwt.verify(token, 'shhhhh');

      

      // const decoded = jwt_decode<JwtPayload>(token);  // Décodage lors de la connexion
      setAuthState({
        isLoading: false,
        isAuthenticated: true,
        userId: decoded.id_user,  // Stocke l'id_user
      });
    } catch (error) {
      console.error('Erreur lors de la connexion:', error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await storage.deleteItem('auth_token');
      setAuthState({
        isLoading: false,
        isAuthenticated: false,
        userId: null,
      });
    } catch (error) {
      console.error('Erreur lors de la déconnexion:', error);
    }
  };

  return (
    <AuthContext.Provider value={{ ...authState, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
