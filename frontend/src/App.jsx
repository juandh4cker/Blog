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

{'Frontend'}
{'useStyle o algo asi'}
{"hero UI"}
{'animaciones, estilos, modo oscuro, todo eso de css'}

{'codigo de strings'}
{'agregar español e ingles'}

{'Backend'}
{'Redis en cache'}
{'pasar users a sql?'}

{'Ambos'}
{'Roles de usurario (admin, moderador, normal, baneado, suspendido)'}
{'Buscar post'}

{'Poner varias fotos o videos en el post y guardarlas localmente'}
{'Ocultar comentarios en posts, configuacion de posts'}

{'Configuracion funcional'}
{'session context (idioma, preferencias, tema, etc)'}

{'codigo de errores, useError'}

{'Configurar formatter con prettier'}
{'Configuracion de empaquetado docker, base de datos con datos previos'}

export default App;