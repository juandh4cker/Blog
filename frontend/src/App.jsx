import { BrowserRouter as Router } from 'react-router-dom';

import { AppContext } from './context/AppContext';

import AppRoutes from './routes/AppRoutes';
import AuthChecker from './auth/AuthChecker';

import Background from './components/globals/Background';

import './App.css';

const App = () => {
  return (
    <AppContext>
      <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true, }}>
        <AuthChecker>
          <AppRoutes />
        </AuthChecker>
        <Background />
      </Router>
    </AppContext>
  );
};

{"Titulo cambie automaticamente"}
{"Hook de mensajes flotantes (para errores o mensajes)"}
{"ponerle aria y MUI"}
{"Configurar formatter con prettier"}

export default App;