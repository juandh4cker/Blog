import { useEffect } from 'react';

import { useAuth, useLogout, useNav } from '@/hooks';
import { apiCheckToken } from '@/api';

import { UserMenu, GuestMenu } from '@/components/globals/Menu';

const AuthChecker = ({ children }) => {
  const { pathname } = useNav();
  const logout = useLogout();

  const { auth, setAuth } = useAuth();

  const publicRoutes = ['/welcome'];
  const isPublicRoute = publicRoutes.some(route =>
    pathname.toLowerCase().startsWith(route)
  );

  const sharedRoutes = ['/blog'];
  const isSharedRoute = sharedRoutes.some(route =>
    pathname.toLowerCase().startsWith(route)
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
  }, [pathname, isPublicRoute]);

  return (
    <>
      {children}
      {auth.isAuthenticated ? <UserMenu username={auth.username}/> : (isSharedRoute ? <GuestMenu /> : <></>)} 
    </>
  );
};

export default AuthChecker;