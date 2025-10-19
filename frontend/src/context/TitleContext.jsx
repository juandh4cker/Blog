import { createContext, useState, useContext, useEffect } from 'react';
import { Helmet, HelmetProvider } from 'react-helmet-async';
import { useLocation } from 'react-router-dom';

const DEFAULT_TITLE = 'WorldBlog';
const DEFAULT_DESCRIPTION = 'Esto es WorldBlog, un blog de destinos turísticos';

const ROUTE_CONFIG = {
  '/': {
    title: 'Blog',
    description: 'Descubre los mejores destinos turísticos del mundo',
  },
  '/welcome': {
    title: 'Inicio',
    description: 'Inicia sesión o registrate',
  },
  '/dashboard': {
    title: 'Dashboard',
    description: 'Agrega un post',
  },
  '/user/*': {
    title: '', // Dejar vacío para que el componente lo llene
    description: 'Perfil de usuario',
  },
};

export const TitleContext = createContext();

export const TitleProvider = ({ children }) => {
  const [title, setTitle] = useState(DEFAULT_TITLE);
  const [description, setDescription] = useState(DEFAULT_DESCRIPTION);
  const location = useLocation();
  const [customOverride, setCustomOverride] = useState(false);

  const findRouteConfig = (path) => {
    if (ROUTE_CONFIG[path]) return ROUTE_CONFIG[path];

    const pathSegments = path.split('/').filter(Boolean);

    for (let i = pathSegments.length; i > 0; i--) {
      const testPath = `/${pathSegments.slice(0, i).join('/')}/*`;
      if (ROUTE_CONFIG[testPath]) return ROUTE_CONFIG[testPath];
    }

    // Modificado: devolver título vacío en lugar de DEFAULT_TITLE
    return { title: '', description: DEFAULT_DESCRIPTION };
  };

  useEffect(() => {
    if (!customOverride) {
      const routeConfig = findRouteConfig(location.pathname);
      setTitle(routeConfig.title);
      setDescription(routeConfig.description);
    }
  }, [location, customOverride]);

  const value = {
    title,
    description,
    setTitle: (newTitle) => {
      setCustomOverride(true);
      setTitle(newTitle);
    },
    setDescription: (newDesc) => {
      setCustomOverride(true);
      setDescription(newDesc);
    },
    resetToRouteDefault: () => {
      const routeConfig = findRouteConfig(location.pathname);
      setTitle(routeConfig.title);
      setDescription(routeConfig.description);
      setCustomOverride(false);
    },
  };

  return (
    <HelmetProvider>
      <TitleContext.Provider value={value}>
        <Helmet>
          <title>{title ? `${title} - ${DEFAULT_TITLE}` : DEFAULT_TITLE}</title>
          <meta name="description" content={description} />
        </Helmet>
        {children}
      </TitleContext.Provider>
    </HelmetProvider>
  );
};

export const useTitleContext = () => {
  const context = useContext(TitleContext);
  if (!context) throw new Error('useTitleContext must be used within a TitleProvider');
  return context;
};
