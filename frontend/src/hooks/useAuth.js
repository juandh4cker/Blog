import { useContext } from 'react';

import { AuthContext } from '@/context/AuthContext';

export const useAuth = () => useContext(AuthContext);

//poner layout por ruta y por auth
//Poner SEO (titulo, descripcion, meta, ETC)
