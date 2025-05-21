import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

import { useAuth } from '../hooks/useAuth';

import { verifyToken } from '../api/auth';

import MenuButton from '../components/basics/MenuButton';

const AuthChecker = ({ children }) => {
  const navigate = useNavigate();
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

    verifyToken()
      .then(isValid => {
        if (!isValid) {
          setSession({ username: "", isAuthenticated: false });
          if (!isSharedRoute) {
            navigate("/logout")
          };

        } else {
          setSession({ username: isValid, isAuthenticated: true });
          
        }
      })
      .catch(() => {
        navigate('/logout');

      });
  }, [location.pathname, navigate, isPublicRoute]);

  return (
    <>
      {children}
      {session.isAuthenticated && <MenuButton username={session.username} />}
    </>
  );
};

export default AuthChecker;