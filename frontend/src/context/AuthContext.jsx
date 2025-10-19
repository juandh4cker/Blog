import { useState, useEffect, createContext } from 'react';
import { useMutation } from '@tanstack/react-query';

import { useNav } from '@/hooks';
import { apiLogout, apiCheckToken } from '@/api';

const publicRoutes = ['/welcome'];
const sharedRoutes = ['/'];

const defaultAuth = { username: '', isAuthenticated: null, role: 'guest' };
const loggedOutAuth = { username: '', isAuthenticated: false, role: 'guest' };

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState(defaultAuth);
  const { pathname, navWelcome } = useNav();

  const clearAuth = () => {
    localStorage.clear();
    setAuth(defaultAuth);
  };

  const logoutMutation = useMutation({
    mutationFn: () => {
      if (!auth.isAuthenticated) {
        clearAuth();
        navWelcome();
        return null;
      }
      return apiLogout();
    },
    onError: (error) => {
      console.error('Logout error:', error);
    },
    onSettled: () => {
      clearAuth();
      navWelcome();
    },
  });

  const logout = logoutMutation.mutate;

  const isPublicRoute = publicRoutes.some((route) => pathname.toLowerCase().startsWith(route));

  const isSharedRoute = sharedRoutes.some((route) =>
    route === '/' ? pathname === '/' : pathname.toLowerCase().startsWith(route),
  );

  useEffect(() => {
    if (isPublicRoute) return;

    apiCheckToken()
      .then((isValid) => {
        if (!isValid) {
          setAuth(loggedOutAuth);
          if (!isSharedRoute) {
            logout();
          }
        } else {
          setAuth({ username: isValid, isAuthenticated: true, role: 'user' });
        }
      })
      .catch(() => {
        setAuth(loggedOutAuth);
        logout();
      });
  }, [pathname, logout]);

  return <AuthContext.Provider value={{ auth, setAuth, logout }}>{children}</AuthContext.Provider>;
};
