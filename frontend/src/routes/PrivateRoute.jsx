import { Navigate, Outlet } from 'react-router-dom';

import { useAuth } from '../hooks/useAuth';

import Message from '../components/tags/Message';

const PrivateRoute = () => {
  const { session } = useAuth();

  if (session.isAuthenticated === null) {
    return <Message loading={true}/>;
  }

  return session.isAuthenticated ? <Outlet /> : <Navigate to='/logout' />;
};

export default PrivateRoute;