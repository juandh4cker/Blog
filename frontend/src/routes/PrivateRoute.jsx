import { useEffect, useState } from 'react';
import { Outlet } from 'react-router-dom';

import { useAuth, useLogout } from '../hooks';

import { Message } from '../components/ui';

const PrivateRoute = () => {
  const { session } = useAuth();
  const logout = useLogout();

  const [loggingOut, setLoggingOut] = useState(false);

  useEffect(() => {
    if (session.isAuthenticated === false && !loggingOut) {
      setLoggingOut(true);
      logout();
    }
  }, [session.isAuthenticated, logout, loggingOut]);

  if (session.isAuthenticated === null || loggingOut) {
    return <Message loading={true} />;
  }
  
  if (!session.isAuthenticated) {
   return null;
  }

  return <Outlet />;
};

export default PrivateRoute;
