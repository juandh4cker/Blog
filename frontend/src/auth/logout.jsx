import { useEffect } from 'react';

import { useAuth } from '../hooks/useAuth';
import { useNav } from '../hooks/useNav';
import { apiLogout } from '../api/auth';

import Message from '../components/tags/Message';

const Logout = () => {
  const { navWelcome } = useNav();
  const { session, setSession } = useAuth();

  const clearSession = () => {
    localStorage.clear();
    setSession({ username: "", isAuthenticated: null });
    navWelcome();
  }

  useEffect(() => {    
    if (!session.isAuthenticated) {
      clearSession();
      return;
    }

    apiLogout()
      .catch((error) => {
        console.error('Error logging out:', error);
      })
      .finally(() => {
        clearSession();
      });
  }, [setSession]);

  return <Message loading={true} />;
};

export default Logout;