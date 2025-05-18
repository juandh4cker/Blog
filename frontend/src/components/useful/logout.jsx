import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiRequest } from './ApiService';
import { useSession } from './SessionContext';

const Logout = () => {
  const navigate = useNavigate();
  const { setSession } = useSession();

  useEffect(() => {
    const handleLogout = async () => {
      try {
        await apiRequest('app/logout', 'POST');
      } catch (error) {
        console.error('Error logging out:', error);
      } finally {
        localStorage.clear();
        setSession({ username: "", isAuthenticated: false })
        navigate('/login', { replace: true });
      }
    };

    handleLogout();
  }, [navigate]);

  return <div>Cerrando sesión...</div>;
};

export default Logout;
