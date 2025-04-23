import { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { getLocalStorage } from './ApiService';

const PrivateRoute = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const username = getLocalStorage();
        setIsAuthenticated(username !== null);

      } catch (error) {
        setIsAuthenticated(false);

      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return isAuthenticated ? children : <Navigate to="/logout" />;
};

export default PrivateRoute;