import { createContext, useState } from 'react';
import { Helmet, HelmetProvider } from 'react-helmet-async';

export const TitleContext = createContext();

export const TitleProvider = ({ children }) => {
  const [title, setTitle] = useState('WorldBlog');
  const [description, setDescription] = useState('Esto es WorldBlog, un blog de destinos turísticos');

  return (
    <HelmetProvider>
      <TitleContext.Provider value={{ setTitle, setDescription }}>
        <Helmet>
          <title>{title.trim() ? `${title} - WorldBlog` : 'WorldBlog'}</title>
          <meta name="description" content={description} />
        </Helmet>
        {children}
      </TitleContext.Provider>
    </HelmetProvider>
  );
};
