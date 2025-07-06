import { useState } from 'react';
import { useConfig } from '@/hooks/useConfig';
import { Button, Container, Select, Text, Toggle } from '@/components/ui'

// Items
const PageItem = ({ title, description, children }) => {
  return (
    <div className="flex flex-col md:flex-row justify-between items-center py-4 border-b border-gray-200">
      <div className="mb-3 md:mb-0 md:w-2/3">
        <Text className="font-medium text-gray-900">{title}</Text>
        <Text variant='subtitle' className="!text-sm mt-1">{description}</Text>
      </div>
      <div className="w-full md:w-1/3 flex justify-end">
        {children}
      </div>
    </div>
  );
};

//Pages

const General = () => {
  const { language, setLanguage, theme, setTheme } = useConfig();

  const languageOptions = {
  es: 'Español',
  en: 'English',
  fr: 'Français',
};

  return (
    <>
      <PageItem title='Modo oscuro' description={`${theme === 'dark' ? 'Desactivar' : 'Activar'} el modo oscuro`}>
        <Toggle enabled={theme === 'dark'} onChange={() => setTheme(theme === 'dark' ? 'light' : 'dark')} />
      </PageItem>
      <PageItem title='Idioma' description='Selecciona el idioma de la aplicación'>
        <Select value={language} set={setLanguage} options={languageOptions} />
      </PageItem>
    </>
  )
}

const Cuenta = () => {
  const [ likesPublic, setLikesPublic ] = useState(true)

  return (
    <>
      <PageItem title='Visibilidad de likes' description={`${likesPublic ? 'Oculta' : 'Muestra'} a los demas tus likes`}>
        <Toggle enabled={likesPublic} onChange={() => setLikesPublic(!likesPublic)} />
      </PageItem>
      <PageItem title='Editar perfil' description='Cambia la descripción o los datos de tu perfil'>
        <Button variant='small' onClick={() => alert("No implementado")}>Editar</Button>
      </PageItem>
      <PageItem title='Cambiar contraseña' description='Cambia la cpntraseña'>
        <Button variant='small' onClick={() => alert("No implementado")}>Cambiar</Button>
      </PageItem>
      <PageItem title='Eliminar perfil' description='Elimina tu perfil'>
        <Button variant='alert' onClick={() => alert("No implementado")}>Eliminar</Button>
      </PageItem>
    </>
  )
}

//Config
const ConfigPage = () => {
  const [ page, setPage ] = useState('General');

  const pages = [
    { id: 'General', icon: '⚙️', component: <General />},
    { id: 'Cuenta', icon: '👤', component: <Cuenta />}
  ];
  
  return (
    <Container className='max-w-3xl'>
      <Text variant='title'>{'Configuración'}</Text>

      <div className='flex flex-row justify-start w-full'>
        <nav className="space-y-1 m-2 w-1/4">
          {pages.map((p) => (
            <button
              key={p.id}
              onClick={() => setPage(p.id)}
              className={`w-full flex items-center px-4 py-3 text-sm font-medium rounded-md transition-colors ${
                page === p.id
                  ? 'bg-blue-100 text-blue-700'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <span className="mr-3 text-lg">{p.icon}</span>
              {p.id}
            </button>
          ))}
        </nav>
        <div className="w-full md:w-3/4">
          <div className="bg-[rgba(255,255,255,0.75)] shadow-[0_4px_20px_rgba(0,0,0,0.1)]
                        border w-full gap-4 mb-5 rounded-md border-solid
                        border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-800 flex items-center pb-4 border-b border-gray-200">
              <span className="mr-2">{pages.find(p => p.id === page)?.icon}</span>
              {page}
            </h2>
            <div className="space-y-4">
              {pages.find(p => p.id === page)?.component}
            </div>
          </div>
        </div>
      </div>
    </Container>
  )
}

export default ConfigPage;