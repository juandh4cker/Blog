import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

import { useSession } from './SessionContext';

import { verifyToken } from './ApiService';

import MenuButton from './menuButton/MenuButton';

const AuthChecker = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const { session, setSession } = useSession();

  const publicRoutes = ['/login', '/register', '/logout', '/lp'];

  const isPublicRoute = publicRoutes.some(route =>
    location.pathname.toLowerCase().startsWith(route)

  );

  const sharedRoutes = ['/blog'];

  const isSharedRoute = sharedRoutes.some(route =>
    location.pathname.toLowerCase().startsWith(route)
  );

  useEffect(() => {
    if (isPublicRoute) return;

    verifyToken()
      .then(isValid => {
        if (!isValid && !isSharedRoute) {
          navigate('/logout');
          setSession({ username: "", isAuthenticated: false })

        } else if (!isValid && isSharedRoute) {
          setSession({ username: "", isAuthenticated: false })

        } else {
          setSession({ username: isValid, isAuthenticated: true })

        }
      })
      .catch(() => {
        navigate('/logout');
      });
  }, [location.pathname, navigate, isPublicRoute]);

  return (
    <>
      {children}
      {session.isAuthenticated && <MenuButton />}
    </>
  );
};

export default AuthChecker;
