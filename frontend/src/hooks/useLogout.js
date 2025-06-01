import { useAuth, useNav } from '.';
import { apiLogout } from '../api';

export const useLogout = () => {
  const { navLogout, navWelcome } = useNav();
  const { session, setSession } = useAuth();

  const clearSession = () => {
    localStorage.clear();
    setSession({ username: "", isAuthenticated: null });
  }

  const logout = async () => {
    if (!session.isAuthenticated) {
      clearSession();
      navWelcome();
      return;
    }

    apiLogout()
      .catch((error) => {
        console.error('Error logging out:', error);
      })
      .finally(() => {
        clearSession();
        navLogout();
      });
  }

  return logout;
};