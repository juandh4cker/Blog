import { useEffect } from 'react';
import { useTitleContext } from '@/context/TitleContext';

export const useTitle = (customTitle, customDescription, options = {}) => {
  const {
    title,
    description,
    setTitle,
    setDescription,
    resetToRouteDefault
  } = useTitleContext();
  
  const {
    resetOnUnmount = true,
    enableRouteDefaults = true
  } = options;

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

  useEffect(() => {
    let isActive = true;
    
    const updateTitle = () => {
      if (!isActive) return;
      
      if (typeof customTitle === 'string') {
        setTitle(customTitle);
      }
      
      if (typeof customDescription === 'string') {
        setDescription(customDescription);
      }
    };
    
    const timer = setTimeout(updateTitle, 10);
    
    return () => {
      isActive = false;
      clearTimeout(timer);
    };
  }, [customTitle, customDescription, setTitle, setDescription]);

  return {
    title,
    setTitle,
    description,
    setDescription,
    resetToRouteDefault
  };
};