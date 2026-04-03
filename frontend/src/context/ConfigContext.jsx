import { createContext, useEffect, useState } from 'react';
import { getLocalstorage, setLocalstorage } from '@/utils/localstorage';

export const ConfigContext = createContext();

export const ConfigProvider = ({ children }) => {
  const [language, setLang] = useState('en');
  const [theme, setThm] = useState('light');

  const setLanguage = (lang) => {
    setLang(lang);
    setLocalstorage('lang', lang);
  };

  const setTheme = (thm) => {
    setThm(thm);
    setLocalstorage('theme', thm);
  };

  useEffect(() => {
    const actualLang = getLocalstorage('lang');
    const browserLang = navigator.language.slice(0, 2);
    setLanguage(actualLang ? actualLang : browserLang);

    const actualTheme = getLocalstorage('theme');
    const prefersDark =
      window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    setTheme(actualTheme ? actualTheme : prefersDark ? 'dark' : 'light');
  }, []);

  return (
    <ConfigContext.Provider value={{ language, setLanguage, theme, setTheme }}>
      {children}
    </ConfigContext.Provider>
  );
};
