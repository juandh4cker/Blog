import { useEffect } from 'react';
import { useTitleContext } from '@/context/TitleContext';

export const useTitle = (customTitle, customDescription, options = {}) => {
  const { setTitle, setDescription, resetToRouteDefault } = useTitleContext();

  const { resetOnUnmount = true, enableRouteDefaults = true } = options;

  useEffect(() => {
    if (enableRouteDefaults) {
      resetToRouteDefault();
    }

    return () => {
      if (resetOnUnmount && enableRouteDefaults) {
        resetToRouteDefault();
      }
    };
  }, [enableRouteDefaults, resetOnUnmount, resetToRouteDefault]);

  // Actualización directa sin timeout
  useEffect(() => {
    if (typeof customTitle === 'string') {
      setTitle(customTitle);
    }

    if (typeof customDescription === 'string') {
      setDescription(customDescription);
    }
  }, [customTitle, customDescription, setTitle, setDescription]);

  return {
    setTitle,
    setDescription,
    resetToRouteDefault,
  };
};
