import { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { verifyToken } from './ApiService';

const PrivateRoute = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await verifyToken();
        setIsAuthenticated(response.verify);
      } catch (error) {
        console.error("Error verifying token:", error);
        setIsAuthenticated(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  if (isLoading) {
    return <div>Loading...</div>; // Agregar pantalla de carga o algo así
  }

  return isAuthenticated ? children : <Navigate to="/login" />;
};

export default PrivateRoute;