import { useState } from 'react';

import { useNav, useAuth } from '@/hooks';
import { Button, Modal } from '@/components/ui';
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

  const menuItems = [
    {onClick: navBlog, key:"blog", text: 'Blog', props: {}},
    {onClick: () => navUser(username), key:"profile", text: 'Perfil', props: {}},
    {onClick: navDashboard, key:"dashboard", text: 'Dashboard', props: {}},
    {onClick: navConfig, key:"configuration", text: 'Configuracion', props: {}},
    {onClick: logout, key:"logout", text: 'Cerrar sesión', props: {className: 'text-danger', color:'danger'}}, 
  ]

  return (
    <div className={menuStyle}>
      <Button variant="dropdown"  
        backdrop="blur"
        triggerProps={{size:'md', color:'primary', variant:'solid'}}
        triggerContent={'☰ Menú'}
        items={menuItems}
      />
    </div>
  );
};