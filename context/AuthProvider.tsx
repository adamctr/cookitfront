// context/AuthProvider.tsx
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
// Importez SecureStore uniquement si vous en avez besoin
import * as SecureStore from 'expo-secure-store';
import type { AuthContextType, AuthProviderProps } from 'interfaces/auth';

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [authState, setAuthState] = useState<{
    isLoading: boolean;
    isAuthenticated: boolean;
  }>({
    isLoading: true,
    isAuthenticated: false,
  });

  // Fonction de vérification du token au démarrage
  const checkAuthToken = useCallback(async () => {
    try {
      const token = await SecureStore.getItemAsync('auth_token');
      console.log('Token récupéré:', token);
      setAuthState({
        isLoading: false,
        isAuthenticated: !!token,
      });
    } catch (error) {
      console.error('Erreur dans checkAuthToken:', error);
      setAuthState(prev => ({
        ...prev,
        isLoading: false,
      }));
    }
  }, []);

  useEffect(() => {
    checkAuthToken();
  }, [checkAuthToken]);

  // Pour le test, retirez ou commentez l'utilisation de SecureStore
  const login = async (token: string) => {
    console.log('login appelé avec token:', token);
    // Test sans SecureStore : mettez directement à jour l'état
    // await SecureStore.setItemAsync('auth_token', token);
    setAuthState({
      isLoading: false,
      isAuthenticated: true,
    });
    console.log('isAuthenticated mis à true');
  };

  const logout = async () => {
    // await SecureStore.deleteItemAsync('auth_token');
    setAuthState({
      isLoading: false,
      isAuthenticated: false,
    });
    console.log('logout appelé, isAuthenticated mis à false');
  };

  return (
    <AuthContext.Provider
      value={{
        ...authState,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
