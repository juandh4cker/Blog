import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { getLocalStorage } from '../ApiService';

import './MenuButton.css';

const MenuButton = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const username = getLocalStorage('username');
  const navigate = useNavigate();

  const handleNavigate = (path) => {
    setMenuOpen(false);
    navigate(path);
  };

  const handleProfile = () => {
    if (username) {
      handleNavigate(`/user/${username}`);

    } else {
      navigate('/logout');
    }
  };

  if (!username) {
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
          <button onClick={() => navigate('/logout')} className="menu-item">
            Cerrar sesión
          </button>
        </div>
      )}
    </div>
  );
};

export default MenuButton;
