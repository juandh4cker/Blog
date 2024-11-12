import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const MenuButton = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleNavigate = (path) => {
    setMenuOpen(false); // Cerrar el menú al navegar
    navigate(path);
  };

  const handleLogout = () => {
    setMenuOpen(false);
    localStorage.removeItem('authToken'); // Eliminar el token de autenticación o lo que uses
    navigate('/login'); // Redirigir al login
  };

  return (
    <div style={{ position: 'relative', display: 'inline-block' }}>
      <button onClick={() => setMenuOpen(!menuOpen)} style={buttonStyle}>
        ☰ Menú
      </button>
      {menuOpen && (
        <div style={menuStyle}>
          <button onClick={() => handleNavigate('/dashboard')} style={menuItemStyle}>
            Dashboard
          </button>
          <button onClick={() => handleNavigate('/blog')} style={menuItemStyle}>
            Blog
          </button>
          <button onClick={() => handleNavigate('/profile')} style={menuItemStyle}>
            Perfil
          </button>
          <button onClick={handleLogout} style={menuItemStyle}>
            Cerrar sesión
          </button>
        </div>
      )}
    </div>
  );
};

// Estilos en línea para mayor simplicidad
const buttonStyle = {
  padding: '10px 20px',
  background: '#007BFF',
  color: '#fff',
  border: 'none',
  borderRadius: '5px',
  cursor: 'pointer',
};

const menuStyle = {
  position: 'absolute',
  top: '100%',
  right: '0',
  background: '#fff',
  boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
  borderRadius: '5px',
  overflow: 'hidden',
  zIndex: '1000',
};

const menuItemStyle = {
  display: 'block',
  width: '100%',
  padding: '10px 20px',
  background: 'none',
  border: 'none',
  textAlign: 'left',
  cursor: 'pointer',
  borderBottom: '1px solid #eee',
};

export default MenuButton;
