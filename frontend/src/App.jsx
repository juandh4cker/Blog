import { BrowserRouter as Router } from 'react-router-dom';

import { AppContext } from './context/AppContext';

import AppRoutes from './routes/AppRoutes';
import AuthChecker from './auth/AuthChecker';

import Fondo from './components/Fondo';

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

{"Metodos de api protegidos por auth / react query"}
{"Cambiar nombres"}
{"Hook de mensajes flotantes (para errores o mensajes)"}
{"ponerle aria"}
{"Configurar formatter con prettier"}

export default App;