import { useState } from 'react';
import { useConfig } from '@/hooks/useConfig';
import { Button, Container, Text, Tabs, Input } from '@/components';

import { FaMoon, FaSun } from 'react-icons/fa';

const PageItem = ({ title, description, children }) => {
  return (
    <Container isBlurred shadow="sm" className="w-full">
      <Container.Body className="flex flex-row justify-between items-center w-full">
        <div className="w-2/3 flex flex-col justify-center items-start gap-2">
          <Text>{title}</Text>
          <Text kind="subtitle">{description}</Text>
        </div>
        <div className="w-1/3 flex justify-end">{children}</div>
      </Container.Body>
    </Container>
  );
};

//Pages

const General = () => {
  const { language, setLanguage, theme, setTheme } = useConfig();

  const languageOptions = [
    { key: 'Español', label: 'Español' },
    { key: 'English', label: 'English' },
    { key: 'Français', label: 'Français' },
  ];

  return (
    <>
      <PageItem title="Modo oscuro" description={'Activar el modo oscuro'}>
        <Button
          kind="switch"
          defaultSelected={theme === 'dark'}
          onChange={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          startContent={<FaSun size={15} />}
          endContent={<FaMoon size={15} />}
          size="lg"
        />
      </PageItem>
      <PageItem title="Idioma" description="Selecciona el idioma de la aplicación">
        <Input
          label="Select an language"
          kind="autocomplete"
          items={languageOptions}
          defaultSelectedKey={language}
          onSelectionChange={setLanguage}
          isRequired={false}
          outForm={true}
        >
          {(item) => <Input.Item key={item.key}>{item.label}</Input.Item>}
        </Input>
      </PageItem>
    </>
  );
};

const Cuenta = () => {
  const [likesPublic, setLikesPublic] = useState(true);

  return (
    <>
      <PageItem
        title="Visibilidad de likes"
        description={`${likesPublic ? 'Oculta' : 'Muestra'} a los demas tus likes`}
      >
        <Button
          kind="switch"
          defaultSelected={likesPublic}
          onChange={() => setLikesPublic(!likesPublic)}
        />
      </PageItem>
      <PageItem title="Editar perfil" description="Cambia la descripción o los datos de tu perfil">
        <Button onClick={() => alert('No implementado')}>Editar</Button>
      </PageItem>
      <PageItem title="Cambiar contraseña" description="Cambia la cpntraseña">
        <Button onClick={() => alert('No implementado')}>Cambiar</Button>
      </PageItem>
      <PageItem title="Eliminar perfil" description="Elimina tu perfil">
        <Button onClick={() => alert('No implementado')}>Eliminar</Button>
      </PageItem>
    </>
  );
};

//Config
const ConfigPage = () => {
  const [page, setPage] = useState('General');

  const pages = [
    { key: 'General', title: 'General', children: <General /> },
    { key: 'Cuenta', title: 'Cuenta', children: <Cuenta /> },
  ];

  return (
    <Container kind="background" className="max-w-3xl">
      <Text kind="title">{page}</Text>

      <div className="flex flex-col justify-between w-full">
        <Tabs
          aria-label="Options"
          items={pages}
          selectedKey={page}
          onSelectionChange={setPage}
          isVertical
          size="lg"
        >
          {(item) => (
            <Tabs.Tab
              title={item.title}
              className="flex flex-col justify-between w-full"
              key={item.key}
            >
              <Container
                disableBody
                isBlurred
                className="flex flex-col justify-between w-full gap-4 p-6"
              >
                {item.children}
              </Container>
            </Tabs.Tab>
          )}
        </Tabs>
      </div>
    </Container>
  );
};

export default ConfigPage;
