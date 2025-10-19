import { useContext } from 'react';
import { ConfigContext } from '@/context/ConfigContext';

export const useConfig = () => {
  const { language, setLanguage, theme, setTheme } = useContext(ConfigContext);

  return {
    language,
    setLanguage,
    theme,
    setTheme,
  };
};
