import { useState } from 'react';
import { Outlet } from 'react-router-dom';

import { useNav, useAuth } from '@/hooks';
import { Button, Modal, Dropdown } from '@/components';
import { WelcomeForm } from '@/pages/Welcome';

const GuestMenu = () => {
  const [onOpen, setOnOpen] = useState(false);

  return (
    <>
      <Button size="md" onClick={onOpen}>
        {'Acceder'}
      </Button>

      <Modal setOnOpen={setOnOpen}>
        <Modal.Header>Acceder</Modal.Header>
        <WelcomeForm />
      </Modal>
    </>
  );
};

const UserMenu = ({ username, logout }) => {
  const { navBlog, navUser, navDashboard, navConfig } = useNav();

  const items = [
    { key: 'blog', children: 'Blog', props: { onClick: navBlog } },
    { key: 'profile', children: 'Perfil', props: { onClick: () => navUser(username) } },
    { key: 'dashboard', children: 'Dashboard', props: { onClick: navDashboard } },
    { key: 'configuration', children: 'Configuracion', props: { onClick: navConfig } },
    {
      key: 'logout',
      children: 'Cerrar sesión',
      props: { className: 'text-danger', color: 'danger', onClick: logout },
    },
  ];

  return (
    <Dropdown backdrop="blur">
      <Dropdown.Trigger>
        <Button size="md">{'☰ Menú'}</Button>
      </Dropdown.Trigger>

      {items.map((item) => (
        <Dropdown.Item key={item.key} {...item.props}>
          {item.children}
        </Dropdown.Item>
      ))}
    </Dropdown>
  );
};

const Menu = () => {
  const { auth, logout } = useAuth();

  return (
    <>
      <div className="fixed top-5 right-5 z-50">
        {auth.isAuthenticated ? (
          <UserMenu username={auth.username} logout={logout} />
        ) : (
          <GuestMenu />
        )}
      </div>

      <Outlet />
    </>
  );
};

export default Menu;
