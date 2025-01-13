import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import './MenuButton.css';

const MenuButton = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem('user')); // Verifica si el usuario está en localStorage

  const handleNavigate = (path) => {
    setMenuOpen(false);
    navigate(path);
  };

  const handleLogout = () => {
    setMenuOpen(false);
    localStorage.removeItem('user'); // Elimina el usuario del localStorage
    navigate('/login'); // Redirige al login
  };

  const handleProfile = () => {
    if (user && user.id) {
      navigate(`/perfil/${user.id}`);
    } else {
      alert('Usuario no encontrado');
    }
  };

  // Si el usuario no está logueado, no renderiza el menú
  if (!user) {
    return null;
  }

  return (
    <div className="menu-container">
      <button onClick={() => setMenuOpen(!menuOpen)} className="menu-button">
        ☰ Menú
      </button>
      {menuOpen && (
        <div className="menu">
          <button onClick={() => handleNavigate('/dashboard')} className="menu-item">
            Dashboard
          </button>
          <button onClick={() => handleNavigate('/blog')} className="menu-item">
            Blog
          </button>
          <button onClick={handleProfile} className="menu-item">
            Perfil
          </button>
          <button onClick={handleLogout} className="menu-item">
            Cerrar sesión
          </button>
        </div>
      )}
    </div>
  );
};

export default MenuButton;
