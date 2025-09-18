import { useEffect } from 'react';

import { useAuth, useNav } from '@/hooks';
import { apiCheckToken } from '@/api';

import { UserMenu, GuestMenu } from '@/componentes';

const AuthChecker = ({ children }) => {
  const { pathname } = useNav();
  const { auth, setAuth, logout } = useAuth();

  const publicRoutes = ['/welcome', '/xd']; //OJO
  const isPublicRoute = publicRoutes.some(route =>
    pathname.toLowerCase().startsWith(route)
  );

  const sharedRoutes = [];
  const isSharedRoute = sharedRoutes.some(route =>
    pathname.toLowerCase().startsWith(route)
  ) || pathname === '/';

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
        setAuth({ username: '', isAuthenticated: false });
        logout();
      });
  }, [pathname, isPublicRoute]);

  return (
    <>
      {children}
      {auth.isAuthenticated
        ? <UserMenu username={auth.username}/>
        : (isSharedRoute
          ? <GuestMenu />
          : <></>
        )
      }
    </>
  );
};

export default AuthChecker;