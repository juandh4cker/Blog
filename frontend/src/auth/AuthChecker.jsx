import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

import { useAuth, useLogout } from '../hooks';
import { apiCheckToken } from '../api';

import { MenuButton, LoginButton } from '../components/MenuButton';

const AuthChecker = ({ children }) => {
  const location = useLocation();
  const logout = useLogout();

  const { session, setSession } = useAuth();

  const publicRoutes = ['/welcome'];
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
            logout();
          };

        } else {
          setSession({ username: isValid, isAuthenticated: true });
        }
      })
      .catch(() => {
        logout();
      });
  }, [location.pathname, isPublicRoute]);

  return (
    <>
      {children}
      {session.isAuthenticated ? <MenuButton username={session.username}/> : (isSharedRoute ? <LoginButton /> : <></>)} 
    </>
  );
};

export default AuthChecker;