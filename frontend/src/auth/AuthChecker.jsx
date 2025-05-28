import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

import { useAuth } from '../hooks/useAuth';
import { useNav } from '../hooks/useNav';

import { apiCheckToken } from '../api/auth';

import MenuButton from '../components/basics/MenuButton';

const AuthChecker = ({ children }) => {
  const { navLogout } = useNav();
  const location = useLocation();

  const { session, setSession } = useAuth();

  const publicRoutes = ['/welcome', '/logout'];
  const isPublicRoute = publicRoutes.some(route =>
    location.pathname.toLowerCase().startsWith(route)
  );

  const sharedRoutes = ['/blog'];
  const isSharedRoute = sharedRoutes.some(route =>
    location.pathname.toLowerCase().startsWith(route)
  );

  useEffect(() => {
    if (isPublicRoute) return;

    apiCheckToken()
      .then(isValid => {
        if (!isValid) {
          setSession({ username: '', isAuthenticated: false });
          if (!isSharedRoute) {
            navLogout();
          };

        } else {
          setSession({ username: isValid, isAuthenticated: true });
        }
      })
      .catch(() => {
        navLogout();
      });
  }, [location.pathname, isPublicRoute]);

  return (
    <>
      {children}
      {session.isAuthenticated && <MenuButton username={session.username} />}
    </>
  );
};

export default AuthChecker;