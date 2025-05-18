import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';

import { SessionProvider } from './components/useful/SessionContext';

import Fondo from './components/useful/fondo/Fondo';
import MenuButton from './components/useful/menuButton/MenuButton';
import AppRoutes from './components/useful/AppRoutes';
import AuthChecker from './components/useful/AuthChecker';

import './App.css';

const App = () => {
  return (
    <SessionProvider>
      <Router basename="/Blog">
        <AuthChecker>
          <AppRoutes />
        </AuthChecker>
        <Fondo />
      </Router>
    </SessionProvider>
  );
};

export default App;
