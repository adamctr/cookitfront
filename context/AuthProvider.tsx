import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import { Platform } from "react-native";
import * as SecureStore from "expo-secure-store";
import AsyncStorage from "@react-native-async-storage/async-storage";
import type { AuthContextType, AuthProviderProps } from "interfaces/auth";
import { jwtDecode } from "jwt-decode";

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

// Méthodes de stockage universelles
const storage = {
  setItem: async (key: string, value: string) => {
    if (Platform.OS === "web") {
      await AsyncStorage.setItem(key, value);
    } else {
      await SecureStore.setItemAsync(key, value);
    }
  },
  getItem: async (key: string) => {
    return Platform.OS === "web"
      ? await AsyncStorage.getItem(key)
      : await SecureStore.getItemAsync(key);
  },
  deleteItem: async (key: string) => {
    if (Platform.OS === "web") {
      await AsyncStorage.removeItem(key);
    } else {
      await SecureStore.deleteItemAsync(key);
    }
  },
};

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [authState, setAuthState] = useState({
    isLoading: true,
    isAuthenticated: false,
    userId: null as number | null, // Assurez-vous que userId peut être null
  });

  const isValidToken = (token: string) => {
    return token && token.split(".").length === 3;
  };

  const checkAuthToken = useCallback(async () => {
    try {
      const token = await storage.getItem("auth_token");

      if (token && isValidToken(token)) {
        try {
          console.log("try");
          const decoded = jwtDecode<{ id_user?: number }>(token);
          setAuthState({
            isLoading: false,
            isAuthenticated: true,
            userId: decoded.id_user ?? null,
          });
          console.log("authState-try", authState);
        } catch (decodeError) {
          console.error("Erreur de décodage du token:", decodeError);
          setAuthState({
            isLoading: false,
            isAuthenticated: false,
            userId: null,
          });
        }
      } else {
        console.log("No token");
        setAuthState({
          isLoading: false,
          isAuthenticated: false,
          userId: null,
        });
      }
    } catch (error) {
      console.log("catch4");

      console.error("Erreur de vérification du token:", error);
      setAuthState({ isLoading: false, isAuthenticated: false, userId: null });
    }
  }, []);

  useEffect(() => {
    checkAuthToken();
  }, [checkAuthToken]);

  const login = async (token: string) => {
    try {
      if (!isValidToken(token)) {
        throw new Error("Token invalide");
      }

      await storage.setItem("auth_token", token);
      // Extraire le userId du token

      const decoded = jwtDecode<{ id_user?: number }>(token);
      console.log("decoded", decoded);
      console.log("decoded userid", decoded.id_user);

      setAuthState({
        isLoading: false,
        isAuthenticated: true,
        userId: decoded.id_user ?? null,
      });

      console.log("authState-login", authState);
    } catch (error) {
      console.error("Erreur lors de la connexion:", error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await storage.deleteItem("auth_token"); // Supprimer le token localement
      setAuthState({
        isLoading: false,
        isAuthenticated: false,
        userId: null,
      });
      console.log("Déconnexion réussie");
    } catch (error) {
      console.error("Erreur lors de la déconnexion:", error);
    }
  };

  return (
    <AuthContext.Provider value={{ ...authState, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
