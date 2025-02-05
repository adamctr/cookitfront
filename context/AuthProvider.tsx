// context/AuthProvider.tsx
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { Platform } from 'react-native';
import * as SecureStore from 'expo-secure-store';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { AuthContextType, AuthProviderProps } from 'interfaces/auth';
import axios from 'axios';

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
  });

  const checkAuthToken = useCallback(async () => {
    try {
      const token = await storage.getItem('auth_token');
      setAuthState({
        isLoading: false,
        isAuthenticated: !!token,
      });
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
      setAuthState({
        isLoading: false,
        isAuthenticated: true,
      });
    } catch (error) {
      console.error('Erreur lors de la connexion:', error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await storage.deleteItem('auth_token');  // Supprimer le token localement
      setAuthState({
        isLoading: false,
        isAuthenticated: false,
      });
      console.log('Déconnexion réussie');
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