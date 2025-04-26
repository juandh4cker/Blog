import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getLocalStorage, verifyToken } from './ApiService';

const AuthChecker = ({ children }) => {
  const navigate = useNavigate();

  useEffect(() => {
    const token = getLocalStorage();

    if (token) {
      verifyToken()
        .then(isValid => {
          if (!isValid) {
            localStorage.clear();
            navigate('/logout');
          }
        })
        .catch(() => {
          localStorage.clear();
          navigate('/logout');
        });

    }
  }, [navigate]);

  return <>{children}</>;
};

export default AuthChecker;