import { Navigate } from 'react-router-dom';
import { useSession } from './SessionContext';

const PrivateRoute = ({ children }) => {
  const { session } = useSession();

  if (session.isAuthenticated === null) {
    return <div>Cargando...</div>;
  }

  return session.isAuthenticated ? children : <Navigate to="/logout" />;
};

export default PrivateRoute;
