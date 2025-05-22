import { useContext, useEffect } from 'react';
import { TitleContext } from '../context/TitleContext';

export const useTitle = (newTitle, newDescription) => {
  const { title, setTitle, setDescription } = useContext(TitleContext);

  useEffect(() => {
    if (typeof newTitle === 'string') {
      setTitle(newTitle);
    }
    
    if (typeof newDescription === 'string') {
      setDescription(newDescription);
    }
  }, [newTitle, newDescription, setTitle, setDescription]);

  return { title, setTitle, setDescription };
};