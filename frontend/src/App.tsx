import { BrowserRouter as Router } from 'react-router-dom';
import { FC } from 'react';

import AppContext from './context/AppContext';
import AppRoutes from './routes/AppRoutes';

import './App.css';

const App: FC = () => {
  return (
    <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <AppContext>
        <AppRoutes />
      </AppContext>
    </Router>
  );
};

export default App;

// Layout para titulo, subtitulo y contenido
// Esqueleto a los loading y luego poner el container en background
// POner SEO
// Responsive en todo
// factor a estilos
{
  ('Frontend');
}
{
  ('animaciones, estilos, modo oscuro, todo eso de css');
}
{
  ('https://million.dev/');
}

{
  ('codigo de strings');
}
{
  ('agregar español e ingles');
}

{
  ('Backend');
}
{
  ('Redis en cache');
}
{
  ('pasar users a sql?');
}

{
  ('Ambos');
}
{
  ('Roles de usurario (admin, moderador, normal, baneado, suspendido)');
}
{
  ('Buscar post');
}

{
  ('Poner varias fotos o videos en el post y guardarlas localmente');
}
{
  ('Ocultar comentarios en posts, configuacion de posts');
}

{
  ('Configuracion funcional');
}
{
  ('session context (idioma, preferencias, tema, etc)');
}

{
  ('codigo de errores, useError');
}

{
  ('Configurar formatter con prettier');
}
{
  ('Configuracion de empaquetado docker, base de datos con datos previos');
}

{
  /*
Layouts en rutas → definen layouts distintos (ejemplo: AdminLayout, PublicLayout) y los aplican en la definición de rutas.

Lazy loading (code splitting) → usan React.lazy + Suspense para cargar páginas bajo demanda.

Nested routes → usan Outlet para agrupar secciones.

Permisos granulares → en lugar de solo roles, a veces definen scopes o permissions (['CAN_EDIT_POST', 'CAN_DELETE_USER']).

Meta info → cada ruta suele tener título, icono, breadcrumb, etc., que el sistema usa para el menú, la barra superior o el SEO.

  */
}
