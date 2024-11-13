import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './styles/menuButton.css';  // Importar los estilos desde el archivo CSS

const MenuButton = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleNavigate = (path) => {
    setMenuOpen(false); // Cerrar el menú al navegar
    navigate(path);
  };

  const handleLogout = () => {
    setMenuOpen(false);
    localStorage.removeItem('user'); // Eliminar el token de autenticación o lo que uses
    navigate('/login'); // Redirigir al login
  };

  const handleProfile = () => {
    const user = JSON.parse(localStorage.getItem('user')); // Obtener el usuario del localStorage
    if (user && user.id) {
      navigate(`/perfil/${user.id}`); // Redirigir al perfil del usuario usando el id
    } else {
      alert('Usuario no encontrado');
    }
  };

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
