import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const ItemButton = ({ children, onClick }) => {
  return (
    <button 
      onClick={onClick} 
      className="block w-full px-5 py-2 text-left text-sm border-b border-gray-200 transition-transform hover:bg-gray-100 hover:scale-[1.02]"
    >
      {children}
    </button>
  );
};

const MenuButton = ({ username }) => {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleNavigate = path => {
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

  return (
    <div className="fixed top-5 right-5 z-[1000]">
      <button 
        onClick={() => setMenuOpen(!menuOpen)} 
        className="px-5 py-2 bg-blue-500 text-white rounded-[10px] text-base transition-transform duration-200 hover:scale-[1.02]"
      >
        ☰ Menú
      </button>
      {menuOpen && (
        <div className="absolute top-full right-0 bg-white/90 shadow-md rounded w-[130px] mt-1 overflow-hidden">
          <ItemButton onClick={() => handleNavigate('/dashboard')}>Dashboard</ItemButton>
          <ItemButton onClick={() => handleNavigate('/blog')}>Blog</ItemButton>
          <ItemButton onClick={handleProfile}>Perfil</ItemButton>
          <ItemButton onClick={() => navigate('/logout')}>Cerrar sesión</ItemButton>
        </div>
      )}
    </div>
  );
};

export default MenuButton;