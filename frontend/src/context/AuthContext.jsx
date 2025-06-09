import { useState, createContext, useCallback } from 'react';
import { useMutation } from '@tanstack/react-query';

import { useNav } from '@/hooks/useNav';
import { apiLogout } from '@/api';

const defaultAuth = { username: '', isAuthenticated: null };

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState(defaultAuth);
  const { navLogout, navWelcome } = useNav();

  const clearAuth = () => {
    localStorage.clear();
    setAuth(defaultAuth);
  };

  const logoutMutation = useMutation({
    mutationFn: apiLogout,
    onSettled: () => {
      clearAuth();
      navLogout();
    },
    onError: (error) => {
      console.error('Logout error:', error);
    }
  });

  const logout = useCallback(() => {
    if (!auth.isAuthenticated) {
      clearAuth();
      navWelcome();
      return;
    }

    logoutMutation.mutate();
  }, [auth.isAuthenticated, logoutMutation, navWelcome]);

  return (
    <AuthContext.Provider value={{ auth, setAuth, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
