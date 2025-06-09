import { useState, createContext, useCallback } from 'react';
import { useNav } from '@/hooks/useNav';
import { apiLogout } from '@/api';

const defaultAuth = { username: '', isAuthenticated: null };

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState(defaultAuth);
  const { navLogout, navWelcome } = useNav();

  const logout = useCallback(async () => {
    const clearAuth = () => {
      localStorage.clear();
      setAuth(defaultAuth);
    }

    if (!auth.isAuthenticated) {
      clearAuth();
      navWelcome();
      return;
    }

    apiLogout()
      .catch(console.error)
      .finally(() => {
        clearAuth();
        navLogout();
      });
  }, [auth, navLogout, navWelcome]);

  return (
    <AuthContext.Provider value={{ auth, setAuth, logout }}>
      {children}
    </AuthContext.Provider>
  );
};