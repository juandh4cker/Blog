import { useEffect, useState } from 'react';
import { Outlet } from 'react-router-dom';

import { useAuth, useLogout } from '../hooks';

import { Message } from '../components/ui';

const PrivateRoute = () => {
  const { auth } = useAuth();
  const logout = useLogout();

  const [loggingOut, setLoggingOut] = useState(false);

  useEffect(() => {
    if (auth.isAuthenticated === false && !loggingOut) {
      setLoggingOut(true);
      logout();
    }
  }, [auth.isAuthenticated, logout, loggingOut]);

  if (auth.isAuthenticated === null || loggingOut) {
    return <Message loading={true} />;
  }
  
  if (!auth.isAuthenticated) {
   return null;
  }

  return <Outlet />;
};

export default PrivateRoute;
