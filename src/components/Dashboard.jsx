import React from 'react';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const navigate = useNavigate();

  // Simular autenticación verificando si hay un usuario en localStorage
  const user = JSON.parse(localStorage.getItem('user'));

  if (!user) {
    navigate('/login');
    return null; // No renderiza nada mientras redirige
  }

  return (
    <div>
      <h1>Bienvenido, {user.name}</h1>
      <button onClick={() => {
        localStorage.removeItem('user');
        navigate('/login');
      }}>Cerrar sesión</button>
    </div>
  );
};

export default Dashboard;
