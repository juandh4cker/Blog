import { useAuth, useNav } from '.';
import { apiLogout } from '../api';

export const useLogout = () => {
  const { navLogout, navWelcome } = useNav();
  const { auth, setAuth } = useAuth();

  const clearAuth = () => {
    localStorage.clear();
    setAuth({ username: "", isAuthenticated: null });
  }

  const logout = async () => {
    if (!auth.isAuthenticated) {
      clearAuth();
      navWelcome();
      return;
    }

    apiLogout()
      .catch((error) => {
        console.error('Error logging out:', error);
      })
      .finally(() => {
        clearAuth();
        navLogout();
      });
  }

  return logout;
};