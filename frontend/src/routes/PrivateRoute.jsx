import { useEffect, useState } from 'react';
import { Outlet } from 'react-router-dom';

import { useAuth } from '@/hooks';
import { Loading } from '@/componentes';

const PrivateRoute = () => {
  const { auth, logout } = useAuth();
  const [loggingOut, setLoggingOut] = useState(false);

  useEffect(() => {
    if (auth.isAuthenticated === false && !loggingOut) {
      setLoggingOut(true);
      logout();
    }
  }, [auth.isAuthenticated, logout, loggingOut]);

  if (auth.isAuthenticated === null || loggingOut) {
    return <Loading />;
  }

  if (!auth.isAuthenticated) {
   return null;
  }

  return <Outlet />;
};

export default PrivateRoute;
