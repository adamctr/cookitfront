export type AuthContextType = {
    isLoading: boolean;
    isAuthenticated: boolean;
    login: (token: string) => Promise<void>;
    logout: () => Promise<void>;
  };
  
  export type AuthProviderProps = {
    children: React.ReactNode;
  };