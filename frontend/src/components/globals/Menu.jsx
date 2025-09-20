import { useState } from 'react';

import { useNav, useAuth } from '@/hooks';
import { Button, Modal, Dropdown } from '@/components';
import { WelcomeForm } from '@/pages/Welcome';

const menuStyle = 'fixed top-5 right-5 z-50';

export const GuestMenu = () => {
  const [ onOpen, setOnOpen ] = useState(false);

  return (
    <div className={menuStyle}>
      <Button size='md' onClick={onOpen} className={menuStyle}>
        {'Acceder'}
      </Button>

      <Modal setOnOpen={setOnOpen}>
        <Modal.Header>Acceder</Modal.Header>
        <WelcomeForm />
      </Modal>
    </div>
  );
};

export const UserMenu = ({ username }) => {
  const { logout } = useAuth();
  const { navBlog, navUser, navDashboard, navConfig } = useNav();

  const items = [
    {key:"blog", children: 'Blog', props: {onClick: navBlog}},
    {key:"profile", children: 'Perfil', props: {onClick: () => navUser(username)}},
    {key:"dashboard", children: 'Dashboard', props: {onClick: navDashboard}},
    {key:"configuration", children: 'Configuracion', props: {onClick: navConfig}},
    {key:"logout", children: 'Cerrar sesión', props: { className: 'text-danger', color:'danger', onClick: logout }},
  ]

  return (
    <div className={menuStyle}>
      <Dropdown backdrop='blur'>
        <Dropdown.Trigger>
          <Button size='md' >{'☰ Menú'}</Button>
        </Dropdown.Trigger>

        {items.map(item => (
          <Dropdown.Item key={item.key} {...item.props}>{item.children}</Dropdown.Item>
        ))}
      </Dropdown>
    </div>
  );
};