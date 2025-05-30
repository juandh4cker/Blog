import { useState, useEffect, useRef } from 'react';
import { useNav } from '../../hooks/useNav';

import { Logout } from '../../auth/logout';

const ItemButton = ({ children, onClick }) => (
  <button
    onClick={onClick}
    className='block w-full px-5 py-2 text-left text-sm border-b border-gray-200 transition-transform hover:bg-gray-100 hover:scale-[1.02]'
  >
    {children}
  </button>
);

const MenuButton = ({ username }) => {
  const menuRef = useRef(null);
  const { nav } = useNav();

  const logout = Logout();

  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleNavigate = (path) => {
    setMenuOpen(false);
    nav(path);
  };

  return (
    <div className='fixed top-5 right-5 z-[1000]' ref={menuRef}>
      <button
        onClick={() => setMenuOpen(prev => !prev)}
        className='px-5 py-2 bg-blue-500 text-white rounded-[10px] text-base transition-transform duration-200 hover:scale-[1.02]'
        aria-expanded={menuOpen}
        aria-label='Menú de usuario'
      >
        {'☰ Menú'}
      </button>
      {menuOpen && (
        <div className='absolute top-full right-0 bg-white/90 shadow-md rounded w-[140px] mt-2 overflow-hidden animate-fade-in'>
          <ItemButton onClick={() => handleNavigate('/blog')}>{'Blog'}</ItemButton>
          <ItemButton onClick={() => handleNavigate(`/user/${username}`)}>{'Perfil'}</ItemButton>
          <ItemButton onClick={() => handleNavigate('/dashboard')}>{'Dashboard'}</ItemButton>
          <ItemButton onClick={logout}>{'Cerrar sesión'}</ItemButton>
        </div>
      )}
    </div>
  );
};

export default MenuButton;