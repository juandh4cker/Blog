import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import './MenuButton.css';

const MenuButton = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem('user'));

  const handleNavigate = (path) => {
    setMenuOpen(false);
    navigate(path);
  };

  const handleLogout = () => {
    setMenuOpen(false);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    navigate('/login');
  };

  const handleProfile = () => {
    if (user) {
      navigate(`/perfil/${user.username}`);
    } else {
      alert('Usuario no encontrado');
    }
  };

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
