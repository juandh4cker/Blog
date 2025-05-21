import { BrowserRouter as Router } from 'react-router-dom';

import { SessionProvider } from './context/SessionContext';
import { TitleProvider } from './context/TitleContext'

import Fondo from './components/basics/Fondo';

import AppRoutes from './routes/AppRoutes';
import AuthChecker from './auth/AuthChecker';

import './App.css';

const App = () => {
  return (
    <SessionProvider>
      <TitleProvider>
        <Router basename="/Blog">
          <AuthChecker>
            <AppRoutes />
          </AuthChecker>
          <Fondo />
        </Router>
      </TitleProvider>
    </SessionProvider>
  );
};

export default App;