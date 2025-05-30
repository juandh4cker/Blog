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

{"Hook de mensajes flotantes (para errores o mensajes)"}
{"Mejorar input"}
{"Configurar formatter con prettier"}

export default App;