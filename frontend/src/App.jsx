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

{'codigo de strings'}
{'agregar español e ingles'}
{'session context (idioma, preferencias, tema, etc)'}
{'pasar users a sql?'}
{'codigo de errores, useError'}
{'animaciones, estilos, modo oscuro, todo eso de css'}
{'Configurar formatter con prettier'}

export default App;