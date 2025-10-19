import { Routes, Route } from 'react-router-dom';

import { useAuth } from '@/hooks';
import { Background, Error, Loading } from '@/components';

import { routes } from './routes';

const AppRoutes = () => {
  const { auth } = useAuth();

  const canAccess = (routeAuth) => {
    if (!routeAuth || routeAuth.includes('all')) return true;
    if (routeAuth.includes('private')) return auth.isAuthenticated;
    if (routeAuth.includes('guest')) return !auth.isAuthenticated;

    return routeAuth.includes(auth.role);
  };

  const renderRoutes = (routesArray) =>
    routesArray.map((route) => {
      const { key, element, path, children, auth: routeAuth } = route;

      if (!canAccess(routeAuth)) {
        if (auth.isAuthenticated === null) {
          return <Route key={key} path={path} element={<Loading />} />;
        }

        return (
          <Route
            key={key}
            path={path}
            element={<Error page>{'No tienes permiso para estar aquí'}</Error>}
          />
        );
      }

      return (
        <Route key={key} path={path} element={element}>
          {children && renderRoutes(children)}
        </Route>
      );
    });

  return (
    <Routes>
      <Route element={<Background />}>{renderRoutes(routes)}</Route>
    </Routes>
  );
};

export default AppRoutes;
