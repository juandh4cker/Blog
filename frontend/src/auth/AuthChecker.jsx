import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

import { useAuth, useLogout } from '../hooks';
import { apiCheckToken } from '../api';

import { UserMenu, GuestMenu } from '../components/Menu';

const AuthChecker = ({ children }) => {
  const location = useLocation();
  const logout = useLogout();

  const { auth, setAuth } = useAuth();

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
          setAuth({ username: '', isAuthenticated: false });
          if (!isSharedRoute) {
            logout();
          };

        } else {
          setAuth({ username: isValid, isAuthenticated: true });
        }
      })
      .catch(() => {
        logout();
      });
  }, [location.pathname, isPublicRoute]);

  return (
    <>
      {children}
      {auth.isAuthenticated ? <UserMenu username={auth.username}/> : (isSharedRoute ? <GuestMenu /> : <></>)} 
    </>
  );
};

export default AuthChecker;