import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import useAuth from '../hooks/useAuth';

import { appLogout } from '../api/auth';

import Message from '../components/tags/Message';

const Logout = () => {
  const navigate = useNavigate();
  const { setSession } = useAuth();

  useEffect(() => {
    const handleLogout = async () => {
      try {
        await appLogout();

      } catch (error) {
        console.error('Error logging out:', error);

      } finally {
        localStorage.clear();
        setSession({ username: "", isAuthenticated: null })
        navigate('/welcome', { replace: true });

      }
    };

    handleLogout();
  }, [navigate]);

  return <Message loading={true}/>;
};

export default Logout;