import { BrowserRouter as Router } from 'react-router-dom';

import AppContext from './context/AppContext';
import AppRoutes from './routes/AppRoutes';
import AuthChecker from './auth/AuthChecker';

import Background from './components/globals/Background';

import './App.css';

const App = () => {
  return (
    <>
      <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true, }}>
        <AppContext>
          <AuthChecker>
            <AppRoutes />
          </AuthChecker>
        </AppContext>
      </Router>
      <Background />
    </>
  );
};

{'mejorar react query en user y post (quitar use effect) (de pronto es algo con las keys)'}
{'react query en authcontext y authchecker y luego useApi'}
{'mejorar definicion de funciones'}
{'Titulo cambie automaticamente'}
{'Hook de mensajes flotantes (para errores o mensajes)'}
{'ponerle aria y MUI'}
{'Configurar formatter con prettier'}

export default App;