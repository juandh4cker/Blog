import { useState, useEffect, useRef } from 'react';
import { useNav, useAuth } from '@/hooks';

const menuStyle = 'fixed top-5 right-5 z-[1000]'
const menuButtonStyle = `
  px-5 py-2 bg-blue-500 text-white rounded-[10px]
  text-base transition-transform duration-200 hover:scale-[1.02]
`.trim();

const MenuItem = ({ children, onClick }) => (
  <button
    onClick={onClick}
    className='block w-full px-5 py-2 text-left text-sm
      border-b border-gray-200 transition-transform
      hover:bg-gray-100 hover:scale-[1.02]'
  >
    {children}
  </button>
);

export const GuestMenu = () => {
  const { navWelcome } = useNav();

  return (
    <button
      onClick={navWelcome}
      className={`${menuStyle} ${menuButtonStyle}`}
      aria-label='Iniciar sesión'
    >
      {'Iniciar sesión'}
    </button>
  );
};

export const UserMenu = ({ username }) => {
  const menuRef = useRef(null);
  const { navBlog, navUser, navDashboard } = useNav();

  const { logout } = useAuth();

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

  const handleNav = (navigate) => {
    setMenuOpen(false);
    navigate();
  };

  return (
    <div className={menuStyle} ref={menuRef}>
      <button
        onClick={() => setMenuOpen(prev => !prev)}
        className={menuButtonStyle}
        aria-expanded={menuOpen}
        aria-label='Menú de usuario'
      >
        {'☰ Menú'}
      </button>
      {menuOpen && (
        <div className='absolute top-full right-0 bg-white/90 shadow-md rounded w-[140px] mt-2 overflow-hidden animate-fade-in'>
          <MenuItem onClick={() => handleNav(navBlog)}>{'Blog'}</MenuItem>
          <MenuItem onClick={() => handleNav(() => navUser(username))}>{'Perfil'}</MenuItem>
          <MenuItem onClick={() => handleNav(navDashboard)}>{'Dashboard'}</MenuItem>
          <MenuItem onClick={() => handleNav(logout)}>{'Cerrar sesión'}</MenuItem>
        </div>
      )}
    </div>
  );
};