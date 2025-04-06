import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { authService } from '@/services/authService';
import buddyBotWebSocketService from '@/services/buddyBotWebSocketService';

interface AuthResponse {
  token: string;
  user?: {
    id: string;
    email: string;
    username: string;
  };
}

interface AuthContextType {
  isLoggedIn: boolean;
  login: (email: string, password: string) => Promise<AuthResponse>;
  register: (email: string, password: string, username: string) => Promise<AuthResponse>;
  logout: () => void;
  updateLoginStatus: (status: boolean) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Check if login is disabled via environment variable
const isLoginDisabled = import.meta.env.VITE_DISABLE_LOGIN === 'true';

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);

  // Load initial login state when component mounts
  useEffect(() => {
    // Check if user is logged in from session storage on mount
    const loggedInStatus = sessionStorage.getItem('isLoggedIn') === 'true';
    console.log('AuthProvider initialized with login status:', loggedInStatus || isLoginDisabled);
    setIsLoggedIn(loggedInStatus || isLoginDisabled);

    // If logged in, connect WebSocket
    if (loggedInStatus) {
      initializeWebSocket();
    }

    // Cleanup WebSocket on unmount
    return () => {
      buddyBotWebSocketService.disconnect();
    };
  }, []);

  // Add watcher for isLoggedIn changes
  useEffect(() => {
    console.log('AuthContext - isLoggedIn state updated to:', isLoggedIn);
  }, [isLoggedIn]);

  const initializeWebSocket = async () => {
    const token = authService.getToken();
    console.log('Initializing WebSocket with token:', !!token);
    
    if (token) {
      try {
        await buddyBotWebSocketService.connect();
        buddyBotWebSocketService.authenticate(token);
        console.log('WebSocket initialized and authenticated');
      } catch (error) {
        console.error('WebSocket initialization failed:', error);
      }
    }
  };

  const login = async (email: string, password: string) => {
    try {
      console.log('AuthContext: Starting login process');
      const response = await authService.login({ email, password });
      console.log('AuthContext: Login successful, updating state');
      setIsLoggedIn(true);
      await initializeWebSocket();
      return response;
    } catch (error) {
      console.error('AuthContext: Login failed:', error);
      throw error;
    }
  };

  const register = async (email: string, password: string, username: string) => {
    try {
      console.log('AuthContext: Starting registration process');
      const response = await authService.register({ email, password, username });
      console.log('AuthContext: Registration successful, updating state');
      setIsLoggedIn(true);
      await initializeWebSocket();
      return response;
    } catch (error) {
      console.error('AuthContext: Registration failed:', error);
      throw error;
    }
  };

  const logout = () => {
    console.log('AuthContext: Logging out');
    authService.logout();
    setIsLoggedIn(false);
    console.log('AuthContext: Logged out, state updated');
  };

  const updateLoginStatus = (status: boolean) => {
    console.log('AuthContext: Manually updating login status to:', status);
    setIsLoggedIn(status);
  };

  return (
    <AuthContext.Provider
      value={{
        isLoggedIn,
        login,
        register,
        logout,
        updateLoginStatus
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}; 