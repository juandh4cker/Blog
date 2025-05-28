import { BrowserRouter as Router } from 'react-router-dom';

import { AppContext } from './context/AppContext';

import AppRoutes from './routes/AppRoutes';
import AuthChecker from './auth/AuthChecker';

import Fondo from './components/basics/Fondo';

import './App.css';

const App = () => {
  return (
    <AppContext>
      <Router basename="/Blog">
        <AuthChecker>
          <AppRoutes />
        </AuthChecker>
        <Fondo />
      </Router>
    </AppContext>
  );
};

{"Mejorar input"}
{"Que vs code use comillas simples por defecto en los imports"}
{"Aprender expresiones regulares"}
{"Logout un hook"}
{"Unir los hooks, en un export, lo mismo tags y api y schema"}
{"Hook de mensajes flotantes (para errores o mensajes)"}
{"Menu de iniciar sesion o registrarse si no se esta registrado"}
{"Si intenta entrar a un post o perfil sin estar registrado una ventana flotante que lo mande a registar y al hacerlo llevarlo a la ultima ubicacion"}

export default App;