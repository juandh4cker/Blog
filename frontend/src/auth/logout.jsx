import { useAuth, useNav } from '../hooks';
import { apiLogout } from '../api';

export const Logout = () => {
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